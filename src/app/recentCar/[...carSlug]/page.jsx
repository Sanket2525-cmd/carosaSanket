// app/recentCar/[...carSlug]/page.jsx
import MainLayout from "@/components/layout/MainLayout";
import CarViewClient from "@/components/viewCarsRecent/view/CarViewClient";
import CarService from "@/services/carService";
import { safeParseCustomFields } from "@/utils/jsonUtils";
import { normalizeBrand } from "@/utils/brandNormalizer";

// Helper function to extract year from various formats
function extractYear(yearValue) {
  if (!yearValue) return null;
  
  // If it's a number, return it
  if (typeof yearValue === 'number') {
    return yearValue;
  }
  
  const yearStr = String(yearValue);
  
  // Extract year from "Month, YYYY" format (e.g., "April, 2016")
  const monthYearMatch = yearStr.match(/\b(19|20)\d{2}\b/);
  if (monthYearMatch) {
    return parseInt(monthYearMatch[0], 10);
  }
  
  // Extract year from "YYYY-MM" format (e.g., "2016-04")
  const dateMatch = yearStr.match(/^(\d{4})/);
  if (dateMatch) {
    return parseInt(dateMatch[1], 10);
  }
  
  // If it's just a 4-digit number string
  if (/^\d{4}$/.test(yearStr)) {
    return parseInt(yearStr, 10);
  }
  
  return null;
}

// Helper function to format kmDriven with commas
function formatKmDriven(kmValue) {
  if (!kmValue) return '0';
  const kmNum = typeof kmValue === 'string' 
    ? parseInt(kmValue.replace(/,/g, ''), 10) 
    : parseInt(kmValue, 10);
  if (isNaN(kmNum)) return '0';
  return kmNum.toLocaleString('en-IN');
}

