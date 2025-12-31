"use client";

import { Col, Container, Row } from "react-bootstrap";
import dropdownData from "../../../data/CarosaCareDropdown.json"; 
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa"; 

function CarosaCareDropdown() {
  return (
    <div className="mega-menu mega-menu-new p-4" role="menu" aria-label="CAROSA Care categories">
      <Container fluid>
        <Row className="justify-content-between g-4">
          {dropdownData.map((category, index) => (
            <Col className="mega-menu-col carosa-care-col" key={index}>
              <h6 className="column-title mb-3 fSize-3 fw-normal">
                {category.title}
              </h6>

              <ul className="list-unstyled p-0 m-0">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mb-2">
                    <Link 
                      href={link.href} 
                      className="dropdown-link fSize-4 fw-medium d-inline-flex align-items-center"
                    >
                      {link.name}
                      <FaExternalLinkAlt size={10} className="ms-2 mega-link-icon" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default CarosaCareDropdown;

