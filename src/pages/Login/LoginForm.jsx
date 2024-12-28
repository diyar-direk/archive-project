import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const correctEmail = "a";
  const correctPasswordHash = bcrypt.hashSync("a", 10);

  const handleCaptcha = (value) => {
    if (value) setCaptchaVerified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      alert("Please verify the CAPTCHA.");
      return;
    }

    // تحقق من كلمة المرور بعد فك التشفير
    const isPasswordCorrect = bcrypt.compareSync(password, correctPasswordHash);

    if (email === correctEmail && isPasswordCorrect) {
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-body">
      <div className="login-box">
        <div className="login-title">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Enter email / username
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="Enter email / username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Enter password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="captcha">
            <ReCAPTCHA
              sitekey="6Lfwf5cqAAAAADOoNDVACW1IGhwg16vYHCATSmKL" // ضع مفتاح الموقع هنا
              onChange={handleCaptcha}
            />
          </div>
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
