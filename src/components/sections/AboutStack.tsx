import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import TextScramble from '../effects/TextScramble';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function AboutStack() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const categories = ['languages', 'frontend', 'backend', 'tools'] as const;

  return (
    <section id="about" className="relative z-10 px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section indicator */}
        <div className="section-indicator">
          03/04 — {t('indicators.about')}
        </div>

        {/* ALL CAPS headline — text scramble */}
        <TextScramble
          as="h2"
          text={t('about.bio_1').split('.')[0] + '.'}
          className="font-mono font-bold text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.05] text-[#FFFFFF] mb-12 uppercase"
        />

        {/* Bio + Stack + Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bio paragraphs */}
          <Card className="space-y-4">
            <p className="font-mono text-[13px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_1')}
            </p>
            <p className="font-mono text-[13px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_2')}
            </p>
          </Card>

          {/* Stack panel */}
          <Card className="h-full">
            <p className="font-mono text-[#CCFF00] text-[13px] font-bold mb-6 tracking-[0.12em] uppercase">
              [{t('about.stack_header')}]
            </p>
            <div className="space-y-5">
              {categories.map((cat, catIdx) => (
                <div key={cat}>
                  <p className={`font-mono text-[11px] uppercase tracking-[0.08em] mb-2 ${catIdx === 0 ? 'text-[#CCFF00]' : 'text-[#FFFFFF]'}`}>
                    {'//'} {t(`about.categories.${cat}`)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {((t(`about.items.${cat}`, { returnObjects: true }) as string[]) || []).map(
                      (tech: string) => (
                        <Tag key={tech}>{tech}</Tag>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Profile photo — cyber treatment */}
        <div className="flex flex-col items-end">
          <div className="group relative">
            <img
              src="/images/profile.jpg"
              alt="Mikel Romero"
              className={`w-[280px] h-[360px] object-cover border border-[#222222] ${
                reducedMotion
                  ? 'grayscale sepia-[60%] hue-rotate-[40deg] saturate-[3]'
                  : 'grayscale transition-all duration-300 hover:grayscale-[60%] hover:sepia-[60%] hover:hue-rotate-[40deg] hover:saturate-[3]'
              }`}
            />
          </div>
          <p className="font-mono text-[11px] text-[#CCFF00] mt-3 tracking-[0.12em] uppercase">
            [ OPERATOR_ID: MIKEL_ROMERO ]
          </p>
        </div>
      </div>
    </section>
  );
}
