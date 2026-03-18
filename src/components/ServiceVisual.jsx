import { useId } from 'react';

const textures = {
  night: '/images/service-textures/trails-night.webp',
  warm: '/images/service-textures/trails-warm.webp',
};

const palette = {
  bg0: '#07090d',
  bg1: '#0d131a',
  bg2: '#161f2b',
  bg3: '#0a0d12',
  panel: '#111722',
  panelRaised: '#151c27',
  panelSupport: '#121925',
  panelEdge: 'rgba(241, 238, 231, 0.05)',
  textMain: 'rgba(241, 238, 231, 0.92)',
  textMuted: 'rgba(241, 238, 231, 0.6)',
  textSoft: 'rgba(241, 238, 231, 0.34)',
  steel: '#9fb2cf',
  steelBright: '#ccd9ee',
  warm: '#ddd3c0',
};

const labelText = {
  fill: palette.textMuted,
  fontFamily: 'Manrope, sans-serif',
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
};

const valueText = {
  fill: palette.textMain,
  fontFamily: 'Manrope, sans-serif',
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.02em',
};

const bodyText = {
  fill: 'rgba(241, 238, 231, 0.7)',
  fontFamily: 'Manrope, sans-serif',
  fontSize: 8.4,
  fontWeight: 500,
};

function idsFor(base) {
  return {
    base,
    bg: `${base}-bg`,
    bloomSteel: `${base}-bloom-steel`,
    bloomWarm: `${base}-bloom-warm`,
    panel: `${base}-panel`,
    panelRaised: `${base}-panel-raised`,
    panelSupport: `${base}-panel-support`,
    mediaOverlay: `${base}-media-overlay`,
    shadowSm: `${base}-shadow-sm`,
    shadowMd: `${base}-shadow-md`,
    shadowLg: `${base}-shadow-lg`,
  };
}

function wrapText(text, maxChars, maxLines) {
  if (!text) return [];

  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  const originalWordCount = words.length;
  const usedWordCount = lines.join(' ').split(/\s+/).filter(Boolean).length;
  if (usedWordCount < originalWordCount) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = lines[lastIndex].replace(/[.,;:!?-]*$/, '');
    lines[lastIndex] = `${lines[lastIndex]}...`;
  }

  return lines;
}

function WrappedText({
  x,
  y,
  text,
  maxChars,
  maxLines,
  lineHeight,
  style,
}) {
  const lines = wrapText(text, maxChars, maxLines);
  return (
    <text x={x} y={y} style={style}>
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function trendPath(points, x, y, width, height) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);

  return points.map((point, index) => {
    const px = x + ((width / (points.length - 1)) * index);
    const py = y + height - (((point - min) / range) * height);
    return `${index === 0 ? 'M' : 'L'}${px} ${py}`;
  }).join(' ');
}

function Panel({
  ids,
  clipId,
  x,
  y,
  w,
  h,
  rx = 10,
  shadow = 'md',
  tone = 'panel',
  rotate = 0,
  children,
}) {
  const shadowMap = {
    sm: `url(#${ids.shadowSm})`,
    md: `url(#${ids.shadowMd})`,
    lg: `url(#${ids.shadowLg})`,
  };
  const fillMap = {
    panel: `url(#${ids.panel})`,
    raised: `url(#${ids.panelRaised})`,
    support: `url(#${ids.panelSupport})`,
  };
  const cx = x + (w / 2);
  const cy = y + (h / 2);

  return (
    <g transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined} filter={shadowMap[shadow]}>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fillMap[tone]} stroke={palette.panelEdge} />
      <g clipPath={`url(#${clipId})`}>
        {children}
      </g>
    </g>
  );
}

function HeroPanel({
  ids,
  clipId,
  x,
  y,
  w,
  h,
  image,
  imageOpacity,
  rotate = 0,
  children,
}) {
  return (
    <Panel ids={ids} clipId={clipId} x={x} y={y} w={w} h={h} rx={10} tone="raised" shadow="lg" rotate={rotate}>
      {image && (
        <image
          href={image}
          x={x - 16}
          y={y - 10}
          width={w + 32}
          height={h + 20}
          preserveAspectRatio="xMidYMid slice"
          opacity={imageOpacity}
        />
      )}
      <rect x={x} y={y} width={w} height={h} fill={`url(#${ids.mediaOverlay})`} />
      {children}
    </Panel>
  );
}

