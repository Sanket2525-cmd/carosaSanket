"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import ModalCarDetails from "./ModalCarDetails";
import BrandsCarsList from "./BrandsCarsList";
import { useFilter } from "@/contexts/FilterContext";
import { useFilterData } from "@/contexts/FilterDataContext";

function CarFilters() {
  const { filters, updateFilters } = useFilter();
  const { filterData } = useFilterData();
  const [minValue, setMinValue] = useState(filters.minPrice);
  const [maxValue, setMaxValue] = useState(filters.maxPrice);
  const [categoryCounts, setCategoryCounts] = useState({
    'direct-owner': 0,
    'carosa-partner': 0
  });
  
  const minRange = 100000;
  const maxRange = 3005000;
  
  // Calculate the percentage positions for the filled track
  const minPercent = ((minValue - minRange) / (maxRange - minRange)) * 100;
  const maxPercent = ((maxValue - minRange) / (maxRange - minRange)) * 100;

  // Use filter data from context instead of making separate API call
  useEffect(() => {
    if (filterData && filterData.success && filterData.data && filterData.data.sellerTypes) {
      const counts = {};
      filterData.data.sellerTypes.forEach((sellerType) => {
        counts[sellerType.id] = sellerType.count || 0;
      });
      setCategoryCounts(counts);
    }
  }, [filterData]);

  // Car Category options
  const carCategories = [
    {
      id: 'direct-owner',
      label: 'Direct owner',
      subLabel: 'Cars sold by owners directly',
      icon: '/images/Owner.svg',
      count: categoryCounts['direct-owner'] || 0
    },
    {
      id: 'carosa-partner',
      label: 'Carosa Partner',
      subLabel: 'Cars listed by Carosa',
      icon: '/images/carosa_partner.webp',
      count: categoryCounts['carosa-partner'] || 0
    }
  ];

  const handleCategoryChange = (categoryId) => {
    updateFilters({ sellerType: categoryId });
  };
  
  return (
    <>
      <div className="carFilterMain bg-white py-3 px-2">
        
         {/* Car Category Section */}
         <div className="car-category-card border-bottom pb-2 mb-4 p-3">
          <h6 className="fSize-4 fw-bold text-black mb-3">Car Category</h6>
          
          <div className="car-category-options">
            {carCategories.map((category) => {
              const isSelected = filters.sellerType === category.id;
              return (
                <div
                  key={category.id}
                  className={`car-category-option d-flex  mb-2 rounded cursor-pointer ${
                    isSelected ? 'car-category-selected' : ''
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <div className="car-category-radio mt-1 me-3">
                    <input
                      type="radio"
                      name="carCategory"
                      id={category.id}
                      checked={isSelected}
                      onChange={() => handleCategoryChange(category.id)}
                      className="car-category-radio-input"
                    />
                    <label htmlFor={category.id} className="car-category-radio-label"></label>
                  </div>
                  
                  <div className="car-category-content flex-grow-1">
                    <div className="car-category-label fSize-3 fw-semibold text-black">
                        <Image
                      src={category.icon}
                      alt={category.label}
                      width={18}
                      height={18}
                      className="me-2"
                    />{category.label}
                    </div>
                    <div className="car-category-sublabel fSize-2 text-muted">
                      {category.subLabel}
                    </div>
                  </div>
                  
                  <div className="car-category-count fSize-3 fw-normal text-muted">
                    ({category.count})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="budget-card border-bottom pb-2 mb-4 p-3">
          <h6 className="fSize-4 fw-bold text-black">Your Budget</h6>

          <div className="rangAmmo d-flex justify-content-between mt-2">
            <span className="fSize-3 fw-semibold">
              ₹ {minValue.toLocaleString("en-IN")}
            </span>
            <span className="fSize-3 fw-semibold">
              ₹ {maxValue.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="range-container position-relative">
            <input
              type="range"
              min={minRange}
              max={maxRange}
              value={minValue}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setMinValue(newValue);
                updateFilters({ minPrice: newValue });
              }}
              className="range-slider"
            />
            <input
              type="range"
              min={minRange}
              max={maxRange}
              value={maxValue}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setMaxValue(newValue);
                updateFilters({ maxPrice: newValue });
              }}
              className="range-slider"
            />
            {/* Dynamic filled track */}
            <div 
              className="range-fill"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            ></div>
          </div>

          <div className="max__min d-flex justify-content-between text-muted mt-1 small">
            <span className="fSize-1 fw-normal">Minimum</span>
            <span className="fSize-1 fw-normal">Maximum</span>
          </div>
        </div>

       
   
          <BrandsCarsList />    
          <ModalCarDetails />
      </div>
    </>
  );
}

export default CarFilters;
