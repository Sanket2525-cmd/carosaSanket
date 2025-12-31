"use client";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useFilter } from "@/contexts/FilterContext";
import { useFilterData } from "@/contexts/FilterDataContext";
import brandsData from "@/data/Brands.json";
import { normalizeBrand } from "@/utils/brandNormalizer";

function BrandsCarsList() {
  const { filters, updateFilters } = useFilter();
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create a map of brand names to their images for quick lookup
  const brandImageMap = useMemo(() => {
    const map = new Map();
    brandsData.forEach((brand) => {
      // Store both exact match and lowercase match for case-insensitive lookup
      map.set(brand.brandName.toLowerCase(), brand.image);
      map.set(brand.brandName, brand.image);
    });
    return map;
  }, []);

  // Helper function to normalize brand names for matching
  const normalizeBrandName = (name) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[\s-]/g, '').trim();
  };

  // Helper function to find matching brand name (case-insensitive, handles spaces/hyphens)
  const findMatchingBrandName = (apiBrandName, brandsJsonNames) => {
    const normalizedApiName = normalizeBrandName(apiBrandName);
    
    // Try exact match first
    const exactMatch = brandsJsonNames.find(b => 
      b.brandName.toLowerCase() === apiBrandName.toLowerCase()
    );
    if (exactMatch) return exactMatch.brandName;
    
    // Try normalized match
    const normalizedMatch = brandsJsonNames.find(b => 
      normalizeBrandName(b.brandName) === normalizedApiName
    );
    if (normalizedMatch) return normalizedMatch.brandName;
    
    return null;
  };

  // Helper function to get brand image
  const getBrandImage = (brandName) => {
    if (!brandName) return "/images/brandslogo.png";
    
    // Try exact match first
    let image = brandImageMap.get(brandName);
    if (image) return image;
    
    // Try case-insensitive match
    image = brandImageMap.get(brandName.toLowerCase());
    if (image) return image;
    
    // Try partial match (for cases like "Mercedes Benz" vs "Mercedes-Benz")
    const normalizedBrandName = normalizeBrandName(brandName);
    for (const [key, value] of brandImageMap.entries()) {
      const normalizedKey = normalizeBrandName(key);
      if (normalizedKey === normalizedBrandName) {
        return value;
      }
    }
    
    // Fallback to default image
    return "/images/brandslogo.png";
  };

  // Helper function to extract model name (handles both string and object formats)
  const getModelName = (model) => {
    if (typeof model === 'string') {
      return model;
    }
    if (typeof model === 'object' && model !== null) {
      return model?.name || '';
    }
    return '';
  };

  // Helper function to extract model count (handles both string and object formats)
  const getModelCount = (model) => {
    if (typeof model === 'object' && model !== null && typeof model.count === 'number') {
      return model.count;
    }
    return 0;
  };

  // Use filter data from context instead of making separate API call
  const { filterData } = useFilterData();
  
  useEffect(() => {
    let isMounted = true;

    const processBrands = () => {
      try {
        setLoading(true);
        // Use filter data from context (already fetched and cached)
        const response = filterData;
        
        if (!response || !response.success || !response.data) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        // Start with all brands from Brands.json
        const allBrandsMap = new Map();
        
        // Initialize all brands from Brands.json with default values
        // Filter out "Maruti" brand as we use "Maruti Suzuki" instead
        brandsData
          .filter((brandJson) => brandJson.brandName !== 'Maruti')
          .forEach((brandJson) => {
            allBrandsMap.set(brandJson.brandName.toLowerCase(), {
              name: brandJson.brandName,
              count: 0,
              models: [] // Will be array of { name, count } objects
            });
          });
        
        // Merge API data if available (from aggregated endpoint)
        if (response && response.success && response.data && response.data.brands) {
          // Process API brands and merge with Brands.json data
          response.data.brands.forEach((apiBrand) => {
            // Normalize brand name first (maps JSW MG Motor variations to MG Motors)
            const normalizedApiBrandName = normalizeBrand(apiBrand.name);
            // Find matching brand name from Brands.json
            const matchingBrandName = findMatchingBrandName(normalizedApiBrandName, brandsData);
            
            if (matchingBrandName) {
              // Use the brand name from Brands.json (to ensure consistency)
              const normalizedKey = matchingBrandName.toLowerCase();
              const existingBrand = allBrandsMap.get(normalizedKey);
              
              if (existingBrand) {
                // Merge API data with existing brand
                existingBrand.count += apiBrand.count || 0;
                if (apiBrand.models && Array.isArray(apiBrand.models)) {
                  // Models are now objects with { name, count } structure
                  apiBrand.models.forEach((model) => {
                    const modelName = getModelName(model);
                    const modelCount = getModelCount(model);
                    
                    // Check if model already exists
                    const existingModelIndex = existingBrand.models.findIndex(
                      m => getModelName(m) === modelName
                    );
                    
                    if (existingModelIndex === -1) {
                      // Add new model
                      existingBrand.models.push({
                        name: modelName,
                        count: modelCount
                      });
                    } else {
                      // Update count if model exists
                      const existingModel = existingBrand.models[existingModelIndex];
                      if (typeof existingModel === 'object') {
                        existingModel.count = (existingModel.count || 0) + modelCount;
                      } else {
                        // Convert string to object
                        existingBrand.models[existingModelIndex] = {
                          name: existingModel,
                          count: modelCount
                        };
                      }
                    }
                  });
                }
              }
            } else {
              // Brand from API not in Brands.json - add it anyway (use normalized name)
              const normalizedKey = normalizedApiBrandName.toLowerCase();
              if (!allBrandsMap.has(normalizedKey)) {
                allBrandsMap.set(normalizedKey, {
                  name: normalizedApiBrandName,
                  count: apiBrand.count || 0,
                  models: apiBrand.models || []
                });
              } else {
                // Merge if duplicate
                const existing = allBrandsMap.get(normalizedKey);
                existing.count += apiBrand.count || 0;
                if (apiBrand.models && Array.isArray(apiBrand.models)) {
                  // Models are now objects with { name, count } structure
                  apiBrand.models.forEach((model) => {
                    const modelName = getModelName(model);
                    const modelCount = getModelCount(model);
                    
                    // Check if model already exists
                    const existingModelIndex = existing.models.findIndex(
                      m => getModelName(m) === modelName
                    );
                    
                    if (existingModelIndex === -1) {
                      // Add new model
                      existing.models.push({
                        name: modelName,
                        count: modelCount
                      });
                    } else {
                      // Update count if model exists
                      const existingModel = existing.models[existingModelIndex];
                      if (typeof existingModel === 'object') {
                        existingModel.count = (existingModel.count || 0) + modelCount;
                      } else {
                        // Convert string to object
                        existing.models[existingModelIndex] = {
                          name: existingModel,
                          count: modelCount
                        };
                      }
                    }
                  });
                }
              }
            }
          });
        }
        
        // Convert map to array, filter out brands with 0 count, and sort alphabetically by brand name
        if (isMounted) {
          const brandsArray = Array.from(allBrandsMap.values())
            .filter((brand) => brand.count > 0) // Filter out brands with 0 count
            .map((brand) => {
              // Also filter out models with 0 count
              const filteredModels = (brand.models || []).filter((model) => {
                const modelCount = getModelCount(model);
                return modelCount > 0;
              });
              return {
                ...brand,
                models: filteredModels
              };
            })
            .sort((a, b) => 
              a.name.localeCompare(b.name)
            );
          
          setBrands(brandsArray);
        }
      } catch (error) {
        console.error('Error processing brands:', error);
        // Even on error, show brands from Brands.json (filter out Maruti, but don't filter by count in error case)
        if (isMounted) {
          const brandsArray = brandsData
            .filter((brand) => brand.brandName !== 'Maruti') // Filter out Maruti brand
            .map(brand => ({
              name: brand.brandName,
              count: 0,
              models: [] // Will be array of { name, count } objects
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
          setBrands(brandsArray);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (filterData) {
      processBrands();
    } else {
      setLoading(true);
    }

    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const toggleExpand = (brandName) => {
    setExpanded(expanded === brandName ? null : brandName);
  };

  const handleBrandCheck = (brandName, models) => {
    const isBrandSelected = filters.selectedBrands.includes(brandName);
    
    if (isBrandSelected) {
      // Remove brand and all its models
      const newSelectedBrands = filters.selectedBrands.filter(b => b !== brandName);
      const newSelectedModels = filters.selectedModels.filter(m => 
        !m.startsWith(`${brandName}-`)
      );
      
      updateFilters({
        selectedBrands: newSelectedBrands,
        selectedModels: newSelectedModels
      });
    } else {
      // Add brand only (don't auto-select all models - user must select models explicitly)
      const newSelectedBrands = [...filters.selectedBrands, brandName];
      
      updateFilters({
        selectedBrands: newSelectedBrands,
        // Keep existing models - don't auto-add all models for the brand
      });
    }
  };

  const handleModelCheck = (brandName, modelName) => {
    const modelKey = `${brandName}-${modelName}`;
    const isModelSelected = filters.selectedModels.includes(modelKey);
    
    if (isModelSelected) {
      // Remove model
      const newSelectedModels = filters.selectedModels.filter(m => m !== modelKey);
      
      // Check if any models of this brand are still selected
      const brand = brands.find(b => b.name === brandName);
      if (brand && brand.models && Array.isArray(brand.models)) {
        const remainingModels = brand.models.filter(model => {
          return newSelectedModels.includes(`${brandName}-${getModelName(model)}`);
        });
        
        // If no models are selected, remove the brand
        const newSelectedBrands = remainingModels.length === 0 
          ? filters.selectedBrands.filter(b => b !== brandName)
          : filters.selectedBrands;
        
        updateFilters({
          selectedBrands: newSelectedBrands,
          selectedModels: newSelectedModels
        });
      } else {
        // Brand not found or has no models, just remove the model
        updateFilters({
          selectedModels: newSelectedModels
        });
      }
    } else {
      // Add model
      const newSelectedModels = [...filters.selectedModels, modelKey];
      
      // Always add the brand when any model is selected
      const newSelectedBrands = filters.selectedBrands.includes(brandName)
        ? filters.selectedBrands
        : [...filters.selectedBrands, brandName];
      
      updateFilters({
        selectedBrands: newSelectedBrands,
        selectedModels: newSelectedModels
      });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateFilters({ searchQuery: query });
  };

  return (
    <>
      <div className="allBrand border-bottom pb-2 mb-3">
        <div className="makeModel mb-0">
          <h6 className="fSize-4 fw-bold text-black mb-3">Make & Model</h6>
          <div className="inputfilter position-relative mb-3">
            <input
              type="search"
              placeholder="Search a brand or model"
              className="w-100 py-2 ps-5 rounded-2"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Image
              src="/images/Search.png"
              width={16}
              height={16}
              className="searchIconWrap d-block"
              alt="Search"
            />
          </div>
          <h6 className="fSize-4 fw-normal m-0">All Brands</h6>
        </div>
        <div className="tt">
          {loading ? (
            <div className="text-center py-3">
              <p className="fSize-3 text-muted">Loading brands...</p>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-3">
              <p className="fSize-3 text-muted">No brands available</p>
            </div>
          ) : (
            brands
              .filter((brand) => {
                // Filter by search query if present
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  brand.name?.toLowerCase().includes(query) ||
                  (Array.isArray(brand.models) && brand.models.some((model) => {
                    const modelName = getModelName(model);
                    return typeof modelName === 'string' && modelName.toLowerCase().includes(query);
                  }))
                );
              })
              .map((brand, index) => (
                <div key={`${brand.name}-${index}`} className="card__listing">
                  <div className="d-flex justify-content-between align-items-center">
                    <div 
                      className="d-flex align-items-center gap-3"
                      onClick={() => toggleExpand(brand.name)}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      <div className="checkBox mt-2">
                        <input 
                          type="checkbox" 
                          className="custom-checkbox"
                          checked={filters.selectedBrands.includes(brand.name)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleBrandCheck(brand.name, brand.models || []);
                          }}
                        />
                      </div>
                      <div className="brand__logo">
                        <img
                          src={getBrandImage(brand.name)}
                          width={30}
                          height={12}
                          alt={brand.name}
                          style={{ objectFit: 'contain' }}
                          onError={(e) => {
                            // Fallback to default image if brand image fails to load
                            e.target.src = "/images/brandslogo.png";
                          }}
                        />
                      </div>
                      <div className="barnd__name">
                        <p className="m-0 fSize-4 fw-semibold text-black">
                          {brand.name}
                        </p>
                      </div>
                    </div>

                    <div className="items d-flex gap-2">
                      <div className="numberOfCar fSize-3 fw-medium">
                        ({brand.count || 0})
                      </div>
                      {brand.models && brand.models.filter((model) => getModelCount(model) > 0).length > 0 && (
                        <div 
                          className="brandlistdrop"
                          onClick={() => toggleExpand(brand.name)}
                          style={{ cursor: 'pointer' }}
                        >
                          <FontAwesomeIcon
                            icon={expanded === brand.name ? faAngleUp : faAngleDown}
                            className="angleDown"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable List */}
                  {expanded === brand.name && brand.models && brand.models.filter((model) => getModelCount(model) > 0).length > 0 && (
                    <ul className="brand-models list-unstyled ms-5 mt-2">
                      {brand.models.filter((model) => getModelCount(model) > 0).length === 0 ? (
                        <li className="py-1 fSize-3 text-muted">
                          No models available
                        </li>
                      ) : (
                        brand.models
                          .filter((model) => getModelCount(model) > 0) // Filter out models with 0 count
                          .map((model, i) => {
                            const modelName = getModelName(model);
                            const modelCount = getModelCount(model);
                            // Ensure modelName is a string, not an object
                            const safeModelName = typeof modelName === 'string' ? modelName : String(modelName || '');
                            const safeModelCount = typeof modelCount === 'number' ? modelCount : 0;
                            return (
                              <li
                                key={`${brand.name}-${safeModelName}-${i}`}
                                className="py-1 fSize-3 text-muted d-flex justify-content-between align-items-center"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <label className="checkBox mt-2">
                                    <input 
                                      type="checkbox" 
                                      className="custom-checkbox"
                                      checked={filters.selectedModels.includes(`${brand.name}-${safeModelName}`)}
                                      onChange={() => handleModelCheck(brand.name, safeModelName)}
                                    />
                                  </label>
                                  <p className="m-0">{safeModelName}</p>
                                </div>
                                <div className="numberOfCar fSize-3 fw-medium">
                                  ({safeModelCount})
                                </div>
                              </li>
                            );
                          })
                      )}
                    </ul>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}

export default BrandsCarsList;
