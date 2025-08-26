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
          className="tooltip-custom"
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
          }}
        >
          <div
            className="absolute left-[-5px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent border-r-light-sidebar/80 dark:border-r-dark-sidebar/80 filter drop-shadow-[-1px_0_1px_rgba(0,0,0,0.1)]"
          />
          {content}
        </div>
      )}
    </>
  );
};

export default SidebarTooltip;