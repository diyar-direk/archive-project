import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import { baseURL, Context } from "../../context/context";
import { useCookies } from "react-cookie";

const LoginForm = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const [, setCookie] = useCookies(["archive_cookie"]);
  const navigate = useNavigate();

  const handleCaptcha = (value) => {
    if (value) setCaptchaVerified(true);
    error && setError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      setError("Please verify the CAPTCHA.");
      return;
    }

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
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setError("wrong username or password");
      } else setError("network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      {loading && <Loading />}
      <div className="login-box">
        <div className="login-title">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Enter username
            </label>
            <input
              required
              type="text"
              id="email"
              className="form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Enter password
            </label>
            <input
              required
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="captcha">
            <ReCAPTCHA
              sitekey="6Lfwf5cqAAAAADOoNDVACW1IGhwg16vYHCATSmKL"
              onChange={handleCaptcha}
            />
          </div>
          {error && <p className="error"> {error} </p>}
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
