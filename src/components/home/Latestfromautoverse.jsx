import Link from "next/link";
import React, { useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import latestPic from "../../data/LetastPic.json";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
function Latestfromautoverse() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return (
    <>
      <section className="latestfromautoverseMain padding-Y-X ">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold">Autoscript Latest Buzz</h1>
                </div>
                <div className="viewAll">
                  <Link href="" className="fSize-5 fw-semibold viewBtn">
                    View All{" "}
                    <img
                      src="/images/arrowRight.png"
                      alt=""
                      width={14}
                      className="ms-2"
                    />{" "}
                  </Link>
                </div>
              </div>
            </Col>
            <Col xl={5}>
              <div className="autoVideo position-relative">
                <video
                  ref={videoRef}
                  src="/video/caeosaVideo.mp4"
                  width="100%"
                  height="580"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="rounded-3 object-fit-cover"
                />
                <div className="playBtn d-flex align-items-center justify-content-center position-absolute top-50 start-50 translate-middle">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="border-0 outline-none bg-transparent"
                  >
                    <img
                      src="/images/palyBtn.png"
                      alt="Play/Pause"
                      width={20}
                      height={20}
                      className="object-fit-cover"
                    />
                  </button>
                </div>
              </div>
            </Col>
            <Col xl={7}>
              <div className="d-none d-md-block">
    <Row>
      {latestPic.map((items, index) => (
        <Col xs={12} md={6} key={index} className="mb-4">
          <div className="latestCard h-100">
            <div className="card border-0 p-3">
              <img src={items.image} alt="" className="w-100 rounded-2" height={180} />
              <div className="card-body p-0">
                <p className="m-0 pt-2 fSize-4 fw-semibold two-line-ellipsis">
                  {items.discriptions}
                </p>
                <span className="fSize-2 fw-normal">{items.date}</span>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </div>

  {/* Mobile Swiper Slider */}
  <div className="d-block d-md-none">
    <Swiper
      slidesPerView={1.1}
      spaceBetween={15}
      modules={[]} 
    >
      {latestPic.map((items, index) => (
        <SwiperSlide key={index}>
          <div className="latestCard h-100">
            <div className="card border-0 p-3">
              <img src={items.image} alt="" className="w-100 rounded-2" height={180} />
              <div className="card-body p-0">
                <p className="m-0 pt-2 fSize-4 fw-semibold two-line-ellipsis">
                  {items.discriptions}
                </p>
                <span className="fSize-2 fw-normal">{items.date}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Latestfromautoverse;
