import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TinkerHubLogoProps {
  className?: string;
  href?: string;
  height?: number;
  priority?: boolean;
}

export function TinkerHubLogo({ 
  className = "h-12 sm:h-15 w-auto", 
  href, 
  height = 56,
  priority = false 
}: TinkerHubLogoProps) {
  const content = (
    <div className="inline-flex items-center">
      <Image
        src="/tinkerhub-logo.png"
        alt="TinkerHub Logo"
        width={270}
        height={height}
        priority={priority}
        className={`object-contain ${className}`}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
