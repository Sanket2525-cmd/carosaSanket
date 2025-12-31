"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/services/useDebounce";
import TestDriveService from "@/services/testDriveService";
import { API_BASE_URL } from "@/config/environment";

const TestDrive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch test drives with payments
  useEffect(() => {
    const fetchTestDrives = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await TestDriveService.getDealerTestDrivesWithPayments(debouncedSearch);
        if (response.success) {
          setItems(response.data?.cars || []);
        } else {
          setError(response.error || "Failed to fetch test drives");
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching test drives:", err);
        setError("An error occurred while fetching test drives");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDrives();
  }, [debouncedSearch]);

  const openModal = (idx) => {
    setSelectedItem(items[idx]);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  // Format date and time for display
  const formatDateTime = (dateTimeObj) => {
    if (!dateTimeObj || !dateTimeObj.combined) return "N/A";
    return dateTimeObj.combined;
  };

  // Helper function to get proper image URL
  const getCarImageUrl = (item) => {
    if (!item.img) return '/images/default-car.jpg';
    
    // If image URL is already a full URL (starts with http), return as is
    if (item.img.startsWith('http://') || item.img.startsWith('https://')) {
      return item.img;
    }
    
    // If it's a relative path, prepend API_BASE_URL
    // Remove leading slash if present to avoid double slashes
    const imagePath = item.img.startsWith('/') ? item.img : `/${item.img}`;
    return `${API_BASE_URL}${imagePath}`;
  };

  const Card = ({ item, index }) => (
    <div className="dealers-card p-4 test-drive-card">
      <div className="d-flex flex-column flex-md-row align-items-center gap-4">
        <img 
          src={getCarImageUrl(item)} 
          alt={item.title || "car"} 
          className="test-drive-car-image"
          onError={(e) => {
            e.target.src = '/images/default-car.jpg';
          }}
        />
        <div className="flex-1 w-100">
          <div className="d-flex justify-content-between align-items-start gap-4">
            <div>
              <h3 className="test-drive-title">{item.title}</h3>
              <p className="test-drive-did">DID: {item.id}</p>
              <p className="test-drive-reg">Reg. No.: <span className="fw-semibold">{item.registrationNo}</span></p>
              <div className="d-flex flex-wrap gap-4 test-drive-details">
                <p className="text-black"><strong>Active Since:</strong> {item.activeSince}</p>
                <p className="text-black"><strong>Last Modified:</strong> {item.lastModified}</p>
              </div>
            </div>
            <div className="test-drive-actions">
              <Button className="test-drive-btn" onClick={() => openModal(index)}>
                {item.testDrives} Test Drive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-content">
      {/* Header */}


      {/* Title */}
      <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 ">
        <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Test Drive</h2>
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
   
      {/* Filters */}

      {/* List */}
      <Row>
        <Col lg={12}>
          {loading ? (
            <div className="dv2-offerlist">
              <div className="card dv2-card p-5 text-center">
                <h5>Loading...</h5>
              </div>
            </div>
          ) : error ? (
            <div className="dv2-offerlist">
              <div className="card dv2-card p-5 text-center">
                <h5 className="text-danger">Error</h5>
                <p className="text-muted">{error}</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="dv2-offerlist">
              <div className="card dv2-card p-5 text-center">
                <h5>No Test Drives Found</h5>
                <p className="text-muted">You don't have any cars with test drives that have payments made yet.</p>
              </div>
            </div>
          ) : (
            <div className="test-drive-list">
              {items.map((item, index) => (
                <Card key={item.carId || index} item={item} index={index} />
              ))}
            </div>
          )}
        </Col>
      </Row>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="test-drive-modal-bg" onClick={closeModal}>
          <div className="test-drive-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-start justify-content-between gap-4 mb-3">
              <div>
                <h3 className="test-drive-modal-title">Test Drive – {selectedItem.title}</h3>
                <p className="test-drive-modal-subtitle">DID: {selectedItem.id} • Total Requests: {selectedItem.testDrives}</p>
              </div>
              <Button onClick={closeModal} className="test-drive-modal-close-btn">Close</Button>
            </div>
            <div className="test-drive-modal-table-container">
              <table className="test-drive-modal-table">
                <thead className="test-drive-modal-thead">
                  <tr>
                    <th className="test-drive-modal-th">#</th>
                    <th className="test-drive-modal-th">Buyer Name</th>
                    <th className="test-drive-modal-th">Test Drive Day, Date & Time</th>
                    <th className="test-drive-modal-th text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem?.testDriveDetails && selectedItem.testDriveDetails.length > 0 ? (
                    selectedItem.testDriveDetails.map((td, i) => (
                      <tr className="test-drive-modal-tr" key={td.id || i}>
                        <td className="test-drive-modal-td">{i + 1}</td>
                        <td className="test-drive-modal-td fw-medium">{td.buyerName}</td>
                        <td className="test-drive-modal-td">{formatDateTime(td.scheduledAt)}</td>
                        <td className="test-drive-modal-td text-end">
                          <div className="d-inline-flex gap-2">
                            {td.payment && (
                              <span className="badge bg-success me-2">
                                Payment: ₹{(td.payment.amount / 100).toFixed(2)}
                              </span>
                            )}
                            <span className="badge bg-info">{td.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No test drive details available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDrive;


