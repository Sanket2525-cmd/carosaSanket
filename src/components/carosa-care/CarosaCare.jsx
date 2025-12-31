"use client";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/homebanner.css";

function CarosaCare() {
    return (
        <div className="ourstory-page">

            {/* ========== Banner Section ========== */}
            <section className="banner_story position-relative">
                <img src="/images/CarosaCare.png" alt="Carosa Banner" className="banner_st img-fluid" />
                <div className="content-wrap pe-0">
                    <div className="content" style={{ maxWidth: "100%" }}>
                        <p className="eyebrow">Coming Soon</p>
                        <h1 className="title text-white">Carosa Care</h1>
                     
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CarosaCare
