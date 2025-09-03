'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      children,
      shimmerColor = '#ffffff',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '999px',
      background = '#003825',
      className = '',
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const Component = href ? 'a' : 'button';
    
    const buttonContent = (
      <>
        <span
          style={{
            '--shimmer-color': shimmerColor,
            '--shimmer-size': shimmerSize,
            '--shimmer-duration': shimmerDuration,
            '--border-radius': borderRadius,
            '--background': background,
          } as React.CSSProperties}
          className={`
            relative inline-flex items-center justify-center
            px-8 py-3 font-medium text-white
            bg-[image:var(--background)]
            overflow-hidden rounded-[var(--border-radius)]
            transition-all duration-200 hover:scale-105
            before:absolute before:inset-0
            before:bg-[linear-gradient(45deg,transparent_25%,var(--shimmer-color)_50%,transparent_75%,transparent_100%)]
            before:bg-[length:250%_250%,100%_100%]
            before:bg-[position:-100%_0,0_0]
            before:animate-shimmer
            before:transition-[background-position]
            before:duration-[var(--shimmer-duration)]
            before:[animation-duration:var(--shimmer-duration)]
            ${className}
          `}
        >
          <span className="relative z-10">{children}</span>
        </span>
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -100% 0, 0 0;
            }
            100% {
              background-position: 200% 0, 0 0;
            }
          }
        `}</style>
      </>
    );

    if (href) {
      return (
        <a href={href} target={target} rel={rel} className="inline-block">
          {buttonContent}
        </a>
      );
    }

    return (
      <button ref={ref} {...props} className="inline-block">
        {buttonContent}
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';