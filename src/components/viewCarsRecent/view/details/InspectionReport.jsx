import { FaCogs, FaCarSide, FaPaintRoller, FaLightbulb, FaTools, FaFan, FaTachometerAlt, FaShieldAlt, FaChair, FaCompressAlt, FaRoad,FaCircle, FaCarBattery, FaBolt, FaCircleNotch, FaGasPump, FaCarCrash, FaTint } from "react-icons/fa";
import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import inspectionData from "../../../../data/CarInspection.json"

// 🔹 Function to get icons dynamically based on field name
const getIconForField = (field) => {
  const f = field.toLowerCase();

  if (f.includes("engine")) return <FaCogs size={16} color="#2a3a92" />;
  if (f.includes("transmission") || f.includes("gearbox")) return <FaTools size={16} color="#2a3a92" />;
  if (f.includes("coolant") || f.includes("fluid")) return <FaGasPump size={16} color="#2a3a92" />;
  if (f.includes("mount") || f.includes("belt")) return <FaCircleNotch size={16} color="#2a3a92" />;
  if (f.includes("paint") || f.includes("denting")) return <FaPaintRoller size={16} color="#2a3a92" />;
  if (f.includes("glass") || f.includes("light")) return <FaLightbulb size={16} color="#2a3a92" />;
  if (f.includes("bumper") || f.includes("panel")) return <FaCarSide size={16} color="#2a3a92" />;
  if (f.includes("rust") || f.includes("underbody")) return <FaCarCrash size={16} color="#2a3a92" />;
  if (f.includes("dashboard") || f.includes("electronic")) return <FaBolt size={16} color="#2a3a92" />;
  if (f.includes("seat") || f.includes("upholstery")) return <FaChair size={16} color="#2a3a92" />;
  if (f.includes("carpet") || f.includes("roof")) return <FaCompressAlt size={16} color="#2a3a92" />;
  if (f.includes("safety")) return <FaShieldAlt size={16} color="#2a3a92" />;
  if (f.includes("tyre") || f.includes("tire"))
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2a3a92"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" />
      <line x1="16.2" y1="7.8" x2="19.1" y2="4.9" />
      <line x1="4.9" y1="19.1" x2="7.8" y2="16.2" />
    </svg>
  );
  if (f.includes("water") || f.includes("coolant")) return <FaTint size={16} color="#2a3a92" />;
  if (f.includes("battery")) return <FaCarBattery size={16} color="#2a3a92" />;
  return <FaTachometerAlt size={16} color="#2a3a92" />; // default
};

export default function InspectionReport() {
  return (
    <Row>
      {inspectionData.map((items, index) => (
        <Col xl={6} md={6} xs={12} key={index} className="pb-3">
          <div className="inspectionCardBox py-2 px-2 h-100">
            <div className="hd-jjpst d-flex gap-2 align-items-center justify-content-center">
              <Link href="#" className="d-flex align-items-center gap-2 text-decoration-none">
                <h6 className="fSize-5 fw-semibold m-1 text-dark border-bottonset position-relative">{items.vehicleHealth}</h6>
              </Link>
            </div>
            <div className="pt-2">
              {/* Header row */}
              <div className="carsInspectionsReports d-flex align-items-center justify-content-between gap-2 mb-2 fw-semibold border-bottom pb-2">
                <p className="m-0 fSize-2">Field</p>
                <p className="m-0 fSize-2">Status</p>
              </div>

              {/* Details rows with icons */}
              <div className="alterrnative">
                   {items.details.map((detail, i) => (
                <div
                  key={i}
                  className="carsInspectionsReports d-flex align-items-center justify-content-between gap-2 mb-1"
                >
                  <p className="m-0 fSize-2 fw-normal d-flex align-items-center gap-2">
                    {getIconForField(detail.field)}
                    {detail.field}
                  </p>
                  <p className="m-0 fSize-2 fw-semibold">{detail.status}</p>
                </div>
              ))}
              </div>
             
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}
