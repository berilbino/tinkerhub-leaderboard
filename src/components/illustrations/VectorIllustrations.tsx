import React from 'react';

// ============================================================================
// STYLE GUIDE:  chunky outlines (4–5px), bold fills, halftone dots, cartoon vibes
// ============================================================================

// 1. CASSETTE TAPE – Audio / Music Creation / Study Jam
export function CassetteIllustration({ className = "w-32 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Body */}
      <rect x="8" y="20" width="184" height="100" rx="14" fill="#FFD43B" stroke="#111111" strokeWidth="5"/>
      {/* Inner plate */}
      <rect x="20" y="32" width="160" height="76" rx="8" fill="#FFF0A6" stroke="#111111" strokeWidth="3.5"/>
      {/* Label strip */}
      <rect x="28" y="38" width="144" height="36" rx="6" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      <text x="100" y="53" fill="#FFD43B" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="monospace" letterSpacing="2">♫ TINKERHUB ♫</text>
      <text x="100" y="66" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SIDE A  •  MEGA MIX</text>
      {/* Reels */}
      <circle cx="72" cy="91" r="16" fill="#111111" stroke="#111111" strokeWidth="3"/>
      <circle cx="72" cy="91" r="9" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
      <circle cx="72" cy="91" r="3" fill="#111111"/>
      <circle cx="128" cy="91" r="16" fill="#111111" stroke="#111111" strokeWidth="3"/>
      <circle cx="128" cy="91" r="9" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
      <circle cx="128" cy="91" r="3" fill="#111111"/>
      {/* Tape path */}
      <path d="M 72 78 Q 100 72 128 78" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round"/>
      {/* Corner screws */}
      <circle cx="30" cy="30" r="4" fill="#D9D9D4" stroke="#111111" strokeWidth="2"/>
      <circle cx="170" cy="30" r="4" fill="#D9D9D4" stroke="#111111" strokeWidth="2"/>
      <circle cx="30" cy="110" r="4" fill="#D9D9D4" stroke="#111111" strokeWidth="2"/>
      <circle cx="170" cy="110" r="4" fill="#D9D9D4" stroke="#111111" strokeWidth="2"/>
      {/* Musical notes accent */}
      <text x="14" y="26" fill="#111111" fontSize="12" fontWeight="bold">♪</text>
      <text x="172" y="26" fill="#111111" fontSize="12" fontWeight="bold">♪</text>
    </svg>
  );
}

// 2. GAME CONTROLLER – Game Dev / Gaming
export function GameboyIllustration({ className = "w-28 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Controller body */}
      <path d="M 20 60 C 20 30 40 20 90 20 C 140 20 160 30 160 60 L 160 120 C 160 155 140 165 110 165 L 70 165 C 40 165 20 155 20 120 Z" fill="#8EC5FF" stroke="#111111" strokeWidth="5"/>
      {/* Screen */}
      <rect x="55" y="35" width="70" height="50" rx="6" fill="#111111" stroke="#111111" strokeWidth="3"/>
      <rect x="60" y="39" width="60" height="42" rx="4" fill="#A8D86E"/>
      {/* Pixel character on screen */}
      <rect x="76" y="46" width="8" height="8" fill="#111111"/>
      <rect x="84" y="46" width="8" height="8" fill="#111111"/>
      <rect x="72" y="50" width="4" height="4" fill="#111111"/>
      <rect x="96" y="50" width="4" height="4" fill="#111111"/>
      <rect x="72" y="54" width="28" height="4" fill="#111111"/>
      <rect x="76" y="58" width="6" height="4" fill="#FFD43B"/>
      <rect x="90" y="58" width="6" height="4" fill="#FFD43B"/>
      <rect x="74" y="62" width="24" height="4" fill="#111111"/>
      {/* D-pad left */}
      <rect x="36" y="100" width="10" height="30" rx="3" fill="#111111"/>
      <rect x="28" y="110" width="26" height="10" rx="3" fill="#111111"/>
      <circle cx="49" cy="115" r="3" fill="#D91E2E"/>
      {/* ABXY buttons right */}
      <circle cx="128" cy="105" r="9" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      <circle cx="142" cy="115" r="9" fill="#A8D86E" stroke="#111111" strokeWidth="3"/>
      <circle cx="114" cy="115" r="9" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      <circle cx="128" cy="125" r="9" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <text x="128" y="108" fill="#FFF" fontSize="8" fontWeight="900" textAnchor="middle">A</text>
      <text x="142" y="118" fill="#111" fontSize="8" fontWeight="900" textAnchor="middle">B</text>
      <text x="114" y="118" fill="#111" fontSize="8" fontWeight="900" textAnchor="middle">X</text>
      <text x="128" y="128" fill="#111" fontSize="8" fontWeight="900" textAnchor="middle">Y</text>
      {/* Start/Select */}
      <rect x="72" y="112" width="16" height="6" rx="3" fill="#111111"/>
      <rect x="92" y="112" width="16" height="6" rx="3" fill="#111111"/>
      {/* Halftone accent dots */}
      <circle cx="36" cy="75" r="2.5" fill="#111111" opacity="0.2"/>
      <circle cx="144" cy="75" r="2.5" fill="#111111" opacity="0.2"/>
    </svg>
  );
}

