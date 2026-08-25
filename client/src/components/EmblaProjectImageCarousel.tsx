import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [transitionId, setTransitionId] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const imageCount = imageUrls.length;
  const autoplay = useRef(Autoplay({ delay: 4200, stopOnInteraction: false, stopOnMouseEnter: true }));
  const selectedIndexRef = useRef(0);
  const previousImageUrlsRef = useRef(imageUrls);
  const lightboxIndexRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxDialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: imageCount > 1, watchSlides: false, duration: 32 }, [autoplay.current]);

  const moveLightbox = (direction: -1 | 1) => {
    setLightboxIndex((index) => (index + direction + imageCount) % imageCount);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    emblaApi?.scrollTo(lightboxIndexRef.current);
  };

  useEffect(() => {
    lightboxIndexRef.current = lightboxIndex;
  }, [lightboxIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => {
      const nextIndex = emblaApi.selectedScrollSnap();
      if (nextIndex !== selectedIndexRef.current) setTransitionId((current) => current + 1);
      selectedIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };
    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex).on("reInit", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex).off("reInit", updateSelectedIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!lightboxOpen) return;

    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key === "ArrowLeft" && imageCount > 1) {
        event.preventDefault();
        moveLightbox(-1);
      }
      if (event.key === "ArrowRight" && imageCount > 1) {
        event.preventDefault();
        moveLightbox(1);
      }
      if (event.key === "Tab") {
        const focusableElements = Array.from(lightboxDialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements.at(-1);
        if (!firstFocusableElement || !lastFocusableElement) return;
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedElementRef.current?.focus();
    };
  }, [emblaApi, imageCount, lightboxOpen]);

  useLayoutEffect(() => {
    const previousImageUrls = previousImageUrlsRef.current;
    const imageListChanged = previousImageUrls.length !== imageUrls.length || previousImageUrls.some((imageUrl, index) => imageUrl !== imageUrls[index]);
    if (!imageListChanged) return;

    const nextIndex = getPreservedProjectImageIndex(previousImageUrls, imageUrls, selectedIndexRef.current);
    previousImageUrlsRef.current = imageUrls;
    selectedIndexRef.current = nextIndex;
    setTransitionId((current) => current + 1);
    setActiveIndex(nextIndex);

    if (!emblaApi) return;

    emblaApi.reInit({ loop: imageUrls.length > 1, watchSlides: false, duration: 32 });
    emblaApi.scrollTo(nextIndex);
  }, [emblaApi, imageUrls]);

  return (
    <div className="theme-project-carousel relative aspect-[16/10] overflow-hidden rounded-[1rem] border" data-project-image-count={imageCount}>
      <div className="project-image-viewport h-full w-full" ref={emblaRef}>
        <div className="project-image-track h-full">
          {imageUrls.map((imageUrl, index) => (
            <div key={`${imageUrl}-${index}`} className={`project-image-slide h-full ${index === activeIndex ? "is-active" : ""}`}>
              <button type="button" className="project-image-lightbox-trigger block h-full w-full" onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }} aria-label={`Open image ${index + 1} of ${imageCount} for ${projectName} in full screen`}>
                <img key={`${imageUrl}-${index === activeIndex ? transitionId : "idle"}`} src={imageUrl} alt={`Project visual ${index + 1} of ${imageCount} for ${projectName}`} loading="lazy" decoding="async" className="project-image-slide-image h-full w-full object-cover" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="theme-project-carousel-scrim pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" aria-hidden="true" />
      <ProjectImageDots projectName={projectName} imageUrls={imageUrls} activeIndex={activeIndex} onSelect={(index) => emblaApi?.scrollTo(index)} />
      {lightboxOpen && createPortal(
        <div className="project-image-lightbox" role="dialog" aria-modal="true" aria-label={`${projectName} image viewer`} ref={lightboxDialogRef} onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
          <div className="project-image-lightbox-panel">
            <button ref={closeButtonRef} type="button" className="project-image-lightbox-close" onClick={closeLightbox} aria-label="Close full-screen image viewer"><span aria-hidden="true">×</span></button>
            <img src={imageUrls[lightboxIndex]} alt={`Project visual ${lightboxIndex + 1} of ${imageCount} for ${projectName}`} className="project-image-lightbox-image" />
          </div>
          {imageCount > 1 && <div className="project-image-lightbox-controls" aria-label="Image navigation">
              <button type="button" onClick={() => moveLightbox(-1)} aria-label="Show previous image"><span aria-hidden="true">←</span></button>
              <span aria-live="polite">{lightboxIndex + 1} / {imageCount}</span>
              <button type="button" onClick={() => moveLightbox(1)} aria-label="Show next image"><span aria-hidden="true">→</span></button>
          </div>}
        </div>,
        document.body
      )}
    </div>
  );
}
