import { useTranslation } from 'react-i18next';
import TextScramble from '../effects/TextScramble';

export default function Contact() {
  const { t } = useTranslation();

  const socials = t('contact.socials', { returnObjects: true }) as Array<{
    label: string;
    handle: string;
    url: string;
  }>;

  const SOCIAL_ICONS: Record<string, React.ReactNode> = {
    GITHUB: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    LINKEDIN: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    EMAIL: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22 6l-10 7L2 6"/>
      </svg>
    ),
  };

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

        {/* Contact form — editorial dark style */}
        <form
          method="post"
          action="https://formspree.io/f/xeoldrbg"
          className="mb-16 max-w-lg"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888] block mb-2">
                {t('contact.form.nameLabel')}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full bg-[#0A0A0A] border border-[#222222] px-4 py-3 font-mono text-[13px] text-[#FFFFFF] outline-none focus:border-[#CCFF00] transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888] block mb-2">
                {t('contact.form.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full bg-[#0A0A0A] border border-[#222222] px-4 py-3 font-mono text-[13px] text-[#FFFFFF] outline-none focus:border-[#CCFF00] transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888] block mb-2">
                {t('contact.form.messageLabel')}
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                className="w-full bg-[#0A0A0A] border border-[#222222] px-4 py-3 font-mono text-[13px] text-[#FFFFFF] outline-none focus:border-[#CCFF00] transition-colors duration-200 resize-none"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 bg-[#CCFF00] text-[#000000] border border-[#CCFF00] hover:bg-transparent hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer"
            >
              {t('contact.form.submit')}
            </button>
          </div>
        </form>

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

        {/* Social links — icon + handle */}
        <div className="flex flex-col gap-3 mb-16">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/social flex items-center gap-3 no-underline w-fit"
            >
              <span className="text-[#CCFF00] group-hover/social:text-[#FFFFFF] transition-colors duration-200">
                {SOCIAL_ICONS[social.label]}
              </span>
              <span className="font-mono text-[14px] text-[#888888] group-hover/social:text-[#FAFAFA] transition-colors duration-200">
                {social.handle}
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
