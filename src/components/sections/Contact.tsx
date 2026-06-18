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
          className="font-mono font-bold text-[clamp(1.8rem,4.5vw,3.5rem)] leading-[1.0] text-[#FFFFFF] mb-8 uppercase"
        />

        {/* Divider — editorial weight */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-gradient-to-r from-[#CCFF00] to-transparent w-32" />
          <div className="h-px bg-[#222222] flex-1" />
        </div>

        {/* Email — large mono with animated underline */}
        <a
          href={`mailto:${t('contact.email')}`}
          className="group/mail inline-block font-mono text-[clamp(1.5rem,3.5vw,3.5rem)] font-normal text-[#FFFFFF] no-underline mb-16 relative"
        >
          <span className="relative">
            {t('contact.email')}
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#CCFF00] origin-left scale-x-100 group-hover/mail:scale-x-0 transition-transform duration-300" />
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FFFFFF] origin-right scale-x-0 group-hover/mail:scale-x-100 transition-transform duration-300" />
          </span>
        </a>

        {/* Social links row — better spacing */}
        <div className="flex gap-8 flex-wrap mb-16">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/social font-mono text-[13px] uppercase tracking-[0.12em] text-[#666666] hover:text-[#FFFFFF] no-underline transition-colors duration-150 relative"
            >
              <span className="relative">
                [{social.label}]
                <span className="absolute left-0 -bottom-1 w-full h-px bg-[#CCFF00] origin-left scale-x-0 group-hover/social:scale-x-100 transition-transform duration-300" />
              </span>
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
