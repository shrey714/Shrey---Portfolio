import { useEffect, useLayoutEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ProjectImageDots } from "./ProjectImageDots";
import { getPreservedProjectImageIndex } from "@/lib/projectImages";

type EmblaProjectImageCarouselProps = {
  projectName: string;
  imageUrls: string[];
};

export function EmblaProjectImageCarousel({ projectName, imageUrls }: EmblaProjectImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = imageUrls.length;
  const autoplay = useRef(Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }));
  const selectedIndexRef = useRef(0);
  const previousImageUrlsRef = useRef(imageUrls);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: imageCount > 1, watchSlides: false }, [autoplay.current]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => {
      const nextIndex = emblaApi.selectedScrollSnap();
      selectedIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };
    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex).on("reInit", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex).off("reInit", updateSelectedIndex);
    };
  }, [emblaApi]);

  useLayoutEffect(() => {
    const previousImageUrls = previousImageUrlsRef.current;
    const imageListChanged = previousImageUrls.length !== imageUrls.length || previousImageUrls.some((imageUrl, index) => imageUrl !== imageUrls[index]);
    if (!imageListChanged) return;

    const nextIndex = getPreservedProjectImageIndex(previousImageUrls, imageUrls, selectedIndexRef.current);
    previousImageUrlsRef.current = imageUrls;
    selectedIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    if (!emblaApi) return;

    emblaApi.reInit({ loop: imageUrls.length > 1, watchSlides: false });
    emblaApi.scrollTo(nextIndex, true);
  }, [emblaApi, imageUrls]);

  return (
    <div className="theme-project-carousel relative aspect-[16/10] overflow-hidden rounded-[1rem] border" data-project-image-count={imageCount}>
      <div className="project-image-viewport h-full w-full" ref={emblaRef}>
        <div className="project-image-track h-full">
          {imageUrls.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className="project-image-slide h-full">
              <img src={imageUrl} alt={`Project visual ${index + 1} of ${imageCount} for ${projectName}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="theme-project-carousel-scrim pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" aria-hidden="true" />
      <ProjectImageDots projectName={projectName} imageUrls={imageUrls} activeIndex={activeIndex} onSelect={(index) => emblaApi?.scrollTo(index)} />
    </div>
  );
}
