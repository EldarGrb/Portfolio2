import { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float ring(vec2 uv, vec2 center, vec2 radius, float thickness) {
    vec2 p = (uv - center) / radius;
    float d = abs(length(p) - 1.0);
    return 1.0 - smoothstep(thickness, thickness + 0.015, d);
  }

  float softGlow(vec2 uv, vec2 center, vec2 radius) {
    vec2 p = (uv - center) / radius;
    float d = abs(length(p) - 1.0);
    return exp(-22.0 * d);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    vec2 drift = vec2(
      sin(uTime * 0.18 + uv.y * 4.0) * 0.006,
      cos(uTime * 0.15 + uv.x * 3.2) * 0.006
    );
    vec2 warped = uv + drift + (mouse - 0.5) * 0.025;

    vec2 c1 = vec2(0.43 + sin(uTime * 0.10) * 0.008, 0.50 + cos(uTime * 0.13) * 0.006);
    vec2 c2 = vec2(0.57 + cos(uTime * 0.11) * 0.008, 0.50 + sin(uTime * 0.09) * 0.006);

    float loopA = ring(warped, c1, vec2(0.24, 0.17), 0.035);
    float loopB = ring(warped, c2, vec2(0.24, 0.17), 0.035);
    float loops = clamp(loopA + loopB, 0.0, 1.0);

    float glowA = softGlow(warped, c1, vec2(0.24, 0.17));
    float glowB = softGlow(warped, c2, vec2(0.24, 0.17));
    float overlap = smoothstep(0.48, 0.02, distance(warped, vec2(0.5, 0.5)));

    vec3 bg = vec3(0.015, 0.018, 0.017);
    bg += vec3(0.020, 0.033, 0.024) * smoothstep(1.0, 0.2, distance(uv, vec2(0.5, 0.5)));

    vec3 primary = vec3(0.93, 0.99, 0.70);
    vec3 secondary = vec3(0.56, 0.72, 1.00);

    vec3 color = bg;
    color += primary * loops * 0.22;
    color += secondary * max(glowA, glowB) * 0.035;
    color += mix(primary, secondary, 0.45) * overlap * 0.05 * (0.6 + 0.4 * sin(uTime * 0.7));

    float vignette = smoothstep(1.25, 0.1, distance(uv, vec2(0.5)));
    color *= 0.78 + vignette * 0.22;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class WebGLErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

function ShaderPlane() {
  const materialRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useEffect(() => {
    const handler = (e) => {
      targetMouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    mouseRef.current.lerp(targetMouseRef.current, 0.05);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.copy(mouseRef.current);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function TripBackground() {
  const [webglSupported] = useState(detectWebGL);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hero-bg" ref={containerRef}>
      <div className="hero-bg-gradient" />
      {webglSupported && (
        <WebGLErrorBoundary>
          <Canvas
            frameloop={visible ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 1], fov: 75 }}
            gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <ShaderPlane />
          </Canvas>
        </WebGLErrorBoundary>
      )}
    </div>
  );
}
