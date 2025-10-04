import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { baseURL, Context } from "./../../context/context";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import useLanguage from "./../../hooks/useLanguage";

const ChatSideBar = ({ isClosed, toggleSideBar, setIsClosed }) => {
  const context = useContext(Context);
  const { _id: userId, token } = context?.userDetails || {};
  const { id } = useParams();

  const [selectedChat, setSelectedChat] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const observer = useRef(null);
  const [page, setPage] = useState(1);
  const [chats, setChats] = useState([]);
  const nav = useNavigate();

  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${baseURL}/ai_chat?userId=${userId}&limit=10&page=${page}&sort=-createdAt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setChats((prev) => {
          const existingIds = new Set(prev.map((c) => c._id));
          const newChats = (data.data || []).filter(
            (c) => !existingIds.has(c._id)
          );
          return [...prev, ...newChats];
        });

        setHasMore(data.data?.length > 0);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchChats();
    }
  }, [page, token, userId]);
  const { language } = useLanguage();

  useEffect(() => {
    const handleClick = () => selectedChat && setSelectedChat(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [selectedChat]);

  const handleDelete = useCallback(async () => {
    try {
      await axios.delete(`${baseURL}/ai_chat/${selectedChat}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (id) if (selectedChat === id) nav(-1);

      setChats((prev) => {
        const prevChats = [...prev];
        const filterdChat = prevChats.filter(
          (chat) => chat._id !== selectedChat
        );
        return filterdChat;
      });
    } catch (error) {
      console.log(error);
    }

    setSelectedChat(null);
  }, [token, selectedChat, id, nav]);

  useEffect(() => {
    if (window.innerWidth <= 500) {
      setIsClosed(true);
      const handleClick = () => setIsClosed(true);
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }
  }, [setIsClosed]);

  return (
    <>
      {selectedChat && (
        <div className="overlay">
          <div onClick={(e) => e.stopPropagation()}>
            <h1>{language?.table?.are_you_sure_delete}</h1>
            <div className="flex gap-10 wrap">
              <div className="delete-all overlay-btn" onClick={handleDelete}>
                <i className="fa-solid fa-trash"></i> {language?.table?.delete}
              </div>
              <div
                className="delete-all cencel overlay-btn"
                onClick={() => setSelectedChat(null)}
              >
                <i className="fa-solid fa-ban"></i> {language?.table?.cancel}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`chat-sidebar ${isClosed ? "closed" : ""}`}>
        <div>
          <i
            className="fa-solid fa-table-cells-large sidebar-icon"
            onClick={toggleSideBar}
          />
          <Link to="/chat" className="flex gap-10 align-center">
            <i className="fa-regular fa-pen-to-square"></i>
            <span>{language?.ai_chat?.new_chat}</span>
          </Link>
          <h3 className="w-100"> {language?.ai_chat?.chats} </h3>
        </div>

        <article>
          {chats.map((chat, i) => (
            <div
              className="flex gap-10"
              key={chat._id}
              ref={i === chats.length - 1 ? lastElement : null}
            >
              <NavLink to={`/chat/${chat._id}`} className="flex-1">
                {chat.title || `${language?.ai_chat?.chat}-${i}`}
              </NavLink>
              <i
                className="fa-solid fa-trash-can"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedChat(chat._id);
                }}
              />
            </div>
          ))}

          {loading && (
            <>
              <Skeleton width="100%" height={30} className="ai-loading" />
              <Skeleton width="100%" height={30} className="ai-loading" />
              <Skeleton width="100%" height={30} className="ai-loading" />
            </>
          )}
        </article>
      </div>
    </>
  );
};

export default ChatSideBar;