// 3. RETRO CAMERA – Photography
export function CameraIllustration({ className = "w-32 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Flash attachment */}
      <rect x="48" y="8" width="40" height="20" rx="5" fill="#D91E2E" stroke="#111111" strokeWidth="4"/>
      <polygon points="48,8 58,0 78,0 88,8" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      {/* Body */}
      <rect x="16" y="26" width="168" height="110" rx="14" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Top stripe */}
      <rect x="16" y="26" width="168" height="22" rx="14" fill="#FFD43B" stroke="#111111" strokeWidth="4"/>
      <rect x="16" y="38" width="168" height="10" fill="#FFD43B"/>
      {/* Lens ring */}
      <circle cx="100" cy="91" r="44" fill="#111111" stroke="#111111" strokeWidth="4"/>
      <circle cx="100" cy="91" r="37" fill="#333333" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="100" cy="91" r="28" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <circle cx="100" cy="91" r="18" fill="#5AA8E0" stroke="#111111" strokeWidth="2"/>
      <circle cx="100" cy="91" r="7" fill="#111111"/>
      {/* Lens shine */}
      <circle cx="90" cy="81" r="5" fill="#FFFFFF" opacity="0.7"/>
      <circle cx="112" cy="102" r="2.5" fill="#FFFFFF" opacity="0.4"/>
      {/* Shutter button */}
      <circle cx="158" cy="36" r="8" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      {/* Viewfinder */}
      <rect x="30" y="34" width="22" height="14" rx="3" fill="#111111" stroke="#111111" strokeWidth="2"/>
      <rect x="32" y="36" width="18" height="10" rx="2" fill="#8EC5FF"/>
      {/* Film door line */}
      <line x1="16" y1="91" x2="184" y2="91" stroke="#D9D9D4" strokeWidth="2" strokeDasharray="5 4"/>
      {/* Brand text */}
      <text x="100" y="130" fill="#111111" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">RETROSHOT 3000</text>
    </svg>
  );
}

// 4. TROPHY & PODIUM – Competition / Symposiums / Hackathon
export function TrophyIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Podium blocks */}
      <rect x="10" y="90" width="50" height="60" rx="5" fill="#8EC5FF" stroke="#111111" strokeWidth="4"/>
      <rect x="74" y="68" width="52" height="82" rx="5" fill="#FFD43B" stroke="#111111" strokeWidth="4.5"/>
      <rect x="140" y="102" width="50" height="48" rx="5" fill="#FF9FA6" stroke="#111111" strokeWidth="4"/>
      {/* Stars on podium */}
      <text x="35" y="128" fill="#111111" fontSize="22" fontWeight="900" textAnchor="middle">2</text>
      <text x="100" y="114" fill="#111111" fontSize="28" fontWeight="900" textAnchor="middle">1</text>
      <text x="165" y="134" fill="#111111" fontSize="22" fontWeight="900" textAnchor="middle">3</text>
      {/* Trophy cup */}
      <path d="M 82 12 C 82 44 118 44 118 12 Z" fill="#FFD43B" stroke="#111111" strokeWidth="4"/>
      <path d="M 82 14 C 72 14 66 24 74 30" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M 118 14 C 128 14 134 24 126 30" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="round"/>
      <rect x="92" y="44" width="16" height="12" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      <rect x="82" y="56" width="36" height="8" rx="3" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      {/* Star on trophy */}
      <path d="M100 20 L103 28 L112 28 L105 33 L107 42 L100 37 L93 42 L95 33 L88 28 L97 28 Z" fill="#D91E2E" stroke="#111111" strokeWidth="1.5"/>
      {/* Confetti dots */}
      <circle cx="20" cy="70" r="4" fill="#D91E2E"/>
      <circle cx="175" cy="65" r="4" fill="#A8D86E"/>
      <circle cx="52" cy="62" r="3" fill="#FFD43B"/>
      <circle cx="148" cy="74" r="3" fill="#8EC5FF"/>
      <rect x="160" y="56" width="6" height="6" rx="1" transform="rotate(20 160 56)" fill="#D91E2E"/>
      <rect x="34" y="76" width="6" height="6" rx="1" transform="rotate(-15 34 76)" fill="#A8D86E"/>
    </svg>
  );
}

// 5. 3D MODELLING – 3D Modelling / Blender / CGI / Sculpting
export function Model3dIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shadow */}
      <ellipse cx="100" cy="152" rx="55" ry="7" fill="#111111" opacity="0.15"/>
      {/* Isometric cube - Top face */}
      <polygon points="100,20 156,52 100,84 44,52" fill="#FFF0A6" stroke="#111111" strokeWidth="4.5"/>
      {/* Left face */}
      <polygon points="44,52 100,84 100,140 44,108" fill="#FFD43B" stroke="#111111" strokeWidth="4.5"/>
      {/* Right face */}
      <polygon points="100,84 156,52 156,108 100,140" fill="#FF9FA6" stroke="#111111" strokeWidth="4.5"/>
      {/* Edge highlights */}
      <line x1="100" y1="20" x2="100" y2="84" stroke="#111111" strokeWidth="2" strokeDasharray="4 3" opacity="0.5"/>
      {/* Vertex dots */}
      <circle cx="100" cy="20" r="6" fill="#D91E2E" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="156" cy="52" r="5" fill="#8EC5FF" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="44" cy="52" r="5" fill="#A8D86E" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="100" cy="140" r="5" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      {/* Wireframe accent lines on top face */}
      <line x1="100" y1="20" x2="100" y2="84" stroke="#111111" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4"/>
      <line x1="44" y1="52" x2="156" y2="52" stroke="#111111" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4"/>
      {/* Floating torus widget */}
      <circle cx="168" cy="28" r="14" fill="#8EC5FF" stroke="#111111" strokeWidth="3.5"/>
      <circle cx="168" cy="28" r="6" fill="#FAF9F5" stroke="#111111" strokeWidth="2.5"/>
      {/* Orbit rings */}
      <ellipse cx="168" cy="28" rx="14" ry="5" fill="none" stroke="#111111" strokeWidth="2" strokeDasharray="3 2"/>
    </svg>
  );
}

