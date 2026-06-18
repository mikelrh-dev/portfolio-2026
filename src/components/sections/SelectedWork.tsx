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

        {/* Bento grid — asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {/* Featured project — spans 2 cols, 2 rows */}
          <Card
            index="01"
            hoverAccent
            image={featured.image}
            as="a"
            href={featured.url}
            className="col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-between"
          >
            <div>
              <p className="font-mono font-bold text-[clamp(1.1rem,1.8vw,1.5rem)] text-[#FFFFFF] mb-3 uppercase tracking-tight">
                {featured.title}
              </p>
              <p className="text-[12px] md:text-[13px] text-[#CCCCCC] leading-relaxed">
                {featured.verbo}
              </p>
            </div>
            <div className="mt-auto">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {featuredStack.map((tech: string) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
              <p className="font-mono text-[#CCFF00] text-[12px] md:text-[13px] uppercase tracking-wider">
                [{featured.impact}]
              </p>
            </div>
          </Card>

          {/* Project cards — 2 cols, 1 row each */}
          {projects.map((project, idx) => (
            <Card
              key={project.id}
              index={String(idx + 2).padStart(2, '0')}
              hoverAccent
              image={project.image}
              as="a"
              href={project.url}
              className="col-span-1 row-span-1 flex flex-col justify-between"
            >
              <div>
                <p className="font-mono font-bold text-[12px] md:text-[13px] text-[#FFFFFF] mb-1 uppercase tracking-wider">
                  [{project.title}]
                </p>
                <p className="text-[11px] text-[#CCCCCC] leading-snug line-clamp-3">
                  {project.verbo}
                </p>
              </div>
              <div className="mt-auto">
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.stack.slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#666666]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-[#CCFF00] text-[10px] md:text-[11px] uppercase tracking-wider">
                  [{project.impact}]
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
