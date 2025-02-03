import { useContext, useEffect, useState } from "react";
import { baseURL, Context } from "../context/context";

function StreamComponent() {
  const [data, setData] = useState("");
  const context = useContext(Context);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${baseURL}/backup`, {
        method: "POST",
        headers: { Authorization: "Bearer " + context.userDetails.token },
      });
      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let receivedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        receivedText += decoder.decode(value, { stream: true });
        // setData((prev) => prev + decoder.decode(value, { stream: true }));
        document.querySelector("h3.test").innerHTML = decoder.decode(value, {
          stream: true,
        });
      }
    };

    fetchData();
  }, []);

  return <h3 className="test"></h3>;
}

export default StreamComponent;
