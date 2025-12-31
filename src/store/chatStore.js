// Chat Store for Offer Negotiation Messages
// Persists chat messages using Zustand with localStorage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      chatMessages: {}, // { dealId: [messages] } - Each buyer-seller negotiation has unique dealId
      
      // ==================== MESSAGE MANAGEMENT ====================
      
      /**
       * Add a message to a specific deal's chat (prevents duplicates)
       * Uses dealId to ensure each buyer-seller negotiation thread is isolated
       */
      addMessage: (dealId, message) => {
        if (!dealId) {
          console.error('[ChatStore] Cannot add message: dealId is missing');
          return;
        }
        
        set((state) => {
          const existingMessages = state.chatMessages[dealId] || [];
          const messageId = message.id || `${message.type}-${message.amount}-${message.sender}-${Date.now()}`;
          
          // Check for duplicate messages (same type, amount, sender within 1 second)
          const isDuplicate = existingMessages.some(existingMsg => {
            const timeDiff = Math.abs(new Date(existingMsg.timestamp).getTime() - new Date(message.timestamp || Date.now()).getTime());
            return existingMsg.type === message.type &&
                   existingMsg.amount === message.amount &&
                   existingMsg.sender === message.sender &&
                   timeDiff < 1000; // Within 1 second
          });
          
          if (isDuplicate) {
            console.log('[ChatStore] Duplicate message prevented:', message);
            return state;
          }
          
          const newMessage = {
            ...message,
            id: messageId,
            timestamp: message.timestamp || new Date(),
          };
          
          const newMessages = [...existingMessages, newMessage];
          
          console.log('[ChatStore] Adding message:', { dealId, message: newMessage, totalMessages: newMessages.length });
          
          return {
            chatMessages: {
              ...state.chatMessages,
              [dealId]: newMessages
            }
          };
        });
      },

      /**
       * Get messages for a specific deal (sorted by timestamp)
       * Uses dealId to ensure messages are isolated per buyer-seller negotiation
       */
      getMessages: (dealId) => {
        if (dealId) {
          const messages = get().chatMessages[dealId] || [];
          // Sort by timestamp to ensure chronological order
          return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }
        // If no dealId provided, return all messages grouped by deal
        return get().chatMessages;
      },

      /**
       * Clear messages for a specific deal
       */
      clearMessages: (dealId) => {
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [dealId]: []
          }
        }));
      },

      /**
       * Update a specific message
       */
      updateMessage: (dealId, messageId, updates) => {
        set((state) => {
          const messages = state.chatMessages[dealId] || [];
          const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
          
          return {
            chatMessages: {
              ...state.chatMessages,
              [dealId]: updatedMessages
            }
          };
        });
      },

      /**
       * Add buyer's initial offer message
       * Buyer sees: "Offer sent: ₹X. Waiting for the seller to reply"
       */
      addBuyerOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'offer',
          amount,
          sender: 'buyer',
          timestamp: new Date(),
          status: 'waiting',
          message: `Offer sent: ₹${formatPrice(amount)} Lakh. Waiting for the seller to reply`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller receiving buyer's offer message
       * Seller sees: "You've received an offer of ₹X." (with Accept/Reject buttons)
       */
      addSellerReceivedOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'offer',
          amount,
          sender: 'buyer', // From buyer's perspective
          timestamp: new Date(),
          status: 'waiting',
          message: `You've received an offer of ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's rejection message (for buyer)
       * Buyer sees: "Seller rejected your ₹X offer. Want to make a counter?"
       */
      addBuyerRejectionMessage: (dealId, amount) => {
        if (!dealId) {
          console.error('❌ addBuyerRejectionMessage: dealId is required');
          return null;
        }
        const message = {
          id: Date.now() + Math.random(),
          type: 'rejection',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          message: `Seller rejected your ₹${formatPrice(amount)} Lakh offer. Want to make a counter?`,
          status: 'rejected'
        };
        
        console.log('📝 [chatStore] Adding buyer rejection message:', { dealId, amount, messageId: message.id });
        get().addMessage(dealId, message);
        const storeMessages = get().chatMessages[dealId] || [];
        console.log('📝 [chatStore] Message added. Total messages for dealId:', storeMessages.length, 'Message IDs:', storeMessages.map(m => m.id));
        return message;
      },

      /**
       * Add seller's rejection message (for seller)
       * Seller sees: "You rejected the offer of ₹X."
       */
      addSellerRejectionMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'rejection',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          message: `You rejected the offer of ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's acceptance message (for seller)
       * Seller sees: "You accepted the offer of ₹X."
       */
      addSellerAcceptanceMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'acceptance',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          message: `You accepted the offer of ₹${formatPrice(amount)} Lakh.`,
          status: 'accepted'
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller waiting message (when offer is accepted, waiting for buyer to pay)
       * Seller sees: "You have accepted the offer. Waiting for the buyer to book the car."
       */
      addSellerWaitingMessage: (dealId, amount, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'waiting',
          amount,
          sender: 'seller', // Set to 'seller' so it appears on the right (seller's own message)
          timestamp: new Date(),
          message: customMessage || `You have accepted the offer. Waiting for the buyer to book the car.`,
          status: 'waiting'
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add booking confirmed message (when buyer completes payment)
       * Seller sees: "Token received from buyer. Kindly keep the car on hold. Carosa will transfer the token amount to you with in 6–8 hours."
       */
      addBookingConfirmedMessage: (dealId, amount, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'booking_confirmed',
          amount,
          sender: 'seller', // Set to 'seller' so it appears on the right (seller's own message)
          timestamp: new Date(),
          message: customMessage || `Token received from buyer. Kindly keep the car on hold. Carosa will transfer the token amount to you with in 6–8 hours.`,
          status: 'confirmed'
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add acceptance message (for buyer when seller accepts buyer's offer)
       * Buyer sees: "Great news! Your offer is accepted—complete the booking now."
       */
      addBuyerAcceptanceMessage: (dealId, amount) => {
        if (!dealId) {
          console.error('❌ addBuyerAcceptanceMessage: dealId is required');
          return null;
        }
        const message = {
          id: Date.now() + Math.random(),
          type: 'acceptance',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          message: 'Great news! Your offer is accepted—complete the booking now.',
          status: 'accepted'
        };
        
        console.log('📝 [chatStore] Adding buyer acceptance message:', { dealId, amount, messageId: message.id });
        const result = get().addMessage(dealId, message);
        const storeMessages = get().chatMessages[dealId] || [];
        console.log('📝 [chatStore] Message added. Total messages for dealId:', storeMessages.length, 'Message IDs:', storeMessages.map(m => m.id));
        return message;
      },

      /**
       * Add buyer's acceptance of seller's counter offer message
       * Buyer sees: "You have accepted counter offer of seller"
       */
      addBuyerAcceptedCounterOfferMessage: (dealId, amount) => {
        if (!dealId) {
          console.error('❌ addBuyerAcceptedCounterOfferMessage: dealId is required');
          return null;
        }
        const message = {
          id: Date.now() + Math.random(),
          type: 'buyer_accepted_counter_offer',
          amount,
          sender: 'buyer',
          timestamp: new Date(),
          message: `You have accepted counter offer of seller`,
          status: 'accepted'
        };
        
        console.log('📝 [chatStore] Adding buyer accepted counter offer message:', { dealId, amount, messageId: message.id });
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's message when buyer accepts their counter offer
       * Seller sees: "Your counter offer accepted by buyer. Waiting for the buyer to book the car."
       */
      addSellerCounterOfferAcceptedMessage: (dealId, amount, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer_accepted_by_buyer',
          amount,
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: customMessage || `Your counter offer accepted by buyer. Waiting for the buyer to book the car.`,
          status: 'waiting'
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add buyer's counter offer message
       * Buyer sees: "Counter Offer sent: ₹X. Waiting for the seller to reply"
       */
      addBuyerCounterOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer',
          amount,
          sender: 'buyer',
          timestamp: new Date(),
          message: `Counter Offer sent: ₹${formatPrice(amount)} Lakh. Waiting for the seller to reply`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller receiving buyer's counter offer
       * Seller sees: "You've received an Counter offer of ₹X."
       */
      addSellerReceivedCounterOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer',
          amount,
          sender: 'buyer', // From buyer
          timestamp: new Date(),
          message: `You've received an Counter offer of ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's counter offer message
       * Seller sees: "Counter offer sent: ₹X. Waiting for the Buyer to reply."
       * Note: This message should NOT have status: 'waiting' to prevent showing accept/reject buttons to seller
       */
      addSellerCounterOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          status: 'sent', // Set to 'sent' (not 'waiting') so seller doesn't see accept/reject buttons
          message: `Counter offer sent: ₹${formatPrice(amount)} Lakh. Waiting for the Buyer to reply.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add buyer receiving seller's counter offer message
       * Buyer sees: "You've received a counter offer of ₹X."
       */
      addBuyerReceivedCounterOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer',
          amount,
          sender: 'seller', // From seller to buyer
          timestamp: new Date(),
          status: 'waiting', // Set status to 'waiting' so accept/reject buttons show
          message: `You've received a counter offer of ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's counter rejection + fresh offer (for buyer)
       * Buyer sees: "Counter offer rejected by seller—fresh offer: ₹X."
       */
      addSellerCounterRejectionWithOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_rejection_fresh_offer',
          amount,
          sender: 'seller',
          timestamp: new Date(),
          status: 'waiting', // Set status to 'waiting' so accept/reject buttons show
          message: `Counter offer rejected by seller—fresh offer: ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add buyer's counter rejection + fresh offer (for seller)
       * Seller sees: "Counter offer rejected by Buyer —fresh offer: ₹X."
       */
      addBuyerCounterRejectionWithOfferMessage: (dealId, amount) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_rejection_fresh_offer',
          amount,
          sender: 'buyer',
          timestamp: new Date(),
          message: `Counter offer rejected by Buyer —fresh offer: ₹${formatPrice(amount)} Lakh.`
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller's message when buyer rejects their counter offer
       * Seller sees: "Your counter offer of ₹X Lakh has been rejected by the buyer."
       */
      addSellerCounterOfferRejectedByBuyerMessage: (dealId, amount, customMessage = null) => {
        if (!dealId) {
          console.error('❌ addSellerCounterOfferRejectedByBuyerMessage: dealId is required');
          return null;
        }
        const message = {
          id: Date.now() + Math.random(),
          type: 'counter_offer_rejected_by_buyer',
          amount,
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: customMessage || `Your counter offer of ₹${formatPrice(amount)} Lakh has been rejected by the buyer.`,
          status: 'rejected'
        };
        
        console.log('📝 [chatStore] Adding seller counter offer rejected by buyer message:', { dealId, amount, messageId: message.id });
        get().addMessage(dealId, message);
        return message;
      },

      // Legacy methods for backward compatibility (now accept dealId instead of carId)
      addOfferMessage: (dealId, amount, isFromBuyer = true) => {
        if (isFromBuyer) {
          return get().addBuyerOfferMessage(dealId, amount);
        } else {
          return get().addSellerReceivedOfferMessage(dealId, amount);
        }
      },

      addRejectionMessage: (dealId, amount) => {
        return get().addBuyerRejectionMessage(dealId, amount);
      },

      addAcceptanceMessage: (dealId, amount) => {
        return get().addBuyerAcceptanceMessage(dealId, amount);
      },

      addCounterOfferMessage: (dealId, amount, isFromBuyer = true) => {
        if (isFromBuyer) {
          return get().addBuyerCounterOfferMessage(dealId, amount);
        } else {
          return get().addSellerCounterOfferMessage(dealId, amount);
        }
      },

      /**
       * Add buyer payment confirmation message (when buyer completes payment)
       * Buyer sees: "Congratulations! Booking amount ₹999 paid. Please schedule your delivery."
       */
      addBuyerPaymentConfirmationMessage: (dealId, amount, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'payment_confirmed',
          amount,
          sender: 'seller', // Set to 'seller' so it appears on the left (as a received/system message)
          timestamp: new Date(),
          message: customMessage || `Congratulations! Booking amount ₹${amount} paid. Please schedule your delivery.`,
          status: 'paid'
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add test drive scheduled message for buyer
       * Buyer sees: "Test drive scheduled for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM. Waiting for seller confirmation."
       */
      addBuyerTestDriveScheduledMessage: (dealId, scheduledDate, scheduledTime, testDriveId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_scheduled',
          sender: 'buyer',
          timestamp: new Date(),
          message: `Test drive scheduled for ${scheduledDate} at ${scheduledTime}. Waiting for seller confirmation.`,
          status: status,
          testDriveId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add test drive scheduled message for seller
       * Seller sees: "Buyer scheduled a test drive for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM."
       */
      addSellerTestDriveScheduledMessage: (dealId, scheduledDate, scheduledTime, testDriveId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_scheduled',
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: `Buyer scheduled a test drive for ${scheduledDate} at ${scheduledTime}.`,
          status: status,
          testDriveId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add test drive confirmed message for buyer
       * Buyer sees: "Your test drive is confirmed: Sunday, 12/12/2025 — 03:00 PM To 04:00 PM."
       */
      addBuyerTestDriveConfirmedMessage: (dealId, formattedDateTime, testDriveId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_confirmed',
          sender: 'seller', // From seller, so appears on left
          timestamp: new Date(),
          message: `Your test drive is confirmed: ${formattedDateTime}.`,
          status: 'confirmed',
          testDriveId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      addBuyerTestDriveCancelledMessage: (dealId, formattedDateTime, reason = null, testDriveId = null, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_cancelled',
          sender: 'system', // System message
          timestamp: new Date(),
          message: customMessage || `Your test drive is cancelled: ${formattedDateTime}`,
          status: 'cancelled',
          testDriveId,
          formattedDateTime,
          reason,
        };
        get().addMessage(dealId, message);
        return message;
      },

      addSellerTestDriveCancelledMessage: (dealId, formattedDateTime, reason = null, testDriveId = null, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_cancelled',
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: customMessage || `Test drive is cancelled: ${formattedDateTime}`,
          status: 'cancelled',
          testDriveId,
          formattedDateTime,
          reason,
        };
        get().addMessage(dealId, message);
        return message;
      },

      addBuyerTestDriveRescheduledMessage: (dealId, formattedDateTime, reason = null, testDriveId = null, status = 'pending', customMessage = null) => {
        // When status is 'pending_confirmation', it means admin approved seller's reschedule request
        // The message should appear as coming from seller/system, not from buyer
        // This allows the buyer to see the Confirm/Cancel buttons
        const sender = status === 'pending_confirmation' ? 'seller' : 'buyer';
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_rescheduled',
          sender: sender, // 'seller' for pending_confirmation (admin approved), 'buyer' for buyer-initiated reschedules
          timestamp: new Date(),
          message: customMessage || `Test drive rescheduled for ${formattedDateTime}. Waiting for seller confirmation.`,
          status: status,
          testDriveId,
          formattedDateTime,
          reason,
        };
        get().addMessage(dealId, message);
        return message;
      },

      addSellerTestDriveRescheduledMessage: (dealId, formattedDateTime, reason = null, testDriveId = null, status = 'pending', customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_rescheduled',
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: customMessage || `Test drive rescheduled for ${formattedDateTime}.`,
          status: status,
          testDriveId,
          formattedDateTime,
          reason,
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add seller reschedule request message (waiting for admin approval)
       * Seller sees: "Reschedule request submitted. Waiting for admin approval."
       */
      addSellerRescheduleRequestMessage: (dealId, formattedDateTime, reason = null, testDriveId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_reschedule_requested',
          sender: 'seller', // From seller, so appears on right
          timestamp: new Date(),
          message: `Reschedule request submitted. Waiting for admin approval.`,
          status: 'pending_admin_approval',
          testDriveId,
          formattedDateTime,
          reason,
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add test drive completed message for buyer
       * Buyer sees: "Test drive completed successfully. Would you like to purchase?"
       */
      addBuyerTestDriveCompletedMessage: (dealId, testDriveId = null, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_completed',
          sender: 'system', // System message
          timestamp: new Date(),
          message: customMessage || 'Test drive completed successfully. Would you like to purchase?',
          status: 'completed',
          testDriveId,
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add test drive completed message for seller
       * Seller sees: "Test drive completed. Waiting for the buyer to pay the token amount."
       */
      addSellerTestDriveCompletedMessage: (dealId, testDriveId = null, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'test_drive_completed',
          sender: 'system', // System message
          timestamp: new Date(),
          message: customMessage || 'Test drive completed. Waiting for the buyer to pay the token amount.',
          status: 'completed',
          testDriveId,
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add buyer declined purchase message for buyer
       * Buyer sees: "Thanks for sharing. We'll suggest closer matches next."
       */
      addBuyerDeclinedPurchaseMessage: (dealId, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'buyer_declined_purchase',
          sender: 'system', // System message
          timestamp: new Date(),
          message: customMessage || "Thanks for sharing. We'll suggest closer matches next.",
          status: 'declined',
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add buyer declined purchase message for seller
       * Seller sees: "Sorry to hear that. The buyer is looking for a better option."
       */
      addSellerBuyerDeclinedMessage: (dealId, customMessage = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'buyer_declined_purchase_seller',
          sender: 'system', // System message
          timestamp: new Date(),
          message: customMessage || "Sorry to hear that. The buyer is looking for a better option.",
          status: 'declined',
        };
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery scheduled message for buyer
       * Buyer sees: "Delivery scheduled for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM. Waiting for seller confirmation."
       */
      addBuyerDeliveryScheduledMessage: (dealId, scheduledDate, scheduledTime, deliveryId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_scheduled',
          sender: 'buyer',
          timestamp: new Date(),
          message: `Delivery scheduled for ${scheduledDate} at ${scheduledTime}. Waiting for seller confirmation.`,
          status: status,
          deliveryId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery scheduled message for seller
       * Seller sees: "Buyer scheduled a Delivery for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM."
       */
      addSellerDeliveryScheduledMessage: (dealId, scheduledDate, scheduledTime, deliveryId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_scheduled',
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: `Buyer scheduled a Delivery for ${scheduledDate} at ${scheduledTime}.`,
          status: status,
          deliveryId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery rescheduled message for seller
       * Seller sees: "Buyer rescheduled delivery for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM."
       */
      addSellerDeliveryRescheduledMessage: (dealId, scheduledDate, scheduledTime, deliveryId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_scheduled', // Same type so buttons show
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: `Buyer rescheduled delivery for ${scheduledDate} at ${scheduledTime}.`,
          status: status,
          deliveryId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery rescheduled message for buyer
       * Buyer sees: "Delivery rescheduled for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM. Waiting for seller confirmation."
       */
      addBuyerDeliveryRescheduledMessage: (dealId, scheduledDate, scheduledTime, deliveryId = null, status = 'pending') => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_scheduled', // Same type so buttons show
          sender: 'buyer', // From buyer, so appears on right (green)
          timestamp: new Date(),
          message: `Delivery rescheduled for ${scheduledDate} at ${scheduledTime}. Waiting for seller confirmation.`,
          status: status,
          deliveryId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery confirmed message for buyer
       * Buyer sees: "Your delivery is confirmed: Sunday, 12/12/2025 — 03:00 PM To 04:00 PM."
       */
      addBuyerDeliveryConfirmedMessage: (dealId, formattedDateTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_confirmed',
          sender: 'seller', // From seller, so appears on left
          timestamp: new Date(),
          message: `Your delivery is confirmed: ${formattedDateTime}.`,
          status: 'confirmed',
          deliveryId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery confirmed message for seller (shows the scheduled delivery info)
       * Seller sees: "Buyer scheduled delivery for Sunday, 12/12/2025 at 03:00 PM To 04:00 PM."
       */
      addSellerDeliveryConfirmedMessage: (dealId, scheduledDate, scheduledTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_confirmed',
          sender: 'buyer', // From buyer's perspective, so appears on left
          timestamp: new Date(),
          message: `Buyer scheduled delivery for ${scheduledDate} at ${scheduledTime}.`,
          status: 'confirmed',
          deliveryId,
          scheduledDate,
          scheduledTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery cancel request message for seller (dealer)
       * Seller sees: "Cancel request submitted successfully. Waiting for admin approval."
       */
      addSellerDeliveryCancelRequestMessage: (dealId, message, deliveryId = null) => {
        const msg = {
          id: Date.now() + Math.random(),
          type: 'delivery_cancel_requested',
          sender: 'seller', // From seller, so appears on right (green)
          timestamp: new Date(),
          message: message || 'Cancel request submitted successfully. Waiting for admin approval.',
          status: 'pending_admin_approval',
          deliveryId
        };
        
        get().addMessage(dealId, msg);
        return msg;
      },

      /**
       * Add delivery reschedule request message for seller (dealer)
       * Seller sees: "Reschedule request submitted successfully. Waiting for admin approval."
       */
      addSellerDeliveryRescheduleRequestMessage: (dealId, message, deliveryId = null) => {
        const msg = {
          id: Date.now() + Math.random(),
          type: 'delivery_reschedule_requested',
          sender: 'seller', // From seller, so appears on right (green)
          timestamp: new Date(),
          message: message || 'Reschedule request submitted successfully. Waiting for admin approval.',
          status: 'pending_admin_approval',
          deliveryId
        };
        
        get().addMessage(dealId, msg);
        return msg;
      },

      /**
       * Add delivery cancelled message for buyer
       * Buyer sees: "Your delivery is cancelled: Sunday, 12/12/2025 — 03:00 PM To 04:00 PM"
       */
      addBuyerDeliveryCancelledMessage: (dealId, formattedDateTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_cancelled',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: `Your delivery is cancelled: ${formattedDateTime}.`,
          status: 'cancelled',
          deliveryId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery cancelled message for seller
       * Seller sees: "Delivery is cancelled: Sunday, 12/12/2025 — 03:00 PM To 04:00 PM"
       */
      addSellerDeliveryCancelledMessage: (dealId, formattedDateTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_cancelled',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: `Delivery is cancelled: ${formattedDateTime}.`,
          status: 'cancelled',
          deliveryId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery cancel rejected message for seller
       * Seller sees: "Your cancel request for delivery on Sunday, 12/12/2025 — 03:00 PM To 04:00 PM has been rejected."
       */
      addSellerDeliveryCancelRejectedMessage: (dealId, message, deliveryId = null) => {
        const msg = {
          id: Date.now() + Math.random(),
          type: 'delivery_cancel_rejected',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: message || 'Your cancel request has been rejected.',
          status: 'rejected',
          deliveryId
        };
        
        get().addMessage(dealId, msg);
        return msg;
      },

      /**
       * Add delivery rescheduled message for buyer
       * Buyer sees: "Your delivery scheduled time is changed to Sunday, 12/12/2025 — 03:00 PM To 04:00 PM."
       */
      addBuyerDeliveryRescheduledMessage: (dealId, formattedDateTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_rescheduled',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: `Your delivery scheduled time is changed to ${formattedDateTime}.`,
          status: 'confirmed',
          deliveryId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery rescheduled message for seller
       * Seller sees: "Delivery rescheduled for Sunday, 12/12/2025 — 03:00 PM To 04:00 PM."
       */
      addSellerDeliveryRescheduledMessage: (dealId, formattedDateTime, deliveryId = null) => {
        const message = {
          id: Date.now() + Math.random(),
          type: 'delivery_rescheduled',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: `Delivery rescheduled for ${formattedDateTime}.`,
          status: 'confirmed',
          deliveryId,
          formattedDateTime
        };
        
        get().addMessage(dealId, message);
        return message;
      },

      /**
       * Add delivery reschedule rejected message for seller
       * Seller sees: "Your reschedule request for delivery on Sunday, 12/12/2025 — 03:00 PM To 04:00 PM has been rejected."
       */
      addSellerDeliveryRescheduleRejectedMessage: (dealId, message, deliveryId = null) => {
        const msg = {
          id: Date.now() + Math.random(),
          type: 'delivery_reschedule_rejected',
          sender: 'system', // System message, appears on left
          timestamp: new Date(),
          message: message || 'Your reschedule request has been rejected.',
          status: 'rejected',
          deliveryId
        };
        
        get().addMessage(dealId, msg);
        return msg;
      },

      // ==================== UTILITIES ====================
      
      /**
       * Format price for display
       */
      formatPrice: (amount) => {
        return (amount / 100000).toFixed(2).replace(/\.00$/, '');
      },

      /**
       * Get chat statistics for a deal
       */
      getChatStats: (dealId) => {
        const messages = get().getMessages(dealId);
        const offers = messages.filter(msg => msg.type === 'offer');
        const counterOffers = messages.filter(msg => msg.type === 'counter_offer');
        
        return {
          totalMessages: messages.length,
          totalOffers: offers.length,
          totalCounterOffers: counterOffers.length,
          lastMessage: messages[messages.length - 1]
        };
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        chatMessages: state.chatMessages 
      }),
    }
  )
);

// Helper function for price formatting
const formatPrice = (amount) => {
  return (amount / 100000).toFixed(2).replace(/\.00$/, '');
};

export default useChatStore;
