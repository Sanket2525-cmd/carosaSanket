import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CarListCard from "@/components/viewCarsRecent/CarListCard";
import CarListing from "@/components/viewCarsRecent/carsListing/CarListing";


export default function(){
    return(
        <MainLayout>
            <Suspense fallback={<div className="container py-5"><p className="text-white">Loading...</p></div>}>
                <CarListing />
            </Suspense>
        </MainLayout>
    )
}