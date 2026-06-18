import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from 'react';
import { useMagneticCursor } from '../../hooks/useMagneticCursor';
import { useHoverSound } from '../../hooks/useHoverSound';

type MagneticButtonProps = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>);

const baseClasses =
  'magnetic inline-block font-mono text-[13px] uppercase tracking-[0.12em] px-6 py-3 border border-[#222222] bg-transparent text-[#FAFAFA] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-200 cursor-pointer no-underline';

const MagneticButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, MagneticButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => {
    const { ref: magneticRef, style, onPointerMove, onPointerLeave } = useMagneticCursor<HTMLButtonElement>(0.4);
    const { onPointerEnter } = useHoverSound();
    const classes = `${baseClasses} ${className}`;

    const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter();
      if ('onPointerEnter' in props && typeof (props as ButtonHTMLAttributes<HTMLButtonElement>).onPointerEnter === 'function') {
        (props as ButtonHTMLAttributes<HTMLButtonElement>).onPointerEnter!(e);
      }
    };

    if ('href' in props) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          style={style}
          onPointerMove={onPointerMove as unknown as React.PointerEventHandler}
          onPointerLeave={onPointerLeave}
          onPointerEnter={onPointerEnter as unknown as React.PointerEventHandler}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={(el) => {
          (magneticRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
        }}
        className={classes}
        style={style}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerEnter={handlePointerEnter}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  },
);

MagneticButton.displayName = 'MagneticButton';
export default MagneticButton;
