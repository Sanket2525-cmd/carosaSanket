"use client";

import React, { useState, useEffect } from 'react';
import CongratsCard from './CongratsCard';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/contexts/SocketProvider';
import OffersModal from '@/components/modals/OffersModal';
import SearchInput from "@/components/common/SearchInput";
import { useDebounce } from "@/services/useDebounce";
import { API_BASE_URL } from "@/config/environment";
import { safeParseCustomFields } from "@/utils/jsonUtils";

function OfferBadge({children, variant='active'}){
  const styles = {
    active: {background:'#16A34A', color:'#fff'},
    certified: {background:'#16A34A', color:'#fff'},
    offers: {background:'#F3FFF3', color:'#16A34A', border:'2px solid #8ED47A'}
  };
  return (
    <span className="dv2-sell-badge" style={styles[variant]}>
      {variant==='certified' && '✓ '}{children}
    </span>
  );
}

export default function BestOffersV2(){
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  const { socket, isConnected, socketService } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch offers for user's cars
  useEffect(() => {
    const fetchOffers = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        // Get user's cars first
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cars/owned/`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const carsData = await response.json();
          const cars = carsData.data || [];
          
          // Fetch offers for each car
          const allOffers = [];
          for (const car of cars) {
            try {
              const offersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offers/car/${car.id}`, {
                credentials: 'include'
              });
              
              if (offersResponse.ok) {
                const offersData = await offersResponse.json();
                if (offersData.success && offersData.data) {
                  offersData.data.forEach(deal => {
                    // Include deals with negotiations (traditional offers)
                    if (deal.DealNegotiation && deal.DealNegotiation.length > 0) {
                      deal.DealNegotiation.forEach(negotiation => {
                        allOffers.push({
                          ...negotiation,
                          car: car,
                          deal: deal
                        });
                      });
                    }
                    
                    // Also include deals with test drives that have payments (direct Book Now flow)
                    // Even if they don't have negotiations, they should show in Best Offer section
                    if (deal.TestDrive && deal.TestDrive.length > 0 && deal.Payment && deal.Payment.length > 0) {
                      // Check if this deal is already added via negotiations
                      const alreadyAdded = allOffers.some(offer => offer.deal?.id === deal.id);
                      
                      if (!alreadyAdded) {
                        // Create a virtual negotiation entry for deals with test drive payments but no negotiations
                        // This allows them to appear in the Best Offer section
                        const testDrivePayment = deal.Payment[0];
                        const testDrive = deal.TestDrive[0];
                        
                        // Use listing price from car or payment amount
                        const extractedCustomFields = safeParseCustomFields(car);
                        const listingPrice = extractedCustomFields?.listingPrice || 
                                           extractedCustomFields?.listing_price || 
                                           testDrivePayment?.amount || 
                                           0;
                        
                        allOffers.push({
                          id: `testdrive-${deal.id}`,
                          carDealId: deal.id,
                          userId: deal.userId,
                          amount: listingPrice,
                          message: 'Agreed to buy at listing price',
                          createdAt: deal.createdAt,
                          updatedAt: deal.updatedAt,
                          User: deal.User,
                          car: car,
                          deal: deal,
                          isTestDrivePayment: true, // Flag to identify test drive payments
                          testDrive: testDrive,
                          payment: testDrivePayment,
                        });
                      }
                    }
                  });
                }
              }
            } catch (error) {
              console.error(`Error fetching offers for car ${car.id}:`, error);
            }
          }
          
          setOffers(allOffers);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [isAuthenticated, user]);

  // Set up socket event listeners for real-time updates
  useEffect(() => {
    if (!isAuthenticated || !socket) return;

    console.log('Setting up socket event listeners for best offers');
    
    // Listen for new offers
    const handleOfferSubmitted = (data) => {
      console.log('New offer received:', data);
      // Show notification
      if (data.carId) {
        alert(`🎉 New offer received for your car! Amount: ₹${(data.amount / 100000).toFixed(2)} Lakh`);
      }
      // Refresh offers when new offer is submitted
      window.location.reload(); // Simple refresh for now
    };

    socket.on('offer_submitted', handleOfferSubmitted);

    return () => {
      socket.off('offer_submitted', handleOfferSubmitted);
    };
  }, [isAuthenticated, socket]);

  // Handle accepting an offer
  const handleAcceptOffer = async (offer) => {
    const negotiationId = offer.id;
    const carId = offer.car?.id;
    
    if (!carId) {
      alert('Car ID not found');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offers/${negotiationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (response.ok) {
        // Navigate to seller negotiation chat page
        // Don't add acceptance message here - it will be added by backend/socket
        window.location.href = `/seller-negotiation?carId=${carId}&negotiationId=${negotiationId}`;
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to accept offer');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Error accepting offer');
    }
  };

  // Handle rejecting an offer
  const handleRejectOffer = async (offer) => {
    const negotiationId = offer.id;
    const carId = offer.car?.id;
    
    if (!carId) {
      alert('Car ID not found');
      return;
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/offers/${negotiationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: 'Offer rejected by seller' })
      });
      
      if (response.ok) {
        // Navigate to seller negotiation chat page
        // Don't add rejection message here - it will be added by backend/socket if needed
        window.location.href = `/seller-negotiation?carId=${carId}&negotiationId=${negotiationId}`;
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to reject offer');
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('Error rejecting offer');
    }
  };

  // Navigate to seller negotiation page (view-only, no API calls)
  const navigateToNegotiation = (offer) => {
    const negotiationId = offer.id;
    const carId = offer.car?.id;
    const dealId = offer.deal?.id || offer.carDealId;
    
    if (!carId) {
      alert('Car ID not found');
      return;
    }
    
    // For test drive payment deals, use dealId instead of negotiationId
    // This ensures the chat opens correctly for direct Book Now flow
    if (offer.isTestDrivePayment && dealId) {
      window.location.href = `/seller-negotiation?carId=${carId}&dealId=${dealId}`;
    } else {
      // Just navigate to the chat screen without sending any messages
      const url = negotiationId 
        ? `/seller-negotiation?carId=${carId}&negotiationId=${negotiationId}`
        : `/seller-negotiation?carId=${carId}`;
      window.location.href = url;
    }
  };

  // Group offers by car and calculate best offer
  const groupOffersByCar = () => {
    const carMap = new Map();
    
    offers.forEach(offer => {
      const carId = offer.car?.id;
      if (!carId) return;
      
      if (!carMap.has(carId)) {
        carMap.set(carId, {
          car: offer.car,
          offers: [],
          bestOffer: 0,
          totalOffers: 0
        });
      }
      
      const carData = carMap.get(carId);
      carData.offers.push(offer);
      carData.totalOffers++;
      
      if (offer.amount > carData.bestOffer) {
        carData.bestOffer = offer.amount;
      }
    });
    
    return Array.from(carMap.values());
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Prepare modal data for OffersModal
  const getModalData = (carData) => {
    if (!carData) return null;
    
    const car = carData.car;
    const carTitle = `${car?.make || ''} ${car?.model || ''} ${car?.year || ''}`.trim();
    
    const buyers = carData.offers
      .sort((a, b) => b.amount - a.amount)
      .map((offer) => ({
        id: offer.id,
        name: offer.User?.name || 'Buyer',
        price: `₹${(offer.amount / 1000).toLocaleString('en-IN')}`,
        createdAt: offer.createdAt,
        offer: offer // Keep reference to original offer for navigation
      }));
    
    return {
      title: carTitle,
      did: car?.id || 'N/A',
      totalOffers: carData.totalOffers,
      buyers: buyers
    };
  };

  // Open modal with offers for a car
  const handleOpenOffers = (carData) => {
    setSelectedCar(carData);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCar(null);
  };

  // Handle view offer click from modal
  const handleViewOffer = (buyer) => {
    if (buyer.offer) {
      handleCloseModal();
      navigateToNegotiation(buyer.offer);
    }
  };

  if (loading) {
    return (
      <div className="dv2-offerlist">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading offers...</p>
        </div>
      </div>
    );
  }

  const carsWithOffers = groupOffersByCar();
  const filteredCars = carsWithOffers.filter(carData => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    const car = carData.car;
    const extractedCustomFields = safeParseCustomFields(car);
    const registrationNumber = extractedCustomFields.registrationNumber || 
                              extractedCustomFields.regNumber || 
                              car?.registrationNumber || 
                              '';
    return (
      car?.make?.toLowerCase().includes(search) ||
      car?.model?.toLowerCase().includes(search) ||
      registrationNumber.toLowerCase().includes(search) ||
      car?.id?.toString().includes(search)
    );
  });

  if (offers.length === 0) {
    return (
      <>
        <div className="topheader-cards mb-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Best Offer</h2>
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search by Name, Model, Reg. No, Brand..."
            />
          </div>
        </div>
        <div className="dv2-offerlist">
          <div className="card dv2-card p-5 text-center">
            <h5>No offers yet</h5>
            <p className="text-muted">You'll see offers for your cars here when buyers make them.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <div className="topheader-cards mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <h2 className="fSize-8 fs-md-1 fw-bold mb-0">Best Offer</h2>
          <SearchInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by Name, Model, Reg. No, Brand..."
          />
        </div>
      </div> */}

      <div className="dv2-offerlist dealers-dashboard">
        {filteredCars.map((carData, index) => {
          const car = carData.car;
          const extractedCustomFields = safeParseCustomFields(car);
          
          const carImage = car?.images?.[0] || 
            (car?.CarImages && car.CarImages.length > 0 ? `${API_BASE_URL}${car.CarImages[0].url}` : "/assets/carImage/exterior4.avif");
          const carTitle = `${car?.make || ''} ${car?.model || ''} ${car?.year || ''}`.trim();
          const activeSince = car?.createdAt ? formatDate(car.createdAt) : 'N/A';
          const lastModified = car?.updatedAt ? formatDate(car.updatedAt) : 'N/A';
          
          // Extract price from multiple possible locations
          const listingPrice = extractedCustomFields.listingPrice || 
                              extractedCustomFields.listing_price || 
                              car?.price || 
                              0;
          const sellingPrice = listingPrice ? `₹${(listingPrice / 100000).toFixed(2)} Lakh` : 'N/A';
          const currentBest = carData.bestOffer ? `₹${(carData.bestOffer / 100000).toFixed(2)} Lakh` : 'N/A';
          
          // Extract registration number from multiple possible locations
          const registrationNumber = extractedCustomFields.registrationNumber || 
                                    extractedCustomFields.regNumber || 
                                    car?.registrationNumber || 
                                    'N/A';

          return (
            <div 
              key={car?.id || index} 
              className="card dv2-card p-4 mb-4" 
              style={{ 
                borderRadius: '1rem', 
                boxShadow: '0 4px 20px rgba(12,58,137,.08)',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(12,58,137,.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,58,137,.08)';
              }}
            >
              <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                <img 
                  src={carImage} 
                  alt={carTitle} 
                  className="rounded" 
                  style={{ width: '256px', height: '160px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1 w-100">
                  <div className="d-flex justify-content-between align-items-start gap-4">
                    <div className="flex-grow-1">
                      <h3 className="text-xl fw-bold mb-1" style={{ color: '#0C3A89' }}>{carTitle}</h3>
                      <p className="text-sm text-muted mb-1">DID: {car?.id || 'N/A'}</p>
                      <p className="text-sm mb-1">
                        Reg. No.: <span className="fw-semibold">{registrationNumber}</span>
                      </p>
                      <div className="d-flex flex-wrap gap-3 text-sm mt-3">
                        <p className="mb-0"><b>Active Since:</b> {activeSince}</p>
                        <p className="mb-0"><b>Last Modified:</b> {lastModified}</p>
                        <p className="mb-0"><b>Selling Price:</b> {sellingPrice}</p>
                        <p className="mb-0"><b>Current Best Offer:</b> {currentBest}</p>
                      </div>
                    </div>
                    <div className="ms-auto positionsertive">
                      <button 
                        className="btn text-white fw-bold shadow-sm"
                        style={{ 
                          padding: '1rem 1.25rem', 
                          borderRadius: '0.75rem', 
                          backgroundColor: '#F28B18',
                          border: 'none'
                        }}
                        onClick={() => handleOpenOffers(carData)}
                      >
                        {carData.totalOffers} Offers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for viewing all offers */}
      <OffersModal
        show={showModal}
        data={getModalData(selectedCar)}
        onClose={handleCloseModal}
        onViewOffer={handleViewOffer}
      />
    </>
  );
}
