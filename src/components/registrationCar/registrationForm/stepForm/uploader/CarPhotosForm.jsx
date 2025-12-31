"use client";

import { useState, useEffect, useRef } from "react";
import SectionUploader from "./SectionUploader";

export default function CarPhotosForm({ onImagesChange, existingImages = {} }) {
  // Track removed image IDs (for existing images that user removes)
  const [removedImageIds, setRemovedImageIds] = useState([]);
  
  // Use ref to track previous existingImages and prevent unnecessary updates
  const prevExistingImagesRef = useRef();
  const onImagesChangeRef = useRef(onImagesChange);

  // Update ref when callback changes
  useEffect(() => {
    onImagesChangeRef.current = onImagesChange;
  }, [onImagesChange]);

  // Initialize sections with existing images if provided
  const initializeSections = () => {
    const sections = {
      exterior: { files: [], selectedId: null },
      interior: { files: [], selectedId: null },
      highlights: { files: [], selectedId: null },
      tyres: { files: [], selectedId: null },
    };
    
    // Load existing images into sections
    if (existingImages && Object.keys(existingImages).length > 0) {
      Object.keys(sections).forEach(sectionKey => {
        const existing = existingImages[sectionKey] || [];
        sections[sectionKey].files = existing.map(img => ({
          id: img.id,
          url: img.url,
          imageId: img.imageId,
          section: img.section,
          isExisting: true
        }));
      });
    }
    
    return sections;
  };
  
  const [sections, setSections] = useState(initializeSections);

  // Re-initialize when existingImages change (for edit mode) - use ref to prevent infinite loops
  useEffect(() => {
    // Skip if existingImages hasn't actually changed (same reference means no change)
    if (prevExistingImagesRef.current === existingImages) {
      return;
    }
    
    prevExistingImagesRef.current = existingImages;
    
    if (existingImages && Object.keys(existingImages).length > 0) {
      const newSections = {
        exterior: { files: [], selectedId: null },
        interior: { files: [], selectedId: null },
        highlights: { files: [], selectedId: null },
        tyres: { files: [], selectedId: null },
      };
      
      Object.keys(newSections).forEach(sectionKey => {
        const existing = existingImages[sectionKey] || [];
        newSections[sectionKey].files = existing.map(img => ({
          id: img.id,
          url: img.url,
          imageId: img.imageId,
          section: img.section,
          isExisting: true
        }));
      });
      
      setSections(newSections);
      setRemovedImageIds([]);
    }
  }, [existingImages]);

  // Notify parent component when images change - use ref to avoid dependency issues
  useEffect(() => {
    const allImages = [];
    Object.values(sections).forEach(section => {
      allImages.push(...section.files);
    });
    
    console.log('📸 CarPhotosForm: Images changed, total:', allImages.length);
    if (allImages.length > 0) {
      console.log('📸 CarPhotosForm: Image structure:', allImages[0]);
    }
    
    // Always notify parent when images change
    if (onImagesChangeRef.current) {
      onImagesChangeRef.current(allImages, removedImageIds);
    }
  }, [sections, removedImageIds]);

  const addFiles = (key, fileList) => {
    if (!fileList || fileList.length === 0) {
      console.warn('⚠️ addFiles called with empty fileList');
      return;
    }
    
    console.log(`📸 addFiles called for section "${key}" with ${fileList.length} files`);
    
    const files = Array.from(fileList).map((file) => {
      const blobURL = URL.createObjectURL(file);
      const fileObj = {
        id: blobURL,
        file,
        section: key,
      };
      console.log(`📸 Created file object:`, { id: blobURL, fileName: file.name, section: key });
      return fileObj;
    });
    
    setSections((prev) => {
      const newFiles = [...prev[key].files, ...files];
      console.log(`📸 Updated section "${key}" with ${newFiles.length} total files`);
      return {
        ...prev,
        [key]: { ...prev[key], files: newFiles },
      };
    });
  };

  const selectFile = (key, id) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], selectedId: id },
    }));
  };

  const removeFile = (key, id) => {
    setSections((prev) => {
      const fileToRemove = prev[key].files.find(file => file.id === id);
      
      // If removing an existing image, track its ID for backend deletion
      if (fileToRemove && fileToRemove.isExisting && fileToRemove.imageId) {
        setRemovedImageIds(prevIds => {
          if (!prevIds.includes(fileToRemove.imageId)) {
            return [...prevIds, fileToRemove.imageId];
          }
          return prevIds;
        });
      }
      
      return {
        ...prev,
        [key]: { 
          ...prev[key], 
          files: prev[key].files.filter(file => file.id !== id),
          selectedId: prev[key].selectedId === id ? null : prev[key].selectedId
        },
      };
    });
  };

  return (
    <div>
      <SectionUploader
        title="Exterior Photos"
        note="Upload clear front, rear, and side shots of the car. Include close-ups of headlights, taillights, and overall body condition."
        files={sections.exterior.files}
        selectedId={sections.exterior.selectedId}
        onUpload={(fl) => addFiles("exterior", fl)}
        onSelect={(id) => selectFile("exterior", id)}
        onRemove={(id) => removeFile("exterior", id)}
      />

      <SectionUploader
        title="Interior Photos"
        note="Upload photos of seats (front & rear), dashboard, steering wheel, gear lever, and infotainment system."
        files={sections.interior.files}
        selectedId={sections.interior.selectedId}
        onUpload={(fl) => addFiles("interior", fl)}
        onSelect={(id) => selectFile("interior", id)}
        onRemove={(id) => removeFile("interior", id)}
      />

      <SectionUploader
        title="Attractions"
        note="Highlight special additions/features like sunroof, touchscreen, reverse camera, alloy wheels, or custom accessories."
        files={sections.highlights.files}
        selectedId={sections.highlights.selectedId}
        onUpload={(fl) => addFiles("highlights", fl)}
        onSelect={(id) => selectFile("highlights", id)}
        onRemove={(id) => removeFile("highlights", id)}
      />

      <SectionUploader
        title="Tyres Photos"
        note="Take close-up photos of each tyre, including tread condition and spare tyre."
        files={sections.tyres.files}
        selectedId={sections.tyres.selectedId}
        onUpload={(fl) => addFiles("tyres", fl)}
        onSelect={(id) => selectFile("tyres", id)}
        onRemove={(id) => removeFile("tyres", id)}
      />
    </div>
  );
}
