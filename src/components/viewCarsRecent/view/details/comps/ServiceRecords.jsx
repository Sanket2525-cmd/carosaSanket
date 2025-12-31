import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

function ServiceRecords() {
  const router = useRouter();

  const handleBuyNowClick = () => {
    router.push('/recentCar');
  };

  const serviceCards = [
    {
      id: 1,
      title: "Regular Service Records",
      image: "/images/reguler.png"
    },
    {
      id: 2,
      title: "Parts & Repairs",
      image: "/images/part.png"
    },
    {
      id: 3,
      title: "Major Service Milestones",
      image: "/images/major.png"
    },
    {
      id: 4,
      title: "Oil & Fluids",
      image: "/images/oil.png"
    }
  ];

  return (
    <div className="service-records-container">
      
        <div className="service-records-card">
          {/* Page Title */}

                  <div className="hdTile pb-2">
                    <h6 className="fsSize-7-5 fw-bold">Service Records at a Glance</h6>
                  </div>
           
          
          {/* Service Cards Grid */}
          <Row className="service-cards-grid mb-4">
            {serviceCards.map((card) => (
              <Col md={6} key={card.id} className="mb-3">
                <div className="service-card">
                  <div className="service-card-content py-2 px-4">
                    <Image src={card.image} alt={card.title} height={20} width={20} className="me-3"/>
                    <span className="service-card-text">{card.title}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          {/* Buy Now Button */}
          <div className="text-center">
            
            <button className="buy-now-btn" onClick={handleBuyNowClick}>
            
              Buy Now
              <Image src="/images/whitearrow.png" width={14} height={14} alt="" className="ms-3"/>
            </button>
          </div>
        </div>
    
    </div>
  );
}

export default ServiceRecords;
