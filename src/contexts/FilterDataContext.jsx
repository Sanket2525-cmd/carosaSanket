"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CarService from '../services/carService';

const FilterDataContext = createContext();

export const useFilterData = () => {
  const context = useContext(FilterDataContext);
  if (!context) {
    throw new Error('useFilterData must be used within a FilterDataProvider');
  }
  return context;
};

export const FilterDataProvider = ({ children }) => {
  const [filterData, setFilterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter data once and share across all components
  const fetchFilterData = useCallback(async () => {
    // Check if data is already being fetched
    if (FilterDataProvider._isFetching) {
      // Wait for the existing fetch to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!FilterDataProvider._isFetching && filterData) {
            clearInterval(checkInterval);
            resolve(filterData);
          }
        }, 100);
      });
    }

    // Check sessionStorage cache first (extends existing 4-minute cache)
    const cacheKey = 'car_filter_counts_cache';
    const cacheTimestampKey = 'car_filter_counts_cache_timestamp';
    const cacheTTL = 4 * 60 * 1000; // 4 minutes

    try {
      const cachedData = sessionStorage.getItem(cacheKey);
      const cachedTimestamp = sessionStorage.getItem(cacheTimestampKey);
      
      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        
        if (now - timestamp < cacheTTL) {
          // Cache is still valid
          const parsedData = JSON.parse(cachedData);
          setFilterData(parsedData);
          setLoading(false);
          return parsedData;
        }
      }
    } catch (error) {
      // If sessionStorage fails, continue with API call
      console.warn('SessionStorage access failed, proceeding with API call:', error);
    }

    // Mark as fetching to prevent duplicate requests
    FilterDataProvider._isFetching = true;

    try {
      setLoading(true);
      setError(null);
      
      const response = await CarService.getAllFilterCounts();
      
      if (response && response.success && response.data) {
        setFilterData(response);
        setLoading(false);
        FilterDataProvider._isFetching = false;
        return response;
      } else {
        throw new Error('Invalid response from getAllFilterCounts');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      FilterDataProvider._isFetching = false;
      throw err;
    }
  }, [filterData]);

  // Fetch on mount
  useEffect(() => {
    fetchFilterData();
  }, []); // Only run once on mount

  const value = {
    filterData,
    loading,
    error,
    refetch: fetchFilterData,
  };

  return (
    <FilterDataContext.Provider value={value}>
      {children}
    </FilterDataContext.Provider>
  );
};

// Static flag to track if fetch is in progress
FilterDataProvider._isFetching = false;

export default FilterDataProvider;