// 6. GRAPHIC DESIGN – Pen tool, swatches, design
export function GraphicDesignIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Big color wheel / palette circle */}
      <circle cx="80" cy="80" r="58" fill="#FAF9F5" stroke="#111111" strokeWidth="4.5"/>
      {/* Palette pie slices */}
      <path d="M80 80 L80 22 A58 58 0 0 1 130 50 Z" fill="#D91E2E" stroke="#111111" strokeWidth="2.5"/>
      <path d="M80 80 L130 50 A58 58 0 0 1 138 110 Z" fill="#FF9FA6" stroke="#111111" strokeWidth="2.5"/>
      <path d="M80 80 L138 110 A58 58 0 0 1 80 138 Z" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <path d="M80 80 L80 138 A58 58 0 0 1 22 110 Z" fill="#A8D86E" stroke="#111111" strokeWidth="2.5"/>
      <path d="M80 80 L22 110 A58 58 0 0 1 22 50 Z" fill="#8EC5FF" stroke="#111111" strokeWidth="2.5"/>
      <path d="M80 80 L22 50 A58 58 0 0 1 80 22 Z" fill="#FFF0A6" stroke="#111111" strokeWidth="2.5"/>
      {/* Thumb hole */}
      <circle cx="70" cy="108" r="10" fill="#FAF9F5" stroke="#111111" strokeWidth="3"/>
      {/* Pen tool overlaid */}
      <g transform="translate(112,20) rotate(40)">
        <polygon points="18,0 28,28 8,28" fill="#FAF9F5" stroke="#111111" strokeWidth="3.5"/>
        <polygon points="18,0 23,14 13,14" fill="#111111"/>
        <rect x="10" y="28" width="16" height="22" rx="3" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
        <rect x="10" y="28" width="16" height="6" fill="#FF9FA6"/>
      </g>
      {/* Bezier control points */}
      <path d="M 148 100 C 160 60 180 120 190 90" fill="none" stroke="#8EC5FF" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="148" cy="100" r="5" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="190" cy="90" r="5" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <line x1="148" y1="100" x2="160" y2="60" stroke="#999" strokeWidth="1.5" strokeDasharray="3 2"/>
      <line x1="190" y1="90" x2="180" y2="120" stroke="#999" strokeWidth="1.5" strokeDasharray="3 2"/>
      <circle cx="160" cy="60" r="4" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
      <circle cx="180" cy="120" r="4" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
    </svg>
  );
}

// 7. MOTION DESIGN – Keyframe timeline, speed curves
export function MotionDesignIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Timeline app window */}
      <rect x="10" y="14" width="180" height="122" rx="10" fill="#FAF9F5" stroke="#111111" strokeWidth="4.5"/>
      {/* Title bar */}
      <rect x="10" y="14" width="180" height="26" rx="10" fill="#111111"/>
      <rect x="10" y="30" width="180" height="10" fill="#111111"/>
      {/* Window dots */}
      <circle cx="26" cy="27" r="4.5" fill="#D91E2E"/>
      <circle cx="40" cy="27" r="4.5" fill="#FFD43B"/>
      <circle cx="54" cy="27" r="4.5" fill="#A8D86E"/>
      <text x="168" y="31" fill="#8EC5FF" fontSize="8" fontWeight="bold" textAnchor="end" fontFamily="monospace">60fps</text>
      {/* Track lanes */}
      <rect x="22" y="50" width="156" height="12" rx="3" fill="#FFF0A6" stroke="#111111" strokeWidth="1.5"/>
      <rect x="22" y="68" width="156" height="12" rx="3" fill="#FF9FA6" stroke="#111111" strokeWidth="1.5"/>
      <rect x="22" y="86" width="156" height="12" rx="3" fill="#8EC5FF" stroke="#111111" strokeWidth="1.5"/>
      {/* Keyframe diamonds */}
      <g transform="translate(44,56) rotate(45)"><rect x="-6" y="-6" width="12" height="12" fill="#D91E2E" stroke="#111111" strokeWidth="2"/></g>
      <g transform="translate(100,56) rotate(45)"><rect x="-6" y="-6" width="12" height="12" fill="#FFD43B" stroke="#111111" strokeWidth="2"/></g>
      <g transform="translate(156,56) rotate(45)"><rect x="-5" y="-5" width="10" height="10" fill="#D91E2E" stroke="#111111" strokeWidth="2"/></g>
      <g transform="translate(60,74) rotate(45)"><rect x="-5" y="-5" width="10" height="10" fill="#A8D86E" stroke="#111111" strokeWidth="2"/></g>
      <g transform="translate(140,74) rotate(45)"><rect x="-6" y="-6" width="12" height="12" fill="#8EC5FF" stroke="#111111" strokeWidth="2"/></g>
      {/* Speed curve */}
      <path d="M 22 110 C 60 110 80 118 110 104 C 140 90 160 118 178 110" fill="none" stroke="#D91E2E" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Playhead */}
      <line x1="100" y1="44" x2="100" y2="126" stroke="#D91E2E" strokeWidth="2.5" strokeDasharray="4 3"/>
      <polygon points="93,40 107,40 100,50" fill="#D91E2E" stroke="#111111" strokeWidth="1.5"/>
      {/* Halftone dot accent */}
      <circle cx="170" cy="130" r="3" fill="#FFD43B" opacity="0.7"/>
      <circle cx="160" cy="130" r="3" fill="#FFD43B" opacity="0.5"/>
      <circle cx="150" cy="130" r="3" fill="#FFD43B" opacity="0.3"/>
    </svg>
  );
}

// 8. VIDEO EDITING – Clapperboard, film, cinema
export function VideoEditingIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Clapperboard body */}
      <rect x="20" y="52" width="160" height="96" rx="10" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Scene / Take boxes */}
      <rect x="32" y="64" width="60" height="28" rx="5" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      <text x="62" y="76" fill="#111111" fontSize="8" fontWeight="900" textAnchor="middle">SCENE</text>
      <text x="62" y="86" fill="#111111" fontSize="11" fontWeight="900" textAnchor="middle">01</text>
      <rect x="102" y="64" width="66" height="28" rx="5" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <text x="135" y="76" fill="#111111" fontSize="8" fontWeight="900" textAnchor="middle">TAKE</text>
      <text x="135" y="86" fill="#111111" fontSize="11" fontWeight="900" textAnchor="middle">04</text>
      {/* Director info */}
      <text x="32" y="112" fill="#999" fontSize="7" fontWeight="bold" fontFamily="monospace">DIRECTOR: TINKER</text>
      <text x="32" y="124" fill="#999" fontSize="7" fontWeight="bold" fontFamily="monospace">PROD: TINKERHUB 2026</text>
      {/* Play button */}
      <circle cx="154" cy="120" r="16" fill="#D91E2E" stroke="#111111" strokeWidth="3"/>
      <polygon points="149,112 165,120 149,128" fill="#FFFFFF"/>
      {/* Top clapper stick */}
      <g transform="rotate(-18 20 52)">
        <rect x="20" y="24" width="160" height="30" rx="6" fill="#111111" stroke="#111111" strokeWidth="3"/>
        <polygon points="40,24 54,24 43,54 29,54" fill="#FAF9F5"/>
        <polygon points="70,24 84,24 73,54 59,54" fill="#FAF9F5"/>
        <polygon points="100,24 114,24 103,54 89,54" fill="#FAF9F5"/>
        <polygon points="130,24 144,24 133,54 119,54" fill="#FAF9F5"/>
        <polygon points="158,24 168,24 162,54 148,54" fill="#FAF9F5"/>
      </g>
      {/* Film sprocket holes */}
      <rect x="20" y="140" width="160" height="14" rx="3" fill="#111111"/>
      <rect x="28" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="44" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="60" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="76" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="92" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="108" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="124" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="140" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
      <rect x="156" y="143" width="7" height="8" rx="1" fill="#FAF9F5"/>
    </svg>
  );
}

