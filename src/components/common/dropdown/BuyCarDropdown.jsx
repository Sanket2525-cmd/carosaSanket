"use client";

import { Col, Container, Row } from "react-bootstrap";
import dropdownData from "../../../data/BuyDropdown.json"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaExternalLinkAlt } from "react-icons/fa"; 

function BuyCarDropdown() {
  const router = useRouter();

  const getBudgetParams = (href) => {
    if (href.includes('/price/under-2-lakh')) {
      return { minPrice: 0, maxPrice: 200000 };
    } else if (href.includes('/price/under-5-lakh')) {
      return { minPrice: 0, maxPrice: 500000 };
    } else if (href.includes('/price/under-10-lakh')) {
      return { minPrice: 0, maxPrice: 1000000 };
    } else if (href.includes('/price/above-10-lakh')) {
      return { minPrice: 1000000, maxPrice: 3005000 };
    }
    return null;
  };

  const getFuelType = (href) => {
    if (href.includes('/fuel/petrol')) {
      return 'Petrol';
    } else if (href.includes('/fuel/diesel')) {
      return 'Diesel';
    } else if (href.includes('/fuel/cng')) {
      return 'CNG';
    }
    return null;
  };

  const getTransmission = (href) => {
    if (href.includes('/transmission/automatic')) {
      return 'Automatic';
    } else if (href.includes('/transmission/manual')) {
      return 'Manual';
    }
    return null;
  };

  const getYearRange = (href) => {
    const currentYear = new Date().getFullYear();
    if (href.includes('/year/2019-and-above')) {
      return { minYear: 2019, maxYear: currentYear };
    } else if (href.includes('/year/2014-and-above')) {
      return { minYear: 2014, maxYear: currentYear };
    } else if (href.includes('/year/2009-and-above')) {
      return { minYear: 2009, maxYear: currentYear };
    } else if (href.includes('/year/2005-and-above')) {
      return { minYear: 2005, maxYear: currentYear };
    }
    return null;
  };

  const getSegment = (href) => {
    if (href.includes('/segment/mid-range') || href.includes('/used-cars/segment/mid-range')) {
      return 'Mid-Range Cars';
    } else if (href.includes('/segment/luxury') || href.includes('/used-cars/segment/luxury')) {
      return 'Luxury Cars';
    }
    return null;
  };

  const getBodyType = (href) => {
    if (href.includes('/body/hatchback') || href.includes('/used-cars/body/hatchback')) {
      return 'Hatchback';
    } else if (href.includes('/body/sedan') || href.includes('/used-cars/body/sedan')) {
      return 'Sedan';
    } else if (href.includes('/body/suv') || href.includes('/used-cars/body/suv')) {
      return 'SUV';
    }
    return null;
  };

  const handleFilterClick = (e, href) => {
    if (href.includes('/segment/') || href.includes('/used-cars/segment/')) {
      e.preventDefault();
      const segment = getSegment(href);
      if (segment) {
        const queryString = new URLSearchParams({
          category: segment
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    } else if (href.includes('/price/')) {
      e.preventDefault();
      const params = getBudgetParams(href);
      if (params) {
        const queryString = new URLSearchParams({
          minPrice: params.minPrice.toString(),
          maxPrice: params.maxPrice.toString()
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    } else if (href.includes('/fuel/')) {
      e.preventDefault();
      const fuelType = getFuelType(href);
      if (fuelType) {
        const queryString = new URLSearchParams({
          fuel: fuelType
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    } else if (href.includes('/transmission/')) {
      e.preventDefault();
      const transmission = getTransmission(href);
      if (transmission) {
        const queryString = new URLSearchParams({
          transmission: transmission
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    } else if (href.includes('/year/')) {
      e.preventDefault();
      const yearRange = getYearRange(href);
      if (yearRange) {
        const queryString = new URLSearchParams({
          year: `${yearRange.minYear}-${yearRange.maxYear}`
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    } else if (href.includes('/body/') || href.includes('/used-cars/body/')) {
      e.preventDefault();
      const bodyType = getBodyType(href);
      if (bodyType) {
        const queryString = new URLSearchParams({
          bodyType: bodyType
        }).toString();
        router.push(`/recentCar?${queryString}`);
      }
    }
  };

  return (
    <div className="mega-menu mega-menu-new p-4" role="menu" aria-label="Buy used car categories">
      <Container fluid>
        <Row className="justify-content-start g-4">
          
          {dropdownData.map((category, index) => (
        
            <Col md={2} className="mega-menu-col" key={index}>
              
              <h6 className="column-title mb-3 fSize-3 fw-normal">
                {category.title}
              </h6>

              <ul className="list-unstyled p-0 m-0">
                {category.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="mb-2">
                    <Link 
                      href={link.href} 
                      className="dropdown-link fSize-4 fw-medium d-inline-flex align-items-center"
                      onClick={(e) => handleFilterClick(e, link.href)}
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

export default BuyCarDropdown;