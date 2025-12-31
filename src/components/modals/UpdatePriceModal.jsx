"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UpdatePriceModal = ({
  show,
  onHide,
  onConfirm,
  initialListingPrice = "",
  initialOfferPrice = ""
}) => {
  const [listingPrice, setListingPrice] = useState(initialListingPrice);
  const [offerPrice, setOfferPrice] = useState(initialOfferPrice);

  useEffect(() => {
    setListingPrice(initialListingPrice);
    setOfferPrice(initialOfferPrice);
  }, [initialListingPrice, initialOfferPrice, show]);

  const handleUpdate = () => {
    onConfirm({ listingPrice, offerPrice });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <div className="p-4">
        <h5 className="fw-bold text-center fSize-8  mb-4 textColors">Update Price</h5>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="pb-2 ">Listing Price</Form.Label>
            <Form.Control
              type="text"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              placeholder="Enter listing price"
              className="py-3 mb-3"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="pb-2 ">Offer Price</Form.Label>
            <Form.Control
              type="text"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Enter offer price"
              className="py-3"
            />
          </Form.Group>
        </Form>

        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="light"
            className="px-4 border rounded-pill"
            onClick={onHide}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            className="px-4 rounded-pill listing-btn-green"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdatePriceModal;
