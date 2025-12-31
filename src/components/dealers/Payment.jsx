"use client";

import React, { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("token");

  const tokenRows = [
    { date: "17 Oct 2025, 06:45 PM", car: "Tata Indigo eCS LS CR4 BS-IV 2011", reg: "HR26CG1988", listingId: "I416955602", orderId: "O-2025-00087", listingPrice: "₹1.60 Lakh", tokenPaid: "₹12,200", txnId: "TXN-98KJ-7721" },
  ];

  const payoutRows = [
    { date: "21 Oct 2025, 05:10 PM", car: "Tata Indigo eCS LS CR4 BS-IV 2011", reg: "HR26CG1988", listingId: "I416955602", orderId: "O-2025-00087", token: "₹12,200", total: "₹1,52,000" },
  ];

  return (
    <div className="dashboard-content">
      {/* Header */}
        <div className="topheader-cards mb-3">
         <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
           <h2 className="fSize-8 fs-md-1 fw-bold mb-0">
            Billing & Payment
           </h2>
         <div className="d-flex flex-wrap gap-2 ">
        <Button id="tab-token" className={`payment-tab ${activeTab==='token'?'payment-tab-active':''}`} onClick={() => setActiveTab('token')}>Token Amount History</Button>
        <Button id="tab-payout" className={`payment-tab ${activeTab==='payout'?'payment-tab-active':''}`} onClick={() => setActiveTab('payout')}>Payout History & Invoice</Button>
      </div>
         </div>
       </div>

   

      {/* Tabs */}
     

  
      {/* {activeTab === 'token' && (
        <div id="billing-token" className="dealers-card p-3 p-md-3">
          <h3 className="fs-6 fw-bold mb-3">Token Amount History</h3>
          <div className="payment-table-wrap">
            <table className="payment-table">
              <thead className="payment-thead">
                <tr>
                  <th>Date</th>
                  <th>Car Details</th>
                  <th>Reg. No.</th>
                  <th>Listing ID</th>
                  <th>Order ID</th>
                  <th>Listing Price</th>
                  <th>Token Amount Paid</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {tokenRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.car}</td>
                    <td>{r.reg}</td>
                    <td>{r.listingId}</td>
                    <td>{r.orderId}</td>
                    <td>{r.listingPrice}</td>
                    <td className="fw-semibold">{r.tokenPaid}</td>
                    <td className="text-muted">{r.txnId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payout' && (
        <div id="billing-payout" className="dealers-card p-3">
          <h3 className="fs-6 fw-bold mb-3">Payout History & Invoice</h3>
          <div className="payment-table-wrap">
            <table className="payment-table">
              <thead className="payment-thead">
                <tr>
                  <th>Payment Date</th>
                  <th>Car Details</th>
                  <th>Reg. No.</th>
                  <th>Listing ID</th>
                  <th>Order ID</th>
                  <th>Token Amount</th>
                  <th>Total Amount</th>
                  <th className="text-end">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.car}</td>
                    <td>{r.reg}</td>
                    <td>{r.listingId}</td>
                    <td>{r.orderId}</td>
                    <td>{r.token}</td>
                    <td className="fw-semibold">{r.total}</td>
                    <td className="text-end">
                      <Button className="payment-invoice-btn">Download Invoice</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Payment;


