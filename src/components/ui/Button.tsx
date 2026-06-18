import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);

const baseClasses =
  'magnetic inline-block font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#222222] bg-transparent text-[#FFFFFF] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer no-underline rounded-none';

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    const classes = `${baseClasses} ${className}`;

    if ('href' in props) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          [ {children} → ]
        </a>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
        [ {children} → ]
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
