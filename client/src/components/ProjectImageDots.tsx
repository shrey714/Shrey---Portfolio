import * as React from "react";

type ProjectImageDotsProps = {
  projectName: string;
  imageUrls: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function ProjectImageDots({ projectName, imageUrls, activeIndex, onSelect }: ProjectImageDotsProps) {
  if (imageUrls.length < 2) return null;

  return (
    <div className="absolute bottom-3 right-3 flex gap-1.5" aria-label={`Project images for ${projectName}`}>
      {imageUrls.map((imageUrl, index) => (
        <button key={`${imageUrl}-dot-${index}`} type="button" className={`project-image-dot ${index === activeIndex ? "is-active" : ""}`} onClick={() => onSelect(index)} aria-label={`Show image ${index + 1} of ${imageUrls.length} for ${projectName}`} aria-current={index === activeIndex ? "true" : undefined} />
      ))}
    </div>
  );
}
