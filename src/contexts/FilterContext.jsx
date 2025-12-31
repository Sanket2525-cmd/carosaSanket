"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CarService from '../services/carService';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const searchParams = useSearchParams();
  
  const getInitialFilters = () => {
    const minPriceParam = searchParams?.get('minPrice');
    const maxPriceParam = searchParams?.get('maxPrice');
    const fuelParam = searchParams?.get('fuel');
    const transmissionParam = searchParams?.get('transmission');
    const yearParam = searchParams?.get('year');
    const categoryParam = searchParams?.get('category');
    const bodyTypeParam = searchParams?.get('bodyType');
    const makeParam = searchParams?.get('make');
    
    let yearRange = { min: 2010, max: 2024 };
    if (yearParam && yearParam.includes('-')) {
      const [minYear, maxYear] = yearParam.split('-').map(y => parseInt(y.trim(), 10));
      if (!isNaN(minYear) && !isNaN(maxYear)) {
        yearRange = { min: minYear, max: maxYear };
      }
    }
    
    // Parse make parameter - can be single brand or comma-separated brands
    let selectedBrands = [];
    if (makeParam) {
      selectedBrands = makeParam.split(',').map(brand => brand.trim()).filter(brand => brand.length > 0);
    }
    
    return {
      // Price range - use URL params if available
      minPrice: minPriceParam ? parseInt(minPriceParam, 10) : 100000,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : 3005000,
      
      // Brand and model filters - read from URL params
      selectedBrands: selectedBrands,
      selectedModels: [],
      searchQuery: '',
      
      // Additional filters
      yearRange: yearRange,
      kmRange: { min: 0, max: 500000 },
      fuelType: fuelParam ? [fuelParam] : [],
      transmission: transmissionParam ? [transmissionParam] : [],
      owner: [],
      bodyType: bodyTypeParam ? [bodyTypeParam] : [],
      sellerType: null, // Carosa Partner, Direct owner
      
      // Category filter - read from URL params
      category: categoryParam || 'All', // All, Mid-Range Cars, Luxury Cars
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true to prevent showing 0 initially
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Fetch cars based on current filters (memoized)
  const fetchCars = useCallback(async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const params = {
        page,
        limit: pagination.limit,
        // Price filters
        minPrice: (filters.minPrice !== 100000 || filters.minPrice === 0) ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice !== 3005000 ? filters.maxPrice : undefined,
        // Brand filters
        make: filters.selectedBrands.length > 0 ? filters.selectedBrands.join(',') : undefined,
        model: filters.selectedModels.length > 0 ? filters.selectedModels.join(',') : undefined,
        // Search
        search: filters.searchQuery || undefined,
        // Additional filters
        year: filters.yearRange.min !== undefined && filters.yearRange.max !== undefined && 
              (filters.yearRange.min !== 2010 || filters.yearRange.max !== 2024) 
              ? `${filters.yearRange.min}-${filters.yearRange.max}` : undefined,
        km: filters.kmRange.min !== undefined && filters.kmRange.max !== undefined && 
            (filters.kmRange.min !== 0 || filters.kmRange.max !== 500000) 
            ? `${filters.kmRange.min}-${filters.kmRange.max}` : undefined,
        fuel: filters.fuelType.length > 0 ? filters.fuelType.join(',') : undefined,
        transmission: filters.transmission.length > 0 ? filters.transmission.join(',') : undefined,
        owner: filters.owner.length > 0 ? filters.owner.join(',') : undefined,
        bodyType: filters.bodyType.length > 0 ? filters.bodyType.join(',') : undefined,
        sellerType: filters.sellerType || undefined,
        color: filters.color && filters.color.length > 0 ? filters.color.join(',') : undefined,
        features: filters.features && filters.features.length > 0 ? filters.features.join(',') : undefined,
        seats: filters.seats && filters.seats.length > 0 ? filters.seats.join(',') : undefined,
        // Category
        category: filters.category !== 'All' ? filters.category : undefined,
        // Only add cache busting when filters actually change (not on initial load)
        // Use forceRefresh flag to indicate this is a filter change, not initial load
        ...(append ? { _t: Date.now(), forceRefresh: true } : {})
      };

      // Remove undefined, empty, or null values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '' || params[key] === null) {
          delete params[key];
        }
      });

      console.log('Fetching cars with filters:', params);
      const response = await CarService.getAllCars(params);
      
      if (response && response.data) {
        if (append) {
          // Append new cars to existing list
          setCars(prev => [...prev, ...response.data]);
        } else {
          // Replace with new data
          setCars(response.data);
        }
        setTotalCount(response.total || response.meta?.total || 0);
        setPagination(prev => ({
          ...prev,
          page,
          totalPages: Math.ceil((response.total || response.meta?.total || response.data.length) / prev.limit)
        }));
      } else {
        if (!append) {
          setCars([]);
        }
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      if (!append) {
        setCars([]);
        setTotalCount(0);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [filters, pagination.limit]);

  // Update filters and refetch
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      minPrice: 100000,
      maxPrice: 3005000,
      selectedBrands: [],
      selectedModels: [],
      searchQuery: '',
      yearRange: { min: 2010, max: 2024 },
      kmRange: { min: 0, max: 500000 },
      fuelType: [],
      transmission: [],
      owner: [],
      bodyType: [],
      sellerType: null,
      seats: [],
      color: [],
      features: [],
      category: 'All',
    });
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];
    
    if (filters.selectedBrands.length > 0) {
      active.push(...filters.selectedBrands.map(brand => `${brand} X`));
    }
    
    if (filters.selectedModels.length > 0) {
      active.push(...filters.selectedModels.map(model => `${model} X`));
    }
    
    if (filters.fuelType.length > 0) {
      active.push(...filters.fuelType);
    }
    
    if (filters.transmission.length > 0) {
      active.push(...filters.transmission);
    }
    
    if (filters.bodyType.length > 0) {
      active.push(...filters.bodyType);
    }
    
    if (filters.owner.length > 0) {
      active.push(...filters.owner);
    }
    
    if (filters.seats && filters.seats.length > 0) {
      active.push(...filters.seats);
    }
    
    if (filters.color && filters.color.length > 0) {
      active.push(...filters.color);
    }
    
    if (filters.features && filters.features.length > 0) {
      active.push(...filters.features);
    }
    
    return active;
  };

  // Update filters from URL params on mount
  useEffect(() => {
    if (searchParams) {
      const minPriceParam = searchParams.get('minPrice');
      const maxPriceParam = searchParams.get('maxPrice');
      const fuelParam = searchParams.get('fuel');
      const transmissionParam = searchParams.get('transmission');
      const yearParam = searchParams.get('year');
      const categoryParam = searchParams.get('category');
      const bodyTypeParam = searchParams.get('bodyType');
      const makeParam = searchParams.get('make');
      
      if (minPriceParam || maxPriceParam || fuelParam || transmissionParam || yearParam || categoryParam || bodyTypeParam || makeParam) {
        setFilters(prev => {
          let yearRange = prev.yearRange;
          if (yearParam && yearParam.includes('-')) {
            const [minYear, maxYear] = yearParam.split('-').map(y => parseInt(y.trim(), 10));
            if (!isNaN(minYear) && !isNaN(maxYear)) {
              yearRange = { min: minYear, max: maxYear };
            }
          }
          
          // Parse make parameter - can be single brand or comma-separated brands
          let selectedBrands = prev.selectedBrands;
          if (makeParam) {
            selectedBrands = makeParam.split(',').map(brand => brand.trim()).filter(brand => brand.length > 0);
          } else if (makeParam === null) {
            // If make param is explicitly removed from URL, clear brands
            selectedBrands = [];
          }
          
          return {
            ...prev,
            minPrice: minPriceParam ? parseInt(minPriceParam, 10) : prev.minPrice,
            maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : prev.maxPrice,
            fuelType: fuelParam ? [fuelParam] : prev.fuelType,
            transmission: transmissionParam ? [transmissionParam] : prev.transmission,
            yearRange: yearRange,
            category: categoryParam || prev.category,
            bodyType: bodyTypeParam ? [bodyTypeParam] : prev.bodyType,
            selectedBrands: selectedBrands,
          };
        });
      }
    }
  }, [searchParams]);

  // Track if this is the initial mount
  const isInitialMount = useRef(true);
  
  // Fetch cars when filters change (with debouncing)
  useEffect(() => {
    // Skip on initial mount - let the component handle initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Initial load without cache busting
      fetchCars(1, false);
      return;
    }
    
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
    setCars([]); // Clear existing cars when filters change
    
    const timeoutId = setTimeout(() => {
      fetchCars(1, false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, fetchCars]);

  // Calculate if there are more pages to load
  const hasMore = pagination.page < pagination.totalPages;

  const value = {
    filters,
    cars,
    loading,
    loadingMore,
    totalCount,
    pagination,
    hasMore,
    updateFilters,
    clearFilters,
    fetchCars,
    getActiveFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