function MetricChip({ x, y, w, label, value, tone = 'steel' }) {
  const chipFill = tone === 'warm' ? 'rgba(221, 211, 192, 0.12)' : 'rgba(159, 178, 207, 0.14)';
  const chipText = tone === 'warm' ? palette.warm : palette.steelBright;

  return (
    <g>
      <rect x={x} y={y} width={w} height="42" rx="7" fill="rgba(255,255,255,0.03)" />
      <rect x={x + 12} y={y + 11} width="42" height="10" rx="5" fill={chipFill} />
      <text x={x + 18} y={y + 18} style={{ ...labelText, fill: chipText, fontSize: 6.5 }}>{label}</text>
      <text x={x + 14} y={y + 33} style={{ ...valueText, fontSize: 14 }}>{value}</text>
    </g>
  );
}

function ProgressRail({ x, y, w, values }) {
  const gap = 3;
  const total = values.reduce((sum, value) => sum + value, 0);

  return values.map((value, index) => {
    const offset = values
      .slice(0, index)
      .reduce((sum, current) => sum + (((w - (gap * (values.length - 1))) * current) / total) + gap, 0);
    const width = ((w - (gap * (values.length - 1))) * value) / total;

    return (
      <rect
        key={`${value}-${index}`}
        x={x + offset}
        y={y}
        width={width}
        height="8"
        rx="4"
        fill={index === values.length - 1 ? palette.warm : palette.steelBright}
        opacity={0.9 - (index * 0.14)}
      />
    );
  });
}

function SupportChart({ ids, clipId, x, y, w, h, label, value, data, tone = 'steel' }) {
  const accent = tone === 'warm' ? palette.warm : palette.steelBright;
  const chartX = x + 14;
  const chartY = y + 50;
  const chartW = w - 28;
  const chartH = h - 70;

  return (
    <Panel ids={ids} clipId={clipId} x={x} y={y} w={w} h={h} rx={9} tone="support" shadow="md">
      <text x={x + 14} y={y + 20} style={labelText}>{label}</text>
      <text x={x + 14} y={y + 40} style={{ ...valueText, fontSize: 15 }}>{value}</text>
      {[0, 0.33, 0.66, 1].map((tick) => (
        <line key={tick} x1={chartX} x2={chartX + chartW} y1={chartY + (chartH * tick)} y2={chartY + (chartH * tick)} stroke={palette.lineSoft} />
      ))}
      <path
        d={`${trendPath(data, chartX, chartY, chartW, chartH)} L${chartX + chartW} ${chartY + chartH} L${chartX} ${chartY + chartH} Z`}
        fill={accent}
        opacity="0.1"
      />
      <path d={trendPath(data, chartX, chartY, chartW, chartH)} fill="none" stroke={accent} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={chartX + chartW} cy={chartY + chartH - 4} r="3" fill={accent} />
    </Panel>
  );
}

function SupportTable({ ids, clipId, x, y, w, title, columns, rows }) {
  const rowHeight = 20;
  const h = 34 + (rows.length * rowHeight);

  return (
    <Panel ids={ids} clipId={clipId} x={x} y={y} w={w} h={h} rx={9} tone="support" shadow="sm">
      <text x={x + 14} y={y + 18} style={labelText}>{title}</text>
      <line x1={x + 12} x2={x + w - 12} y1={y + 28} y2={y + 28} stroke={palette.lineSoft} />
      {columns.map((column) => (
        <text
          key={column.label}
          x={x + 14 + ((w - 28) * column.pos)}
          y={y + 39}
          textAnchor={column.align ?? 'start'}
          style={{ ...labelText, fontSize: 6, fill: palette.textSoft }}
        >
          {column.label}
        </text>
      ))}
      {rows.map((row, rowIndex) => (
        <g key={`${row[0]}-${rowIndex}`}>
          {row.map((cell, index) => (
            <text
              key={`${cell}-${index}`}
              x={x + 14 + ((w - 28) * columns[index].pos)}
              y={y + 56 + (rowIndex * rowHeight)}
              textAnchor={columns[index].align ?? 'start'}
              style={{ ...bodyText, fill: index === row.length - 1 ? palette.textMain : bodyText.fill }}
            >
              {cell}
            </text>
          ))}
        </g>
      ))}
    </Panel>
  );
}

