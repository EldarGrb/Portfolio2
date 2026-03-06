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

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123);
  }

  vec3 voronoi(vec2 x, float time) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float md = 8.0;
    float md2 = 8.0;
    vec2 mr;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash(n + g);
        o = 0.5 + 0.5 * sin(time * 0.4 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < md) {
          md2 = md;
          md = d;
          mr = r;
        } else if (d < md2) {
          md2 = d;
        }
      }
    }
    return vec3(md, md2, md2 - md);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    float mouseD = smoothstep(0.5, 0.0, distance(uv, mouse));
    vec2 p = uv * 5.0;
    p += vec2(uTime * 0.05, uTime * 0.03);
    p += (mouse - 0.5) * mouseD * 0.8;
    vec3 v1 = voronoi(p, uTime);
    vec3 v2 = voronoi(p * 2.2 + 10.0, uTime * 0.7);
    vec3 v3 = voronoi(p * 4.5 + 20.0, uTime * 1.2);
    float edge1 = 1.0 - smoothstep(0.0, 0.08, v1.z);
    float edge2 = 1.0 - smoothstep(0.0, 0.05, v2.z);
    float edge3 = 1.0 - smoothstep(0.0, 0.03, v3.z);
    float cell1 = sqrt(v1.x);
    float cell2 = sqrt(v2.x);
    vec3 black    = vec3(0.01, 0.01, 0.01);
    vec3 darkGreen = vec3(0.04, 0.07, 0.03);
    vec3 olive    = vec3(0.10, 0.14, 0.06);
    vec3 warm     = vec3(0.16, 0.10, 0.06);
    vec3 accent   = vec3(0.93, 0.99, 0.70);
    vec3 cellColor = mix(black, darkGreen, cell1 * 0.8);
    cellColor = mix(cellColor, olive, cell2 * 0.3);
    float warmMask = smoothstep(0.3, 0.7, cell1) * smoothstep(0.4, 0.8, sin(uTime * 0.2 + cell1 * 6.0) * 0.5 + 0.5);
    cellColor = mix(cellColor, warm, warmMask * 0.5);
    vec3 edgeColor = mix(olive, accent, 0.4);
    cellColor = mix(cellColor, edgeColor * 0.5, edge1 * 0.6);
    cellColor = mix(cellColor, olive * 0.8, edge2 * 0.3);
    cellColor = mix(cellColor, accent * 0.15, edge3 * 0.2);
    float intersect = edge1 * edge2;
    cellColor += accent * intersect * 0.3;
    cellColor += accent * mouseD * 0.08;
    float pulse = sin(uTime * 0.8 + v1.x * 10.0) * 0.5 + 0.5;
    cellColor += edgeColor * edge1 * pulse * 0.15;
    float vig = 1.0 - smoothstep(0.2, 1.2, distance(uv, vec2(0.5)));
    cellColor *= 0.65 + vig * 0.35;
    gl_FragColor = vec4(cellColor, 1.0);
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
  const meshRef = useRef();
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
    uniforms.uTime.value = state.clock.elapsedTime;
    mouseRef.current.lerp(targetMouseRef.current, 0.05);
    uniforms.uMouse.value.copy(mouseRef.current);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
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
