import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from '../effects/TextScramble';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* --- Stack category priority: lower number renders first --- */
const STACK_CATEGORY: Record<string, number> = {
  // 1: Languages
  typescript: 1, javascript: 1, java: 1, kotlin: 1, python: 1, sql: 1, php: 1, 'html5': 1, 'css3': 1,
  // 2: Frameworks / Runtimes
  react: 2, 'tailwind css': 2, 'three.js': 2, r3f: 2, 'spring boot': 2, 'node.js': 2, javafx: 2, fastapi: 2,
  // 3: Databases / Data
  postgresql: 3, mysql: 3, hibernate: 3, mcp: 3, 'rest api': 3, 'rest apis': 3, redis: 3,
  // 4: Libraries / Tools
  'git/github': 4, 'claude code': 4, opencode: 4, 'android studio': 4, docker: 4, n8n: 4, dbcp2: 4, retrofit: 4,
  whisper: 4, 'edge tts': 4, rag: 4, xgboost: 4, shap: 4,
  // 5: Platforms / Services
  android: 5, 'velneo v37': 5, 'gemini ai': 5, 'telegram bot': 5,
};

function sortStack(stack: string[]): string[] {
  return [...stack].sort((a, b) => {
    const catA = STACK_CATEGORY[a.toLowerCase()] ?? 99;
    const catB = STACK_CATEGORY[b.toLowerCase()] ?? 99;
    return catA - catB;
  });
}

