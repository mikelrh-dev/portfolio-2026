interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block font-mono text-[12px] uppercase tracking-[0.08em] text-[#666666] px-3 py-1 border border-[#222222] rounded-none ${className}`}
    >
      {children}
    </span>
  );
}
