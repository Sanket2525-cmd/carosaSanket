"use client";

import RecentCarDetails from "./details/RecentCarDetails";

// props lo aur aage pass karo
export default function CarViewClient({ car, carIndex }) {
  console.log('=== CarViewClient Debug ===');
  console.log('Car received:', car);
  console.log('Car index:', carIndex);
  console.log('Car name:', car?.name);
  console.log('Car make:', car?.make);
  console.log('Car model:', car?.model);
  console.log('=== End CarViewClient Debug ===');
  
  if (!car) {
    return (
      <div className="container py-5">
        <h2 className="text-white">No car data received</h2>
        <p className="text-white-50">The car data was not passed correctly.</p>
      </div>
    );
  }
  
  return <RecentCarDetails car={car} carIndex={carIndex} />;
}
