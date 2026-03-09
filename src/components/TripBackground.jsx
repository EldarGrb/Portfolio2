import { useRef, useMemo, useEffect, useState, Component } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
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
  uniform sampler2D uLogoTexture;
  varying vec2 vUv;

  float sampleLogo(vec2 uv) {
    vec2 logoUv = (uv - vec2(0.5)) * vec2(1.35, 1.35) + vec2(0.5);
    vec4 tex = texture2D(uLogoTexture, logoUv);
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    return max(tex.a, lum);
  }

  float sampleGlow(vec2 uv) {
    float g = 0.0;
    g += sampleLogo(uv + vec2(0.0032, 0.0000));
    g += sampleLogo(uv + vec2(-0.0032, 0.0000));
    g += sampleLogo(uv + vec2(0.0000, 0.0032));
    g += sampleLogo(uv + vec2(0.0000, -0.0032));
    g += sampleLogo(uv + vec2(0.0024, 0.0024));
    g += sampleLogo(uv + vec2(-0.0024, 0.0024));
    g += sampleLogo(uv + vec2(0.0024, -0.0024));
    g += sampleLogo(uv + vec2(-0.0024, -0.0024));
    return g / 8.0;
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    vec2 center = uv - vec2(0.5);
    vec2 flow = vec2(
      sin((uv.y + uTime * 0.03) * 12.0) * 0.0018,
      cos((uv.x - uTime * 0.025) * 10.0) * 0.0016
    );
    vec2 warped = uv + flow + (mouse - vec2(0.5)) * 0.012;

    float mask = sampleLogo(warped);
    float halo = sampleGlow(warped);
    float edge = clamp(halo - mask, 0.0, 1.0);
    float pulse = 0.6 + 0.4 * sin(uTime * 0.65);

    vec3 bg = vec3(0.014, 0.018, 0.016);
    bg += vec3(0.016, 0.028, 0.022) * smoothstep(0.9, 0.08, length(center));

    vec3 accent = vec3(0.93, 0.99, 0.70);
    vec3 color = bg;
    color += accent * mask * (0.20 + 0.07 * pulse);
    color += accent * edge * (0.09 + 0.05 * pulse);
    color += accent * smoothstep(0.0, 1.0, halo) * 0.02;

    float vignette = smoothstep(1.3, 0.12, length(center));
    color *= 0.80 + vignette * 0.20;

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
  const rawLogoTexture = useLoader(THREE.TextureLoader, '/images/logo-mask.svg');
  const logoTexture = useMemo(() => {
    const texture = rawLogoTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, [rawLogoTexture]);

  useEffect(() => () => logoTexture.dispose(), [logoTexture]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uLogoTexture: { value: logoTexture },
  }), [logoTexture]);

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
