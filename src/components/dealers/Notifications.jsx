"use client";

import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const Notifications = () => {
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([
    {icon:'💰', title:'Best Offer Approved', desc:'Your offer for Tata Nexon was accepted.', time:'2 hours ago', new:true},
    {icon:'🚗', title:'New Test Drive Request', desc:'A customer has requested a test drive for Hyundai i20.', time:'4 hours ago', new:true},
    {icon:'📦', title:'Order Confirmed', desc:'Order #1023 confirmed for Maruti Suzuki Swift.', time:'Yesterday', new:false},
    {icon:'📰', title:'Company Announcement', desc:'Carosa introduces a new dealer rewards program.', time:'2 days ago', new:false},
    {icon:'📢', title:'System Maintenance', desc:'Scheduled maintenance on Oct 25, 2025.', time:'3 days ago', new:false}
  ]);

  const filterOptions = ['All', 'Best Offer', 'Test Drive', 'Order', 'Company News', 'Announcements'];

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    // In a real app, this would filter the notifications
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, new: false }))
    );
  };

  const handleLoadMore = () => {
    // In a real app, this would load more notifications
    console.log('Loading more notifications...');
  };

  const getFilteredNotifications = () => {
    if (filter === 'All') return notifications;
    return notifications.filter(notif => {
      switch (filter) {
        case 'Best Offer':
          return notif.title.includes('Best Offer');
        case 'Test Drive':
          return notif.title.includes('Test Drive');
        case 'Order':
          return notif.title.includes('Order');
        case 'Company News':
          return notif.title.includes('Company');
        case 'Announcements':
          return notif.title.includes('System');
        default:
          return true;
      }
    });
  };

  const getTodayNotifications = () => {
    return getFilteredNotifications().filter(notif => notif.time.includes('hour'));
  };

  const getThisWeekNotifications = () => {
    return getFilteredNotifications().filter(notif => 
      notif.time.includes('day') || notif.time === 'Yesterday'
    );
  };

  const NotificationCard = ({ notification }) => (
    <div className={`notification-card ${notification.new ? 'notification-new' : ''}`}>
      <div className="notification-icon">{notification.icon}</div>
      <div className="notification-content">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="notification-title fw-bold fs-6">{notification.title}</h3>
          <span className="notification-time">{notification.time}</span>
        </div>
        <p className="notification-desc">{notification.desc}</p>
      </div>
      {notification.new && <span className="notification-dot"></span>}
    </div>
  );

  return (
    <div className="dashboard-content">
      {/* Header Section */}
        <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
           Notification
          </h2>
           <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <Form.Select 
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="notification-filter"
              >
                {filterOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </Form.Select>
              <Button 
                className="notification-mark-btn"
                onClick={handleMarkAllRead}
              >
                Mark All as Read
              </Button>
            </div>
            {/* <div className="notification-info">Showing recent notifications</div> */}
          </div>
        </div>
      </div>


   
 

    
      {/* <Row className="mb-4">
        <Col lg={12}>
          <div className="notification-feed">
            {getTodayNotifications().length > 0 && (
              <>
                <div className="notification-section-title">Today</div>
                {getTodayNotifications().map((notification, index) => (
                  <NotificationCard key={index} notification={notification} />
                ))}
              </>
            )}

            {getThisWeekNotifications().length > 0 && (
              <>
                <div className="notification-section-title">This Week</div>
                {getThisWeekNotifications().map((notification, index) => (
                  <NotificationCard key={index} notification={notification} />
                ))}
              </>
            )}

          
            <div className="notification-section-title">Earlier</div>
            <div className="notification-empty">No notifications</div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="text-center">
          <Button 
            className="notification-load-btn"
            onClick={handleLoadMore}
          >
            Load More Notifications
          </Button>
        </Col>
      </Row> */}
    </div>
  );
};

export default Notifications;
