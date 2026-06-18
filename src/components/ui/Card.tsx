import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section' | 'a';
  hoverAccent?: boolean;
  index?: string;
  image?: string;
  href?: string;
}

export default function Card({
  children,
  className = '',
  as: Tag = 'div',
  hoverAccent = false,
  index,
  image,
  href,
}: CardProps) {
  const isLink = Tag === 'a';
  const reducedMotion = useReducedMotion();

  const hoverAnim = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.05 },
        transition: { duration: 0.2 },
      };

  const indexAnim = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.1 },
        transition: { duration: 0.2 },
      };

  const lineAnim = reducedMotion
    ? {}
    : {
        initial: { scaleY: 0 },
        whileHover: { scaleY: 1 },
        transition: { duration: 0.2 },
      };

  const cardContent = (
    <>
      {/* Green sliding line — left edge */}
      {!reducedMotion && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#CCFF00] origin-top"
          style={{ opacity: 0.8 }}
          {...lineAnim}
        />
      )}

      {image && (
        <motion.div
          className="relative -m-6 mb-4 h-32 md:h-40 overflow-hidden border-b border-[#222222] bg-[#000000]"
          {...hoverAnim}
        >
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]/90" />
        </motion.div>
      )}
      {index && (
        <motion.div
          className="font-mono text-[11px] text-[#CCFF00] mb-3 tracking-[0.08em]"
          {...indexAnim}
        >
          P.{index.padStart(2, '0')}
        </motion.div>
      )}
      {children}
    </>
  );

  return (
    <Tag
      href={isLink ? href : undefined}
      target={isLink ? '_blank' : undefined}
      rel={isLink ? 'noopener noreferrer' : undefined}
      className={`group relative block bg-[#0A0A0A] border border-[#222222] p-6 rounded-none ${
        hoverAccent
          ? 'hover:border-[#CCFF00] transition-colors duration-200'
          : ''
      } ${isLink ? 'cursor-pointer no-underline' : ''} ${className}`}
    >
      {cardContent}
    </Tag>
  );
}
