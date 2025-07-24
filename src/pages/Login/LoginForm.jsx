import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import { useCookies } from "react-cookie";
import useLanguage from "../../hooks/useLanguage";

const LoginForm = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const [, setCookie] = useCookies(["archive_cookie"]);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/Users/login`, form);
      if (res.data.user.active) {
        const token = res.data.token;

        const user = {
          role: res.data.user.role,
          isAdmin: res.data.user.role === "admin",
          username: res.data.user.username,
          token,
          _id: res.data.user._id,
        };
        res.data.user.sectionId && (user.sectionId = res.data.user.sectionId);
        context.setUserDetails(user);
        setCookie("archive_cookie", token);
        navigate("/people");
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setError(language?.login?.incorrect);
      } else if (error.status === 429) {
        setError(language?.login?.too_many);
      } else setError(language?.login?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      {loading && <Loading />}
      <div className="login-box">
        <div className="login-title">{language?.login?.title}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {language?.login?.username}
            </label>
            <input
              required
              type="text"
              id="email"
              className="form-control"
              placeholder={language?.login?.username_placeHolder}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {language?.login?.password}
            </label>
            <input
              required
              type="password"
              id="password"
              className="form-control"
              placeholder={language?.login?.password_placeHolder}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="error"> {error} </p>}
          <button type="submit" className="login-button">
            {language?.login?.login_btn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
