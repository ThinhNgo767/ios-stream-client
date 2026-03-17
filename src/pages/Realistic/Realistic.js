import "./Realistic.css";
import { useFetchData } from "../../hook/useFetchData";
import videosAPI from "../../apis/videoAPI";
import poster from "../../assets/greenneon.webp";

import { useState, useRef, useCallback } from "react";

import Swal from "sweetalert2";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

import {
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiMiniArrowLongLeft,
  HiMiniArrowLongRight,
  HiOutlineFilm,
} from "react-icons/hi2";

import { ImEye, ImEyeBlocked } from "react-icons/im";

export default function Realistic() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useFetchData(
    ["real"],
    "/api/v1/videos/realistic",
    { page: page, limit: 21 }, // Params: Tự động biến thành ?page=1&limit=12
    {
      enabled: !!localStorage.getItem("accessToken"), // Chỉ fetch khi có token
      placeholderData: (prev) => prev, // Giữ data cũ khi sang trang mới (v5)
    },
  );

  const [index, setIndex] = useState(null);
  const [id, setId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false); // State quản lý loading
  const [isLoop, setIsLoop] = useState(false);
  const [isShowNsfw, setIsShowNsfw] = useState(true);

  const [goPage, setGoPage] = useState(page);

  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const itemsRef = useRef(new Map());

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Để cuộn mượt mà
    });
  };

  const scrollToId = (id) => {
    const node = itemsRef.current.get(id);
    if (node) {
      const headerHeight = 300; // Chiều cao của Header của bạn
      const nodePosition =
        node.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = nodePosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const seek = useCallback((amount) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  }, []);

  const handleSelect = async (id, idx) => {
    if (idx === index) return;
    const video = videoRef.current;
    try {
      const vid = await videosAPI.relisticItem(id);

      video.src = vid.url;
      video.poster = vid.thumb;
      video.load();

      setId(id);
      setIndex(idx);
    } catch (error) {
      console.log(error.message);
    }

    scrollToTop();
  };

  const handleGoPage = (page) => {
    if (goPage > totalPages) {
      setGoPage(page);
      return Swal.fire({
        position: "center",
        width: "20rem",
        icon: "error",
        iconColor: "#d70000",
        text: "Page not found!",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }

    setPage(page);
    setGoPage(page);

    scrollToTop();
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (isLoading) {
    return <div className="loading-global">Đang tải dữ liệu từ server...</div>;
  }

  const { infoVideos, totalPages } = data;

  return (
    <div className="real-container">
      <div className="video-box">
        {/* Lớp phủ Loading (chỉ hiện khi isLoading là true) */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        )}

        <MediaController>
          <video
            ref={videoRef}
            slot="media"
            autoPlay={isPlaying}
            muted={true}
            loop={isLoop}
            playsInline
            preload="auto"
            poster={poster}
            // Sự kiện xử lý loading
            onWaiting={() => setLoading(true)} // Đang đợi dữ liệu
            onPlaying={() => setLoading(false)} // Đang chạy
            onCanPlay={() => {
              setLoading(false);

              videoRef.current.play();
              if (!videoRef.current.paused) {
                setIsPlaying(true);
              }
            }} // Đã có thể chạy
            onSeeked={() => setLoading(false)} // Sau khi tua xong
            onError={() => setLoading(false)}
          >
            <source src={null} type="video/mp4" />
          </video>

          <MediaControlBar>
            <span onClick={() => setIsPlaying((prve) => !prve)}>
              <MediaPlayButton />
            </span>

            <MediaTimeDisplay showDuration />
            <MediaTimeRange />
            <MediaMuteButton />
            <MediaPlaybackRateButton />
            <MediaFullscreenButton />
          </MediaControlBar>
        </MediaController>
      </div>
      <div className="container-switch">
        <button
          className="show-content-nsfw"
          onClick={() => setIsShowNsfw((prve) => !prve)}
        >
          {isShowNsfw ? (
            <>
              <ImEye />
              <small>Show NSFW</small>
            </>
          ) : (
            <>
              <ImEyeBlocked />
              <small>Hide NSFW</small>
            </>
          )}
        </button>
        <button onClick={() => scrollToId(id)} title="Đi đến video đang phát">
          <small>Go is</small>
          <HiOutlineFilm />
        </button>

        <button
          className="looping"
          style={
            isLoop
              ? {
                  backgroundColor: "#fff",
                  color: "#333",
                  borderColor: "#333",
                }
              : { backgroundColor: "#333", color: "#fff" }
          }
          onClick={() => setIsLoop((prve) => !prve)}
          title="Video lặp lại"
        >
          <small>Looping</small>
          <span
            className="active-loop"
            style={
              isLoop
                ? { backgroundColor: "#75921e" }
                : { backgroundColor: "#d70000" }
            }
          ></span>
        </button>
      </div>

      <div className="control-box">
        <div className="box-left">
          <button onClick={() => seek(-60)}>
            <HiChevronDoubleLeft />
            1m
          </button>
          <button onClick={() => seek(-15)}>
            <HiChevronLeft />
            15s
          </button>
          <button onClick={() => seek(-5)}>
            <HiChevronLeft />
            5s
          </button>
        </div>
        <div className="box-right">
          <button onClick={() => seek(5)}>
            5s
            <HiChevronRight />
          </button>
          <button onClick={() => seek(15)}>
            15s
            <HiChevronRight />
          </button>
          <button onClick={() => seek(60)}>
            1m
            <HiChevronDoubleRight />
          </button>
        </div>
      </div>
      {isFetching ? (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            color: "#fff",
            margin: "1rem auto",
          }}
        >
          Đang tải...
        </div>
      ) : (
        <div className="item-box">
          {infoVideos.map((item, idx) => (
            <div
              key={item.id}
              className={`card-real ${id === item.id ? "active" : ""}`}
              onClick={async () => await handleSelect(item.id, idx)}
              id={`video-item-${idx}`}
              ref={(node) => {
                if (node) itemsRef.current.set(item.id, node);
                else itemsRef.current.delete(item.id);
              }}
            >
              <div className="card-real-content">
                <img
                  src={item.thumb}
                  alt={item.name}
                  loading="eager"
                  decoding="async"
                  className={
                    isShowNsfw ? "filter-blur-hide" : "filter-blur-show"
                  }
                />
                {idx === index && !loading && (
                  <div className="video-is-playing">
                    <p>
                      {isPlaying ? (
                        <span className="play-loader">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                      ) : (
                        <span>PAUSE</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="footer">
        <div className="pagination">
          <button disabled={page === 1} onClick={() => handleGoPage(page - 1)}>
            <HiMiniArrowLongLeft />
          </button>

          <span>
            Trang {page} / {totalPages}{" "}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => handleGoPage(page + 1)}
          >
            <HiMiniArrowLongRight />
          </button>
        </div>
        <div className="go-page">
          <div className="go-page-box">
            <input
              ref={inputRef}
              type="number"
              name="number-page"
              value={goPage}
              onChange={(e) => setGoPage(Number(e.target.value))}
              onFocus={handleFocus}
              onBlur={() => (inputRef.current.value = page)}
            />
            <button onClick={() => handleGoPage(page)}>Go!</button>
          </div>
        </div>
      </div>
    </div>
  );
}
