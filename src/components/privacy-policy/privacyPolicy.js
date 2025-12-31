import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function PrivacyPolicy() {
  return (
    <div className="topSpacing padding-Y-X font_checlist">
      <Container fluid className="px-md-5 px-2 pt-md-0 pt-4">
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div className="title_topterms">
                <h2 className="fw-bold mb-0">
                  Car<span className="acc-osa">osa</span> — Privacy Policy
                </h2>
              </div>
              <div className="rightside_terms">
                <h3 className="fSize-4">
                  Effective Date: <span className="fw-bold">04-11-2025</span>
                </h3>
                {/* <h3 className="fSize-4">
                  Last Updated: <span className="fw-bold">[Insert Date]</span>
                </h3> */}
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <Card className="p-4 border-0 shadow-sm rounded-3 card_titles">
              <h4 className="fw-bold mb-3">Introductory Declaration</h4>
              <ul>
                <li>
                  This document is an electronic record under the Information
                  Technology Act, 2000 and related rules.
                </li>
                <li>
                  It is generated electronically and does not require physical
                  or digital signatures.
                </li>
                <li>
                  Published in compliance with Rule 3(1) of the IT (Intermediary
                  Guidelines and Digital Media Ethics Code) Rules, 2021, and
                  Rule 4 of the IT (Reasonable Security Practices and Procedures
                  and Sensitive Personal Data or Information) Rules, 2011.
                </li>
                <li>
                  The policy outlines how Carosa collects, uses, stores, and
                  protects user data.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">Definitions</h4>
              <ul>
                <li>
                  “You” / “User” – Any individual or entity using Carosa’s
                  website or app who is legally competent to contract under the
                  Indian Contract Act, 1872.
                </li>
                <li>
                  “We” / “Us” / “Our” – Refers to Carosa and/or its operating
                  company.
                </li>
                <li>“Parties” – Refers collectively to Carosa and the User.</li>
                <li>
                  Headings are for readability only and do not affect
                  interpretation.
                </li>
                <li>
                  Use of the platform implies acceptance of this Privacy Policy
                  and the Terms of Use.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">
                1. Consent for Verification with Government and Authorized
                Databases
              </h4>
              <p>1.1 Users expressly authorize Carosa to:</p>
              <ul>
                <li>
                  Verify vehicle registration, challan status, and ownership
                  through government databases like VAHAN, RTO, and other
                  authorized APIs.
                </li>
                <li>
                  Cross-check details with banks, insurers, and authorized data
                  providers to ensure authenticity.
                </li>
                <li>
                  Use verified information to prevent fraud and maintain
                  platform transparency.
                </li>
              </ul>
              <p>
                1.2 Such verification may include accessing public records or
                official data linked to the User’s submitted information.
              </p>
              <p>
                1.3 No personal data is modified or misused during the
                verification process.
              </p>

              <h4 className="fw-bold mt-4 mb-3">
                2. Consent for Collection and Use of Personal Information
              </h4>
              <p>2.1 By using the platform, Users consent to the collection and processing of:</p>
              <ul>
                <li>Name, contact number, email address, and communication details.</li>
                <li>Location, IP address, and device identifiers.</li>
                <li>Vehicle details (make, model, registration, variant, ownership status).</li>
                <li>Transaction and communication records on the platform.</li>
              </ul>
              <p>
                2.2 Information is collected for legitimate business purposes,
                including identification, service delivery, analytics, and
                compliance.
              </p>
              <p>
                2.3 Users can withdraw consent anytime by emailing{" "}
                <a href="mailto:support@carosa.in" className="text-primary text-decoration-none">
                  support@carosa.in
                </a>
                , subject to service limitations.
              </p>

              <h4 className="fw-bold mt-4 mb-3">3. Purposes of Information Use</h4>
              <p>Carosa may use information for:</p>
              <ul>
                <li>Verifying user identity and vehicle ownership.</li>
                <li>Enabling listings, sales, and purchases of vehicles.</li>
                <li>Processing payments and facilitating buyer-seller communication.</li>
                <li>Sending offers, alerts, and important notifications.</li>
                <li>Enhancing platform functionality and personalizing experience.</li>
                <li>Conducting audits, analytics, and improving platform security.</li>
                <li>Complying with applicable legal and regulatory requirements.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">4. Cookies and Other Identifiers</h4>
              <ul>
                <li>
                  4.1 Carosa uses cookies and similar technologies to:
                  <ul>
                    <li>Maintain user login sessions and security.</li>
                    <li>Remember preferences such as language and display settings.</li>
                    <li>Measure website performance and user engagement.</li>
                    <li>Provide relevant recommendations or ads.</li>
                  </ul>
                </li>
                <li>
                  4.2 Users can disable cookies in browser settings; however,
                  this may affect certain functionalities.
                </li>
                <li>4.3 Carosa does not store personally identifiable data in cookies.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">5. Legitimate Uses & Consent</h4>
              <ul>
                <li>
                  5.1 Carosa processes data under the following lawful bases:
                  <ul>
                    <li>Contractual Necessity: To deliver requested services.</li>
                    <li>
                      Legitimate Interest: To prevent misuse, improve services,
                      and ensure platform safety.
                    </li>
                    <li>
                      Legal Obligation: To comply with court or government
                      orders.
                    </li>
                  </ul>
                </li>
                <li>
                  5.2 Consent is taken explicitly during registration, listing,
                  or communication activities.
                </li>
                <li>
                  5.3 Users have the right to revoke consent; however, access to
                  certain features may be restricted thereafter.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">
                6. Limiting Use, Disclosure & Transfer of User Data
              </h4>
              <ul>
                <li>
                  6.1 Carosa will not sell, trade, or rent user information to
                  any unauthorized third party.
                </li>
                <li>
                  6.2 Data may be shared only with:
                  <ul>
                    <li>
                      Authorized service providers, payment gateways, or
                      logistics partners.
                    </li>
                    <li>
                      Government authorities or regulators for lawful requests.
                    </li>
                    <li>
                      Technology vendors for hosting, storage, or analytics,
                      under strict confidentiality.
                    </li>
                  </ul>
                </li>
                <li>
                  6.3 All third parties are bound by non-disclosure agreements
                  and data protection obligations.
                </li>
                <li>
                  6.4 Data transfers (if any) are handled securely following
                  Indian data protection standards.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">7. User’s Rights</h4>
              <ul>
                <li>Access: Request details of their stored data.</li>
                <li>Correction: Update or rectify inaccurate information.</li>
                <li>Deletion: Request account or data removal, subject to legal obligations.</li>
                <li>Withdrawal: Revoke consent for specific data uses.</li>
                <li>
                  Grievance Redressal: Raise data-related concerns at{" "}
                  <a href="mailto:support@carosa.in">support@carosa.in</a>.
                </li>
              </ul>
              <p>
                Carosa will respond to such requests within a reasonable time
                frame as mandated by law.
              </p>

              <h4 className="fw-bold mt-4 mb-3">8. APIs & Third-Party Integrations</h4>
              <ul>
                <li>
                  8.1 Carosa integrates with third-party APIs to:
                  <ul>
                    <li>Fetch verified vehicle data from official sources.</li>
                    <li>
                      Enable secure payments, document processing, and
                      loan/insurance verification.
                    </li>
                    <li>
                      Support RC transfers, challan checks, and inspection
                      records.
                    </li>
                  </ul>
                </li>
                <li>
                  8.2 All integrations are authorized, encrypted, and comply with
                  applicable privacy standards.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">8.1 Disclosure to Third Parties</h4>
              <ul>
                <li>
                  Carosa may disclose limited data to third-party partners for
                  operational support or analytics.
                </li>
                <li>
                  Such disclosures are restricted to the minimum data required
                  for the intended purpose.
                </li>
                <li>
                  All partners must maintain strict confidentiality and adhere
                  to data protection norms.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">
                9. Information Shared with Dealers and Affiliated Partners
              </h4>
              <ul>
                <li>Buyer and seller contact details.</li>
                <li>Vehicle information relevant to the deal.</li>
                <li>Transactional or inspection data.</li>
              </ul>
              <p>
                Shared data is used only for completing legitimate transactions
                and is not reused for unrelated activities. Dealers and partners
                are contractually obligated to protect user information.
              </p>

              <h4 className="fw-bold mt-4 mb-3">10. Privacy & Data Retention</h4>
              <ul>
                <li>
                  10.1 Carosa retains data only as long as:
                  <ul>
                    <li>Required for service fulfillment or user relationship.</li>
                    <li>Mandated by legal or regulatory requirements.</li>
                  </ul>
                </li>
                <li>
                  10.2 After expiry of retention period, data is securely deleted
                  or anonymized.
                </li>
                <li>
                  10.3 Carosa employs encryption, firewalls, and secure servers
                  to protect against unauthorized access, alteration, or
                  disclosure.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">11. Updates to the Policy</h4>
              <ul>
                <li>
                  11.1 Carosa reserves the right to modify or update this Privacy
                  Policy at any time.
                </li>
                <li>
                  11.2 Updates will be published on this page with the date of
                  revision.
                </li>
                <li>
                  11.3 Users are encouraged to review this Policy periodically.
                  Continued use implies acceptance of the updated version.
                </li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">12. Disclaimer</h4>
              <ul>
                <li>
                  12.1 While Carosa implements advanced security practices, no
                  online platform is completely immune to risks.
                </li>
                <li>
                  12.2 Users are advised to exercise caution when sharing
                  personal or vehicle details online.
                </li>
                <li>
                  12.3 Carosa shall not be liable for breaches caused by factors
                  beyond reasonable control, such as unauthorized hacking or
                  third-party negligence.
                </li>
              </ul>

              <div
                className="p-4 mt-4 bg-light rounded-3"
                style={{ background: "#dfe2ef" }}
              >
                <h3 className="fw-bold fSize-11 text-center pb-5 colorTtirles">
                  Contact Us
                </h3>
                <p>
                  For any questions, concerns, or complaints related to this
                  Privacy Policy or your data:
                </p>
                <p className="mb-1">
                  📧 Email:{" "}
                  <a href="mailto:support@carosa.in" className="ps-2">
                    support@carosa.in
                  </a>
                </p>
                <p className="mb-1">
                  🌐 Website:{" "}
                  <a
                    href="https://www.carosa.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ps-2"
                  >
                    https://www.carosa.in
                  </a>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
