import React, { useState, useCallback } from 'react';

const SidebarTooltip = ({ children, content, disabled = false }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const showTooltip = useCallback((e) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.right + 8; // 8px a la derecha del contenedor
    const y = rect.top + (rect.height / 2) - 18; // Centrado verticalmente (ajustado)
    
    setTooltip({ visible: true, x, y });
  }, [disabled]);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="w-full"
      >
        {children}
      </div>
      
      {tooltip.visible && content && (
        <div
          style={{
            position: 'fixed',
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            zIndex: 9999,
            background: '#111827',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            border: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '-5px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '5px solid #111827'
            }}
          />
          {content}
        </div>
      )}
    </>
  );
};

export default SidebarTooltip;