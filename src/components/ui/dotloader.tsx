import React from 'react';

interface DotLoaderProps {
  width?: string;
  height?: string;
  color?: string;
  radius?: string;
  visible?: boolean;
  ariaLabel?: string;
  wrapperStyle?: React.CSSProperties;
  wrapperClass?: string;
}

const DotLoader: React.FC<DotLoaderProps> = ({ 
  width = "80", 
  height = "80",
  color = "#0B5F94",
  radius = "9",
  visible = true,
  ariaLabel = "three-dots-loading",
  wrapperStyle = {},
  wrapperClass = ""
}) => {
  if (!visible) return null;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${width}px`,
    height: `${height}px`,
    ...wrapperStyle
  };

  const dotStyle: React.CSSProperties = {
    width: `${radius}px`,
    height: `${radius}px`,
    backgroundColor: color,
    borderRadius: '50%',
    margin: '0 2px',
    animation: 'threeDotsBounce 1.4s ease-in-out infinite both'
  };

  return (
    <>
      <style>
        {`
          @keyframes threeDotsBounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
          
          .three-dots-loader .dot-1 {
            animation-delay: -0.32s;
          }
          
          .three-dots-loader .dot-2 {
            animation-delay: -0.16s;
          }
          
          .three-dots-loader .dot-3 {
            animation-delay: 0s;
          }
        `}
      </style>
      <div 
        className={`three-dots-loader ${wrapperClass}`}
        style={containerStyle}
        role="status"
        aria-label={ariaLabel}
      >
        <div className="dot-1" style={dotStyle}></div>
        <div className="dot-2" style={dotStyle}></div>
        <div className="dot-3" style={dotStyle}></div>
      </div>
    </>
  );
};

export default DotLoader;