function QueuePanel({ ids, clipId, x, y, w, h, label, summary, active }) {
  return (
    <Panel ids={ids} clipId={clipId} x={x} y={y} w={w} h={h} rx={9} tone="support" shadow="sm">
      <text x={x + 14} y={y + 20} style={labelText}>{label}</text>
      <g>
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          Array.from({ length: 8 }).map((__, colIndex) => {
            const key = `${colIndex}-${rowIndex}`;
            return (
              <circle
                key={key}
                cx={x + 16 + (colIndex * 13)}
                cy={y + 42 + (rowIndex * 13)}
                r="2.8"
                fill={active.includes(key) ? palette.steelBright : 'rgba(241, 238, 231, 0.11)'}
              />
            );
          })
        ))}
      </g>
      <WrappedText
        x={x + 14}
        y={y + h - 18}
        text={summary}
        maxChars={34}
        maxLines={2}
        lineHeight={12}
        style={bodyText}
      />
    </Panel>
  );
}

function Frame({ ids, label, children }) {
  return (
    <div className="service-visual-shell" role="img" aria-label={label}>
      <svg className="service-visual" viewBox="0 0 640 480" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={ids.bg} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.bg0} />
            <stop offset="34%" stopColor={palette.bg1} />
            <stop offset="74%" stopColor={palette.bg2} />
            <stop offset="100%" stopColor={palette.bg3} />
          </linearGradient>
          <radialGradient id={ids.bloomSteel} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(196 138) rotate(18) scale(250 170)">
            <stop offset="0%" stopColor="rgba(159, 178, 207, 0.22)" />
            <stop offset="100%" stopColor="rgba(159, 178, 207, 0)" />
          </radialGradient>
          <radialGradient id={ids.bloomWarm} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(478 356) rotate(-12) scale(180 124)">
            <stop offset="0%" stopColor="rgba(221, 211, 192, 0.12)" />
            <stop offset="100%" stopColor="rgba(221, 211, 192, 0)" />
          </radialGradient>
          <linearGradient id={ids.panel} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.panelRaised} />
            <stop offset="100%" stopColor={palette.panel} />
          </linearGradient>
          <linearGradient id={ids.panelRaised} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#18202c" />
            <stop offset="100%" stopColor="#101722" />
          </linearGradient>
          <linearGradient id={ids.panelSupport} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#131a26" />
            <stop offset="100%" stopColor="#0f151f" />
          </linearGradient>
          <linearGradient id={ids.mediaOverlay} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(10, 13, 18, 0.36)" />
            <stop offset="100%" stopColor="rgba(10, 13, 18, 0.78)" />
          </linearGradient>
          <filter id={ids.shadowSm} x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#040608" floodOpacity="0.14" />
          </filter>
          <filter id={ids.shadowMd} x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#040608" floodOpacity="0.22" />
          </filter>
          <filter id={ids.shadowLg} x="-40%" y="-40%" width="180%" height="200%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#040608" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect width="640" height="480" rx="20" fill={`url(#${ids.bg})`} />
        <ellipse cx="196" cy="138" rx="238" ry="160" fill={`url(#${ids.bloomSteel})`} />
        <ellipse cx="478" cy="356" rx="174" ry="120" fill={`url(#${ids.bloomWarm})`} />
        {children}
      </svg>
    </div>
  );
}

function WebsitesScene({ ids }) {
  return (
    <>
      <HeroPanel ids={ids} clipId={`${ids.base}-websites-hero`} x={78} y={96} w={322} h={244} rotate={-2} image={textures.warm} imageOpacity={0.16}>
        <text x="98" y="122" style={labelText}>Campaign Surface</text>
        <WrappedText
          x={98}
          y={150}
          text="Make the next step obvious."
          maxChars={26}
          maxLines={2}
          lineHeight={22}
          style={{ ...valueText, fontSize: 24 }}
        />
        <WrappedText
          x={98}
          y={202}
          text="Sharper hierarchy, stronger trust signals, and cleaner conversion flow."
          maxChars={46}
          maxLines={2}
          lineHeight={14}
          style={{ ...bodyText, fontSize: 9 }}
        />
        <MetricChip x={98} y={228} w={86} label="CVR" value="4.8%" tone="warm" />
        <MetricChip x={190} y={228} w={86} label="LEADS" value="31" />
        <MetricChip x={282} y={228} w={86} label="CAC" value="-18%" tone="warm" />
        <text x="98" y="298" style={labelText}>Attention flow</text>
        <ProgressRail x={98} y={308} w={186} values={[44, 24, 18, 14]} />
        <WrappedText
          x={98}
          y={332}
          text="Hero to proof to CTA holds 72% of qualified traffic."
          maxChars={44}
          maxLines={2}
          lineHeight={12}
          style={bodyText}
        />
      </HeroPanel>

      <SupportChart ids={ids} clipId={`${ids.base}-websites-chart`} x={430} y={132} w={148} h={150} label="Acquisition trend" value="Qualified sessions" data={[28, 34, 46, 52, 63]} />
    </>
  );
}

