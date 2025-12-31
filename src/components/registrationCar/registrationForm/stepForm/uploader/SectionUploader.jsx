"use client";

import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SectionUploader({
  title,
  note,
  files = [],
  selectedId = null,
  onUpload,
  onSelect,
  onRemove,
}) {
  // Create array of 10 slots for uploaded images
  const totalSlots = 10;
  const imageSlots = Array.from({ length: totalSlots }, (_, index) => {
    const fileObj = files[index];
    if (!fileObj) {
      return {
        id: `placeholder-${index}`,
        file: null,
        src: null,
        isPlaceholder: true,
      };
    }
    
    // For existing images: { id: "existing-59", url: "https://...", isExisting: true, imageId: 59, section: "exterior" }
    // For new uploads: { id: blobURL, file: File, section: string }
    const imageId = fileObj.id || fileObj.url || `placeholder-${index}`;
    
    // Prioritize url for existing images, then id (blobURL) for new uploads
    let imageSrc = null;
    if (fileObj.isExisting && fileObj.url) {
      // Existing image from server - use URL (may be proxied to avoid CORS)
      imageSrc = fileObj.url;
      console.log(`📸 Existing image ${index}: using URL`, imageSrc);
    } else if (fileObj.url) {
      // Has URL property (fallback)
      imageSrc = fileObj.url;
      console.log(`📸 Image ${index}: using url property`, imageSrc);
    } else if (fileObj.id && (fileObj.id.startsWith('blob:') || fileObj.id.startsWith('http'))) {
      // New upload with blob URL or existing with full URL as ID
      imageSrc = fileObj.id;
      console.log(`📸 Image ${index}: using id as blob/http URL`, imageSrc);
    } else if (fileObj.file && fileObj.file instanceof File) {
      // New File object - create blob URL
      imageSrc = URL.createObjectURL(fileObj.file);
      console.log(`📸 Image ${index}: created blob URL from File`, imageSrc);
    } else {
      console.warn(`⚠️ Image ${index}: No valid source found`, fileObj);
    }
    
    return {
      id: imageId,
      file: fileObj,
      src: imageSrc,
      isPlaceholder: false,
    };
  });
  
  // Debug log
  if (files.length > 0) {
    console.log(`📸 SectionUploader "${title}": ${files.length} files`);
    files.forEach((file, idx) => {
      console.log(`📸 File ${idx}:`, {
        id: file?.id,
        url: file?.url,
        isExisting: file?.isExisting,
        hasFile: !!file?.file,
        fileType: file?.file?.constructor?.name
      });
    });
  }

  return (
    <section className="mainBody__uploadfile mb-4 pb-3 border-bottom">
      {/* Title */}
      <h6 className="mb-3 fw-bold text-dark">{title}</h6>

      {/* Image slots row */}
      <Row className="mb-3">
        {/* Image slots (10 slots) with Swiper slider */}
        <Col xxl={9} xs={8} className="mb-xxl-0 mb-2">
          <Swiper
            spaceBetween={8}
            slidesPerView={6}
            loop={imageSlots.length > 6}
            breakpoints={{
              0: {
                slidesPerView: 4,
                spaceBetween: 8,
              },
              576: {
                slidesPerView: 4,
                spaceBetween: 8,
              },
              768: {
                slidesPerView: 6,
                spaceBetween: 8,
              },
              992: {
                slidesPerView: 6,
                spaceBetween: 8,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 8,
              },
            }}
            className="image-slots-swiper"
          >
            {imageSlots.map((slot, index) => (
              <SwiperSlide key={slot.id}>
                <div style={{ aspectRatio: "1", height: "74px" }} className="heightSet">
                  {slot.src ? (
                    // Uploaded image (can be File object or existing image URL)
                    <div
                      className="position-relative border rounded overflow-hidden w-100 h-100"
                      style={{ 
                        cursor: "pointer"
                      }}
                      onClick={() => onSelect(slot.id)}
                    >
                      <img
                        src={slot.src}
                        alt={`${title} photo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          console.error('❌ Image failed to load:', slot.src);
                          console.error('❌ Image object:', slot.file);
                          console.error('❌ Slot details:', { id: slot.id, src: slot.src, isPlaceholder: slot.isPlaceholder });
                          // Hide the broken image
                          e.target.style.display = 'none';
                          // Show error placeholder
                          const parent = e.target.parentElement;
                          if (!parent.querySelector('.image-error-placeholder')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'image-error-placeholder d-flex align-items-center justify-content-center w-100 h-100';
                            errorDiv.style.cssText = 'background-color: #f8f9fa; color: #dc3545; font-size: 10px; position: absolute; top: 0; left: 0; z-index: 10;';
                            errorDiv.textContent = 'Failed to load';
                            parent.appendChild(errorDiv);
                          }
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', slot.src);
                        }}
                      />

                      {/* Selection indicator */}
                      <div
                        className={`position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center rounded-circle border border-2 ${
                          selectedId === slot.id
                            ? "bg-success border-success"
                            : "bg-white border-white"
                        }`}
                        style={{ width: 16, height: 16 }}
                      >
                        {selectedId === slot.id && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            fill="currentColor"
                            className="text-white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.485 1.929a.75.75 0 011.06 1.06L6.03 11.505a.75.75 0 01-1.06 0L1.454 7.989a.75.75 0 111.06-1.06L5.5 9.915l7.985-7.986z" />
                          </svg>
                        )}
                      </div>

                      {/* Remove button */}
                      {onRemove && (
                        <button
                          type="button"
                          className="position-absolute top-0 start-0 m-1 btn btn-sm btn-danger rounded-circle"
                          style={{ width: "16px", height: "16px", padding: "0", fontSize: "8px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(slot.id);
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    // Placeholder image
                    <div
                      className="border rounded d-flex align-items-center justify-content-center w-100 h-100"
                      style={{ 
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6"
                      }}
                    >
                      <div
                        className="rounded-circle bg-white border border-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Col>

        {/* Upload button - col-6 */}
        <Col xxl={3} xs={4} className="d-flex align-items-center justify-content-center">
          <label
            className="d-flex flex-column align-items-center justify-content-center rounded w-100 upload_de"
            style={{ 
              cursor: "pointer",
              height: "74px",
              backgroundColor: "#f9fafb",
              borderColor: "#d1d5db",
              border: "2px dashed rgb(229, 231, 235)"
            }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onUpload(e.target.files)}
              className="d-none"
            />
            <div className="d-flex flex-column align-items-center">
              <svg width="16" height="16" fill="#6b7280" viewBox="0 0 16 16" className="mb-1">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              <div className="text-center" style={{ fontSize: "8px", color: "#6b7280" }}>
                Chose the files
              </div>
            </div>
          </label>
        </Col>
      </Row>

      {/* Note */}
      {note && (
        <p className="mt-2 mb-0" style={{ fontSize: "14px", color: "#6b7280" }}>
          <strong style={{ color: "#374151" }}>Note:</strong> <span style={{ fontStyle: "italic" }}>{note}</span>
        </p>
      )}
    </section>
  );
}
