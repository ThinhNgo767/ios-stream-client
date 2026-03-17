import "./Gallerys.css";

import { useFetchData } from "../../hook/useFetchData";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  HiMiniArrowLongLeft,
  HiMiniArrowLongRight,
  HiMiniPlay,
  HiMiniPause,
} from "react-icons/hi2";
import { ImEye, ImEyeBlocked } from "react-icons/im";

import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

export default function Gallerys() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useFetchData(
    ["img"],
    "/api/v1/pictures/gallerys",
    { page: page, limit: 30 }, // Params: Tự động biến thành ?page=1&limit=12
    {
      enabled: !!localStorage.getItem("accessToken"), // Chỉ fetch khi có token
      placeholderData: (prev) => prev, // Giữ data cũ khi sang trang mới (v5)
    },
  );

  const [totalPages, setTotalPages] = useState(null);
  const [sequenceImage, setSequenceImage] = useState(0); // Chỉ số ảnh trong trang hiện tại
  const [isZoom, setIsZoom] = useState(false);
  const [isCloseZoom, setIsCloseZoom] = useState(false);
  const [imageZoom, setImageZoom] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [isHidenNsfw, setIsHidenNsfw] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [isAuto, setIsAuto] = useState(false);

  const scrollContainerRef = useRef(null);
  const timeOutRef = useRef(null);
  const imageRef = useRef(null);

  const isAutoScrolling = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    setTotalPages(data?.totalPages);
  }, [data?.totalPages, isLoading]);

  // Reset về ảnh đầu tiên khi đổi trang
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "instant" });
      setSequenceImage(0);
    }
  }, [page]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSequenceImage((prev) => {
        // TÌNH HUỐNG 1: Nếu chưa phải ảnh cuối cùng của trang (index < 19)
        if (prev < data?.pictures?.length - 1) {
          const nextIndex = prev + 1;
          scrollToImage(nextIndex);
          return nextIndex;
        }

        // TÌNH HUỐNG 2: Đã là ảnh cuối cùng (index === 19)
        // Chúng ta KHÔNG gọi setCurrentPage ở đây để tránh xung đột state
        return prev;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, isAuto, data?.pictures?.length]); // Bỏ currentPage và totalPages ra khỏi đây

  // 2. Một useEffect riêng biệt chỉ để canh chừng khi nào cần đổi trang
  useEffect(() => {
    if (isPaused) return;

    // Nếu sequenceImage đã chạm mốc cuối (ví dụ 19)
    if (
      sequenceImage === data?.pictures?.length - 1 &&
      data?.pictures?.length > 0
    ) {
      const pageTimeout = setTimeout(() => {
        setPage((prevPage) => {
          if (prevPage < totalPages) return prevPage + 1;
          return 1; // Quay về trang 1 nếu đã hết
        });
        // sequenceImage sẽ tự reset về 0 nhờ cái useEffect reset trang bạn đã viết sẵn
      }, 3000); // Đợi 3s tại ảnh cuối rồi mới nhảy trang

      return () => clearTimeout(pageTimeout);
    }
  }, [sequenceImage, isPaused, isAuto, totalPages, data?.pictures?.length]);

  const scrollToImage = (index) => {
    if (scrollContainerRef.current) {
      isAutoScrolling.current = true; // Đánh dấu bắt đầu tự cuộn

      scrollContainerRef.current.scrollTo({
        left: index * scrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      });

      // Sau khi cuộn mượt kết thúc (khoảng 500ms), trả lại quyền cho Scroll thủ công
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 600);
    }
  };

  // CẬP NHẬT CHÍNH: Dùng Scroll để xác định ảnh đang hiển thị
  const handleScroll = (e) => {
    // Nếu đang trong quá trình tự cuộn của Slide thì không cập nhật state từ sự kiện cuộn
    if (isAutoScrolling.current) return;

    const { scrollLeft, clientWidth } = e.target;
    const index = Math.round(scrollLeft / clientWidth);

    if (index !== sequenceImage) {
      setSequenceImage(index);
    }
  };

  const handleCloseZoom = () => {
    setIsCloseZoom(true);
    if (timeOutRef.current) clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setIsZoom(false);
      if (isAuto) setIsPaused(false);
    }, 350);
  };
  const handleDoubleTap = (i) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 500; // Khoảng thời gian giữa 2 lần chạm (ms)

    if (isAuto) {
      setIsPaused((prve) => !prve);
    }

    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      // THỰC HIỆN HÀNH ĐỘNG KHI DOUBLE TAP Ở ĐÂY
      setImageZoom(i);
      setIsZoom(true);
      setIsCloseZoom(false);
      setIsPaused(true);
    } else {
      setLastTap(now);
    }
  };

  const onUpdate = useCallback(({ x, y, scale }) => {
    const { current: img } = imageRef;

    if (img) {
      const value = make3dTransformValue({ x, y, scale });

      img.style.setProperty("transform", value);
    }
  }, []);

  if (isLoading) {
    return <div className="loading-global">Đang tải dữ liệu từ server...</div>;
  }

  return (
    <>
      <div
        className={
          isZoom ? "picture-container close" : "picture-container open"
        }
      >
        <div
          className="image-box"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {isFetching ? (
            <div>Đang tải...</div>
          ) : (
            <>
              {data?.pictures.map((p, i) => (
                <img
                  src={p.display_link}
                  alt={p.category || "Cinema"}
                  loading="lazy"
                  decoding="async"
                  key={p.id}
                  className={isZoom ? "swipe-image image-zoom" : "swipe-image"}
                  style={{
                    flexShrink: 0,
                    width: "100%",
                    snapAlign: "start",
                    ...(isHidenNsfw
                      ? { filter: "blur(30px) brightness(0.3)" }
                      : {}),
                  }}
                  onTouchStart={() => handleDoubleTap(i)}
                  onTouchMove={() => {
                    if (isPaused) return;
                    setIsPaused(true);
                  }}
                />
              ))}
            </>
          )}
        </div>

        <div className="count-index-img">
          <span>
            Page {page} / {totalPages}
          </span>
          {/* Hiển thị số thứ tự ảnh hiện tại / tổng số ảnh trong trang */}
          <span onClick={() => setIsHidenNsfw((prve) => !prve)}>
            {isHidenNsfw ? <ImEye /> : <ImEyeBlocked />}
          </span>
          <span
            onClick={() => {
              setIsPaused((prve) => !prve);
              setIsAuto((prve) => !prve);
            }}
          >
            Slide
            {isPaused ? <HiMiniPlay /> : <HiMiniPause />}
          </span>
          <span>
            {sequenceImage + 1} / {data?.pictures?.length}
          </span>
        </div>
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`pagination-btn btn-left ${sequenceImage === 0 && page > 1 && "show-pagination-btn"}`}
          >
            <HiMiniArrowLongLeft />
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`pagination-btn btn-right ${sequenceImage >= 19 && page < totalPages && "show-pagination-btn"}`}
          >
            <HiMiniArrowLongRight />
          </button>
        </div>
      </div>

      {isZoom && (
        <div className="zoom-box">
          <QuickPinchZoom
            onUpdate={onUpdate}
            onDoubleTap={handleCloseZoom}
            centerContained={true}
          >
            <img
              src={data?.pictures[imageZoom]?.original_link}
              alt="zoom"
              loading="eager"
              decoding="async"
              ref={imageRef}
              className={`image-zoom ${isCloseZoom && "zoom-out"}`}
            />
          </QuickPinchZoom>
        </div>
      )}
    </>
  );
}
