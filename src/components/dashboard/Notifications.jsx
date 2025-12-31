"use client";

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [toggle, setToggle] = useState(false);

  const allNotifications = [
    {
      id: 1,
      type: 'offer',
      badge: 'Offer',
      badgeColor: '#F59E0B',
      title: 'New counter-offer on Hyundai Venue',
      description: 'Seller reduced price to ₹8.6 Lakh. Review before it expires.',
      time: '2m ago',
      actions: [{label: 'View Offer', primary: true}, {label: 'Mark read'}]
    },
    {
      id: 2,
      type: 'test-drive',
      badge: 'Test Drive',
      badgeColor: '#10B981',
      title: 'Test drive confirmed – Maruti Suzuki Baleno (OID 78422)',
      description: 'Location: Carosa Hub, Jaunpur • Contact: +91 98765 43210',
      time: 'Today, 4:30 PM',
      actions: [{label: 'View Details', primary: true}, {label: 'Mark read'}]
    },
    {
      id: 3,
      type: 'announcement',
      badge: 'Announcement',
      badgeColor: '#6366F1',
      title: 'Festival Sale: Zero convenience fee this weekend',
      description: 'Buyers get free RC transfer assistance on bookings made by Sunday 11:59 PM.',
      time: '1h ago',
      actions: [{label: 'Learn more', primary: true}, {label: 'Mark read'}]
    },
    {
      id: 4,
      type: 'kyc',
      badge: 'KYC',
      badgeColor: '#84CC16',
      title: 'KYC Verification Pending',
      description: 'Complete your profile to unlock best offers and instant chat.',
      time: '10m ago',
      actions: [{label: 'Complete KYC', primary: true}, {label: 'Mark read'}]
    },
    {
      id: 5,
      type: 'system',
      badge: 'System',
      badgeColor: '#6B7280',
      title: 'System update',
      description: 'We improved search and added a new sidebar design.',
      time: 'Yesterday',
      actions: [{label: 'Dismiss'}]
    }
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'offer', label: 'Offers' },
    { id: 'test-drive', label: 'Test Drive' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'kyc', label: 'KYC' },
    { id: 'system', label: 'System' }
  ];

  // Filter notifications based on active tab
  const notifications =
    activeTab === "all"
      ? allNotifications
      : allNotifications.filter((notif) => notif.type === activeTab);

  const handleToggle = () => {
    setToggle(!toggle);
    if (!toggle) {
      setShowModal(true);
    } else {
      // when toggled OFF manually
      setShowModal(false);
    }
  };

  // ✅ Save handler — closes modal, keeps toggle ON
  const handleSave = () => {
    setShowModal(false);
    setToggle(true); // keep toggle ON
  };

  // ❌ Undo or close handler — closes modal and turns toggle OFF
  const handleUndoOrClose = () => {
    setShowModal(false);
    setToggle(false);
  };

  return (
    <div className="dv2-notifications">
      {/* Header */}
      <div className="card dv2-card p-4 mb-4">
        <div className="d-flex justify-content-between flex-wrap align-items-center">
          <h3 className="fw-bold mb-0 d-flex gap-3 align-items-center">
            Notifications
            <Form.Check
              type="switch"
              id="notif-toggle"
              checked={toggle}
              onChange={handleToggle}
            />
          </h3>
          <div className="d-flex flex-wrap gap-2 mt-md-0 mt-3">
            <button className="btn btn-outline-primary rounded-pill px-3 fSize-3">
              Mark all as read
            </button>
            <button className="btn btn-danger rounded-pill px-3 fSize-3">
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card dv2-card p-3 mb-4">
        <div className="d-flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn rounded-pill px-3 fSize-3 ${activeTab === tab.id ? 'btn-primary' : 'btn-light border'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="dv2-notifications-list">
        {notifications.map(notif => (
          <div key={notif.id} className="card dv2-card p-4 mb-3">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex align-items-start gap-3 flex-grow-1">
                <div className="dv2-notif-icon" style={{background: `${notif.badgeColor}20`, color: notif.badgeColor}}>
                  {notif.type === 'offer' && '🎯'}
                  {notif.type === 'test-drive' && '🚗'}
                  {notif.type === 'announcement' && '📢'}
                  {notif.type === 'kyc' && '📋'}
                  {notif.type === 'system' && '⚙️'}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="fw-bold mb-0">{notif.title}</h6>
                    <span className="dv2-notif-badge" style={{background: notif.badgeColor}}>
                      {notif.badge}
                    </span>
                  </div>
                  <p className="text-muted fSize-3 mb-0">{notif.description}</p>
                </div>
              </div>
              <span className="text-muted fSize-2">{notif.time}</span>
            </div>
            
            <div className="d-flex gap-2">
              {notif.actions.map((action, idx) => (
                <button
                  key={idx}
                  className={`btn ${action.primary ? 'btn-primary' : 'btn-light border'} rounded-pill px-3 fSize-3`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal with same design */}
      <Modal
        show={showModal}
        onHide={handleUndoOrClose}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6 className="fw-bold mb-3">Email Notifications</h6>
              <div className="mb-4">
                <Form.Check type="checkbox" label="Promotional Email" defaultChecked className="mb-2" />
                <Form.Check type="checkbox" label="Transactional Email" defaultChecked />
              </div>

              <h6 className="fw-bold mb-3">WhatsApp Notifications</h6>
              <Form.Check type="checkbox" label="Leads & Matches" className="mb-2" />
              <Form.Check type="checkbox" label="Listing Update" className="mb-2" />
              <Form.Check type="checkbox" label="Transactional Update" className="mb-4" />
            </Col>

            <Col md={6}>
              <h6 className="fw-bold mb-3">SMS Notifications</h6>
              <div className="mb-4">
                <Form.Check type="checkbox" label="Promotional SMS" defaultChecked className="mb-2" />
                <Form.Check type="checkbox" label="Transactional SMS" defaultChecked className="mb-2" />
                <Form.Check type="checkbox" label="Order Updates" className="mb-2" />
                <Form.Check type="checkbox" label="Promotional" />
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-start gap-3 px-4 pb-4">
          <Button variant="primary" className="px-4 fw-semibold btn_notification" onClick={handleSave}>
            Save
          </Button>
          <Button
            variant="outline-primary"
            className="px-4 fw-semibold btn_notification"
            onClick={handleUndoOrClose}
          >
            Undo Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
