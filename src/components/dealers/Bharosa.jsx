"use client";

import { Col, Container, Row } from "react-bootstrap";
import bharosa from "@/data/CarosaDealers.json";
import { useState } from "react";
function BharosaOfCarosa() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
  return (
    <>
      <section className="bharosaMainParent padding-Y-X ">
        <Container fluid>
          <Row>
            <Col xs={12} className="pb-0">
              <div className="">
                <div className="webMainTitle">
                  <h1 className="fSize-11 fw-bold m-0">
                    <span className="car">CAR</span>
                    <span className="osa">OSA</span> Ka Bharosa
                  </h1>
                    <p className="fSize-4 fw-normal" style={{color: '#737373'}}>Trusted benefits & assurances for every Carosa vehicle</p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 row-cols-xxl-5 g-2 g-lg-3 pb-3">
            {bharosa.map((items, index)=>(
                 <div className="col" key={index}>
                    <div 
                      className="cardMain min_cardMain bg-white p-3 d-flex flex-column align-items-center justify-content-center text-center h-100"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <img 
                          src={hoveredIndex === index && items.hoverImage ? items.hoverImage : items.image} 
                          alt="" 
                          className="pb-3" 
                          style={{height:"45px !important;"}}
                        />
                        <p className="m-0 fSize-4 fw-semibold text-wrap" style={{fontSize:"16px !important;"}}>{items.title}</p>
                        <span className="fSize-3 fw-normal span__card__inner">{items.desc}</span>
                    </div>
                </div>
           
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export default BharosaOfCarosa;
