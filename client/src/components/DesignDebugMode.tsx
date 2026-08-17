import { X } from "lucide-react";
import { useEffect } from "react";

export type DebugContent = {
  closeLabel: string;
  title: string;
  description: string;
  gridLabel: string;
  gridValue: string;
  typeLabel: string;
  typeValue: string;
  colorLabel: string;
  colorValue: string;
};

export function DesignDebugMode({ open, onClose, content }: { open: boolean; onClose: () => void; content: DebugContent }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="design-debug-layer" aria-live="polite">
      <div className="design-debug-grid" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>
      <aside className="design-debug-panel" aria-label={content.title}>
        <div className="design-debug-panel-heading"><span>Inspect</span><button type="button" onClick={onClose} aria-label={content.closeLabel}><X className="h-4 w-4" aria-hidden="true" /></button></div>
        <h2>{content.title}</h2>
        <p>{content.description}</p>
        <dl>
          <div><dt>{content.gridLabel}</dt><dd>{content.gridValue}</dd></div>
          <div><dt>{content.typeLabel}</dt><dd>{content.typeValue}</dd></div>
          <div><dt>{content.colorLabel}</dt><dd><i className="design-debug-swatch swatch-porcelain" /><i className="design-debug-swatch swatch-charcoal" /><i className="design-debug-swatch swatch-cobalt" />{content.colorValue}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
