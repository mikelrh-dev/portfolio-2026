import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react';

type MagneticButtonProps = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);

const baseClasses =
  'inline-block font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#222222] bg-transparent text-[#FAFAFA] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer no-underline';

export default function MagneticButton({ variant = 'primary', children, className = '', ...props }: MagneticButtonProps) {
  const classes = `${baseClasses} ${className}`;

  if ('href' in props) {
    return (
      <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
