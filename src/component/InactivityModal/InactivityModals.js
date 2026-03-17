import "./InactivityModal.css";
import ActiveContext from "../../contexts/ActiveContext/ActiveContext";
import AuthContext from "../../contexts/AuthContext/AuthContext";
import { session } from "../../utils/sessionStorageUtils";

import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

function InactivityModals({ children }) {
  const [code, setCode] = useState("");
  const [countIncorrectCode, setCountIncorrectCode] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [incorrect, setIncorrect] = useState(session.get("failed") || false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [notiFail, setNotiFail] = useState("");

  const { auth, handleLogout } = useContext(AuthContext);
  const { isAuthenticated } = auth;
  const {
    showModal,
    checkedStatusActive,
    verifySecurityCode,
    setError,
    setShowModal,
    error,
  } = useContext(ActiveContext);

  const inputRef = useRef(null);
  const timeRef = useRef(null);
  const navigate = useNavigate();

  const failed = session.get("failed");

  useEffect(() => {
    session.set("status", isAuthenticated);
    isAuthenticated && checkedStatusActive();
  }, [checkedStatusActive, isAuthenticated]);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  // useEffect(() => {
  //   if (failed) {
  //     setIncorrect(true);
  //     setCountIncorrectCode(3);
  //     setIsCountingDown(true);
  //     setCountdown(20); // Đặt thời gian đếm ngược ban đầu
  //   }
  // }, [failed]);

  useEffect(() => {
    let timerId;
    if (isCountingDown && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isCountingDown) {
      // Khi đếm ngược về 0, tắt trạng thái đếm và reset lỗi
      setIsCountingDown(false);
      setIncorrect(false);
      setCountIncorrectCode(3); // Reset số lần sai khi đếm ngược xong
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isCountingDown, countdown]);

  useEffect(() => {
    const hadleIncorrectCode = async () => {
      if (countIncorrectCode === 3) {
        setIncorrect(true);

        session.set("failed", incorrect);
        setCountdown(20); // Đặt lại đếm ngược
        setIsCountingDown(true); // Bắt đầu đếm ngược
      }
      if (countIncorrectCode === 5) {
        if (timeRef.current) {
          clearTimeout(timeRef.current);
        }

        setNotiFail(
          "Bạn đã nhập sai mã code quá nhiều lần. Vui lòng đăng nhập lại!",
        );

        timeRef.current = setTimeout(async () => {
          session.remove("failed");
          setIncorrect(false);
          setCountIncorrectCode(0);
          setNotiFail("");
          setError("");
          setShowModal(false);
          session.set("status", false);
          await handleLogout();
          navigate("/");
          return;
        }, 2000);
      }
    };
    hadleIncorrectCode();
  }, [
    countIncorrectCode,
    handleLogout,
    navigate,
    setError,
    setShowModal,
    incorrect,
  ]);

  const handleInputChange = (e) => {
    setError("");
    setCode(e.target.value);
  };

  const hadleSubmitCode = async (e) => {
    e.preventDefault();

    if (!code) {
      return setError("Vui lòng không để trống code hoặc nhập mã code hợp lệ!");
    }
    setError("");
    setNotiFail("");
    try {
      const result = await verifySecurityCode(code);

      if (!result.success) {
        setCountIncorrectCode((prev) => prev + 1);
        setNotiFail(`Ban đã nhập sai mã code ${countIncorrectCode + 1} lần!`);
        setCode("");
        return;
      }
      setCode("");
      setCountIncorrectCode(0);
      session.remove("failed");
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <>
      {showModal ? (
        <div className="inactivity-modal-overlay">
          {incorrect ? (
            <div className="inactivity-modal-content">
              <aside className="content-inactivity">
                <h2 className="notice">Mã bảo mật cung cấp không đúng!</h2>
              </aside>
              <form className="root_flex_column item_start">
                <p className="notice">
                  Bạn đã nhập sai mã code {countIncorrectCode} lần.
                </p>
                <p className="notice">
                  Vui lòng đợi <b>{countdown}s</b> để thử lại.
                </p>
              </form>
            </div>
          ) : (
            <div className="inactivity-modal-content">
              <aside className="content-inactivity">
                <h2>Phiên làm việc tạm dừng</h2>
                <p>Bạn đã không hoạt động trong một thời gian.</p>
                <p>Vui lòng nhập mã bảo mật để tiếp tục.</p>
              </aside>
              <form
                className="content-inactivity-input"
                onSubmit={hadleSubmitCode}
              >
                <input
                  ref={inputRef}
                  type="password" // Hoặc "text" tùy theo yêu cầu của bạn
                  value={code}
                  id="security-code-dashboad"
                  onChange={handleInputChange}
                />
                {notiFail && <p className="noti_fail ">{notiFail}</p>}
                <button type="submit">Continue</button>
              </form>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </>
  );
}

export default InactivityModals;
