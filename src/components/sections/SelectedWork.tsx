import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
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

        {/* Bento grid — 3 columns, asymmetric row/col spans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* P.01 — Featured: col-span-2, row-span-2 */}
          <Card
            index="01"
            hoverAccent
            as="a"
            href={featured.url}
            className="col-span-1 lg:col-span-2 lg:row-span-2 flex flex-col"
          >
            <ProjectImage src={featured.image} />
            <ProjectTitle size="lg">{featured.title}</ProjectTitle>
            <ProjectBody>{featured.verbo}</ProjectBody>
            <ProjectStack tags={featuredStack} />
            <ProjectImpact>{featured.impact}</ProjectImpact>
          </Card>

          {/* P.02–P.05: medium (row-span-2) or compact (row-span-1) */}
          {projects.map((project, idx) => {
            const isMedium = idx === 0 || idx === 2;
            const rowSpan = isMedium ? 'lg:row-span-2' : '';
            const titleSize = isMedium ? 'md' : 'sm';

            return (
              <Card
                key={project.id}
                index={String(idx + 2).padStart(2, '0')}
                hoverAccent
                as="a"
                href={project.url}
                className={`col-span-1 ${rowSpan} flex flex-col`}
              >
                <ProjectImage src={project.image} />
                <ProjectTitle size={titleSize}>{project.title}</ProjectTitle>
                <ProjectBody compact={!isMedium}>{project.verbo}</ProjectBody>
                <ProjectStack tags={project.stack.slice(0, 4)} />
                <ProjectImpact size={isMedium ? 'md' : 'sm'}>{project.impact}</ProjectImpact>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --- Card sub-components — shared visual language across all 5 cards --- */

function ProjectImage({ src }: { src: string }) {
  return (
    <div className="relative -m-6 mb-4 aspect-[16/10] overflow-hidden border-b border-[#222222] bg-[#000000]">
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain p-4"
        loading="lazy"
      />
    </div>
  );
}

function ProjectTitle({
  children,
  size = 'md',
}: {
  children: React.ReactNode;
  size?: 'lg' | 'md' | 'sm';
}) {
  const sizeClass =
    size === 'lg'
      ? 'text-[clamp(1.1rem,1.8vw,1.5rem)]'
      : size === 'md'
        ? 'text-[clamp(0.95rem,1.3vw,1.1rem)]'
        : 'text-[12px] md:text-[13px]';
  return (
    <p
      className={`font-mono font-bold text-[#FFFFFF] mb-2 uppercase tracking-tight ${sizeClass}`}
    >
      [{children}]
    </p>
  );
}

function ProjectBody({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <p
      className={`font-sans text-sm text-[#888888] leading-relaxed flex-1 ${
        compact ? 'line-clamp-2' : 'mb-4'
      }`}
    >
      {children}
    </p>
  );
}

function ProjectStack({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {tags.map((tech) => (
        <Tag key={tech}>{tech}</Tag>
      ))}
    </div>
  );
}

function ProjectImpact({
  children,
  size = 'md',
}: {
  children: React.ReactNode;
  size?: 'md' | 'sm';
}) {
  const sizeClass =
    size === 'md'
      ? 'text-[12px] md:text-[13px]'
      : 'text-[10px] md:text-[11px]';
  return (
    <div className="mt-auto">
      <div className="h-px bg-[#222222] mb-3" />
      <p
        className={`font-mono text-[#CCFF00] uppercase tracking-wider ${sizeClass}`}
      >
        [{children}]
      </p>
    </div>
  );
}