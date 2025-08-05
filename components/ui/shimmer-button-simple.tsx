'use client';

import React from 'react';
import Link from 'next/link';

interface ShimmerButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function ShimmerButton({ children, href, onClick, className = '' }: ShimmerButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    px-10 py-4 font-medium text-lg text-white
    bg-[#003825] rounded-full overflow-hidden
    transition-all duration-200 hover:bg-[#004b34] hover:scale-105
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:translate-x-[-200%] hover:before:translate-x-[200%]
    before:transition-transform before:duration-1000
  `;

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`}>
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}