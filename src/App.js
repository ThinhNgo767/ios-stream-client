import "./App.css";

import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, useContext } from "react";

import { useActive } from "./hook/useActive";
import AuthContext from "./contexts/AuthContext/AuthContext";

import Header from "./component/Header/Header";
import InactivityModal from "./component/InactivityModal/InactivityModal";
import Gallerys from "./pages/Gallerys/Gallerys";
import LoginForm from "./pages/LoginPage/LoginForm";
import AuthRoute from "./component/AuthRoute/AuthRoute";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import Error from "./pages/Error/Error";

const LazyKoreanDance = lazy(() => import("./pages/KoreanDance/KoreanDance"));
const LazyRealistic = lazy(() => import("./pages/Realistic/Realistic"));

const PageLoader = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <p>Đang tải trang...</p>
  </div>
);

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const {
    auth: { isAuthenticated },
  } = useContext(AuthContext);

  const timeClose = 1000 * 600 * 5;

  useActive(timeClose, () => {
    if (isAuthenticated) {
      setShowModal(true);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra vị trí cuộn: nếu cuộn xuống quá 100px thì hiển thị nút
      if (window.pageYOffset > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp listener khi component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <InactivityModal showModal={showModal} setShowModal={setShowModal}>
      <div className="App">
        <Header showModal={showModal} setShowModal={setShowModal} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                <AuthRoute>
                  <LoginForm />
                </AuthRoute>
              }
            />

            <Route
              path="/koreanbj"
              element={
                <ProtectedRoute>
                  <LazyKoreanDance isVisible={isVisible} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/realistic"
              element={
                <ProtectedRoute>
                  <LazyRealistic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallerys"
              element={
                <ProtectedRoute>
                  <Gallerys />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </div>
    </InactivityModal>
  );
}

export default App;
