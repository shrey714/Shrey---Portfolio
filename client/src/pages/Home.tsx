/**
 * Quiet Product Studio — editorial product-design page.
 * Warm porcelain, ink typography, Cobalt Mist accents, off-center content rail,
 * and restrained motion communicate a product-minded engineering practice.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

const HERO_IMAGE = "/manus-storage/shrey-hero-editorial_9f125b19.jpg";
const LOGO_IMAGE = "/manus-storage/shrey-orbit-logo_444aa5f5.png";

const navItems = [
  { id: "top", label: "Index", number: "00" },
  { id: "work", label: "Selected work", number: "01" },
  { id: "practice", label: "Practice", number: "02" },
  { id: "about", label: "About", number: "03" },
  { id: "contact", label: "Contact", number: "04" },
];

const experienceItems = [
  "Crafting interface architecture with React and TypeScript.",
  "Designing Java and Spring services around real operational constraints.",
  "Working across SQL data flows, business logic, and user-facing product details.",
];

const principles = [
  {
    number: "01",
    title: "Keep it simple.",
    text: "Complexity should solve a real problem. If it does not, it is probably just complexity.",
  },
  {
    number: "02",
    title: "Build for the person using it.",
    text: "Technical decisions matter, but software ultimately exists to make someone’s work or life better.",
  },
  {
    number: "03",
    title: "Understand before optimizing.",
    text: "Measure, find the bottleneck, then make it faster—with a reason for every change.",
  },
  {
    number: "04",
    title: "Make it maintainable.",
    text: "The best decision survives the next six months, including the person who has to maintain it.",
  },
];

function AnchorArrow() {
  return <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />;
}

function ProductEvidence({ kind }: { kind: "clinic" | "commerce" }) {
  const clinic = kind === "clinic";
  const rows = clinic ? ["Patient flow", "Team handoff", "Billing state"] : ["Catalog signal", "Stock health", "Store orders"];
  const title = clinic ? "Operational care, in view" : "Inventory, from shelf to storefront";

  return (
    <div className="relative overflow-hidden rounded-[1.45rem] border border-white/12 bg-[#26272a] p-3 shadow-[0_24px_55px_-40px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(69,111,232,0.22),transparent_35%)]" />
      <div className="relative rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">
          <span>{clinic ? "DardiBook / workflow" : "Shopkeeper AI / operations"}</span>
          <span className="flex gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-white/25" /><i className="h-1.5 w-1.5 rounded-full bg-white/25" /><i className="h-1.5 w-1.5 rounded-full bg-[#456fe8]" /></span>
        </div>
        <div className={`mt-4 grid gap-3 ${clinic ? "grid-cols-[0.34fr_0.66fr]" : "grid-cols-[0.45fr_0.55fr]"}`}>
          <div className="rounded-lg border border-white/9 bg-white/[0.035] p-2.5">
            <div className="h-1.5 w-12 rounded-full bg-white/35" />
            <div className="mt-4 space-y-2">
              {[0, 1, 2, 3].map((item) => <div key={item} className={`h-5 rounded-md border border-white/[0.06] ${item === 1 ? "bg-[#456fe8]/80" : "bg-white/[0.045]"}`} />)}
            </div>
            <div className="mt-4 rounded-md border border-[#456fe8]/40 bg-[#456fe8]/15 p-2">
              <div className="h-1.5 w-8 rounded-full bg-[#9fb2ff]" />
              <div className="mt-2 h-1 w-full rounded-full bg-white/15" />
            </div>
          </div>
          <div className="rounded-lg border border-white/9 bg-white/[0.035] p-3">
            <div className="flex items-start justify-between"><div><div className="h-1.5 w-20 rounded-full bg-white/65" /><div className="mt-2 h-1.5 w-14 rounded-full bg-white/20" /></div><div className="h-6 w-10 rounded-md bg-[#456fe8]" /></div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((item) => <div key={item} className="rounded-md border border-white/[0.08] bg-white/[0.035] p-2"><div className="h-1 w-5 rounded-full bg-white/25" /><div className={`mt-3 h-8 rounded ${item === 1 ? "bg-[#456fe8]/60" : "bg-white/[0.09]"}`} /></div>)}
            </div>
            <div className="mt-4 space-y-2.5">
              {rows.map((row, index) => <div key={row} className="flex items-center gap-3"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${index === 1 ? "bg-[#456fe8]" : "bg-white/25"}`} /><span className="h-1.5 flex-1 rounded-full bg-white/20" /><span className="h-1.5 w-9 rounded-full bg-white/10" /></div>)}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex items-end justify-between px-1 pb-1 pt-4 text-white"><p className="max-w-[12rem] text-xs font-medium tracking-[-0.02em] text-white/80 sm:text-sm">{title}</p><span className="rounded-full border border-white/14 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-white/60">Evidence frame</span></div>
    </div>
  );
}

function SystemsEvidence() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[#1b1c1d]/10 bg-[#f5f3ed] p-5 shadow-[0_25px_55px_-42px_rgba(27,28,29,0.42)] sm:p-7">
      <div className="absolute inset-0 opacity-50 dot-field" />
      <div className="relative grid grid-cols-[0.24fr_0.52fr_0.24fr] items-center gap-2 sm:gap-4">
        <div className="space-y-3"><div className="h-10 rounded-lg border border-[#1b1c1d]/10 bg-white/70" /><div className="h-6 rounded-lg border border-[#1b1c1d]/10 bg-white/55" /><div className="h-14 rounded-lg border border-[#1b1c1d]/10 bg-[#456fe8]/12" /></div>
        <div className="relative flex aspect-square items-center justify-center rounded-full border border-[#456fe8]/30 bg-[#456fe8]/8"><div className="absolute h-[70%] w-[70%] rounded-full border border-dashed border-[#456fe8]/45" /><div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#1b1c1d]/15 bg-[#1b1c1d] text-[9px] font-semibold uppercase tracking-[0.14em] text-white">Flow</div><div className="absolute right-1 top-5 h-3 w-3 rounded-full border-2 border-[#f5f3ed] bg-[#456fe8]" /></div>
        <div className="space-y-3"><div className="ml-auto h-14 w-full rounded-lg border border-[#1b1c1d]/10 bg-white/70" /><div className="ml-auto h-6 w-3/4 rounded-lg border border-[#1b1c1d]/10 bg-white/55" /><div className="ml-auto h-10 w-full rounded-lg border border-[#1b1c1d]/10 bg-[#1b1c1d]/[0.06]" /></div>
      </div>
      <div className="relative mt-6 flex items-center justify-between border-t border-[#1b1c1d]/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#777571]"><span>Signal / decision / response</span><span className="text-[#456fe8]">System note 01</span></div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 26, restDelta: 0.001 });

  const observedIds = useMemo(() => navItems.map((item) => item.id), []);

  useEffect(() => {
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-32% 0px -55% 0px", threshold: [0.05, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [observedIds]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f6f4ef] text-[#1b1c1d] selection:bg-[#456fe8] selection:text-white">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-[#456fe8]"
        style={{ scaleX }}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1b1c1d]/8 bg-[#f6f4ef]/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Shrey Patel home">
            <img src={LOGO_IMAGE} alt="" className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-[-0.03em]">Shrey Patel</span>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1b1c1d]/12 bg-white/45 text-[#1b1c1d] transition-transform duration-200 active:scale-95"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mx-auto mt-3 max-w-7xl border-t border-[#1b1c1d]/10 pt-3" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={closeMenu}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-[#484746] transition-colors hover:bg-white/80"
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[#1b1c1d]/10 bg-[#f6f4ef] px-7 py-8 lg:flex">
        <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-1 bg-[#456fe8]" />
        <a href="#top" className="flex items-center gap-3" aria-label="Shrey Patel home">
          <img src={LOGO_IMAGE} alt="" className="h-10 w-10" />
          <div>
            <p className="text-sm font-semibold tracking-[-0.04em]">Shrey Patel</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#676766]">Portfolio · 2026</p>
          </div>
        </a>

        <nav className="mt-20 space-y-1" aria-label="Section navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group flex items-center gap-3 rounded-lg px-2 py-2.5 text-[13px] transition-all duration-200 ${
                active === item.id ? "bg-white/75 text-[#1b1c1d]" : "text-[#777673] hover:bg-white/55 hover:text-[#1b1c1d]"
              }`}
            >
              <span className={`text-[10px] tabular-nums ${active === item.id ? "text-[#456fe8]" : "text-[#aaa8a3]"}`}>{item.number}</span>
              <span className="font-medium tracking-[-0.01em]">{item.label}</span>
              <span className={`ml-auto h-1.5 w-1.5 rounded-full transition-all ${active === item.id ? "scale-100 bg-[#456fe8]" : "scale-0 bg-[#456fe8]"}`} />
            </a>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#1b1c1d]/10 pt-5">
          <p className="flex items-center gap-2 text-[11px] font-medium text-[#676766]"><span className="h-1.5 w-1.5 rounded-full bg-[#456fe8]" /> Available for considered work</p>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-[#898783]"><MapPin className="h-3.5 w-3.5" /> Bangalore, India</p>
          <p className="mt-1 text-[11px] text-[#898783]">Built around clarity &amp; care.</p>
        </div>
      </aside>

      <main className="pt-[64px] lg:ml-72 lg:pt-0">
        <section id="top" className="relative isolate min-h-[calc(100svh-64px)] overflow-hidden px-5 pb-12 pt-16 sm:px-8 sm:pt-24 lg:min-h-screen lg:px-12 lg:pt-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 dot-field opacity-60" />
          <div className="pointer-events-none absolute -right-20 top-4 h-[27rem] w-[27rem] rounded-full bg-[#456fe8]/7 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-12 lg:min-h-[calc(100vh-3rem)]">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.72fr)] lg:gap-16">
              <div className="max-w-3xl pt-2 lg:pt-20">
                <div className="reveal-in mb-8 flex items-center gap-3 [animation-delay:20ms]">
                  <img src={LOGO_IMAGE} alt="" className="h-11 w-11 rounded-xl border border-[#1b1c1d]/10 bg-white/70 p-1.5 shadow-sm" />
                  <div><p className="text-sm font-semibold tracking-[-0.04em]">Shrey Patel</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777571]">Designing the connective tissue</p></div>
                </div>
                <div className="reveal-in flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62615e] [animation-delay:40ms]">
                  <span className="h-px w-7 bg-[#456fe8]" />
                  UI Designer · Frontend Developer · UX Architect
                </div>
                <h1 className="reveal-in mt-7 font-serif text-[clamp(3.35rem,8vw,7.3rem)] leading-[0.88] tracking-[-0.07em] text-[#1b1c1d] [animation-delay:120ms]">
                  I make digital
                  <span className="block pl-[0.06em] text-[#456fe8]">systems feel</span>
                  <span className="block">considered.</span>
                </h1>
                <p className="reveal-in mt-8 max-w-xl text-[17px] leading-7 tracking-[-0.02em] text-[#595856] [animation-delay:200ms] sm:text-lg">
                  I’m Shrey, a product-minded software engineer and UX researcher who enjoys turning complex problems into simple, polished experiences—from the first interface to the systems underneath.
                </p>
                <div className="reveal-in mt-9 flex flex-wrap items-center gap-3 [animation-delay:280ms]">
                  <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-[#1b1c1d] px-5 py-3 text-sm font-semibold text-[#f6f4ef] transition-all duration-200 hover:bg-[#456fe8] active:scale-[0.97]">
                    See selected work <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                  <a href="#contact" className="group inline-flex items-center gap-2 rounded-full border border-[#1b1c1d]/14 bg-white/50 px-5 py-3 text-sm font-semibold text-[#1b1c1d] transition-colors duration-200 hover:border-[#456fe8]/40 hover:bg-white active:scale-[0.97]">
                    Start a conversation <AnchorArrow />
                  </a>
                </div>
              </div>

              <div className="reveal-in relative ml-auto w-full max-w-[37rem] [animation-delay:180ms]">
                <div className="relative overflow-hidden rounded-[1.55rem] border border-white/80 bg-[#e9e6df] p-2 shadow-[0_28px_80px_-42px_rgba(27,28,29,0.42)]">
                  <img src={HERO_IMAGE} alt="Abstract cobalt architectural forms on a warm porcelain studio surface" className="aspect-[16/11] w-full rounded-[1.15rem] object-cover" />
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                    <span className="rounded-full border border-white/20 bg-[#1b1c1d]/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.13em] backdrop-blur-md">Systems × experience</span>
                    <span className="text-[10px] uppercase tracking-[0.13em] opacity-70">01 / 04</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 hidden w-44 rounded-2xl border border-[#1b1c1d]/10 bg-[#f6f4ef]/90 p-4 shadow-[0_18px_45px_-30px_rgba(27,28,29,0.45)] backdrop-blur sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#767570]">Based in</p>
                  <p className="mt-1 text-sm font-semibold tracking-[-0.03em]">Bangalore, India</p>
                  <p className="mt-2 text-xs leading-4 text-[#73716e]">Designing across interaction, interface, and implementation.</p>
                </div>
              </div>
            </div>

            <div className="reveal-in flex flex-col gap-4 border-t border-[#1b1c1d]/10 pt-5 text-[11px] text-[#6d6b67] sm:flex-row sm:items-center sm:justify-between [animation-delay:360ms]">
              <p className="font-medium uppercase tracking-[0.13em]">Software Engineer @ Wells Fargo</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <span>Frontend interfaces</span><span>•</span><span>Product systems</span><span>•</span><span>User research</span>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="relative bg-[#e9e6df] px-5 py-12 text-[#f4f1eb] sm:px-8 sm:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#1b1c1d]/10 bg-[#1b1c1d] px-6 py-10 shadow-[0_32px_70px_-48px_rgba(27,28,29,0.65)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-10 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-[#aebff6]">Selected work</p>
                <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.75rem,5vw,5rem)] leading-[0.92] tracking-[-0.065em]">Products with a clear point of view.</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#c6c4bf]">A small selection of systems where interface thinking and engineering have to work together.</p>
            </div>

            <div className="mt-10 space-y-16 lg:mt-14 lg:space-y-24">
              <article className="group grid gap-7 lg:grid-cols-[minmax(0,1.42fr)_minmax(260px,0.58fr)] lg:items-end lg:gap-12">
                <a href="#contact" className="relative block transition-transform duration-300 hover:-translate-y-1" aria-label="Discuss the DardiBook project">
                  <ProductEvidence kind="clinic" />
                  <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-[#1b1c1d]/65 p-2.5 text-white backdrop-blur-sm"><ArrowUpRight className="h-4 w-4" /></span>
                </a>
                <div className="lg:pb-2">
                  <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-[#a8a6a2]"><span>01 — Product system</span><span>2025</span></div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">DardiBook</h3>
                  <p className="mt-2 text-base text-[#d0cdc7]">Clinic management platform</p>
                  <p className="mt-5 text-sm leading-6 text-[#aaa8a3]">A digital workspace that brings authentication, real-time collaboration, operational state, and subscription experiences into one calmer clinical workflow.</p>
                  <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.11em] text-[#bab7b1]">
                    {['Next.js', 'Firebase', 'Liveblocks', 'Razorpay'].map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-1.5">{tag}</span>)}
                  </div>
                  <a href="#contact" className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#f4f1eb]">Discuss this case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></a>
                </div>
              </article>

              <article className="group grid gap-7 lg:grid-cols-[minmax(260px,0.58fr)_minmax(0,1.42fr)] lg:items-end lg:gap-12">
                <div className="order-2 lg:order-1 lg:pb-2">
                  <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-[#a8a6a2]"><span>02 — Commerce system</span><span>In progress</span></div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">Shopkeeper AI</h3>
                  <p className="mt-2 text-base text-[#d0cdc7]">Inventory &amp; online store management</p>
                  <p className="mt-5 text-sm leading-6 text-[#aaa8a3]">One ecosystem for shopkeepers: a native mobile experience for day-to-day inventory and a customer-facing storefront for turning stock into commerce.</p>
                  <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.11em] text-[#bab7b1]">
                    {['Expo', 'React', 'TypeScript', 'Supabase'].map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-1.5">{tag}</span>)}
                  </div>
                  <a href="#contact" className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#f4f1eb]">Ask about the build <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></a>
                </div>
                <a href="#contact" className="order-1 relative block transition-transform duration-300 hover:-translate-y-1 lg:order-2" aria-label="Discuss the Shopkeeper AI project">
                  <ProductEvidence kind="commerce" />
                  <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-[#1b1c1d]/65 p-2.5 text-white backdrop-blur-sm"><ArrowUpRight className="h-4 w-4" /></span>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section id="practice" className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 paper-glow" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 border-b border-[#1b1c1d]/10 pb-12 lg:grid-cols-[0.66fr_1.34fr] lg:gap-20">
              <div>
                <p className="eyebrow">Practice</p>
                <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">The work behind the work.</h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 tracking-[-0.025em] text-[#575653]">I work best in the space between a messy problem and a usable system. That means thinking through flows, asking sharper questions, shaping the interface, and staying close enough to implementation that the details hold up.</p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-20">
              <div className="relative mx-auto w-full max-w-[29rem] lg:mx-0">
                <SystemsEvidence />
                <div className="absolute -right-3 bottom-7 rounded-xl border border-[#1b1c1d]/10 bg-[#f6f4ef]/90 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d5b58] backdrop-blur-sm">Detail is part of the system.</div>
              </div>
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {[
                  ["Interface design", "Making complex workflows clear, calm, and easy to navigate."],
                  ["UX architecture", "Mapping decisions, edge cases, and information before they become interface debt."],
                  ["Frontend craft", "Translating systems into responsive, resilient interfaces with considered detail."],
                  ["Research mindset", "Watching for assumptions, asking why, and letting real constraints shape the answer."],
                ].map(([title, text], index) => (
                  <div key={title} className="border-t border-[#1b1c1d]/12 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#456fe8]">0{index + 1}</p>
                    <h3 className="mt-3 text-lg font-semibold tracking-[-0.035em]">{title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6a6865]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] border border-[#1b1c1d]/10 bg-[#1b1c1d]/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Frontend", "React · Next.js · TypeScript"],
                ["Backend", "Java · Spring · REST APIs"],
                ["Data", "SQL · Firestore · DuckDB"],
                ["Architecture", "Systems · Events · Scale"],
              ].map(([name, tools]) => (
                <div key={name} className="min-h-28 bg-[#f6f4ef] p-5 transition-colors duration-200 hover:bg-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777571]">{name}</p>
                  <p className="mt-4 text-sm font-medium tracking-[-0.02em] text-[#343434]">{tools}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-[#1b1c1d]/10 bg-[#eeece6] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
              <div>
                <p className="eyebrow">About</p>
                <h2 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">A little about me.</h2>
                <div className="mt-8 space-y-3 text-sm text-[#64625e]">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#456fe8]" /> Bangalore, India</p>
                  <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#456fe8]" /> 2+ years of experience</p>
                </div>
              </div>
              <div>
                <p className="max-w-3xl text-[clamp(1.55rem,3vw,2.45rem)] leading-[1.18] tracking-[-0.045em] text-[#292a2a]">I studied Computer Science and Engineering at SVNIT Surat and now work as a Software Developer at Wells Fargo. I care about what software does under the hood—and how it feels in the hands of the person using it.</p>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#62605d]">My work has taken me across frontend development, backend engineering, databases, and risk technology. I particularly enjoy problems where the answer is not obvious: understanding the constraints, breaking the work down, and shaping an experience that can scale.</p>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ["Now", "Software Developer", "Wells Fargo"],
                    ["Education", "B.Tech, CSE", "SVNIT Surat"],
                    ["Focus", "Product systems", "Interface to data"],
                  ].map(([label, primary, secondary]) => (
                    <div key={label} className="border-t border-[#1b1c1d]/12 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777571]">{label}</p>
                      <p className="mt-2 text-sm font-semibold tracking-[-0.025em]">{primary}</p>
                      <p className="mt-1 text-xs text-[#706e6a]">{secondary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-12 border-t border-[#1b1c1d]/10 pt-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
              <div>
                <p className="eyebrow">Experience</p>
                <p className="mt-4 text-sm leading-6 text-[#6a6865]">A factual, understated snapshot of the work I do and the systems I want to keep learning from.</p>
              </div>
              <div>
                <div className="flex flex-col gap-4 border-b border-[#1b1c1d]/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-2xl font-semibold tracking-[-0.05em]">Wells Fargo</h3><p className="mt-1 text-sm text-[#676561]">Software Developer · Market Risk</p></div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777571]">2024 — Present</p>
                </div>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#5d5b58]">Contributing to applications and services that support quantitative risk-management and risk-adjustment workflows. The work stretches across frontend, backend, data, and the technical decisions that connect them.</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="Current engineering responsibilities">
                  {experienceItems.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#595754]"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#456fe8]" />{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 border-b border-[#1b1c1d]/10 pb-10 sm:flex-row sm:items-end">
              <div><p className="eyebrow">Engineering philosophy</p><h2 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">How I think<br />about software.</h2></div>
              <p className="max-w-xs text-sm leading-6 text-[#6a6865]">A few principles I return to when systems, screens, or product decisions get more complex.</p>
            </div>
            <div className="mt-4 divide-y divide-[#1b1c1d]/10">
              {principles.map((principle) => (
                <article key={principle.number} className="group grid gap-5 py-7 transition-colors duration-200 hover:bg-white/55 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,0.9fr)] sm:items-baseline sm:px-4">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-[#456fe8]">{principle.number}</p>
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] transition-transform duration-200 group-hover:translate-x-1">{principle.title}</h3>
                  <p className="text-sm leading-6 text-[#686663]">{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#456fe8] px-5 py-20 text-white sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
              <div>
                <p className="eyebrow text-white/65">Contact</p>
                <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">Have an interesting idea, a technical problem to explore, or simply want to compare notes?</p>
              </div>
              <div>
                <h2 className="max-w-3xl font-serif text-[clamp(3.3rem,7vw,7rem)] leading-[0.85] tracking-[-0.075em]">Let’s build<br />something clear.</h2>
                <a href="mailto:hello@shreypatel.dev" className="group mt-10 inline-flex items-center gap-3 border-b border-white/45 pb-2 text-lg font-semibold tracking-[-0.03em] transition-colors hover:border-white sm:text-2xl">hello@shreypatel.dev <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
                <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold">
                  <a href="https://github.com/" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"><Github className="h-4 w-4" /> GitHub <AnchorArrow /></a>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"><Linkedin className="h-4 w-4" /> LinkedIn <AnchorArrow /></a>
                  <a href="mailto:hello@shreypatel.dev" className="group inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"><Mail className="h-4 w-4" /> Email <AnchorArrow /></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/15 bg-[#1b1c1d] px-5 py-7 text-[#c8c6c1] sm:px-8 lg:ml-72 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-[11px] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Shrey Patel. Built with clarity &amp; care.</p>
          <p className="uppercase tracking-[0.12em] text-[#8e8c87]">UI · Frontend · UX · Systems</p>
        </div>
      </footer>
    </div>
  );
}
