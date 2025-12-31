"use client";

import React, { useMemo, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";

const Procurement = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("listing");

  const data = useMemo(() => ({
    listing: [
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', hub: 'Carosa Drive Hub, Varanasi', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', hub: 'Carosa Drive Hub, Varanasi', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', hub: 'Carosa Drive Hub, Varanasi', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
    ],
    bestoffer: [
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Negotiation in Progress', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Offer Submitted', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Counter Offer Received', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
    ],
    testdrive: [
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Scheduled for Mon, 20 Oct 11:00 AM', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Pending Confirmation', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', status: 'Reschedule Requested', img: 'https://cdn.pixabay.com/photo/2017/01/06/19/15/chevrolet-1956597_1280.jpg' },
    ],
    order: [
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', tokenTime: 'Fri, 17 Oct 2025 — 06:45 PM' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', tokenTime: 'Sat, 18 Oct 2025 — 11:20 AM' },
      { title: 'Tata Indigo eCS LS CR4 BS-IV 2011', did: 'I416955602', sp: '₹1.60 Lakh', np: '₹1.52 Lakh', hub: 'Carosa Drive Hub, Varanasi', tokenTime: 'Sat, 18 Oct 2025 — 03:05 PM' },
    ],
  }), []);

  const ListingCard = ({ item }) => (
    <div className="dealers-card p-4 procurement-card">
      <div className="d-flex flex-column flex-md-row align-items-center gap-4">
        <img src={item.img} alt="car" className="procurement-car-image" />
        <div className="flex-1 w-100">
          <div className="d-flex justify-content-between align-items-start gap-4">
            <div>
              <h3 className="procurement-title">{item.title}</h3>
              <p className="procurement-did">DID: {item.did}</p>
              <div className="d-flex flex-wrap gap-4 procurement-details">
                <p className="text-black"><b>Selling Price:</b> {item.sp}</p>
                <p className="text-black"><b>Drive Hub:</b> {item.hub}</p>
              </div>
            </div>
            <div className="d-grid gap-2 procurement-actions">
              <Button className="td-btn td-btn-green" onClick={() => onNavigate?.('listing')}>View Listing</Button>
              <Button className="td-btn td-btn-primary" onClick={() => onNavigate?.('inspection')}>View Inspection Report</Button>
              <Button className="td-btn procurement-amber" onClick={() => onNavigate?.('best-offer')}>Make Best Offer</Button>
              <Button className="td-btn procurement-orange" onClick={() => onNavigate?.('test-drive')}>Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BestOfferCard = ({ item }) => (
    <div className="dealers-card p-4 procurement-card">
      <div className="d-flex flex-column flex-md-row align-items-center gap-4">
        <img src={item.img} alt="car" className="procurement-car-image" />
        <div className="flex-1 w-100">
          <div className="d-flex justify-content-between align-items-start gap-4">
            <div>
              <h3 className="procurement-title">{item.title}</h3>
              <p className="procurement-did">DID: {item.did}</p>
              <div className="d-flex flex-wrap gap-4 procurement-details">
                <p className="text-black"><b>Selling Price:</b> {item.sp}</p>
                <p className="text-black"><b>Negotiated Price:</b> {item.np}</p>
                <p className="text-black"><b>Drive Hub:</b> {item.hub}</p>
              </div>
            </div>
            <div className="procurement-right">
              <div className="procurement-status">Status: {item.status}</div>
              <Button className="td-btn td-btn-primary mt-2" onClick={() => onNavigate?.('best-offer')}>View Offer Status</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TestDriveCard = ({ item }) => (
    <div className="dealers-card p-4 procurement-card">
      <div className="d-flex flex-column flex-md-row align-items-center gap-4">
        <img src={item.img} alt="car" className="procurement-car-image" />
        <div className="flex-1 w-100">
          <div className="d-flex justify-content-between align-items-start gap-4">
            <div>
              <h3 className="procurement-title">{item.title}</h3>
              <p className="procurement-did">DID: {item.did}</p>
              <div className="d-flex flex-wrap gap-4 procurement-details">
                <p className="text-black"><b>Selling Price:</b> {item.sp}</p>
                <p className="text-black"><b>Negotiated Price:</b> {item.np}</p>
                <p className="text-black"><b>Drive Hub:</b> {item.hub}</p>
              </div>
            </div>
            <div className="procurement-right">
              <div className="procurement-status">Status: {item.status}</div>
              <Button className="td-btn td-btn-primary mt-2" onClick={() => onNavigate?.('test-drive')}>View Offer Status</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderCard = ({ item }) => (
    <div className="dealers-card p-4 procurement-card">
      <div className="d-flex justify-content-between align-items-start gap-4">
        <div>
          <h3 className="procurement-title">{item.title}</h3>
          <p className="procurement-did">DID: {item.did}</p>
          <div className="d-flex flex-wrap gap-4 procurement-details">
            <p className="text-black"><b>Selling Price:</b> {item.sp}</p>
            <p className="text-black"><b>Negotiated Price:</b> {item.np}</p>
            <p className="text-black"><b>Drive Hub:</b> {item.hub}</p>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2">
          <div className="procurement-token">Token Amount Paid: 12,200 • {item.tokenTime}</div>
          <Button className="td-btn td-btn-primary" onClick={() => onNavigate?.('orders')}>View Order Status</Button>
        </div>
      </div>
    </div>
  );

  const renderCards = () => {
    const items = data[activeTab] || [];
    const CardComp = activeTab === 'listing' ? ListingCard : activeTab === 'bestoffer' ? BestOfferCard : activeTab === 'testdrive' ? TestDriveCard : OrderCard;
    return items.map((it, i) => <CardComp key={i} item={it} />);
  };

  return (
    <div className="dashboard-content">
      {/* Header */}
       <div className="topheader-cards mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
            Procurement
          </h2>
           <div className="d-flex flex-wrap gap-2 ">
        <Button className={`procure-tab ${activeTab==='listing'?'procure-tab-active':''}`} onClick={() => setActiveTab('listing')}>Listing</Button>
        <Button className={`procure-tab ${activeTab==='bestoffer'?'procure-tab-active':''}`} onClick={() => setActiveTab('bestoffer')}>Best Offer</Button>
        <Button className={`procure-tab ${activeTab==='testdrive'?'procure-tab-active':''}`} onClick={() => setActiveTab('testdrive')}>Test Drive</Button>
        <Button className={`procure-tab ${activeTab==='order'?'procure-tab-active':''}`} onClick={() => setActiveTab('order')}>Order</Button>
      </div>
        </div>
      </div>

      

      {/* Title */}


      {/* List */}
      {/* <div className="procurement-list">
        {renderCards()}
      </div> */}
    </div>
  );
};

export default Procurement;


