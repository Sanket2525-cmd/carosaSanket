
// "use client";

// import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

// export default function CarDetails() {
//   return (
//     <Container
//   fluid
//   className="py-3 px-lg-5"
//   style={{ marginTop: "90px", backgroundColor: "#EAF8FF" }}
// >


//       {/* 🔹 BREADCRUMB / TOP BAR */}
//       <div
//   className="px-3 py-2 mb-3 rounded shadow-sm"
//   style={{ fontSize: "13px", backgroundColor: "#EAF8FF" }}
// >
//   <span className="text-muted">Carosa Care</span>
//   <span className="mx-2 text-muted">›</span>
//   <span className="text-muted">Check Car Details</span>
//   <span className="mx-2 text-muted">›</span>
//   <span className="fw-semibold text-dark">Car Details</span>
// </div>


//       {/* 🔹 VEHICLE HEADER */}
//       <Card className="mb-3 shadow-sm">
//   <Card.Body className="d-flex align-items-center justify-content-between gap-3">

//     {/* 🔹 LEFT IMAGE */}
//     <div
//       className="d-flex align-items-center justify-content-center"
//       style={{
//         width: "56px",
//         height: "56px",
//         borderRadius: "10px",
//         backgroundColor: "#F3F8FF",
//       }}
//     >
//       <img
//         src="/images/detailCar3.png"   // apna car icon yaha rakho
//         alt="Car"
//         style={{ width: "32px", height: "32px" }}
//       />
//     </div>

//     {/* 🔹 MIDDLE CONTENT */}
//     <div className="flex-grow-1 ms-2">
//       <small className="text-muted d-block">Vehicle No.</small>
//       <h6 className="mb-0 fw-bold">DL33AB4590</h6>
//     </div>

//     {/* 🔹 RIGHT BUTTON */}
//     <Button
//       size="sm"
//       className="rounded-pill px-3"
//       style={{ backgroundColor: "#7AC943", border: "none" }}
//     >
//       Change Vehicle No
//     </Button>

//   </Card.Body>
// </Card>


//       {/* 🔹 STATUS BAR */}
//       <div
//   className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3"
//   style={{
//     padding: "14px 18px",
//     borderRadius: "14px",
//   }}
// >
//   {/* 🔹 LEFT CONTENT */}
//   <div>
//     <h6 className="fw-bold mb-1">
//       Payable on <span style={{ color: "#6CC04A" }}>CAROSA</span>
//     </h6>
//     <small className="text-muted">
//       Challans that can be settled online on CAROSA
//     </small>
//   </div>

//   {/* 🔹 RIGHT PILLS */}
//   <div
//     className="d-flex align-items-center gap-2 mt-2 mt-md-0"
//     style={{
//       backgroundColor: "#fff",
//       padding: "4px",
//       borderRadius: "999px",
//     }}
//   >
//     <div
//       style={{
//         backgroundColor: "#F7931E",
//         color: "#fff",
//         padding: "8px 16px",
//         borderRadius: "999px",
//         fontSize: "13px",
//         fontWeight: 600,
//       }}
//     >
//       Pending Challan 03
//     </div>

//     <div
//       style={{
//         padding: "8px 16px",
//         borderRadius: "999px",
//         fontSize: "13px",
//         fontWeight: 600,
//         color: "#000",
//       }}
//     >
//       Paid Challan 02
//     </div>
//   </div>
// </div>


//       {/* 🔹 CHALLAN LIST */}
//       {/* 🔹 TOP STRIP (UI HEADER) */}
// <div
//   className="d-flex justify-content-between align-items-center mb-3 px-2"
//   style={{
//     borderTop: "1px solid #E6EEF5",
//     paddingTop: "14px",
//   }}
// >
//   <h6 className="fw-bold mb-0">3 Online Challans</h6>
//   <span
//     style={{
//       color: "#F7931E",
//       fontWeight: 600,
//       fontSize: "14px",
//       cursor: "pointer",
//     }}
//   >
//     Deselect All
//   </span>
// </div>

// {/* 🔹 CHALLAN CARDS */}
// <Row className="g-4">
//   {[
//     {
//       reason: "Without helmet",
//       date: "28 Nov, 2025 at 2:18 PM",
//     },
//     {
//       reason: "Without helmet",
//       date: "21 Nov, 2025 at 1:30 PM",
//     },
//     {
//       reason: "Driving Two-wheeled without helmets",
//       date: "28 Nov, 2025 at 2:18 PM",
//     },
//   ].map((item, index) => (
//     <Col lg={6} md={6} key={index}>
//       <Card
//         className="h-100 border-0 shadow-sm"
//         style={{ borderRadius: "14px" }}
//       >
//         <Card.Body className="p-4">

//           {/* 🔹 CARD TOP */}
//           <div className="d-flex justify-content-between align-items-start mb-2">
//             <span
//               style={{
//                 backgroundColor: "#EAF6FF",
//                 padding: "6px 12px",
//                 borderRadius: "6px",
//                 fontSize: "13px",
//               }}
//             >
//               E-Challan
//             </span>

//             <span
//               style={{
//                 width: "18px",
//                 height: "18px",
//                 backgroundColor: "#F7931E",
//                 borderRadius: "4px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#fff",
//                 fontSize: "12px",
//                 fontWeight: "bold",
//               }}
//             >
//               ✓
//             </span>
//           </div>

//           {/* 🔹 CHALLAN NO */}
//           <p className="mb-2 small text-primary">
//             Challan no: UP4231525127035203
//           </p>

//           {/* 🔹 AMOUNT */}
//           <h5 className="fw-bold mb-1">₹1,000</h5>
//           <p className="mb-2">{item.reason}</p>

