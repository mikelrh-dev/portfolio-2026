import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import TextScramble from '../effects/TextScramble';

export default function AboutStack() {
  const { t } = useTranslation();

  const categories = ['languages', 'frontend', 'backend', 'tools'] as const;

  return (
    <section id="about" className="relative z-10 bg-black px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section indicator */}
        <div className="section-indicator">
          02/04 — {t('indicators.about')}
        </div>

        {/* ALL CAPS headline — text scramble */}
        <TextScramble
          as="h2"
          text={t('about.bio_1').split('.')[0] + '.'}
          className="font-mono font-bold text-[clamp(1.6rem,3.5vw,2.5rem)] leading-[1.05] text-[#FFFFFF] mb-12 uppercase"
        />

        {/* Bio + Stack + Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio paragraphs */}
          <Card className="space-y-4">
            <p className="text-[15px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_1')}
            </p>
            <p className="text-[15px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_2')}
            </p>
            <p className="text-[15px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_3')}
            </p>
            <p className="text-[15px] leading-relaxed text-[#CCCCCC]">
              {t('about.bio_4')}
            </p>
            {/* Visual divider — editorial rhythm */}
            <div className="pt-4 mt-4 border-t border-[#222222]">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#666666]">
                <span className="text-[#CCFF00]">●</span> {t('about.status')}
              </p>
            </div>
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

          {/* Photo panel — terminal window style */}
          <Card className="flex flex-col">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-4 font-mono text-[10px] tracking-[0.08em] text-[#666666] uppercase">
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF5F57]" />
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FFBD2E]" />
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#28C840]" />
              <span className="ml-1 text-[#FFFFFF]">{t('about.photo_filename')}</span>
              <span className="ml-auto text-[#CCFF00]">{t('about.photo_meta')}</span>
            </div>

            {/* Image — bleeds to card edges */}
            <div className="relative -mx-6 mb-4 overflow-hidden border-y border-[#222222] bg-[#000000] aspect-[3/4]">
              <img
                src="/images/profile.jpg"
                alt="Mikel Romero"
                loading="lazy"
                className="w-full h-full object-cover grayscale"
              />
            </div>

            {/* Caption */}
            <p className="font-mono text-[11px] text-[#FFFFFF] tracking-[0.12em] uppercase">
              {t('about.photo_caption')}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
