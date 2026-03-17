import { useEffect, useState, useRef } from "react";

export function useActive(inactivityTime, onInactive) {
  // Thêm onInactive làm tham số
  const [active, setActive] = useState(false);
  const timer = useRef();

  useEffect(() => {
    const events = ["keypress", "mousemove", "touchmove", "click", "scroll"];

    const handleEvent = () => {
      setActive(true); // Đặt trạng thái hoạt động là true

      // Nếu có timer cũ, xóa nó đi
      if (timer.current) {
        window.clearTimeout(timer.current);
      }

      // Thiết lập timer mới
      timer.current = window.setTimeout(() => {
        setActive(false); // Đặt trạng thái không hoạt động
        if (onInactive) {
          // Nếu có hàm onInactive được truyền vào, gọi nó
          onInactive();
        }
      }, inactivityTime); // Sử dụng inactivityTime thay vì time
    };

    // Thêm trình nghe sự kiện
    events.forEach((event) => document.addEventListener(event, handleEvent));

    // Hàm dọn dẹp
    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, handleEvent),
      );
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, [inactivityTime, onInactive]); // Thêm onInactive vào mảng phụ thuộc

  return active;
}
