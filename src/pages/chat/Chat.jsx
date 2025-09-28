import { useState, useCallback } from "react";
import "./chat.css";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const cleanMessage = (text) => {
    return text
      .replace(/<\|.*?\|>/g, " ")
      .replace(/analysis.*?(?=assistant)/s, " ")
      .replace(/assistant/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const sendMessage = useCallback(async () => {
    setReply("");

    try {
      const response = await fetch("http://192.168.0.176:1234/v1/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          prompt: message,
          stream: true,
        }),
      });

      if (!response.body) {
        console.error("No stream body");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

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

            fullText += cleanToken;

            setReply((prev) => prev + cleanToken);
          } catch (err) {
            console.error("Error parsing line:", line, err);
          }
        }
      }

      console.log("Final reply:", fullText);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  return (
    <section className="center flex-direction gap-20 chat-area">
      <h1>What can I help you with?</h1>
      <p>{reply}</p>
      <form onSubmit={handleSubmit} className="center">
        <input
          type="text"
          className="ai-input"
          placeholder="Ask about anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button type="submit">
          <i className="fa-solid fa-paper-plane" />
        </button>
      </form>
    </section>
  );
};

export default Chat;
