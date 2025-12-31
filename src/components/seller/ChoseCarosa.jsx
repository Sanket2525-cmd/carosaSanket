"use client";

import { Col, Container, Row } from "react-bootstrap";
import choseCarosa from "@/data/WhyChoseCarosa.json";
import Image from "next/image";
import CarosaKaBharosa from "../viewCarsRecent/view/details/comps/CarosaKaBharosa";

function ChoseCarosa() {
  return (
    <>
      <section className="whyChoseCarosa padding-Y-X mt-xl-0">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-3">
              <div className="">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold m-0">
                    Why Choose <span className="car">CAR</span>
                    <span className="osa">OSA</span>
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
            {choseCarosa.map((items, index)=>(
                <Col xl={4} md={6} xs={12} key={index} className="mb-4">
                    <div className="carosaChose">
                    <div className="work-image-wrap">
                      <img
                        src={items.image}
                        alt={items.title}
                        className="w-100 rounded-top object-fit-cover"
                        height="260"
                        loading="lazy"
                      />
                    </div>

                    <div className="choseCaptions p-4">
                      <h3 className="work-title fSize-6 fw-medium">
                        {items.title}
                      </h3>
                      <p className="work-desc fSize-4 fw-normal">
                        {items.description}
                      </p>
                    </div>
                  </div>
                </Col>
            ))}
          </Row>

        </Container> 
    
      </section>
    </>
  );
}

export default ChoseCarosa;
