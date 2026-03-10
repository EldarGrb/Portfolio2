import { useCallback, useEffect, useRef, useState } from 'react';
import Icons from './Icons';
import { processSteps } from '../data/processData';
import { useFadeIn } from '../hooks/useFadeIn';

const CHART_LINE_PATH = 'M0 140 Q100 120 150 100 Q250 60 300 50 Q400 30 500 20 Q550 15 600 10';
const CHART_AREA_PATH = `${CHART_LINE_PATH} L600 160 L0 160 Z`;
const STEP_PROGRESS = [0.18, 0.52, 0.86];
const DOT_ANIMATION_DURATION = 420;
const TRAIL_SEGMENT = 0.14;

const easeOutCubic = (t) => 1 - ((1 - t) ** 3);

function Process() {
  const [step, setStep] = useState(0);
  const [dotPoint, setDotPoint] = useState({ x: 0, y: 0 });
  const [motionKey, setMotionKey] = useState(0);
  const [trailMotion, setTrailMotion] = useState({ start: 0, end: 0, active: false });
  const linePathRef = useRef(null);
  const dotPointRef = useRef({ x: 0, y: 0 });
  const isDotInitializedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const ref = useFadeIn();
  const stepLabels = ['Discover', 'Build', 'Launch'];

  const getTrailOffsetForStep = useCallback((stepIndex) => {
    const progress = STEP_PROGRESS[stepIndex] ?? STEP_PROGRESS[0];
    const centered = progress - (TRAIL_SEGMENT / 2);
    return Math.min(1 - TRAIL_SEGMENT, Math.max(0, centered));
  }, []);

  const handleStepChange = useCallback((nextStep) => {
    if (nextStep === step) return;

    const start = getTrailOffsetForStep(step);
    const end = getTrailOffsetForStep(nextStep);
    setTrailMotion({ start, end, active: true });
    setMotionKey((prev) => prev + 1);
    setStep(nextStep);
  }, [getTrailOffsetForStep, step]);

  const getPointForStep = useCallback((stepIndex) => {
    const linePath = linePathRef.current;
    if (!linePath) return null;

    const totalLength = linePath.getTotalLength();
    const progress = STEP_PROGRESS[stepIndex] ?? STEP_PROGRESS[0];
    const point = linePath.getPointAtLength(totalLength * progress);
    return { x: point.x, y: point.y };
  }, []);

  useEffect(() => {
    const targetPoint = getPointForStep(step);
    if (!targetPoint) return;

    if (!isDotInitializedRef.current) {
      dotPointRef.current = targetPoint;
      isDotInitializedRef.current = true;
      animationFrameRef.current = requestAnimationFrame(() => {
        setDotPoint(targetPoint);
        animationFrameRef.current = null;
      });
      return;
    }

    const startPoint = dotPointRef.current;
    const targetDistance = Math.hypot(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    if (targetDistance < 0.4) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startTime = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DOT_ANIMATION_DURATION, 1);
      const eased = easeOutCubic(progress);
      const nextPoint = {
        x: startPoint.x + ((targetPoint.x - startPoint.x) * eased),
        y: startPoint.y + ((targetPoint.y - startPoint.y) * eased),
      };

      setDotPoint(nextPoint);
      dotPointRef.current = nextPoint;

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getPointForStep, step]);

  useEffect(() => (
    () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  ), []);

  return (
    <section className="section process" id="process" ref={ref} style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.8s, transform 0.8s' }}>
      <div className="process-layout">
        <div className="process-left">
          <span className="section-signature" aria-hidden="true"><Icons.Logo /></span>
          <h2 className="section-title">Our method for delivering exceptional results</h2>
          <p>
            A streamlined 3-phase approach ensures your project gets
            a focused strategy, practical solutions, and measurable outcomes.
          </p>
          <div className="process-chart">
            <svg className="process-chart-svg" viewBox="0 0 600 220" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Process growth chart">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eefcb3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#eefcb3" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="chartTrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6FA8FF" stopOpacity="0.12" />
                  <stop offset="45%" stopColor="#dce9ff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#6FA8FF" stopOpacity="0.16" />
                </linearGradient>
              </defs>
              <g transform="translate(0 30)">
                {/* Grid lines */}
                <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                  <line x1="0" y1="40" x2="600" y2="40" />
                  <line x1="0" y1="80" x2="600" y2="80" />
                  <line x1="0" y1="120" x2="600" y2="120" />
                  <line x1="150" y1="0" x2="150" y2="160" strokeDasharray="4,4" />
                  <line x1="300" y1="0" x2="300" y2="160" strokeDasharray="4,4" />
                  <line x1="450" y1="0" x2="450" y2="160" strokeDasharray="4,4" />
                </g>
                {/* Area fill */}
                <path d={CHART_AREA_PATH} fill="url(#chartGrad)" />
                {/* Line */}
                <path ref={linePathRef} className="chart-line-main" d={CHART_LINE_PATH} stroke="#eefcb3" strokeWidth="2" fill="none" />
                {/* Pulse glow overlay */}
                <path key={`glow-${motionKey}`} className="chart-line-glow" d={CHART_LINE_PATH} />
                {/* Traveling highlight overlay */}
                {trailMotion.active && (
                  <path
                    key={`trail-${motionKey}`}
                    className="chart-line-trail"
                    d={CHART_LINE_PATH}
                    pathLength="1"
                    style={{
                      '--trail-segment': `${TRAIL_SEGMENT}`,
                      '--trail-start': `${trailMotion.start}`,
                      '--trail-end': `${trailMotion.end}`,
                    }}
                  />
                )}
                {/* Data point */}
                <g className="chart-dot" transform={`translate(${dotPoint.x} ${dotPoint.y})`}>
                  <circle className="chart-dot-halo" r="12" />
                  {trailMotion.active && (
                    <circle key={`ring-${motionKey}`} className="chart-dot-ring" r="5.5">
                      <animate attributeName="r" from="5.5" to="15.5" dur="0.55s" fill="freeze" />
                      <animate attributeName="opacity" from="0.72" to="0" dur="0.55s" fill="freeze" />
                    </circle>
                  )}
                  <circle className="chart-dot-core" r="5.5" />
                </g>
              </g>
            </svg>
          </div>
        </div>
        <div className="process-steps">
          <div className="step-tabs">
            {stepLabels.map((label, i) => (
              <button className={`step-tab ${i === step ? 'active' : ''}`} key={i} onClick={() => handleStepChange(i)}>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="step-content">
            {processSteps[step].map((s, i) => {
              const Icon = Icons[s.icon];
              return (
                <article className="step-row" key={i}>
                  <div className="step-row-meta" aria-hidden="true">
                    <span className="step-row-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="step-row-icon"><Icon /></span>
                  </div>
                  <div className="step-row-body">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;
