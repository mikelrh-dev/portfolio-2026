interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block font-mono text-[11px] uppercase tracking-[0.08em] text-[#888888] px-2.5 py-0.5 border border-[#2A2A2A] bg-[#0F0F0F] rounded-none hover:border-[#CCFF00]/40 hover:text-[#CCFF00] transition-colors duration-150 ${className}`}
    >
      {children}
    </span>
  );
}