// 9. UI/UX DESIGN – Mobile wireframe, cursor, components
export function UIUXIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Phone frame */}
      <rect x="18" y="10" width="90" height="140" rx="14" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Notch */}
      <rect x="48" y="16" width="30" height="8" rx="4" fill="#111111"/>
      {/* Screen content */}
      <rect x="26" y="32" width="74" height="22" rx="4" fill="#8EC5FF" stroke="#111111" strokeWidth="2.5"/>
      <rect x="26" y="60" width="34" height="40" rx="4" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <rect x="66" y="60" width="34" height="40" rx="4" fill="#FF9FA6" stroke="#111111" strokeWidth="2.5"/>
      <rect x="26" y="106" width="74" height="12" rx="6" fill="#A8D86E" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="86" cy="112" r="4" fill="#111111"/>
      {/* Nav dots */}
      <circle cx="53" cy="138" r="3" fill="#D91E2E"/>
      <circle cx="63" cy="138" r="3" fill="#D9D9D4" stroke="#111111" strokeWidth="1.5"/>
      <circle cx="73" cy="138" r="3" fill="#D9D9D4" stroke="#111111" strokeWidth="1.5"/>
      {/* Floating component card */}
      <rect x="120" y="20" width="68" height="56" rx="8" fill="#FFF0A6" stroke="#111111" strokeWidth="3.5"/>
      <circle cx="138" cy="38" r="8" fill="#D91E2E" stroke="#111111" strokeWidth="2.5"/>
      <rect x="150" y="34" width="28" height="5" rx="2" fill="#111111"/>
      <rect x="128" y="50" width="50" height="5" rx="2" fill="#D9D9D4"/>
      <rect x="128" y="60" width="36" height="5" rx="2" fill="#D9D9D4"/>
      {/* Big cartoon cursor */}
      <g transform="translate(118,86)">
        <path d="M0 0 L26 12 L16 18 L22 32 L14 35 L8 21 L0 28 Z" fill="#111111" stroke="#FAF9F5" strokeWidth="3" strokeLinejoin="round"/>
      </g>
      {/* Annotation lines */}
      <line x1="110" y1="42" x2="120" y2="42" stroke="#999" strokeWidth="1.5" strokeDasharray="3 2"/>
      <line x1="110" y1="70" x2="120" y2="60" stroke="#999" strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>
  );
}

// 10. AI IN DESIGN – Sparkles, robot brain, prompt magic
export function AIDesignIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Robot head */}
      <rect x="56" y="24" width="88" height="72" rx="16" fill="#8EC5FF" stroke="#111111" strokeWidth="5"/>
      {/* Antenna */}
      <line x1="100" y1="24" x2="100" y2="8" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="100" cy="6" r="5" fill="#D91E2E" stroke="#111111" strokeWidth="2.5"/>
      {/* Eye visor */}
      <rect x="66" y="38" width="68" height="24" rx="8" fill="#111111" stroke="#111111" strokeWidth="2.5"/>
      {/* Glowing eyes */}
      <circle cx="84" cy="50" r="7" fill="#A8D86E"/>
      <circle cx="116" cy="50" r="7" fill="#A8D86E"/>
      <circle cx="86" cy="48" r="2" fill="#FFFFFF"/>
      <circle cx="118" cy="48" r="2" fill="#FFFFFF"/>
      {/* Smile */}
      <path d="M 78 76 Q 100 90 122 76" fill="none" stroke="#111111" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Ear bolts */}
      <circle cx="56" cy="60" r="6" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <circle cx="144" cy="60" r="6" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      {/* Prompt box */}
      <rect x="16" y="108" width="168" height="44" rx="8" fill="#FFF0A6" stroke="#111111" strokeWidth="3.5"/>
      <text x="26" y="126" fill="#111111" fontSize="8" fontWeight="bold" fontFamily="monospace">▶  Generate: Creative logo</text>
      <rect x="26" y="132" width="100" height="8" rx="3" fill="#8EC5FF"/>
      <rect x="166" y="114" width="10" height="28" rx="3" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
      <polygon points="167,126 175,122 175,130" fill="#FFFFFF"/>
      {/* AI sparkles */}
      <path d="M26 24 L28.5 32 L36 34.5 L28.5 37 L26 45 L23.5 37 L16 34.5 L23.5 32 Z" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
      <path d="M162 18 L164 24 L170 26 L164 28 L162 34 L160 28 L154 26 L160 24 Z" fill="#FF9FA6" stroke="#111111" strokeWidth="1.5"/>
      <path d="M174 56 L175.5 60 L180 61.5 L175.5 63 L174 67 L172.5 63 L168 61.5 L172.5 60 Z" fill="#A8D86E" stroke="#111111" strokeWidth="1.5"/>
    </svg>
  );
}