// Generate dynamic metadata based on car data
export async function generateMetadata({ params }) {
  try {
    // Await params as required by Next.js 15+
    const resolvedParams = await params;
    const carSlugArray = Array.isArray(resolvedParams.carSlug) ? resolvedParams.carSlug : [resolvedParams.carSlug];
    const idPart = carSlugArray[0] || "";
    const idStr = idPart.split("-")[0];
    const carId = Number(idStr);

    // Validate car ID
    if (!Number.isInteger(carId) || carId <= 0) {
      return {
        title: "Car Details - CAROSA",
        description: "Car details page",
      };
    }

    // Fetch car data
    const response = await CarService.getCarById(carId);
    
    if (!response.success || !response.data) {
      return {
        title: "Car Details - CAROSA",
        description: "Car details page",
      };
    }

    const car = response.data;
    const customFields = safeParseCustomFields(car);

    // Extract car details
    const year = extractYear(customFields.year || customFields.regYear || customFields.registrationYear || car.year);
    const brand = normalizeBrand(car.make) || 'Car';
    const model = car.model || 'Model';
    const variant = customFields.variant || '';
    const transmission = customFields.transmission || customFields.transmission_type || car.transmission || 'Manual';
    const location = customFields.location || 'Delhi';
    const kmDriven = formatKmDriven(customFields.kmDriven || customFields.km || car.kmDriven || car.km || '0');
    const fuelType = customFields.fuelType || customFields.fuel || customFields.fuel_type || car.fuelType || car.fuel || 'Petrol';

    // Build title: "Used 2016 Maruti Ciaz VXI+ Manual in Delhi | 89,193 Kms - CAROSA"
    const variantPart = variant ? ` ${variant}` : '';
    const title = year 
      ? `Used ${year} ${brand} ${model} ${transmission} in ${location} | ${kmDriven} Kms - CAROSA`
      : `Used ${brand} ${model} ${transmission} in ${location} | ${kmDriven} Kms - CAROSA`;

    // Build description: "Explore the 2016 Maruti Ciaz VXI+ with 89,193 Kms at CAROSA Delhi. Petrol, smooth Manual transmission. Verified, 300+ checks, 30-day return, easy financing."
    const description = year
      ? `Explore the ${year} ${brand} ${model} with ${kmDriven} Kms at CAROSA ${location}. ${fuelType}, smooth ${transmission} transmission. Verified, 300+ checks, 30-day return, easy financing.`
      : `Explore the ${brand} ${model} with ${kmDriven} Kms at CAROSA ${location}. ${fuelType}, smooth ${transmission} transmission. Verified, 300+ checks, 30-day return, easy financing.`;

    // Get car image URL for OG tags - prioritize interior images, then first image
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.carosa.in';
    let firstImage = null;
    
    if (car.CarImages && car.CarImages.length > 0) {
      // Check if first image is interior, otherwise find first interior image
      const firstImageIsInterior = car.CarImages[0].category && 
        car.CarImages[0].category.toUpperCase() === 'INTERIOR';
      
      let selectedImage;
      if (firstImageIsInterior) {
        // Use first image if it's interior
        selectedImage = car.CarImages[0];
      } else {
        // Try to find first interior image
        const interiorImage = car.CarImages.find(img => 
          img.category && img.category.toUpperCase() === 'INTERIOR'
        );
        // Use interior image if found, otherwise use first image
        selectedImage = interiorImage || car.CarImages[0];
      }
      
      // Ensure URL is absolute
      let imageUrl = selectedImage.url;
      if (imageUrl) {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          // Already absolute URL
          firstImage = imageUrl;
        } else {
          // Make it absolute by combining with API base URL
          // Remove trailing slash from apiBaseUrl and leading slash from imageUrl to avoid double slashes
          const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
          const imgPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
          firstImage = `${baseUrl}${imgPath}`;
        }
      }
    }

    // Get site URL for OG tags
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://carosa.in');
    
    // Construct current page URL
    const carSlug = carSlugArray.join('/');
    const pageUrl = `${siteUrl}/recentCar/${carSlug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: 'CAROSA',
        images: firstImage ? [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: `${year ? year + ' ' : ''}${brand} ${model}`,
            type: 'image/jpeg',
          }
        ] : [],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: firstImage ? [firstImage] : [],
      },
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Car Details - CAROSA",
      description: "Car details page",
    };
  }
}

export default async function CarViewPage({ params }) {
  // Await params as required by Next.js 15+
  const resolvedParams = await params;
  const carSlugArray = Array.isArray(resolvedParams.carSlug) ? resolvedParams.carSlug : [resolvedParams.carSlug];
  // The first segment should be the car ID
  const idPart = carSlugArray[0] || "";
  // Extract numeric ID (handle cases where ID might be at start of slug)
  const idStr = idPart.split("-")[0];
  const carId = Number(idStr);

  // Validate car ID
  if (!Number.isInteger(carId) || carId <= 0) {
    return (
      <MainLayout>
        <div className="container py-5">
          <h2 className="text-white">Invalid car ID</h2>
          <p className="text-white-50">
            Please go back and select another vehicle.
          </p>
        </div>
      </MainLayout>
    );
  }

  try {
    // Fetch car data from API
    const response = await CarService.getCarById(carId);
    
    if (!response.success || !response.data) {
      console.log('Car not found - response:', response);
      
      return (
        <MainLayout>
          <div className="container py-5">
            <h2 className="text-white">Car not found</h2>
            <p className="text-white-50">
              The car you're looking for doesn't exist or has been removed.
            </p>
            <p className="text-white-50">
              Please go back and select another vehicle.
            </p>
          </div>
        </MainLayout>
      );
    }

    const car = response.data;

    return (
      <MainLayout>
        {/* PASS THE DYNAMIC DATA AS PROPS */}
        <CarViewClient car={car} carIndex={carId} />
      </MainLayout>
    );
  } catch (error) {
    console.error('Error fetching car details:', error);
    return (
      <MainLayout>
        <div className="container py-5">
          <h2 className="text-white">Error loading car details</h2>
          <p className="text-white-50">
            There was an error loading the car details. Please try again later.
          </p>
          <p className="text-white-50">
            Error: {error.message}
          </p>
        </div>
      </MainLayout>
    );
  }
}
