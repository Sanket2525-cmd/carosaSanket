"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeactivateListingModal = ({
  show,
  onHide,
  onConfirm,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <div className="text-center p-4">
        <h5 className="fw-bold text-primary mb-3">Deactivate Listing</h5>
        <p className="text-muted mb-4">
          Are you sure you want to deactivate this listing?
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="light"
            className="px-4 border rounded-pill"
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="px-4 rounded-pill"
            onClick={onConfirm}
          >
            Deactivate
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeactivateListingModal;