// 11. ANIMATION – Flipbook, onion skin, cel animation
export function AnimationIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Stacked cel frames (back to front) */}
      <rect x="14" y="18" width="84" height="100" rx="6" fill="#8EC5FF" stroke="#111111" strokeWidth="3.5" transform="rotate(-14 14 18)"/>
      <rect x="40" y="14" width="84" height="100" rx="6" fill="#FFF0A6" stroke="#111111" strokeWidth="3.5" transform="rotate(-5 40 14)"/>
      {/* Front frame */}
      <rect x="72" y="18" width="90" height="108" rx="6" fill="#FAF9F5" stroke="#111111" strokeWidth="4.5"/>
      {/* Cartoon stick figure on front frame */}
      {/* Head */}
      <circle cx="117" cy="42" r="14" fill="#FF9FA6" stroke="#111111" strokeWidth="3.5"/>
      {/* Face */}
      <circle cx="112" cy="39" r="2.5" fill="#111111"/>
      <circle cx="122" cy="39" r="2.5" fill="#111111"/>
      <path d="M 111 47 Q 117 53 123 47" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Body */}
      <line x1="117" y1="56" x2="117" y2="88" stroke="#111111" strokeWidth="4.5" strokeLinecap="round"/>
      {/* Raised arm */}
      <line x1="117" y1="66" x2="98" y2="54" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
      {/* Other arm – waving star */}
      <line x1="117" y1="66" x2="140" y2="60" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
      {/* Legs */}
      <line x1="117" y1="88" x2="102" y2="108" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
      <line x1="117" y1="88" x2="132" y2="108" stroke="#111111" strokeWidth="4" strokeLinecap="round"/>
      {/* Speed/motion lines */}
      <line x1="74" y1="60" x2="90" y2="60" stroke="#D91E2E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3"/>
      <line x1="74" y1="70" x2="86" y2="70" stroke="#D91E2E" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2"/>
      {/* Cycle arrow */}
      <path d="M 80 130 C 110 144 148 144 164 130" fill="none" stroke="#D91E2E" strokeWidth="3" strokeLinecap="round"/>
      <polygon points="162,124 170,131 160,136" fill="#D91E2E"/>
    </svg>
  );
}

// 12. WEB DESIGN – Retro browser, responsive layout
export function WebDesignIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 155" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Browser window */}
      <rect x="10" y="12" width="180" height="132" rx="12" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Title bar */}
      <rect x="10" y="12" width="180" height="30" rx="12" fill="#FFD43B" stroke="#111111" strokeWidth="4"/>
      <rect x="10" y="32" width="180" height="10" fill="#FFD43B"/>
      {/* Dots */}
      <circle cx="28" cy="27" r="5" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
      <circle cx="42" cy="27" r="5" fill="#FAF9F5" stroke="#111111" strokeWidth="2"/>
      <circle cx="56" cy="27" r="5" fill="#A8D86E" stroke="#111111" strokeWidth="2"/>
      {/* URL bar */}
      <rect x="70" y="20" width="104" height="14" rx="4" fill="#FAF9F5" stroke="#111111" strokeWidth="2"/>
      <text x="76" y="30" fill="#666" fontSize="7" fontWeight="bold" fontFamily="monospace">🔒 tinkerhub.org</text>
      {/* Hero block */}
      <rect x="20" y="50" width="160" height="34" rx="6" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <rect x="32" y="58" width="70" height="8" rx="2" fill="#FAF9F5" opacity="0.8"/>
      <rect x="32" y="70" width="45" height="6" rx="2" fill="#FAF9F5" opacity="0.5"/>
      <polygon points="160,57 174,64 160,71" fill="#D91E2E"/>
      {/* 3 columns */}
      <rect x="20" y="92" width="46" height="44" rx="5" fill="#FF9FA6" stroke="#111111" strokeWidth="2.5"/>
      <rect x="74" y="92" width="46" height="44" rx="5" fill="#FFF0A6" stroke="#111111" strokeWidth="2.5"/>
      <rect x="128" y="92" width="52" height="44" rx="5" fill="#A8D86E" stroke="#111111" strokeWidth="2.5"/>
      {/* Column icons */}
      <rect x="32" y="100" width="22" height="12" rx="3" fill="#111111" opacity="0.2"/>
      <rect x="86" y="100" width="22" height="12" rx="3" fill="#111111" opacity="0.2"/>
      <rect x="140" y="100" width="22" height="12" rx="3" fill="#111111" opacity="0.2"/>
      <rect x="28" y="116" width="30" height="5" rx="2" fill="#111111" opacity="0.15"/>
      <rect x="82" y="116" width="30" height="5" rx="2" fill="#111111" opacity="0.15"/>
      <rect x="136" y="116" width="30" height="5" rx="2" fill="#111111" opacity="0.15"/>
      <rect x="28" y="124" width="20" height="5" rx="2" fill="#111111" opacity="0.1"/>
      <rect x="82" y="124" width="20" height="5" rx="2" fill="#111111" opacity="0.1"/>
      <rect x="136" y="124" width="20" height="5" rx="2" fill="#111111" opacity="0.1"/>
    </svg>
  );
}

// 13. CODING – Retro terminal, brackets, command line
export function CodingIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 155" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Terminal body */}
      <rect x="10" y="10" width="180" height="135" rx="12" fill="#111111" stroke="#111111" strokeWidth="5"/>
      {/* Title bar */}
      <rect x="10" y="10" width="180" height="28" rx="12" fill="#222222"/>
      <rect x="10" y="28" width="180" height="10" fill="#222222"/>
      {/* Window dots */}
      <circle cx="26" cy="24" r="5" fill="#D91E2E"/>
      <circle cx="40" cy="24" r="5" fill="#FFD43B"/>
      <circle cx="54" cy="24" r="5" fill="#A8D86E"/>
      <text x="100" y="27" fill="#666" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">dev@tinkerhub: ~</text>
      {/* Code lines */}
      <text x="24" y="58" fill="#A8D86E" fontSize="11" fontWeight="bold" fontFamily="monospace">$ npm run dev</text>
      <text x="24" y="76" fill="#FFD43B" fontSize="9" fontFamily="monospace">▶ Starting TinkerHub...</text>
      <text x="24" y="92" fill="#8EC5FF" fontSize="9" fontFamily="monospace">const score = () ={'>'} {'{'}</text>
      <text x="36" y="106" fill="#FF9FA6" fontSize="9" fontFamily="monospace">return 💯 + hustle;</text>
      <text x="24" y="120" fill="#8EC5FF" fontSize="9" fontFamily="monospace">{'}'}</text>
      {/* Blinking cursor */}
      <rect x="44" y="122" width="8" height="12" fill="#A8D86E"/>
      {/* Decorative brackets accent */}
      <text x="148" y="82" fill="#FFD43B" fontSize="40" fontWeight="900" fontFamily="monospace" opacity="0.12">{'}'}</text>
    </svg>
  );
}

