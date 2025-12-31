// components/BookKnowModal.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { BsCheckCircleFill } from 'react-icons/bs';
import Image from 'next/image';
import Link from "next/link";
import LeadService from "@/services/leadService";
import PaymentService from "@/services/paymentService";
import { normalizeBrand } from "@/utils/brandNormalizer";
import { BOOKING_AMOUNT, API_BASE_URL } from "@/config/environment";
import { useRouter } from "next/navigation";
import requestManager from "@/utils/requestManager";
import useAuthStore from "@/store/authStore";
import LoginModal from "@/components/LoginModal";

// Helper function to check if image URL is external
const isExternalUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
};
// import likeImg from './assets/img/thums.png'


// Default car details (fallback if no car data provided)
const defaultCarDetails = {
    name: "Neta V 2023",
    sellingPrice: "₹ 1,98,370",
    bookingAmount: `₹ ${BOOKING_AMOUNT}`,
    image: "/images/suzuki.png"
};

const Step1_GreatChoice = ({ setStep, handleClose, carDetails, dealId, carId, car, onPaymentSuccess, onShowCongratulations }) => {
    // Use provided carDetails or fallback to default
    const carInfo = carDetails || defaultCarDetails;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Helper function to get listing price from car data
    const getListingPrice = (carData) => {
        if (!carData) return null;
        
        // Try multiple sources for listing price
        const customFields = typeof carData.customFields === 'string' 
            ? (() => {
                try {
                    return JSON.parse(carData.customFields);
                } catch {
                    return {};
                }
            })()
            : (carData.customFields || {});
        
        const listingPrice = customFields.listingPrice !== undefined ? customFields.listingPrice :
                            customFields.listing_price !== undefined ? customFields.listing_price :
                            carData.listingPrice !== undefined ? carData.listingPrice :
                            carData.listing_price !== undefined ? carData.listing_price :
                            null;
        
        if (listingPrice === null || listingPrice === undefined) return null;
        
        // Convert to number if string
        if (typeof listingPrice === 'string') {
            const cleaned = listingPrice.replace(/[₹,\s]/g, '');
            const num = parseFloat(cleaned);
            return isNaN(num) || num <= 0 ? null : Math.round(num);
        }
        
        if (typeof listingPrice === 'number' && listingPrice > 0) {
            return Math.round(listingPrice);
        }
        
        return null;
    };

    // Helper function to create or get existing deal
    const createOrGetDeal = async (carId, carData) => {
        if (!carId) {
            throw new Error('Car ID is required');
        }

        const numericCarId = typeof carId === 'string' ? parseInt(carId, 10) : Number(carId);
        if (isNaN(numericCarId) || numericCarId <= 0) {
            throw new Error('Invalid car ID');
        }

        try {
            // First, try to find existing deal for this car and user (with caching and deduplication)
            const data = await requestManager.request(
                `${API_BASE_URL}/api/car-deals/owned/`,
                { method: 'GET' },
                { cacheTTL: 10 * 1000 } // Cache for 10 seconds
            );

            if (data && data.data) {
                // Find deal for this car with PENDING or ACTIVE status
                const existingDeal = data.data.find(
                    deal => deal.carId === numericCarId && (deal.status === 'PENDING' || deal.status === 'ACTIVE')
                );
                
                if (existingDeal) {
                    // Check if deal has negotiations - if not, create one with listing price
                    const hasNegotiations = existingDeal.DealNegotiation && Array.isArray(existingDeal.DealNegotiation) && existingDeal.DealNegotiation.length > 0;
                    
                    if (!hasNegotiations) {
                        const listingPrice = getListingPrice(carData);
                        if (listingPrice) {
                            try {
                                await requestManager.request(
                                    `${API_BASE_URL}/api/deal-negotiations/${existingDeal.id}`,
                                    {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            carDealId: existingDeal.id,
                                            amount: listingPrice,
                                            message: 'Agreed to buy at listing price'
                                        })
                                    },
                                    { skipCache: true, skipDeduplication: false }
                                );
                            } catch (negError) {
                                console.error('Error creating negotiation with listing price:', negError);
                                // Don't fail if negotiation creation fails
                            }
                        }
                    }
                    return existingDeal.id;
                }
            }

            // If no existing deal, create a new one
            const createData = await requestManager.request(
                `${API_BASE_URL}/api/car-deals`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        carId: numericCarId,
                        status: 'PENDING'
                    })
                },
                { skipCache: true, skipDeduplication: false }
            );

            if (!createData || !createData.success) {
                throw new Error(createData?.message || 'Failed to create deal');
            }

            const newDealId = createData.data?.id;
            
            // After creating deal, create a negotiation with listing price (direct Book Now flow)
            const listingPrice = getListingPrice(carData);
            if (listingPrice && newDealId) {
                try {
                    await requestManager.request(
                        `${API_BASE_URL}/api/deal-negotiations/${newDealId}`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                carDealId: newDealId,
                                amount: listingPrice,
                                message: 'Agreed to buy at listing price'
                            })
                        },
                        { skipCache: true, skipDeduplication: false }
                    );
                } catch (negError) {
                    console.error('Error creating negotiation with listing price:', negError);
                    // Don't fail if negotiation creation fails - deal is already created
                }
            }
            
            return newDealId;
        } catch (error) {
            console.error('Error creating/getting deal:', error);
            // Handle 429 errors gracefully
            if (error.message && error.message.includes('Rate limit')) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            throw error;
        }
    };

    const handlePayNow = async () => {
        let finalDealId = dealId;

        // If dealId is not provided, create or get deal using carId
        if (!finalDealId && carId) {
            try {
                setLoading(true);
                setError('');
                finalDealId = await createOrGetDeal(carId, car);
            } catch (dealError) {
                setError(dealError.message || 'Failed to create deal. Please try again.');
                setLoading(false);
                return;
            }
        }

        if (!finalDealId) {
            setError('Deal information not found. Please refresh and try again.');
            console.error('Payment error: dealId is missing', { dealId, carId });
            setLoading(false);
            return;
        }

        // Validate dealId is a number
        const numericDealId = typeof finalDealId === 'string' ? parseInt(finalDealId, 10) : Number(finalDealId);
        if (isNaN(numericDealId) || numericDealId <= 0) {
            setError('Invalid deal information. Please refresh and try again.');
            console.error('Payment error: Invalid dealId', { dealId: finalDealId, numericDealId });
            setLoading(false);
            return;
        }

        // Booking amount from environment variable with fallback to 999
        const bookingAmount = BOOKING_AMOUNT;

        try {
            setError('');

            // Create payment order with actual booking amount
            // Use TESTDRIVE type for initial booking payment
            const paymentResult = await PaymentService.createPaymentOrder(bookingAmount, numericDealId, 'TESTDRIVE');

            if (!paymentResult.success) {
                setError(paymentResult.message || 'Failed to create payment order');
                setLoading(false);
                return;
            }

            // Reset loading before opening Razorpay (so user can interact)
            setLoading(false);

            // Initialize Razorpay checkout
            await PaymentService.initializeRazorpayCheckout(
                paymentResult.data,
                // On success
                (response) => {
                    console.log('Payment successful:', response);
                    // Call callback to refresh deal status if provided
                    if (onPaymentSuccess) {
                        onPaymentSuccess();
                    }
                    // Show congratulations modal for 3 seconds
                    if (onShowCongratulations) {
                        onShowCongratulations();
                    }
                    // Close modal
                    handleClose();
                    // Save car data to sessionStorage and redirect to buyer negotiation chat page
                    if (carId && car) {
                        const numericCarId = typeof carId === 'string' ? parseInt(carId, 10) : Number(carId);
                        try {
                            // Save car data to sessionStorage so MakeBestOffer can load it
                            if (typeof window !== 'undefined') {
                                sessionStorage.setItem('selectedCar', JSON.stringify(car));
                            }
                        } catch (e) {
                            console.error('Error saving car to sessionStorage:', e);
                        }
                        // Redirect to buyer negotiation chat page to schedule test drive
                        router.push(`/make-offer?carId=${numericCarId}`);
                    }
                },
                // On failure
                (error) => {
                    console.error('Payment failed:', error);
                    const errorMessage = error?.error?.description || 
                                       error?.message || 
                                       (typeof error === 'string' ? error : 'Payment failed. Please try again.');
                    setError(errorMessage);
                }
            );
        } catch (error) {
            console.error('Payment error:', error);
            const errorMessage = error?.message || 
                               error?.error?.description || 
                               (typeof error === 'string' ? error : 'An error occurred during payment. Please try again.');
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="p-2  p-md-4  great-choice-container">
            <img src="/assets/img/thums.png" className='md-mb-3 mb-1' width="20px"/>
            <h5 className="mb-md-2 mb-1 fw-bold text-success fset_2">Great Choice!</h5>

            {/* Car Details Card */}
            <div className="car-booking-summary p-md-3 p-1 my-1">
                <Row className=" gx-0">
                    <Col xs={12} md={4} >
                        <div className="position-relative" style={{ height: '100%', minHeight: '120px', width: '100%' }}>
                            {isExternalUrl(car.image) ? (
                                // Use regular img tag for external URLs
                                <img
                                    src={car.image}
                                    alt={car.name}
                                    className="w-100 "
                                    style={{ objectFit: 'cover', height: "150px" }}
                                    onError={(e) => {
                                        e.target.src = '/images/default-car.jpg';
                                    }}
                                />
                            ) : (
                                // Use Next.js Image for local images
                                <Image
                                    src={car.image}
                                    alt={car.name}
                                    fill
                                    style={{ objectFit: 'cover', borderRadius: '4px', height: "150px" }}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    onError={(e) => {
                                        e.target.src = '/images/default-car.jpg';
                                    }}
                                />
                            )}
                        </div>
                    </Col>
                    <Col xs={12} md={8} className="">
                        <div className="bg-dark  h-100 p-md-3 p-2">
                            <h6 className="mb-1 fw-semibold text-white text-start fSize-6 pb-4 fset_m">{car.name}</h6>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-white  fSize-5 fset_2">Selling Price:</span>
                                <span className="fw-bold text-white fSize-5 fset_2">{car.sellingPrice}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-white  fSize-5 fset_2">Booking Amount:</span>
                                <span className="fw-bold text-white fSize-5 fset_2">{car.bookingAmount}</span>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>

            <p className="fSize-5 fset_2 mb-md-2 mb-1 fw-medium" style={{ color: '#27AE60' }}>
                You’re just one step away! Complete the booking to lock this car for yourself.
            </p>

            <h6 className="fw-bold text-dark mb-md-2 mb-1  text-center fSize-6 fset_m">Why pay a booking amount?</h6>

            <Row className="justify-content-center mb-md-3 mb-1 text-muted pt-md-2 pt-1">
                <Col xs={4} className='text-center'>
                    <span className='d-block mb-1 ' style={{ fontSize: '24px' }}><img src="/assets/img/cars1.png" /></span>
                    <p className='text-danger fw-semibold fSize-3 fs12_s'> Car reserved instantly</p>
                </Col>
                <Col xs={4} className='text-center'>
                    <span className='d-block mb-1 ' style={{ fontSize: '24px' }}><img src="/assets/img/cards.png" /></span>
                    <p className='text-danger fw-semibold fSize-3 fs12_s'> Fully refundable on cancellation</p>
                </Col>
                <Col xs={4} className='text-center'>
                    <span className='d-block mb-1 ' style={{ fontSize: '24px' }}><img src="/assets/img/hand.png" /></span>
                    <p className='text-danger fw-semibold fSize-3 text-wrap font-italic fs12_s'>Amount adjustable in final deal price</p>
                </Col>
            </Row>

            <p className="fSize-4 fset_2 fw-semibold text-dark text-start mb-3 pb-3">
                <span><img src="/assets/img/process.png" alt="" className='me-2 fSize-4 ' /></span> By proceeding, you agree to our <Link href="/privacy-policy" className="fw-semibold">Privacy Policy </Link>& <Link href="/terms-conditions" className="fw-semibold">Term & Conditions.</Link>
            </p>
            {error && (
                <div className="alert alert-danger fSize-3 mb-3" role="alert">
                    {error}
                </div>
            )}
            <div className='callMeBackBtn pb-md-0 pb-2'>
                <Button
                    className="w-100 custom-otp-btn btn btn-primary"
                    onClick={handlePayNow}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : <>Pay Now <strike> ₹ 999 </strike> <span className='ms-2'>₹ 0</span>🔒</>}
                </Button>
            </div>

        </div>
    );
};

