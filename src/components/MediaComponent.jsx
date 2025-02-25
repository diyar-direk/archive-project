import { memo, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context, mediaURL } from "../context/context";

function MediaComponent({ src, alt = "", type, showUserIcon, ...props }) {
  const [imageUrl, setImageUrl] = useState(null);
  const context = useContext(Context);
  const token = context.userDetails.token;

  useEffect(() => {
    const fetchImage = async () => {
      if (typeof src === "object") {
        setImageUrl(URL.createObjectURL(src));
        return;
      }
      try {
        const response = await axios.get(`${mediaURL}/${src}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });

        const imageBlob = URL.createObjectURL(response.data);
        console.log(imageBlob);
        setImageUrl(imageBlob);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchImage();
  }, []);

  return imageUrl ? (
    type === "video" ? (
      <video {...props} src={imageUrl} controls></video>
    ) : type === "image" ? (
      <img loading="lazy" {...props} src={imageUrl} alt={alt} />
    ) : (
      <audio src={imageUrl} controls {...props}></audio>
    )
  ) : showUserIcon ? (
    <i className="fa-solid fa-user photo"></i>
  ) : (
    <p>Loading...</p>
  );
}

export default memo(MediaComponent);
