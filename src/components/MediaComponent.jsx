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
        const response = await axios.get(`${mediaURL}${src}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        });

        const imageBlob = URL.createObjectURL(response.data);
        setImageUrl(imageBlob);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();
  }, []);

  return imageUrl ? (
    type === "video" ? (
      <video draggable={false} {...props} src={imageUrl} controls></video>
    ) : type === "image" ? (
      <img
        draggable={false}
        loading="lazy"
        {...props}
        src={imageUrl}
        alt={alt}
      />
    ) : type === "audio" ? (
      <audio draggable={false} src={imageUrl} controls {...props}></audio>
    ) : type === "pdf" ? (
      <iframe src={imageUrl}></iframe>
    ) : (
      <iframe hidden src={imageUrl}></iframe>
    )
  ) : showUserIcon ? (
    <i className="fa-solid fa-user photo"></i>
  ) : (
    <p>Loading...</p>
  );
}

export default memo(MediaComponent);
