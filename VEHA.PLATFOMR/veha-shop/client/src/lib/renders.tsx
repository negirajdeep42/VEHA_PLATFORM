import type { Kind } from '../types';

/** The shared gradient/filter defs. Render once near the app root. */
export function VehaDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8EAB8" /><stop offset=".45" stopColor="#D9B85C" />
          <stop offset=".72" stopColor="#B98E36" /><stop offset="1" stopColor="#8E6A22" />
        </linearGradient>
        <linearGradient id="gold-h" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBF0CB" /><stop offset=".3" stopColor="#E3C46A" />
          <stop offset=".55" stopColor="#C49B3F" /><stop offset=".8" stopColor="#EAD081" />
          <stop offset="1" stopColor="#8E6A22" />
        </linearGradient>
        <radialGradient id="gem" cx="40%" cy="32%" r="78%">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".26" stopColor="#FBF0CB" />
          <stop offset=".62" stopColor="#E3C46A" /><stop offset="1" stopColor="#9A7026" />
        </radialGradient>
        <radialGradient id="diamond" cx="42%" cy="28%" r="82%">
          <stop offset="0" stopColor="#FFFFFF" /><stop offset=".4" stopColor="#EAF6FF" />
          <stop offset=".75" stopColor="#C4DCEC" /><stop offset="1" stopColor="#8FB3CE" />
        </radialGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
    </svg>
  );
}

const shapes: Record<Kind, JSX.Element> = {
  ring: (
    <>
      <ellipse cx="100" cy="166" rx="46" ry="9" fill="#000" opacity="0.45" filter="url(#soft)" />
      <path fill="url(#gold-h)" fillRule="evenodd" d="M54,122 A46,46 0 1 0 146,122 A46,46 0 1 0 54,122 Z M67,122 A33,33 0 1 1 133,122 A33,33 0 1 1 67,122 Z" />
      <path d="M88,76 L112,76 L106,90 L94,90 Z" fill="url(#gold-h)" />
      <path d="M100,24 L122,46 L100,72 L78,46 Z" fill="url(#diamond)" />
    </>
  ),
  cuff: (
    <>
      <ellipse cx="100" cy="160" rx="64" ry="11" fill="#000" opacity="0.45" filter="url(#soft)" />
      <path fill="url(#gold-h)" fillRule="evenodd" d="M40,98 A60,56 0 1 0 160,98 A60,56 0 1 0 40,98 Z M58,98 A42,38 0 1 1 142,98 A42,38 0 1 1 58,98 Z" />
      <path d="M100,28 L112,44 L100,60 L88,44 Z" fill="url(#diamond)" />
    </>
  ),
  earrings: (
    <>
      <circle cx="68" cy="54" r="6" fill="none" stroke="url(#gold-h)" strokeWidth="3" />
      <path d="M68,62 C44,80 44,120 68,138 C92,120 92,80 68,62 Z" fill="url(#gold-h)" />
      <path d="M68,72 C50,86 50,116 68,130 C86,116 86,86 68,72 Z" fill="url(#gem)" />
      <circle cx="132" cy="54" r="6" fill="none" stroke="url(#gold-h)" strokeWidth="3" />
      <path d="M132,62 C108,80 108,120 132,138 C156,120 156,80 132,62 Z" fill="url(#gold-h)" />
      <path d="M132,72 C114,86 114,116 132,130 C150,116 150,86 132,72 Z" fill="url(#gem)" />
    </>
  ),
  hoops: (
    <>
      <circle cx="70" cy="92" r="34" fill="none" stroke="url(#gold-h)" strokeWidth="7" />
      <circle cx="130" cy="92" r="34" fill="none" stroke="url(#gold-h)" strokeWidth="7" />
    </>
  ),
  necklace: (
    <>
      <path d="M38,44 Q100,150 162,44" fill="none" stroke="url(#gold-h)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="122" r="6" fill="none" stroke="url(#gold-h)" strokeWidth="3" />
      <path d="M100,130 C84,144 84,168 100,178 C116,168 116,144 100,130 Z" fill="url(#gold-h)" />
      <path d="M100,138 C88,150 88,166 100,172 C112,166 112,150 100,138 Z" fill="url(#diamond)" />
    </>
  ),
  tennis: (
    <>
      <path d="M30,100 Q100,70 170,100" fill="none" stroke="url(#gold-h)" strokeWidth="6" strokeLinecap="round" />
      <path d="M30,100 Q100,130 170,100" fill="none" stroke="url(#gold-h)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="76" cy="82" r="5.5" fill="url(#diamond)" />
      <circle cx="100" cy="79" r="6" fill="url(#diamond)" />
      <circle cx="124" cy="82" r="5.5" fill="url(#diamond)" />
    </>
  ),
};

export function Render({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {shapes[kind] ?? shapes.ring}
    </svg>
  );
}
