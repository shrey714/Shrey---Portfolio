import React, { useState } from "react";
import { portfolioContent as content } from "@/content/portfolioContent";

export type WorkProject = (typeof content.work.projects)[number];

export function MicroCaseStudyPath({ project }: { project: WorkProject }) {
  const [activeStep, setActiveStep] = useState(0);
  const { caseStudy } = project;
  const active = caseStudy.steps[activeStep];
  const idBase = `${project.kind}-micro-case-study`;

  return (
    <section className="micro-case-study mt-7 rounded-2xl border border-white/12 bg-white/[0.045] p-3.5 sm:p-4" aria-label={`${project.name} ${caseStudy.label}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aebff6]">{caseStudy.label}</p>
        <span aria-live="polite" className="rounded-full border border-white/12 px-2 py-1 text-[8px] font-semibold tabular-nums uppercase tracking-[0.13em] text-white/55">0{activeStep + 1} / 0{caseStudy.steps.length}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5" role="tablist" aria-label={caseStudy.controlsLabel}>
        {caseStudy.steps.map((step, index) => {
          const selected = activeStep === index;
          return (
            <button
              key={step.label}
              id={`${idBase}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${index}`}
              onClick={() => setActiveStep(index)}
              className={`min-h-11 rounded-xl border px-2 py-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9fb2ff] ${selected ? "border-[#7894ff]/70 bg-[#456fe8] text-white" : "border-white/10 bg-white/[0.025] text-white/60 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"}`}
            >
              <span className="block text-[8px] font-semibold uppercase tracking-[0.13em] opacity-70">0{index + 1}</span>
              <span className="mt-0.5 block text-[10px] font-semibold tracking-[-0.015em]">{step.label}</span>
            </button>
          );
        })}
      </div>
      <div key={`${project.kind}-${activeStep}`} id={`${idBase}-panel-${activeStep}`} role="tabpanel" aria-labelledby={`${idBase}-tab-${activeStep}`} className="micro-case-panel mt-4 border-t border-white/12 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#aebff6]">{active.signal}</p>
        <h4 className="mt-2 text-base font-semibold leading-5 tracking-[-0.035em] text-white">{active.title}</h4>
        <p className="mt-2 text-xs leading-5 text-[#c6c4bf]">{active.text}</p>
      </div>
    </section>
  );
}
