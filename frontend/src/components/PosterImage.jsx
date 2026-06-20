import { useState } from 'react';

const GRADIENTS = [
  'linear-gradient(135deg,#1B2A4A,#2E5C8A)',
  'linear-gradient(135deg,#2B2140,#5B4FE9)',
  'linear-gradient(135deg,#3B1F1F,#7A3B3B)',
  'linear-gradient(135deg,#1F3B2E,#2E7A5C)'
];

function hashStr(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % GRADIENTS.length;
  return Math.abs(h);
}

export default function PosterImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center text-white text-xs font-semibold text-center px-2 ${className}`}
        style={{ background: GRADIENTS[hashStr(alt)] }}
      >
        {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
