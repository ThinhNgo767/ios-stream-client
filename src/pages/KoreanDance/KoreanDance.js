import "./KoreanDance.css";
import { useState, useRef, useCallback } from "react";

import AnchorSelect from "../../component/AnchorSelect/AnchorSelect";
import { useFetchData } from "../../hook/useFetchData";

import videoAPI from "../../apis/videoAPI";
import poster from "../../assets/greenneon.webp";

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
  HiOutlineFilm,
  HiOutlineArrowSmallUp,
} from "react-icons/hi2";

import { ImEye, ImEyeBlocked } from "react-icons/im";
import Swal from "sweetalert2";

export default function KoreanDance({ isVisible }) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const query = selected.map((s) => s.label).toString();

  const { data, isLoading, isFetching } = useFetchData(
    ["kbj"],
    "/api/v1/videos/koreanbj",
    { page: page, limit: 10, anchor: query }, // Params: Tự động biến thành ?page=1&limit=12
    {
      enabled: !!localStorage.getItem("accessToken"), // Chỉ fetch khi có token
      placeholderData: (prev) => prev, // Giữ data cũ khi sang trang mới (v5)
    },
  );

  const [id, setId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false); // State quản lý loading
  const [isShowNsfw, setIsShowNsfw] = useState(true);
  const [isLoop, setIsLoop] = useState(false);

  const videoRef = useRef(null);
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

  const handleSelect = async (id) => {
    const video = videoRef.current;
    setId(id);
    try {
      const vid = await videoAPI.koreanItem(id);
      video.src = vid.url;
      video.poster = video.thumb;
      video.load();
      scrollToTop();
    } catch (error) {
      console.log(error.message);
    }
  };

  const seek = useCallback((amount) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  }, []);

  if (isLoading) {
    return <div className="loading-global">Đang tải dữ liệu từ server...</div>;
  }

  const { totalPages, anchorsName, infoVideos } = data;

  return (
    <div className="kbj-container">
      <div className="video-box">
        {/* Lớp phủ Loading (chỉ hiện khi isLoading là true) */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>

            <span className="loading">
              <strong>L</strong>
              <strong>O</strong>
              <strong>A</strong>
              <strong>D</strong>
              <strong>E</strong>
              <strong>R</strong>
            </span>
          </div>
        )}

        <MediaController>
          <video
            ref={videoRef}
            slot="media"
            autoPlay={isPlaying}
            muted={true}
            playsInline
            preload="auto"
            poster={poster}
            // Sự kiện xử lý loading
            onWaiting={() => setLoading(true)} // Đang đợi dữ liệu
            onPlaying={() => setLoading(false)} // Đang chạy
            onCanPlay={() => {
              setLoading(false);
              videoRef.current.play();
            }} // Đã có thể chạy
            onSeeking={() => setLoading(true)}
            onSeeked={() => setLoading(false)} // Sau khi tua xong
            onError={() => {
              if (videoRef.current.src) {
                setLoading(false);
                return Swal.fire({
                  position: "center",
                  width: "20rem",
                  icon: "error",
                  iconColor: "#ff0033",
                  text: "Video error!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }}
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
      <div className="nsfw-go_video">
        <div className="content-nsfw">
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
        </div>
        <div className="go-video-is-playing">
          <button onClick={() => scrollToId(id)}>
            <small>Video Is Play </small>
            <HiOutlineFilm />
          </button>
        </div>
        <div className="switch-box">
          <button
            className="looping"
            style={
              isLoop
                ? { backgroundColor: "#fff", color: "#333" }
                : { backgroundColor: "#333", color: "#fff" }
            }
            onClick={() => setIsLoop((prve) => !prve)}
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
      </div>

      <div className="control-box">
        <div className="box-left">
          <button onClick={() => seek(-60)}>
            <HiChevronDoubleLeft />
            1m
          </button>
          <button onClick={() => seek(-30)}>
            <HiChevronLeft />
            30s
          </button>
          <button onClick={() => seek(-10)}>
            <HiChevronLeft />
            10s
          </button>
        </div>
        <div className="box-right">
          <button onClick={() => seek(10)}>
            10s
            <HiChevronRight />
          </button>
          <button onClick={() => seek(30)}>
            30s
            <HiChevronRight />
          </button>
          <button onClick={() => seek(60)}>
            1m
            <HiChevronDoubleRight />
          </button>
        </div>
      </div>

      <AnchorSelect
        anchorList={anchorsName}
        selected={selected}
        setSelected={setSelected}
      />
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
          {infoVideos?.map((item) => (
            <div
              key={item.id}
              className={`card-kbj ${id === item.id ? "active" : ""}`}
              onClick={async () => await handleSelect(item.id)}
              ref={(node) => {
                if (node) itemsRef.current.set(item.id, node);
                else itemsRef.current.delete(item.id);
              }}
            >
              <div className="card-kbj-content">
                <img
                  src={item.thumb}
                  alt={item.anchor}
                  loading="lazy"
                  decoding="async"
                  className={
                    isShowNsfw ? "filter-blur-hide" : "filter-blur-show"
                  }
                />
                <p>{item.anchor}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Trang trước
        </button>
        <span>
          Trang {page}/{totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Trang sau
        </button>
      </div>
      {isVisible && (
        <button className="scroll-top" onClick={scrollToTop}>
          <HiOutlineArrowSmallUp />
          <small>TOP</small>
        </button>
      )}
    </div>
  );
}