export default function SelectedWork() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const sectionRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isMobile) return; // skip GSAP ScrollTrigger entirely on mobile
    const section = sectionRef.current;
    if (!section) return;
    if (reducedMotion) return;

    const s: HTMLElement = section;

    const ctx = gsap.context(() => {
      // Indicator fade-out at section bottom
      if (indicatorRef.current) {
        gsap.to(indicatorRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: s,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    }, s);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [isMobile]);

  const projects = t('work.projects', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    verbo: string;
    impact: string;
    metrics: string;
    stack: string[];
    image: string;
    url: string;
    github: string;
    docs: string;
    url_label?: string;
  }>;

  const featured = t('work.featured', { returnObjects: true }) as {
    id: string;
    title: string;
    verbo: string;
    impact: string;
    metrics: string;
    stack: string[];
    image: string;
    url: string;
    github: string;
    docs: string;
    url_label?: string;
  };

  const featuredStack = t('work.featured.stack', { returnObjects: true }) as string[];

  // Combine featured + projects into a single uniform array
  const allItems = [
    { ...featured, stack: featuredStack, index: '01' },
    ...projects.map((p, idx) => ({ ...p, index: String(idx + 2).padStart(2, '0') })),
  ];

  return (
    <section id="work" ref={sectionRef} className="relative z-10 px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section indicator */}
        <div ref={indicatorRef} className="section-indicator">
          03/04 — {t('indicators.work')}
        </div>

        {/* Section headline — text scramble */}
        <TextScramble
          as="h2"
          text={t('work.headline')}
          className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] leading-[1.0] text-[#FFFFFF] mb-12 uppercase"
        />

        {/* Uniform grid — 3 columns, all cards equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {allItems.map((item) => (
            <div key={item.id} className="project-card">
              <ProjectCard
                index={item.index}
                title={item.title}
                verbo={item.verbo}
                impact={item.impact}
                stack={item.stack.slice(0, 4)}
                image={item.image}
                url={item.url}
                github={item.github}
                docs={item.docs}
                urlLabel={item.url_label}
                demoLabel={t('work.action_demo')}
                githubLabel={t('work.action_github')}
                docsLabel={t('work.action_docs')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- ProjectCard — uniform design for all 5 cards --- */

interface ProjectCardProps {
  index: string;
  title: string;
  verbo: string;
  impact: string;
  stack: string[];
  image: string;
  url: string;
  github: string;
  docs: string;
  urlLabel?: string;
  demoLabel: string;
  githubLabel: string;
  docsLabel: string;
}

function ProjectCard({ index, title, verbo, impact, stack, image, url, github, docs, urlLabel, demoLabel, githubLabel, docsLabel }: ProjectCardProps) {
  // Whole-card primary action: live demo if available, otherwise the repo
  const hasDemo = Boolean(url && url !== '#');
  const hasRepo = Boolean(github && github !== '#');
  const hasDocs = Boolean(docs && docs !== '#');
  const primaryHref = hasDemo ? url : hasRepo ? github : null;

  const openPrimary = () => {
    if (primaryHref) window.open(primaryHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${title} — ${demoLabel}`}
      onClick={openPrimary}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPrimary();
        }
      }}
      className="group relative block bg-[#0A0A0A] border border-[#222222] overflow-hidden hover:border-[#CCFF00] focus-visible:border-[#CCFF00] focus-visible:outline-none cursor-pointer transition-colors duration-300 h-full flex flex-col"
    >
      {/* Image zone — fixed height, no crop, letterboxed */}
      <div className="relative h-[220px] overflow-hidden bg-[#000000] shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Gradient overlay — always visible, darker on base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent pointer-events-none" />
        {/* Hover tint — green */}
        <div className="absolute inset-0 bg-[#CCFF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Index badge — top left */}
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.1em] text-[#CCFF00] bg-[#000000]/70 px-2 py-0.5 border border-[#CCFF00]/30">
          P.{index}
        </span>

        {/* HUD command deck — always visible (discoverability), muted at rest,
            lime inversion on card hover or direct button hover.
            Visible labels are universal (DEMO/CODE/DOCS) — no i18n needed. */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {hasDemo && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${urlLabel || demoLabel} — ${title}`}
              className="flex items-center h-7 px-2.5 font-mono text-[9px] font-bold tracking-[0.08em] text-[#888888] bg-black/80 border border-[#333333] group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-[#050505] transition-colors duration-150 no-underline"
            >
              {urlLabel || demoLabel}
            </a>
          )}
          {hasRepo && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${githubLabel} — ${title}`}
              className="flex items-center h-7 px-2.5 font-mono text-[9px] font-bold tracking-[0.08em] text-[#888888] bg-black/80 border border-[#333333] group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-[#050505] transition-colors duration-150 no-underline"
            >
              CODE
            </a>
          )}
          {hasDocs && (
            <a
              href={docs}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`${docsLabel} — ${title}`}
              className="flex items-center h-7 px-2.5 font-mono text-[9px] font-bold tracking-[0.08em] text-[#888888] bg-black/80 border border-[#333333] group-hover:border-[#CCFF00]/50 group-hover:text-[#CCFF00] hover:bg-[#CCFF00] hover:border-[#CCFF00] hover:text-[#050505] transition-colors duration-150 no-underline"
            >
              DOCS
            </a>
          )}
        </div>
      </div>

      {/* Content zone — flex column, fills remaining space */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title — lime on card hover: universal "this is clickable" affordance */}
        <p className="font-mono font-bold text-[13px] text-[#FFFFFF] uppercase tracking-[0.05em] mb-2 group-hover:text-[#CCFF00] transition-colors duration-200">
          {title}
        </p>

        {/* Description — flex-1 pushes stack/impact to bottom */}
        <p className="font-sans text-[13px] text-[#666666] leading-relaxed line-clamp-2 mb-4 flex-1">
          {verbo}
        </p>

        {/* Stack + Impact row — always at bottom */}
        <div className="flex items-end justify-between gap-3 mt-auto">
          <div className="flex flex-wrap gap-1 flex-1">
            {sortStack(stack).map((tech) => (
              <span
                key={tech}
                className="inline-block font-mono text-[10px] uppercase tracking-[0.06em] text-[#888888] px-2 py-0.5 border border-[#2A2A2A] bg-[#0F0F0F] rounded-none whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wider shrink-0 text-right">
            {impact}
          </p>
        </div>
      </div>

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#CCFF00] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
    </div>
  );
}