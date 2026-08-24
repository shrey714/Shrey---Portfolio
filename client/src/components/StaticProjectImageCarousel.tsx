import * as React from "react";
import { ProjectImageDots } from "./ProjectImageDots";

type StaticProjectImageCarouselProps = {
  projectName: string;
  imageUrls: string[];
};

export function StaticProjectImageCarousel({ projectName, imageUrls }: StaticProjectImageCarouselProps) {
  const imageCount = imageUrls.length;

  return (
    <div className="theme-project-carousel relative aspect-[16/10] overflow-hidden rounded-[1rem] border" data-project-image-count={imageCount}>
      <div className="project-image-viewport h-full w-full">
        <div className="project-image-track h-full">
          {imageUrls.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className="project-image-slide h-full">
              <img src={imageUrl} alt={`Project visual ${index + 1} of ${imageCount} for ${projectName}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="theme-project-carousel-scrim pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" aria-hidden="true" />
      <ProjectImageDots projectName={projectName} imageUrls={imageUrls} activeIndex={0} onSelect={() => {}} />
    </div>
  );
}
