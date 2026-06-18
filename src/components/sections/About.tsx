import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

const CATEGORIES = ['languages', 'frontend', 'backend', 'tools'] as const;

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative z-10 px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <h2 className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#CCFF00] mb-8">
          {t('about.title')}
        </h2>

        {/* Bio + Stack side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bio */}
          <div>
            <Card className="space-y-4">
              <p className="font-sans text-[14px] leading-relaxed text-[#CCCCCC]">
                {t('about.p1')}
              </p>
              <p className="font-sans text-[14px] leading-relaxed text-[#CCCCCC]">
                {t('about.p2')}
              </p>
              <p className="font-sans text-[14px] leading-relaxed text-[#CCCCCC]">
                {t('about.p3')}
              </p>
              <p className="font-sans text-[14px] leading-relaxed text-[#CCCCCC]">
                {t('about.p4')}
              </p>
            </Card>
          </div>

          {/* Stack */}
          <div>
            <Card className="h-full">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#666666] mb-6">
                {t('stack.intro')}
              </p>
              <div className="space-y-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#CCFF00] mb-2">
                      {'//'} {t(`stack.${cat}`)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(t(`stack.items.${cat}`, { returnObjects: true }) as string[]).map(
                        (tech: string) => (
                          <span
                            key={tech}
                            className="inline-block font-mono text-[11px] uppercase tracking-[0.06em] text-[#666666] px-2.5 py-1 border border-[#222222]"
                          >
                            {tech}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
