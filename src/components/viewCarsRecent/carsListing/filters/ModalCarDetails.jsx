"use client";
import { faAngleDown, faAngleUp, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { useFilter } from "@/contexts/FilterContext";
import { useFilterData } from "@/contexts/FilterDataContext";

function ModalCarDetails() {
  const { filters, updateFilters } = useFilter();
  const [expandedItem, setExpandedItem] = useState(null);
  
  // Model Year range state
  const [minYear, setMinYear] = useState(filters.yearRange?.min || 2007);
  const [maxYear, setMaxYear] = useState(filters.yearRange?.max || 2024);
  
  // Kms Driven range state
  const [minKm, setMinKm] = useState(filters.kmRange?.min || 0);
  const [maxKm, setMaxKm] = useState(filters.kmRange?.max || 500000);
  
  // Track previous filter values to prevent unnecessary updates
  const prevFiltersRef = useRef({ yearRange: filters.yearRange, kmRange: filters.kmRange });
  
  // Sync local state with filter context when it changes externally
  useEffect(() => {
    const newMinYear = filters.yearRange?.min ?? 2007;
    const newMaxYear = filters.yearRange?.max ?? 2024;
    const newMinKm = filters.kmRange?.min ?? 0;
    const newMaxKm = filters.kmRange?.max ?? 500000;
    
    const prev = prevFiltersRef.current;
    const yearChanged = prev.yearRange?.min !== newMinYear || prev.yearRange?.max !== newMaxYear;
    const kmChanged = prev.kmRange?.min !== newMinKm || prev.kmRange?.max !== newMaxKm;
    
    if (yearChanged) {
      setMinYear(newMinYear);
      setMaxYear(newMaxYear);
    }
    if (kmChanged) {
      setMinKm(newMinKm);
      setMaxKm(newMaxKm);
    }
    
    prevFiltersRef.current = { yearRange: filters.yearRange, kmRange: filters.kmRange };
  }, [filters.yearRange?.min, filters.yearRange?.max, filters.kmRange?.min, filters.kmRange?.max]);
  
  const minYearRange = 2007;
  const maxYearRange = 2024;
  
  const minKmRange = 0;
  const maxKmRange = 500000;
  
  // Calculate the percentage positions for the filled track
  const minYearPercent = ((minYear - minYearRange) / (maxYearRange - minYearRange)) * 100;
  const maxYearPercent = ((maxYear - minYearRange) / (maxYearRange - minYearRange)) * 100;
  
  const minKmPercent = ((minKm - minKmRange) / (maxKmRange - minKmRange)) * 100;
  const maxKmPercent = ((maxKm - minKmRange) / (maxKmRange - minKmRange)) * 100;

  const filterItems = [
    "Model Year",
    "Kms Driven",
    "Fuel",
    "Body Type",
    "Transmission",
    "Color",
    "Seats",
    "Owners",
  ];

  const handleToggle = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const handleYearChange = (type, value) => {
    const newValue = Number(value);
    if (type === 'min') {
      setMinYear(newValue);
      updateFilters({ yearRange: { min: newValue, max: maxYear } });
    } else {
      setMaxYear(newValue);
      updateFilters({ yearRange: { min: minYear, max: newValue } });
    }
  };

  const handleKmChange = (type, value) => {
    const newValue = Number(value);
    if (type === 'min') {
      setMinKm(newValue);
      updateFilters({ kmRange: { min: newValue, max: maxKm } });
    } else {
      setMaxKm(newValue);
      updateFilters({ kmRange: { min: minKm, max: newValue } });
    }
  };

  const formatKm = (km) => {
    const kmNum = Number(km);
    if (isNaN(kmNum)) return '0 km';
    
    // Use Indian numbering system with commas
    // Format: 50,000 km, 5,00,000 km (lakhs), 50,00,000 km (crores)
    return `${kmNum.toLocaleString('en-IN')} km`;
  };

  // Fuel types data - will be populated dynamically
  const [fuelTypes, setFuelTypes] = useState([
    { 
      name: "Petrol", 
      icon: "/images/petrol.png", 
      count: 0 
    },
    { 
      name: "Diesel", 
      icon: "/images/petrol.png",
      count: 0 
    },
    { 
      name: "Electric", 
      icon: "/images/petrol.png",
      count: 0 
    },
    { 
      name: "CNG + Petrol", 
      icon: "/images/petrol.png",
      count: 0 
    },
    { 
      name: "Hybrid + Petrol", 
      icon: "/images/petrol.png", 
      count: 0 
    },
    { 
      name: "Diesel + Hybrid", 
      icon: "/images/petrol.png", 
      count: 0 
    },
    { 
      name: "LPG + Petrol", 
      icon: "/images/petrol.png", 
      count: 0 
    }
  ]);

  const handleFuelToggle = (fuelName) => {
    const currentFuelTypes = filters.fuelType || [];
    const newFuelTypes = currentFuelTypes.includes(fuelName)
      ? currentFuelTypes.filter(f => f !== fuelName)
      : [...currentFuelTypes, fuelName];
    updateFilters({ fuelType: newFuelTypes });
  };

  // Body types data
  const bodyTypes = [
    {
      name: "Hatchback",
      image: "/images/Hatchback.png",
      count: 1188
    },
    {
      name: "SUV",
      image: "/images/Hatchback.png",
      count: 1045
    },
    {
      name: "Sedan",
      image: "/images/Hatchback.png",
      count: 545
    }
  ];

  const handleBodyTypeToggle = (bodyTypeName) => {
    const currentBodyTypes = filters.bodyType || [];
    const newBodyTypes = currentBodyTypes.includes(bodyTypeName)
      ? currentBodyTypes.filter(b => b !== bodyTypeName)
      : [...currentBodyTypes, bodyTypeName];
    updateFilters({ bodyType: newBodyTypes });
  };

  // Transmission types data - will be populated dynamically
  const [transmissionTypes, setTransmissionTypes] = useState([
    { 
      name: "Manual", 
      icon: "/images/automatic.png", 
      count: 0 
    },
    { 
      name: "Automatic", 
      icon: "/images/automatic.png",
      count: 0 
    }
  ]);

  const handleTransmissionToggle = (transmissionName) => {
    const currentTransmissions = filters.transmission || [];
    const newTransmissions = currentTransmissions.includes(transmissionName)
      ? currentTransmissions.filter(t => t !== transmissionName)
      : [...currentTransmissions, transmissionName];
    updateFilters({ transmission: newTransmissions });
  };

  // Color options data - will be populated dynamically
  const [colors, setColors] = useState([
    { name: "White", image: "/images/Hatchback.png", count: 0 },
    { name: "Silver", image: "/images/Hatchback.png", count: 0 },
    { name: "Black", image: "/images/Hatchback.png", count: 0 },
    { name: "Blue", image: "/images/Hatchback.png", count: 0 },
    { name: "Gray", image: "/images/Hatchback.png", count: 0 },
    { name: "Red", image: "/images/Hatchback.png", count: 0 },
    { name: "Green", image: "/images/Hatchback.png", count: 0 },
    { name: "Yellow", image: "/images/Hatchback.png", count: 0 },
    { name: "Purple", image: "/images/Hatchback.png", count: 0 },
    { name: "Orange", image: "/images/Hatchback.png", count: 0 },
    { name: "Pink", image: "/images/Hatchback.png", count: 0 }
  ]);

  const handleColorToggle = (colorName) => {
    const currentColors = filters.color || [];
    const newColors = currentColors.includes(colorName)
      ? currentColors.filter(c => c !== colorName)
      : [...currentColors, colorName];
    updateFilters({ color: newColors });
  };


  // Seats data - will be populated dynamically
  const [seats, setSeats] = useState([
    {
      name: "4 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    },
    {
      name: "5 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    },
    {
      name: "6 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    },
    {
      name: "7 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    },
    {
      name: "8 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    },
    {
      name: "9 Seater",
      icon: "/images/4_Seater.webp",
      count: 0
    }
  ]);

  const handleSeatToggle = (seatName) => {
    const currentSeats = filters.seats || [];
    const newSeats = currentSeats.includes(seatName)
      ? currentSeats.filter(s => s !== seatName)
      : [...currentSeats, seatName];
    updateFilters({ seats: newSeats });
  };

  // Owners data - will be populated dynamically
  const [owners, setOwners] = useState([
    { name: "First Owner", icon: "/images/user.svg", count: 0 },
    { name: "Second Owner", icon: "/images/user.svg", count: 0 },
    { name: "Third Owner", icon: "/images/user.svg", count: 0 },
    { name: "Fourth Owner", icon: "/images/user.svg", count: 0 }
  ]);

  // Use filter data from context instead of making separate API call
  // FilterDataContext handles fetching and caching
  const { filterData } = useFilterData();
  
  useEffect(() => {
    let isMounted = true;

    const processFilterCounts = () => {
      if (filterData && filterData.success && filterData.data && isMounted) {
        const data = filterData.data;

          // Update fuel types
          // Handle compound fuel types (e.g., "CNG + Petrol" should match "CNG" from API)
          if (data.fuelTypes) {
            setFuelTypes(prevFuelTypes => {
              return prevFuelTypes.map(fuel => {
                // Try exact match first
                let dbFuel = data.fuelTypes.find((f) => 
                  f.name.toLowerCase() === fuel.name.toLowerCase()
                );
                
                // If no exact match, try to match compound types
                if (!dbFuel) {
                  const fuelNameLower = fuel.name.toLowerCase();
                  // "CNG + Petrol" or "CNG+Petrol" should match "CNG"
                  if (fuelNameLower.includes('cng')) {
                    dbFuel = data.fuelTypes.find((f) => f.name.toLowerCase() === 'cng');
                  }
                  // "LPG + Petrol" should match "LPG"
                  else if (fuelNameLower.includes('lpg')) {
                    dbFuel = data.fuelTypes.find((f) => f.name.toLowerCase() === 'lpg');
                  }
                  // "Hybrid + Petrol" should match "Hybrid"
                  else if (fuelNameLower.includes('hybrid') && fuelNameLower.includes('petrol')) {
                    dbFuel = data.fuelTypes.find((f) => f.name.toLowerCase() === 'hybrid');
                  }
                  // "Diesel + Hybrid" should match "Diesel" or "Hybrid" (prefer Diesel)
                  else if (fuelNameLower.includes('diesel') && fuelNameLower.includes('hybrid')) {
                    dbFuel = data.fuelTypes.find((f) => f.name.toLowerCase() === 'diesel') ||
                             data.fuelTypes.find((f) => f.name.toLowerCase() === 'hybrid');
                  }
                  // "Hybrid" alone should match "Hybrid"
                  else if (fuelNameLower.includes('hybrid')) {
                    dbFuel = data.fuelTypes.find((f) => f.name.toLowerCase() === 'hybrid');
                  }
                }
                
                return {
                  ...fuel,
                  count: dbFuel?.count || 0
                };
              });
            });
          }

          // Update transmission types
          if (data.transmissionTypes) {
            setTransmissionTypes(prevTransmissions => {
              return prevTransmissions.map(transmission => {
                const dbTransmission = data.transmissionTypes.find((t) => 
                  t.name.toLowerCase() === transmission.name.toLowerCase()
                );
                return {
                  ...transmission,
                  count: dbTransmission?.count || 0
                };
              });
            });
          }

          // Update colors
          if (data.colors) {
            setColors(prevColors => {
              return prevColors.map(color => {
                const dbColor = data.colors.find((c) => 
                  c.name.toLowerCase() === color.name.toLowerCase()
                );
                return {
                  ...color,
                  count: dbColor?.count || 0
                };
              });
            });
          }

          // Update seats
          if (data.seats) {
            setSeats(prevSeats => {
              return prevSeats.map(seat => {
                const dbSeat = data.seats.find((s) => 
                  s.name.toLowerCase() === seat.name.toLowerCase()
                );
                return {
                  ...seat,
                  count: dbSeat?.count || 0
                };
              });
            });
          }

          // Update owners
          if (data.owners) {
            setOwners(prevOwners => {
              return prevOwners.map(owner => {
                const dbOwner = data.owners.find((o) => 
                  o.name.toLowerCase() === owner.name.toLowerCase()
                );
                return {
                  ...owner,
                  count: dbOwner?.count || 0
                };
              });
            });
          }
        }
      };

      if (filterData) {
        processFilterCounts();
      }

      return () => {
        isMounted = false;
      };
    }, [filterData]);

  const handleOwnerToggle = (ownerName) => {
    const currentOwners = filters.owner || [];
    const newOwners = currentOwners.includes(ownerName)
      ? currentOwners.filter(o => o !== ownerName)
      : [...currentOwners, ownerName];
    updateFilters({ owner: newOwners });
  };

  return (
    <>
      {filterItems.map((item, index) => (
        <div key={index} className="mb-3 border-bottom pb-0">
          <div
            className="carModals d-flex align-items-center justify-content-between pb-2"
            onClick={() => handleToggle(item)}
            style={{ cursor: 'pointer' }}
          >
            <p className="m-0 fSize-4 fw-semibold text-dark">{item}</p>
            <div className="modalsCardDown">
              <button
                
                className="listModal d-flex justify-content-center align-items-center border-0 bg-transparent p-0"
                
              >
                <FontAwesomeIcon 
                  icon={expandedItem === item ? faAngleUp : faAngleDown} 
                  className="angleDown" 
                />
              </button>
            </div>
          </div>
          
          {expandedItem === item && item === "Model Year" && (
            <div className="budget-card pb-2 mb-4 p-3 mt-3">
              <h6 className="fSize-4 fw-bold text-black">Model Year</h6>

              <div className="rangAmmo d-flex justify-content-between mt-2">
                <span className="fSize-3 fw-semibold" style={{ color: 'var(--call-bg-color)' }}>
                  {minYear}
                </span>
                <span className="fSize-3 fw-semibold" style={{ color: 'var(--call-bg-color)' }}>
                  {maxYear}
                </span>
              </div>

              <div className="range-container position-relative">
                <input
                  type="range"
                  min={minYearRange}
                  max={maxYearRange}
                  value={minYear}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue <= maxYear) {
                      handleYearChange('min', newValue);
                    }
                  }}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={minYearRange}
                  max={maxYearRange}
                  value={maxYear}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= minYear) {
                      handleYearChange('max', newValue);
                    }
                  }}
                  className="range-slider"
                />
                {/* Dynamic filled track */}
                <div 
                  className="range-fill"
                  style={{
                    left: `${minYearPercent}%`,
                    width: `${maxYearPercent - minYearPercent}%`
                  }}
                ></div>
              </div>

              <div className="max__min d-flex justify-content-between text-muted mt-1 small">
                <span className="fSize-1 fw-normal">Minimum</span>
                <span className="fSize-1 fw-normal">Maximum</span>
              </div>
            </div> 
          )}

          {expandedItem === item && item === "Kms Driven" && (
            <div className="budget-card pb-2 mb-4 p-3 mt-3">
              <h6 className="fSize-4 fw-bold text-black">Kms Driven</h6>

              <div className="rangAmmo d-flex justify-content-between mt-2">
                <span className="fSize-3 fw-semibold" style={{ color: 'var(--call-bg-color)' }}>
                  {formatKm(minKm)}
                </span>
                <span className="fSize-3 fw-semibold" style={{ color: 'var(--call-bg-color)' }}>
                  {formatKm(maxKm)}
                </span>
              </div>

              <div className="range-container position-relative">
                <input
                  type="range"
                  min={minKmRange}
                  max={maxKmRange}
                  value={minKm}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue <= maxKm) {
                      handleKmChange('min', newValue);
                    }
                  }}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={minKmRange}
                  max={maxKmRange}
                  value={maxKm}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if (newValue >= minKm) {
                      handleKmChange('max', newValue);
                    }
                  }}
                  className="range-slider"
                />
                {/* Dynamic filled track */}
                <div 
                  className="range-fill"
                  style={{
                    left: `${minKmPercent}%`,
                    width: `${maxKmPercent - minKmPercent}%`
                  }}
                ></div>
              </div>

              <div className="max__min d-flex justify-content-between text-muted mt-1 small">
                <span className="fSize-1 fw-normal">Minimum</span>
                <span className="fSize-1 fw-normal">Maximum</span>
              </div>
            </div> 
          )}

          {expandedItem === item && item === "Fuel" && (
            <div className="fuel-filter">
              {fuelTypes.map((fuel, fuelIndex) => (
                <div
                  key={fuelIndex}
                  className="fuel-filter-item d-flex align-items-center justify-content-between py-2 border-bottom"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleFuelToggle(fuel.name)}
                >
                  <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={filters.fuelType?.includes(fuel.name) || false}
                      onChange={() => handleFuelToggle(fuel.name)}
                      onClick={(e) => e.stopPropagation()}
                      className="fuel-checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        margin: 0
                      }}
                    />
                    <img
                      src={fuel.icon}
                      alt={fuel.name}
                      style={{
                        width: '16px',
                        height: '16px',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        // Fallback to a placeholder or existing image if icon fails to load
                        e.target.src = '/images/petrol.png';
                      }}
                    />
                    <span className="fSize-4 fw-normal text-dark">{fuel.name}</span>
                  </div>
                  <span className="fSize-4 fw-normal text-muted" style={{ color: '#B0B0B0' }}>
                    ({fuel.count || 0})
                  </span>
                </div>
              ))}
            </div>
          )}

          {expandedItem === item && item === "Body Type" && (
            <div className="body-type-filter mt-3 pb-3">
              <div className="row g-3">
                {bodyTypes.map((bodyType, bodyIndex) => {
                  const isSelected = filters.bodyType?.includes(bodyType.name) || false;
                  return (
                    <div key={bodyIndex} className="col-12 col-md-6">
                      <div
                        className={`body-type-card position-relative ${
                          isSelected ? 'body-type-selected' : ''
                        }`}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          border: isSelected ? 'none' : '1px solid #E5E5E5',
                          backgroundColor: isSelected ? '#E5F3FF' : '#f5f5f5',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleBodyTypeToggle(bodyType.name)}
                      >
                        {/* Selection Indicator */}
                        <div
                          className="body-type-check position-absolute"
                          style={{
                            top: '8px',
                            right: '8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--call-bg-color)' : '#FFFFFF',
                            border: isSelected ? 'none' : '1px solid #E5E5E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isSelected && (
                            <FontAwesomeIcon 
                              icon={faCheck} 
                              style={{ 
                                color: '#FFFFFF', 
                                fontSize: '12px' 
                              }} 
                            />
                          )}
                        </div>

                        {/* Car Image */}
                        <div className="body-type-image">
                          <img
                            src={bodyType.image}
                            alt={bodyType.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                            onError={(e) => {
                              e.target.src = '/images/car.png';
                            }}
                          />
                        </div>

                        {/* Body Type Name */}
                        <h6 className="fSize-2 fw-semibold text-dark mb-0">
                          {bodyType.name}
                        </h6>

                        {/* Count */}
                        <p className="fSize-1 fw-normal text-muted mb-0" style={{ color: '#B0B0B0' }}>
                          ({bodyType.count})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {expandedItem === item && item === "Transmission" && (
            <div className="transmission-filter">
              {transmissionTypes.map((transmission, transmissionIndex) => (
                <div
                  key={transmissionIndex}
                  className="transmission-filter-item d-flex align-items-center justify-content-between py-2 border-bottom"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleTransmissionToggle(transmission.name)}
                >
                  <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={filters.transmission?.includes(transmission.name) || false}
                      onChange={() => handleTransmissionToggle(transmission.name)}
                      onClick={(e) => e.stopPropagation()}
                      className="transmission-checkbox"
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        margin: 0
                      }}
                    />
                    <img
                      src={transmission.icon}
                      alt={transmission.name}
                      style={{
                        width: '16px',
                        height: '16px',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.src = '/images/automatic.png';
                      }}
                    />
                    <span className="fSize-4 fw-normal text-dark">{transmission.name}</span>
                  </div>
                  <span className="fSize-4 fw-normal text-muted" style={{ color: '#B0B0B0' }}>
                    ({transmission.count || 0})
                  </span>
                </div>
              ))}
            </div>
          )}

          {expandedItem === item && item === "Color" && (
            <div className="color-filter pb-3">
              <div 
                className="color-filter-grid"
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}
              >
                <div className="row g-2">
                  {colors.map((color, colorIndex) => {
                    const isSelected = filters.color?.includes(color.name) || false;
                    return (
                      <div key={colorIndex} className="col-6">
                        <div
                          className="color-card position-relative"
                          style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            backgroundColor: '#F5F5F5',
                            padding: '12px',
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            border: isSelected ? 'none' : '1px solid #E5E5E5',
                            backgroundColor: isSelected ? '#E5F3FF' : '#f5f5f5',
                          }}
                          onClick={() => handleColorToggle(color.name)}
                        >
                          {/* Selection Indicator */}
                          <div
                            className="color-check position-absolute"
                            style={{
                              top: '8px',
                              right: '8px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? 'var(--call-bg-color)' : '#FFFFFF',
                              border: isSelected ? 'none' : '1px solid #E5E5E5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {isSelected && (
                              <FontAwesomeIcon 
                                icon={faCheck} 
                                style={{ 
                                  color: '#FFFFFF', 
                                  fontSize: '10px' 
                                }} 
                              />
                            )}
                          </div>

                          {/* Car Image */}
                          <div className="color-image mb-2" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <img
                              src={color.image}
                              alt={color.name}
                              style={{
                                width: '100%',
                                maxWidth: '80px',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: isSelected ? 'brightness(1.1)' : 'none'
                              }}
                              onError={(e) => {
                                e.target.src = '/images/car.png';
                              }}
                            />
                          </div>

                          {/* Color Name */}
                          <h6 className="fSize-2 fw-semibold text-dark mb-0 text-center">
                            {color.name}
                          </h6>

                          {/* Count - shown below color name */}
                          <p className="fSize-1 fw-normal text-muted mb-0 text-center mt-1" style={{ color: '#B0B0B0' }}>
                            ({color.count || 0})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


          {expandedItem === item && item === "Seats" && (
            <div className="seats-filter pb-3">
              <div className="row g-2">
                {seats.map((seat, seatIndex) => {
                  const isSelected = filters.seats?.includes(seat.name) || false;
                  return (
                    <div key={seatIndex} className="col-6">
                      <div
                        className="seat-card position-relative"
                        style={{
                          cursor: 'pointer',
                          borderRadius: '8px',
                          backgroundColor: '#F5F5F5',
                          padding: '12px',
                          minHeight: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          border: isSelected ? 'none' : '1px solid #E5E5E5',
                          backgroundColor: isSelected ? '#E5F3FF' : '#f5f5f5',
                        }}
                        onClick={() => handleSeatToggle(seat.name)}
                      >
                        {/* Selection Indicator */}
                        <div
                          className="seat-check position-absolute"
                          style={{
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--call-bg-color)' : '#FFFFFF',
                            border: isSelected ? 'none' : '1px solid #E5E5E5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isSelected && (
                            <FontAwesomeIcon 
                              icon={faCheck} 
                              style={{ 
                                color: '#FFFFFF', 
                                fontSize: '10px' 
                              }} 
                            />
                          )}
                        </div>

                        {/* Seat Icon */}
                        <div className="seat-image mb-2" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                          <img
                            src={seat.icon}
                            alt={seat.name}
                            style={{
                              width: '100%',
                              maxWidth: '60px',
                              height: 'auto',
                              objectFit: 'contain',
                              filter: isSelected ? 'brightness(1.1)' : 'none'
                            }}
                            onError={(e) => {
                              e.target.src = '/images/users.png';
                            }}
                          />
                        </div>

                        {/* Seat Name */}
                        <h6 className="fSize-2 fw-semibold text-dark mb-1 text-center">
                          {seat.name}
                        </h6>

                        {/* Count */}
                        <p className="fSize-1 fw-normal text-muted mb-0 text-center" style={{ color: '#B0B0B0' }}>
                          ({seat.count || 0})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {expandedItem === item && item === "Owners" && (
            <div className="owners-filter pb-3">
              {owners.map((owner, ownerIndex) => {
                const isSelected = filters.owner?.includes(owner.name) || false;
                return (
                  <div
                    key={ownerIndex}
                    className="owner-item d-flex align-items-center justify-content-between py-2 border-bottom"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOwnerToggle(owner.name)}
                  >
                    <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOwnerToggle(owner.name)}
                        onClick={(e) => e.stopPropagation()}
                        className="owner-checkbox"
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          margin: 0
                        }}
                      />
                      <img
                        src={owner.icon}
                        alt={owner.name}
                        style={{
                          width: '16px',
                          height: '16px',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/user.svg';
                        }}
                      />
                      <span className="fSize-2 fw-normal text-dark">{owner.name}</span>
                    </div>
                    <span className="fSize-2 fw-normal text-muted" style={{ color: '#B0B0B0' }}>
                      ({owner.count || 0})
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default ModalCarDetails;
