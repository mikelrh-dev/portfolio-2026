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
          {/* Featured project — P.01: col-span-2, row-span-2 */}
          <Card
            index="01"
            hoverAccent
            as="a"
            href={featured.url}
            className="col-span-1 lg:col-span-2 lg:row-span-2 flex flex-col justify-between"
          >
            {/* Image — 50% of card height, bleeds to edges */}
            <div className="relative -m-6 mb-4 h-[280px] overflow-hidden border-b border-[#222222] bg-[#000000]">
              <img
                src={featured.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Title — mono */}
            <p className="font-mono font-bold text-[clamp(1.1rem,1.8vw,1.5rem)] text-[#FFFFFF] mb-3 uppercase tracking-tight">
              {featured.title}
            </p>

            {/* Body — sans, editorial */}
            <p className="font-sans text-sm text-[#888888] leading-relaxed mb-4">
              {featured.verbo}
            </p>

            {/* Bottom: tags + impact */}
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

          {/* Project cards — P.02 to P.05 */}
          {projects.map((project, idx) => {
            // P.02 (idx 0) and P.04 (idx 2): medium, row-span-2
            // P.03 (idx 1) and P.05 (idx 3): compact, row-span-1
            const isMedium = idx === 0 || idx === 2;
            const rowSpan = isMedium ? 'lg:row-span-2' : '';
            const imageHeight = isMedium ? 'h-[280px]' : 'h-[140px]';

            return (
              <Card
                key={project.id}
                index={String(idx + 2).padStart(2, '0')}
                hoverAccent
                as="a"
                href={project.url}
                className={`col-span-1 ${rowSpan} flex flex-col justify-between`}
              >
                {/* Image — vertical/square for medium, compact for others */}
                <div
                  className={`relative -m-6 mb-4 ${imageHeight} overflow-hidden border-b border-[#222222] bg-[#000000]`}
                >
                  <img
                    src={project.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Title — mono */}
                <p className="font-mono font-bold text-[12px] md:text-[13px] text-[#FFFFFF] mb-1 uppercase tracking-wider">
                  [{project.title}]
                </p>

                {/* Body — sans, editorial */}
                <p className="font-sans text-sm text-[#888888] leading-snug mb-2">
                  {project.verbo}
                </p>

                {/* Bottom: stack tags + impact */}
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
            );
          })}
        </div>
      </div>
    </section>
  );
}