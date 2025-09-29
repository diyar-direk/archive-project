import { useState, useCallback, useRef, useEffect } from "react";
import "./chat.css";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
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
    return [...history, { role: "user", content: newMessage }]
      .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
      .join("\n");
  };

  const sendMessage = useCallback(async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    const currentMessage = message;
    setMessage("");

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
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

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
    }
  }, [message, messages]);

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

  return (
    <section className="center flex-direction gap-20 chat-area relative">
      {messages?.length === 0 && <h1>what can i help you with</h1>}
      <div className="messages w-100">
        {messages.map((msg, idx) => {
          const isAI = msg.role === "ai";

          return (
            <div key={idx} className={isAI ? "ai-msg" : "user-msg"}>
              {!isAI && <h3>you</h3>}

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

      <div className={`${messages?.length > 0 ? "has-message" : ""} w-100`}>
        <form onSubmit={handleSubmit} className={`center`}>
          <input
            type="text"
            className="ai-input"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">
            <i className="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatArea;
