import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Measures the active element ([data-liquid-active="true"]) inside a relative container
 * and returns GPU-accelerated transform geometry for a gliding Liquid Glass pill indicator.
 */
export function useLiquidSlider(activeKey, deps = []) {
  const containerRef = useRef(null);
  const hasPositionedRef = useRef(false);
  const [geom, setGeom] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    animate: false,
  });

  const depsKey = deps.join('|');

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = (allowAnimate) => {
      const activeEl = container.querySelector('[data-liquid-active="true"]');
      if (!activeEl) {
        setGeom((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const x = activeEl.offsetLeft;
      const y = activeEl.offsetTop;
      const width = activeEl.offsetWidth;
      const height = activeEl.offsetHeight;

      if (width === 0 || height === 0) return;

      const animate = allowAnimate && hasPositionedRef.current;
      hasPositionedRef.current = true;

      setGeom((prev) => {
        if (
          prev.visible &&
          prev.x === x &&
          prev.y === y &&
          prev.width === width &&
          prev.height === height &&
          prev.animate === animate
        ) {
          return prev;
        }
        return { x, y, width, height, visible: true, animate };
      });
    };

    measure(true);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => measure(false));
      observer.observe(container);
      const activeEl = container.querySelector('[data-liquid-active="true"]');
      if (activeEl) observer.observe(activeEl);
    }

    const handleResize = () => measure(false);
    window.addEventListener('resize', handleResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => measure(false)).catch(() => {});
    }

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [activeKey, depsKey]);

  const indicatorStyle = {
    transform: `translate3d(${geom.x}px, ${geom.y}px, 0)`,
    width: `${geom.width}px`,
    height: `${geom.height}px`,
    opacity: geom.visible ? 1 : 0,
    transition: geom.animate
      ? 'transform 0.42s cubic-bezier(0.32, 1.16, 0.42, 1), width 0.36s cubic-bezier(0.32, 1.08, 0.42, 1), height 0.36s cubic-bezier(0.32, 1.08, 0.42, 1), opacity 0.2s ease'
      : 'opacity 0.16s ease',
  };

  return { containerRef, indicatorStyle, isVisible: geom.visible };
}
