"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CarMobileFilters = ({ count = 1726, onOpenFilter }) => {
  return (
    <div className="px-0 d-xl-none col-12">
      <div className="top_mobilefilter d-flex gap-2 justify-content-between align-items-center w-100 mb-4">
        <div className="left_text">
          <p className="mb-0"> 
            <strong>{count}</strong> Used cars in Delhi NCR
          </p>
        </div>
        <div className="right-select mobile_serach mb-md-0">
          <div className="input_check pb-0">
            <button type="button" className="filter_searchbox" onClick={onOpenFilter}>
              <span>
                Filter <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarMobileFilters;


