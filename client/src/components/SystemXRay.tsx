import { Layers3, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

export type XRayContent = {
  openLabel: string;
  closeLabel: string;
  title: string;
  lenses: readonly { label: string; title: string; text: string; signal: string }[];
};

export function SystemXRay({ xray }: { xray: XRayContent }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();
  const activeLens = xray.lenses[activeIndex];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`system-xray ${open ? "is-open" : ""}`}>
      <button type="button" className="system-xray-trigger" onClick={() => setOpen(true)} aria-expanded={open} aria-controls={`${id}-panel`}>
        <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{xray.openLabel}</span>
      </button>

      {open && (
        <section id={`${id}-panel`} className="system-xray-panel" aria-label={xray.title}>
          <div className="system-xray-panel-heading">
            <span>System X-Ray</span>
            <button type="button" className="system-xray-close" onClick={() => setOpen(false)} aria-label={xray.closeLabel}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="system-xray-tabs" role="tablist" aria-label={xray.title}>
            {xray.lenses.map((lens, index) => (
              <button key={lens.label} type="button" role="tab" aria-selected={activeIndex === index} aria-controls={`${id}-lens-${index}`} id={`${id}-tab-${index}`} onClick={() => setActiveIndex(index)}>
                {lens.label}
              </button>
            ))}
          </div>
          <div id={`${id}-lens-${activeIndex}`} className="system-xray-lens" role="tabpanel" aria-labelledby={`${id}-tab-${activeIndex}`}>
            <p className="system-xray-signal">{activeLens.signal}</p>
            <h4>{activeLens.title}</h4>
            <p>{activeLens.text}</p>
          </div>
        </section>
      )}
    </div>
  );
}