// 14. BACKEND – Servers, database, cloud
export function BackendIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 155" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Server rack 1 */}
      <rect x="20" y="14" width="160" height="32" rx="6" fill="#FAF9F5" stroke="#111111" strokeWidth="4"/>
      <circle cx="36" cy="30" r="5" fill="#A8D86E" stroke="#111111" strokeWidth="2"/>
      <circle cx="50" cy="30" r="5" fill="#A8D86E" stroke="#111111" strokeWidth="2"/>
      <rect x="68" y="22" width="72" height="16" rx="3" fill="#111111"/>
      <text x="104" y="33" fill="#A8D86E" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">API: 200 OK ✓</text>
      <circle cx="168" cy="30" r="5" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
      {/* Server rack 2 */}
      <rect x="20" y="52" width="160" height="32" rx="6" fill="#FAF9F5" stroke="#111111" strokeWidth="4"/>
      <circle cx="36" cy="68" r="5" fill="#8EC5FF" stroke="#111111" strokeWidth="2"/>
      <circle cx="50" cy="68" r="5" fill="#8EC5FF" stroke="#111111" strokeWidth="2"/>
      <rect x="68" y="60" width="72" height="16" rx="3" fill="#111111"/>
      <text x="104" y="71" fill="#8EC5FF" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">POSTGRESQL</text>
      <circle cx="168" cy="68" r="5" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
      {/* Server rack 3 */}
      <rect x="20" y="90" width="160" height="20" rx="4" fill="#FFF0A6" stroke="#111111" strokeWidth="3"/>
      <text x="100" y="104" fill="#111111" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">REDIS CACHE</text>
      {/* Database cylinder */}
      <ellipse cx="60" cy="130" rx="30" ry="8" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      <rect x="30" y="130" width="60" height="20" fill="#FFD43B" stroke="#111111" strokeWidth="2.5"/>
      <ellipse cx="60" cy="150" rx="30" ry="8" fill="#FFF0A6" stroke="#111111" strokeWidth="3"/>
      <ellipse cx="60" cy="140" rx="30" ry="8" fill="none" stroke="#111111" strokeWidth="2" strokeDasharray="3 2"/>
      {/* Cloud icon */}
      <circle cx="148" cy="130" r="12" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <circle cx="162" cy="134" r="9" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <circle cx="136" cy="134" r="8" fill="#8EC5FF" stroke="#111111" strokeWidth="3"/>
      <rect x="128" y="136" width="42" height="10" rx="2" fill="#8EC5FF"/>
      <line x1="148" y1="148" x2="148" y2="155" stroke="#111111" strokeWidth="2" strokeDasharray="2 2"/>
      <line x1="140" y1="152" x2="148" y2="155" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
      <line x1="156" y1="152" x2="148" y2="155" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// 15. FRONTEND – HTML, CSS, JS stacked badges with code
export function FrontendIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Big code tag */}
      <rect x="14" y="14" width="172" height="80" rx="12" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Left angle bracket < */}
      <path d="M 50 38 L 28 54 L 50 70" fill="none" stroke="#D91E2E" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Slash / */}
      <line x1="100" y1="32" x2="84" y2="76" stroke="#FFD43B" strokeWidth="7" strokeLinecap="round"/>
      {/* Right angle bracket > */}
      <path d="M 116 38 L 138 54 L 116 70" fill="none" stroke="#8EC5FF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Shield badges */}
      {/* HTML5 shield */}
      <path d="M 24 104 L 28 148 L 60 158 L 92 148 L 96 104 Z" fill="#D91E2E" stroke="#111111" strokeWidth="4"/>
      <path d="M 60 104 L 60 150 L 88 142 L 92 104 Z" fill="#FF9FA6" stroke="#111111" strokeWidth="0"/>
      <text x="60" y="130" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">HTML</text>
      <text x="60" y="144" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">5</text>
      {/* CSS3 shield */}
      <path d="M 76 104 L 80 144 L 108 153 L 136 144 L 140 104 Z" fill="#8EC5FF" stroke="#111111" strokeWidth="4"/>
      <path d="M 108 104 L 108 146 L 132 138 L 136 104 Z" fill="#B8D9F0" stroke="#111111" strokeWidth="0"/>
      <text x="108" y="128" fill="#111111" fontSize="10" fontWeight="900" textAnchor="middle">CSS</text>
      <text x="108" y="142" fill="#111111" fontSize="9" fontWeight="900" textAnchor="middle">3</text>
      {/* JS shield */}
      <rect x="148" y="104" width="44" height="48" rx="4" fill="#FFD43B" stroke="#111111" strokeWidth="4"/>
      <text x="152" y="125" fill="#111111" fontSize="10" fontWeight="900">JS</text>
      <text x="152" y="140" fill="#111111" fontSize="7" fontWeight="bold" fontFamily="monospace">ES6+</text>
    </svg>
  );
}

