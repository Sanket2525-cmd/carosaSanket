"use client";
import moreExploreHere from "../../../../../data/MoreExploreCars.json";

import { Col, Container, Row } from "react-bootstrap";

function MoreExplore() {
  return (
    <>
      <section className="moreExploreCar padding-Y-X ">
        <Container fluid>
          <Row className="mt-4">
            <Col xs={12} className="pb-3">
              <div className="">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold m-0">
                    Discover More Collection
                  </h1>
                </div>
                {/* <div className="viewAll">
                          <Link href="" className="fSize-3 fw-medium viewBtn">
                            View All{" "}
                            <img
                              src="/images/arrowRight.png"
                              alt=""
                              width={14}
                              className="ms-2"
                            />{" "}
                          </Link>
                        </div> */}
              </div>
            </Col>
          </Row>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 row-cols-xxl-5 g-2 g-lg-3 pb-3">
            {moreExploreHere.map((items, index) => (
              <div className="col" key={index}>
                <div className="cardMain exploreCard bg-white p-md-3 p-3 d-flex align-items-center  h-100  gap-3" >
                  <div className="">
                    <img
                      src={items.image}
                      alt=""
                      className=""
                      height={45}
                    />
                  </div>

                  <p className="m-0 fSize-5 fw-semibold text-wrap">
                    {items.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export default MoreExplore;
