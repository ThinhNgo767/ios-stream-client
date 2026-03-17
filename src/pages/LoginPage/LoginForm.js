import "./LoginForm.css";
import AuthContext from "../../contexts/AuthContext/AuthContext";

import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [hidePass, setHidePass] = useState(false);

  const { handleSubmitLogin, error } = useContext(AuthContext);

  const location = useLocation();
  const path = location.pathname;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHidePass = (e) => {
    e.preventDefault();
    setHidePass((prev) => !prev);
  };

  const { username, password } = formData;

  return (
    <div className="container-login">
      <div className="box" id="box">
        <div className="form">
          <form
            id="signIn"
            onSubmit={(e) => handleSubmitLogin(e, username, password, path)}
          >
            <h2>Sign in</h2>

            <div className="inputBox">
              <input
                type="text"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <span>Username</span>
              <i></i>
            </div>

            <div className="inputBox inputBoxPass">
              <input
                type={hidePass ? "text" : "password"}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span>Password</span>
              <i></i>
              <p className="hiddenShow" onClick={(e) => handleHidePass(e)}>
                {hidePass ? <AiFillEye /> : <AiFillEyeInvisible />}
              </p>
            </div>
            <div className="submitBox">
              {error && <small>{error}</small>}
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
