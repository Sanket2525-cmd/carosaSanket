"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Banner from "../comps/Banner";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import OfferNegotiation from "./OfferNegotiation";
import CarDetailsSection from "./CarDetailsSection";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import CarService from "@/services/carService";
import { API_BASE_URL } from "@/config/environment";

export default function NegotiationPage({ userType = 'buyer', carId, negotiationId = null }) {
  const [carData, setCarData] = useState(null);
  const [offerStatus, setOfferStatus] = useState('initial');
  const [offerAmount, setOfferAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerUserData, setBuyerUserData] = useState(null);
  const [dealId, setDealId] = useState(null);
  
  // Get authentication state
  const { isAuthenticated, user } = useAuthStore();
  
  // Get chat store for message persistence
  const chatStore = useChatStore();
  const { 
    getMessages, 
    addSellerReceivedOfferMessage,
    addSellerReceivedCounterOfferMessage,
    updateMessage
  } = chatStore;
  
  // Helper function to format price
  const formatPrice = (amount) => {
    return (amount / 100000).toFixed(2).replace(/\.00$/, '');
  };
  
  // Fetch car data
  useEffect(() => {
    const fetchCarData = async () => {
      if (!carId) {
        setError('Car ID not provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await CarService.getCarById(carId);
        
        if (response.success && response.data) {
          const car = response.data;
          console.log('NegotiationPage - Car data fetched:', car);
          console.log('NegotiationPage - Car User data:', car?.User);
          console.log('NegotiationPage - Car User name:', car?.User?.name);
          
          // If User is not included, the API should include it via Ownership middleware
          // But if it's missing, we'll log a warning
          if (!car?.User && car?.userId) {
            console.warn('⚠️ Car User relation not included in API response. Seller name may not display correctly.');
          }
          
          setCarData(car);
          
          // For seller view, fetch negotiations to get dealId and buyer info
          if (userType === 'seller') {
            try {
              const offersResponse = await fetch(`${API_BASE_URL}/api/offers/car/${carId}`, {
                credentials: 'include'
              });
              
              if (offersResponse.ok) {
                const offersData = await offersResponse.json();
                if (offersData.success && Array.isArray(offersData.data) && offersData.data.length > 0) {
                  // Find the deal that contains the specific negotiationId, or use the first deal
                  let targetDeal = offersData.data[0];
                  
                  if (negotiationId) {
                    const dealWithNeg = offersData.data.find(deal => 
                      deal.DealNegotiation?.some(neg => neg.id === parseInt(negotiationId))
                    );
                    if (dealWithNeg) {
                      targetDeal = dealWithNeg;
                    }
                  }
                  
                  // Set dealId for counter offers
                  if (targetDeal?.id) {
                    setDealId(targetDeal.id);
                  }
                  
                  // Extract buyer info from negotiations
                  if (targetDeal?.DealNegotiation) {
                    const currentDealId = targetDeal.id || dealId;
                    if (!currentDealId) {
                      console.error('⚠️ No dealId available for loading negotiations');
                      return;
                    }
                    
                    targetDeal.DealNegotiation.forEach(neg => {
                      if (neg.User && neg.userId !== user?.id && !buyerUserData) {
                        setBuyerUserData(neg.User);
                      }
                      // Load buyer's offers into chat (only if not already loaded)
                      if (neg.userId !== user?.id) {
                        // Check if message already exists to prevent duplicates - use dealId
                        const existingMessages = getMessages(currentDealId);
                        const alreadyExists = existingMessages.some(msg => 
                          (msg.type === 'offer' || msg.type === 'counter_offer') && 
                          msg.amount === neg.amount && 
                          msg.sender === 'buyer'
                        );
                        if (!alreadyExists) {
                          // Seller sees: "You've received an offer of ₹X." or "You've received an Counter offer of ₹X."
                          // Determine if it's initial offer or counter offer based on negotiation index
                          const isCounterOffer = targetDeal.DealNegotiation.indexOf(neg) > 0;
                          let message;
                          if (isCounterOffer) {
                            message = addSellerReceivedCounterOfferMessage(currentDealId, neg.amount);
                          } else {
                            message = addSellerReceivedOfferMessage(currentDealId, neg.amount);
                          }
                          // Store negotiationId and dealId in message
                          if (message && neg.id && targetDeal.id) {
                            updateMessage(currentDealId, message.id, {
                              negotiationId: neg.id,
                              dealId: targetDeal.id
                            });
                          }
                        }
                      }
                    });
                    
                    // Set initial offer status from latest negotiation
                    const latest = targetDeal.DealNegotiation.sort((a, b) => 
                      new Date(b.createdAt) - new Date(a.createdAt)
                    )[0];
                    if (latest.userId !== user?.id) {
                      setOfferStatus('received');
                      setOfferAmount(latest.amount);
                    }
                  }
                }
              }
            } catch (negotiationError) {
              console.error('Error fetching negotiations:', negotiationError);
            }
          } else {
            // For buyer view, we need dealId to check messages
            // DealId will be set from the my-offers endpoint in OfferNegotiation component
            // So we don't need to check messages here without dealId
          }
        } else {
          setError('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
        setError('Failed to load car data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarData();
  }, [carId, userType, user, negotiationId, getMessages, addSellerReceivedOfferMessage, addSellerReceivedCounterOfferMessage]);
  
  // Determine user data based on userType and authentication
  const sellerData = useMemo(() => {
    // For buyer view, get seller info from car owner
    if (userType === 'buyer') {
      if (carData?.User?.name) {
        return {
          name: carData.User.name,
          image: carData.User.profileImage || "/images/user1.png"
        };
      }
      // Fallback: try to get from carData directly if User is not populated
      if (carData?.userId && !carData?.User) {
        console.warn('Car User data not available, seller name will show as "Seller"');
      }
    }
    // For seller view, seller is the logged-in user
    if (userType === 'seller' && user) {
      return {
        name: user.name || "Seller",
        image: user.profileImage || "/images/user1.png"
      };
    }
    return {
      name: "Seller",
      image: "/images/user1.png"
    };
  }, [userType, carData, user]);

  const buyerData = useMemo(() => {
    // For seller view, use fetched buyer data
    if (userType === 'seller' && buyerUserData) {
      return {
        name: buyerUserData.name || "Buyer",
        image: buyerUserData.profileImage || "/images/user1.png"
      };
    }
    // For buyer view, buyer is the logged-in user
    if (userType === 'buyer' && user) {
      return {
        name: user.name || "Buyer",
        image: user.profileImage || "/images/user1.png"
      };
    }
    return {
      name: "Buyer Name",
      image: "/images/user1.png"
    };
  }, [userType, buyerUserData, user]);

  const handleOfferStatusChange = (status, amount) => {
    setOfferStatus(status);
    setOfferAmount(amount);
  };

  if (loading) {
    return (
      <>
        <Banner />
        <section className="py-5">
          <Container>
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading car details...</p>
            </div>
          </Container>
        </section>
      </>
    );
  }

  if (error || !carData) {
    return (
      <>
        <Banner />
        <section className="py-5">
          <Container>
            <div className="text-center">
              <h4>Error</h4>
              <p className="text-muted">{error || 'Car not found'}</p>
              <Link href="/dashboard" className="btn btn-primary">
                Back to Dashboard
              </Link>
            </div>
          </Container>
        </section>
      </>
    );
  }

  // Car details are now handled by CarDetailsSection component

  return (
    <>
      <Banner />
      <section className=" ">
        <Container>
          <Row className="g-4 my-4 p-2 bg-white">
            <Col lg={7}>
              <CarDetailsSection carData={carData} />
            </Col>
            <Col lg={5}>
              {/* Notification banner removed - all status updates shown in chat only */}
              
              <OfferNegotiation 
                userType={userType}
                carData={carData}
                sellerData={sellerData}
                buyerData={buyerData}
                dealId={dealId}
                negotiationId={negotiationId}
                onOfferStatusChange={handleOfferStatusChange}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}


