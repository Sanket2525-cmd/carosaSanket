"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelectedCar } from "@/store/selectedCar";
import Banner from "../comps/Banner";
import Link from "next/link";
import OfferNegotiation from "./OfferNegotiation";
import CarDetailsSection from "./CarDetailsSection";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { API_BASE_URL } from "@/config/environment";
import CarService from "@/services/carService";
import { useSearchParams } from "next/navigation";

export default function MakeBestOffer() {
  const { car, setCar } = useSelectedCar();
  const searchParams = useSearchParams();
  const carIdFromUrl = searchParams.get('carId');
  const [offerStatus, setOfferStatus] = useState("initial");
  const [offerAmount, setOfferAmount] = useState(null);
  const [dealId, setDealId] = useState(null);
  const [carData, setCarData] = useState(null);
  const [loadingCar, setLoadingCar] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const { getMessages } = useChatStore();

  // 🧩 Step 1: Get carData from URL carId, Zustand, or sessionStorage, and fetch if User is missing
  useEffect(() => {
    const loadCarData = async () => {
      let initialCarData = car;
      
      // First priority: Load from URL carId if provided
      if (carIdFromUrl && !initialCarData) {
        try {
          const numericCarId = parseInt(carIdFromUrl, 10);
          if (!isNaN(numericCarId)) {
            setLoadingCar(true);
            const response = await CarService.getCarById(numericCarId);
            if (response.success && response.data) {
              initialCarData = response.data;
              // Update selectedCar store
              setCar(initialCarData);
              // Update sessionStorage
              if (typeof window !== "undefined") {
                try {
                  sessionStorage.setItem("selectedCar", JSON.stringify(initialCarData));
                } catch {}
              }
            }
          }
        } catch (error) {
          console.error('Error fetching car from URL carId:', error);
        } finally {
          setLoadingCar(false);
        }
      }
      
      // Second priority: Load from sessionStorage
      if (!initialCarData && typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem("selectedCar");
          if (raw) initialCarData = JSON.parse(raw);
        } catch {}
      }

      // If carData doesn't have User relation, fetch it from API
      if (initialCarData?.id && !initialCarData?.User) {
        try {
          setLoadingCar(true);
          const response = await CarService.getCarById(initialCarData.id);
          if (response.success && response.data) {
            setCarData(response.data);
            // Update sessionStorage with fresh data
            if (typeof window !== "undefined") {
              try {
                sessionStorage.setItem("selectedCar", JSON.stringify(response.data));
              } catch {}
            }
          } else {
            setCarData(initialCarData);
          }
        } catch (error) {
          console.error('Error fetching car with User data:', error);
          setCarData(initialCarData);
        } finally {
          setLoadingCar(false);
        }
      } else {
        setCarData(initialCarData);
      }
    };

    loadCarData();
  }, [car, carIdFromUrl, setCar]);

  // Check if carData has User relation, if not it will be fetched in useEffect

  if (loadingCar) {
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

  if (!carData) {
    return (
      <>
        <Banner />
        <section className="py-5">
          <Container>
            <div className="text-center">
              <h4>No Car Selected</h4>
              <p className="text-muted">Please select a car to make an offer.</p>
              <Link href="/recentCar" className="btn btn-primary">
                Browse Cars
              </Link>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <Banner />
      <section className="">
        <Container>
          <Row className="g-4 my-4 p-2 bg-white">
            <Col lg={7}>
              <CarDetailsSection carData={carData} />
            </Col>

            <Col lg={5}>
              <OfferNegotiation
                userType={"buyer"}
                carData={carData}
                sellerData={(() => {
                  // Try to get seller name from carData.User
                  if (carData?.User?.name) {
                    return {
                      name: carData.User.name,
                      image: carData.User.profileImage || "/images/user1.png"
                    };
                  }
                  // If User is not populated, return null to use fallback
                  console.warn('MakeBestOffer: carData.User not available, seller name will show as "Seller"');
                  return null;
                })()}
                dealId={dealId}
                onOfferStatusChange={(s, a) => {
                  setOfferStatus(s);
                  setOfferAmount(a ?? null);
                }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
