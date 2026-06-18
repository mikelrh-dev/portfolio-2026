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

        {/* Grid — uniforme: 3 columnas, 5 cards, todas 1x1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* P.01 — Featured (mismo tamaño que el resto) */}
          <Card
            index="01"
            hoverAccent
            as="a"
            href={featured.url}
            className="col-span-1 flex flex-col"
          >
            <ProjectImage src={featured.image} />
            <ProjectTitle>{featured.title}</ProjectTitle>
            <ProjectBody>{featured.verbo}</ProjectBody>
            <ProjectStack tags={featuredStack} />
            <ProjectImpact>{featured.impact}</ProjectImpact>
          </Card>

          {/* P.02–P.05: mismo tratamiento que P.01 */}
          {projects.map((project, idx) => (
            <Card
              key={project.id}
              index={String(idx + 2).padStart(2, '0')}
              hoverAccent
              as="a"
              href={project.url}
              className="col-span-1 flex flex-col"
            >
              <ProjectImage src={project.image} />
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectBody>{project.verbo}</ProjectBody>
              <ProjectStack tags={project.stack.slice(0, 4)} />
              <ProjectImpact>{project.impact}</ProjectImpact>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Card sub-components — visual language compartido por las 5 cards --- */

function ProjectImage({ src }: { src: string }) {
  return (
    <div className="relative -m-6 mb-4 aspect-[16/10] overflow-hidden border-b border-[#222222] bg-[#000000] group/image">
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain p-4 transition-all duration-500 group-hover/image:scale-[1.02] group-hover/image:brightness-110"
        loading="lazy"
      />
      {/* Hover overlay — subtle gradient from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#CCFF00]/10 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

function ProjectTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono font-bold text-[13px] md:text-[14px] text-[#FFFFFF] mb-2 uppercase tracking-tight">
      [{children}]
    </p>
  );
}

function ProjectBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-sm text-[#888888] leading-relaxed line-clamp-2 flex-1 mb-3">
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

function ProjectImpact({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto">
      <div className="h-px bg-[#222222] mb-3" />
      <p className="font-mono text-[#CCFF00] text-[10px] md:text-[11px] uppercase tracking-wider">
        [{children}]
      </p>
    </div>
  );
}