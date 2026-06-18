import { useTranslation } from 'react-i18next';
import Tag from '../ui/Tag';
import TextScramble from '../effects/TextScramble';

export default function SelectedWork() {
  const { t } = useTranslation();

  const projects = t('work.projects', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    verbo: string;
    impact: string;
    metrics: string;
    stack: string[];
    image: string;
    url: string;
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
  };

  const featuredStack = t('work.featured.stack', { returnObjects: true }) as string[];

  // Combine featured + projects into a single uniform array
  const allItems = [
    { ...featured, stack: featuredStack, index: '01' },
    ...projects.map((p, idx) => ({ ...p, index: String(idx + 2).padStart(2, '0') })),
  ];

  return (
    <section id="work" className="relative z-10 px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section indicator */}
        <div className="section-indicator">
          02/04 — {t('indicators.work')}
        </div>

        {/* Section headline — text scramble */}
        <TextScramble
          as="h2"
          text={t('work.headline')}
          className="font-mono font-bold text-[clamp(2rem,5vw,4rem)] leading-[1.0] text-[#FFFFFF] mb-12 uppercase"
        />

        {/* Uniform grid — 3 columns, all cards equal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <ProjectCard
              key={item.id}
              index={item.index}
              title={item.title}
              verbo={item.verbo}
              impact={item.impact}
              stack={item.stack.slice(0, 4)}
              image={item.image}
              url={item.url}
            />
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
}

function ProjectCard({ index, title, verbo, impact, stack, image, url }: ProjectCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block bg-[#0A0A0A] border border-[#222222] overflow-hidden no-underline hover:border-[#CCFF00] transition-colors duration-300"
    >
      {/* Image zone — uniform height, consistent crop */}
      <div className="relative h-[200px] overflow-hidden bg-[#000000]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Gradient overlay — always visible, darker on base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
        {/* Hover tint — green */}
        <div className="absolute inset-0 bg-[#CCFF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Index badge — top left */}
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.1em] text-[#CCFF00] bg-[#000000]/70 px-2 py-0.5 border border-[#CCFF00]/30">
          P.{index}
        </span>

        {/* Arrow — top right, visible on hover */}
        <span className="absolute top-4 right-4 font-mono text-[11px] text-[#CCFF00] opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-1 group-hover:translate-x-0">
          ↗
        </span>
      </div>

      {/* Content zone */}
      <div className="p-5">
        {/* Title */}
        <p className="font-mono font-bold text-[13px] text-[#FFFFFF] uppercase tracking-[0.05em] mb-2">
          {title}
        </p>

        {/* Description */}
        <p className="font-sans text-[13px] text-[#666666] leading-relaxed line-clamp-2 mb-4">
          {verbo}
        </p>

        {/* Stack + Impact row */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 flex-1">
            {stack.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
          <p className="font-mono text-[#CCFF00] text-[10px] uppercase tracking-wider shrink-0 text-right">
            {impact}
          </p>
        </div>
      </div>

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#CCFF00] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
    </a>
  );
}