//           {/* 🔹 DATE */}
//           <small className="text-muted d-block mb-3">
//             Issued On {item.date}
//           </small>

//           <hr />

//           {/* 🔹 CARD FOOTER */}
//           <div className="d-flex justify-content-between align-items-center">
//             <span className="fw-semibold text-primary">
//               Pending Since <span className="text-success">25 days</span>
//             </span>

//             <Button
//               size="sm"
//               className="rounded-pill px-4"
//               style={{
//                 backgroundColor: "#0B3C89",
//                 border: "none",
//               }}
//             >
//               Get Details
//             </Button>
//           </div>

//         </Card.Body>
//       </Card>
//     </Col>
//   ))}
// </Row>


//       {/* 🔹 FOOTER TOTAL */}
//       <Card
//   className="mt-4 shadow-sm border-0"
//   style={{ borderRadius: "14px", overflow: "hidden" }}
// >
//   {/* 🔹 GREEN INFO STRIP */}
//   <div
//     style={{
//       backgroundColor: "#8CD63F",
//       color: "#fff",
//       textAlign: "center",
//       padding: "8px 12px",
//       fontSize: "14px",
//       fontWeight: 500,
//     }}
//   >
//     Online challans get settled in 7 working days
//   </div>

//   {/* 🔹 MAIN CONTENT */}
//   <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 px-4 py-3">
//     {/* LEFT */}
//     <div>
//       <small className="text-muted">Total 3 Challan Selected</small>
//       <h5 className="fw-bold mb-0">₹3,000</h5>
//     </div>

//     {/* RIGHT BUTTONS */}
//     <div className="d-flex gap-3">
//       <Button
//         className="rounded-pill px-4"
//         style={{
//           backgroundColor: "#F7931E",
//           border: "none",
//         }}
//       >
//         Settle Offline Challan
//       </Button>

//       <Button
//         className="rounded-pill px-4"
//         style={{
//           backgroundColor: "#0B3C89",
//           border: "none",
//         }}
//       >
//         Continue to Pay
//       </Button>
//     </div>
//   </Card.Body>
// </Card>


//     </Container>
//   );
// }








"use client";

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../styles/carosacare.css";

export default function CarDetails() {
  return (
    <Container fluid className="car-details-container">

      {/* 🔹 BREADCRUMB */}
      <div className="breadcrumb-bar">
        <span className="text-muted">Carosa Care</span>
        <span className="mx-2 text-muted">›</span>
        <span className="text-muted">Check Car Details</span>
        <span className="mx-2 text-muted">›</span>
        <span className="fw-semibold text-dark">Car Details</span>
      </div>

      {/* 🔹 VEHICLE HEADER */}
      <Card className="vehicle-card shadow-sm mb-3">
        <Card.Body className="vehicle-card-body">
          <div className="vehicle-icon">
            <img src="/images/detailCar3.png" alt="Car" />
          </div>

          <div className="vehicle-info">
            <small className="text-muted d-block">Vehicle No.</small>
            <h6 className="fw-bold mb-0">DL33AB4590</h6>
          </div>

          <Button size="sm" className="change-vehicle-btn">
            Change Vehicle No
          </Button>
        </Card.Body>
      </Card>

      {/* 🔹 STATUS BAR */}
      <div className="status-bar">
        <div>
          <h6 className="fw-bold mb-1">
            Payable on <span className="carosa-text">CAROSA</span>
          </h6>
          <small className="text-muted">
            Challans that can be settled online on CAROSA
          </small>
        </div>

        <div className="status-pills">
          <span className="pill active">Pending Challan 03</span>
          <span className="pill">Paid Challan 02</span>
        </div>
      </div>

      {/* 🔹 ONLINE CHALLANS HEADER */}
      <div className="online-challan-header">
        <h6 className="fw-bold mb-0">3 Online Challans</h6>
        <span className="deselect-text">Deselect All</span>
      </div>

      {/* 🔹 CHALLAN CARDS */}
      <Row className="g-4">
        {[
          { reason: "Without helmet", date: "28 Nov, 2025 at 2:18 PM" },
          { reason: "Without helmet", date: "21 Nov, 2025 at 1:30 PM" },
          { reason: "Driving Two-wheeled without helmets", date: "28 Nov, 2025 at 2:18 PM" },
        ].map((item, index) => (
          <Col lg={6} md={6} key={index}>
            <Card className="challan-card shadow-sm">
              <Card.Body className="p-4">
                <div className="challan-top">
                  <span className="challan-type">E-Challan</span>
                  <span className="challan-check">✓</span>
                </div>

                <p className="challan-no">
                  Challan no: UP4231525127035203
                </p>

                <h5 className="fw-bold mb-1">₹1,000</h5>
                <p className="mb-2">{item.reason}</p>

                <small className="text-muted d-block mb-3">
                  Issued On {item.date}
                </small>

                <hr />

                <div className="challan-footer">
                  <span className="pending-text">
                    Pending Since <span>25 days</span>
                  </span>

                  <Button size="sm" className="details-btn">
                    Get Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 🔹 FOOTER TOTAL */}
      <Card className="summary-card shadow-sm mt-4">
        <div className="summary-top">
          Online challans get settled in 7 working days
        </div>

        <Card.Body className="summary-body">
          <div>
            <small className="text-muted">Total 3 Challan Selected</small>
            <h5 className="fw-bold mb-0">₹3,000</h5>
          </div>

          <div className="summary-actions">
            <Button className="offline-btn">Settle Offline Challan</Button>
            <Button className="pay-btn">Continue to Pay</Button>
          </div>
        </Card.Body>
      </Card>

    </Container>
  );
}
