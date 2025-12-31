"use client";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { safeParseCustomFields } from "@/utils/jsonUtils";
import { API_BASE_URL } from "@/config/environment";

// Helper function to format owner
const formatOwner = (owner) => {
  if (!owner) return "1st";
  const ownerNum = typeof owner === "string" ? owner.toLowerCase() : owner.toString();
  if (ownerNum.includes("1")) return "1st";
  if (ownerNum.includes("2")) return "2nd";
  if (ownerNum.includes("3")) return "3rd";
  return `${ownerNum}th`;
};

// Helper function to mask registration number
const maskRegistrationNumber = (regNumber) => {
  if (!regNumber || regNumber === "N/A") return "N/A";
  const clean = regNumber.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");
  if (parts.length === 4) return `${parts[0]} ${parts[1]} ** ${parts[3]}`;
  if (parts.length === 3) return `${parts[0]} ** ${parts[2]}`;
  return clean.replace(/^(.{4}).*(.{4})$/, "$1**$2");
};

export default function CarDetailsSection({ carData }) {
  if (!carData) return null;

  const customFields = safeParseCustomFields(carData);
  
  // Get car image
  const firstImage = carData?.CarImages && carData.CarImages.length > 0
    ? `${API_BASE_URL}${carData.CarImages[0].url}`
    : carData?.images?.[0] || "/assets/carImage/exterior4.avif";
  
  // Extract car details with consistent fallback logic
  const make = carData?.make || "Unknown";
  const model = carData?.model || "Unknown";
  // Get registration year - prioritize customFields, then carData, avoid current year fallback
  const registrationYear = customFields.year || customFields.registrationYear || customFields.regYear || carData?.year || carData?.registrationYear || null;
  const year = registrationYear; // Use registration year as base year
  const mfgYear = customFields.mfgYear || customFields.manufacturingYear || carData?.mfgYear || year;
  const fuelType = customFields.fuelType || customFields.fuel || carData?.fuelType || carData?.fuel || "Petrol";
  const transmission = customFields.transmission || carData?.transmission || "Manual";
  const kmDriven = customFields.kmDriven || customFields.km || customFields.odometer || customFields.mileage || carData?.kmDriven || carData?.km || 0;
  const owner = customFields.owner || carData?.owner || "1";
  const ownership = formatOwner(owner);
  const engineCapacity = customFields.engineCapacity || carData?.engineCapacity || "N/A";
  const spareKey = customFields.spareKey || carData?.spareKey || "No";
  const registrationNumber = customFields.registrationNumber || carData?.registrationNumber || "N/A";
  let insurance = customFields.insurance || carData?.insurance || "No";
  const insuranceType = customFields.insuranceType || carData?.insuranceType || "N/A";
  const insuranceDate = customFields.insuranceDate || carData?.insuranceDate || null;
  const warranty = customFields.warranty || carData?.warranty || "No";
  const warrantyType = customFields.warrantyType || carData?.warrantyType || "Extended";
  const warrantyDate = customFields.warrantyDate || carData?.warrantyDate || null;

  // Check if insurance is expired
  if (insuranceDate) {
    try {
      const insuranceDateObj = new Date(insuranceDate);
      const currentDate = new Date();
      if (!isNaN(insuranceDateObj) && insuranceDateObj < currentDate) {
        insurance = "Expired";
      }
    } catch {}
  }

  return (
    <>
      {/* Car Image */}
      <div className="position-relative">
        <img
          src={firstImage}
          alt={`${make} ${model}`}
          className="w-100 rounded object-fit-cover"
          style={{ maxHeight: 400 }}
        />
      </div>

      {/* Car Info Section */}
      <div className="mt-5 mb-3">
        <Col xs={12}>
          <div className="hdTile pb-2">
            <h6 className="fsSize-7-5 fw-bold">Car Info</h6>
          </div>
        </Col>
        <Row className="carOverView m-0 py-4 px-3">
          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/reg-years-icon.png" width={24} alt="Mfg Year" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Mfg. Year
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {mfgYear || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/reg-years-icon.png" width={24} alt="Reg Year" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Reg. Year
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {registrationYear || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/Transmission.png" width={24} alt="Transmission" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Transmission
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {transmission || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/fuelboat.png" width={24} alt="Fuel Type" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Fuel Type
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {fuelType || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/kms.png" width={24} alt="KMs Driven" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  KMs Driven
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {kmDriven ? `${Number(kmDriven).toLocaleString()} km` : 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/theowner.png" width={24} alt="Owner" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Owner
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {ownership || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/regnumber.png" width={24} alt="Reg Number" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Reg. Number
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {maskRegistrationNumber(registrationNumber)}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/key.png" width={24} alt="Spare Key" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Spare Key
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {spareKey === 'Yes' || spareKey === true ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={4} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/engine.png" width={24} alt="Engine Capacity" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Engine Capacity
                </span>
                <p className="text-white fSize-4 fw-semibold m-0">
                  {engineCapacity || 'N/A'}
                </p>
              </div>
            </div>
          </Col>

          <Col lg={12} className="pb-3">
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/insurenceandvara.png" width={24} alt="Insurance" />
              <div className="d-flex flex-column">
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Insurance
                </span>
                <div className="d-flex gap-3 align-items-center flex-wrap">
                  <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                    <FontAwesomeIcon icon={faCheck} /> {insurance}
                  </button>
                  {(insurance === "Yes" || insurance === "Expired") && (
                    <>
                      <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                        {insuranceType}
                      </span>
                      {insuranceDate && (
                        <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                          {new Date(insuranceDate).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>

          <Col lg={12}>
            <div className="card__inner d-flex align-items-center gap-3 ps-2 py-1">
              <img src="/assets/img/insurenceandvara.png" width={24} alt="Warranty" />
              <div>
                <span className="text-white fSize-2 fw-medium text-uppercase">
                  Warranty
                </span>
                <div className="d-flex gap-3 align-items-center">
                  <button className="yesORno text-white py-1 px-3 fSize-4 fw-medium">
                    <FontAwesomeIcon icon={faCheck} /> {warranty}
                  </button>
                  {warranty === "Yes" && (
                    <>
                      <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                        {warrantyType}
                      </span>
                      {warrantyDate && (
                        <span className="insurancechip fSize-4 fw-medium text-white py-1 px-3">
                          {new Date(warrantyDate).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}


