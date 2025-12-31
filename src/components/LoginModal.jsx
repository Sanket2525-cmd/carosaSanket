"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaGoogle, FaApple, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import useAuthStore from '@/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get CSRF token
const getCsrfToken = () => {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let cookie of cookieArray) {
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
};

const fetchCsrfToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/keep-alive`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            await response.json(); // This sets the CSRF cookie
        }
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
    }
};

const Step1_Phone = ({ setStep, setContactInfo, setVerificationTokenId }) => {
        const [phoneNumber, setPhoneNumber] = useState('');
        const [loading, setLoading] = useState(false);

        const handlePhoneRegister = async () => {
            if (phoneNumber.length === 10) {
                setLoading(true);
                try {
                    // API Call: Register new user with phone
                    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': getCsrfToken() // Get current CSRF token
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            mobile: phoneNumber
                        })
                    });

                    const data = await response.json();
                    
                    if (data.success) {
                        // Store verification token ID for Step 2
                        setVerificationTokenId(data.data.token);
                        setContactInfo({ type: 'phone', value: phoneNumber });
                        setStep(2); // Go to OTP verification
                    } else {
                        alert(data.message || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    alert('Network error. Please try again.');
                } finally {
                    setLoading(false);
                }
            } else {
                alert('Please enter a 10-digit phone number.');
            }
        };

    return (
            <div className="px-4 py-0 login-step-container">
                <h5 className="mb-4 fw-semibold fSize-5">Phone number</h5>
                
                <Form.Control
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="mb-4 p-2 fSize-3 custom-input"
                    value={phoneNumber}
                    onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(input);
                    }}
                    maxLength={10}
                    disabled={loading}
                />
                
                <Button
                    variant="primary"
                    className="w-100 fw-semibold fSize-3 custom-otp-btn"
                    onClick={handlePhoneRegister}
                    disabled={phoneNumber.length !== 10 || loading}
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </Button>

                <div className="text-center my-3 text-muted fSize-2">Or</div>
                
                <Button 
                    variant="light" 
                    className="w-100 mb-3 fSize-3 border text-dark custom-social-btn" 
                    onClick={() => setStep(3)}
                >
                    <FaEnvelope className="me-2 text-dark" size={16} /> 
                    Continue with Email
                </Button>

            </div>
        );
    };


// Step 2: OTP Verification (UPDATED)
const Step2_OTP = ({ setStep, contactInfo, handleClose, verificationTokenId, setUser }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length === 6) {
            setLoading(true);
            try {
                // API Call: Verify OTP and complete login
                const response = await fetch(`${API_BASE_URL}/api/auth/login/${verificationTokenId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': getCsrfToken()
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        code: otp
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    // Access token is automatically set in httpOnly cookie by backend
                    // User data is returned in response
                    setUser(data.data.user);
                    
                    handleClose();
                } else {
                    alert(data.message || 'Invalid OTP');
                }
            } catch (error) {
                console.error('Verification error:', error);
                alert('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please enter a 6-digit OTP.');
        }
    };

    return (
        <div className="px-4 py-0 text-center login-step-container">
            <h5 className="mb-3 fw-semibold fSize-5">Verify OTP</h5>
            <p className="text-muted fSize-3">
                We sent a 4-digit code to <span className="fw-semibold">{contactInfo.value}</span>.
            </p>

            <Form.Control
                type="text"
                placeholder="****"
                className="text-center mb-3 fs-4 p-2 custom-input"
                value={otp}
                onChange={(e) => {
                    const input = e.target.value.replace(/\D/g, '');
                    setOtp(input);
                }}
                maxLength={4}
                disabled={loading}
            />

            <Button 
                variant="primary" 
                className="w-100 fw-semibold fSize-3 custom-otp-btn" 
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
            >
                {loading ? 'Verifying...' : 'Verify'}
            </Button>
            
            <Button variant="link" className="mt-3 fSize-3 p-0" onClick={() => setStep(1)}>
                Change Number
            </Button>
        </div>
    );
};


