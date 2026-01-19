
"use client";

import Image from "next/image";
import "../../styles/carosacare.css";

export default function VehicleFetchingLoader() {
  return (
    <section className="challan-section">
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-12 d-flex justify-content-center">
            <div className="vehicle-fetching-card bg-white rounded-4 text-center px-4 py-5 shadow-sm d-flex flex-column justify-content-center">
              
              {/* IMAGE WRAPPER */}
              <div className="vehicle-image-wrapper mb-4">
                <Image
                  src="/images/fecthing.png"
                  alt="Fetching Vehicle Details"
                  width={420}
                  height={300}
                  className="img-fluid"
                  priority
                />

                <Image
                  src="/images/fetchingCar.png"
                  alt="Car"
                  width={120}
                  height={90}
                  className="vehicle-car-overlay"
                  priority
                />
              </div>

              <h5 className="fw-bold mb-2">
                Fetching Vehicle details
              </h5>

              <p className="text-muted small mb-0">
                5+ Unpaid Challans ( Over 90 days ) will block Vahan portal Service
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
