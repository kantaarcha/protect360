import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Interactive 3D Financial & PROTECT360-Logo-Inspired Animated Canvas Background.
 * Rendered exclusively behind the Onboarding / Welcome screen (does NOT affect main modules).
 * - Palette: Deep Cobalt Blue, Chartreuse-Emerald Green, Crisp White (matching /logo.png)
 * - Motion: Ambient financial trajectories, 3D layered logo triangles & rising bar clusters,
 *           smooth mouse parallax, and interactive click/tap impulse waves + upward trend sparks.
 */
export default function WelcomeFinancialCanvas() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth || 1280;
    let height = window.innerHeight || 720;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: width * 0.5,
      y: height * 0.48,
      targetNormX: 0,
      targetNormY: 0,
      normX: 0,
      normY: 0,
      active: false,
    };

    const resizeCanvas = () => {
      width = window.innerWidth || 1280;
      height = window.innerHeight || 720;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    // Seed geometric PROTECT360 prisms (triangle + rising mini-bars echoing /logo.png)
    const NODE_COUNT = width < 640 ? 22 : 38;
    const PRISM_COUNT = width < 640 ? 6 : 11;

    const nodes = Array.from({ length: NODE_COUNT }, (_, idx) => {
      const z = 0.25 + Math.random() * 0.85;
      const isGreen = idx % 3 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * z,
        vy: (-0.18 - Math.random() * 0.28) * z,
        boostX: 0,
        boostY: 0,
        r: (2.2 + Math.random() * 3.2) * z,
        z,
        isGreen,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const prisms = Array.from({ length: PRISM_COUNT }, (_, idx) => {
      const z = 0.35 + (idx / PRISM_COUNT) * 0.65;
      return {
        x: (0.06 + Math.random() * 0.88) * width,
        y: (0.08 + Math.random() * 0.84) * height,
        size: (34 + Math.random() * 44) * z,
        z,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -0.12 - Math.random() * 0.16,
        boostX: 0,
        boostY: 0,
        rot: (Math.random() - 0.5) * 0.26,
        rotVel: (Math.random() - 0.5) * 0.0022,
        phase: Math.random() * Math.PI * 2,
      };
    });

    // Click/tap shockwaves & ascending financial spark arrows
    const ripples = [];
    const arrowSparks = [];

    const spawnImpulse = (cx, cy) => {
      ripples.push({
        x: cx,
        y: cy,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.42 + 90,
        alpha: 0.72,
      });

      // Push nearby nodes and logo prisms physically away from the click point
      for (const n of nodes) {
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 320) {
          const force = ((320 - dist) / 320) * 6.2 * n.z;
          n.boostX += (dx / dist) * force;
          n.boostY += (dy / dist) * force - 0.8;
        }
      }

      for (const p of prisms) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 360) {
          const force = ((360 - dist) / 360) * 5.2 * p.z;
          p.boostX += (dx / dist) * force;
          p.boostY += (dy / dist) * force;
          p.rotVel += ((dx > 0 ? 1 : -1) * 0.018) * ((360 - dist) / 360);
        }
      }

      // Spawn ascending green-to-blue growth mini-sparks
      const sparkCount = 7;
      for (let i = 0; i < sparkCount; i++) {
        const angle = -Math.PI * 0.75 + (Math.random() * Math.PI) * 0.5;
        const speed = 1.8 + Math.random() * 2.8;
        arrowSparks.push({
          x: cx + (Math.random() - 0.5) * 20,
          y: cy + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.1,
          size: 7 + Math.random() * 8,
          alpha: 0.95,
          isGreen: i % 2 === 0,
        });
      }
    };

    const handlePointerMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.targetNormX = (e.clientX / Math.max(1, width) - 0.5) * 2;
      pointer.targetNormY = (e.clientY / Math.max(1, height) - 0.5) * 2;
      pointer.active = true;
    };

    const handlePointerDown = (e) => {
      const cx = e.clientX;
      const cy = e.clientY;
      pointer.x = cx;
      pointer.y = cy;
      pointer.targetNormX = (cx / Math.max(1, width) - 0.5) * 2;
      pointer.targetNormY = (cy / Math.max(1, height) - 0.5) * 2;
      pointer.active = true;
      spawnImpulse(cx, cy);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const drawLogoPrism = (p, tSec, dark, px, py) => {
      const s = p.size;
      const h = s * 0.92;
      const half = s * 0.58;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(p.rot + Math.sin(tSec * 0.7 + p.phase) * 0.04);

      // Soft drop glow for 3D dimension
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.56);
      ctx.lineTo(half, h * 0.44);
      ctx.lineTo(-half, h * 0.44);
      ctx.closePath();

      const triGrad = ctx.createLinearGradient(-half, h * 0.44, half * 0.4, -h * 0.56);
      if (dark) {
        triGrad.addColorStop(0, `rgba(2, 132, 199, ${0.18 * p.z})`);
        triGrad.addColorStop(0.6, `rgba(14, 165, 233, ${0.12 * p.z})`);
        triGrad.addColorStop(1, `rgba(132, 204, 22, ${0.16 * p.z})`);
      } else {
        triGrad.addColorStop(0, `rgba(0, 94, 184, ${0.12 * p.z})`);
        triGrad.addColorStop(0.55, `rgba(14, 165, 233, ${0.1 * p.z})`);
        triGrad.addColorStop(1, `rgba(132, 204, 22, ${0.14 * p.z})`);
      }
      ctx.fillStyle = triGrad;
      ctx.fill();

      ctx.lineWidth = 1.2 * p.z;
      ctx.strokeStyle = dark
        ? `rgba(186, 230, 253, ${0.22 * p.z})`
        : `rgba(255, 255, 255, ${0.75 * p.z})`;
      ctx.stroke();

      // Inner ascending 4-bar silhouette echoing /logo.png
      const barW = s * 0.1;
      const barGap = s * 0.06;
      const startX = -((4 * barW + 3 * barGap) / 2);
      const baseY = h * 0.34;
      const barHeights = [0.22, 0.34, 0.44, 0.58];
      for (let i = 0; i < 4; i++) {
        const bh = h * barHeights[i];
        const bx = startX + i * (barW + barGap);
        const barGrad = ctx.createLinearGradient(bx, baseY, bx, baseY - bh);
        if (dark) {
          barGrad.addColorStop(0, `rgba(56, 189, 248, ${0.26 * p.z})`);
          barGrad.addColorStop(1, `rgba(163, 230, 53, ${0.42 * p.z})`);
        } else {
          barGrad.addColorStop(0, `rgba(2, 132, 199, ${0.2 * p.z})`);
          barGrad.addColorStop(1, `rgba(101, 163, 13, ${0.34 * p.z})`);
        }
        ctx.fillStyle = barGrad;
        ctx.fillRect(bx, baseY - bh, barW, bh);
      }

      // Subtle rising zigzag green growth arrow across the prism
      ctx.beginPath();
      ctx.moveTo(-half * 0.56, h * 0.02);
      ctx.lineTo(-half * 0.14, -h * 0.16);
      ctx.lineTo(half * 0.08, -h * 0.04);
      ctx.lineTo(half * 0.62, -h * 0.44);
      ctx.lineWidth = 2.1 * p.z;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = dark
        ? `rgba(163, 230, 53, ${0.42 * p.z})`
        : `rgba(101, 163, 13, ${0.38 * p.z})`;
      ctx.stroke();

      ctx.restore();
    };

    let rafId = 0;
    const startTime = performance.now();

    const renderFrame = (now) => {
      const tSec = (now - startTime) * 0.001;
      const dark = isDarkRef.current;

      // Smooth pointer parallax easing
      pointer.normX += (pointer.targetNormX - pointer.normX) * 0.06;
      pointer.normY += (pointer.targetNormY - pointer.normY) * 0.06;

      // 1) Crisp Blue-Green-White Dimensional Base Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (dark) {
        bgGrad.addColorStop(0, '#071426');
        bgGrad.addColorStop(0.52, '#0b213a');
        bgGrad.addColorStop(1, '#092420');
      } else {
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.46, '#edf6ff');
        bgGrad.addColorStop(1, '#eefbf1');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft ambient volumetric light blooms (Cobalt Blue bottom-left, Fresh Green top-right)
      const blueGlow = ctx.createRadialGradient(
        width * 0.18 + pointer.normX * -24,
        height * 0.78 + pointer.normY * -18,
        10,
        width * 0.18,
        height * 0.78,
        Math.max(width, height) * 0.56
      );
      blueGlow.addColorStop(0, dark ? 'rgba(2, 132, 199, 0.24)' : 'rgba(14, 165, 233, 0.18)');
      blueGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = blueGlow;
      ctx.fillRect(0, 0, width, height);

      const greenGlow = ctx.createRadialGradient(
        width * 0.84 + pointer.normX * 26,
        height * 0.22 + pointer.normY * 22,
        10,
        width * 0.84,
        height * 0.22,
        Math.max(width, height) * 0.52
      );
      greenGlow.addColorStop(0, dark ? 'rgba(132, 204, 22, 0.18)' : 'rgba(132, 204, 22, 0.17)');
      greenGlow.addColorStop(1, 'rgba(132, 204, 22, 0)');
      ctx.fillStyle = greenGlow;
      ctx.fillRect(0, 0, width, height);

      // Subtle pointer light aura when hovering
      if (pointer.active) {
        const aura = ctx.createRadialGradient(pointer.x, pointer.y, 4, pointer.x, pointer.y, 240);
        aura.addColorStop(0, dark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.11)');
        aura.addColorStop(0.55, dark ? 'rgba(132, 204, 22, 0.06)' : 'rgba(132, 204, 22, 0.06)');
        aura.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);
      }

      // 2) Financial Perspective Coordinate Grid + Ascending Growth Waveforms
      const gridStep = width < 640 ? 52 : 68;
      const offsetX = pointer.normX * -10;
      const offsetY = pointer.normY * -10;
      ctx.lineWidth = 1;
      ctx.strokeStyle = dark ? 'rgba(148, 197, 255, 0.055)' : 'rgba(2, 132, 199, 0.055)';
      ctx.beginPath();
      for (let gx = (offsetX % gridStep) - gridStep; gx < width + gridStep; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = (offsetY % gridStep) - gridStep; gy < height + gridStep; gy += gridStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // Two sweeping ascending financial curves (blue & green trajectory echoing the logo arrow)
      for (let c = 0; c < 2; c++) {
        const isGreenCurve = c === 1;
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const x = ratio * width;
          const wave =
            Math.sin(ratio * Math.PI * 2.4 + tSec * (0.45 + c * 0.15) + c) * (18 + c * 8);
          const climb = (1 - ratio) * (height * (0.34 + c * 0.14)) + height * (0.38 - c * 0.06);
          const y = climb + wave + pointer.normY * (14 + c * 10);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = isGreenCurve ? 2.2 : 1.7;
        ctx.strokeStyle = isGreenCurve
          ? dark
            ? 'rgba(163, 230, 53, 0.24)'
            : 'rgba(101, 163, 13, 0.22)'
          : dark
            ? 'rgba(56, 189, 248, 0.22)'
            : 'rgba(2, 132, 199, 0.2)';
        ctx.stroke();
      }

      // 3) Update & draw 3D Logo Geometric Prisms
      for (const p of prisms) {
        if (!prefersReducedMotion) {
          p.x += p.vx + p.boostX;
          p.y += p.vy + p.boostY;
          p.boostX *= 0.92;
          p.boostY *= 0.92;
          p.rot += p.rotVel;
          p.rotVel *= 0.96;

          if (p.y < -p.size) {
            p.y = height + p.size;
            p.x = (0.06 + Math.random() * 0.88) * width;
          }
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
        }
        const px = p.x + pointer.normX * (28 * p.z);
        const py = p.y + pointer.normY * (22 * p.z);
        drawLogoPrism(p, tSec, dark, px, py);
      }

      // 4) Financial Network Nodes & Constellation Links
      const projectedNodes = [];
      for (const n of nodes) {
        if (!prefersReducedMotion) {
          n.x += n.vx + n.boostX;
          n.y += n.vy + n.boostY;
          n.boostX *= 0.91;
          n.boostY *= 0.91;
          if (n.y < -16) {
            n.y = height + 16;
            n.x = Math.random() * width;
          }
          if (n.x < -16) n.x = width + 16;
          if (n.x > width + 16) n.x = -16;
        }
        projectedNodes.push({
          ...n,
          px: n.x + pointer.normX * (22 * n.z),
          py: n.y + pointer.normY * (18 * n.z),
        });
      }

      const maxLinkDist = width < 640 ? 115 : 155;
      for (let i = 0; i < projectedNodes.length; i++) {
        const a = projectedNodes[i];
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const b = projectedNodes[j];
          const dist = Math.hypot(a.px - b.px, a.py - b.py);
          if (dist < maxLinkDist) {
            const alpha = (1 - dist / maxLinkDist) * 0.24 * Math.min(a.z, b.z);
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.lineWidth = 1;
            ctx.strokeStyle =
              a.isGreen || b.isGreen
                ? dark
                  ? `rgba(163, 230, 53, ${alpha})`
                  : `rgba(101, 163, 13, ${alpha})`
                : dark
                  ? `rgba(56, 189, 248, ${alpha})`
                  : `rgba(2, 132, 199, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      for (const n of projectedNodes) {
        ctx.beginPath();
        ctx.arc(n.px, n.py, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.isGreen
          ? dark
            ? `rgba(163, 230, 53, ${0.55 * n.z})`
            : `rgba(132, 204, 22, ${0.65 * n.z})`
          : dark
            ? `rgba(56, 189, 248, ${0.52 * n.z})`
            : `rgba(2, 132, 199, ${0.55 * n.z})`;
        ctx.fill();
      }

      // 5) Interactive Click Shockwave Ripples (Blue-Green-White)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.08 + 2.4;
        r.alpha *= 0.945;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = dark
          ? `rgba(56, 189, 248, ${r.alpha * 0.75})`
          : `rgba(2, 132, 199, ${r.alpha * 0.65})`;
        ctx.stroke();

        if (r.radius > 22) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.68, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = dark
            ? `rgba(163, 230, 53, ${r.alpha * 0.6})`
            : `rgba(132, 204, 22, ${r.alpha * 0.58})`;
          ctx.stroke();
        }

        if (r.alpha < 0.02 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 6) Ascending Mini Arrow Growth Sparks on Click
      for (let i = arrowSparks.length - 1; i >= 0; i--) {
        const s = arrowSparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha *= 0.94;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.beginPath();
        ctx.moveTo(-s.size * 0.5, s.size * 0.35);
        ctx.lineTo(0, -s.size * 0.4);
        ctx.lineTo(s.size * 0.5, s.size * 0.35);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = s.isGreen
          ? dark
            ? `rgba(163, 230, 53, ${s.alpha})`
            : `rgba(101, 163, 13, ${s.alpha})`
          : dark
            ? `rgba(56, 189, 248, ${s.alpha})`
            : `rgba(2, 132, 199, ${s.alpha})`;
        ctx.stroke();
        ctx.restore();

        if (s.alpha < 0.03) arrowSparks.splice(i, 1);
      }

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="welcome-financial-canvas"
      className="ob-bg-canvas"
      aria-hidden="true"
    />
  );
}
