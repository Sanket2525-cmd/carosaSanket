"use client";

import React from "react";

const TestDriveModal = ({ show, data, onClose }) => {
  if (!show || !data) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="dashboard-modal-backdrop" onClick={handleBackdropClick}>
      <div className="dashboard-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-3">
          <div>
            <h3 className="dashboard-modal-title mb-1">Test Drive – {data.title}</h3>
            <p className="dashboard-modal-subtitle mb-0">
              DID: {data.did} • Total Requests: {data.totalRequests}
            </p>
          </div>
          <button type="button" className="dashboard-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="dashboard-modal-table-wrapper">
          <table className="table mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Buyer Name</th>
                <th scope="col">Preferred Slot</th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.requests.map((request, index) => (
                <tr key={request.id || `test-drive-${index}`}>
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{request.name}</td>
                  <td>{request.slot}</td>
                  <td className="text-end d-flex flex-wrap justify-content-end gap-2">
                    <button type="button" className="testdrive-action-btn confirm">
                      Confirm
                    </button>
                    <button type="button" className="testdrive-action-btn reschedule">
                      Request Reschedule
                    </button>
                    <button type="button" className="testdrive-action-btn cancel">
                      Request Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestDriveModal;

