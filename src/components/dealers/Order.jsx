"use client";

import React, { useMemo, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/services/useDebounce";
const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const orders = useMemo(
    () => [
      {
        oid: "O-2025-00087",
        id: "I416955602",
        regNo: "UP65 AB 1234",
        title: "Tata Indigo eCS LS CR4 BS-IV 2011",
        activeSince: "30 Apr 2025",
        lastModified: "09 Oct 2025",
        tokenTime: "Fri, 17 Oct 2025 — 06:45 PM",
        status: [
          "Token Received",
          "Loan Approved",
          "RTO In Progress",
          "Delivery Scheduled",
        ],
      },
      {
        oid: "O-2025-00088",
        id: "I416955602",
        regNo: "UP65 AB 5678",
        title: "Tata Indigo eCS LS CR4 BS-IV 2011",
        activeSince: "30 Apr 2025",
        lastModified: "09 Oct 2025",
        tokenTime: "Sat, 18 Oct 2025 — 11:20 AM",
        status: ["Token Received", "Loan Under Review"],
      },
      {
        oid: "O-2025-00089",
        id: "I416955602",
        regNo: "UP65 XY 9012",
        title: "Tata Indigo eCS LS CR4 BS-IV 2011",
        activeSince: "30 Apr 2025",
        lastModified: "09 Oct 2025",
        tokenTime: "Sat, 18 Oct 2025 — 03:05 PM",
        status: [
          "Token Received",
          "Loan Approved",
          "Vehicle Ready for Delivery",
        ],
      },
    ],
    []
  );

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const openStatus = (idx) => {
    setSelected(orders[idx]);
    setShowModal(true);
  };
  const closeStatus = () => {
    setSelected(null);
    setShowModal(false);
  };

  const Card = ({ item, index }) => (
    <div className="dealers-card p-4 order-card">
      <div className="d-flex justify-content-between align-items-start gap-4">
        <div className="order-left">
          <div className="small text-muted">Car Details</div>
          <h3 className="order-title">{item.title}</h3>
          <p className="order-reg small text-muted mb-1">
            Reg. No.: {item.regNo}
          </p>
          <p className="order-oid small text-muted mb-1">OID: {item.oid}</p>
          <div className="d-flex flex-wrap gap-4 order-meta">
            <p className="mb-0 text-black">
              <b>Active Since:</b> {item.activeSince}
            </p>
            <p className="mb-0 text-black">
              <b>Last Modified:</b> {item.lastModified}
            </p>
          </div>
        </div>
        <div className="order-right d-flex flex-column align-items-end gap-2">
          <div className="order-token">Token Received • {item.tokenTime}</div>
          <Button
            className="order-status-btn"
            onClick={() => openStatus(index)}
          >
            View Status
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Orders</h2>
          <div className="d-flex justify-content-between align-items-center">
          
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Page will reset via useEffect when debouncedSearch changes
              }}
              placeholder="Search by Name, Model, Reg. No, Brand..."
            />
          </div>
        </div>
      </div>

      {/* Title */}

      {/* Filters */}

      {/* List */}
      {/* <Row>
        <Col lg={12}>
          <div className="order-list">
            {orders.map((o, i) => (
              <Card key={o.oid} item={o} index={i} />
            ))}
          </div>
        </Col>
      </Row> */}

      {/* Modal */}
      {showModal && selected && (
        <div className="order-modal-bg" onClick={closeStatus}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-start justify-content-between gap-4 mb-3">
              <div>
                <h3 className="order-modal-title">
                  Order Status – {selected.title}
                </h3>
                <p className="order-modal-subtitle">
                  OID: {selected.oid} • {selected.tokenTime}
                </p>
              </div>
              <Button onClick={closeStatus} className="order-modal-close-btn">
                Close
              </Button>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 rounded border bg-light">
                  <h4 className="fw-semibold mb-2">Status Timeline</h4>
                  <div className="order-timeline">
                    {selected.status.map((s, i) => (
                      <div className="d-flex align-items-start gap-2" key={i}>
                        <div
                          className={`order-dot ${
                            i === selected.status.length - 1
                              ? "order-dot-amber"
                              : "order-dot-green"
                          }`}
                        ></div>
                        <div>
                          <div className="fw-medium">{s}</div>
                          <div className="text-muted small">#{i + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded border">
                  <h4 className="fw-semibold mb-2">Quick Actions</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <Button className="td-btn td-btn-green">
                      Mark Ready for Delivery
                    </Button>
                    <Button className="td-btn td-btn-primary">
                      Download Invoice
                    </Button>
                    <Button className="td-btn td-btn-red">Cancel Order</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
