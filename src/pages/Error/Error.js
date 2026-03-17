import "./Error.css";

import React, { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import page_404 from "../../assets/oop404.webp";

const Error = () => {
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      document.title =
        "Final Boss - Một người đẹp trai thanh lịch vô địch khắp vũ trụ";
    };
  }, []);

  useLayoutEffect(() => {
    document.title = "Final Boss - Error Page";
  }, []);

  return (
    <div className="errors-container">
      <div className="box-error">
        <img src={page_404} alt="page_404_not_found" />
        <h1 className="text-title">404. That's an error</h1>
        <h3 className="text-error-h3">This Page Does Not Exist</h3>

        <span className="text-error">
          Sorry, the page you are looking for could not be found. It's just an
          accident that was not intentional.
        </span>

        <button
          type="button"
          title="go back"
          className="error-button"
          onClick={() => navigate(-1)}
        >
          QUAY LẠI
        </button>
      </div>
    </div>
  );
};

export default Error;
