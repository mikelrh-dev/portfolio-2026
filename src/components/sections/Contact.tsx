import { useTranslation } from 'react-i18next';
import TextScramble from '../effects/TextScramble';

export default function Contact() {
  const { t } = useTranslation();

  const socials = t('contact.socials', { returnObjects: true }) as Array<{
    label: string;
    url: string;
  }>;

  return (
    <section id="contact" className="relative z-10 px-4 py-[clamp(4rem,8vw,8rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Section indicator */}
        <div className="section-indicator">
          04/04 — {t('indicators.contact')}
        </div>

        {/* Headline — text scramble */}
        <TextScramble
          as="h2"
          text={`${t('contact.headline')}\n${t('contact.headline_2')}`}
          className="font-mono font-bold text-[clamp(1.8rem,4.5vw,3.5rem)] leading-[1.0] text-[#FFFFFF] mb-12 uppercase"
        />

        {/* Email — 56px mono with green underline */}
        <a
          href={`mailto:${t('contact.email')}`}
          className="inline-block font-mono text-[clamp(1.5rem,3.5vw,3.5rem)] font-normal text-[#FFFFFF] no-underline underline decoration-[#CCFF00] decoration-2 underline-offset-8 hover:decoration-[#FFFFFF] transition-colors duration-200 mb-16"
        >
          {t('contact.email')}
        </a>

        {/* Social links row */}
        <div className="flex gap-6 flex-wrap mb-16">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] uppercase tracking-[0.12em] text-[#666666] hover:text-[#FFFFFF] no-underline transition-colors duration-150"
            >
              [{social.label}]
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#222222] py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#666666]">
            {t('contact.footer')}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#444444]">
            {t('contact.built_with')}
          </p>
        </div>
      </footer>
    </section>
  );
}
