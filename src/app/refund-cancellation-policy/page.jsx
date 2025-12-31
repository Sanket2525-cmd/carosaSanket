"use client";
import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import "../../styles/homebanner.css";

export default function page() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  return (
    <div className="topSpacing padding-Y-X font_checlist">
      <Container fluid className="px-md-5 px-2 pt-md-0 pt-4">
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div className="title_topterms">
                <h2 className="fw-bold mb-0">
                  Car<span className="acc-osa">osa</span> — Refund &amp;
                  Cancellation Policy
                </h2>
              </div>
              <div className="rightside_terms">
                <h3 className="fSize-4">
                  Effective Date: <span className="fw-bold">04-11-2025</span>
                </h3>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <Card className="p-4 border-0 shadow-sm rounded-3 card_titles">
              <h4 className="fw-bold mb-3">1. Booking Amount</h4>
              <p>
                The booking amount is a preliminary payment that reserves a vehicle
                or service slot, ensures priority processing, and avoids multiple
                buyers blocking the same car.
              </p>
              <ul>
                <li>
                  <strong>100% Refundable:</strong> Fully refundable with no
                  questions asked.
                </li>
                <li>
                  <strong>No Deductions:</strong> No charges, fees, or penalties
                  upon cancellation.
                </li>
                <li>
                  <strong>Adjustment in Final Payment:</strong> Deducted from the
                  final payable amount during purchase.
                </li>
                <li>
                  <strong>No Time Limit:</strong> Cancel anytime before final
                  confirmation for a full refund.
                </li>
                <li>
                  <strong>Refund Speed:</strong> Initiated instantly and credited
                  within 5–7 business days.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">2. Token Amount</h4>
              <p>
                The token amount is a commitment payment that reserves the vehicle
                exclusively for a short period, ensuring no other customer can book
                or negotiate for it.
              </p>
              <ul>
                <li>
                  <strong>Exclusivity Hold:</strong> Vehicle reserved for 3 days
                  (extendable to 5 days if no auto loan is processed).
                </li>
                <li>
                  <strong>Auto Loan Exception:</strong> Timelines remain flexible
                  based on bank processing.
                </li>
                <li>
                  <strong>Full Refund (Within 3–5 Days):</strong> 100% refund if
                  cancelled within the allowed period.
                </li>
                <li>
                  <strong>After 5 Days:</strong> Refund handled case-to-case based
                  on hold duration, communication, and logistics.
                </li>
                <li>
                  <strong>Deal Confirmation Condition:</strong> Post verbal or
                  digital confirmation (after 24 hours), cancellations are assessed
                  case-to-case.
                </li>
                <li>
                  <strong>Refund Speed:</strong> Initiated within 4–6 hours and
                  credited within 5–7 business days.
                </li>
                <li>
                  <strong>No Hidden Charges:</strong> No cancellation fee unless
                  special preparation was requested.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">3. Service-Related Payments</h4>
              <p>
                Includes inspection, documentation support, doorstep visits,
                verification, expert evaluation, and similar services that require
                manpower and logistics.
              </p>
              <ul>
                <li>
                  <strong>Non-Refundable Once Started:</strong> No refund after the
                  team is assigned or the process begins.
                </li>
                <li>
                  <strong>Pre-Assignment Refund:</strong> Full or partial refund if
                  cancelled before resource allocation.
                </li>
                <li>
                  <strong>Logistics Deductions:</strong> Applicable charges may be
                  deducted for travel or third-party involvement.
                </li>
                <li>
                  <strong>Service Transfer:</strong> Users may transfer the service
                  to another vehicle before initiation.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">4. Insurance Payments</h4>
              <p>
                Insurance purchases are governed by the insurer. Once the policy is
                issued, refunds follow IRDAI and insurer guidelines.
              </p>
              <ul>
                <li>
                  <strong>No Refund After Policy Issuance:</strong> Cancellation is
                  solely at the insurer’s discretion.
                </li>
                <li>
                  <strong>Cooling-Off Period:</strong> Some insurers may allow
                  cancellation within a limited time.
                </li>
                <li>
                  <strong>Incorrect Details:</strong> Data correction is possible,
                  but refunds depend on the insurer.
                </li>
                <li>
                  <strong>Carosa Role:</strong> Carosa only facilitates coordination
                  with the insurer.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">5. Extended Warranty</h4>
              <p>
                Extended warranty covers unexpected repairs and is powered by
                third-party partners.
              </p>
              <ul>
                <li>
                  <strong>Non-Refundable After Activation:</strong> No refunds once
                  the warranty is live.
                </li>
                <li>
                  <strong>Pre-Activation Cancellation:</strong> Refund depends on
                  the partner’s policies.
                </li>
                <li>
                  <strong>Transferable Warranty:</strong> May be transferred to the
                  next owner if the provider permits.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">6. Roadside Assistance (RSA)</h4>
              <p>
                RSA offers towing, battery jumpstart, flat tyre change, and other
                on-road support.
              </p>
              <ul>
                <li>
                  <strong>Refund Before Activation:</strong> Allowed only if RSA
                  has not been activated.
                </li>
                <li>
                  <strong>Non-Refundable Post Activation:</strong> No refunds due to
                  immediate coverage.
                </li>
                <li>
                  <strong>Provider-Based Terms:</strong> Cancellations follow
                  third-party policies.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">7. Vehicle History Report</h4>
              <p>
                Digital reports include RC data, challan records, insurance
                history, blacklist checks, ownership details, and more.
              </p>
              <ul>
                <li>
                  <strong>Instant Digital Delivery:</strong> Reports are generated
                  immediately after payment.
                </li>
                <li>
                  <strong>Non-Refundable:</strong> No refunds once generated.
                </li>
                <li>
                  <strong>Report Failure:</strong> Refund issued if data fetch
                  fails due to system error.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">8. RTO Services</h4>
              <p>Includes RC transfer, NOC, hypothecation removal, address change, duplicate RC, etc.</p>
              <ul>
                <li>
                  <strong>Non-Refundable Once Filed:</strong> No refund after
                  submission to the RTO.
                </li>
                <li>
                  <strong>Pre-Filing Cancellation:</strong> Refund possible after
                  deducting processing/documentation fees.
                </li>
                <li>
                  <strong>Rejection Case:</strong> No refund if rejection is due to
                  customer-side issues.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">9. Challan Payment Assistance</h4>
              <p>Carosa helps clear challans via government-authorized portals.</p>
              <ul>
                <li>
                  <strong>Non-Refundable After Submission:</strong> No refund once
                  submitted for payment.
                </li>
                <li>
                  <strong>Incorrect Data:</strong> Customers must verify challan
                  details before payment.
                </li>
                <li>
                  <strong>Offline Challan Issues:</strong> Refunds follow authority
                  rules if the challan is outdated or invalid.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">10. Car Inspection &amp; PDI</h4>
              <p>
                Pre-Delivery Inspection (PDI) and inspection services cover
                mechanical, electrical, and body evaluations.
              </p>
              <ul>
                <li>
                  <strong>Non-Refundable Once Team Assigned:</strong> Logistics and
                  manpower commitments make refunds impossible.
                </li>
                <li>
                  <strong>Prior Cancellation:</strong> Refund possible after
                  deducting mobilization or visit fees.
                </li>
                <li>
                  <strong>Rescheduling Allowed:</strong> One free schedule change is
                  permitted.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">11. Car Refurbishment</h4>
              <p>Includes denting, painting, detailing, repairs, polishing, and interior work.</p>
              <ul>
                <li>
                  <strong>Non-Refundable After Work Begins:</strong> Materials and
                  labour get engaged immediately.
                </li>
                <li>
                  <strong>Partial Refunds:</strong> Possible only before full work
                  starts, after deducting costs.
                </li>
                <li>
                  <strong>Rework Assurance:</strong> Quality issues are rectified as
                  per service warranty.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">12. Scrap Car Payment</h4>
              <p>
                Refunds are available only before pickup is scheduled. Once pickup
                is assigned or the vehicle reaches the scrap yard, refunds are not
                possible.
              </p>

              <h4 className="fw-bold mt-4 mb-3">13. FASTag Recharge</h4>
              <p>
                FASTag recharge is an instant process. No refund or cancellation is
                possible after a successful recharge. Failed transactions follow
                bank/issuer rules.
              </p>

              <h4 className="fw-bold mt-4 mb-3">14. Driving School</h4>
              <p>
                Carosa connects customers with verified driving schools but does
                not collect payments. All payments and refunds are handled directly
                by the driving school, and Carosa bears no liability.
              </p>

              <h4 className="fw-bold mt-4 mb-3">Additional Policy Guidelines</h4>
              <ul>
                <li>
                  <strong>Transparency First:</strong> All refunds and cancellations
                  are documented and shared for clarity.
                </li>
                <li>
                  <strong>Secure Payments:</strong> Payments via Carosa gateways are
                  encrypted and PCI-DSS compliant.
                </li>
                <li>
                  <strong>Dispute Handling:</strong> Refund disputes are reviewed
                  within 48 hours.
                </li>
                <li>
                  <strong>Partial Refunds:</strong> Deductions may apply when only
                  part of a service is used.
                </li>
                <li>
                  <strong>Order Verification:</strong> Identity verification may be
                  required before initiating refunds.
                </li>
                <li>
                  <strong>Processing Delays:</strong> Bank or gateway delays may
                  occur, especially during holidays.
                </li>
              </ul>

              <div className="faq">
                <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(0)}>What is the refund timeline?</h3>
                  <p className={openFaq === 0 ? "show" : ""}>
                    Refund initiation happens within 4–6 hours of approval. The amount is credited within 5–7 business days depending on payment method.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(1)}>Is the booking amount always refundable?</h3>
                  <p className={openFaq === 1 ? "show" : ""}>
                    Yes, the booking amount is 100% refundable with no questions asked.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(2)}>Can the token amount be refunded after 5 days?</h3>
                  <p className={openFaq === 2 ? "show" : ""}>
                    Yes, but it is handled case‑to‑case depending on the situation and confirmation status.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(3)}>Are service‑related payments refundable?</h3>
                  <p className={openFaq === 3 ? "show" : ""}>
                    Only if the service has not been initiated. Once started, the amount is non‑refundable.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(4)}>Are digital reports refundable?</h3>
                  <p className={openFaq === 4 ? "show" : ""}>
                    No. Digital vehicle reports cannot be refunded once generated.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(5)}>Who handles insurance cancellations?</h3>
                  <p className={openFaq === 5 ? "show" : ""}>
                    Insurance refund/cancellation is managed only by the service provider/insurer.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(6)}>Can I get a refund for refurbishment work?</h3>
                  <p className={openFaq === 6 ? "show" : ""}>
                    Refund is only possible before work starts. After initiation or material purchase, refunds are not allowed.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(7)}>Can FASTag recharge be cancelled?</h3>
                  <p className={openFaq === 7 ? "show" : ""}>
                    No. FASTag recharge is instant and irreversible once processed.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(8)}>Is the booking amount always 100% refundable?</h3>
                  <p className={openFaq === 8 ? "show" : ""}>
                    Yes, booking amount is always 100% refundable with no questions asked.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(9)}>When is the token amount non-refundable?</h3>
                  <p className={openFaq === 9 ? "show" : ""}>
                    Only if cancellation happens after deal confirmation or beyond the allowed period. Decisions are case-specific.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(10)}>Are digital reports refundable?</h3>
                  <p className={openFaq === 10 ? "show" : ""}>
                    No, vehicle history reports are non-refundable once generated.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(11)}>Can service-related payments be refunded?</h3>
                  <p className={openFaq === 11 ? "show" : ""}>
                    Only if the service has not been initiated.
                  </p>
                </div>

                <div className="faq-item">
                  <h3 onClick={() => toggleFaq(12)}>Who handles insurance refunds?</h3>
                  <p className={openFaq === 12 ? "show" : ""}>
                    Refund decisions are made by the insurance company, not Carosa.
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