// 16. ROCKET – Hackathon, Launchpad, Sprint event
export function RocketIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Space / Stars background dots */}
      <circle cx="18" cy="18" r="2" fill="#FFD43B"/>
      <circle cx="172" cy="30" r="2.5" fill="#FFFFFF" opacity="0.6"/>
      <circle cx="30" cy="110" r="2" fill="#8EC5FF" opacity="0.7"/>
      <circle cx="180" cy="90" r="2" fill="#FFD43B" opacity="0.5"/>
      <circle cx="155" cy="18" r="1.5" fill="#FAF9F5" opacity="0.5"/>
      <circle cx="50" cy="150" r="1.5" fill="#FAF9F5" opacity="0.4"/>
      {/* Flames */}
      <polygon points="84,148 100,174 116,148" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      <polygon points="88,148 100,166 112,148" fill="#D91E2E" stroke="#111111" strokeWidth="2"/>
      <polygon points="94,148 100,158 106,148" fill="#FF9FA6"/>
      {/* Fins */}
      <polygon points="64,118 44,148 78,138" fill="#D91E2E" stroke="#111111" strokeWidth="4"/>
      <polygon points="136,118 156,148 122,138" fill="#D91E2E" stroke="#111111" strokeWidth="4"/>
      {/* Body */}
      <path d="M 100 16 C 72 42 68 98 68 138 L 132 138 C 132 98 128 42 100 16 Z" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Nose cone */}
      <path d="M 100 16 C 86 28 78 48 76 58 L 124 58 C 122 48 114 28 100 16 Z" fill="#D91E2E" stroke="#111111" strokeWidth="4"/>
      {/* Porthole window */}
      <circle cx="100" cy="92" r="18" fill="#8EC5FF" stroke="#111111" strokeWidth="4"/>
      <circle cx="100" cy="92" r="11" fill="#5AA8E0" stroke="#111111" strokeWidth="2.5"/>
      {/* Astronaut face in window */}
      <circle cx="96" cy="88" r="3" fill="#FFFFFF"/>
      <circle cx="104" cy="88" r="3" fill="#FFFFFF"/>
      <path d="M 95 95 Q 100 100 105 95" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
      {/* Stars / sparkle */}
      <path d="M30 34 L32 40 L38 42 L32 44 L30 50 L28 44 L22 42 L28 40 Z" fill="#FFD43B" stroke="#111111" strokeWidth="1.5"/>
      <path d="M165 58 L166.5 62.5 L171 64 L166.5 65.5 L165 70 L163.5 65.5 L159 64 L163.5 62.5 Z" fill="#FF9FA6" stroke="#111111" strokeWidth="1.5"/>
    </svg>
  );
}

// 17. COMPUTER – Retro workstation / PC
export function ComputerIllustration({ className = "w-32 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Monitor body */}
      <rect x="20" y="10" width="160" height="110" rx="12" fill="#FAF9F5" stroke="#111111" strokeWidth="5"/>
      {/* Bezel / screen area */}
      <rect x="32" y="22" width="136" height="80" rx="6" fill="#111111" stroke="#111111" strokeWidth="2.5"/>
      <rect x="36" y="26" width="128" height="72" rx="4" fill="#8EC5FF"/>
      {/* Screen content - retro OS */}
      <rect x="36" y="26" width="128" height="12" rx="4" fill="#D91E2E"/>
      <circle cx="46" cy="32" r="3.5" fill="#FFFFFF" opacity="0.7"/>
      <circle cx="56" cy="32" r="3.5" fill="#FFFFFF" opacity="0.5"/>
      <text x="100" y="34" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">TINKER OS 2026</text>
      {/* Desktop icons */}
      <rect x="44" y="46" width="20" height="16" rx="3" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
      <text x="54" y="57" fill="#111111" fontSize="7" fontWeight="bold" textAnchor="middle">📁</text>
      <rect x="72" y="46" width="20" height="16" rx="3" fill="#A8D86E" stroke="#111111" strokeWidth="2"/>
      <text x="82" y="57" fill="#111111" fontSize="7" fontWeight="bold" textAnchor="middle">💻</text>
      <rect x="100" y="46" width="20" height="16" rx="3" fill="#FF9FA6" stroke="#111111" strokeWidth="2"/>
      <text x="110" y="57" fill="#111111" fontSize="7" fontWeight="bold" textAnchor="middle">🚀</text>
      {/* Terminal mini window */}
      <rect x="44" y="68" width="112" height="24" rx="4" fill="#111111" stroke="#111111" strokeWidth="2"/>
      <text x="50" y="78" fill="#A8D86E" fontSize="7" fontFamily="monospace">$ tinker build</text>
      <text x="50" y="88" fill="#FFD43B" fontSize="7" fontFamily="monospace">▶ Ready! ✓</text>
      {/* Stand */}
      <rect x="88" y="120" width="24" height="14" fill="#D9D9D4" stroke="#111111" strokeWidth="3"/>
      <rect x="64" y="134" width="72" height="10" rx="4" fill="#FAF9F5" stroke="#111111" strokeWidth="3"/>
      {/* Keyboard */}
      <rect x="28" y="146" width="144" height="14" rx="5" fill="#FFD43B" stroke="#111111" strokeWidth="3"/>
      {/* Keys */}
      <rect x="36" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="48" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="60" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="72" y="149" width="36" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="112" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="124" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
      <rect x="136" y="149" width="8" height="8" rx="1" fill="#FFF0A6" stroke="#111111" strokeWidth="1"/>
    </svg>
  );
}

// 18. PENCIL – Sketching, Ideation, Creative brainstorm
export function PencilIllustration({ className = "w-32 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sketch lines on paper background */}
      <rect x="14" y="14" width="172" height="130" rx="8" fill="#FFF0A6" stroke="#111111" strokeWidth="4"/>
      {/* Ruled lines */}
      <line x1="28" y1="40" x2="172" y2="40" stroke="#D9D9D4" strokeWidth="1.5"/>
      <line x1="28" y1="56" x2="172" y2="56" stroke="#D9D9D4" strokeWidth="1.5"/>
      <line x1="28" y1="72" x2="172" y2="72" stroke="#D9D9D4" strokeWidth="1.5"/>
      <line x1="28" y1="88" x2="172" y2="88" stroke="#D9D9D4" strokeWidth="1.5"/>
      <line x1="28" y1="104" x2="172" y2="104" stroke="#D9D9D4" strokeWidth="1.5"/>
      {/* Sketch doodles on paper */}
      <path d="M 36 30 C 44 20 60 24 56 30 C 52 36 40 34 36 30 Z" fill="none" stroke="#111111" strokeWidth="2.5" strokeDasharray="2 2"/>
      <circle cx="80" cy="64" r="10" fill="none" stroke="#D91E2E" strokeWidth="2.5" strokeDasharray="3 2"/>
      <rect x="100" y="46" width="30" height="20" rx="3" fill="none" stroke="#8EC5FF" strokeWidth="2.5" strokeDasharray="3 2"/>
      <path d="M 36 80 Q 60 68 84 80 Q 108 92 132 78" fill="none" stroke="#A8D86E" strokeWidth="2.5"/>
      {/* Big cartoon pencil overlaid */}
      <g transform="translate(118,18) rotate(38)">
        {/* Eraser */}
        <rect x="0" y="0" width="26" height="18" rx="4" fill="#FF9FA6" stroke="#111111" strokeWidth="3.5"/>
        {/* Ferrule */}
        <rect x="0" y="18" width="26" height="12" fill="#D9D9D4" stroke="#111111" strokeWidth="3"/>
        <line x1="0" y1="22" x2="26" y2="22" stroke="#111111" strokeWidth="1.5"/>
        <line x1="0" y1="26" x2="26" y2="26" stroke="#111111" strokeWidth="1.5"/>
        {/* Shaft */}
        <rect x="0" y="30" width="26" height="72" fill="#FFD43B" stroke="#111111" strokeWidth="3.5"/>
        <rect x="9" y="30" width="8" height="72" fill="#FFF0A6"/>
        {/* Wood cone */}
        <polygon points="0,102 26,102 13,132" fill="#FAF9F5" stroke="#111111" strokeWidth="3.5"/>
        <polygon points="8,118 18,118 13,132" fill="#111111"/>
      </g>
      {/* Star doodle */}
      <path d="M 56 118 L 58.5 124 L 65 126 L 59 130 L 60.5 137 L 56 133 L 51.5 137 L 53 130 L 47 126 L 53.5 124 Z" fill="#FFD43B" stroke="#111111" strokeWidth="2"/>
    </svg>
  );
}