// --- Step 2: Full Name & Number with OTP Verification ---
const Step2_Callback = ({ setStep, handleClose, carDetails, car, dealId, carId }) => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [tokenId, setTokenId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!showOTP) {
            // Initial form submission - validate name and phone
            if (!fullName.trim()) {
                setError('Please enter your full name');
                return;
            }

            if (!phoneNumber.trim()) {
                setError('Please enter your mobile number');
                return;
            }

            // Validate phone number format (should be exactly 10 digits)
            const cleanedPhone = phoneNumber.trim().replace(/\D/g, '');
            if (cleanedPhone.length !== 10) {
                setError('Please enter a valid 10-digit mobile number');
                return;
            }

            setLoading(true);

            try {
                // Extract car information
                const carTitle = car?.model ? String(car.model).trim() : null;
                const carVariant = car?.make && car?.model
                    ? `${normalizeBrand(String(car.make).trim())} ${String(car.model).trim()}`.trim()
                    : null;

                let carId = null;
                if (car?.id || car?._id) {
                    const rawId = car.id || car._id;
                    const numId = typeof rawId === 'string' ? parseInt(rawId, 10) : Number(rawId);
                    if (!isNaN(numId) && numId > 0 && Number.isInteger(numId)) {
                        carId = numId;
                    }
                }

                let city = null;
                if (car?.customFields?.location) {
                    const cityStr = String(car.customFields.location).trim();
                    city = cityStr || null;
                } else if (car?.location) {
                    const cityStr = String(car.location).trim();
                    city = cityStr || null;
                }

                const result = await LeadService.initiateLead({
                    fullName: fullName.trim(),
                    phoneNumber: cleanedPhone,
                    city: city,
                    carTitle: carTitle,
                    carVariant: carVariant,
                    carId: carId,
                    source: 'BOOKING'
                });

                if (result.success) {
                    setTokenId(result.data.token);
                    setShowOTP(true);
                } else {
                    setError(result.message || 'Failed to send OTP. Please try again.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            // OTP verification
            if (!otp.trim()) {
                setError('Please enter OTP');
                return;
            }

            if (!/^\d{4,6}$/.test(otp.trim())) {
                setError('Please enter a valid OTP');
                return;
            }

            if (!tokenId) {
                setError('Session expired. Please start again.');
                return;
            }

            setLoading(true);

            try {
                const result = await LeadService.verifyLead(tokenId, otp.trim());

                if (result.success) {
                    // OTP verified - move to Great Choice step (Pay Now screen)
                    setStep(2);
                    setError('');
                } else {
                    setError(result.message || 'Invalid OTP. Please try again.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditPhone = () => {
        setShowOTP(false);
        setOtp('');
        setTokenId(null);
        setError('');
    };

    return (
        <div className="p-4 callback-container text-start">
            <Button
                variant="link"
                className="position-absolute top-0 end-0 m-2 text-dark p-2"
                onClick={handleClose}
                style={{ zIndex: 10 }}
            >
                <FaTimes size={20} />
                <span className="visually-hidden">Close</span>
            </Button>

            {showOTP ? (
                <>
                    <h5 className="mb-4 fw-semibold text_green">Enter OTP</h5>
                    <div className="mb-3">
                        <p className="fSize-3 fw-normal text-dark mb-2">
                            Code sent to <strong>+91-{phoneNumber}</strong>{' '}
                            <button
                                type="button"
                                className="btn btn-link p-0 text-primary fSize-3"
                                onClick={handleEditPhone}
                            >
                                Edit
                            </button>
                        </p>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className='fSize-3 fw-semibold text-dark pb-1'>
                                OTP*
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                className="p-2 fSize-3 "
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                maxLength={6}
                                disabled={loading}
                                required
                            />
                        </Form.Group>
                        {error && (
                            <div className="alert alert-danger fSize-3 mb-3" role="alert">
                                {error}
                            </div>
                        )}
                        <div className='callMeBackBtn'>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-100 custom-otp-btn btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Submit'}
                            </Button>
                        </div>
                    </Form>
                </>
            ) : (
                <>
                    <h5 className="mb-4 fw-semibold text_green">Please provide your name & phone number</h5>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className='fSize-3 fw-semibold text-dark'>
                                Full Name* <span className="text-muted fw-normal fSize-2 pb-1">(don't worry we will not spam you:)</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Full Name"
                                className="p-2 fSize-3 custom-input form-control"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className='fSize-3 fw-semibold text-dark'>
                                Mobile Number* <span className="text-muted fw-normal fSize-2 pb-1">(don't worry we will not spam you:)</span>
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter Mobile Number"
                                    className="p-2 fSize-3 custom-input form-control"
                                    maxLength={10}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                    disabled={loading}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        {error && (
                            <div className="alert alert-danger fSize-3 mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <div className='callMeBackBtn'>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-100 custom-otp-btn btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Submit'}
                            </Button>
                        </div>

                    </Form>
                </>
            )}
        </div>
    );
};


// --- Schedule Test Drive Modal Component ---
const ScheduleTestDriveModal = ({ show, handleClose }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

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

    const handleBookTestDrive = () => {
        if (!selectedDate || !selectedTime) {
            alert("Please select both date and time");
            return;
        }
        // TODO: Handle booking API call
        alert(`Test drive booked for ${selectedDate} at ${selectedTime}`);
        handleClose();
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
                    Test drive at Carosa hub
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

                {/* Book Test Drive Button */}
                <Button
                    variant="primary"
                    className="w-100 fw-semibold py-3"
                    onClick={handleBookTestDrive}
                    style={{
                        backgroundColor: '#1a237e',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        padding: '12px'
                    }}
                >
                    Book Test Drive
                </Button>
            </Modal.Body>
        </Modal>
    );
};

// --- Step 3: Congratulations! (Screenshot - 2025-10-12T081132.683.png) ---
// This remains Step 3 in the new flow
const Step3_Success = ({ handleClose }) => {
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    return (
        <>
            <div className="p-4 text-center success-container">
                <div className="mb-3 d-inline-block">
                    {/* ⚠️ Use actual emoji/image for the celebratory visual */}
                    <span style={{ fontSize: '40px' }}>🎉</span>
                    <span style={{ fontSize: '40px' }}>🥳</span>
                </div>
                <h5 className="mb-4 fw-bold text-green2">Congratulations!</h5>
                <p className="fSize-4 mb-4 fw-medium text-dark px-3">
                    <span className="fw-bold d-block mb-2">Your details have been submitted successfully.</span>
                    Our support team will contact you soon with further details.
                </p>
                <hr />

                {/* <Button
                    variant="success"
                    className="w-100 fw-semibold fSize-3 py-3 custom-schedule-btn"
                    onClick={() => setShowScheduleModal(true)}
                >
                    Schedule Test Drive
                </Button> */}
                <Link href="" className="w-100 btn btn-primary custom-book-btn fw-semibold fSize-3 py-3 custom-schedule-btn">
                    Call Now
                </Link>

            </div>

            <ScheduleTestDriveModal
                show={showScheduleModal}
                handleClose={() => setShowScheduleModal(false)}
            />
        </>
    );
};

// --- Step 4: Login/Sign Up (rrr88.jpg) ---
// This step is removed from the primary flow, but kept here for reference if needed.
const Step4_Login = () => null; // Removed from flow

// --- Main Modal Component ---
const BookKnowModal = ({ show, handleClose, carDetails, car, dealId, carId, onPaymentSuccess, onShowCongratulations }) => {
    // Authentication state
    const { isAuthenticated, user } = useAuthStore();
    
    // State for login modal
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [shouldShowPayment, setShouldShowPayment] = useState(false);

    // When modal opens, check authentication
    useEffect(() => {
        if (show) {
            if (isAuthenticated && user) {
                // User is logged in - show payment directly
                setShowLoginModal(false);
                setShouldShowPayment(true);
            } else {
                // User is not logged in - show login modal
                setShowLoginModal(true);
                setShouldShowPayment(false);
            }
        } else {
            // Modal closed - reset states
            setShowLoginModal(false);
            setShouldShowPayment(false);
        }
    }, [show, isAuthenticated, user]);

    // Watch for authentication changes (e.g., after login)
    useEffect(() => {
        if (show && isAuthenticated && user && showLoginModal) {
            // User just logged in - close login modal and show payment
            setShowLoginModal(false);
            setShouldShowPayment(true);
        }
    }, [isAuthenticated, user, show, showLoginModal]);

    // Reset state when modal is closed (after animation)
    const handleExit = () => {
        setShouldShowPayment(false);
        setShowLoginModal(false);
    };

    // Handle login modal close
    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
        // If user didn't log in, close the booking modal too
        if (!isAuthenticated) {
            handleClose();
        }
    };

    const renderStep = () => {
        return <Step1_GreatChoice setStep={() => {}} handleClose={handleClose} carDetails={carDetails} dealId={dealId} carId={carId} car={car} onPaymentSuccess={onPaymentSuccess} onShowCongratulations={onShowCongratulations} />;
    };

    // modalSize is now always 'lg' for payment screen
    const modalSize = "lg";

    return (
        <>
            {/* Login Modal - shown when user is not authenticated */}
            <LoginModal
                show={showLoginModal && show && !isAuthenticated}
                handleClose={handleCloseLoginModal}
            />

            {/* Booking Modal - shown when authenticated */}
            <Modal
                show={show && shouldShowPayment && isAuthenticated}
                onHide={handleClose}
                onExited={handleExit}
                centered
                size={modalSize}
                dialogClassName={`custom-booking-modal custom-booking-modal-${modalSize}`}
            >
                <Modal.Body className={`p-0 rounded-3 overflow-hidden bg-white text-center`}>
                    {/* Close button for payment step */}
                    <div className="position-relative">
                        <Button
                            variant="link"
                            className="position-absolute top-0 end-0 m-2 text-dark p-2"
                            onClick={handleClose}
                            style={{ zIndex: 10 }}
                        >
                            <FaTimes size={20} />
                            <span className="visually-hidden">Close</span>
                        </Button>
                        {renderStep()}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default BookKnowModal;