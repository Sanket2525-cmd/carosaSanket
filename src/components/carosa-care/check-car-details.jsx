
"use client";

import Image from "next/image";
import "../../styles/carosacare.css";

export default function CarDetailsHeader() {
  return (
    <>
      {/* BREADCRUMB */}
      <section className="car-breadcrumb">
        <div className="container">
          <nav className="breadcrumb-nav">
            <span>Carosa Care</span>
            <span className="sep">›</span>
            <span>Check Car Details</span>
            <span className="sep">›</span>
            <span className="active">Car Details</span>
          </nav>
        </div>
      </section>

      {/* CARD */}
      <section className="page-bg">
        <div className="container">
          <div className="car-card d-flex flex-column flex-md-row align-items-center justify-content-between">

            {/* LEFT */}
            <div className="d-flex align-items-center gap-3">
              <div className="car-img">
                <Image
                  src="/images/carC.png"
                  alt="Car"
                  width={64}
                  height={64}
                />
              </div>

              <div>
                <p className="reg-text mb-1">
                  Car Registration: <strong>DL33AB4590</strong>
                </p>

                {/* ✅ COLOR FIXED */}
                <h4 className="car-title mb-0">
                  2024 Toyota City ZX
                </h4>
              </div>
            </div>

            {/* RIGHT */}
            <div className="rc-status mt-3 mt-md-0">
              RC Status: <strong>Suspended</strong>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
