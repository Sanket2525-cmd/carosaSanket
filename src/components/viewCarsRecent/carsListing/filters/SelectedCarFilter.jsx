import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useFilter } from "@/contexts/FilterContext";

function SelectedCarFilter() {
  const { totalCount, getActiveFilters, clearFilters, updateFilters, filters, loading } = useFilter();
  const activeFilters = getActiveFilters();

  const removeFilter = (filterType, value) => {
    if (filterType === 'brand') {
      const newBrands = filters.selectedBrands.filter(b => b !== value);
      updateFilters({ selectedBrands: newBrands });
    } else if (filterType === 'model') {
      const newModels = filters.selectedModels.filter(m => m !== value);
      updateFilters({ selectedModels: newModels });
    }
  };

  return (
    <>
      <div className="selectedItemsMain">
        <Row className="d-flex gap-3 align-items-center pb-4">
          <Col xs={12} className="availableText">
            {!loading && (
              <p className="m-0 fSize-4 text-dark">
                <span className="fSize-5 fw-bold">{totalCount}</span> Used cars in Delhi NCR
              </p>
            )}
          </Col>
          </Row>
          {activeFilters.length > 0 && (
            <div className="d-flex gap-3 flex-wrap align-items-center pb-4">
              {/* Clear All button - positioned in front of chips */}
           
              
              {/* Filter chips */}
              <div className="selectItems d-flex gap-3 flex-wrap">
                {activeFilters.map((filter, index) => {
                  // Remove " X" suffix if present for filter matching
                  const filterValue = filter.replace(/\s+X$/, '');
                  return (
                    <div key={index} className="chips d-flex align-items-center gap-2 px-4 py-2 border rounded-pill">
                      <span className="fSize-3 fw-medium">{filter}</span>
                      <button 
                        onClick={() => {
                          // Determine filter type and remove
                          if (filters.selectedBrands.includes(filterValue)) {
                            removeFilter('brand', filterValue);
                          } else if (filters.selectedModels.includes(filterValue)) {
                            removeFilter('model', filterValue);
                          } else if (filters.fuelType.includes(filterValue)) {
                            const newFuelTypes = filters.fuelType.filter(f => f !== filterValue);
                            updateFilters({ fuelType: newFuelTypes });
                          } else if (filters.transmission.includes(filterValue)) {
                            const newTransmissions = filters.transmission.filter(t => t !== filterValue);
                            updateFilters({ transmission: newTransmissions });
                          } else if (filters.bodyType.includes(filterValue)) {
                            const newBodyTypes = filters.bodyType.filter(b => b !== filterValue);
                            updateFilters({ bodyType: newBodyTypes });
                          } else if (filters.owner.includes(filterValue)) {
                            const newOwners = filters.owner.filter(o => o !== filterValue);
                            updateFilters({ owner: newOwners });
                          } else if (filters.seats?.includes(filterValue)) {
                            const newSeats = filters.seats.filter(s => s !== filterValue);
                            updateFilters({ seats: newSeats });
                          } else if (filters.color?.includes(filterValue)) {
                            const newColors = filters.color.filter(c => c !== filterValue);
                            updateFilters({ color: newColors });
                          } else if (filters.features?.includes(filterValue)) {
                            const newFeatures = filters.features.filter(f => f !== filterValue);
                            updateFilters({ features: newFeatures });
                          }
                        }}
                        className="btn btn-link p-0"
                      >
                        <FontAwesomeIcon icon={faXmark} className="cancleClick fSize-3"/>
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="clearFilter">
                <button 
                  onClick={clearFilters}
                  className="fst-italic fSize-4 fw-normal clearBtn btn btn-link p-0 text-decoration-underline"
                  style={{ color: '#dc3545' }}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        
      </div>
    </>
  );
}

export default SelectedCarFilter;