function WebAppsScene({ ids }) {
  return (
    <>
      <HeroPanel ids={ids} clipId={`${ids.base}-apps-hero`} x={76} y={96} w={330} h={248} image={textures.night} imageOpacity={0.14}>
        <text x="96" y="122" style={labelText}>Operations Workspace</text>
        <WrappedText
          x={96}
          y={150}
          text="Run delivery from one calmer control surface."
          maxChars={30}
          maxLines={2}
          lineHeight={22}
          style={{ ...valueText, fontSize: 22 }}
        />
        <WrappedText
          x={96}
          y={202}
          text="Queues, QA, client updates, and API-connected workflows stay in one operational view."
          maxChars={46}
          maxLines={2}
          lineHeight={14}
          style={bodyText}
        />
        <MetricChip x={96} y={228} w={92} label="SLA" value="97.4%" />
        <MetricChip x={194} y={228} w={92} label="APIs" value="14" tone="warm" />
        <MetricChip x={292} y={228} w={96} label="TASKS" value="412" />
        <text x="96" y="298" style={labelText}>Throughput distribution</text>
        <ProgressRail x={96} y={308} w={192} values={[36, 28, 20, 16]} />
        <WrappedText
          x={96}
          y={332}
          text="Ops, QA, client, and admin load remains balanced."
          maxChars={44}
          maxLines={2}
          lineHeight={12}
          style={bodyText}
        />
      </HeroPanel>

      <QueuePanel
        ids={ids}
        clipId={`${ids.base}-apps-queue`}
        x={430}
        y={136}
        w={150}
        h={144}
        label="Live queue"
        summary="22 active queues, 4 urgent, no blocked handoffs."
        active={['0-0', '1-0', '3-0', '4-1', '2-2', '5-2', '6-2']}
      />
    </>
  );
}

function AiWorkflowsScene({ ids }) {
  return (
    <>
      <HeroPanel ids={ids} clipId={`${ids.base}-flows-hero`} x={78} y={98} w={326} h={242} image={textures.night} imageOpacity={0.12}>
        <text x="98" y="124" style={labelText}>Automation Mesh</text>
        <WrappedText
          x={98}
          y={152}
          text="Orchestrate intake, CRM, quotes, docs, and follow-up."
          maxChars={34}
          maxLines={2}
          lineHeight={22}
          style={{ ...valueText, fontSize: 22 }}
        />
        <WrappedText
          x={98}
          y={204}
          text="Systems route cleanly across handoffs without turning into a maze of brittle automations."
          maxChars={46}
          maxLines={2}
          lineHeight={14}
          style={bodyText}
        />
        <MetricChip x={98} y={226} w={94} label="SUCCESS" value="98.8%" />
        <MetricChip x={198} y={226} w={94} label="RUNS" value="184" tone="warm" />
        <MetricChip x={298} y={226} w={92} label="RETRY" value="2" />
        <text x="98" y="296" style={labelText}>Flow health</text>
        <ProgressRail x={98} y={306} w={188} values={[72, 16, 8, 4]} />
        <WrappedText
          x={98}
          y={330}
          text="Routing remains stable across capture, qualification, and delivery."
          maxChars={44}
          maxLines={2}
          lineHeight={12}
          style={bodyText}
        />
      </HeroPanel>

      <SupportTable
        ids={ids}
        clipId={`${ids.base}-flows-table`}
        x={420}
        y={136}
        w={172}
        title="Recent jobs"
        columns={[
          { label: 'Flow', pos: 0 },
          { label: 'State', pos: 0.72, align: 'end' },
          { label: 'Time', pos: 1, align: 'end' },
        ]}
        rows={[
          ['Lead routing', 'OK', '09:14'],
          ['Proposal draft', 'OK', '09:18'],
          ['Reminder sync', 'Retry', '09:23'],
        ]}
      />
    </>
  );
}

