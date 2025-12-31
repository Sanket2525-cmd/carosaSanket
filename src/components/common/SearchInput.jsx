"use client";
import React from "react";
import Image from "next/image";

/**
 * 🔍 Reusable Search Input Component
 * @param {string} value - Current input value
 * @param {function} onChange - Handler for input changes
 * @param {string} placeholder - Input placeholder text
 * @param {string} className - Optional styling class
 */
const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`brand-search-container-left ${className}`}>
      <Image
        src="/images/Search.png"
        className="brand-search-icon-left"
        width={16}
        height={16}
        alt="search"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control searcher__field"
      />
    </div>
  );
};

export default SearchInput;
