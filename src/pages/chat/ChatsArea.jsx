import { useState, useCallback, useRef, useEffect, useContext } from "react";
import "./chat.css";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import ChatSideBar from "./ChatSideBar";
import useLanguage from "../../hooks/useLanguage";
const ChatArea = () => {
  const { id } = useParams();
  const [canSubmit, setCanSubmit] = useState(false);
  const context = useContext(Context);
  const { token } = context?.userDetails;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [controller, setController] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const getChat = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseURL}/ai_chat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(data.messages);
      setCanSubmit(true);
    } catch (error) {
      console.log(error);
    }
  }, [id, token]);

  useEffect(() => {
    getChat();
  }, [getChat]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const cleanMessage = (text) => {
    return text
      .replace(/<\|.*?\|>/g, " ")
      .replace(/analysis.*?(?=AI:|$)/gs, " ")
      .replace(/#+\s?/g, "")
      .replace(/\*\*/g, "")
      .replace(/assistant/gi, " ")
      .replace(/user asked.*?:/gi, "")
      .replace(/\s+/g, " ");
  };

  const buildPrompt = (history, newMessage) => {
    return [...history, { sender: "user", content: newMessage }]
      .map((msg) => `${msg.sender === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n");
  };

  const createMessage = useCallback(
    async (message, sender) => {
      try {
        await axios.post(
          `${baseURL}/ai_chat/message`,
          { chatId: id, content: message, sender: sender },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    [token, id]
  );

  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;
    setCanSubmit(false);
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    const currentMessage = message;
    setMessage("");
    let finalResponse = "";
    let start = false;
    setError(false);
    let hasError = false;
    let aborted = false;

    try {
      const newController = new AbortController();
      setController(newController);
      setIsStreaming(true);

      const response = await fetch("http://192.168.1.150:1234/v1/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          prompt: buildPrompt(messages, currentMessage),
          stream: true,
        }),
        signal: newController.signal,
      });

      if (!response.body) {
        console.error("No stream body");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setMessages((prev) => [...prev, { sender: "ai", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk
          .split("\n")
          .filter((line) => line.trim().startsWith("data:"));

        for (const line of lines) {
          if (line.includes("[DONE]")) continue;

          if (line.includes("<|channel|>final<|message|>")) {
            start = true;
            continue;
          }
          if (start) {
            try {
              const json = JSON.parse(line.replace("data: ", ""));
              const token = json.choices?.[0]?.text || "";
              const cleanToken = cleanMessage(token);
              finalResponse += cleanToken;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + cleanToken,
                };
                return updated;
              });
            } catch (err) {
              console.error("Error parsing line:", line, err);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        aborted = true;
        console.log("Stream aborted by user");
      } else {
        console.error("Error sending message:", error);
        hasError = true;
        setError(true);
      }
    }

    if (!hasError || aborted) {
      await createMessage(currentMessage, "user");
      await createMessage(finalResponse, "ai");
    }

    setIsStreaming(false);
    setController(null);
    setCanSubmit(true);
  }, [message, messages, createMessage]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!canSubmit) return;
      sendMessage();
    },
    [sendMessage, canSubmit]
  );

  const handleCopy = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("تم نسخ الرسالة!");
      })
      .catch(() => {
        alert("فشل النسخ!");
      });
  }, []);
  const [isClosed, setIsClosed] = useState(false);
  const toggleSideBar = useCallback((e) => {
    e.stopPropagation();
    setIsClosed((prev) => !prev);
  }, []);
  const { language } = useLanguage();

  return (
    <>
      <section
        className={`center flex-direction gap-20 chat-area relative ${
          isClosed ? "closed" : ""
        }`}
      >
        <div className="messages w-100 flex-1">
          {messages.map((msg, idx) => {
            const isAI = msg.sender === "ai";

            return (
              <div key={idx} className={isAI ? "ai-msg" : "user-msg"}>
                {!isAI && <h3>{language?.ai_chat?.you} </h3>}

                {isAI ? (
                  msg.content.includes("<") && msg.content.includes(">") ? (
                    <pre
                      style={{ whiteSpace: "pre-wrap" }}
                      className="message-text"
                    >
                      {msg.content.replace(/<br\s*\/?>/gi, "\n")}
                      <i
                        className="fa-solid fa-copy copy-message"
                        onClick={() => handleCopy(msg.content)}
                        title="copy"
                      />
                    </pre>
                  ) : (
                    <div className="ai-html message-text">
                      {parse(DOMPurify.sanitize(msg.content))}
                      <i
                        className="fa-solid fa-copy copy-message"
                        onClick={() => handleCopy(msg.content)}
                        title="copy"
                      />
                    </div>
                  )
                ) : (
                  <pre
                    style={{ whiteSpace: "pre-wrap", margin: 0 }}
                    className="message-text"
                  >
                    {msg.content}
                  </pre>
                )}
              </div>
            );
          })}
          {error && (
            <h3 className="error-text">some error , please try agin later</h3>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="ai-form-container">
          <form onSubmit={handleSubmit} className="center">
            <textarea
              className="ai-input"
              placeholder={language?.ai_chat?.ask}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {isStreaming ? (
              <button
                type="button"
                className="stop-btn"
                onClick={() => controller?.abort()}
              >
                <i className="fa-solid fa-stop" />
              </button>
            ) : (
              <button type="submit" disabled={!canSubmit}>
                <i className="fa-solid fa-paper-plane" />
              </button>
            )}
          </form>
        </div>
      </section>
      <ChatSideBar
        isClosed={isClosed}
        toggleSideBar={toggleSideBar}
        setIsClosed={setIsClosed}
      />
    </>
  );
};

export default ChatArea;