// --- Step 3: Email Input Screen ---
const Step3_EmailInput = ({ setStep, setContactInfo, setUser, handleClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    console.log('🔍 Step3_EmailInput rendered - Email:', email, 'Password:', password);

    const handleEmailLogin = async () => {
        console.log('🚀 Login button clicked');
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address.');
            return;
        }
        
        if (!password) {
            setError('Please enter your password.');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            console.log('🔑 Attempting direct login...');
            // Use auth store for direct login
            const { directLogin } = useAuthStore.getState();
            const result = await directLogin(email, password);
            
            console.log('📝 Login result:', result);
            
            if (result.success) {
                setUser(result.user);
                handleClose();
                // Redirect to dealer dashboard
                window.location.href = '/';
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Email login error:', error);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h5 className="mb-4 fw-bold">Login with Email</h5>
            <p className="text-muted mb-3">Enter your dealer credentials</p>
            <div className="alert alert-success mb-3">✅ DEBUG: Step3_EmailInput component loaded successfully!</div>

            {error && (
                <div className="alert alert-danger mb-3" role="alert">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Email Address</label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email Address"
                    className="fSize-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    className="fSize-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <div className="text-muted small mt-1">DEBUG: Password value: "{password}"</div>
            </div>

            <Button
                variant="primary"
                className="w-100 fw-semibold fSize-3"
                onClick={handleEmailLogin}
                disabled={!email.includes('@') || !password || loading}
            >
                {loading ? 'Logging In...' : 'Login'}
            </Button>

            <Button 
                variant="link" 
                className="mt-3 fSize-3" 
                onClick={() => setStep(1)}
                disabled={loading}
            >
                Back to Phone Login
            </Button>
        </div>
    );
};

const LoginModal = ({ show, handleClose }) => {
    const [step, setStep] = useState(1); 
    const [contactInfo, setContactInfo] = useState({ type: 'phone', value: '' });
    const [verificationTokenId, setVerificationTokenId] = useState('');
    const [user, setUser] = useState(null);

    // Fetch CSRF token when modal opens
    useEffect(() => {
        if (show) {
            fetchCsrfToken();
        }
    }, [show]);

    const handleExit = () => {
        setStep(1);
        setContactInfo({ type: 'phone', value: '' });
        setVerificationTokenId('');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step1_Phone 
                        setStep={setStep} 
                        setContactInfo={setContactInfo}
                        setVerificationTokenId={setVerificationTokenId}
                    />
                );
            case 2:
                return (
                    <Step2_OTP 
                        setStep={setStep} 
                        contactInfo={contactInfo} 
                        handleClose={handleClose}
                        verificationTokenId={verificationTokenId}
                        setUser={setUser}
                    />
                );
            case 3:
                return <Step3_EmailInput setStep={setStep} setContactInfo={setContactInfo} setUser={setUser} handleClose={handleClose} />;
            default:
                return <Step1_Phone setStep={setStep} setContactInfo={setContactInfo} />;
        }
    };

    return (
        <Modal show={show} onHide={handleClose} onExited={handleExit} centered size="xl" >
            <Modal.Body className="p-0 rounded-5 overflow-hidden">
                <Row className="g-0">
                    <Col md={6} className="d-none d-md-block login-modal-image-col">
                        <div className="position-relative w-100 h-100">
                            <Image 
                                src="/images/netaVcar.png"
                                alt="Carosa Login" 
                                fill 
                                style={{ objectFit: 'cover' }} 
                                priority
                            />
                        </div>
                    </Col>
                    
                    <Col xs={12} md={6} className="login-modal-form-col">
                        <div className="position-relative h-100">
                            <img src="/images/finalCarosalogo.png" alt="" />
                            <div className="p-4 pb-0">
                                <h6 className="fw-bold text-dark mb-0">Sign in to your Account</h6>
                            </div>

                            <Button 
                                variant="link" 
                                className="position-absolute top-0 end-0 m-2 text-dark p-2" 
                                onClick={handleClose}
                                style={{ zIndex: 10 }}
                            >
                                <FaTimes size={20} />
                            </Button>

                            <div className="form-content-area">
                                {renderStep()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
