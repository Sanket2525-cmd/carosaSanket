"use client";

import React, { useState } from "react";

function WhatsappOptin() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="whatsapp-optin-wrapper d-flex align-items-center justify-content-between p-2 rounded-3 my-3">
      {/* Left Section - WhatsApp icon & text */}
      <div className="d-flex align-items-start align-items-center gap-2">
        <img
          src="https://assets.cars24.com/production/india-website/catalog/251103161246/_next/static/media/whatsapp.60ee9e42.svg"
          alt="whatsapp"
          width="20"
          height="20"
        />
        <div className="text-start lh-sm">
          <p className="m-0 fSize-3">
            <strong>Stay connected on WhatsApp!
</strong>
            <br />
           Get instant updates and offers
          </p>
        </div>
      </div>

      {/* Right Section - Checkbox */}
      <div className="checkbox-wrap">
        <input
          type="checkbox"
          id="whatsappCheckbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <label htmlFor="whatsappCheckbox"></label>
      </div>
    </div>
  );
}

export default WhatsappOptin;
