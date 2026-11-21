import { useEffect, useRef } from 'react';
import {
  BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments,
  PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer,
} from 'three';

// One restrained visual: a slow-turning knowledge network (points joined by thin lines).
// Desktop only, paused when off-screen or tab hidden, cleaned up fully on unmount.
export default function HeroNetwork() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return undefined;

    let renderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return undefined; // no WebGL: CSS fallback stays visible
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 14;
    const group = new Group();
    scene.add(group);
    group.position.x = 4; // sit the network right of the headline

    // deterministic pseudo-random so the layout is stable between renders
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const N = 90;
    const pts = [];
    for (let i = 0; i < N; i++) pts.push([(rand() - 0.5) * 34, (rand() - 0.5) * 17, (rand() - 0.5) * 12]);

    const white = [];
    const gold = [];
    pts.forEach((p, i) => (i % 11 === 0 ? gold : white).push(...p));

    const mkPoints = (arr, color, size, opacity) => {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(arr, 3));
      const m = new PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true });
      return new Points(g, m);
    };
    const whitePts = mkPoints(white, 0xffffff, 0.2, 0.9);
    const goldPts = mkPoints(gold, 0xd6a84f, 0.34, 1);

    const lines = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < 20) lines.push(...pts[i], ...pts[j]);
      }
    }
    const lg = new BufferGeometry();
    lg.setAttribute('position', new Float32BufferAttribute(lines, 3));
    const lm = new LineBasicMaterial({ color: 0x8fa3d1, transparent: true, opacity: 0.4 });
    const lineMesh = new LineSegments(lg, lm);

    group.add(whitePts, goldPts, lineMesh);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    let raf;
    let last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || document.hidden) return;
      group.rotation.y += dt * 0.035;
      group.rotation.x += (target.y - group.rotation.x) * 0.04;
      camera.position.x += (target.x * 6 - camera.position.x) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      [whitePts, goldPts, lineMesh].forEach((o) => { o.geometry.dispose(); o.material.dispose(); });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}



