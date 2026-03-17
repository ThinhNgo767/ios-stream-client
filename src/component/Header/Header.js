import "./Header.css";
import userAPI from "../../apis/userAPI";
import AuthContext from "../../contexts/AuthContext/AuthContext";
import ActiveContext from "../../contexts/ActiveContext/ActiveContext";
import troll from "../../assets/troll-meme.gif";

import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  BsHouseLockFill,
  BsImages,
  BsTiktok,
  BsMusicNoteBeamed,
  BsPersonFillUp,
  BsPersonFillDown,
} from "react-icons/bs";
import Swal from "sweetalert2";

export default function Header() {
  const {
    auth: { isAuthenticated },
    handleSubmitLogout,
  } = useContext(AuthContext);

  const { setShowModal } = useContext(ActiveContext);

  const activeLink = ({ isActive }) => (isActive ? "active-item" : "");

  const handleLockApp = async () => {
    if (!isAuthenticated) return;
    try {
      await userAPI.change({ isActive: false });
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      return Swal.fire({
        width: "100%",
        title: "Login đi :))",
        imageUrl: troll,
        imageAlt: "Troll",
        showConfirmButton: true,
        confirmButtonText: "OK! Đại ca",
        confirmButtonColor: "#333",
        customClass: {
          title: "title-troll",
          image: "image-troll",
          popup: "popup-troll",
          confirmButton: "button-troll",
        },
      });
    }
  };

  return (
    <div className="header">
      <nav>
        <ul>
          <li onClick={handleLockApp}>
            <button className="lock-page">
              <BsHouseLockFill />
            </button>
          </li>
          <li>
            <NavLink
              to="/koreanbj"
              end
              onClick={handleClick}
              className={activeLink}
            >
              <BsMusicNoteBeamed />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/realistic"
              end
              onClick={handleClick}
              className={activeLink}
            >
              <BsTiktok />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/gallerys"
              end
              onClick={handleClick}
              className={activeLink}
            >
              <BsImages />
            </NavLink>
          </li>

          {isAuthenticated ? (
            <li>
              <button className="logout" onClick={handleSubmitLogout}>
                <BsPersonFillDown />
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/" className={activeLink}>
                <BsPersonFillUp />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
