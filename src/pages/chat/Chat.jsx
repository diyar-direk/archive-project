import { useState, useCallback, useRef, useEffect, useContext } from "react";
import "./chat.css";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import { useNavigate } from "react-router-dom";
import ChatSideBar from "./ChatSideBar";
import useLanguage from "../../hooks/useLanguage";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const nav = useNavigate();
  const context = useContext(Context);
  const { token, _id: userId } = context.userDetails;
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

  const createChat = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${baseURL}/ai_chat`,
        { userId, title: message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { _id: chatId } = data.data;
      await axios.post(
        `${baseURL}/ai_chat/message`,
        { chatId, content: message, sender: "user" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return chatId;
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [token, userId, message]);

  const creatResponeMessage = useCallback(
    async (id, message) => {
      try {
        await axios.post(
          `${baseURL}/ai_chat/message`,
          { chatId: id, content: message, sender: "ai" },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        nav(`${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [token, nav]
  );

  const sendMessage = useCallback(async () => {
    setCanSubmit(false);
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    const currentMessage = message;
    const chatId = await createChat();

    setMessage("");

    let finalResponse = "";

    try {
      const response = await fetch("http://192.168.0.176:1234/v1/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          prompt: buildPrompt(messages, currentMessage),
          stream: true,
        }),
      });

      if (!response.body) {
        console.error("No stream body");
        return null;
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
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
    await creatResponeMessage(chatId, finalResponse);
  }, [message, messages, createChat, creatResponeMessage]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      sendMessage();
    },
    [sendMessage]
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
        {messages?.length === 0 && <h1>{language?.ai_chat?.title} </h1>}
        {messages?.length > 0 && (
          <div className="messages w-100 flex-1">
            {messages.map((msg, idx) => {
              const isAI = msg.sender === "ai";

              return (
                <div key={idx} className={isAI ? "ai-msg" : "user-msg"}>
                  {!isAI && <h3> {language?.ai_chat?.you} </h3>}

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
            <div ref={bottomRef} />
          </div>
        )}

        <div className={`${messages?.length > 0 ? "has-message" : ""} w-100`}>
          <form onSubmit={handleSubmit} className={`center`}>
            <input
              type="text"
              className="ai-input"
              placeholder={language?.ai_chat?.ask}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={!canSubmit}>
              <i className="fa-solid fa-paper-plane" />
            </button>
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

export default Chat;
