"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import CarFilters from "./CarFilters";

const MobileFilterOverlay = ({ isOpen, onClose, onApply, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-filter-overlay">
      <div className="mobile-filter-content">
        {/* Header */}
        <div className="mobile-filter-header">
          <div className="mobile-filter-title">
            <h4 className="mb-0">Select Filters</h4>
          </div>
          <div className="mobile-filter-actions">
            <button 
              className="mobile-filter-btn mobile-filter-clear" 
              onClick={onClear}
            >
              Clear
            </button>
            <button 
              className="mobile-filter-btn mobile-filter-cancel" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="mobile-filter-btn mobile-filter-apply" 
              onClick={onApply}
            >
              Apply
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="mobile-filter-body">
          <CarFilters />
        </div>
      </div>
    </div>
  );
};

export default MobileFilterOverlay;
