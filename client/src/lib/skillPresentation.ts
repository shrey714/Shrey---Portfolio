import { Code2, Monitor, Palette, Server, Smartphone, Sparkles, type LucideIcon } from "lucide-react";

type SkillVisual = {
  Icon: LucideIcon;
  iconSurface: string;
  iconColor: string;
  ringColor: string;
};

const visualBySkill: Record<string, SkillVisual> = {
  "Android technologies": { Icon: Smartphone, iconSurface: "bg-[#456fe8]/12", iconColor: "text-[#456fe8]", ringColor: "border-[#456fe8]/30" },
  "Backend technologies": { Icon: Server, iconSurface: "bg-[#243d61]/10", iconColor: "text-[#365d8d]", ringColor: "border-[#365d8d]/25" },
  "Frontend technologies": { Icon: Monitor, iconSurface: "bg-[#7178ad]/12", iconColor: "text-[#5d6495]", ringColor: "border-[#5d6495]/25" },
  "Programming languages": { Icon: Code2, iconSurface: "bg-[#1b1c1d]/8", iconColor: "text-[#343434]", ringColor: "border-[#1b1c1d]/18" },
  "Other stacks": { Icon: Palette, iconSurface: "bg-[#c27f48]/12", iconColor: "text-[#9a6032]", ringColor: "border-[#9a6032]/25" },
};

const fallbackVisual: SkillVisual = { Icon: Sparkles, iconSurface: "bg-[#456fe8]/12", iconColor: "text-[#456fe8]", ringColor: "border-[#456fe8]/30" };

const markByTechnology: Record<string, string> = {
  "React Native": "RN",
  Expo: "EX",
  "Node.js": "ND",
  "Express.js": "EX",
  MongoDB: "MG",
  Django: "DJ",
  HTML: "HT",
  CSS: "CS",
  "React.js": "RE",
  C: "C",
  "C++": "C+",
  JavaScript: "JS",
  Python: "PY",
  "Git & GitHub": "GH",
  Bootstrap: "BT",
  Figma: "FG",
  Canva: "CV",
  Tailwind: "TW",
};

export function getSkillVisual(name: string): SkillVisual {
  return visualBySkill[name] ?? fallbackVisual;
}

export function splitSkillTools(tools: string): string[] {
  return tools.split(" · ").map(tool => tool.trim()).filter(Boolean);
}

export function getTechnologyMark(technology: string): string {
  return markByTechnology[technology] ?? technology.slice(0, 2).toUpperCase();
}
