import React from 'react';

// 臨時替代SVG導入問題
const LogoSVG = (props: any) => (
  <div 
    onClick={props.onClick} 
    style={{ 
      ...props.style, 
      width: 150, 
      height: 50, 
      background: '#3f51b5', 
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '5px',
      cursor: props.onClick ? 'pointer' : 'default'
    }}
  >
    TeamUpQuick
  </div>
);

interface LogoProps {
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function Logo({ onClick, style }: LogoProps) {
  return <LogoSVG onClick={onClick} style={style} />;
}
