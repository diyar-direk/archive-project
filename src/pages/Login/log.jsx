import React, { useState } from 'react';
import './Log.css'; // تأكد من استيراد ملف الـ CSS في React

const Login2 = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // يمكنك إضافة منطق تحقق من بيانات الاعتماد هنا
    if (!username || !password) {
      setErrorMessage('Please fill in both fields');
    } else {
      setErrorMessage('');
      // هنا يمكنك تنفيذ عملية تسجيل الدخول
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-md-2"></div>
        <div className="col-lg-6 col-md-8 login-box">
          <div className="col-lg-12 login-key">
            <i className="fa fa-key" aria-hidden="true"></i>
          </div>
          <div className="col-lg-12 login-title">
            ADMIN PANEL
          </div>

          <div className="col-lg-12 login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-control-label">USERNAME</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-control-label">PASSWORD</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              <div className="col-lg-12 loginbttm">
                <div className="col-lg-6 login-btm login-text">
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
                <div className="col-lg-6 login-btm login-button">
                  <button type="submit" className="btn btn-outline-primary">LOGIN</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-3 col-md-2"></div>
      </div>
    </div>
  );
};

export default Login2;

