import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export default function TermsAndConditions() {
  return (
    <div className="topSpacing padding-Y-X font_checlist">
      <Container fluid className="px-md-5 px-2 pt-md-0 pt-4">
        <Row>
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div className="title_topterms">
                <h2 className="fw-bold mb-0">
                  Car<span className="acc-osa">osa</span> — Terms of Service
                </h2>
                <p className="fw-semibold fSize-5 pt-2">
                  Understand the rules of using our platform.
                </p>
              </div>
              <div className="rightside_terms">
                 <h3 className="fSize-4">
                  Effective Date: <span className="fw-bold">04-11-2025</span>
                </h3>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <p className="fw-semibold text-center">
              Welcome to{" "}
              <span className="fw-bold text-dark">
                Car<span className="osa">osa</span>
              </span>{" "}
              — your trusted partner in the world of pre-owned and new
              automobiles. At Carosa, we’re building a transparent,
              technology-driven platform for buying, selling, financing, and
              managing cars with ease and trust. These Terms of Service (“Terms”)
              explain your rights and obligations when using our website, apps,
              and services. Please read them carefully before using Carosa. By
              accessing or using our services, you agree to be bound by these
              Terms. If you do not agree, you must discontinue using the platform
              immediately.
            </p>
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="mt-4">
            <Card className="p-4 border-0 shadow-sm rounded-3 card_titles">

              <h4 className="fw-bold mb-3">1. Introduction</h4>
              <p>1.1 Carosa provides an online platform for car buyers, sellers, and dealers to connect, evaluate, buy, and sell vehicles.</p>
              <p>1.2 The platform includes services like vehicle inspections, RC transfers, loan assistance, insurance, and doorstep deliveries.</p>
              <p>1.3 These Terms apply to all visitors, registered users, and partners using any Carosa product or service.</p>
              <p>1.4 By using the platform, you acknowledge that Carosa is a facilitator and not a party to any direct sale or purchase between users unless specifically stated.</p>

              <h4 className="fw-bold mt-4 mb-3">2. Legal Agreement</h4>
              <p>2.1 These Terms form a legally binding agreement between Carosa Automobiles Pvt. Ltd., and you (the user).</p>
              <p>2.2 This agreement governs all aspects of your interaction with Carosa, whether through web, mobile, or any digital medium.</p>
              <p>2.3 If you are using Carosa on behalf of a business or organization, you confirm that you have authority to bind that entity to these Terms.</p>
              <p>2.4 Carosa reserves the right to update or modify these Terms anytime.</p>
              <p>2.5 Updates will take effect upon being posted with the “Last Updated” date.</p>

              <h4 className="fw-bold mt-4 mb-3">3. Eligibility</h4>
              <p>3.1 Users must be 18 years of age or older to register or transact on Carosa.</p>
              <p>3.2 Users aged 13–17 years may use the Site under parental supervision and consent.</p>
              <p>3.3 Users below 13 years are not permitted.</p>
              <p>3.4 Carosa reserves the right to verify identity and deny service to unverified or ineligible users.</p>

              <h4 className="fw-bold mt-4 mb-3">4. User Representations</h4>
              <p>By using Carosa, you agree that:</p>
              <ul>
                <li>All registration information is accurate, up-to-date, and genuine.</li>
                <li>You will promptly update your details if changes occur.</li>
                <li>You have the authority and legal right to use the Site.</li>
                <li>You will comply with all Indian laws and local regulations.</li>
                <li>You will not use Carosa for unlawful or deceptive activities.</li>
                <li>You are responsible for maintaining your login credentials.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">5. Intellectual Property Rights</h4>
              <p>5.1 All content, design, graphics, text, logos, databases, and code on www.carosa.in are owned by Carosa Automobiles Pvt. Ltd.</p>
              <p>5.2 You may view and download information for personal use only.</p>
              <p>5.3 Copying, reproducing, or distributing content without authorization is prohibited.</p>
              <p>5.4 The “Carosa” brand, logo, and tagline are protected trademarks under Indian law.</p>

              <h4 className="fw-bold mt-4 mb-3">6. User Registration</h4>
              <p>6.1 You may need to register for certain features like car listing, loan applications, or dealer access.</p>
              <p>6.2 You are responsible for all activity on your account.</p>
              <p>6.3 If your account is used fraudulently or improperly, you must inform Carosa immediately.</p>
              <p>6.4 Carosa may disable or suspend accounts suspected of misuse, duplicate identities, or policy violation.</p>

              <h4 className="fw-bold mt-4 mb-3">7. Prohibited Activities</h4>
              <ul>
                <li>Extract or copy data from Carosa without permission.</li>
                <li>Use bots, crawlers, or scripts for automation.</li>
                <li>Post misleading or fraudulent vehicle listings.</li>
                <li>Upload viruses, malware, or harmful content.</li>
                <li>Use Carosa for unlawful activities like money laundering.</li>
                <li>Defame, harass, or impersonate others.</li>
                <li>Violate intellectual property or privacy rights.</li>
                <li>Attempt to reverse-engineer or modify Carosa’s software.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">8. Remedies for Violations</h4>
              <ul>
                <li>Suspend or terminate accounts.</li>
                <li>Block IP addresses involved in suspicious activity.</li>
                <li>Report fraudulent activities to authorities.</li>
                <li>Take legal or civil action for damages caused.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">9. On-Boarding</h4>
              <p>9.1 Dealers, sellers, and corporate partners must complete the Carosa onboarding process.</p>
              <p>9.2 Required documents may include GST registration, PAN, bank details, and business proof.</p>
              <p>9.3 Carosa verifies authenticity before activation.</p>
              <p>9.4 Providing false information may result in permanent deactivation.</p>
              <p>9.5 Carosa may collect and store basic data for KYC and compliance.</p>

              <h4 className="fw-bold mt-4 mb-3">10. Valuation and Vehicle Purchase Services</h4>
              <p>10.1 Carosa offers AI-driven and expert-led valuation tools to estimate car prices.</p>
              <p>10.2 Valuations are based on multiple parameters: make, model, age, condition, mileage, and market trends.</p>
              <p>10.3 Final offer prices may vary after inspection or verification.</p>
              <p>10.4 Carosa is not liable for user dissatisfaction arising from valuation differences.</p>
              <p>10.5 Vehicles purchased via Carosa are subject to ownership and documentation verification.</p>

              <h4 className="fw-bold mt-4 mb-3">11. New Vehicle Business</h4>
              <p>11.1 Carosa may promote or partner with OEMs or authorized dealers for new car sales.</p>
              <p>11.2 Offers displayed are for informational purposes only; final purchase is between buyer and the dealer.</p>
              <p>11.3 Carosa does not handle direct invoicing or vehicle registration for new cars.</p>

              <h4 className="fw-bold mt-4 mb-3">12. Accepting Cash</h4>
              <p>12.1 Carosa discourages direct cash transactions for transparency and compliance.</p>
              <p>12.2 Cash transactions beyond permitted limits under the Income Tax Act are not allowed.</p>
              <p>12.3 Carosa is not liable for cash payments made outside its digital payment ecosystem.</p>

              <h4 className="fw-bold mt-4 mb-3">13. EMI (Equated Monthly Installments)</h4>
              <p>13.1 Carosa facilitates financing through registered NBFCs and banks.</p>
              <p>13.2 Loan approval, interest rates, and terms depend solely on the lending institution.</p>
              <p>13.3 Carosa acts only as a facilitator and is not responsible for delays, defaults, or rejections.</p>
              <p>13.4 Prepayment, foreclosure, or default penalties are governed by the lender’s policy.</p>

              <h4 className="fw-bold mt-4 mb-3">14. Fees / Charges</h4>
              <p>14.1 Certain services like vehicle inspection, RC transfer, or premium listings may attract fees.</p>
              <p>14.2 All charges are transparently displayed before payment.</p>
              <p>14.3 Payments once made are non-refundable unless stated otherwise.</p>
              <p>14.4 Carosa reserves the right to revise charges or introduce new fees with prior notice.</p>

              <h4 className="fw-bold mt-4 mb-3">15. Vehicle History</h4>
              <p>15.1 Carosa retrieves vehicle history through government and private data sources.</p>
              <p>15.2 Information may include previous ownership, accident history, challans, and insurance records.</p>
              <p>15.3 Carosa does not guarantee completeness or accuracy due to third-party data dependency.</p>

              <h4 className="fw-bold mt-4 mb-3">16. Severability of Provisions</h4>
              <p>If any clause of these Terms is found unlawful or unenforceable, it will not affect the validity of the remaining clauses.</p>

              <h4 className="fw-bold mt-4 mb-3">17. Modifications to Terms of Use</h4>
              <p>Carosa reserves the right to modify, amend, or update these Terms periodically. Your continued use after such changes signifies acceptance of the revised Terms.</p>

              <h4 className="fw-bold mt-4 mb-3">18. User Generated Contributions</h4>
              <p>18.1 Users may upload content like car photos, reviews, and feedback.</p>
              <p>18.2 You retain ownership of your content but grant Carosa a royalty-free, perpetual license to use, display, or promote it.</p>
              <p>18.3 Carosa may moderate or remove any content violating policies or laws.</p>

              <h4 className="fw-bold mt-4 mb-3">19. User Guidelines</h4>
              <ul>
                <li>Provide accurate vehicle data.</li>
                <li>Maintain ethical behavior and communication.</li>
                <li>Avoid hate speech, abuse, or offensive language.</li>
                <li>Follow fair-trade practices when selling or buying vehicles.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">20. Submissions</h4>
              <p>Any feedback, ideas, or suggestions shared with Carosa become the company’s property. Carosa may use such submissions to improve products without compensation.</p>

              <h4 className="fw-bold mt-4 mb-3">21. Site Management</h4>
              <ul>
                <li>Monitor user activity for compliance.</li>
                <li>Restrict access to abusive accounts.</li>
                <li>Remove outdated or fake listings.</li>
                <li>Suspend services for maintenance or legal compliance.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">22. Copyright Infringements</h4>
              <p>If you believe any Carosa content infringes your rights, send a formal notice to <a href="mailto:support@carosa.in">support@carosa.in</a> with Proof of ownership, Infringing URL, and Declaration of authenticity.</p>

              <h4 className="fw-bold mt-4 mb-3">23. Term and Termination</h4>
              <p>23.1 Carosa may terminate user accounts for violations or misuse.</p>
              <p>23.2 Upon termination, all licenses and access rights are revoked.</p>
              <p>23.3 Carosa may retain data for audit and legal compliance.</p>

              <h4 className="fw-bold mt-4 mb-3">24. Modifications and Interruptions</h4>
              <p>Carosa may update its platform or temporarily suspend access for upgrades. We are not liable for downtime, delays, or technical interruptions beyond our control.</p>

              <h4 className="fw-bold mt-4 mb-3">25. Entire Agreement</h4>
              <p>These Terms, together with Carosa’s Privacy Policy and other linked policies, form the entire agreement between Carosa and the user.</p>

              <h4 className="fw-bold mt-4 mb-3">26. Disclaimer of Warranties</h4>
              <p>Carosa is provided “as is” and “as available”. We do not guarantee uninterrupted operation or accuracy of data. Users are advised to independently verify any information before making decisions.</p>

              <h4 className="fw-bold mt-4 mb-3">27. Indemnification</h4>
              <ul>
                <li>Your breach of these Terms, or</li>
                <li>Violation of rights of any third party.</li>
              </ul>

              <h4 className="fw-bold mt-4 mb-3">28. License of Your Contents to Carosa</h4>
              <p>By submitting content, you grant Carosa an irrevocable license to reproduce, publish, or distribute your material for service enhancement and marketing purposes.</p>

              <h4 className="fw-bold mt-4 mb-3">29. Third Party Content</h4>
              <p>Carosa may feature links or data from third-party sites. We are not responsible for their accuracy, reliability, or legal compliance.</p>

              <h4 className="fw-bold mt-4 mb-3">30. Advertisers</h4>
              <p>Advertisements appearing on Carosa belong to respective advertisers. Carosa is not responsible for claims or representations made in such ads.</p>

              <h4 className="fw-bold mt-4 mb-3">31. Electronic Communications, Transactions, and Signatures</h4>
              <p>By using Carosa, you agree to receive electronic communications for transactions, updates, and promotions. Electronic signatures are legally valid under the Information Technology Act, 2000.</p>

              <h4 className="fw-bold mt-4 mb-3">32. Governing Law</h4>
              <p>These Terms shall be governed by and construed under the laws of India, with exclusive jurisdiction in the courts of Delhi.</p>

              <h4 className="fw-bold mt-4 mb-3">33. Dispute Resolution (Arbitration)</h4>
              <p>27.1 Any disputes shall be settled through arbitration under the Arbitration and Conciliation Act, 1996.</p>
              <p>27.2 Arbitration proceedings shall take place in Delhi in the English language.</p>
              <p>27.3 The decision of the arbitrator shall be final and binding.</p>

              <h4 className="fw-bold mt-4 mb-3">34. Disclaimer</h4>
              <p>Carosa serves as a marketplace and facilitator. We are not responsible for the authenticity of user-generated listings, third-party offers, or dealer statements.</p>

              <h4 className="fw-bold mt-4 mb-3">35. Grievance Officer</h4>
              <p>
                For support, queries, or complaints, contact:<br />
                Grievance Officer<br />
                Carosa - a Brand of Neteasy Technologies Private Limited.<br />
              
                CIN: U58200HR2025PTC129960<br />
                📧 <a href="mailto:support@carosa.in">support@carosa.in</a><br />
                📞 +91 9355530033<br />
                All complaints will be acknowledged within 48 hours and resolved within 15 business days.
              </p>

              <div className="p-4 mt-4 bg-light rounded-3" style={{ background: "#dfe2ef" }}>
                <h3 className="fw-bold fSize-11 text-center pb-5 colorTtirles">Thank You for Choosing Carosa!</h3>
                <p className="text-center mb-0">
                  We value your trust and are committed to offering you a smooth, transparent, and reliable automobile experience.
                  <br />Your journey with Carosa begins with confidence.
                </p>
              </div>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
