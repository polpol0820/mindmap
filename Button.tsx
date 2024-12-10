'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = 'primary', style }) => {
  const baseStyle = {
    padding: '10px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    flex: '1',
    margin: '0 5px',
    ...style,
  };

  const typeStyles: Record<typeof type, React.CSSProperties> = {
    primary: { backgroundColor: '#007bff', color: '#fff' },
    secondary: { backgroundColor: '#f0f0f0', color: '#000', border: '1px solid #ccc' },
    danger: { backgroundColor: '#dc3545', color: '#fff' },
  };

  return <button onClick={onClick} style={{ ...baseStyle, ...typeStyles[type] }}>{label}</button>;
};

export default Button;
