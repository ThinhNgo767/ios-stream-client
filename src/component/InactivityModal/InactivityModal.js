import "./InactivityModal.css";

import AuthContext from "../../contexts/AuthContext/AuthContext";
import ActiveContext from "../../contexts/ActiveContext/ActiveContext";

import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function InactivityModal({ children }) {
  const [code, setCode] = useState("");
  const [countIncorrectCode, setCountIncorrectCode] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [messenger, setMessenger] = useState("");

  const {
    auth: { isAuthenticated },
    handleSubmitLogout,
  } = useContext(AuthContext);
  const { showModal, checkedStatusActive, verifySecurityCode, setShowModal } =
    useContext(ActiveContext);

  const timeRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    checkedStatusActive();
  }, [isAuthenticated, checkedStatusActive]);

  useEffect(() => {
    let timerId;
    if (isCountingDown && countdown > 0) {
      timerId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && isCountingDown) {
      // Khi đếm ngược về 0, tắt trạng thái đếm và reset lỗi
      setIncorrect(false);
      setIsCountingDown(false);
      setCountIncorrectCode(3); // Reset số lần sai khi đếm ngược xong
      setCode("");
      setMessenger("");
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isCountingDown, countdown]);

  useEffect(() => {
    const hadleIncorrectCode = async () => {
      if (countIncorrectCode > 0 && countIncorrectCode < 3) {
        setMessenger("Mã bảo mật không đúng! Vui lòng thử lại!");
      }
      if (countIncorrectCode === 3) {
        setIncorrect(true);
        setCountdown(20); // Đặt lại đếm ngược
        setIsCountingDown(true); // Bắt đầu đếm ngược
      }
      if (countIncorrectCode === 5) {
        if (timeRef.current) {
          clearTimeout(timeRef.current);
        }
        setIncorrect(true);

        timeRef.current = setTimeout(async () => {
          setCountIncorrectCode(0);
          setShowModal(false);
          setIncorrect(false);
          await handleSubmitLogout();
          navigate("/");
          return;
        }, 3000);
      }
    };
    hadleIncorrectCode();
  }, [countIncorrectCode, handleSubmitLogout, navigate, setShowModal]);

  const hadleSubmitCode = async (e, c) => {
    e.preventDefault();

    if (!code) {
      return setMessenger("Vui lòng nhập mã code hợp lệ!");
    }
    setMessenger("");
    try {
      const valided = await verifySecurityCode(c);
      if (!valided.success) {
        const newCount = countIncorrectCode + 1;
        setCountIncorrectCode(newCount);
        setCode("");
        return;
      }
      setCode("");
      setCountdown(0);
      setCountIncorrectCode(0);
      setMessenger("");
      setIncorrect(false);
    } catch (error) {}
  };

  return (
    <>
      {showModal ? (
        <div className="inactivity-modal-overlay">
          <div className="inactivity-modal-content">
            <aside className="content-inactivity">
              <p>The app has been locked</p>
              <p>Ứng dụng hiện đang bị khóa</p>
              <p>Vui lòng nhập mã bảo mật để tiếp tục</p>
            </aside>
            {incorrect ? (
              <div className="content-inactivity-error">
                {countIncorrectCode === 3 && (
                  <>
                    <p>Bạn đã nhập sai mã code 3 lần!</p>
                    <p>
                      Vui lòng thử lại sau: <b>{countdown}s</b>
                    </p>
                  </>
                )}
                {countIncorrectCode === 5 && (
                  <>
                    <p>Bạn đã nhập sai mã code quá nhiều lần!</p>
                    <p>
                      3s sau Hệ thống tự LOGOUT và chuyển đến trang đăng nhập!
                    </p>
                  </>
                )}
              </div>
            ) : (
              <form className="content-inactivity-form">
                <input
                  type="password" // Hoặc "text" tùy theo yêu cầu của bạn
                  id="security-code-dashboad"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                {messenger && (
                  <span className="error">
                    <small>Mã bảo mật không đúng! Vui lòng thử lại!</small>
                  </span>
                )}

                <button type="submit" onClick={(e) => hadleSubmitCode(e, code)}>
                  Continue
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
