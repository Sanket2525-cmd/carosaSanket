"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaExternalLinkAlt } from 'react-icons/fa';
import '@/styles/offerNegotiation.css';
import { useSocket } from '@/contexts/SocketProvider';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import LoginModal from '@/components/LoginModal';
import { API_BASE_URL, BOOKING_AMOUNT } from '@/config/environment';
import BookKnowModal from '@/components/viewCarsRecent/BookKnowModal';
import { safeParseCustomFields } from '@/utils/jsonUtils';
import { normalizeBrand } from '@/utils/brandNormalizer';
import requestManager from '@/utils/requestManager';
import TestDriveService from '@/services/testDriveService';
import RatingService from '@/services/ratingService';
import PaymentService from '@/services/paymentService';
import DeliveryService from '@/services/deliveryService';
import { Modal, Button } from 'react-bootstrap';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import TestDriveFeedbackModal from '@/components/modals/TestDriveFeedbackModal';
import TestDriveNoModal from '@/components/modals/TestDriveNoModal';
import CancelRequestModal from '@/components/modals/CancelRequestModal';
import ToastNotification from '@/components/common/ToastNotification';

export default function OfferNegotiation({ userType = 'buyer', carData, sellerData, buyerData, dealId: propDealId, negotiationId: propNegotiationId, onOfferStatusChange }) {
  const router = useRouter();
  
  // Helper function to get selling price from carData
  const getSellingPriceFromCarData = (carData) => {
    if (!carData) return 8930000; // Default fallback
    
    const listingPrice = carData.listingPrice !== undefined ? carData.listingPrice :
                        carData.listing_price !== undefined ? carData.listing_price :
                        carData.customFields?.listingPrice !== undefined ? carData.customFields.listingPrice :
                        carData.customFields?.listing_price !== undefined ? carData.customFields.listing_price :
                        0;
    
    if (typeof listingPrice === 'string') {
      const cleaned = listingPrice.replace(/[₹,\s]/g, '');
      const num = parseFloat(cleaned);
      return isNaN(num) || num === 0 ? 8930000 : num;
    }
    
    if (typeof listingPrice === 'number' && listingPrice > 0) {
      return listingPrice;
    }
    
    return 8930000; // Default fallback
  };
  
  // Initialize offer amount based on selling price (defaults to maxPrice)
  const initialSellingPrice = getSellingPriceFromCarData(carData);
  const [offerAmount, setOfferAmount] = useState(initialSellingPrice);
  const [offerStatus, setOfferStatus] = useState('initial'); // initial, sent, received, accepted, rejected
  const [remainingOffers, setRemainingOffers] = useState(2);
  const [offerCount, setOfferCount] = useState(0);
  const [carId, setCarId] = useState(null);
  const [dealId, setDealId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [rescheduleTestDriveId, setRescheduleTestDriveId] = useState(null); // Track testDriveId for rescheduling
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTestDriveId, setFeedbackTestDriveId] = useState(null);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [showNoModal, setShowNoModal] = useState(false);
  const [hasClickedNo, setHasClickedNo] = useState(false);
  const [hasClickedYes, setHasClickedYes] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [rescheduleDeliveryId, setRescheduleDeliveryId] = useState(null); // Track deliveryId for rescheduling
  const [rescheduleDeliveryMessageId, setRescheduleDeliveryMessageId] = useState(null); // Track message ID for updating status
  const [bookingTokenAmount, setBookingTokenAmount] = useState(null);
  const [existingDelivery, setExistingDelivery] = useState(null);
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  // Cancel request modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelRequestData, setCancelRequestData] = useState({ type: null, id: null, messageId: null }); // type: 'delivery' or 'testDrive'
  const [dealStatus, setDealStatus] = useState(null);
  const [messageKey, setMessageKey] = useState(0); // Force re-render when messages change
  const [payments, setPayments] = useState([]); // Store payments for the deal
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showDeliveryCongratulationsModal, setShowDeliveryCongratulationsModal] = useState(false);
  
  // Get socket from context
  const { socket, isConnected, connectionError, socketService } = useSocket();
  
  // Get authentication state from Zustand store
  const { isAuthenticated, user } = useAuthStore();
  
  // Get chat store for message persistence
  const { 
    getMessages, 
    addMessage,
    updateMessage,
    formatPrice,
    // Buyer messages
    addBuyerOfferMessage,
    addBuyerCounterOfferMessage,
    addBuyerRejectionMessage,
    addBuyerAcceptanceMessage,
    addBuyerReceivedCounterOfferMessage,
    // Seller messages
    addSellerReceivedOfferMessage,
    addSellerReceivedCounterOfferMessage,
    addSellerCounterOfferMessage,
    addSellerRejectionMessage,
    addSellerAcceptanceMessage,
    addSellerCounterRejectionWithOfferMessage,
    addBuyerCounterRejectionWithOfferMessage,
    addSellerCounterOfferRejectedByBuyerMessage,
    // New seller messages
    addSellerWaitingMessage,
    addBookingConfirmedMessage,
    // Payment confirmation messages
    addBuyerPaymentConfirmationMessage,
    // Test drive messages
    addBuyerTestDriveScheduledMessage,
    addSellerTestDriveScheduledMessage,
    addBuyerTestDriveConfirmedMessage,
    addBuyerTestDriveCancelledMessage,
    addSellerTestDriveCancelledMessage,
    addBuyerTestDriveRescheduledMessage,
    addSellerTestDriveRescheduledMessage,
    addSellerRescheduleRequestMessage,
    addBuyerTestDriveCompletedMessage,
    addSellerTestDriveCompletedMessage,
    addBuyerDeclinedPurchaseMessage,
    addSellerBuyerDeclinedMessage,
    addBuyerDeliveryScheduledMessage,
    addSellerDeliveryScheduledMessage,
    addBuyerDeliveryRescheduledMessage,
    addSellerDeliveryRescheduledMessage,
    addBuyerDeliveryConfirmedMessage,
    addSellerDeliveryConfirmedMessage,
    addBuyerAcceptedCounterOfferMessage,
    addSellerCounterOfferAcceptedMessage,
    // Delivery cancel/reschedule messages
    addSellerDeliveryCancelRequestMessage,
    addSellerDeliveryRescheduleRequestMessage,
    addBuyerDeliveryCancelledMessage,
    addSellerDeliveryCancelledMessage,
    addSellerDeliveryCancelRejectedMessage,
    addBuyerDeliveryRescheduledMessage: addBuyerDeliveryRescheduledMessageAdmin,
    addSellerDeliveryRescheduledMessage: addSellerDeliveryRescheduledMessageAdmin,
    addSellerDeliveryRescheduleRejectedMessage
  } = useChatStore();

  // Login modal handlers
  const handleOpenLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);
  
  
  // Get messages from chat store - use simple selector to avoid infinite loops
  // Zustand will automatically trigger re-renders when chatMessages changes
  const chatMessages = useChatStore((state) => state.chatMessages);
  
  // Force re-render trigger
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  // Compute messages reactively - this will re-run when chatMessages changes
  // Use dealId to ensure messages are isolated per buyer-seller negotiation
  const messages = React.useMemo(() => {
    const targetDealId = dealId;
    
    if (!targetDealId) {
      // If no dealId, return empty array - we need dealId to show messages
      console.log('⚠️ No dealId available - messages will be empty until dealId is set');
      return [];
    }
    
    const allMessages = chatMessages?.[targetDealId] || [];
    console.log('📋 Current messages for dealId', targetDealId, ':', allMessages.length, 'Message types:', allMessages.map(m => m.type));
    
    // Additional deduplication by message ID and timestamp
    const uniqueMessages = [];
    const seenIds = new Set();
    
    allMessages.forEach(msg => {
      if (!seenIds.has(msg.id) && !uniqueMessages.find(m => 
        m.id === msg.id || (
          m.type === msg.type && 
          m.amount === msg.amount && 
          m.sender === msg.sender &&
          Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 1000
        )
      )) {
        seenIds.add(msg.id);
        uniqueMessages.push(msg);
      }
    });
    
    // Final sort by timestamp
    const sorted = uniqueMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    console.log('📋 Sorted messages:', sorted.map(m => ({ type: m.type, sender: m.sender, message: m.message.substring(0, 50) })));
    return sorted;
  }, [dealId, chatMessages, messageKey]);
  
  // Initialize hasClickedNo and hasClickedYes from existing messages
  useEffect(() => {
    if (!dealId || !messages.length) return;
    
    // Check if buyer_declined_purchase message exists (means No was clicked)
    const hasDeclinedMessage = messages.some(msg => 
      msg.type === 'buyer_declined_purchase' && userType === 'buyer'
    );
    
    if (hasDeclinedMessage && !hasClickedNo) {
      setHasClickedNo(true);
    }
    
    // Note: For "Yes", we might need to add a message type in the future
    // For now, we'll track it via state only
  }, [dealId, messages, userType, hasClickedNo]);

  // Subscribe to store changes to force re-render when messages for this dealId change
  useEffect(() => {
    if (!dealId) return;
    
    const unsubscribe = useChatStore.subscribe(
      (state) => {
        // Only return the messages for this specific dealId to minimize re-renders
        return state.chatMessages[dealId] || [];
      },
      (messages) => {
        console.log('🔄 Store updated, forcing re-render. Messages for dealId:', messages.length);
        setMessageKey(prev => prev + 1);
      },
      {
        // Only trigger if the array actually changed (by reference or length)
        equalityFn: (a, b) => {
          if (a.length !== b.length) return false;
          // Check if any message IDs differ
          const aIds = new Set(a.map(m => m.id));
          const bIds = new Set(b.map(m => m.id));
          if (aIds.size !== bIds.size) return false;
          for (const id of aIds) {
            if (!bIds.has(id)) return false;
          }
          return true;
        }
      }
    );
    return unsubscribe;
  }, [dealId]);
  
  // Auto-scroll to bottom when new messages arrive - scroll only the messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      // Scroll the messages container, not the whole page
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);
  
  // Debug authentication state
  useEffect(() => {
    console.log('🔐 Authentication state:', { isAuthenticated, user: user?.email || 'No user' });
  }, [isAuthenticated, user]);

  // Calculate price range based on car selling price (70% to 100% of selling price)
  const sellingPrice = getSellingPriceFromCarData(carData);
  const minPrice = Math.round(sellingPrice * 0.7); // 70% of selling price
  const maxPrice = sellingPrice; // 100% of selling price (selling price itself)

  // Determine who is the other party
  const isBuyer = userType === 'buyer';
  // Use props if available, otherwise fallback to defaults
  const otherParty = isBuyer 
    ? (sellerData || { name: "Seller", image: "/images/user1.png" })
    : (buyerData || { name: "Buyer", image: "/images/user1.png" });

  // Initialize carId from carData and dealId from prop
  useEffect(() => {
    if (carData && carData.id) {
      setCarId(carData.id);
    }
    if (propDealId) {
      setDealId(propDealId);
    }
  }, [carData, propDealId]);

  // Update offer amount when carData changes to ensure it's within valid range
  useEffect(() => {
    if (carData) {
      const currentSellingPrice = getSellingPriceFromCarData(carData);
      const currentMinPrice = Math.round(currentSellingPrice * 0.7);
      const currentMaxPrice = currentSellingPrice;
      
      // Ensure offerAmount is within the valid range
      if (offerAmount < currentMinPrice) {
        setOfferAmount(currentMinPrice);
      } else if (offerAmount > currentMaxPrice) {
        setOfferAmount(currentMaxPrice);
      }
    }
  }, [carData, offerAmount]);

  // Function to refresh deal status (can be called after payment)
  const refreshDealStatus = React.useCallback(async () => {
    if (!carId || !isAuthenticated || !user) return;

    try {
      const data = await requestManager.request(
        `${API_BASE_URL}/api/offers/my-offers`,
        { method: 'GET' },
        { cacheTTL: 5 * 1000 } // Cache for 5 seconds
      );

      if (!data || !data.success || !Array.isArray(data.data)) return;

      // Find deal for this car
      const dealForThisCar = data.data.find(deal => deal.Car?.id === parseInt(carId));
      if (dealForThisCar) {
        if (dealForThisCar.status) {
          setDealStatus(dealForThisCar.status);
        }
        if (dealForThisCar.id && !dealId) {
          setDealId(dealForThisCar.id);
        }
      }
    } catch (error) {
      console.error('Error loading deal status:', error);
      // Handle 429 errors gracefully
      if (error.message && error.message.includes('Rate limit')) {
        console.warn('Rate limited while loading deal status. Will retry later.');
      }
    }
  }, [carId, isAuthenticated, user, dealId]);

  // Get deal status from existing my-offers data (no separate API call needed)
  // Also load deal when carId is available (for direct Book Now flow)
  // Debounce to prevent multiple rapid calls
  useEffect(() => {
    if (!carId || !isAuthenticated || !user) return;
    
    const timeoutId = setTimeout(() => {
      refreshDealStatus();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [refreshDealStatus, carId, isAuthenticated, user]);

  // Check messages on mount/refresh to determine offer status
  useEffect(() => {
    if (!dealId) return;

    const existingMessages = getMessages(dealId);
    if (existingMessages.length === 0) return;

    // Check if offer was accepted (for buyer: acceptance message, for seller: waiting message)
    if (isBuyer) {
      const hasAcceptance = existingMessages.some(msg => msg.type === 'acceptance');
      if (hasAcceptance && offerStatus !== 'accepted') {
        setOfferStatus('accepted');
      }
    } else {
      // For seller: check if there's a waiting message (offer was accepted)
      const hasWaiting = existingMessages.some(msg => msg.type === 'waiting' || msg.type === 'acceptance');
      if (hasWaiting && offerStatus !== 'accepted') {
        setOfferStatus('accepted');
      }
    }
  }, [dealId, getMessages, offerStatus, isBuyer]);

  // Add buyer payment confirmation message when booking is completed
  useEffect(() => {
    if (!dealId || !isBuyer || dealStatus !== 'BOOKED') return;

    const existingMessages = getMessages(dealId);
    const alreadyHasPaymentMessage = existingMessages.some(msg => 
      msg.type === 'payment_confirmed'
    );

    if (!alreadyHasPaymentMessage) {
      // Booking amount from environment variable with fallback to 999
      const bookingAmount = BOOKING_AMOUNT;
      const message = addBuyerPaymentConfirmationMessage(
        dealId,
        bookingAmount,
        `Congratulations! Booking amount ₹${bookingAmount} paid. Please schedule your delivery.`
      );

      if (message) {
        console.log('✅ [BUYER] Payment confirmation message added:', message);
        setMessageKey(prev => prev + 1);
        forceUpdate();
      }
    }
  }, [dealId, dealStatus, isBuyer, getMessages, addBuyerPaymentConfirmationMessage]);

  // Fetch payments for the deal and load booking/payment messages
  useEffect(() => {
    if (!dealId || !isAuthenticated || !user) return;

    const fetchPayments = async () => {
      try {
        const data = await requestManager.request(
          `${API_BASE_URL}/api/payment/car-deal/${dealId}`,
          { method: 'GET' },
          { cacheTTL: 10 * 1000 } // Cache for 10 seconds
        );

        if (data && data.success && data.data) {
          if (data.success && data.data) {
            setPayments(data.data);
            
            // Load booking/payment messages from payments
            const payments = Array.isArray(data.data) ? data.data : [];
            const existingMessages = getMessages(dealId);
            
            // Check for captured payments and add messages
            for (const payment of payments) {
              if (payment.status === 'CAPTURED') {
                // For seller: Add booking confirmed message for TESTDRIVE payment
                if (payment.type === 'TESTDRIVE' && !isBuyer) {
                  const alreadyHasBookingMessage = existingMessages.some(msg => 
                    msg.type === 'booking_confirmed' &&
                    msg.amount === payment.amount &&
                    Math.abs(new Date(msg.timestamp).getTime() - new Date(payment.createdAt).getTime()) < 60000
                  );
                  
                  if (!alreadyHasBookingMessage) {
                    const message = addBookingConfirmedMessage(
                      dealId,
                      payment.amount,
                      'Great news! The buyer has paid the booking amount and booked the car. Test drive can now be scheduled.'
                    );
                    if (message) {
                      setMessageKey(prev => prev + 1);
                      forceUpdate();
                    }
                  }
                }
                
                // For seller: Add booking confirmed message for BOOKINGTOKEN payment
                if (payment.type === 'BOOKINGTOKEN' && !isBuyer) {
                  const alreadyHasBookingMessage = existingMessages.some(msg => 
                    msg.type === 'booking_confirmed' &&
                    msg.amount === payment.amount &&
                    Math.abs(new Date(msg.timestamp).getTime() - new Date(payment.createdAt).getTime()) < 60000
                  );
                  
                  if (!alreadyHasBookingMessage) {
                    const message = addBookingConfirmedMessage(
                      dealId,
                      payment.amount,
                      'Token received from buyer. Kindly keep the car on hold. Carosa will transfer the token amount to you with in 6–8 hours.'
                    );
                    if (message) {
                      setMessageKey(prev => prev + 1);
                      forceUpdate();
                    }
                  }
                }
                
                // For buyer: Add payment confirmation message
                if (isBuyer) {
                  const alreadyHasPaymentMessage = existingMessages.some(msg => 
                    msg.type === 'payment_confirmed' &&
                    msg.amount === payment.amount &&
                    Math.abs(new Date(msg.timestamp).getTime() - new Date(payment.createdAt).getTime()) < 60000
                  );
                  
                  if (!alreadyHasPaymentMessage) {
                    let customMessage = '';
                    if (payment.type === 'TESTDRIVE') {
                      customMessage = `Congratulations! Booking amount ₹${payment.amount} paid. Please schedule your delivery.`;
                    } else if (payment.type === 'BOOKINGTOKEN') {
                      customMessage = `You have paid a token amount of ₹${payment.amount.toLocaleString('en-IN')}. Please complete delivery within 3 to 5 days.`;
                    } else {
                      customMessage = `Congratulations! Payment of ₹${payment.amount} completed.`;
                    }
                    
                    const message = addBuyerPaymentConfirmationMessage(
                      dealId,
                      payment.amount,
                      customMessage
                    );
                    if (message) {
                      setMessageKey(prev => prev + 1);
                      forceUpdate();
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Handle 429 errors gracefully
        if (error.message && error.message.includes('Rate limit')) {
          console.warn('Rate limited while fetching payments. Will retry later.');
        }
      }
    };

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      fetchPayments();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dealId, isAuthenticated, user, isBuyer, getMessages, addBookingConfirmedMessage, addBuyerPaymentConfirmationMessage]);

  // Load persisted messages from database when chat opens (for both buyer and seller)
  useEffect(() => {
    if (!dealId || !isAuthenticated || !user) return;

    const loadPersistedMessages = async () => {
      try {
        const data = await requestManager.request(
          `${API_BASE_URL}/api/car-deals/deal/${dealId}/messages`,
          { method: 'GET' },
          { cacheTTL: 15 * 1000 } // Cache for 15 seconds
        );
        if (!data || !data.success || !Array.isArray(data.data)) return;

        const persistedMessages = data.data;
        if (persistedMessages.length === 0) return;

        const existingMessages = getMessages(dealId);

        // Process each persisted message and add if it doesn't exist
        for (const msg of persistedMessages) {
          const messageId = `db-${msg.id}`;
          const alreadyExists = existingMessages.some(existingMsg => 
            existingMsg.id === messageId || 
            (existingMsg.type === msg.type && 
             Math.abs(new Date(existingMsg.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 5000)
          );

          if (!alreadyExists) {
            const message = {
              id: messageId,
              type: msg.type,
              message: msg.message,
              sender: msg.sender,
              timestamp: new Date(msg.timestamp),
              ...(msg.metadata || {}),
            };

            addMessage(dealId, message);
          }
        }

        setMessageKey(prev => prev + 1);
        forceUpdate();
      } catch (error) {
        console.error('Error loading persisted messages:', error);
        // Handle 429 errors gracefully
        if (error.message && error.message.includes('Rate limit')) {
          console.warn('Rate limited while loading messages. Will retry later.');
        }
      }
    };

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      loadPersistedMessages();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dealId, isAuthenticated, user, getMessages, addMessage]);

  // Load delivery messages when chat opens (for both buyer and seller)
  useEffect(() => {
    if (!dealId || !isAuthenticated || !user) return;

    const loadDeliveryMessages = async () => {
      try {
        // Fetch deliveries for this deal
        const data = await requestManager.request(
          `${API_BASE_URL}/api/car-deals/deal/${dealId}/deliveries`,
          { method: 'GET' },
          { cacheTTL: 15 * 1000 } // Cache for 15 seconds
        );

        if (!data || !data.success || !Array.isArray(data.data)) return;

        const deliveries = data.data;
        if (deliveries.length === 0) return;

        const existingMessages = getMessages(dealId);

        // Process each delivery and add messages if they don't exist
        for (const delivery of deliveries) {
          const deliveryId = delivery.id;
          const scheduledDate = delivery.formattedDate;
          const scheduledTime = delivery.formattedTime;
          const status = delivery.status.toLowerCase();

          // Check if message already exists
          const alreadyHasMessage = existingMessages.some(msg => 
            msg.type === 'delivery_scheduled' && msg.deliveryId === deliveryId
          );

          if (!alreadyHasMessage) {
            // Check if delivery is scheduled (not cancelled or completed)
            if (status === 'scheduled' || status === 'rescheduled') {
              const messageStatus = status === 'rescheduled' ? 'rescheduled' : 
                                   status === 'confirmed' ? 'confirmed' : 'pending';
              
              // Add message for buyer
              if (isBuyer) {
                addBuyerDeliveryScheduledMessage(dealId, scheduledDate, scheduledTime, deliveryId, messageStatus);
              } else {
                // Add message for seller
                addSellerDeliveryScheduledMessage(dealId, scheduledDate, scheduledTime, deliveryId, messageStatus);
              }
              
              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          }
        }
      } catch (error) {
        console.error('Error loading delivery messages:', error);
        // Handle 429 errors gracefully
        if (error.message && error.message.includes('Rate limit')) {
          console.warn('Rate limited while loading deliveries. Will retry later.');
        }
      }
    };

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      loadDeliveryMessages();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dealId, isAuthenticated, user, isBuyer, getMessages, addBuyerDeliveryScheduledMessage, addSellerDeliveryScheduledMessage]);

  // Load test drive messages when chat opens (for both buyer and seller)
  useEffect(() => {
    if (!dealId || !isAuthenticated || !user) return;

    const loadTestDriveMessages = async () => {
      try {
        // Fetch test drives for this deal
        const data = await requestManager.request(
          `${API_BASE_URL}/api/test-drives/deal/${dealId}`,
          { method: 'GET' },
          { cacheTTL: 15 * 1000 } // Cache for 15 seconds
        );

        if (!data || !data.success || !Array.isArray(data.data)) return;

        const testDrives = data.data;
        if (testDrives.length === 0) return;

        const existingMessages = getMessages(dealId);

        // Process each test drive and add messages if they don't exist
        for (const testDrive of testDrives) {
          const testDriveId = testDrive.id;
          const scheduledDate = testDrive.formattedDate;
          const scheduledTime = testDrive.formattedTime;
          const status = testDrive.status.toLowerCase();

          // Check if message already exists
          const alreadyHasMessage = existingMessages.some(msg => 
            msg.type === 'test_drive_scheduled' && msg.testDriveId === testDriveId
          );

          if (!alreadyHasMessage) {
            // Add message for buyer (if current user is buyer)
            if (isBuyer) {
              const messageStatus = status === 'pending' ? 'pending' : 
                                   status === 'scheduled' ? 'scheduled' : 
                                   status === 'confirmed' ? 'confirmed' : 'pending';
              addBuyerTestDriveScheduledMessage(dealId, scheduledDate, scheduledTime, testDriveId, messageStatus);
            } else {
              // Add message for seller (if current user is seller)
              const messageStatus = status === 'pending' ? 'pending' : 
                                   status === 'scheduled' ? 'scheduled' : 
                                   status === 'confirmed' ? 'confirmed' : 'pending';
              addSellerTestDriveScheduledMessage(dealId, scheduledDate, scheduledTime, testDriveId, messageStatus);
            }
          }
        }

        setMessageKey(prev => prev + 1);
        forceUpdate();
      } catch (error) {
        console.error('Error loading test drive messages:', error);
        // Handle 429 errors gracefully
        if (error.message && error.message.includes('Rate limit')) {
          console.warn('Rate limited while loading test drives. Will retry later.');
        }
      }
    };

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      loadTestDriveMessages();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dealId, isAuthenticated, user, isBuyer, getMessages, addBuyerTestDriveScheduledMessage, addSellerTestDriveScheduledMessage]);

  // Check test drive status on page load/refresh to show cancellation messages
  useEffect(() => {
    if (!dealId || !isAuthenticated || !user) return;

    const checkTestDriveStatus = async () => {
      try {
        // Fetch deal details which should include test drives
        const data = await requestManager.request(
          `${API_BASE_URL}/api/car-deals/${dealId}`,
          { method: 'GET' },
          { cacheTTL: 10 * 1000 } // Cache for 10 seconds
        );

        if (!data || !data.success || !data.data) return;

        const testDrives = data.data.TestDrives || [];
        if (testDrives.length === 0) return;

        const existingMessages = getMessages(dealId);

        // Check each test drive for cancelled status
        for (const testDrive of testDrives) {
          if (testDrive.status === 'CANCELLED') {
            // Format date and time for cancellation message
            const scheduledDate = new Date(testDrive.scheduledAt);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = daysOfWeek[scheduledDate.getDay()];
            const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
            const day = String(scheduledDate.getDate()).padStart(2, '0');
            const year = scheduledDate.getFullYear();
            const formattedDate = `${dayName}, ${day}/${month}/${year}`;

            // Format time (e.g., "03:00 PM To 04:00 PM")
            const startHour = scheduledDate.getHours();
            const startMinute = scheduledDate.getMinutes();
            const endHour = startHour + 1; // Assuming 1 hour duration
            const endMinute = startMinute;

            const formatTime = (hour, minute) => {
              const period = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              const displayMinute = String(minute).padStart(2, '0');
              return `${String(displayHour).padStart(2, '0')}:${displayMinute} ${period}`;
            };

            const formattedStartTime = formatTime(startHour, startMinute);
            const formattedEndTime = formatTime(endHour, endMinute);
            const formattedTime = `${formattedStartTime} To ${formattedEndTime}`;
            const formattedDateTime = `${formattedDate} — ${formattedTime}`;

            const reason = testDrive.reason || testDrive.cancelRequestReason || null;

            // Check if cancellation message already exists
            const alreadyHasCancellation = existingMessages.some(msg => 
              msg.type === 'test_drive_cancelled' &&
              msg.testDriveId === testDrive.id
            );

            if (!alreadyHasCancellation) {
              // Update scheduled message status to cancelled if it exists
              const scheduledMessage = existingMessages.find(msg => 
                msg.type === 'test_drive_scheduled' &&
                msg.testDriveId === testDrive.id
              );
              
              if (scheduledMessage) {
                updateMessage(dealId, scheduledMessage.id, { status: 'cancelled' });
              }

              // Add cancellation message based on user type
              if (isBuyer) {
                addBuyerTestDriveCancelledMessage(dealId, formattedDateTime, reason, testDrive.id);
              } else {
                // For seller, show that buyer cancelled (if buyer cancelled) or admin approved cancellation
                addSellerTestDriveCancelledMessage(dealId, formattedDateTime, reason, testDrive.id);
              }

              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          }
        }
      } catch (error) {
        console.error('Error checking test drive status:', error);
        // Handle 429 errors gracefully
        if (error.message && error.message.includes('Rate limit')) {
          console.warn('Rate limited while checking test drive status. Will retry later.');
        }
      }
    };

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      checkTestDriveStatus();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [dealId, isAuthenticated, user, getMessages, updateMessage, addBuyerTestDriveCancelledMessage, addSellerTestDriveCancelledMessage, isBuyer]);

  // Load existing negotiations and rejection messages from backend for buyer
  useEffect(() => {
    if (!carId || !isBuyer || !isAuthenticated || !user) return;

    const loadExistingNegotiations = async () => {
      try {
        // Fetch user's offers to get deal and negotiation history
        const data = await requestManager.request(
          `${API_BASE_URL}/api/offers/my-offers`,
          { method: 'GET' },
          { cacheTTL: 10 * 1000 } // Cache for 10 seconds
        );

        if (!data || !data.success || !Array.isArray(data.data)) return;

        // Find deals for this car
        const dealsForThisCar = data.data.filter(deal => deal.Car?.id === parseInt(carId));
        
        for (const deal of dealsForThisCar) {
          // Set dealId first - this is critical for message isolation
          if (deal.id && !dealId) {
            setDealId(deal.id);
          }
          
          const currentDealId = deal.id || dealId;
          if (!currentDealId) {
            console.error('⚠️ No dealId available for loading negotiations');
            continue;
          }

          // Only load negotiation messages if negotiations exist
          // If no negotiations (direct Book Now), skip loading negotiation messages
          if (!deal.DealNegotiation || !Array.isArray(deal.DealNegotiation) || deal.DealNegotiation.length === 0) {
            console.log('📝 No negotiations found for deal - skipping negotiation message loading (direct Book Now flow)');
            continue;
          }

          const existingMessages = getMessages(currentDealId);
          
          // Process negotiations in chronological order
          const sortedNegotiations = deal.DealNegotiation.sort((a, b) => 
            new Date(a.createdAt) - new Date(b.createdAt)
          );

          for (const neg of sortedNegotiations) {
            // Check if this negotiation represents a rejection
            // For buyer, we need to check if seller rejected this negotiation
            // We'll need to check deal status or look for rejection events
            
            // Load buyer's own offers
            if (neg.userId === user.id) {
              const isCounter = sortedNegotiations.indexOf(neg) > 0;
              const exists = existingMessages.some(msg => 
                msg.negotiationId === neg.id || 
                (msg.type === (isCounter ? 'counter_offer' : 'offer') && 
                 msg.amount === neg.amount && 
                 msg.sender === 'buyer')
              );
              
              if (!exists) {
                if (isCounter) {
                  addBuyerCounterOfferMessage(currentDealId, neg.amount);
                } else {
                  addBuyerOfferMessage(currentDealId, neg.amount);
                }
              }
            }
            
            // For seller rejections, we'd need to check deal status
            // Since we can't easily determine if a negotiation was rejected from this endpoint,
            // we'll rely on socket events and make sure they work
          }
        }
      } catch (error) {
        console.error('Error loading existing negotiations:', error);
      }
    };

    loadExistingNegotiations();
  }, [carId, isBuyer, isAuthenticated, user, dealId, getMessages, addBuyerOfferMessage, addBuyerCounterOfferMessage]);

  // Set up socket listeners - re-register when socket connects
  useEffect(() => {
    if (!socket) {
      console.log('⚠️ Socket missing');
      return;
    }

    // Don't wait for carId - handlers will check it themselves
    // This allows listeners to be set up early
    const actualConnected = socket.connected || isConnected;
    console.log('📡 Setting up socket listeners. Socket connected:', socket.connected, 'isConnected state:', isConnected, 'carId:', carId);

    const handleOfferSubmitted = (data) => {
      // Filter by dealId to ensure messages are isolated per buyer-seller negotiation
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      // Wait for dealId if not available
      if (!socketDealId && !currentDealId) {
        console.log('⚠️ No dealId in offer_submitted event, skipping');
        return;
      }
      
      // Only process if this is for the current deal
      if (socketDealId && currentDealId && String(socketDealId) === String(currentDealId) && !isBuyer) {
        // Set dealId if not already set
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const message = addSellerReceivedOfferMessage(socketDealId, data.amount);
        if (message) {
          const socketNegotiationId = data.negotiationId || data.deal?.negotiationId;
          if (socketNegotiationId || socketDealId) {
            updateMessage(socketDealId, message.id, {
              negotiationId: socketNegotiationId || propNegotiationId,
              dealId: socketDealId
            });
          } else if (propNegotiationId) {
            updateMessage(socketDealId, message.id, {
              negotiationId: propNegotiationId,
              dealId: socketDealId || dealId
            });
          }
        }
        setOfferStatus('received');
        if (onOfferStatusChange) {
          onOfferStatusChange('received', data.amount);
        }
      }
    };

    const handleOfferAccepted = (data) => {
      // Filter by dealId to ensure messages are isolated per buyer-seller negotiation
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('✅ Offer accepted event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        data,
        userType,
        dealIdExists: !!dealId,
        fullData: JSON.stringify(data)
      });
      
      // CRITICAL: Always add message for buyer if they receive acceptance event
      // Filter by dealId to ensure it's for this specific negotiation
      if (isBuyer && socketDealId) {
        // Ensure dealId matches - this ensures we only process messages for the current negotiation
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Offer accepted event for different dealId, ignoring:', { eventDealId: socketDealId, currentDealId: dealId });
          return;
        }
        
        // Set dealId if not already set
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyAccepted = existingMessages.some(msg => 
          msg.type === 'acceptance' && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyAccepted) {
          console.log('✅ Adding acceptance message for buyer, dealId:', socketDealId, 'amount:', data.amount);
          const message = addBuyerAcceptanceMessage(socketDealId, data.amount);
          
          if (!message) {
            console.error('❌ CRITICAL: Failed to add acceptance message to store!');
            return;
          }
          
          console.log('✅ Acceptance message added to store:', message);
          
          // Force component update and status change immediately for instant appearance
          setOfferStatus('accepted');
          if (onOfferStatusChange) {
            onOfferStatusChange('accepted', data.amount);
          }
          // Force immediate re-render to show message instantly - use multiple methods
          setMessageKey(prev => prev + 1);
          forceUpdate(); // Force React to re-render
        } else {
          console.log('✅ Acceptance message already exists, skipping duplicate');
        }
      } else {
        console.log('✅ Acceptance event ignored - not buyer or no dealId:', { isBuyer, socketDealId, currentDealId });
      }
    };

    const handleOfferRejected = (data) => {
      // Filter by dealId to ensure messages are isolated per buyer-seller negotiation
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('🔴🔴🔴 [CRITICAL] Offer rejected event received:', { 
        fullData: data,
        socketDealId,
        currentDealId,
        dealId: dealId,
        isBuyer: isBuyer,
        userType: userType,
        userId: user?.id,
        userEmail: user?.email
      });
      
      // Wait for dealId if not available
      if (!socketDealId && !currentDealId) {
        console.log('⚠️ No dealId in offer_rejected event, skipping');
        return;
      }
      
      // CRITICAL: Always add message for buyer if they receive rejection event
      // Filter by dealId to ensure it's for this specific negotiation
      if (isBuyer && socketDealId) {
        // Ensure dealId matches - this ensures we only process messages for the current negotiation
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Offer rejected event for different dealId, ignoring:', { eventDealId: socketDealId, currentDealId: dealId });
          return;
        }
        
        // Set dealId if not already set
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyRejected = existingMessages.some(msg => 
          msg.type === 'rejection' && 
          msg.amount === (data.amount || msg.amount) &&
          msg.sender === 'seller' &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 30000 // 30 seconds window
        );
        
        if (!alreadyRejected) {
          // Buyer sees: "Seller rejected your ₹X offer. Want to make a counter?"
          const rejectionAmount = data.amount || (existingMessages.find(m => m.type === 'offer' || m.type === 'counter_offer')?.amount);
          console.log('🔴 Adding rejection message for buyer:', { 
            socketDealId, 
            amount: rejectionAmount || data.amount,
            existingMessagesCount: existingMessages.length 
          });
          
          if (!rejectionAmount) {
            console.warn('⚠️ No amount found in rejection event, will use last offer amount');
          }
          
          const message = addBuyerRejectionMessage(socketDealId, rejectionAmount || data.amount || 0);
          
          if (!message) {
            console.error('❌ CRITICAL: Failed to add rejection message to store!', {
              socketDealId,
              amount: rejectionAmount || data.amount
            });
            return;
          }
          
          console.log('🔴✅ Rejection message added to store:', message);
          
          // Force component update and status change immediately
          setOfferStatus('rejected');
          if (onOfferStatusChange) {
            onOfferStatusChange('rejected', rejectionAmount || data.amount);
          }
          // Force re-render by updating a state - use multiple methods for instant update
          setMessageKey(prev => prev + 1);
          forceUpdate(); // Force React to re-render
          
          console.log('🔴✅ Rejection message processing complete');
        } else {
          console.log('🔴 Rejection message already exists, skipping duplicate');
        }
      } else if (!isBuyer && socketDealId) {
        // Seller's own rejection - ensure dealId matches
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Offer rejected event for different dealId, ignoring:', { eventDealId: socketDealId, currentDealId: dealId });
          return;
        }
        
        // Set dealId if not already set
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyRejected = existingMessages.some(msg => 
          msg.type === 'rejection' && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyRejected) {
          console.log('🔴 Adding rejection message for seller');
          addSellerRejectionMessage(socketDealId, data.amount);
          setOfferStatus('rejected');
          if (onOfferStatusChange) {
            onOfferStatusChange('rejected', data.amount);
          }
        }
      } else {
        console.log('🔴 Rejection event ignored - not buyer/seller or no dealId:', { isBuyer, socketDealId, currentDealId });
      }
    };

    const handleCounterOfferEvent = (data) => {
      // Filter by dealId to ensure messages are isolated per buyer-seller negotiation
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('🔔 [counter_offer] Event received:', {
        socketDealId,
        currentDealId,
        dealId,
        isBuyer,
        userType,
        amount: data.amount,
        userId: user?.id
      });
      
      // CRITICAL: Only buyers should process counter_offer events (seller's counter offers)
      // Sellers should NEVER process this event - they only see their own "Counter offer sent" message
      if (!isBuyer) {
        console.log('⚠️ [counter_offer] Ignoring event - seller should not process counter_offer events');
        return;
      }
      
      // Wait for dealId if not available
      if (!socketDealId && !currentDealId) {
        console.log('⚠️ No dealId in counter_offer event, skipping');
        return;
      }
      
      // Only process if this is for the current deal
      if (socketDealId && currentDealId && String(socketDealId) === String(currentDealId)) {
        // Buyer receives seller's counter offer
        console.log('✅ [counter_offer] Processing for buyer:', { socketDealId, amount: data.amount });
        
        // Set dealId if not already set
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        // Check if there was a recent rejection (within last 2 seconds)
        // If so, show combined "rejection with fresh offer" message instead
        const existingMessages = getMessages(socketDealId);
        const recentRejection = existingMessages.find(msg => 
          msg.type === 'rejection' && 
          msg.sender === 'seller' &&
          Math.abs(new Date(msg.timestamp) - new Date()) < 2000 // Within 2 seconds
        );
        
        let message;
        if (recentRejection) {
          // Show combined rejection + fresh offer message: "Counter offer rejected by seller—fresh offer: ₹X."
          // Update the existing rejection message to be the combined message
          const socketNegotiationId = data.negotiationId || data.deal?.negotiationId;
          updateMessage(socketDealId, recentRejection.id, {
            type: 'counter_rejection_fresh_offer',
            amount: data.amount,
            status: 'waiting', // Set status to 'waiting' so accept/reject buttons show
            negotiationId: socketNegotiationId || propNegotiationId,
            dealId: socketDealId,
            message: `Counter offer rejected by seller—fresh offer: ₹${formatPrice(data.amount)} Lakh.`
          });
          message = { 
            ...recentRejection, 
            type: 'counter_rejection_fresh_offer',
            amount: data.amount, 
            status: 'waiting',
            negotiationId: socketNegotiationId || propNegotiationId,
            dealId: socketDealId,
            message: `Counter offer rejected by seller—fresh offer: ₹${formatPrice(data.amount)} Lakh.` 
          };
        } else {
          // Normal counter offer message for buyer: "You've received a counter offer of ₹X."
          message = addBuyerReceivedCounterOfferMessage(socketDealId, data.amount);
        }
        
        if (message) {
          const socketNegotiationId = data.negotiationId || data.deal?.negotiationId;
          // Update message with negotiationId and ensure status is 'waiting' for buyer to see accept/reject buttons
          const updateData = {
            negotiationId: socketNegotiationId || propNegotiationId,
            dealId: socketDealId,
            status: 'waiting' // Ensure status is set so accept/reject buttons show
          };
          if (socketNegotiationId || socketDealId) {
            updateMessage(socketDealId, message.id, updateData);
          } else if (propNegotiationId) {
            updateMessage(socketDealId, message.id, {
              ...updateData,
              dealId: socketDealId || dealId
            });
          }
        }
        setOfferStatus('received');
        if (onOfferStatusChange) {
          onOfferStatusChange('received', data.amount);
        }
        
        console.log('✅ [counter_offer] Message added for buyer:', { 
          messageId: message?.id, 
          type: message?.type,
          amount: data.amount 
        });
      } else {
        console.log('⚠️ [counter_offer] DealId mismatch or not for current deal:', {
          socketDealId,
          currentDealId,
          dealId
        });
      }
    };

    // Add event listeners for real-time updates (always set up, even if not connected yet)
    // Listeners will work once socket connects, regardless of isConnected state
    console.log('📡 Setting up socket listeners for:', { 
      userType, 
      isBuyer, 
      carId, 
      isConnected,
      socketConnected: socket.connected,
      userId: user?.id,
      userEmail: user?.email
    });
    
    // Add a catch-all listener to see ALL socket events (for debugging)
    const debugAllEvents = (eventName, ...args) => {
      console.log('🔔 DEBUG: ANY Socket event received:', eventName, args);
      if (['offer_accepted', 'offer_rejected', 'offer_submitted', 'counter_offer', 'offer_accepted_seller', 'booking_confirmed'].includes(eventName)) {
        console.log('🔔 DEBUG: IMPORTANT Socket event received:', eventName, args);
      }
    };
    
    // Try both onAny (for socket.io v4+) and individual listeners
    if (socket.onAny) {
      socket.onAny(debugAllEvents);
    } else {
      // Fallback for older socket.io versions - listen to all events manually
      ['offer_accepted', 'offer_rejected', 'offer_submitted', 'counter_offer', 'offer_accepted_seller', 'booking_confirmed', 'identified'].forEach(eventName => {
        socket.on(eventName, (...args) => {
          console.log(`🔔 DEBUG: Event '${eventName}' received with args:`, args);
        });
      });
    }
    
    // Create wrapped handlers that always execute
    const wrappedHandleOfferSubmitted = (data) => {
      console.log('🔔 [RAW] offer_submitted received:', data);
      try {
        handleOfferSubmitted(data);
      } catch (error) {
        console.error('❌ Error in handleOfferSubmitted:', error);
      }
    };
    
    const wrappedHandleOfferAccepted = (data) => {
      console.log('🔔 [RAW] offer_accepted received:', data);
      try {
        handleOfferAccepted(data);
      } catch (error) {
        console.error('❌ Error in handleOfferAccepted:', error);
      }
    };
    
    const wrappedHandleOfferRejected = (data) => {
      console.log('🔔 [RAW] offer_rejected received:', data);
      try {
        handleOfferRejected(data);
      } catch (error) {
        console.error('❌ Error in handleOfferRejected:', error);
      }
    };
    
    const wrappedHandleCounterOffer = (data) => {
      console.log('🔔 [RAW] counter_offer received:', {
        data,
        isBuyer,
        userType,
        userId: user?.id,
        userEmail: user?.email
      });
      
      // CRITICAL: Only buyers should process counter_offer events
      // Sellers should never process this - they only see their own "Counter offer sent" message
      if (!isBuyer) {
        console.log('⚠️ [RAW] counter_offer ignored - seller should not process this event');
        return;
      }
      
      try {
        handleCounterOfferEvent(data);
      } catch (error) {
        console.error('❌ Error in handleCounterOfferEvent:', error);
      }
    };

    // Handler for buyer when they accept seller's counter offer
    const handleBuyerAcceptedCounterOffer = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('✅ [BUYER] Buyer accepted counter offer event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for buyer
      if (isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Buyer accepted counter offer event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyAccepted = existingMessages.some(msg => 
          msg.type === 'buyer_accepted_counter_offer' && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyAccepted) {
          const message = addBuyerAcceptedCounterOfferMessage(socketDealId, data.amount);
          
          if (message) {
            setOfferStatus('accepted');
            if (onOfferStatusChange) {
              onOfferStatusChange('accepted', data.amount);
            }
            setMessageKey(prev => prev + 1);
            forceUpdate();
          }
        } else {
          console.log('✅ Buyer accepted counter offer message already exists, skipping duplicate');
        }
      }
    };

    // Handler for seller when buyer accepts their counter offer
    const handleCounterOfferAcceptedByBuyer = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('✅ [SELLER] Counter offer accepted by buyer event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Counter offer accepted by buyer event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'counter_offer_accepted_by_buyer' && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyHasMessage) {
          const message = addSellerCounterOfferAcceptedMessage(
            socketDealId, 
            data.amount, 
            data.message || 'Your counter offer accepted by buyer. Waiting for the buyer to book the car.'
          );
          
          if (message) {
            setOfferStatus('accepted');
            if (onOfferStatusChange) {
              onOfferStatusChange('accepted', data.amount);
            }
            setMessageKey(prev => prev + 1);
            forceUpdate();
          }
        } else {
          console.log('✅ Counter offer accepted by buyer message already exists, skipping duplicate');
        }
      }
    };

    // Handler for seller when buyer rejects their counter offer
    const handleCounterOfferRejectedByBuyer = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('🔴 [SELLER] Counter offer rejected by buyer event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Counter offer rejected by buyer event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'counter_offer_rejected_by_buyer' && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyHasMessage) {
          const message = addSellerCounterOfferRejectedByBuyerMessage(
            socketDealId, 
            data.amount, 
            data.message || data.reason || `Your counter offer of ₹${(data.amount / 100000).toFixed(2)} Lakh has been rejected by the buyer.`
          );
          
          if (message) {
            setOfferStatus('rejected');
            if (onOfferStatusChange) {
              onOfferStatusChange('rejected', data.amount);
            }
            setMessageKey(prev => prev + 1);
            forceUpdate();
          }
        } else {
          console.log('🔴 Counter offer rejected by buyer message already exists, skipping duplicate');
        }
      }
    };

    // Handler for seller when offer is accepted (waiting for buyer to pay)
    const handleOfferAcceptedSeller = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('✅ [SELLER] Offer accepted seller event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Offer accepted seller event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        // Check if waiting message already exists to prevent duplicates
        const existingMessages = getMessages(socketDealId);
        const alreadyHasWaitingMessage = existingMessages.some(msg => 
          (msg.type === 'waiting' || msg.type === 'acceptance') && 
          msg.amount === data.amount &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
        );
        
        if (!alreadyHasWaitingMessage) {
          const message = addSellerWaitingMessage(
            socketDealId, 
            data.amount, 
            data.message || 'You have accepted the offer. Waiting for the buyer to book the car.'
          );
          
          if (message) {
            setMessageKey(prev => prev + 1);
            forceUpdate();
          }
        } else {
          console.log('✅ Waiting message already exists, skipping duplicate');
        }
      }
    };

    // Handler for seller when booking is confirmed
    const handleBookingConfirmed = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      const currentDealId = dealId || socketDealId;
      
      console.log('🎉 [BOOKING CONFIRMED] Event received:', { 
        socketDealId,
        currentDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Update deal status to BOOKED for both buyer and seller
      if (socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Booking confirmed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        // Update deal status to BOOKED
        setDealStatus('BOOKED');
        
        // Refresh payments when booking is confirmed (payment status might have changed to CAPTURED)
        if (socketDealId) {
          const refreshPayments = async () => {
            try {
              const paymentsData = await requestManager.request(
                `${API_BASE_URL}/api/payment/car-deal/${socketDealId}`,
                { method: 'GET' },
                { cacheTTL: 5 * 1000, skipCache: true } // Skip cache for socket-triggered updates
              );
              if (paymentsData && paymentsData.success && paymentsData.data) {
                setPayments(paymentsData.data);
              }
            } catch (error) {
              console.error('Error fetching payments after booking confirmed:', error);
            }
          };
          refreshPayments();
        }
        
        // Add message for seller
        if (!isBuyer) {
          // Check if booking confirmed message already exists to prevent duplicates
          const existingMessages = getMessages(socketDealId);
          const alreadyHasBookingMessage = existingMessages.some(msg => 
            msg.type === 'booking_confirmed' &&
            Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 10000
          );
          
          if (!alreadyHasBookingMessage) {
            const message = addBookingConfirmedMessage(
              socketDealId, 
              data.amount, 
              data.message || 'Token received from buyer. Kindly keep the car on hold. Carosa will transfer the token amount to you with in 6–8 hours.'
            );
            
            if (message) {
              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          } else {
            console.log('✅ Booking confirmed message already exists, skipping duplicate');
          }
        }
        
        // Note: Payment confirmation message for buyer is now added directly in the payment success handler
        // This prevents duplicate messages when webhook arrives
        // The message will be added when Razorpay payment succeeds in the "Yes" button handler
      }
    };
    
    // Handler for seller when test drive is scheduled by buyer
    const handleTestDriveScheduled = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      
      console.log('🚗 [TEST DRIVE SCHEDULED] Event received:', { 
        socketDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Test drive scheduled event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        // Format date and time from backend data
        const scheduledDate = data.scheduledDate || data.formattedDate;
        const scheduledTime = data.scheduledTime || data.formattedTime;
        const testDriveId = data.testDriveId || data.testDrive?.id;
        
        if (scheduledDate && scheduledTime) {
          const existingMessages = getMessages(socketDealId);
          const alreadyHasMessage = existingMessages.some(msg => 
            msg.type === 'test_drive_scheduled' &&
            msg.testDriveId === testDriveId
          );
          
          if (!alreadyHasMessage) {
            addSellerTestDriveScheduledMessage(socketDealId, scheduledDate, scheduledTime, testDriveId);
            setMessageKey(prev => prev + 1);
            forceUpdate();
          } else {
            console.log('✅ Test drive scheduled message already exists, skipping duplicate');
          }
        }
      }
    };

    // Handler for seller when delivery is scheduled by buyer
    const handleDeliveryScheduled = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      
      console.log('🚚 [DELIVERY SCHEDULED] Event received:', { 
        socketDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery scheduled event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        // Format date and time from backend data
        const scheduledDate = data.scheduledDate || data.formattedDate;
        const scheduledTime = data.scheduledTime || data.formattedTime;
        const deliveryId = data.deliveryId || data.delivery?.id;
        const deliveryStatus = data.delivery?.status || 'SCHEDULED';
        const isReschedule = deliveryStatus === 'RESCHEDULED';
        
        if (scheduledDate && scheduledTime) {
          const existingMessages = getMessages(socketDealId);
          
          if (isReschedule) {
            // For reschedule, update existing message status to 'rescheduled' and add new message
            const oldScheduledMessage = existingMessages.find(msg => 
              msg.type === 'delivery_scheduled' &&
              msg.deliveryId === deliveryId &&
              msg.status !== 'confirmed' &&
              msg.status !== 'cancelled'
            );
            
            if (oldScheduledMessage) {
              updateMessage(socketDealId, oldScheduledMessage.id, { status: 'rescheduled' });
            }
            
            // Add new rescheduled message with buttons
            addSellerDeliveryRescheduledMessage(socketDealId, scheduledDate, scheduledTime, deliveryId, 'pending');
            setMessageKey(prev => prev + 1);
            forceUpdate();
          } else {
            // For new schedule, check if message already exists
            const alreadyHasMessage = existingMessages.some(msg => 
              msg.type === 'delivery_scheduled' &&
              msg.deliveryId === deliveryId &&
              msg.status === 'pending'
            );
            
            if (!alreadyHasMessage) {
              addSellerDeliveryScheduledMessage(socketDealId, scheduledDate, scheduledTime, deliveryId, 'pending');
              setMessageKey(prev => prev + 1);
              forceUpdate();
            } else {
              console.log('✅ Delivery scheduled message already exists, skipping duplicate');
            }
          }
        }
      }
    };

    // Handler for buyer when test drive is confirmed by seller
    const handleTestDriveConfirmed = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      
      console.log('✅ [TEST DRIVE CONFIRMED] Event received:', { 
        socketDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for buyer
      if (isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Test drive confirmed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const formattedDateTime = data.formattedDateTime || `${data.scheduledDate} — ${data.scheduledTime}`;
        const testDriveId = data.testDriveId || data.testDrive?.id;
        
        // Update the scheduled test drive message status to 'confirmed'
        const existingMessages = getMessages(socketDealId);
        const scheduledMessage = existingMessages.find(msg => 
          msg.type === 'test_drive_scheduled' &&
          msg.testDriveId === testDriveId
        );
        
        if (scheduledMessage) {
          updateMessage(socketDealId, scheduledMessage.id, { status: 'confirmed' });
        }
        
        // Add confirmation message
        const alreadyHasConfirmation = existingMessages.some(msg => 
          msg.type === 'test_drive_confirmed' &&
          msg.testDriveId === testDriveId
        );
        
        if (!alreadyHasConfirmation) {
          addBuyerTestDriveConfirmedMessage(socketDealId, formattedDateTime, testDriveId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Test drive confirmed message already exists, skipping duplicate');
        }
      }
    };
    
    // Handler for buyer when delivery is confirmed by seller
    const handleDeliveryConfirmed = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      
      console.log('✅ [DELIVERY CONFIRMED] Event received:', { 
        socketDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for buyer
      if (isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery confirmed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const formattedDateTime = data.formattedDateTime || `${data.scheduledDate} — ${data.scheduledTime}`;
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        // Update the scheduled delivery message status to 'confirmed'
        const existingMessages = getMessages(socketDealId);
        const scheduledMessage = existingMessages.find(msg => 
          msg.type === 'delivery_scheduled' &&
          msg.deliveryId === deliveryId
        );
        
        if (scheduledMessage) {
          updateMessage(socketDealId, scheduledMessage.id, { status: 'confirmed' });
        }
        
        // Add confirmation message
        const alreadyHasConfirmation = existingMessages.some(msg => 
          msg.type === 'delivery_confirmed' &&
          msg.deliveryId === deliveryId
        );
        
        if (!alreadyHasConfirmation) {
          addBuyerDeliveryConfirmedMessage(socketDealId, formattedDateTime, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Delivery confirmed message already exists, skipping duplicate');
        }
      }
    };

    // Handler for seller when delivery is confirmed
    const handleDeliveryConfirmedSeller = (data) => {
      const socketDealId = data.dealId || data.deal?.id;
      
      console.log('✅ [DELIVERY CONFIRMED SELLER] Event received:', { 
        socketDealId,
        dealId,
        isBuyer, 
        userType,
        data
      });
      
      // Only process for seller
      if (!isBuyer && socketDealId) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery confirmed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        // Update the scheduled/rescheduled delivery message status to 'confirmed'
        // Similar to test drive - just update the existing message, don't create a new one
        const existingMessages = getMessages(socketDealId);
        const scheduledMessage = existingMessages.find(msg => 
          msg.type === 'delivery_scheduled' &&
          msg.deliveryId === deliveryId &&
          (msg.status === 'pending' || msg.status === 'scheduled' || msg.status === 'rescheduled')
        );
        
        if (scheduledMessage) {
          // Update the existing message status to 'confirmed' - this will hide the buttons
          updateMessage(socketDealId, scheduledMessage.id, { status: 'confirmed' });
          setMessageKey(prev => prev + 1);
          forceUpdate();
          console.log('✅ Updated delivery message status to confirmed for seller');
        } else {
          console.log('⚠️ No scheduled delivery message found to update');
        }
      }
    };
    
    // Handle test drive cancelled (for buyer)
    const handleTestDriveCancelledBuyer = (data) => {
      console.log('🚫 [FRONTEND] Test drive cancelled (buyer):', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in cancellation data');
        return;
      }

      const { formattedDateTime, reason, testDriveId, message } = data;
      const existingMessages = getMessages(socketDealId);
      
      // Update scheduled/rescheduled message status to cancelled
      const scheduledMessage = existingMessages.find(msg => 
        (msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled') &&
        msg.testDriveId === testDriveId &&
        msg.status !== 'cancelled'
      );
      
      if (scheduledMessage) {
        updateMessage(socketDealId, scheduledMessage.id, { status: 'cancelled' });
      }
      
      // Add cancellation message (use backend message format if provided)
      const alreadyHasCancellation = existingMessages.some(msg => 
        msg.type === 'test_drive_cancelled' &&
        msg.testDriveId === testDriveId
      );
      
      if (!alreadyHasCancellation) {
        addBuyerTestDriveCancelledMessage(socketDealId, formattedDateTime, reason, testDriveId, message);
        setMessageKey(prev => prev + 1);
        forceUpdate();
      }
    };

    // Handle test drive cancelled (for seller)
    const handleTestDriveCancelledSeller = (data) => {
      console.log('🚫 [FRONTEND] Test drive cancelled (seller):', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in cancellation data');
        return;
      }

      const { formattedDateTime, reason, testDriveId, message } = data;
      const existingMessages = getMessages(socketDealId);
      
      // Update scheduled/rescheduled message status to cancelled
      const scheduledMessage = existingMessages.find(msg => 
        (msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled') &&
        msg.testDriveId === testDriveId &&
        msg.status !== 'cancelled'
      );
      
      if (scheduledMessage) {
        updateMessage(socketDealId, scheduledMessage.id, { status: 'cancelled' });
      }
      
      // Add cancellation message (use backend message format if provided)
      const alreadyHasCancellation = existingMessages.some(msg => 
        msg.type === 'test_drive_cancelled' &&
        msg.testDriveId === testDriveId
      );
      
      if (!alreadyHasCancellation) {
        addSellerTestDriveCancelledMessage(socketDealId, formattedDateTime, reason, testDriveId, message);
        setMessageKey(prev => prev + 1);
        forceUpdate();
      }
    };

    // Handle test drive rescheduled (unified handler for both buyer and seller)
    const handleTestDriveRescheduled = (data) => {
      console.log('🔄 [FRONTEND] Test drive rescheduled:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in reschedule data');
        return;
      }

      const { formattedDateTime, reason, testDriveId, scheduledDate, scheduledTime, status, message } = data;
      const existingMessages = getMessages(socketDealId);
      
      // Check if we already have this reschedule message (prevent duplicates)
      const alreadyHasReschedule = existingMessages.some(msg => 
        msg.type === 'test_drive_rescheduled' &&
        msg.testDriveId === testDriveId &&
        msg.status === status &&
        Math.abs(new Date(msg.timestamp).getTime() - new Date().getTime()) < 5000 // Within 5 seconds
      );
      
      if (alreadyHasReschedule) {
        console.log('✅ Reschedule message already exists, skipping duplicate');
        return;
      }
      
      // Update old scheduled/rescheduled message status to 'rescheduled'
      const oldScheduledMessage = existingMessages.find(msg => 
        (msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled') &&
        msg.testDriveId === testDriveId &&
        msg.status !== 'cancelled' &&
        msg.status !== 'confirmed' &&
        msg.status !== 'pending_confirmation'
      );
      
      if (oldScheduledMessage) {
        updateMessage(socketDealId, oldScheduledMessage.id, { status: 'rescheduled' });
      }
      
      // Add rescheduled message with appropriate status and message
      const messageStatus = status || 'pending';
      if (isBuyer) {
        // Use custom message if provided (for admin-approved reschedule)
        addBuyerTestDriveRescheduledMessage(socketDealId, formattedDateTime, reason, testDriveId, messageStatus, message);
      } else {
        addSellerTestDriveRescheduledMessage(socketDealId, formattedDateTime, reason, testDriveId, messageStatus, message);
      }
      
      setMessageKey(prev => prev + 1);
      forceUpdate();
    };

    // Handle seller reschedule request (waiting for admin approval)
    const handleTestDriveRescheduleRequested = (data) => {
      console.log('🔄 [FRONTEND] Test drive reschedule requested (waiting for admin):', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in reschedule request data');
        return;
      }

      const { formattedDateTime, reason, testDriveId, message } = data;
      
      // Only show this to seller
      if (!isBuyer) {
        addSellerRescheduleRequestMessage(socketDealId, formattedDateTime, reason, testDriveId);
        setMessageKey(prev => prev + 1);
        forceUpdate();
      }
    };

    // Handle test drive completed (for buyer)
    const handleTestDriveCompletedBuyer = (data) => {
      console.log('✅ [TEST DRIVE COMPLETED] Event received for buyer:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in test drive completed data');
        return;
      }

      // Only process for buyer
      if (isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Test drive completed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const testDriveId = data.testDriveId || data.testDrive?.id;
        const message = data.message;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'test_drive_completed' &&
          msg.testDriveId === testDriveId
        );
        
        if (!alreadyHasMessage) {
          addBuyerTestDriveCompletedMessage(socketDealId, testDriveId, message);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Test drive completed message already exists, skipping duplicate');
        }
      }
    };

    // Handle test drive completed (for seller)
    const handleTestDriveCompletedSeller = (data) => {
      console.log('✅ [TEST DRIVE COMPLETED] Event received for seller:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in test drive completed data');
        return;
      }

      // Only process for seller
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Test drive completed event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const testDriveId = data.testDriveId || data.testDrive?.id;
        const message = data.message;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'test_drive_completed' &&
          msg.testDriveId === testDriveId
        );
        
        if (!alreadyHasMessage) {
          addSellerTestDriveCompletedMessage(socketDealId, testDriveId, message);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Test drive completed message already exists, skipping duplicate');
        }
      }
    };

    // Handle buyer declined purchase (for buyer)
    const handleBuyerDeclinedPurchaseBuyer = (data) => {
      console.log('❌ [BUYER DECLINED PURCHASE] Event received for buyer:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in buyer declined purchase data');
        return;
      }

      // Only process for buyer
      if (isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Buyer declined purchase event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const message = data.message;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'buyer_declined_purchase'
        );
        
        if (!alreadyHasMessage) {
          addBuyerDeclinedPurchaseMessage(socketDealId, message);
          setHasClickedNo(true); // Mark that No was clicked (message confirms it)
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Buyer declined purchase message already exists, skipping duplicate');
          // Still set hasClickedNo if message already exists
          setHasClickedNo(true);
        }
      }
    };

    // Handle buyer declined purchase (for seller)
    const handleBuyerDeclinedPurchaseSeller = (data) => {
      console.log('❌ [BUYER DECLINED PURCHASE] Event received for seller:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in buyer declined purchase data');
        return;
      }

      // Only process for seller
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Buyer declined purchase event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }
        
        const message = data.message;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'buyer_declined_purchase_seller'
        );
        
        if (!alreadyHasMessage) {
          addSellerBuyerDeclinedMessage(socketDealId, message);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        } else {
          console.log('✅ Buyer declined purchase message already exists, skipping duplicate');
        }
      }
    };

    // Handle delivery cancel request (for seller/dealer only)
    const handleDeliveryCancelRequested = (data) => {
      console.log('🚫 [DELIVERY CANCEL REQUESTED] Event received:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery cancel request data');
        return;
      }

      // Only show to seller (dealer), not buyer
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery cancel request event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const message = data.message || 'Cancel request submitted successfully. Waiting for admin approval.';
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'delivery_cancel_requested' &&
          msg.deliveryId === deliveryId &&
          msg.status === 'pending_admin_approval'
        );
        
        if (!alreadyHasMessage) {
          addSellerDeliveryCancelRequestMessage(socketDealId, message, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Handle delivery reschedule request (for seller/dealer only)
    const handleDeliveryRescheduleRequested = (data) => {
      console.log('🔄 [DELIVERY RESCHEDULE REQUESTED] Event received:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery reschedule request data');
        return;
      }

      // Only show to seller (dealer), not buyer
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery reschedule request event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const message = data.message || 'Reschedule request submitted successfully. Waiting for admin approval.';
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'delivery_reschedule_requested' &&
          msg.deliveryId === deliveryId &&
          msg.status === 'pending_admin_approval'
        );
        
        if (!alreadyHasMessage) {
          addSellerDeliveryRescheduleRequestMessage(socketDealId, message, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Handle delivery cancelled (for buyer)
    const handleDeliveryCancelledBuyer = (data) => {
      console.log('🚫 [DELIVERY CANCELLED] Event received for buyer:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery cancelled data');
        return;
      }

      // Only process for buyer
      if (isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery cancelled event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const formattedDateTime = data.formattedDateTime || `${data.scheduledDate} — ${data.scheduledTime}`;
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        
        // Update scheduled message status to cancelled
        const scheduledMessage = existingMessages.find(msg => 
          msg.type === 'delivery_scheduled' &&
          msg.deliveryId === deliveryId &&
          msg.status !== 'cancelled'
        );
        
        if (scheduledMessage) {
          updateMessage(socketDealId, scheduledMessage.id, { status: 'cancelled' });
        }
        
        // Add cancellation message
        const alreadyHasCancellation = existingMessages.some(msg => 
          msg.type === 'delivery_cancelled' &&
          msg.deliveryId === deliveryId
        );
        
        if (!alreadyHasCancellation) {
          addBuyerDeliveryCancelledMessage(socketDealId, formattedDateTime, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Handle delivery cancelled (for seller)
    const handleDeliveryCancelledSeller = (data) => {
      console.log('🚫 [DELIVERY CANCELLED] Event received for seller:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery cancelled data');
        return;
      }

      // Only process for seller
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery cancelled event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const formattedDateTime = data.formattedDateTime || `${data.scheduledDate} — ${data.scheduledTime}`;
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        
        // Update scheduled message status to cancelled
        const scheduledMessage = existingMessages.find(msg => 
          msg.type === 'delivery_scheduled' &&
          msg.deliveryId === deliveryId &&
          msg.status !== 'cancelled'
        );
        
        if (scheduledMessage) {
          updateMessage(socketDealId, scheduledMessage.id, { status: 'cancelled' });
        }
        
        // Add cancellation message
        const alreadyHasCancellation = existingMessages.some(msg => 
          msg.type === 'delivery_cancelled' &&
          msg.deliveryId === deliveryId
        );
        
        if (!alreadyHasCancellation) {
          addSellerDeliveryCancelledMessage(socketDealId, formattedDateTime, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Handle delivery cancel rejected (for seller)
    const handleDeliveryCancelRejected = (data) => {
      console.log('❌ [DELIVERY CANCEL REJECTED] Event received:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery cancel rejected data');
        return;
      }

      // Only show to seller (dealer), not buyer
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery cancel rejected event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const message = data.message || 'Your cancel request has been rejected.';
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'delivery_cancel_rejected' &&
          msg.deliveryId === deliveryId
        );
        
        if (!alreadyHasMessage) {
          addSellerDeliveryCancelRejectedMessage(socketDealId, message, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Handle delivery rescheduled (for both buyer and seller)
    const handleDeliveryRescheduled = (data) => {
      console.log('🔄 [DELIVERY RESCHEDULED] Event received:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery rescheduled data');
        return;
      }

      if (dealId && String(socketDealId) !== String(dealId)) {
        console.log('⚠️ Delivery rescheduled event for different dealId, ignoring');
        return;
      }
      
      if (!dealId && socketDealId) {
        setDealId(parseInt(socketDealId));
      }

      const formattedDateTime = data.formattedDateTime || `${data.scheduledDate} — ${data.scheduledTime}`;
      const deliveryId = data.deliveryId || data.delivery?.id;
      const status = data.status || 'confirmed';
      
      const existingMessages = getMessages(socketDealId);
      
      // Update old scheduled message status
      const oldScheduledMessage = existingMessages.find(msg => 
        msg.type === 'delivery_scheduled' &&
        msg.deliveryId === deliveryId &&
        msg.status !== 'cancelled' &&
        msg.status !== 'confirmed'
      );
      
      if (oldScheduledMessage) {
        updateMessage(socketDealId, oldScheduledMessage.id, { status: 'rescheduled' });
      }
      
      // Add rescheduled message based on user type
      const alreadyHasReschedule = existingMessages.some(msg => 
        msg.type === 'delivery_rescheduled' &&
        msg.deliveryId === deliveryId &&
        msg.status === status
      );
      
      if (!alreadyHasReschedule) {
        if (isBuyer) {
          addBuyerDeliveryRescheduledMessageAdmin(socketDealId, formattedDateTime, deliveryId);
        } else {
          addSellerDeliveryRescheduledMessageAdmin(socketDealId, formattedDateTime, deliveryId);
        }
        setMessageKey(prev => prev + 1);
        forceUpdate();
      }
    };

    // Handle delivery reschedule rejected (for seller)
    const handleDeliveryRescheduleRejected = (data) => {
      console.log('❌ [DELIVERY RESCHEDULE REJECTED] Event received:', data);
      const socketDealId = data.dealId || dealId;
      if (!socketDealId) {
        console.error('❌ [FRONTEND] No dealId in delivery reschedule rejected data');
        return;
      }

      // Only show to seller (dealer), not buyer
      if (!isBuyer) {
        if (dealId && String(socketDealId) !== String(dealId)) {
          console.log('⚠️ Delivery reschedule rejected event for different dealId, ignoring');
          return;
        }
        
        if (!dealId && socketDealId) {
          setDealId(parseInt(socketDealId));
        }

        const message = data.message || 'Your reschedule request has been rejected.';
        const deliveryId = data.deliveryId || data.delivery?.id;
        
        const existingMessages = getMessages(socketDealId);
        const alreadyHasMessage = existingMessages.some(msg => 
          msg.type === 'delivery_reschedule_rejected' &&
          msg.deliveryId === deliveryId
        );
        
        if (!alreadyHasMessage) {
          addSellerDeliveryRescheduleRejectedMessage(socketDealId, message, deliveryId);
          setMessageKey(prev => prev + 1);
          forceUpdate();
        }
      }
    };

    // Remove existing listeners first to avoid duplicates
    socket.off('offer_submitted');
    socket.off('offer_accepted');
    socket.off('offer_rejected');
    socket.off('counter_offer');
    socket.off('offer_accepted_seller');
    socket.off('buyer_accepted_counter_offer');
    socket.off('counter_offer_accepted_by_buyer');
    socket.off('counter_offer_rejected_by_buyer');
    socket.off('booking_confirmed');
    socket.off('test_drive_scheduled');
    socket.off('delivery_scheduled');
    socket.off('test_drive_confirmed_buyer');
    socket.off('delivery_confirmed_buyer');
    socket.off('delivery_confirmed_seller');
    socket.off('test_drive_cancelled_buyer');
    socket.off('test_drive_cancelled_seller');
    socket.off('test_drive_rescheduled');
    socket.off('test_drive_rescheduled_buyer');
    socket.off('test_drive_rescheduled_seller');
    socket.off('test_drive_reschedule_requested');
    socket.off('test_drive_completed_buyer');
    socket.off('test_drive_completed_seller');
    socket.off('buyer_declined_purchase_buyer');
    socket.off('buyer_declined_purchase_seller');
    socket.off('delivery_cancel_requested');
    socket.off('delivery_reschedule_requested');
    socket.off('delivery_cancelled_buyer');
    socket.off('delivery_cancelled_seller');
    socket.off('delivery_cancel_rejected');
    socket.off('delivery_rescheduled');
    socket.off('delivery_reschedule_rejected');
    
    // Add new listeners - these work regardless of connection status
    // They'll be active once socket connects
    socket.on('offer_submitted', wrappedHandleOfferSubmitted);
    socket.on('offer_accepted', wrappedHandleOfferAccepted);
    socket.on('offer_rejected', wrappedHandleOfferRejected);
    socket.on('counter_offer', wrappedHandleCounterOffer);
    socket.on('offer_accepted_seller', handleOfferAcceptedSeller);
    socket.on('buyer_accepted_counter_offer', handleBuyerAcceptedCounterOffer);
    socket.on('counter_offer_accepted_by_buyer', handleCounterOfferAcceptedByBuyer);
    socket.on('counter_offer_rejected_by_buyer', handleCounterOfferRejectedByBuyer);
    socket.on('booking_confirmed', handleBookingConfirmed);
    socket.on('test_drive_scheduled', handleTestDriveScheduled);
    socket.on('delivery_scheduled', handleDeliveryScheduled);
    socket.on('test_drive_confirmed_buyer', handleTestDriveConfirmed);
    socket.on('delivery_confirmed_buyer', handleDeliveryConfirmed);
    socket.on('delivery_confirmed_seller', handleDeliveryConfirmedSeller);
    socket.on('test_drive_cancelled_buyer', handleTestDriveCancelledBuyer);
    socket.on('test_drive_cancelled_seller', handleTestDriveCancelledSeller);
    socket.on('test_drive_rescheduled', handleTestDriveRescheduled);
    socket.on('test_drive_reschedule_requested', handleTestDriveRescheduleRequested);
    socket.on('test_drive_completed_buyer', handleTestDriveCompletedBuyer);
    socket.on('test_drive_completed_seller', handleTestDriveCompletedSeller);
    socket.on('buyer_declined_purchase_buyer', handleBuyerDeclinedPurchaseBuyer);
    socket.on('buyer_declined_purchase_seller', handleBuyerDeclinedPurchaseSeller);
    
    // Delivery cancel/reschedule handlers
    socket.on('delivery_cancel_requested', handleDeliveryCancelRequested);
    socket.on('delivery_reschedule_requested', handleDeliveryRescheduleRequested);
    socket.on('delivery_cancelled_buyer', handleDeliveryCancelledBuyer);
    socket.on('delivery_cancelled_seller', handleDeliveryCancelledSeller);
    socket.on('delivery_cancel_rejected', handleDeliveryCancelRejected);
    socket.on('delivery_rescheduled', handleDeliveryRescheduled);
    socket.on('delivery_reschedule_rejected', handleDeliveryRescheduleRejected);
    
    console.log('✅ Socket listeners registered for events: offer_submitted, offer_accepted, offer_rejected, counter_offer, offer_accepted_seller, booking_confirmed, test_drive_scheduled, test_drive_confirmed_buyer, test_drive_cancelled_buyer, test_drive_cancelled_seller, test_drive_rescheduled, test_drive_completed_buyer, test_drive_completed_seller, buyer_declined_purchase_buyer, buyer_declined_purchase_seller');

    // Identify user when socket connects (or re-identify if already connected)
    const identifyUser = async () => {
      try {
        const identified = await socketService.identify();
        if (identified) {
          console.log('✅ User identified on socket');
        } else {
          console.warn('⚠️ User identification returned false - token may be missing');
        }
      } catch (error) {
        console.error('❌ Error identifying user:', error);
      }
    };

    // Handle connect listener - identify user when socket connects
    const connectHandler = () => {
      console.log('🔌 Socket connected event received, identifying user...');
      identifyUser();
    };
    
    // Always listen for connect events (in case socket connects after component mounts)
    socket.on('connect', connectHandler);
    
    // Identify user immediately if already connected
    if (socket.connected || isConnected) {
      console.log('🔌 Socket already connected, identifying user immediately');
      identifyUser();
    } else {
      // Try to manually connect if not connected
      console.log('🔄 Socket not connected, attempting connection...');
      socket.connect();
    }

    // Cleanup listeners on unmount or when dependencies change
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      socket.off('offer_submitted', wrappedHandleOfferSubmitted);
      socket.off('offer_accepted', wrappedHandleOfferAccepted);
      socket.off('offer_rejected', wrappedHandleOfferRejected);
      socket.off('counter_offer', wrappedHandleCounterOffer);
      socket.off('offer_accepted_seller', handleOfferAcceptedSeller);
      socket.off('buyer_accepted_counter_offer', handleBuyerAcceptedCounterOffer);
      socket.off('counter_offer_accepted_by_buyer', handleCounterOfferAcceptedByBuyer);
      socket.off('counter_offer_rejected_by_buyer', handleCounterOfferRejectedByBuyer);
      socket.off('booking_confirmed', handleBookingConfirmed);
      socket.off('test_drive_scheduled', handleTestDriveScheduled);
      socket.off('delivery_scheduled', handleDeliveryScheduled);
      socket.off('test_drive_confirmed_buyer', handleTestDriveConfirmed);
      socket.off('delivery_confirmed_buyer', handleDeliveryConfirmed);
      socket.off('delivery_confirmed_seller', handleDeliveryConfirmedSeller);
      socket.off('test_drive_cancelled_buyer', handleTestDriveCancelledBuyer);
      socket.off('test_drive_cancelled_seller', handleTestDriveCancelledSeller);
      socket.off('test_drive_rescheduled', handleTestDriveRescheduled);
      socket.off('connect', connectHandler);
      if (socket.offAny) {
        socket.offAny(debugAllEvents);
      }
    };
  }, [socket, isConnected, carId, isBuyer, userType, addSellerReceivedOfferMessage, addBuyerRejectionMessage, addSellerRejectionMessage, addBuyerAcceptanceMessage, addSellerReceivedCounterOfferMessage, addBuyerReceivedCounterOfferMessage, updateMessage, getMessages, propNegotiationId, dealId, onOfferStatusChange, socketService, addSellerWaitingMessage, addBookingConfirmedMessage, addSellerTestDriveScheduledMessage, addBuyerTestDriveConfirmedMessage, addBuyerTestDriveCancelledMessage, addSellerTestDriveCancelledMessage, addBuyerTestDriveRescheduledMessage, addSellerTestDriveRescheduledMessage, addBuyerTestDriveScheduledMessage, addSellerRescheduleRequestMessage, addBuyerTestDriveCompletedMessage, addSellerTestDriveCompletedMessage, addBuyerDeclinedPurchaseMessage, addSellerBuyerDeclinedMessage, addSellerCounterOfferRejectedByBuyerMessage]);



  const handleOfferSubmit = async () => {
    if (remainingOffers <= 0) {
      alert('No more offers remaining! You have reached the maximum of 2 offers.');
      return;
    }

    if (!carId) {
      alert('Car ID not found. Please refresh the page and try again.');
      return;
    }

    // Check if user is authenticated using Zustand store
    if (!isAuthenticated || !user) {
      handleOpenLoginModal();
      return;
    }

    try {
      let result;
      
      // For sellers making counter offers, use deal negotiation endpoint
      // For buyers making initial offers, use offer submission endpoint
      if (userType === 'seller' && dealId) {
        // Seller making counter offer - use deal negotiation endpoint
        result = await socketService.submitCounterOffer(dealId, offerAmount);
        
        if (result.success) {
          // Set dealId from response if not already set
          const responseDealId = result.data?.dealId || dealId;
          if (!dealId && responseDealId) {
            setDealId(parseInt(responseDealId));
          }
          
          // Seller sends counter: "Counter offer sent: ₹X. Waiting for the Buyer to reply."
          const message = addSellerCounterOfferMessage(responseDealId, offerAmount);
          
          // Store negotiationId and dealId from API response
          if (message && result.data) {
            if (result.data.id || result.data.negotiationId || result.data.dealId) {
              updateMessage(responseDealId, message.id, {
                negotiationId: result.data.id || result.data.negotiationId,
                dealId: result.data.dealId || responseDealId
              });
            }
          }
          
          setOfferStatus('sent');
          setRemainingOffers(prev => Math.max(0, prev - 1));
          setOfferCount(prev => prev + 1);
          
          if (onOfferStatusChange) {
            onOfferStatusChange('sent', offerAmount);
          }
        } else {
          alert(result.message || 'Failed to submit counter offer. Please try again.');
        }
      } else {
        // Buyer making initial offer or counter offer - use offer submission endpoint
        result = await socketService.submitOffer(carId, offerAmount);
        
        if (result.success) {
          // Get dealId from response - this is critical for message isolation
          const responseDealId = result.data?.dealId;
          if (!responseDealId) {
            console.error('⚠️ No dealId in submitOffer response!');
            alert('Failed to get deal information. Please refresh and try again.');
            return;
          }
          
          // Set dealId from response
          if (!dealId && responseDealId) {
            setDealId(parseInt(responseDealId));
          }
          
          // Buyer sends initial offer or counter offer
          let message;
          const existingMessages = getMessages(responseDealId);
          const hasPreviousOffers = existingMessages.some(msg => 
            (msg.type === 'offer' || msg.type === 'counter_offer') && msg.sender === 'buyer'
          );
          
          if (hasPreviousOffers || offerStatus === 'received' || offerStatus === 'rejected') {
            // Counter offer: "Counter Offer sent: ₹X. Waiting for the seller to reply"
            message = addBuyerCounterOfferMessage(responseDealId, offerAmount);
          } else {
            // Initial offer: "Offer sent: ₹X. Waiting for the seller to reply"
            message = addBuyerOfferMessage(responseDealId, offerAmount);
          }
          
          // Store negotiationId and dealId from API response
          if (message && result.data) {
            if (result.data.negotiationId || result.data.dealId) {
              updateMessage(responseDealId, message.id, {
                negotiationId: result.data.negotiationId,
                dealId: result.data.dealId || responseDealId
              });
            }
          }
          
          setOfferStatus('sent');
          setRemainingOffers(prev => prev - 1);
          setOfferCount(prev => prev + 1);
          
          // Notify parent component about offer status change
          if (onOfferStatusChange) {
            onOfferStatusChange('sent', offerAmount);
          }
        } else {
          alert(result.message || 'Failed to submit offer. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleAccept = async (messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || !dealId) {
      alert('Message not found or deal information missing. Please refresh the page.');
      return;
    }

    if (!isAuthenticated || !user) {
      handleOpenLoginModal();
      return;
    }

    let negotiationId = message.negotiationId || propNegotiationId;
    const dealIdForAccept = message.dealId || dealId;
    
    if (!negotiationId || !dealIdForAccept) {
      alert(`Missing required information. negotiationId: ${negotiationId}, dealId: ${dealIdForAccept}. Please refresh the page.`);
      return;
    }
    
    if (negotiationId > 2147483647 || negotiationId < 1) {
      alert('Invalid offer ID. Please refresh the page.');
      return;
    }
    
    negotiationId = parseInt(negotiationId, 10);
    if (isNaN(negotiationId) || negotiationId <= 0) {
      alert('Invalid offer ID. Please refresh the page.');
      return;
    }

    try {
      // Backend will emit different socket events based on who accepts:
      // - If seller accepts buyer's offer:
      //   1. 'offer_accepted' to buyer
      //   2. 'offer_accepted_seller' to seller (waiting message)
      // - If buyer accepts seller's counter offer:
      //   1. 'buyer_accepted_counter_offer' to buyer (acceptance message with book button)
      //   2. 'counter_offer_accepted_by_buyer' to seller (waiting message)
      const result = await socketService.acceptOffer(dealIdForAccept, negotiationId);
      if (result.success) {
        // Update the original offer message status to 'accepted'
        updateMessage(dealIdForAccept, messageId, { status: 'accepted' });
        
        // Don't add local acceptance message - the socket events will add the appropriate messages
        // Socket events will handle:
        // - Buyer: 'buyer_accepted_counter_offer' or 'offer_accepted' 
        // - Seller: 'counter_offer_accepted_by_buyer' or 'offer_accepted_seller'
        setOfferStatus('accepted');
        if (onOfferStatusChange) {
          onOfferStatusChange('accepted', message.amount);
        }
        // Force re-render to ensure UI updates
        setMessageKey(prev => prev + 1);
      } else {
        alert(result.message || 'Failed to accept offer.');
      }
    } catch (error) {
      alert('Failed to accept offer: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReject = async (messageId) => {
    const rejectedMsg = messages.find(msg => msg.id === messageId);
    if (!rejectedMsg || !dealId) {
      alert('Message not found or deal information missing. Please refresh the page.');
      return;
    }

    if (!isAuthenticated || !user) {
      alert('Please log in to reject an offer.');
      return;
    }
    
    let negotiationId = rejectedMsg.negotiationId || propNegotiationId;
    const dealIdForReject = rejectedMsg.dealId || dealId;
    
    if (!negotiationId || !dealIdForReject) {
      alert(`Missing required information. negotiationId: ${negotiationId}, dealId: ${dealIdForReject}. Please refresh the page.`);
      return;
    }
    
    if (negotiationId > 2147483647 || negotiationId < 1) {
      alert('Invalid offer ID. Please refresh the page.');
      return;
    }
    
    negotiationId = parseInt(negotiationId, 10);
    if (isNaN(negotiationId) || negotiationId <= 0) {
      alert('Invalid offer ID. Please refresh the page.');
      return;
    }
    
    try {
      // When seller rejects, the backend will emit socket event to buyer
      // The buyer's component will receive 'offer_rejected' event and add message automatically
      // This ensures real-time instant appearance in buyer's chat
      const result = await socketService.rejectOffer(dealIdForReject, negotiationId, 'Offer rejected');
      if (result.success) {
        // Update the original offer message status to 'rejected'
        updateMessage(dealIdForReject, messageId, { status: 'rejected' });
        
        // For seller's own view, we can optionally add a confirmation message
        if (userType === 'seller') {
          // Seller sees their own rejection message
          addSellerRejectionMessage(dealIdForReject, rejectedMsg.amount);
        }
        // Buyer's rejection message will be added automatically via socket event
        setOfferStatus('rejected');
        if (onOfferStatusChange) {
          onOfferStatusChange('rejected', rejectedMsg.amount);
        }
        // Force re-render to ensure UI updates
        setMessageKey(prev => prev + 1);
      } else {
        alert(result.message || 'Failed to reject offer.');
      }
    } catch (error) {
      alert('Failed to reject offer: ' + (error.message || 'Unknown error'));
    }
  };



  return (
    <div className={`offer-negotiation-wrapper ${isBuyer ? 'header_chatbuyer' : ' header_chatseller'}`}>
      {/* Header Card */}
      <div className={`offer-header-card ${isBuyer ? 'seller-header' : 'buyer-header'}`}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <Image 
              src={otherParty?.image || "/images/user1.png"} 
              alt={otherParty?.name || "User"} 
              width={48} 
              height={48} 
              className="rounded-circle object-fit-cover" 
            />
            <div>
              <div className="fw-bold fSize-4">{otherParty?.name || (isBuyer ? "Seller" : "Buyer")}</div>
            </div>
          </div>
          <button className="contact-carosa-btn">
            Contact Carosa <FaExternalLinkAlt size={12} className="ms-1" />
          </button>
        </div>
      </div>

      {/* Note Section */}
      <div className="offer-note">
        <span className="fw-semibold" style={{color: '#2A3A92'}}>Note:</span> You can make or counter {remainingOffers} offers more.
        {remainingOffers <= 2 && remainingOffers > 0 && (
          <span className="text-warning ms-2">⚠️ Only {remainingOffers} offers left!</span>
        )}
        {remainingOffers === 0 && (
          <span className="text-danger ms-2">🚫 No more offers allowed!</span>
        )}
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="offer-messages-area" style={{ scrollBehavior: 'smooth' }}>
        {messages.length === 0 && offerStatus === 'initial' && (
          <div className="text-center text-muted py-5 fSize-3">
            Start negotiation by submitting your offer below.
          </div>
        )}

              {(() => {
                // Find the most recent test drive message (scheduled or rescheduled) that is pending or scheduled
                // This is the one that should show action buttons for the seller
                const latestTestDriveMessage = messages
                  .filter(msg => {
                    const isTestDriveMsg = msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled';
                    const isPendingOrScheduled = msg.status === 'scheduled' || msg.status === 'pending';
                    const isNotConfirmed = msg.status !== 'confirmed';
                    const isNotCancelled = msg.status !== 'cancelled';
                    const isNotRescheduled = msg.status !== 'rescheduled';
                    return isTestDriveMsg && isPendingOrScheduled && isNotConfirmed && isNotCancelled && isNotRescheduled;
                  })
                  .sort((a, b) => {
                    // Sort by timestamp descending (most recent first)
                    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                    return timeB - timeA;
                  })[0]; // Get the first (most recent) one
                
                // Find the most recent delivery message that is pending, scheduled, or rescheduled
                // This is the one that should show action buttons for the seller
                const latestDeliveryMessage = messages
                  .filter(msg => {
                    const isDeliveryMsg = msg.type === 'delivery_scheduled';
                    const isPendingOrScheduled = msg.status === 'pending' || msg.status === 'scheduled' || msg.status === 'rescheduled';
                    const isNotConfirmed = msg.status !== 'confirmed';
                    const isNotCancelled = msg.status !== 'cancelled';
                    return isDeliveryMsg && isPendingOrScheduled && isNotConfirmed && isNotCancelled;
                  })
                  .sort((a, b) => {
                    // Sort by timestamp descending (most recent first)
                    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                    return timeB - timeA;
                  })[0]; // Get the first (most recent) one

                return messages.map((msg, index) => {
                // Debug logging for rendering
                if (index === 0 || msg.type === 'acceptance' || msg.type === 'rejection') {
                  console.log('🎨 Rendering message:', { index, type: msg.type, sender: msg.sender, message: msg.message, id: msg.id });
                }
                // Determine if message is from current user based on sender
                // Buyer's own messages have sender='buyer', Seller's own messages have sender='seller'
                // Received messages have the other party's sender value
                const isMyMessage = (userType === 'buyer' && msg.sender === 'buyer') || 
                                   (userType === 'seller' && msg.sender === 'seller');
                
                 // Determine sender type for bubble styling - buyer messages are green, seller messages are blue
                 // This matches the images: Green = buyer messages, Blue = seller messages
                 const isBuyerMessage = msg.sender === 'buyer';
                 
                // Check if this is a payment confirmation message (show with confetti)
                const isPaymentConfirmed = msg.type === 'payment_confirmed';
                
                // Check if this is a buyer declined purchase message (for buyer - shows Browse Car button)
                const isBuyerDeclinedPurchase = msg.type === 'buyer_declined_purchase' && userType === 'buyer';
                
                // Check if this is a test drive scheduled or rescheduled message
                const isTestDriveMessage = msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled';
                
                // Check if this is a delivery scheduled message
                const isDeliveryMessage = msg.type === 'delivery_scheduled';
                
                // Seller sees: Confirm, Request Cancel, Request reschedule (on buyer's message)
                // Show buttons only for the MOST RECENT test drive message that is scheduled or pending (not confirmed)
                // This ensures buttons only appear on the latest reschedule, not on older ones
                const isLatestTestDriveMessage = latestTestDriveMessage && msg.id === latestTestDriveMessage.id;
                const showSellerTestDriveButtons = isTestDriveMessage && 
                  (msg.status === 'scheduled' || msg.status === 'pending') && 
                  msg.status !== 'confirmed' &&
                  userType === 'seller' && 
                  !isMyMessage &&
                  isLatestTestDriveMessage; // Only show for the latest message
                
                // Seller sees: Confirm, Request Cancel, Request Reschedule (on buyer's delivery message)
                const isLatestDeliveryMsg = latestDeliveryMessage && msg.id === latestDeliveryMessage.id;
                const showSellerDeliveryButtons = isDeliveryMessage && 
                  (msg.status === 'pending' || msg.status === 'scheduled' || msg.status === 'rescheduled') && 
                  msg.status !== 'confirmed' &&
                  userType === 'seller' && 
                  !isMyMessage &&
                  isLatestDeliveryMsg; // Only show for the latest message
                
                // Buyer sees: Confirm and Cancel buttons when admin approves seller's reschedule request
                // Show buttons only for pending_confirmation status (admin approved, buyer needs to confirm/cancel)
                const showBuyerRescheduleConfirmationButtons = isTestDriveMessage && 
                  msg.type === 'test_drive_rescheduled' &&
                  msg.status === 'pending_confirmation' &&
                  userType === 'buyer' && 
                  !isMyMessage;
                
                // Check if this offer has already been accepted or rejected
                // Look for acceptance or rejection messages related to this offer
                const hasBeenAcceptedOrRejected = messages.some((otherMsg) => {
                  // Check if it's an acceptance or rejection message
                  const isAcceptanceOrRejection = otherMsg.type === 'acceptance' || otherMsg.type === 'rejection';
                  
                  if (!isAcceptanceOrRejection) return false;
                  
                  // Check if it's related to this offer (same negotiationId or same amount)
                  const isRelatedToThisOffer = (otherMsg.negotiationId && msg.negotiationId && 
                                                otherMsg.negotiationId === msg.negotiationId) ||
                                               (otherMsg.amount && msg.amount && 
                                                otherMsg.amount === msg.amount);
                  
                  return isRelatedToThisOffer;
                });
                
                // Show Accept/Reject buttons:
                // - To seller when receiving buyer's offer or counter offer
                // - To buyer when receiving seller's counter offer (so buyer can accept/reject)
                // AND the offer hasn't been accepted or rejected yet
                // IMPORTANT: Never show buttons on seller's own counter offer messages
                const isSellerOwnCounterOffer = userType === 'seller' && 
                                                msg.sender === 'seller' && 
                                                msg.type === 'counter_offer';
                // Buyer receiving seller's counter offer - should show accept/reject buttons
                const isBuyerReceivingSellerCounterOffer = !isMyMessage && 
                                                          !isSellerOwnCounterOffer &&
                                                          (msg.type === 'counter_offer' || msg.type === 'counter_rejection_fresh_offer') && 
                                                          msg.sender === 'seller' && 
                                                          userType === 'buyer';
                // Seller receiving buyer's offer or counter offer
                const isSellerReceivingBuyerOffer = !isMyMessage && 
                                                     !isSellerOwnCounterOffer &&
                                                     (msg.type === 'offer' || msg.type === 'counter_offer') && 
                                                     msg.sender === 'buyer' && 
                                                     userType === 'seller';
                // Show buttons to both:
                // 1. Seller when receiving buyer's offers
                // 2. Buyer when receiving seller's counter offers
                const showActionButtons = (isSellerReceivingBuyerOffer || isBuyerReceivingSellerCounterOffer) &&
                                         msg.status === 'waiting' && 
                                         !hasBeenAcceptedOrRejected &&
                                         !isSellerOwnCounterOffer; // Extra safety check
                
                return (
                  <div 
                    key={`${msg.id}-${index}`} 
                    className={`offer-message ${isMyMessage ? 'sent' : 'received'}`}
                  >
                    <div 
                      className={`offer-bubble ${isBuyerMessage ? 'buyer-bubble' : 'seller-bubble'}`}
                      style={
                        isPaymentConfirmed ? {
                          background: 'linear-gradient(to right, #4caf50, #2196F3)',
                          color: '#fff'
                        } : {}
                      }
                    >
                      {/* Payment confirmation message with confetti emoji */}
                      {isPaymentConfirmed && (
                        <div className="text-center mb-2" style={{ fontSize: '24px' }}>
                          🎉
                        </div>
                      )}
                      {/* All messages have static text with dynamic price in msg.message */}
                      <div className="fw-semibold">
                        {msg.message}
                      </div>
                      
                      {showActionButtons && (
                        <div className="offer-actions-inline mt-3">
                          <button 
                            type="button"
                            className="offer-action-btn accept-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAccept(msg.id);
                            }}
                          >
                            Accept
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn reject-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleReject(msg.id);
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Seller test drive buttons: Confirm, Request Cancel, Request Reschedule */}
                      {showSellerTestDriveButtons && (
                        <div className="offer-actions-inline mt-3 d-flex gap-2">
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.testDriveId) {
                                alert('Test drive ID not found');
                                return;
                              }

                              try {
                                const result = await TestDriveService.confirmTestDrive(msg.testDriveId);
                                if (result.success) {
                                  // Update the test drive scheduled message status to confirmed
                                  if (dealId && msg.id) {
                                    updateMessage(dealId, msg.id, { status: 'confirmed' });
                                  }
                                  // Backend will send socket notification to buyer
                                  // which will add the confirmation message and update status
                                  setMessageKey(prev => prev + 1);
                                  forceUpdate();
                                }
                              } catch (error) {
                                console.error('Error confirming test drive:', error);
                              }
                            }}
                            style={{
                              backgroundColor: '#4caf50',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Confirm
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.testDriveId) {
                                setToast({ show: true, message: 'Test drive ID not found', type: 'error' });
                                return;
                              }

                              // Open cancel request modal
                              setCancelRequestData({ type: 'testDrive', id: msg.testDriveId, messageId: msg.id });
                              setShowCancelModal(true);
                            }}
                            style={{
                              backgroundColor: '#fff',
                              color: '#dc3545',
                              border: '1px solid #dc3545',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Request Cancel
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.testDriveId) {
                                alert('Test drive ID not found');
                                return;
                              }
                              
                              setRescheduleTestDriveId(msg.testDriveId);
                              setShowTestDriveModal(true);
                            }}
                            style={{
                              backgroundColor: '#fff',
                              color: '#1976d2',
                              border: '1px solid #1976d2',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Request Reschedule
                          </button>
                        </div>
                      )}

                      {/* Browse Car button removed from message bubble - now shown in offer-input-section */}

                      {/* Seller delivery buttons: Confirm, Request Cancel, Request Reschedule */}
                      {showSellerDeliveryButtons && (
                        <div className="offer-actions-inline mt-3 d-flex gap-2">
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.deliveryId) {
                                alert('Delivery ID not found');
                                return;
                              }

                              try {
                                const result = await DeliveryService.confirmDelivery(msg.deliveryId);
                                if (result.success) {
                                  // Update message status - backend will send socket notification
                                  if (dealId && msg.id) {
                                    updateMessage(dealId, msg.id, { status: 'confirmed' });
                                  }
                                  setMessageKey(prev => prev + 1);
                                  forceUpdate();
                                  setToast({ show: true, message: 'Delivery confirmed successfully', type: 'success' });
                                } else {
                                  setToast({ show: true, message: result.message || 'Failed to confirm delivery', type: 'error' });
                                }
                              } catch (error) {
                                console.error('Error confirming delivery:', error);
                                setToast({ show: true, message: 'An error occurred while confirming delivery', type: 'error' });
                              }
                            }}
                            style={{
                              backgroundColor: '#4caf50',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Confirm
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.deliveryId) {
                                setToast({ show: true, message: 'Delivery ID not found', type: 'error' });
                                return;
                              }

                              // Open cancel request modal
                              setCancelRequestData({ type: 'delivery', id: msg.deliveryId, messageId: msg.id });
                              setShowCancelModal(true);
                            }}
                            style={{
                              backgroundColor: '#fff',
                              color: '#dc3545',
                              border: '1px dashed #dc3545',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Request Cancel
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.deliveryId) {
                                alert('Delivery ID not found');
                                return;
                              }
                              
                              // Open reschedule modal with delivery ID and message ID
                              setRescheduleDeliveryId(msg.deliveryId);
                              setRescheduleDeliveryMessageId(msg.id);
                              setShowDeliveryModal(true);
                            }}
                            style={{
                              backgroundColor: '#fff',
                              color: '#2196F3',
                              border: '1px dashed #2196F3',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Request Reschedule
                          </button>
                        </div>
                      )}

                      {/* Buyer reschedule confirmation buttons: Confirm and Cancel (when admin approves seller's reschedule) */}
                      {showBuyerRescheduleConfirmationButtons && (
                        <div className="offer-actions-inline mt-3 d-flex gap-2">
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.testDriveId) {
                                alert('Test drive ID not found');
                                return;
                              }

                              try {
                                const result = await TestDriveService.confirmTestDrive(msg.testDriveId);
                                if (result.success) {
                                  // Update the test drive rescheduled message status to confirmed
                                  if (dealId && msg.id) {
                                    updateMessage(dealId, msg.id, { status: 'confirmed' });
                                  }
                                  // Backend will send socket notification
                                  setMessageKey(prev => prev + 1);
                                  forceUpdate();
                                }
                              } catch (error) {
                                console.error('Error confirming test drive:', error);
                                setToast({ show: true, message: 'An error occurred while confirming test drive', type: 'error' });
                              }
                            }}
                            style={{
                              backgroundColor: '#4caf50',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Confirm
                          </button>
                          <button 
                            type="button"
                            className="offer-action-btn" 
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              if (!msg.testDriveId) {
                                alert('Test drive ID not found');
                                return;
                              }

                              const reason = prompt('Please provide a reason for cancellation:');
                              if (reason === null) return;
                              if (!reason.trim()) {
                                alert('Please provide a reason for cancellation');
                                return;
                              }

                              try {
                                const result = await TestDriveService.cancelTestDrive(msg.testDriveId, reason);
                                if (result.success) {
                                  // Update message status - backend will send socket notification
                                  if (dealId && msg.id) {
                                    updateMessage(dealId, msg.id, { status: 'cancelled' });
                                  }
                                  setMessageKey(prev => prev + 1);
                                  forceUpdate();
                                } else {
                                  alert(result.error || 'Failed to cancel test drive');
                                }
                              } catch (error) {
                                console.error('Error cancelling test drive:', error);
                                alert('An error occurred while cancelling test drive');
                              }
                            }}
                            style={{
                              backgroundColor: '#fff',
                              color: '#dc3545',
                              border: '1px solid #dc3545',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
                });
              })()}
              {/* Scroll anchor for auto-scrolling */}
              <div ref={messagesEndRef} />
      </div>

       {/* Check if offer has been accepted */}
       {(() => {
         // Check if there's an acceptance message in the messages array OR if offerStatus is 'accepted'
         // Also check for buyer_accepted_counter_offer type (when buyer accepts seller's counter offer)
         const isOfferAccepted = offerStatus === 'accepted' || messages.some(msg => 
           msg.type === 'acceptance' || 
           msg.type === 'buyer_accepted_counter_offer' ||
           msg.status === 'accepted'
         );
         const isBooked = dealStatus === 'BOOKED';
         
        // Check if test drive is already scheduled (but not confirmed) - includes both scheduled and rescheduled messages
        // Exclude pending_confirmation status as it has its own Confirm/Cancel buttons inline
        const scheduledTestDrive = messages.find(msg => 
          (msg.type === 'test_drive_scheduled' || msg.type === 'test_drive_rescheduled') && 
          (msg.status === 'scheduled' || msg.status === 'pending') &&
          msg.status !== 'pending_confirmation'
        );
        const hasScheduledTestDrive = !!scheduledTestDrive;
        
        // Check if buyer has pending_confirmation reschedule (admin approved, buyer needs to confirm/cancel)
        const hasPendingConfirmationReschedule = messages.some(msg => 
          msg.type === 'test_drive_rescheduled' && 
          msg.status === 'pending_confirmation' &&
          userType === 'buyer'
        );
        
        // Check if test drive is confirmed
        const hasConfirmedTestDrive = messages.some(msg => 
          msg.type === 'test_drive_confirmed' || 
          (msg.type === 'test_drive_scheduled' && msg.status === 'confirmed') ||
          (msg.type === 'test_drive_rescheduled' && msg.status === 'confirmed')
        );
        
        // Check if test drive is cancelled
        const hasCancelledTestDrive = messages.some(msg => 
          msg.type === 'test_drive_cancelled' || 
          (msg.type === 'test_drive_scheduled' && msg.status === 'cancelled') ||
          (msg.type === 'test_drive_rescheduled' && msg.status === 'cancelled')
        );
        
        // Check if there's any test drive history (scheduled, rescheduled, confirmed, or cancelled)
        // Once a test drive has been scheduled (even if later cancelled/confirmed), don't show Schedule button again
        const hasAnyTestDriveHistory = messages.some(msg => 
          msg.type === 'test_drive_scheduled' || 
          msg.type === 'test_drive_rescheduled' || 
          msg.type === 'test_drive_confirmed' || 
          msg.type === 'test_drive_cancelled'
        );
        
        // Check if test drive is completed (only show buttons for buyer)
        const completedTestDrive = messages.find(msg => 
          msg.type === 'test_drive_completed' && 
          msg.status === 'completed'
        );
        const hasCompletedTestDrive = !!completedTestDrive && userType === 'buyer';

        // For buyer: If test drive is completed, show Yes, Rate Test Drive (if not submitted), No buttons
        // But if Yes or No was clicked, show Schedule Delivery/Apply for Loan or Browse Car button instead
        if (hasCompletedTestDrive) {
          // If No was clicked, show only Browse Car button
          if (hasClickedNo) {
            return (
              <div className="offer-input-section">
                <button 
                  type="button"
                  onClick={() => {
                    router.push('/recentCar');
                  }}
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Browse Car
                </button>
              </div>
            );
          }
          
          // If Yes was clicked and payment is BOOKINGTOKEN with CAPTURED status, show Schedule Delivery and Apply for Loan buttons
          if (hasClickedYes) {
            // Check if there's a payment with type BOOKINGTOKEN and status CAPTURED
            const hasBookingTokenCaptured = payments.some(
              payment => payment.type === 'BOOKINGTOKEN' && payment.status === 'CAPTURED'
            );
            
            if (hasBookingTokenCaptured) {
              // Check if delivery is already scheduled (pending or scheduled, but not confirmed or rescheduled)
              // Exclude 'rescheduled' status as those are old messages that have been replaced
              const scheduledDelivery = messages
                .filter(msg => 
                  msg.type === 'delivery_scheduled' && 
                  (msg.status === 'pending' || msg.status === 'scheduled') &&
                  msg.status !== 'confirmed' &&
                  msg.status !== 'rescheduled'
                )
                .sort((a, b) => {
                  // Sort by timestamp descending (most recent first)
                  const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                  const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                  return timeB - timeA;
                })[0]; // Get the most recent one
              const hasScheduledDelivery = !!scheduledDelivery;
              
              // Check if delivery is confirmed
              const confirmedDelivery = messages.find(msg => 
                (msg.type === 'delivery_confirmed') || 
                (msg.type === 'delivery_scheduled' && msg.status === 'confirmed')
              );
              const hasConfirmedDelivery = !!confirmedDelivery;
              
              // If delivery is confirmed, don't show any buttons
              if (hasConfirmedDelivery) {
                return null;
              }
              
              // If delivery is scheduled, show message with Cancel and Reschedule buttons
              if (hasScheduledDelivery) {
                return (
                  <div className="offer-input-section">
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!scheduledDelivery.deliveryId) {
                            alert('Delivery ID not found');
                            return;
                          }
                          try {
                            const result = await DeliveryService.cancelDelivery(scheduledDelivery.deliveryId);
                            if (result.success) {
                              // Update message status - backend will send socket notification
                              if (dealId && scheduledDelivery.id) {
                                updateMessage(dealId, scheduledDelivery.id, { status: 'cancelled' });
                              }
                              setMessageKey(prev => prev + 1);
                              forceUpdate();
                            } else {
                              alert(result.message || 'Failed to cancel delivery');
                            }
                          } catch (error) {
                            console.error('Error cancelling delivery:', error);
                            alert('An error occurred while cancelling delivery');
                          }
                        }}
                        style={{
                          backgroundColor: '#fff',
                          color: '#dc3545',
                          border: '1px solid #dc3545',
                          padding: '14px 28px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!scheduledDelivery.deliveryId) {
                            alert('Delivery ID not found');
                            return;
                          }
                          // Fetch delivery details if not already loaded
                          if (!existingDelivery) {
                            try {
                              const data = await requestManager.request(
                                `${API_BASE_URL}/api/car-deals/${dealId}`,
                                { method: 'GET' },
                                { cacheTTL: 5 * 1000, skipCache: true } // Skip cache for user-initiated actions
                              );
                              if (data && data.success && data.data?.Delivery && data.data.Delivery.length > 0) {
                                setExistingDelivery(data.data.Delivery[0]);
                                setShowDeliveryModal(true);
                              } else {
                                alert('Delivery details not found');
                              }
                            } catch (error) {
                              console.error('Error fetching delivery:', error);
                              alert('Error loading delivery details');
                            }
                          } else {
                            setShowDeliveryModal(true);
                          }
                        }}
                        style={{
                          backgroundColor: '#fff',
                          color: '#2A3A92',
                          border: '1px solid #2A3A92',
                          padding: '14px 28px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flex: 1,
                          minWidth: '150px'
                        }}
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              }
              
              // If delivery is not scheduled, show Schedule Delivery and Apply for Loan buttons
              return (
                <div className="offer-input-section">
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeliveryModal(true);
                      }}
                      style={{
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: '150px'
                      }}
                    >
                      Schedule Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Implement Apply for Loan functionality
                        alert('Apply for Loan functionality will be implemented soon');
                      }}
                      style={{
                        backgroundColor: '#2196F3',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: '150px'
                      }}
                    >
                      Apply for Loan
                    </button>
                  </div>
                </div>
              );
            }
            
            // If Yes was clicked but payment is not yet CAPTURED, show nothing (waiting for webhook)
            return null;
          }
          
          // Show Yes, Rate Test Drive, No buttons if neither Yes nor No was clicked
          return (
            <div className="offer-input-section">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  type="button"
                  onClick={async () => {
                    try {
                      if (!dealId) {
                        alert('Deal ID not found. Please refresh and try again.');
                        return;
                      }

                      if (!carData) {
                        alert('Car information not available. Please refresh and try again.');
                        return;
                      }

                      // Get car price from customFields
                      const customFields = safeParseCustomFields(carData);
                      const listingPrice = customFields?.listingPrice || customFields?.listing_price || customFields?.price || 0;
                      
                      // Calculate 20% of car amount
                      const carAmount = typeof listingPrice === 'string' 
                        ? parseFloat(listingPrice.replace(/[₹,\s]/g, '')) || 0 
                        : Number(listingPrice) || 0;
                      
                      if (carAmount <= 0) {
                        alert('Car price not available. Cannot proceed with payment.');
                        return;
                      }

                      const calculatedTokenAmount = Math.floor(carAmount * 0.2); // 20% of car amount
                      setBookingTokenAmount(calculatedTokenAmount); // Store for display

                      // Create payment order
                      const paymentResult = await PaymentService.createPaymentOrder(
                        calculatedTokenAmount,
                        dealId,
                        'BOOKINGTOKEN'
                      );

                      if (!paymentResult.success) {
                        alert(paymentResult.message || 'Failed to create payment order. Please try again.');
                        return;
                      }

                      // Initialize Razorpay checkout
                      await PaymentService.initializeRazorpayCheckout(
                        paymentResult.data,
                        // On success
                        async (response) => {
                          console.log('Payment successful:', response);
                          setHasClickedYes(true); // Mark as clicked and hide buttons
                          
                          // Show congratulations modal for delivery reservation
                          setShowDeliveryCongratulationsModal(true);
                          // Auto-hide after 3 seconds
                          setTimeout(() => {
                            setShowDeliveryCongratulationsModal(false);
                          }, 3000);
                          
                          // Add payment confirmation message with token amount
                          if (dealId) {
                            const customFields = safeParseCustomFields(carData);
                            const listingPrice = customFields?.listingPrice || customFields?.listing_price || customFields?.price || 0;
                            const carAmount = typeof listingPrice === 'string' 
                              ? parseFloat(listingPrice.replace(/[₹,\s]/g, '')) || 0 
                              : Number(listingPrice) || 0;
                            const tokenAmount = Math.floor(carAmount * 0.2);
                            
                            addBuyerPaymentConfirmationMessage(
                              dealId,
                              tokenAmount,
                              `You have paid a token amount of ₹${tokenAmount.toLocaleString('en-IN')}. Please complete delivery within 3 to 5 days.`
                            );
                            
                            // Refresh payments to check for BOOKINGTOKEN with CAPTURED status
                            try {
                              const paymentsData = await requestManager.request(
                                `${API_BASE_URL}/api/payment/car-deal/${dealId}`,
                                { method: 'GET' },
                                { cacheTTL: 5 * 1000, skipCache: true } // Skip cache for payment updates
                              );
                              if (paymentsData && paymentsData.success && paymentsData.data) {
                                setPayments(paymentsData.data);
                              }
                            } catch (error) {
                              console.error('Error fetching payments after payment success:', error);
                              // Handle 429 errors gracefully
                              if (error.message && error.message.includes('Rate limit')) {
                                console.warn('Rate limited while refreshing payments. Will retry later.');
                              }
                            }
                          }
                          
                          setMessageKey(prev => prev + 1);
                          forceUpdate();
                        },
                        // On failure
                        (error) => {
                          console.error('Payment failed:', error);
                          const errorMessage = error?.error?.description || 
                                             error?.message || 
                                             (typeof error === 'string' ? error : 'Payment failed. Please try again.');
                          alert(errorMessage);
                        }
                      );
                    } catch (error) {
                      console.error('Error initiating payment:', error);
                      alert('An error occurred while initiating payment. Please try again.');
                    }
                  }}
                  style={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  Yes
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {!hasSubmittedFeedback && (
                    <button 
                      type="button"
                      onClick={() => {
                        if (!completedTestDrive.testDriveId) {
                          alert('Test drive ID not found');
                          return;
                        }
                        setFeedbackTestDriveId(completedTestDrive.testDriveId);
                        setShowFeedbackModal(true);
                      }}
                      style={{
                        backgroundColor: '#fff',
                        color: '#1976d2',
                        border: '1px solid #1976d2',
                        padding: '14px 28px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Rate Test Drive
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => {
                      if (!dealId) {
                        alert('Deal ID not found');
                        return;
                      }
                      setShowNoModal(true);
                    }}
                    style={{
                      backgroundColor: '#fff',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      padding: '14px 28px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: hasSubmittedFeedback ? 1 : 1
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        // For buyer: If test drive has pending_confirmation (admin approved reschedule), don't show Schedule Test Drive button
        // The Confirm/Cancel buttons are shown inline with the message
        if (hasPendingConfirmationReschedule) {
          return null; // Don't show any buttons, Confirm/Cancel are shown inline
        }
        
        // For buyer: If test drive is scheduled/rescheduled (but not confirmed), show Cancel and Reschedule buttons
        // Never show "Schedule Test Drive" button again after first schedule
        if (hasScheduledTestDrive && userType === 'buyer' && !hasConfirmedTestDrive) {
           return (
             <div className="offer-input-section">
               <div className="d-flex gap-2">
                  <button 
                    className="offer-submit-btn flex-fill" 
                    onClick={async () => {
                      if (!scheduledTestDrive.testDriveId) {
                        console.error('Test drive ID not found');
                        return;
                      }
                      try {
                        const result = await TestDriveService.cancelTestDrive(scheduledTestDrive.testDriveId);
                        if (result.success) {
                          // Update message status - backend will send socket notification
                          if (dealId && scheduledTestDrive.id) {
                            updateMessage(dealId, scheduledTestDrive.id, { status: 'cancelled' });
                          }
                          setMessageKey(prev => prev + 1);
                          forceUpdate();
                        } else {
                          console.error('Failed to cancel test drive:', result.error);
                        }
                      } catch (error) {
                        console.error('Error cancelling test drive:', error);
                      }
                    }}
                   style={{
                     backgroundColor: '#fff',
                     color: '#dc3545',
                     border: '1px solid #dc3545',
                     padding: '14px 28px',
                     borderRadius: '8px',
                     fontSize: '16px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     flex: 1
                   }}
                 >
                   Cancel
                 </button>
                 <button 
                   className="offer-submit-btn flex-fill"
                   onClick={() => {
                     if (!scheduledTestDrive.testDriveId) {
                       alert('Test drive ID not found');
                       return;
                     }
                     setRescheduleTestDriveId(scheduledTestDrive.testDriveId);
                     setShowTestDriveModal(true);
                   }}
                   style={{
                     backgroundColor: '#fff',
                     color: '#2A3A92',
                     border: '1px solid #2A3A92',
                     padding: '14px 28px',
                     borderRadius: '8px',
                     fontSize: '16px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     flex: 1
                   }}
                 >
                   Reschedule
                 </button>
               </div>
             </div>
           );
         }
         
        // If booking is done (BOOKED status) and user is buyer, show Schedule Test Drive button
        // But hide it if test drive has any history (scheduled, confirmed, cancelled, or rescheduled)
        // Once a test drive has been scheduled (even if later cancelled/confirmed), don't show Schedule button again
        if (isBooked && userType === 'buyer' && !hasAnyTestDriveHistory) {
           return (
             <div className="offer-input-section">
               <button 
                 className="offer-submit-btn flex-fill" 
                 onClick={() => setShowTestDriveModal(true)}
                 style={{
                   backgroundColor: '#FF6B35',
                   color: '#fff',
                   border: 'none',
                   padding: '14px 28px',
                   borderRadius: '8px',
                   fontSize: '16px',
                   fontWeight: '700',
                   cursor: 'pointer',
                   width: '100%'
                 }}
               >
                 Schedule Test Drive
               </button>
             </div>
           );
         }
         
         // If offer is accepted and user is buyer, show Book Now button (before payment)
         if (isOfferAccepted && userType === 'buyer' && !isBooked) {
           return (
             <div className="offer-input-section">
               <button 
                 className="offer-submit-btn flex-fill" 
                 onClick={() => setShowBookModal(true)}
                 style={{
                   backgroundColor: '#FF6B35',
                   color: '#fff',
                   border: 'none',
                   padding: '14px 28px',
                   borderRadius: '8px',
                   fontSize: '16px',
                   fontWeight: '700',
                   cursor: 'pointer',
                   width: '100%'
                 }}
               >
                 Book Now
               </button>
             </div>
           );
         }
         
        // If offer is accepted and user is seller, hide the offer input section completely
        if (isOfferAccepted && userType === 'seller') {
          return null;
        }
        
        // Check if payment has been made (TESTDRIVE payment with CAPTURED status)
        const hasTestDrivePayment = Array.isArray(payments) && payments.length > 0 && payments.some(payment => 
          payment && payment.type === 'TESTDRIVE' && payment.status === 'CAPTURED'
        );
        
        // Check for booking_confirmed message (shown to seller when buyer pays)
        // Message text: "Great news! The buyer has paid the booking amount and booked the car. Test drive can now be scheduled."
        const hasBookingConfirmedMessage = messages.some(msg => 
          msg.type === 'booking_confirmed' ||
          (msg.message && msg.message.includes('buyer has paid the booking amount'))
        );
        
        // Check for payment_confirmed message (shown to buyer when they pay)
        const hasPaymentConfirmedMessage = messages.some(msg => 
          msg.type === 'payment_confirmed' ||
          (msg.message && msg.message.includes('Booking amount') && msg.message.includes('paid'))
        );
        
        // Check if deal status is BOOKED (indicates payment was made)
        const isDealBooked = isBooked || dealStatus === 'BOOKED';
        
        // Payment is made if any of these conditions are true:
        // 1. TESTDRIVE payment with CAPTURED status exists
        // 2. booking_confirmed message exists (for seller)
        // 3. payment_confirmed message exists (for buyer)
        // 4. Deal status is BOOKED
        const paymentMade = hasTestDrivePayment || hasBookingConfirmedMessage || hasPaymentConfirmedMessage || isDealBooked;
        
        // PRIORITY CHECK: If payment is made AND test drive is scheduled, hide slider for both buyer and seller
        // This is the most important check - negotiation is complete, move to test drive phase
        // Once buyer pays and schedules test drive, seller should not see counter offer slider
        if (paymentMade && hasAnyTestDriveHistory) {
          return null;
        }
        
        // If test drive has any history (confirmed, cancelled, or any test drive action), hide the slider and offer button for buyer
        // Once a test drive has been scheduled (even if later cancelled/confirmed), don't show offer input section again
        if (hasAnyTestDriveHistory && userType === 'buyer') {
          return null;
        }
        
        // If payment is made (even without test drive scheduled yet), hide slider for seller
        // Seller should not be able to counter offer after buyer has paid - negotiation phase is over
        if (paymentMade && userType === 'seller') {
          return null;
        }
        
        // If offer is not accepted, show the normal offer input section
        return (
          <div className="offer-input-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="fSize-3 fw-semibold" style={{color: '#2A3A92'}}>Amount</label>
          <span className="fSize-4 fw-bold" style={{color: '#2A3A92'}}>₹ {(offerAmount / 100000).toFixed(2)} Lakh</span>
        </div>
        
        <input
          type="range"
          className="offer-range-slider"
          min={minPrice}
          max={maxPrice}
          value={offerAmount}
          onChange={(e) => setOfferAmount(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #2A3A92 0%, #2A3A92 ${((offerAmount - minPrice) / (maxPrice - minPrice)) * 100}%, #E5E7EB ${((offerAmount - minPrice) / (maxPrice - minPrice)) * 100}%, #E5E7EB 100%)`
          }}
        />
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fSize-2 text-muted">₹ {(minPrice / 100000).toFixed(2)} Lakh</span>
          <span className="fSize-2 text-muted">₹ {(maxPrice / 100000).toFixed(2)} Lakh</span>
        </div>

         <div className="d-flex gap-2 mt-3">
           <button 
             className="offer-submit-btn flex-fill" 
             onClick={handleOfferSubmit}
             disabled={remainingOffers === 0}
           >
             {userType === 'seller' || offerStatus === 'received' 
               ? 'Counter Offer' 
               : 'Offer'}
           </button>
         </div>
      </div>
        );
      })()}

      {/* Login Modal */}
      <LoginModal 
        show={showLoginModal} 
        handleClose={handleCloseLoginModal} 
      />

      {/* Book Now Modal - Same flow as vehicle detail page */}
      {carData && (() => {
        // Transform car data to match vehicle detail page format
        const customFields = safeParseCustomFields(carData);
        
        // Get the first image - same logic as RecentCarDetails
        const firstImage = carData.CarImages && carData.CarImages.length > 0
          ? `${API_BASE_URL}${carData.CarImages[0].url}`
          : '/images/default-car.jpg';
        
        // Format price with rupee symbol - same logic as RecentCarDetails
        const formatPrice = (price) => {
          if (!price || price === 0) return '₹0';
          const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[₹,]/g, '')) : parseFloat(price);
          if (isNaN(numPrice)) return '₹0';
          return `₹${numPrice.toLocaleString('en-IN')}`;
        };
        
        // Extract listing price from customFields or carData
        const listingPrice = customFields.listingPrice !== undefined ? customFields.listingPrice :
                            customFields.listing_price !== undefined ? customFields.listing_price :
                            carData.listingPrice !== undefined ? carData.listingPrice :
                            carData.listing_price !== undefined ? carData.listing_price :
                            0;
        
        // Booking amount from environment variable with fallback to 999
        const bookingAmount = BOOKING_AMOUNT;
        
        // Get brand and model - same logic as RecentCarDetails
        const brand = normalizeBrand(carData.make) || 'Unknown';
        const model = carData.model || 'Unknown';
        
        return (
          <BookKnowModal 
            show={showBookModal} 
            handleClose={() => setShowBookModal(false)}
            carDetails={{
              name: carData?.name || `${brand} ${model}`.trim() || 'Car',
              sellingPrice: formatPrice(listingPrice),
              bookingAmount: formatPrice(bookingAmount),
              image: firstImage,
              carId: carData?.id || carData?._id || null
            }}
            car={carData}
            dealId={dealId}
            carId={carData?.id || carData?._id || null}
            onPaymentSuccess={refreshDealStatus}
            onShowCongratulations={() => {
              setShowCongratulationsModal(true);
              // Auto-hide after 3 seconds
              setTimeout(() => {
                setShowCongratulationsModal(false);
              }, 3000);
            }}
          />
        );
      })()}

      {/* Schedule Test Drive Modal */}
      {carData && (
        <ScheduleTestDriveModal
          show={showTestDriveModal}
          handleClose={() => {
            setShowTestDriveModal(false);
            setRescheduleTestDriveId(null);
          }}
          carId={carData?.id || carData?._id || null}
          dealId={dealId}
          rescheduleTestDriveId={rescheduleTestDriveId}
          userType={userType}
          onTestDriveScheduled={(formattedDate, selectedTime, testDriveId) => {
            if (dealId) {
              // Add message for buyer (they see their own scheduled message)
              addBuyerTestDriveScheduledMessage(dealId, formattedDate, selectedTime, testDriveId);
              // Add message for seller (they see buyer's scheduled message)
              addSellerTestDriveScheduledMessage(dealId, formattedDate, selectedTime, testDriveId);
              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          }}
        />
      )}

      {/* Test Drive Feedback Modal */}
        <TestDriveFeedbackModal
          show={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setFeedbackTestDriveId(null);
          }}
          testDriveId={feedbackTestDriveId}
          onSubmit={async (testDriveId, rating, review) => {
            try {
              const result = await TestDriveService.submitFeedback(testDriveId, rating, review);
              if (result.success) {
                alert('Feedback submitted successfully!');
                setShowFeedbackModal(false);
                setFeedbackTestDriveId(null);
                setHasSubmittedFeedback(true);
                setMessageKey(prev => prev + 1);
                forceUpdate();
              } else {
                alert(result.error || 'Failed to submit feedback');
              }
            } catch (error) {
              console.error('Error submitting feedback:', error);
              alert('An error occurred while submitting feedback');
            }
          }}
        />

        <TestDriveNoModal
          show={showNoModal}
          onClose={() => {
            setShowNoModal(false);
          }}
          dealId={dealId}
          onSubmit={async (dealId, comment) => {
            try {
              // Create rating with 0 rating (negative feedback)
              const result = await RatingService.createRating(dealId, 0, comment, 'TEST_DRIVE');
              if (result.success) {
                alert('Thank you for your feedback!');
                setShowNoModal(false);
                setHasClickedNo(true); // Mark that No was clicked
                setMessageKey(prev => prev + 1);
                forceUpdate();
              } else {
                alert(result.error || 'Failed to submit feedback');
              }
            } catch (error) {
              console.error('Error submitting rating:', error);
              alert('An error occurred while submitting feedback');
            }
          }}
        />

      {/* Congratulations Modal - Shows after test drive booking payment */}
      <Modal
        show={showCongratulationsModal}
        onHide={() => setShowCongratulationsModal(false)}
        centered
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-4 text-center position-relative" style={{ borderRadius: '12px' }}>
          <Button
            variant="link"
            className="position-absolute top-0 end-0 m-2 text-dark p-2"
            onClick={() => setShowCongratulationsModal(false)}
            style={{ zIndex: 10 }}
          >
            <FaTimes size={20} />
            <span className="visually-hidden">Close</span>
          </Button>
          
          <div className="mb-3" style={{ fontSize: '60px' }}>
            🎉🎊✨
          </div>
          
          <h5 className="mb-3 fw-bold" style={{ color: '#27AE60' }}>
            Congratulations!
          </h5>
          
          <p className="mb-2 fw-medium text-dark">
            You have successfully reserved this car for a test drive.
          </p>
          
          <p className="mb-0 text-dark">
            Click 'Schedule Test Drive' to choose your preferred date and time.
          </p>
        </Modal.Body>
      </Modal>

      {/* Congratulations Modal - Shows after clicking Yes for delivery reservation */}
      <Modal
        show={showDeliveryCongratulationsModal}
        onHide={() => setShowDeliveryCongratulationsModal(false)}
        centered
        size="md"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-4 text-center position-relative" style={{ borderRadius: '12px' }}>
          <Button
            variant="link"
            className="position-absolute top-0 end-0 m-2 text-dark p-2"
            onClick={() => setShowDeliveryCongratulationsModal(false)}
            style={{ zIndex: 10 }}
          >
            <FaTimes size={20} />
            <span className="visually-hidden">Close</span>
          </Button>
          
          <div className="mb-3" style={{ fontSize: '60px' }}>
            🎉🎊✨
          </div>
          
          <h5 className="mb-3 fw-bold" style={{ color: '#27AE60' }}>
            Congratulations!
          </h5>
          
          <p className="mb-0 fw-medium text-dark">
            You have successfully reserved this car for delivery.
          </p>
        </Modal.Body>
      </Modal>

      {/* Schedule Delivery Modal */}
      {dealId && (
        <ScheduleDeliveryModal
          show={showDeliveryModal}
          handleClose={() => {
            setShowDeliveryModal(false);
            setExistingDelivery(null); // Reset when modal closes
            setRescheduleDeliveryId(null); // Reset reschedule delivery ID
            setRescheduleDeliveryMessageId(null); // Reset message ID
          }}
          dealId={dealId}
          existingDelivery={existingDelivery}
          rescheduleDeliveryId={rescheduleDeliveryId} // Pass delivery ID for seller reschedule request
          rescheduleDeliveryMessageId={rescheduleDeliveryMessageId} // Pass message ID for updating status
          userType={userType} // Pass user type to determine if it's seller reschedule
          onSellerRescheduleRequest={(success) => {
            // Update message status after seller reschedule request
            if (success && dealId && rescheduleDeliveryMessageId) {
              updateMessage(dealId, rescheduleDeliveryMessageId, { status: 'pending_admin_approval' });
              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          }}
          onDeliveryScheduled={(formattedDate, selectedTime, deliveryId) => {
            if (dealId) {
              const existingMessages = getMessages(dealId);
              const isReschedule = !!existingDelivery;
              
              if (isReschedule) {
                // For reschedule, update old message status to 'rescheduled' and add new message
                const oldBuyerMessage = existingMessages.find(msg => 
                  msg.type === 'delivery_scheduled' &&
                  msg.deliveryId === deliveryId &&
                  msg.sender === 'buyer' &&
                  msg.status !== 'confirmed' &&
                  msg.status !== 'cancelled'
                );
                
                if (oldBuyerMessage) {
                  // Update old message status to 'rescheduled'
                  updateMessage(dealId, oldBuyerMessage.id, { status: 'rescheduled' });
                }
                
                // Add new rescheduled message for buyer (similar to test drive reschedule)
                addBuyerDeliveryRescheduledMessage(dealId, formattedDate, selectedTime, deliveryId, 'pending');
                setMessageKey(prev => prev + 1);
                forceUpdate();
                
                // Seller will get message via socket from backend
              } else {
                // For new schedule, add messages for both buyer and seller
                addBuyerDeliveryScheduledMessage(dealId, formattedDate, selectedTime, deliveryId, 'pending');
                // Seller will get message via socket from backend
              }
              
              // Refresh delivery info after scheduling
              const fetchDeliveryInfo = async () => {
                try {
                  const data = await requestManager.request(
                    `${API_BASE_URL}/api/car-deals/${dealId}`,
                    { method: 'GET' },
                    { cacheTTL: 5 * 1000, skipCache: true } // Skip cache for user-initiated actions
                  );
                  if (data && data.success && data.data?.Delivery && data.data.Delivery.length > 0) {
                    setExistingDelivery(data.data.Delivery[0]);
                  }
                } catch (error) {
                  console.error('Error fetching delivery info:', error);
                }
              };
              fetchDeliveryInfo();
              setMessageKey(prev => prev + 1);
              forceUpdate();
            }
          }}
        />
      )}

      {/* Cancel Request Modal */}
      <CancelRequestModal
        show={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelRequestData({ type: null, id: null, messageId: null });
        }}
        title={cancelRequestData.type === 'delivery' ? 'Request Delivery Cancellation' : 'Request Test Drive Cancellation'}
        onSubmit={async (reason) => {
          try {
            let result;
            if (cancelRequestData.type === 'delivery') {
              result = await DeliveryService.cancelDelivery(cancelRequestData.id, reason || '');
              if (result.success) {
                // Backend will send socket notification with "waiting for admin approval" message
                // Only dealer (seller) will see this message, not buyer
                setToast({ show: true, message: result.message || 'Cancel request submitted successfully. Waiting for admin approval.', type: 'success' });
                setShowCancelModal(false);
                setCancelRequestData({ type: null, id: null, messageId: null });
                // Refresh messages to show the new cancel request message from socket
                setMessageKey(prev => prev + 1);
                forceUpdate();
              } else {
                setToast({ show: true, message: result.message || 'Failed to request cancellation', type: 'error' });
              }
            } else if (cancelRequestData.type === 'testDrive') {
              result = await TestDriveService.cancelTestDrive(cancelRequestData.id, reason || '');
              if (result.success) {
                setMessageKey(prev => prev + 1);
                forceUpdate();
                setToast({ show: true, message: 'Cancel request submitted successfully. Waiting for admin approval.', type: 'success' });
                setShowCancelModal(false);
                setCancelRequestData({ type: null, id: null, messageId: null });
              } else {
                setToast({ show: true, message: result.error || 'Failed to request cancellation', type: 'error' });
              }
            }
          } catch (error) {
            console.error('Error requesting cancellation:', error);
            setToast({ show: true, message: 'An error occurred while requesting cancellation', type: 'error' });
          }
        }}
        isSubmitting={false}
      />

      {/* Toast Notification */}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
        duration={5000}
      />
    </div>
  );
}

// Schedule Test Drive Modal Component
const ScheduleTestDriveModal = ({ show, handleClose, carId, dealId, rescheduleTestDriveId = null, userType = 'buyer', onTestDriveScheduled }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Generate dates for the next 10 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      dates.push({
        value: date.toISOString().split('T')[0],
        label: `${dayName} ${day} ${month}`,
        date: date
      });
    }
    return dates;
  };

  // Time slots
  const timeSlots = [
    "11:00 AM To 12:00 PM",
    "12:00 PM To 1:00 PM",
    "1:00 PM To 2:00 PM",
    "2:00 PM To 3:00 PM",
    "3:00 PM To 4:00 PM",
    "4:00 PM To 5:00 PM",
    "5:00 PM To 6:00 PM",
    "6:00 PM To 7:00 PM",
    "7:00 PM To 8:00 PM",
    "8:00 PM To 9:00 PM",
    "9:00 PM To 10:00 PM",
    "10:00 PM To 11:00 PM"
  ];

  const dates = generateDates();
  const hubAddress = "H-161, Sector 63 Rd, H Block, Sector 63, Noida, Uttar Pradesh 201309";

  const handleBookTestDrive = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    if (!carId) {
      setError("Car information not found. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Parse time slot to get start time
      // Format: "11:00 AM To 12:00 PM" -> extract "11:00 AM"
      const timeMatch = selectedTime.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (!timeMatch) {
        setError("Invalid time format");
        setLoading(false);
        return;
      }

      const timeStr = timeMatch[1];
      const [time, period] = timeStr.split(/\s+/);
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours, 10);
      
      if (period.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      // Create scheduled date/time as IST (treat selected date/time as IST)
      // Parse the date string (YYYY-MM-DD) to get year, month, day
      const [yearStr, monthStr, dayStr] = selectedDate.split('-').map(Number);
      
      // IST is UTC+5:30, so we need to create a UTC date that represents the IST time
      // User selected time is in IST, so we convert IST to UTC by subtracting 5:30 hours
      // Create a date string in ISO format representing the IST time, then convert to UTC
      const istDateString = `${yearStr}-${String(monthStr).padStart(2, '0')}-${String(dayStr).padStart(2, '0')}T${String(hour24).padStart(2, '0')}:${String(parseInt(minutes, 10)).padStart(2, '0')}:00+05:30`;
      const istDate = new Date(istDateString);
      const scheduledDate = new Date(istDate.getTime());

      // Format date for display using the selected date directly (not the Date object methods)
      // This ensures we show the date the user actually selected
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      // Create a temporary date in IST to get the correct day name
      const tempDate = new Date(Date.UTC(yearStr, monthStr - 1, dayStr));
      const dayName = daysOfWeek[tempDate.getUTCDay()];
      const month = String(monthStr).padStart(2, '0');
      const day = String(dayStr).padStart(2, '0');
      const year = yearStr;
      const formattedDate = `${dayName}, ${day}/${month}/${year}`;

      let result;
      
      // If rescheduleTestDriveId is provided, call reschedule API
      if (rescheduleTestDriveId) {
        // For seller/dealer, reason is optional but can be provided
        // Backend will handle seller reschedule requests (needs admin approval)
        const isSeller = userType === 'seller' || userType === 'dealer';
        result = await TestDriveService.rescheduleTestDrive(
          rescheduleTestDriveId,
          scheduledDate.toISOString(),
          isSeller ? `Reschedule requested by ${isSeller ? 'seller' : 'dealer'}` : null
        );
      } else {
        // Otherwise, schedule a new test drive
        // IMPORTANT: carDealId is required for test drives to show in dealer dashboard
        // If dealId is not available, log a warning
        if (!dealId) {
          console.warn('⚠️ [Test Drive] Warning: dealId is not available when scheduling test drive. Test drive may not appear in dealer dashboard.');
        }
        
        result = await TestDriveService.scheduleTestDrive({
          carId: parseInt(carId, 10),
          carDealId: dealId ? parseInt(dealId, 10) : null,
          scheduledAt: scheduledDate.toISOString(),
          notes: `Test drive scheduled for ${formattedDate} at ${selectedTime}`
        });
      }

      if (result.success) {
        if (rescheduleTestDriveId) {
          // Check if this is a seller reschedule request (needs admin approval)
          const isSeller = userType === 'seller' || userType === 'dealer';
          const isWaitingForApproval = result.message && result.message.includes('Waiting for admin approval');
          
          if (isSeller && isWaitingForApproval) {
            // Show success message for seller reschedule request
            setSuccessMessage('Reschedule request submitted successfully. Waiting for admin approval.');
            // Keep modal open to show the message, then close after 2 seconds
            setTimeout(() => {
              handleClose();
              setSuccessMessage('');
              // Reset form
              setSelectedDate(null);
              setSelectedTime(null);
            }, 2000);
          } else {
            // For buyer reschedule, close modal immediately - backend will send socket notification
            handleClose();
            // Reset form
            setSelectedDate(null);
            setSelectedTime(null);
          }
        } else {
          // For new schedule, extract testDriveId and notify parent
          const testDriveId = result.data?.testDrive?.id || result.data?.id || null;
          
          // Notify parent component to add messages
          if (onTestDriveScheduled && dealId) {
            onTestDriveScheduled(formattedDate, selectedTime, testDriveId);
          }
          
          handleClose();
          // Reset form
          setSelectedDate(null);
          setSelectedTime(null);
        }
      } else {
        setError(result.error || (rescheduleTestDriveId ? 'Failed to reschedule test drive. Please try again.' : 'Failed to schedule test drive. Please try again.'));
      }
    } catch (err) {
      console.error('Error scheduling test drive:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="schedule-test-drive-modal"
    >
      <Modal.Body className="p-4 position-relative">
        <Button
          variant="link"
          className="position-absolute top-0 end-0 m-2 text-dark p-2"
          onClick={handleClose}
          style={{ zIndex: 10 }}
        >
          <FaTimes size={20} />
          <span className="visually-hidden">Close</span>
        </Button>

        <h5 className="mb-3 fw-bold text-dark text-start" style={{ color: '#1a237e' }}>
          {rescheduleTestDriveId ? 'Reschedule test drive at Carosa hub' : 'Test drive at Carosa hub'}
        </h5>

        {/* Location Section */}
        <div className="d-flex align-items-start mb-3">
          <FaMapMarkerAlt size={16} className="text-primary me-2 mt-1" style={{ color: '#1976d2' }} />
          <p className="text-danger mb-0 fSize-4 fw-medium">{hubAddress}</p>
        </div>

        <hr className="my-4" />

        {/* Date Selection */}
        <div className="mb-4">
          <h6 className="fw-semibold text-dark text-start mb-3 fSize-4">Select Date</h6>
          <div className="d-flex flex-wrap gap-2">
            {dates.map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? "primary" : "outline-secondary"}
                className={`date-btn ${selectedDate === date.value ? 'selected-date' : ''}`}
                onClick={() => setSelectedDate(date.value)}
                style={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: selectedDate === date.value ? '600' : '500',
                  backgroundColor: selectedDate === date.value ? '#1a237e' : 'white',
                  color: selectedDate === date.value ? 'white' : '#666',
                  border: selectedDate === date.value ? 'none' : '1px solid #ddd',
                  minWidth: '100px'
                }}
              >
                {date.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <h6 className="fw-semibold text-dark text-start mb-3 fSize-4">Select Time</h6>
          <div className="d-flex flex-wrap gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "success" : "outline-secondary"}
                className={`time-btn ${selectedTime === time ? 'selected-time' : ''}`}
                onClick={() => setSelectedTime(time)}
                style={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: selectedTime === time ? '600' : '500',
                  backgroundColor: selectedTime === time ? '#4caf50' : 'white',
                  color: selectedTime === time ? 'white' : '#666',
                  border: selectedTime === time ? 'none' : '1px solid #ddd',
                  minWidth: '140px'
                }}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger fSize-3 mb-3" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success fSize-3 mb-3" role="alert">
            {successMessage}
          </div>
        )}

        {/* Book Test Drive Button */}
        <Button
          variant="primary"
          className="w-100 fw-semibold py-3"
          onClick={handleBookTestDrive}
          disabled={loading}
          style={{
            backgroundColor: '#1a237e',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            padding: '12px'
          }}
        >
          {loading ? (rescheduleTestDriveId ? 'Rescheduling...' : 'Scheduling...') : (rescheduleTestDriveId ? 'Reschedule Test Drive' : 'Book Test Drive')}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

// Schedule Delivery Modal Component
const ScheduleDeliveryModal = ({ show, handleClose, dealId, existingDelivery = null, rescheduleDeliveryId = null, rescheduleDeliveryMessageId = null, userType = 'buyer', onDeliveryScheduled, onSellerRescheduleRequest }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState(''); // Reason for reschedule (seller only)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const isReschedule = !!existingDelivery || !!rescheduleDeliveryId;
  const isSellerReschedule = !!rescheduleDeliveryId && userType === 'seller';

  // Generate dates for the next 10 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = daysOfWeek[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      dates.push({
        value: date.toISOString().split('T')[0],
        label: `${dayName} ${day} ${month}`,
        date: date
      });
    }
    return dates;
  };

  // Time slots
  const timeSlots = [
    "11:00 AM To 12:00 PM",
    "12:00 PM To 1:00 PM",
    "1:00 PM To 2:00 PM",
    "2:00 PM To 3:00 PM",
    "3:00 PM To 4:00 PM",
    "4:00 PM To 5:00 PM",
    "5:00 PM To 6:00 PM",
    "6:00 PM To 7:00 PM",
    "7:00 PM To 8:00 PM",
    "8:00 PM To 9:00 PM",
    "9:00 PM To 10:00 PM",
    "10:00 PM To 11:00 PM"
  ];

  const dates = generateDates();
  const hubAddress = "H-161, Sector 63 Rd, H Block, Sector 63, Noida, Uttar Pradesh 201309";

  const handleScheduleDelivery = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    if (!dealId) {
      setError("Deal information not found. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Parse time slot to get start time
      const timeMatch = selectedTime.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
      if (!timeMatch) {
        setError("Invalid time format");
        setLoading(false);
        return;
      }

      const timeStr = timeMatch[1];
      const [time, period] = timeStr.split(/\s+/);
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours, 10);
      
      if (period.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }

      // Create scheduled date/time as IST (treat selected date/time as IST)
      // Parse the date string (YYYY-MM-DD) to get year, month, day
      const [yearStr, monthStr, dayStr] = selectedDate.split('-').map(Number);
      
      // IST is UTC+5:30, so we need to create a UTC date that represents the IST time
      // Create a date string in ISO format representing the IST time, then convert to UTC
      const istDateString = `${yearStr}-${String(monthStr).padStart(2, '0')}-${String(dayStr).padStart(2, '0')}T${String(hour24).padStart(2, '0')}:${String(parseInt(minutes, 10)).padStart(2, '0')}:00+05:30`;
      const istDate = new Date(istDateString);
      const scheduledDate = new Date(istDate.getTime());

      // Format date for display using the selected date directly (not the Date object methods)
      // This ensures we show the date the user actually selected
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      // Create a temporary date in IST to get the correct day name
      const tempDate = new Date(Date.UTC(yearStr, monthStr - 1, dayStr));
      const dayName = daysOfWeek[tempDate.getUTCDay()];
      const month = String(monthStr).padStart(2, '0');
      const day = String(dayStr).padStart(2, '0');
      const year = yearStr;
      const formattedDate = `${dayName}, ${day}/${month}/${year}`;

      let result;
      if (isSellerReschedule && rescheduleDeliveryId) {
        // Seller reschedule request - call reschedule API
        result = await DeliveryService.rescheduleDelivery(
          rescheduleDeliveryId,
          scheduledDate.toISOString(),
          reason || ''
        );
      } else {
        // Buyer scheduling or buyer reschedule - call schedule API
        result = await DeliveryService.scheduleDelivery(
          dealId,
          scheduledDate.toISOString()
        );
      }

      if (result.success) {
        if (isSellerReschedule) {
          setSuccessMessage(result.message || 'Reschedule request submitted successfully. Waiting for admin approval.');
          // Backend will send socket notification with "waiting for admin approval" message
          // Only dealer (seller) will see this message, not buyer
          if (onSellerRescheduleRequest) {
            onSellerRescheduleRequest(true);
          }
        } else {
          setSuccessMessage(isReschedule ? 'Delivery rescheduled successfully!' : 'Delivery scheduled successfully!');
        }
        
        if (onDeliveryScheduled && !isSellerReschedule) {
          // Pass deliveryId from the result (only for buyer scheduling)
          const deliveryId = result.data?.id || result.data?.delivery?.id || null;
          onDeliveryScheduled(formattedDate, selectedTime, deliveryId);
        }
        
        setTimeout(() => {
          handleClose();
          setSuccessMessage('');
          setSelectedDate(null);
          setSelectedTime(null);
          setReason('');
        }, 1500);
      } else {
        setError(result.message || `Failed to ${isReschedule ? 'reschedule' : 'schedule'} delivery`);
        if (isSellerReschedule && onSellerRescheduleRequest) {
          onSellerRescheduleRequest(false);
        }
      }
    } catch (error) {
      console.error('Error scheduling delivery:', error);
      setError('An error occurred while scheduling delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="schedule-delivery-modal"
    >
      <Modal.Body className="p-4 position-relative">
        <Button
          variant="link"
          className="position-absolute top-0 end-0 m-2 text-dark p-2"
          onClick={handleClose}
          style={{ zIndex: 10 }}
        >
          <FaTimes size={20} />
          <span className="visually-hidden">Close</span>
        </Button>

        <h5 className="mb-3 fw-bold text-dark text-start" style={{ color: '#1a237e' }}>
          {isReschedule ? 'Reschedule Delivery at Carosa hub' : 'Schedule Delivery at Carosa hub'}
        </h5>

        {/* Location Section */}
        <div className="d-flex align-items-start mb-3">
          <FaMapMarkerAlt size={16} className="text-primary me-2 mt-1" style={{ color: '#1976d2' }} />
          <p className="text-danger mb-0 fSize-4 fw-medium">{hubAddress}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Date Selection */}
        <div className="mb-3">
          <label className="form-label fw-semibold mb-2">Select Date</label>
          <div className="d-flex flex-wrap gap-2">
            {dates.map((date) => (
              <button
                key={date.value}
                type="button"
                className={`btn ${selectedDate === date.value ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setSelectedDate(date.value);
                  setError('');
                }}
                style={{
                  minWidth: '100px',
                  fontSize: '14px',
                  padding: '8px 12px'
                }}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-2">Select Time</label>
          <div className="d-flex flex-wrap gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                className={`btn ${selectedTime === time ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setSelectedTime(time);
                  setError('');
                }}
                style={{
                  minWidth: '150px',
                  fontSize: '14px',
                  padding: '8px 12px'
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Reason Field for Seller Reschedule Request */}
        {isSellerReschedule && (
          <div className="mb-4">
            <label className="form-label fw-semibold mb-2">
              Reason for Reschedule <span className="text-muted">(Optional)</span>
            </label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Please provide a reason for rescheduling (optional)"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              style={{
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
        )}

        {/* Schedule Delivery Button */}
        <Button
          variant="primary"
          className="w-100 fw-semibold py-3"
          onClick={handleScheduleDelivery}
          disabled={loading || (!selectedDate || !selectedTime)}
          style={{
            backgroundColor: '#1a237e',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            padding: '12px'
          }}
        >
          {loading 
            ? (isSellerReschedule ? 'Submitting Request...' : (isReschedule ? 'Rescheduling...' : 'Scheduling...')) 
            : (isSellerReschedule ? 'Request Reschedule' : (isReschedule ? 'Reschedule Delivery' : 'Schedule Delivery'))}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

