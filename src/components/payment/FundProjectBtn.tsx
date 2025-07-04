import React from 'react'

interface FundProjectBtnProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const FundProjectBtn: React.FC<FundProjectBtnProps> = ({ onClick, children, className, ...props }) => {
  return (
    <button 
      onClick={onClick} 
      className={`mt-6 cursor-pointer bg-boldblue text-white text-sm p-2 font-semibold hover:bg-boldblue/70  rounded ${className || ''}`}
      {...props}
    >
      {children || 'Fund Project'}
    </button>
  )
}

export default FundProjectBtn