import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { useFormDataStore } from "../../../../store/formDataStore";

function AdditionalFeatures({ backTo7, goStep9 }) {

  const { formData: details, updateField } = useFormDataStore();

  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    const existingFeatures = details.additionalFeatures || [];
    return existingFeatures;
  });

  // 🔍 Search state
  const [searchFeature, setSearchFeature] = useState("");
  // Generate car summary text
  const getCarSummary = () => {
          const rawYear = details.year || details.mfgYear || "2025";
  let formattedYear;

  if (/^\d{4}-\d{2}$/.test(rawYear)) {
    const [y, m] = rawYear.split("-");
    const date = new Date(y, m - 1);
    formattedYear = date
      .toLocaleString("en-US", { month: "long", year: "numeric" })
      .replace(" ", " "); // → "May, 2014"
  } else {
    formattedYear = rawYear.toString();
  }
    const year = details.year || details.mfgYear || "2025";
    const brand = details.brand || "";
    const model = details.model || "";
    const variant = details.variant || "";
    const fuel = details.fuel || "Petrol";
    const transmission = details.transmission || "Manual";
    const color = details.color || "White";
    const owner = details.owner === 1 ? "1st" : details.owner === 2 ? "2nd" : details.owner === 3 ? "3rd" : `${details.owner}th`;
    const kms = details.km || "45,000";

    // Only include variant if it's different from model (to avoid duplication)
    const variantPart = (variant && variant.trim() && variant.trim().toLowerCase() !== model.trim().toLowerCase()) 
      ? ` ${variant}` 
      : "";

    return `${formattedYear} ${brand} ${model}${variantPart} ${fuel} ${transmission}, ${color}, ${owner}, ${kms} Kms`;
  };

  // Calculate progress percentage for transparency gradient
  const progressPercentage = (8 / 9) * 100; // Step 8 of 9 = 88.89%

  // Comprehensive additional features list - all items from add-ons.csv, sorted alphabetically
  // Combined and deduplicated from lines 1-153
  const allFeaturesFromCSV = [
    "ABS with EBD",
    "Air purifier / ionizer",
    "Airbags (Front, Side & Curtain)",
    "Alloy wheel spacers",
    "Alloy wheels / wheel covers",
    "Alloy Wheels",
    "Ambient Cabin Lighting",
    "Ambient lighting kit",
    "Amplifier",
    "Android Auto / Apple CarPlay",
    "Armrests",
    "Auto Headlamps",
    "Automatic / CVT / DCT Transmission",
    "Automatic Climate Control",
    "Battery voltage monitor",
    "Bike rack",
    "Blind spot mirrors",
    "Blind Spot Monitor",
    "360° blind spot camera",
    "360° Camera",
    "360° camera setup",
    "Bluetooth / USB adapter",
    "Bluetooth, USB & AUX Connectivity",
    "Body cover (waterproof / UV resistant)",
    "Body kit (bumpers, skirts)",
    "Bonnet deflector",
    "Brake upgrade kit",
    "Bumper corner protectors",
    "Camping lights",
    "Car alarm / immobilizer",
    "Car inverter (12V-220V)",
    "Car perfume / diffuser",
    "Car refrigerator / mini cooler",
    "Car shampoo / foam wash",
    "Ceramic coating",
    "Certified Pre-Owned Warranty",
    "Child seat anchors / ISOFIX",
    "Chrome garnish kit",
    "Clutch / gear knob upgrade",
    "Connected Car Features (App Control, GPS Tracking)",
    "Cooling seat pad",
    "Cruise Control",
    "Cup holder / organizer box",
    "Custom number plate frame",
    "Dashboard polish",
    "Dashboard trim / wrap",
    "Dash camera (front / dual channel)",
    "Day/Night IRVM (Auto Dimming)",
    "Degreaser / engine bay cleaner",
    "Digital / Head-Up Display (HUD)",
    "Digital Instrument Cluster / MID Display",
    "Door edge guards",
    "Drive Mode Selector (Eco / Sport / Normal)",
    "Dual-Zone Climate Control",
    "Electric Tailgate",
    "Emergency triangle reflector",
    "Engine Immobilizer",
    "Engine remapping / ECU tuning",
    "Engine Start/Stop System",
    "Exhaust upgrade",
    "Fabric protection coating",
    "Fender flares",
    "Fire extinguisher",
    "First aid kit",
    "Floor mats (3D / 7D)",
    "Fog Lamps (Front & Rear)",
    "Fog lamps / DRLs",
    "Foldable Rear Seats",
    "Glass cleaner / rain repellent",
    "GPS security lock",
    "GPS tracker",
    "Graphene coating",
    "Heads-Up Display (HUD)",
    "Heated seat cushion",
    "Hill Hold Assist",
    "Illuminated door sill plates",
    "ISOFIX Child Seat Mounts",
    "Jumper cables",
    "Keyless entry / push start retrofit",
    "Keyless Entry",
    "LED Headlamps with DRLs",
    "LED headlight conversion kit",
    "Low Mileage",
    "Microfiber cloth set",
    "Mobile holder / wireless charger mount",
    "Moonroof",
    "Mud flaps",
    "OEM accessories pack",
    "Paddle Shifters",
    "Paint protection film (PPF)",
    "Panoramic Sunroof",
    "Parking Sensors (Front & Rear)",
    "Parking sensors",
    "Performance air filter (K&N / BMC)",
    "Portable tent",
    "Portable vacuum cleaner",
    "Power Adjustable & Folding ORVMs",
    "Premium Leather Upholstery",
    "Premium Sound System",
    "Push Button Start / Smart Key",
    "Puncture repair kit",
    "Rain Sensing Wipers",
    "Rear AC Vents",
    "Rear Armrest with Cup Holders",
    "Rear Defogger & Wiper",
    "Rear Parking Camera",
    "Rear seat organizer",
    "Relay harness (headlight)",
    "Remote central locking",
    "Reverse camera",
    "Roof carrier / luggage box",
    "Roof rails",
    "Roof Rails / Spoiler",
    "Roof wrap / decals",
    "Roof-mounted light bar",
    "Seat covers Fabric",
    "Seat covers leather",
    "Seatbelt pads",
    "Service History Verified",
    "Side claddings",
    "Single Owner",
    "Speaker upgrade",
    "Spoiler / rear wing",
    "Steering wheel covers",
    "Subwoofer",
    "Sun shades / curtains",
    "Sunfilm / UV tint (as per law)",
    "Sunroof",
    "Suspension kit / coilovers",
    "Taillight upgrade (LED / smoked)",
    "Teflon coating",
    "Tissue box / trash bin",
    "Touchscreen Infotainment System",
    "Touchscreen infotainment system",
    "Towing rope",
    "Traction & Stability Control",
    "Tyre inflator / portable compressor",
    "Tyre polish",
    "Tyre Pressure Monitoring System (TPMS)",
    "Tyre upgrade (all-terrain / low profile)",
    "Underbody ambient lights",
    "Underbody coating / anti-rust",
    "USB charging port",
    "Valid Insurance & RC Verified",
    "Ventilated / Electric Adjustable Seats",
    "Ventilated seats",
    "Wax & polish kit",
    "Waterproof floor liners",
    "Wind deflectors / rain visors",
    "Windshield snow cover / de-icer",
    "Wireless Charger"
  ];

  // Remove duplicates (case-insensitive) and sort alphabetically
  const additionalFeatures = Array.from(
    new Map(
      allFeaturesFromCSV.map(item => [item.toLowerCase(), item])
    ).values()
  ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  // Sync local state with global state when selectedFeatures changes
  useEffect(() => {
    updateField('additionalFeatures', selectedFeatures);
  }, [selectedFeatures, updateField]);

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature)
        ? prev.filter(f => f !== feature)  // Remove if already selected
        : [...prev, feature];              // Add if not selected

      return newFeatures;
    });
  };
  // 🔍 Filtered list based on search input
  const filteredFeatures = additionalFeatures.filter((f) =>
    f.toLowerCase().includes(searchFeature.toLowerCase())
  );

  return (
    <div
      className="enter-registration-page"
      style={{
        background: `linear-gradient(135deg, #EFEFEF 0%, #EFEFEF ${100 - progressPercentage}%, rgba(239, 239, 239, 0) ${100 - progressPercentage}%, rgba(239, 239, 239, 0) 100%)`
      }}
    >
      {/* Background Image */}
      <div className="registration-bg-image"></div>

      <Container fluid className="registration-container">
        <Row className="registration-content ">
          <Col md={12}>
            <div className="mb-3 d-flex justify-content-end chippyTopText">
              <p className="py-3 px-5">
                {getCarSummary()}
              </p>
            </div>
          </Col>

          {/* Left Section - Information */}
          <Col md={6} className="registration-info-section">
            <h1 className="registration-main-title brand-main-title">
              Highlight any aftermarket upgrades or add-ons (e.g., upgraded music system, seat covers, ambient lighting, body kit, spoilers, dash cam, etc.).
            </h1>

            <p className="registration-description text-wrap">
              These upgrades make it look better, add value, and help it stand out from other cars.
            </p>

            {/* Progress Bar */}
            <div className="registration-progress">
              <div className="progress-text">Step 8 of 9</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '89%' }}></div>
              </div>
            </div>

            {/* Reset Button - Left Section */}

          </Col>

          {/* Right Section - Form Card */}
          <Col md={6} className="registration-form-section">
            <div className="registration-form-card">
              <div className="form-card-header text-center">
                <h4 className="form-card-title form-card-title text-white fSize-6 fw-semibold">Aftermarket / Add-on Accessories</h4>
              </div>

              <form onSubmit={goStep9} className="registration-form aftermarket">
                <Row className="pb-4">
                  <Col xl={6} className="mb-md-0 mb-2 ">
                    <label className="form-label">Aftermarket/Addon</label>
                  </Col>
                  <Col xl={6}>
                    <div className="brand-search-container-left">
                      <Image
                        src="/images/Search.png"
                        className="brand-search-icon-left"
                        width={16}
                        height={16}
                        alt="search"
                      />
                      <input
                        placeholder="Search Items"
                        className="form-control searcher__field"
                        value={searchFeature || ""}
                        onChange={(e) => setSearchFeature(e.target.value)}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="owner__list photo-scroller pb-0 mb-4" >
                  <Row>
                    {filteredFeatures.length > 0 ? (
                      filteredFeatures.map((feature, index) => (
                        <Col lg={6} md={6} sm={12} className="mb-3" key={feature}>
                          <div className="carType">
                            <div
                              className={`button__selects text-center w-100 fSize-3 fw-semibold py-2 d-flex align-items-center justify-content-center rounded ${selectedFeatures.includes(feature)
                                  ? "activeSelect"
                                  : ""
                                }`}
                              onClick={() => toggleFeature(feature)}
                              style={{ cursor: "pointer" }}
                            >
                              <span style={{ fontSize: "14px" }}>{feature}</span>
                            </div>
                          </div>
                        </Col>
                      ))
                    ) : (
                      <Col xs={12} className="text-center py-4 text-muted">
                        No matching accessories found.
                      </Col>
                    )}
                  </Row>
                </div>
              </form>

              {/* Back and Next Buttons - Right Section */}
            </div>
          </Col>

          <Col xs={12} className="">
            <div className="warraping d-flex align-items-center justify-content-between">
              <div className="registration-left-actions">
                <button type="button" className="nav-btn nav-btn-reset">
                  Reset
                </button>
              </div>

              <div className="registration-right-actions">
                <button
                  type="button"
                  className="nav-btn nav-btn-back"
                  onClick={backTo7}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="nav-btn nav-btn-next"
                  onClick={goStep9}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdditionalFeatures;