// ============================================================================
// RETRO STICKERS & BADGES (unchanged helpers)
// ============================================================================
export function BuildCreateInspireBadge({ className = "w-28" }: { className?: string }) {
  return (
    <div className={`relative inline-block transform -rotate-3 select-none ${className}`}>
      <div className="border-2 border-[#111111] bg-[#FF9FA6] px-2 py-0.5 text-[11px] font-black tracking-wider text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
        BUILD
      </div>
      <div className="border-2 border-[#111111] bg-[#FFD43B] px-2 py-0.5 text-[11px] font-black tracking-wider text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -mt-1 uppercase">
        CREATE
      </div>
      <div className="border-2 border-[#111111] bg-[#8EC5FF] px-2 py-0.5 text-[11px] font-black tracking-wider text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -mt-1 uppercase">
        INSPIRE
      </div>
    </div>
  );
}

export function LeaderboardRibbon({ text = "LEADERBOARD", className = "" }: { text?: string; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center bg-[#FFD43B] border-2 border-[#111111] px-4 py-1 font-black text-xs md:text-sm tracking-widest text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm ${className}`}>
      {text}
    </div>
  );
}

export function YourPositionRibbon({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#FF9FA6] border-2 border-[#111111] px-4 py-1.5 font-black text-xs tracking-widest text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-sm uppercase ${className}`}>
      <RetroStar color="#FFD43B" className="w-3.5 h-3.5" />
      <span>YOUR POSITION</span>
      <RetroStar color="#FFD43B" className="w-3.5 h-3.5" />
    </div>
  );
}

export function MotivationalFooterBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 bg-[#FAF9F5] border-2 border-[#111111] px-4 py-2 text-xs font-bold text-[#111111] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-full ${className}`}>
      <span>Keep going! Great work!</span>
      <span>✍️</span>
    </div>
  );
}

export function RetroStar({ color = "#FFD43B", className = "w-5 h-5" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"
        fill={color}
        stroke="#111111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ color = "#D91E2E", className = "w-4 h-4" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z" fill={color} />
    </svg>
  );
}

export function LightningBolt({ color = "#FFD43B", className = "w-4 h-5" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M 14 2 L 2 18 L 12 18 L 10 30 L 22 14 L 12 14 Z"
        fill={color}
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ============================================================================
// DETERMINISTIC THEME GENERATOR & RENDERER (unchanged logic)
// ============================================================================
const ALL_ILLUSTRATION_KEYS = [
  'cassette',
  'gameboy',
  'camera',
  'trophy',
  'model3d',
  'graphicdesign',
  'motion',
  'video',
  'uiux',
  'aidesign',
  'animation',
  'webdesign',
  'coding',
  'backend',
  'frontend',
  'rocket',
  'computer',
  'pencil',
] as const;

export function getEventTheme(slug: string, chosenKey?: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const mainIllustration = chosenKey || ALL_ILLUSTRATION_KEYS[absHash % ALL_ILLUSTRATION_KEYS.length];

  const primaryAccentColors = ['#D91E2E', '#FFD43B', '#8EC5FF', '#FF9FA6', '#A8D86E'];
  const accent1 = primaryAccentColors[absHash % primaryAccentColors.length];
  const accent2 = primaryAccentColors[(absHash + 1) % primaryAccentColors.length];

  return {
    mainIllustration,
    accent1,
    accent2,
  };
}

export function IllustrationRenderer({ 
  illustrationKey, 
  className = "w-28 h-20" 
}: { 
  illustrationKey: string; 
  className?: string 
}) {
  switch (illustrationKey) {
    case 'gameboy':
      return <GameboyIllustration className={className} />;
    case 'camera':
      return <CameraIllustration className={className} />;
    case 'trophy':
      return <TrophyIllustration className={className} />;
    case 'model3d':
      return <Model3dIllustration className={className} />;
    case 'graphicdesign':
      return <GraphicDesignIllustration className={className} />;
    case 'motion':
      return <MotionDesignIllustration className={className} />;
    case 'video':
      return <VideoEditingIllustration className={className} />;
    case 'uiux':
      return <UIUXIllustration className={className} />;
    case 'aidesign':
      return <AIDesignIllustration className={className} />;
    case 'animation':
      return <AnimationIllustration className={className} />;
    case 'webdesign':
      return <WebDesignIllustration className={className} />;
    case 'coding':
      return <CodingIllustration className={className} />;
    case 'backend':
      return <BackendIllustration className={className} />;
    case 'frontend':
      return <FrontendIllustration className={className} />;
    case 'rocket':
      return <RocketIllustration className={className} />;
    case 'computer':
      return <ComputerIllustration className={className} />;
    case 'pencil':
      return <PencilIllustration className={className} />;
    case 'cassette':
    default:
      return <CassetteIllustration className={className} />;
  }
}
