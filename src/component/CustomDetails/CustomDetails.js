import React, { useState, useRef, useEffect } from "react";
import "./CustomDetails.css"; // File CSS cho component

const CustomDetails = ({ title, children, isOpen, setIsOpen }) => {
  // useRef để tham chiếu đến phần tử nội dung, giúp tính toán chiều cao
  const contentRef = useRef(null);
  // State để lưu chiều cao thực tế của nội dung khi mở
  const [contentHeight, setContentHeight] = useState("0px");

  // useEffect để tính toán chiều cao của nội dung khi component được render hoặc khi isOpen thay đổi
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Đặt chiều cao bằng chiều cao scroll của nội dung để có hiệu ứng slide-down
      setContentHeight(`${contentRef.current.scrollHeight + 50}px`);
    } else {
      // Đặt chiều cao về 0 khi đóng
      setContentHeight("0px");
    }
  }, [isOpen]); // Chạy lại khi isOpen thay đổi

  const toggleDetails = () => {
    setIsOpen(!isOpen); // Đảo ngược trạng thái isOpen khi nhấp
  };

  return (
    <div className={`custom-details ${isOpen ? "open" : ""}`}>
      <div className="custom-details-summary" onClick={toggleDetails}>
        {title}
      </div>
      <div
        className="custom-details-content"
        ref={contentRef}
        style={{ maxHeight: contentHeight }} // Áp dụng chiều cao động
      >
        {children}
      </div>
    </div>
  );
};

export default CustomDetails;