function AssistantsScene({ ids }) {
  return (
    <>
      <HeroPanel ids={ids} clipId={`${ids.base}-assistants-hero`} x={76} y={98} w={320} h={244} image={textures.warm} imageOpacity={0.14}>
        <text x="96" y="124" style={labelText}>First-response routing</text>
        <WrappedText
          x={96}
          y={152}
          text="Capture context, sort intent, and hand off cleanly."
          maxChars={34}
          maxLines={2}
          lineHeight={22}
          style={{ ...valueText, fontSize: 22 }}
        />
        <WrappedText
          x={96}
          y={204}
          text="Voice, chat, and intake requests get triaged before the team ever needs to step in."
          maxChars={46}
          maxLines={2}
          lineHeight={14}
          style={bodyText}
        />
        <MetricChip x={96} y={228} w={92} label="REPLY" value="34s" />
        <MetricChip x={194} y={228} w={92} label="ROUTES" value="12" tone="warm" />
        <MetricChip x={292} y={228} w={92} label="ESC" value="1" />
        <text x="96" y="298" style={labelText}>Inbound mix</text>
        <ProgressRail x={96} y={308} w={188} values={[42, 28, 20, 10]} />
        <text x="96" y="332" style={bodyText}>voice / chat / intake / escalation</text>
      </HeroPanel>

      <SupportTable
        ids={ids}
        clipId={`${ids.base}-assistants-table`}
        x={418}
        y={136}
        w={174}
        title="Conversation states"
        columns={[
          { label: 'Type', pos: 0 },
          { label: 'Owner', pos: 0.58 },
          { label: 'State', pos: 1, align: 'end' },
        ]}
        rows={[
          ['Booking req.', 'assistant', 'resolved'],
          ['Lead qual.', 'sales', 'routed'],
          ['Urgent support', 'human', 'queued'],
        ]}
      />
    </>
  );
}

function PerformanceScene({ ids }) {
  return (
    <>
      <HeroPanel ids={ids} clipId={`${ids.base}-performance-hero`} x={74} y={98} w={324} h={244} image={textures.night} imageOpacity={0.1}>
        <text x="94" y="124" style={labelText}>Performance diagnostics</text>
        <WrappedText
          x={94}
          y={152}
          text="Find the bottleneck, prove the gain, and rebuild what blocks scale."
          maxChars={36}
          maxLines={2}
          lineHeight={22}
          style={{ ...valueText, fontSize: 22 }}
        />
        <WrappedText
          x={94}
          y={204}
          text="Measure the problem, isolate the drag, then reduce stack weight and delivery friction."
          maxChars={46}
          maxLines={2}
          lineHeight={14}
          style={bodyText}
        />
        <MetricChip x={94} y={228} w={90} label="LCP" value="1.9s" />
        <MetricChip x={190} y={228} w={90} label="TTFB" value="220ms" tone="warm" />
        <MetricChip x={286} y={228} w={96} label="JS" value="-34%" />
        <text x="94" y="298" style={labelText}>Improvement curve</text>
        <ProgressRail x={94} y={308} w={192} values={[30, 24, 22, 24]} />
        <WrappedText
          x={94}
          y={332}
          text="Core metrics rise after trimming script, caching, and layout instability."
          maxChars={44}
          maxLines={2}
          lineHeight={12}
          style={bodyText}
        />
      </HeroPanel>

      <SupportChart ids={ids} clipId={`${ids.base}-performance-chart`} x={430} y={136} w={150} h={146} label="Core Web Vitals" value="94 / 100" data={[61, 68, 66, 79, 94]} tone="warm" />
    </>
  );
}

const sceneMap = {
  websites: WebsitesScene,
  webApps: WebAppsScene,
  aiWorkflows: AiWorkflowsScene,
  assistants: AssistantsScene,
  performance: PerformanceScene,
};

function ServiceVisual({ visual, label }) {
  const ids = idsFor(useId().replace(/:/g, ''));
  const Scene = sceneMap[visual] ?? WebsitesScene;

  return (
    <Frame ids={ids} label={label}>
      <Scene ids={ids} />
    </Frame>
  );
}

export default ServiceVisual;
