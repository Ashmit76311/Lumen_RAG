import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Logo({ size = 'large' }) {
  const iconSize = size === 'large' ? 20 : 16;
  const boxSize = size === 'large' ? 40 : 32;
  const fontSize = size === 'large' ? 20 : 17;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: boxSize, 
        height: boxSize,
        background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
        borderRadius: '10px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <Sparkles size={iconSize} color="white" />
      </div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: fontSize, color: '#F9FAFB' }}>
        Lumen
      </span>
    </div>
  );
}
