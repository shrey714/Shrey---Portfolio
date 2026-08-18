/**
 * Quiet Product Studio — editorial product-design page.
 * Warm porcelain, ink typography, Cobalt Mist accents, off-center content rail,
 * and restrained motion communicate a product-minded engineering practice.
 */
import { type CSSProperties, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { portfolioContent as content } from "@/content/portfolioContent";
import { getAppearanceToggleState } from "@/lib/appearanceToggle";
import { getAchievementVisualKind } from "@/lib/achievementPresentation";
import { getEvidenceScrollMotion } from "@/lib/evidenceMotion";
import { getSkillVisual } from "@/lib/skillPresentation";
import { getActiveNavigationIndex } from "@/lib/sidebarNavigation";

const hero = content.hero;
const navItems = content.navigation;
type WorkProject = (typeof content.work.projects)[number] & { visualImageUrl?: string };
type AchievementEntry = (typeof content.achievements.entries)[number] & { visualImageUrl?: string };

function AnchorArrow() {
  return <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleState = getAppearanceToggleState(isDark, {
    light: content.ui.themeLightLabel,
    dark: content.ui.themeDarkLabel,
  });

  return (
    <button type="button" onClick={toggleTheme} className="appearance-icon-button" data-theme={toggleState.theme} aria-label={toggleState.ariaLabel} aria-pressed={isDark} title={toggleState.ariaLabel}>
      <span className="appearance-icon-stage" aria-hidden="true">
        <Sun className="appearance-icon appearance-icon-sun" />
        <Moon className="appearance-icon appearance-icon-moon" />
      </span>
      <span className="sr-only">{toggleState.status}</span>
    </button>
  );
}

function HeroVisual({ index }: { index: number }) {
  if (index === 0) {
    const mobileHeroImageUrl = hero.imageUrl.endsWith("/shrey-hero-editorial-1024.webp")
      ? "/api/media/portfolio/hero/shrey-hero-editorial-768.webp"
      : undefined;

    return (
      <picture>
        {mobileHeroImageUrl && <source media="(max-width: 767px)" srcSet={mobileHeroImageUrl} type="image/webp" />}
        <img src={hero.imageUrl} alt={hero.slides[0].alt} fetchPriority="high" decoding="async" width={1571} height={1080} className="h-full w-full rounded-[1.15rem] object-cover" />
      </picture>
    );
  }

  if (index === 1) return <div className="hero-visual hero-interface" aria-label={hero.slides[1].alt} role="img"><div className="hero-visual-topline"><span>{hero.slides[1].metaLeft}</span><span>{hero.slides[1].metaRight}</span></div><div className="hero-interface-grid"><div className="hero-interface-rail"><i /><i className="is-active" /><i /><i /></div><div className="hero-interface-body"><div className="hero-line short" /><div className="hero-line wide" /><div className="hero-interface-cards"><div /><div className="is-cobalt" /><div /></div><div className="hero-table-lines"><i /><i /><i /><i /></div></div></div><div className="hero-visual-annotation">{hero.slides[1].annotation}</div></div>;

  if (index === 2) return <div className="hero-visual hero-systems" aria-label={hero.slides[2].alt} role="img"><div className="hero-visual-topline"><span>{hero.slides[2].metaLeft}</span><span>{hero.slides[2].metaRight}</span></div><div className="hero-system-map"><div className="hero-system-node node-a">{hero.slides[2].nodes?.[0]}</div><div className="hero-system-node node-b">{hero.slides[2].nodes?.[1]}</div><div className="hero-system-node node-c">{hero.slides[2].nodes?.[2]}</div><span className="hero-system-link link-ab" /><span className="hero-system-link link-bc" /><span className="hero-system-orbit" /></div><div className="hero-visual-annotation">{hero.slides[2].annotation}</div></div>;

  return <div className="hero-visual hero-detail" aria-label={hero.slides[3].alt} role="img"><div className="hero-visual-topline"><span>{hero.slides[3].metaLeft}</span><span>{hero.slides[3].metaRight}</span></div><div className="hero-detail-board"><div className="hero-detail-block block-one" /><div className="hero-detail-block block-two" /><div className="hero-detail-block block-three" /><div className="hero-detail-dot dot-one" /><div className="hero-detail-dot dot-two" /></div><div className="hero-visual-annotation">{hero.slides[3].annotation}</div></div>;
}

function ProductEvidence({ project }: { project: WorkProject }) {
  const [isVisible, setIsVisible] = useState(false);
  const evidenceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = evidenceRef.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame: number | null = null;

    const resetScrollMotion = () => {
      element.style.removeProperty("--evidence-scroll-y");
      element.style.removeProperty("--evidence-scroll-scale");
    };

    const updateScrollMotion = () => {
      animationFrame = null;
      if (reducedMotion.matches) {
        resetScrollMotion();
        setIsVisible(true);
        return;
      }

      const bounds = element.getBoundingClientRect();
      const motion = getEvidenceScrollMotion({ top: bounds.top, height: bounds.height, viewportHeight: window.innerHeight }, reducedMotion.matches);
      if (!motion) {
        resetScrollMotion();
        return;
      }

      element.style.setProperty("--evidence-scroll-y", `${motion.translateY}px`);
      element.style.setProperty("--evidence-scroll-scale", motion.scale.toString());
    };

    const requestScrollMotion = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateScrollMotion);
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        resetScrollMotion();
        setIsVisible(true);
      } else {
        requestScrollMotion();
      }
    };

    if (reducedMotion.matches) setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(element);
    requestScrollMotion();
    window.addEventListener("scroll", requestScrollMotion, { passive: true });
    window.addEventListener("resize", requestScrollMotion);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestScrollMotion);
      window.removeEventListener("resize", requestScrollMotion);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const header = <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45"><span>{project.visualMeta}</span><span className="flex gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-white/25" /><i className="h-1.5 w-1.5 rounded-full bg-white/25" /><i className="h-1.5 w-1.5 rounded-full bg-[#456fe8]" /></span></div>;
  const rows = project.visualRows.map((row, index) => <div key={row} className="flex items-center gap-3"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${index === 1 ? "bg-[#456fe8]" : "bg-white/25"}`} /><span className="h-1.5 flex-1 rounded-full bg-white/20" /><span className="h-1.5 w-9 rounded-full bg-white/10" /></div>);
  const customImage = project.visualLayout === "custom-image" && project.visualImageUrl;

  const layout = (() => {
    if (customImage) return <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] border border-white/10 bg-[#202124]"><img src={project.visualImageUrl} alt={`Project visual for ${project.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12"><p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">Custom project image</p></div></div>;

    if (project.visualLayout === "layout-1") return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">{header}<div className="mt-4 grid grid-cols-[0.34fr_0.66fr] gap-3"><div className="rounded-lg border border-white/9 bg-white/[0.035] p-2.5"><div className="h-1.5 w-12 rounded-full bg-white/35" /><div className="mt-4 space-y-2">{[0, 1, 2, 3].map(item => <div key={item} className={`h-5 rounded-md border border-white/[0.06] ${item === 1 ? "bg-[#456fe8]/80" : "bg-white/[0.045]"}`} />)}</div><div className="mt-4 rounded-md border border-[#456fe8]/40 bg-[#456fe8]/15 p-2"><div className="h-1.5 w-8 rounded-full bg-[#9fb2ff]" /><div className="mt-2 h-1 w-full rounded-full bg-white/15" /></div></div><div className="rounded-lg border border-white/9 bg-white/[0.035] p-3"><div className="flex items-start justify-between"><div><div className="h-1.5 w-20 rounded-full bg-white/65" /><div className="mt-2 h-1.5 w-14 rounded-full bg-white/20" /></div><div className="h-6 w-10 rounded-md bg-[#456fe8]" /></div><div className="mt-5 grid grid-cols-3 gap-2">{[0, 1, 2].map(item => <div key={item} className="rounded-md border border-white/[0.08] bg-white/[0.035] p-2"><div className="h-1 w-5 rounded-full bg-white/25" /><div className={`mt-3 h-8 rounded ${item === 1 ? "bg-[#456fe8]/60" : "bg-white/[0.09]"}`} /></div>)}</div><div className="mt-4 space-y-2.5">{rows}</div></div></div></div>;

    if (project.visualLayout === "layout-2") return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">{header}<div className="mt-4 grid grid-cols-[0.45fr_0.55fr] gap-3"><div className="rounded-lg border border-white/9 bg-white/[0.035] p-3"><div className="flex items-center justify-between"><span className="h-2 w-12 rounded-full bg-white/45" /><span className="h-5 w-5 rounded-md bg-[#456fe8]" /></div><div className="mt-4 grid grid-cols-2 gap-2">{[0, 1, 2, 3].map(item => <div key={item} className={`aspect-square rounded-md border border-white/[0.08] ${item === 2 ? "bg-[#456fe8]/65" : "bg-white/[0.055]"}`} />)}</div></div><div className="rounded-lg border border-white/9 bg-white/[0.035] p-3"><div className="flex gap-2"><div className="h-16 flex-1 rounded-md bg-[#456fe8]/50" /><div className="h-16 w-9 rounded-md bg-white/[0.09]" /></div><div className="mt-4 space-y-2.5">{rows}</div></div></div></div>;

    if (project.visualLayout === "layout-3") return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">{header}<div className="relative mt-4 flex aspect-[16/7] items-center justify-center overflow-hidden rounded-lg border border-white/8 bg-[radial-gradient(circle_at_center,rgba(69,111,232,0.34),transparent_38%)]"><span className="absolute h-24 w-24 rounded-full border border-[#456fe8]/70" /><span className="absolute h-44 w-44 rounded-full border border-dashed border-white/15" /><div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-[#456fe8] text-[8px] font-semibold uppercase tracking-[0.13em] text-white">Flow</div><div className="absolute left-[12%] top-[20%] h-9 w-14 rounded-md border border-white/15 bg-white/[0.07]" /><div className="absolute bottom-[17%] right-[12%] h-9 w-14 rounded-md border border-white/15 bg-white/[0.07]" /><span className="absolute left-[28%] top-[38%] h-px w-[23%] rotate-[18deg] bg-[#456fe8]/80" /><span className="absolute bottom-[35%] right-[28%] h-px w-[23%] -rotate-[20deg] bg-[#456fe8]/80" /></div></div>;

    if (project.visualLayout === "layout-4") return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">{header}<div className="mt-4 grid grid-cols-[0.62fr_0.38fr] gap-3"><div className="relative min-h-40 overflow-hidden rounded-lg bg-[#456fe8]"><span className="absolute left-4 top-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/70">Editorial</span><div className="absolute -bottom-7 -right-6 h-32 w-32 rounded-full border-[18px] border-white/20" /><div className="absolute bottom-4 left-4 h-3 w-24 rounded-full bg-white/80" /><div className="absolute bottom-10 left-4 h-2 w-16 rounded-full bg-white/35" /></div><div className="space-y-3"><div className="h-20 rounded-lg border border-white/10 bg-white/[0.055]" /><div className="h-16 rounded-lg border border-white/10 bg-[#456fe8]/30" /><div className="h-8 rounded-lg border border-white/10 bg-white/[0.055]" /></div></div></div>;

    return <div className="rounded-[1rem] border border-white/10 bg-[#202124] p-3 sm:p-4">{header}<div className="mt-4 grid grid-cols-[0.37fr_0.63fr] gap-3"><div className="rounded-lg border border-white/9 bg-white/[0.035] p-3"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[10px] border-[#456fe8]/70 border-r-white/10 text-[9px] font-semibold text-white/70">72%</div><div className="mt-4 space-y-2">{["Signal", "Reach", "Trend"].map((label, index) => <div key={label} className="flex items-center justify-between text-[8px] text-white/45"><span>{label}</span><span className={index === 1 ? "text-[#9fb2ff]" : ""}>+{index + 2}%</span></div>)}</div></div><div className="rounded-lg border border-white/9 bg-white/[0.035] p-3"><div className="flex h-24 items-end gap-2">{[35, 58, 44, 76, 62, 90, 70].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={`flex-1 rounded-t-sm ${index === 5 ? "bg-[#456fe8]" : "bg-white/15"}`} />)}</div><div className="mt-4 space-y-2.5">{rows}</div></div></div></div>;
  })();

  return <div ref={evidenceRef} className={`project-evidence relative overflow-hidden rounded-[1.45rem] border border-white/12 bg-[#26272a] p-3 shadow-[0_24px_55px_-40px_rgba(0,0,0,0.8)] ${isVisible ? "is-visible" : ""}`}><div className="project-evidence-glow absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(69,111,232,0.22),transparent_35%)]" /><div className="relative">{layout}</div><div className="relative flex items-end justify-between px-1 pb-1 pt-4 text-white"><p className="max-w-[12rem] text-xs font-medium tracking-[-0.02em] text-white/80 sm:text-sm">{project.visualTitle}</p><span className="rounded-full border border-white/14 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-white/60">{customImage ? "Custom image" : project.visualLayout.replace("layout-", "Layout ")}</span></div></div>;
}

function SystemsEvidence() {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-[#1b1c1d]/10 bg-[#f5f3ed] p-5 shadow-[0_25px_55px_-42px_rgba(27,28,29,0.42)] sm:p-7">
      <div className="absolute inset-0 opacity-50 dot-field" />
      <div className="relative grid grid-cols-[0.24fr_0.52fr_0.24fr] items-center gap-2 sm:gap-4">
        <div className="space-y-3"><div className="h-10 rounded-lg border border-[#1b1c1d]/10 bg-white/70" /><div className="h-6 rounded-lg border border-[#1b1c1d]/10 bg-white/55" /><div className="h-14 rounded-lg border border-[#1b1c1d]/10 bg-[#456fe8]/12" /></div>
        <div className="relative flex aspect-square items-center justify-center rounded-full border border-[#456fe8]/30 bg-[#456fe8]/8"><div className="absolute h-[70%] w-[70%] rounded-full border border-dashed border-[#456fe8]/45" /><div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#1b1c1d]/15 bg-[#1b1c1d] text-[9px] font-semibold uppercase tracking-[0.14em] text-white">{content.practice.visualFlow}</div><div className="absolute right-1 top-5 h-3 w-3 rounded-full border-2 border-[#f5f3ed] bg-[#456fe8]" /></div>
        <div className="space-y-3"><div className="ml-auto h-14 w-full rounded-lg border border-[#1b1c1d]/10 bg-white/70" /><div className="ml-auto h-6 w-3/4 rounded-lg border border-[#1b1c1d]/10 bg-white/55" /><div className="ml-auto h-10 w-full rounded-lg border border-[#1b1c1d]/10 bg-[#1b1c1d]/[0.06]" /></div>
      </div>
      <div className="relative mt-6 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-t border-[#1b1c1d]/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#777571]"><span className="whitespace-nowrap">{content.practice.visualSystemNote}</span><span className="whitespace-nowrap text-[#456fe8]">{content.practice.visualTag}</span></div>
    </div>
  );
}

function AchievementMark({ entry }: { entry: AchievementEntry }) {
  const image = getAchievementVisualKind(entry) === "image";

  if (image) {
    return <div className="flex h-7 w-7 shrink-0 items-center justify-center sm:h-8 sm:w-8"><img src={entry.visualImageUrl} alt={entry.imageAlt} loading="lazy" decoding="async" width={32} height={32} className="h-full w-full object-contain" /></div>;
  }

  return <div role="img" aria-label={entry.imageAlt} title={entry.visualLabel} className="flex h-7 w-7 shrink-0 items-center justify-center text-[#456fe8] sm:h-8 sm:w-8"><Award className="h-4 w-4" aria-hidden="true" /></div>;
}

export default function Home() {
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [showMobileIdentity, setShowMobileIdentity] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "", website: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const menuCloseTimer = useRef<number | null>(null);
  const observedIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeNavIndex = getActiveNavigationIndex(observedIds, active);
  const openMenu = () => {
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    setMenuMounted(true);
    window.requestAnimationFrame(() => setMenuOpen(true));
  };

  const closeMenu = () => {
    setMenuOpen(false);
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    menuCloseTimer.current = window.setTimeout(() => setMenuMounted(false), 240);
  };

  const showHeroSlide = (index: number) => setActiveHeroSlide((index + hero.slides.length) % hero.slides.length);

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");
    setContactError("");
    setContactSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const result = (await response.json().catch(() => null)) as { accepted?: boolean; message?: string } | null;
      if (!response.ok || !result?.accepted) throw new Error(result?.message ?? "Your message could not be sent right now. Please try again shortly or use the email link.");
      setContactStatus("success");
      setContactForm({ name: "", email: "", message: "", website: "" });
    } catch (error) {
      setContactStatus("error");
      setContactError(error instanceof Error ? error.message : "Your message could not be sent right now. Please try again shortly or use the email link.");
    } finally {
      setContactSubmitting(false);
    }
  };

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

  useEffect(() => {
    const updateMobileIdentity = () => setShowMobileIdentity(window.scrollY > 150);
    updateMobileIdentity();
    window.addEventListener("scroll", updateMobileIdentity, { passive: true });
    return () => window.removeEventListener("scroll", updateMobileIdentity);
  }, []);

  useEffect(() => {
    if (heroPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActiveHeroSlide((slide) => (slide + 1) % hero.slides.length), 3800);
    return () => window.clearTimeout(timer);
  }, [activeHeroSlide, heroPaused]);

  useEffect(() => {
    if (!menuMounted) return;

    const { body, documentElement } = document;
    const bodyOverflow = body.style.overflow;
    const documentOverflow = documentElement.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      body.style.overflow = bodyOverflow;
      documentElement.style.overflow = documentOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuMounted]);

  useEffect(() => () => {
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
  }, []);

  return (
    <div className="portfolio min-h-screen overflow-x-clip bg-[#f6f4ef] text-[#1b1c1d] selection:bg-[#456fe8] selection:text-white">
      <header className="theme-light-surface fixed inset-x-0 top-0 z-50 border-b border-[#1b1c1d]/8 bg-[#f6f4ef]/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="#top" tabIndex={showMobileIdentity ? 0 : -1} aria-hidden={!showMobileIdentity} className={`mobile-header-identity text-sm font-semibold tracking-[-0.03em] ${showMobileIdentity ? "is-visible" : ""}`} aria-label={content.ui.homeAriaLabel}>{content.identity.name}</a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1b1c1d]/12 bg-white/45 text-[#1b1c1d] transition-transform duration-200 active:scale-95"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu-layer lg:hidden ${menuMounted ? "is-mounted" : ""} ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuMounted}>
        <button type="button" className="mobile-menu-backdrop" tabIndex={menuOpen ? 0 : -1} aria-label="Close navigation" onClick={closeMenu} />
        <nav className="mobile-menu-panel theme-light-surface" aria-label={content.ui.mobileNavigationLabel} aria-hidden={!menuOpen}>
          <div className="flex items-end justify-between border-b border-[#1b1c1d]/10 pb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777571]">{content.ui.navigateLabel}</p>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#456fe8]">00—04</span>
          </div>
          <div className="mt-3 space-y-1">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1} className="mobile-menu-link group flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-semibold tracking-[-0.025em] text-[#343434] transition-colors hover:bg-white/80">
                <span className="flex items-center gap-3"><span className="text-[10px] font-semibold tabular-nums text-[#456fe8]">{item.number}</span>{item.label}</span>
                <ChevronRight className="h-4 w-4 opacity-40 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
          <div className="mt-5 flex justify-end border-t border-[#1b1c1d]/10 pt-4"><ThemeToggle /></div>
        </nav>
      </div>

      <aside className="theme-light-surface fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[#1b1c1d]/10 bg-[#f6f4ef] px-7 py-8 lg:flex">
        <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-1 bg-[#456fe8]" />
        <a href="#top"><p className="text-sm font-semibold tracking-[-0.04em]">{content.identity.name}</p><p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#676766]">{content.identity.pageDescriptor}</p></a>

        <nav className="relative mt-20 flex flex-col gap-1" aria-label={content.ui.sectionNavigationLabel} style={{ "--active-nav-index": activeNavIndex } as CSSProperties}>
          <span aria-hidden="true" className="sidebar-nav-active-indicator pointer-events-none absolute inset-x-0 top-0 h-10 rounded-lg bg-white/75 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"><span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#456fe8]" /></span>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`group relative z-10 flex h-10 items-center gap-3 rounded-lg px-2 text-[13px] transition-[color,transform] duration-200 ${
                active === item.id ? "text-[#456fe8]" : "sidebar-nav-inactive text-[#777673]"
              }`}
            >
              <span className={`text-[10px] tabular-nums ${active === item.id ? "text-[#456fe8]" : "text-[#aaa8a3]"}`}>{item.number}</span>
              <span className={`font-medium tracking-[-0.01em] ${active === item.id ? "text-[#456fe8]" : ""}`}>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#1b1c1d]/10 pt-5">
          <div className="mb-4 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777571]">{content.identity.appearanceLabel}</span><ThemeToggle /></div>
          <p className="flex items-center gap-2 text-[11px] font-medium text-[#676766]"><span className="h-1.5 w-1.5 rounded-full bg-[#456fe8]" /> {content.identity.availability}</p>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-[#898783]"><MapPin className="h-3.5 w-3.5" /> {content.identity.location}</p>
          <p className="mt-1 text-[11px] text-[#898783]">{content.identity.railNote}</p>
        </div>
      </aside>

      <main className="pt-[64px] lg:ml-72 lg:pt-0">
        <section id="top" className="theme-light-surface relative isolate min-h-[calc(100svh-64px)] overflow-hidden px-5 pb-12 pt-16 sm:px-8 sm:pt-24 lg:min-h-screen lg:px-12 lg:pt-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 dot-field opacity-60" />
          <div className="pointer-events-none absolute -right-20 top-4 h-[27rem] w-[27rem] rounded-full bg-[#456fe8]/7 blur-3xl sm:h-[36rem] sm:w-[36rem]" />
          <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-12 lg:min-h-[calc(100svh-6rem)]">
            <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.72fr)] lg:gap-16">
              <div className="max-w-3xl pt-2 lg:pt-20">
                <div className="reveal-in mb-8 [animation-delay:20ms]"><p className="text-sm font-semibold tracking-[-0.04em]">{content.identity.name}</p><p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#777571]">{content.identity.roleDescriptor}</p></div>
                <div className="reveal-in flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62615e] [animation-delay:40ms]">
                  <span className="h-px w-7 bg-[#456fe8]" />
                  {hero.roleLine}
                </div>
                <h1 className="reveal-in mt-7 font-serif text-[clamp(3.35rem,8vw,7.3rem)] leading-[0.88] tracking-[-0.07em] text-[#1b1c1d] [animation-delay:120ms]">
                  {hero.heading[0]}
                  <span className="block pl-[0.06em] text-[#456fe8]">{hero.heading[1]}</span>
                  <span className="block">{hero.heading[2]}</span>
                </h1>
                <p className="reveal-in mt-8 max-w-xl text-[17px] leading-7 tracking-[-0.02em] text-[#595856] [animation-delay:200ms] sm:text-lg">
                  {hero.introduction}
                </p>
                <div className="reveal-in mt-9 flex flex-wrap items-center gap-3 [animation-delay:280ms]">
                  <a href="#work" className="group inline-flex items-center gap-2 rounded-full bg-[#1b1c1d] px-5 py-3 text-sm font-semibold text-[#f6f4ef] transition-all duration-200 hover:bg-[#456fe8] active:scale-[0.97]">
                    {hero.workCta} <ArrowDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                  <a href="#contact" className="group inline-flex items-center gap-2 rounded-full border border-[#1b1c1d]/14 bg-white/50 px-5 py-3 text-sm font-semibold text-[#1b1c1d] transition-colors duration-200 hover:border-[#456fe8]/40 hover:bg-white active:scale-[0.97]">
                    {hero.contactCta} <AnchorArrow />
                  </a>
                  <a href={hero.resume.url} download={hero.resume.filename} className="group inline-flex items-center gap-2 rounded-full border border-[#1b1c1d]/14 bg-transparent px-5 py-3 text-sm font-semibold text-[#1b1c1d] transition-colors duration-200 hover:border-[#456fe8]/45 hover:bg-white/55 active:scale-[0.97]">
                    {hero.resume.label} <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                </div>
              </div>

              <div className="reveal-in relative ml-auto w-full max-w-[37rem] [animation-delay:180ms]">
                <div className="hero-carousel relative overflow-hidden rounded-[1.55rem] border border-white/80 bg-[#e9e6df] p-2 shadow-[0_28px_80px_-42px_rgba(27,28,29,0.42)]" role="region" aria-roledescription="carousel" aria-label={hero.carouselAriaLabel} onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)} onFocus={() => setHeroPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHeroPaused(false); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") showHeroSlide(activeHeroSlide - 1); if (event.key === "ArrowRight") showHeroSlide(activeHeroSlide + 1); }} tabIndex={0}>
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[1.15rem]">
                    <div key={activeHeroSlide} className="hero-slide h-full w-full"><HeroVisual index={activeHeroSlide} /></div>
                  </div>
                  <div className="hero-carousel-footer"><div key={activeHeroSlide} className="hero-carousel-copy" aria-live="polite"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#456fe8]">{hero.slides[activeHeroSlide].label}</p><p className="mt-1 max-w-[15rem] text-[10px] leading-4 text-[#66645f]">{hero.slides[activeHeroSlide].caption}</p></div><div className="hero-carousel-actions"><span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#696765]">0{activeHeroSlide + 1} / 0{hero.slides.length}</span><div className="flex gap-1.5"><button type="button" onClick={() => showHeroSlide(activeHeroSlide - 1)} className="hero-carousel-control" aria-label={hero.previousVisualLabel}><ChevronLeft className="h-3.5 w-3.5" /></button><button type="button" onClick={() => showHeroSlide(activeHeroSlide + 1)} className="hero-carousel-control" aria-label={hero.nextVisualLabel}><ChevronRight className="h-3.5 w-3.5" /></button></div></div><div className="hero-carousel-indicators" role="tablist" aria-label={hero.carouselSelectorLabel}>{hero.slides.map((slide, index) => <button key={slide.label} type="button" role="tab" aria-selected={activeHeroSlide === index} aria-label={`Show ${slide.label}`} onClick={() => showHeroSlide(index)} className={`hero-carousel-dot ${activeHeroSlide === index ? "is-active" : ""}`} />)}</div></div>
                </div>
                <div className="ml-0 mt-4 hidden w-44 rounded-2xl border border-[#1b1c1d]/10 bg-[#f6f4ef]/90 p-4 shadow-[0_18px_45px_-30px_rgba(27,28,29,0.45)] backdrop-blur sm:block lg:ml-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#767570]">{hero.basedInLabel}</p>
                  <p className="mt-1 text-sm font-semibold tracking-[-0.03em]">{content.identity.location}</p>
                  <p className="mt-2 text-xs leading-4 text-[#73716e]">{hero.basedInDescription}</p>
                </div>
              </div>
            </div>

            <div className="reveal-in flex flex-col gap-4 border-t border-[#1b1c1d]/10 pt-5 text-[11px] text-[#6d6b67] sm:flex-row sm:items-center sm:justify-between [animation-delay:360ms]">
              <p className="font-medium uppercase tracking-[0.13em]">{hero.roleSnapshot}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {hero.focusAreas.map((area, index) => <span key={area}>{index > 0 && <span className="mr-5">•</span>}{area}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="theme-work-surface relative bg-[#e9e6df] px-5 py-12 text-[#f4f1eb] sm:px-8 sm:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#1b1c1d]/10 bg-[#1b1c1d] px-6 py-10 shadow-[0_32px_70px_-48px_rgba(27,28,29,0.65)] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-10 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-[#aebff6]">{content.work.eyebrow}</p>
                <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.75rem,5vw,5rem)] leading-[0.92] tracking-[-0.065em]">{content.work.heading}</h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[#c6c4bf]">{content.work.introduction}</p>
            </div>

            <div className="mt-10 space-y-16 lg:mt-14 lg:space-y-24">
              {content.work.projects.map((project, index) => {
                const visualFirst = index % 2 === 0;
                const primaryUrl = project.liveUrl || project.repositoryUrl;
                const details = (
                  <div className="lg:pb-2">
                    <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.14em] text-[#a8a6a2]"><span>{project.meta}</span><span>{project.date}</span></div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] lg:text-[1.65rem]">{project.name}</h3>
                    <p className="mt-2 text-base text-[#d0cdc7]">{project.type}</p>
                    <p className="mt-5 text-sm leading-6 text-[#aaa8a3]">{project.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.11em] text-[#bab7b1]">
                      {project.technologies.map((tag) => <span key={tag} className="rounded-full border border-white/15 px-3 py-1.5">{tag}</span>)}
                    </div>
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-[#f4f1eb]">
                      <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 hover:text-[#aebff6]">View source <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></a>
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 hover:text-[#aebff6]">{project.cta} <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" /></a>}
                    </div>
                  </div>
                );
                const visual = (
                  <a href={primaryUrl} target="_blank" rel="noreferrer" className={`relative block transition-transform duration-300 hover:-translate-y-1 ${project.visualLayout === "layout-3" ? "lg:max-w-[31rem]" : ""}`} aria-label={project.ariaLabel}>
                    <ProductEvidence project={project} />
                    <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-[#1b1c1d]/65 p-2.5 text-white backdrop-blur-sm"><ArrowUpRight className="h-4 w-4" /></span>
                  </a>
                );

                return <article key={project.name} className="group grid gap-7 lg:grid-cols-2 lg:items-end lg:gap-10">{visualFirst ? <>{visual}{details}</> : <><div className="order-2 lg:order-1">{details}</div><div className="order-1 lg:order-2">{visual}</div></>}</article>;
              })}
            </div>
          </div>
        </section>

        <section id="practice" className="theme-light-surface relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute inset-0 paper-glow" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 border-b border-[#1b1c1d]/10 pb-12 lg:grid-cols-[0.66fr_1.34fr] lg:gap-20">
              <div>
                <p className="eyebrow">{content.practice.eyebrow}</p>
                <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">{content.practice.heading}</h2>
              </div>
              <p className="max-w-2xl self-end text-lg leading-8 tracking-[-0.025em] text-[#575653]">{content.practice.introduction}</p>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-20">
              <figure className="mx-auto w-full max-w-[29rem] lg:mx-0">
                <SystemsEvidence />
                <figcaption className="mt-3 flex justify-start lg:justify-end"><span className="rounded-full border border-[#1b1c1d]/10 bg-[#f6f4ef]/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d5b58] backdrop-blur-sm">{content.practice.visualCallout}</span></figcaption>
              </figure>
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {content.practice.disciplines.map((discipline, index) => (
                  <div key={discipline.title} className="border-t border-[#1b1c1d]/12 pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#456fe8]">0{index + 1}</p>
                    <h3 className="mt-3 text-lg font-semibold tracking-[-0.035em]">{discipline.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#6a6865]">{discipline.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
              {content.practice.skills.map((skill, index) => {
                const visual = getSkillVisual(skill.name);
                const Icon = visual.Icon;

                return (
                  <article key={skill.name} style={{ transitionDelay: `${index * 35}ms` }} className="group relative min-h-44 overflow-hidden rounded-[1.2rem] border border-[#1b1c1d]/10 bg-[#f6f4ef] p-5 shadow-[0_16px_35px_-32px_rgba(27,28,29,0.65)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_42px_-28px_rgba(27,28,29,0.35)] motion-reduce:transform-none motion-reduce:transition-none">
                    <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border ${visual.ringColor} opacity-45 transition-transform duration-500 group-hover:scale-125 motion-reduce:transform-none`} />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${visual.iconSurface} ${visual.iconColor} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#9b9994]">0{index + 1}</span>
                      </div>
                      <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#686662]">{skill.name}</p>
                      <p className="mt-4 text-xs leading-5 text-[#71706c]">{skill.tools}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="achievements" className="theme-soft-surface border-t border-[#1b1c1d]/10 bg-[#eeece6] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 border-b border-[#1b1c1d]/10 pb-12 lg:grid-cols-[0.66fr_1.34fr] lg:gap-20">
              <div><p className="eyebrow">{content.achievements.eyebrow}</p><h2 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">{content.achievements.heading}</h2></div>
              <p className="max-w-2xl self-end text-lg leading-8 tracking-[-0.025em] text-[#575653]">{content.achievements.introduction}</p>
            </div>
            <div className="mt-5">
              {content.achievements.entries.map((entry, index) => (
                <article key={`${entry.title}-${entry.organization}`} className="flex items-center gap-3 border-b border-[#1b1c1d]/10 py-3.5 sm:gap-4 sm:py-4">
                  <AchievementMark entry={entry} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold tracking-[-0.03em] text-[#292a2a] sm:text-base">{entry.title}</h3>
                    <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.11em] text-[#6d6b67] sm:text-[10px]">{entry.organization} <span className="px-1 text-[#aaa8a3]">·</span> {entry.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="theme-soft-surface border-y border-[#1b1c1d]/10 bg-[#eeece6] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
              <div>
                <p className="eyebrow">{content.about.eyebrow}</p>
                <h2 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">{content.about.heading}</h2>
                <div className="mt-8 space-y-3 text-sm text-[#64625e]">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#456fe8]" /> {content.identity.location}</p>
                  <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#456fe8]" /> {content.about.experienceLabel}</p>
                </div>
              </div>
              <div>
                <p className="max-w-3xl text-[clamp(1.55rem,3vw,2.45rem)] leading-[1.18] tracking-[-0.045em] text-[#292a2a]">{content.about.statement}</p>
                <p className="mt-7 max-w-2xl text-base leading-7 text-[#62605d]">{content.about.description}</p>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {content.about.facts.map((fact) => (
                    <div key={fact.label} className="border-t border-[#1b1c1d]/12 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777571]">{fact.label}</p>
                      <p className="mt-2 text-sm font-semibold tracking-[-0.025em]">{fact.primary}</p>
                      <p className="mt-1 text-xs text-[#706e6a]">{fact.secondary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-12 border-t border-[#1b1c1d]/10 pt-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
              <div>
                <p className="eyebrow">{content.experience.eyebrow}</p>
                <p className="mt-4 text-sm leading-6 text-[#6a6865]">{content.experience.introduction}</p>
              </div>
              <div>
                <div className="space-y-10">
                  {content.experience.entries.map((entry) => (
                    <article key={`${entry.company}-${entry.role}-${entry.date}`} className="border-b border-[#1b1c1d]/10 pb-10 last:border-b-0 last:pb-0">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div><h3 className="text-2xl font-semibold tracking-[-0.05em]">{entry.company}</h3><p className="mt-1 text-sm text-[#676561]">{entry.role}</p></div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777571]">{entry.date}</p>
                      </div>
                      <p className="mt-6 max-w-2xl text-base leading-7 text-[#5d5b58]">{entry.description}</p>
                      <ul className="mt-7 grid gap-3 sm:grid-cols-2" aria-label={entry.responsibilityLabel}>
                        {entry.responsibilities.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#595754]"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-[#456fe8]" />{item}</li>)}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="philosophy" className="theme-light-surface px-5 py-20 sm:px-8 sm:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 border-b border-[#1b1c1d]/10 pb-10 sm:flex-row sm:items-end">
              <div><p className="eyebrow">{content.philosophy.eyebrow}</p><h2 className="mt-4 font-serif text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">{content.philosophy.headingLineOne}<br />{content.philosophy.headingLineTwo}</h2></div>
              <p className="max-w-xs text-sm leading-6 text-[#6a6865]">{content.philosophy.introduction}</p>
            </div>
            <div className="mt-6">
              {content.philosophy.principles.map((principle) => (
                <article key={principle.number} className="philosophy-entry group grid grid-cols-[2.65rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-7 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,0.9fr)] sm:items-baseline sm:gap-x-7 sm:gap-y-0">
                  <p className="pt-1 text-[11px] font-semibold tracking-[0.14em] text-[#456fe8]">{principle.number}</p>
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] transition-transform duration-200 group-hover:translate-x-1">{principle.title}</h3>
                  <p className="col-span-2 max-w-xl text-sm leading-6 text-[#686663] sm:col-span-1 sm:max-w-none">{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="lg:ml-72">
        <section id="contact" className="footer-contact-panel bg-[#436ee4] px-5 py-20 text-white sm:px-8 sm:py-28 lg:mx-8 lg:my-8 lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-white/15 lg:px-12 lg:shadow-[0_28px_65px_-42px_rgba(27,28,29,0.58)] xl:mx-12 xl:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
              <div>
                <p className="eyebrow contact-eyebrow">{content.contact.eyebrow}</p>
                <p className="mt-5 max-w-xs text-sm leading-6 text-white">{content.contact.introduction}</p>
              </div>
              <div>
                <h2 className="max-w-3xl font-serif text-[clamp(3.3rem,7vw,7rem)] leading-[0.85] tracking-[-0.075em]">{content.contact.headingLineOne}<br />{content.contact.headingLineTwo}</h2>
                <form className="contact-form mt-10 max-w-2xl" onSubmit={submitContact}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="contact-form-field"><span>{content.contact.form.nameLabel}</span><input required minLength={2} maxLength={80} autoComplete="name" value={contactForm.name} onChange={event => setContactForm(current => ({ ...current, name: event.target.value }))} placeholder={content.contact.form.namePlaceholder} /></label>
                    <label className="contact-form-field"><span>{content.contact.form.emailLabel}</span><input required type="email" maxLength={254} autoComplete="email" value={contactForm.email} onChange={event => setContactForm(current => ({ ...current, email: event.target.value }))} placeholder={content.contact.form.emailPlaceholder} /></label>
                  </div>
                  <label className="contact-form-field mt-4"><span>{content.contact.form.messageLabel}</span><textarea required minLength={12} maxLength={1500} rows={5} value={contactForm.message} onChange={event => setContactForm(current => ({ ...current, message: event.target.value }))} placeholder={content.contact.form.messagePlaceholder} /></label>
                  <label className="contact-form-honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={contactForm.website} onChange={event => setContactForm(current => ({ ...current, website: event.target.value }))} /></label>
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><button type="submit" disabled={contactSubmitting} className="contact-form-submit">{contactSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />{content.contact.form.submittingLabel}</> : <>{content.contact.form.submitLabel}<ArrowUpRight className="h-4 w-4" /></>}</button><p className="max-w-sm text-xs leading-5 text-white">{content.contact.form.privacyNote}</p></div>
                  <div className="mt-4 min-h-6 text-sm" aria-live="polite">{contactStatus === "sending" && <p className="font-medium text-white/85">{content.contact.form.sendingMessage}</p>}{contactStatus === "success" && <p className="font-semibold text-white">{content.contact.form.successMessage}</p>}{contactStatus === "error" && <p className="font-medium text-white">{contactError}</p>}</div>
                </form>
                <p className="mt-5 text-sm text-white">{content.contact.form.fallbackMessage} <a href={`mailto:${content.contact.email}`} className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-75">{content.contact.email}</a></p>
                <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold">
                  <a href={content.contact.githubUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-white transition-colors hover:text-white"><Github className="h-4 w-4" /> {content.contact.githubLabel} <AnchorArrow /></a>
                  <a href={content.contact.linkedinUrl} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-white transition-colors hover:text-white"><Linkedin className="h-4 w-4" /> {content.contact.linkedinLabel} <AnchorArrow /></a>
                  <a href={`mailto:${content.contact.email}`} className="group inline-flex items-center gap-2 text-white transition-colors hover:text-white"><Mail className="h-4 w-4" /> {content.contact.emailLabel} <AnchorArrow /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="theme-footer px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-[11px] sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} {content.identity.name}. {content.footer.left}</p>
            <p className="uppercase tracking-[0.12em] text-[#8e8c87]">{content.footer.right}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
