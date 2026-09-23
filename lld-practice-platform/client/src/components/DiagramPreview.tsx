import { ClassDefinition, RelationshipDefinition } from "../types/domain";

const RELATIONSHIP_STYLE: Record<string, { dash: string; marker: string }> = {
  inheritance: { dash: "", marker: "url(#arrow-hollow)" },
  composition: { dash: "", marker: "url(#diamond-filled)" },
  aggregation: { dash: "", marker: "url(#diamond-hollow)" },
  association: { dash: "", marker: "url(#arrow-open)" },
  dependency: { dash: "6 4", marker: "url(#arrow-open)" },
};

export function DiagramPreview({
  classes,
  relationships,
}: {
  classes: ClassDefinition[];
  relationships: RelationshipDefinition[];
}) {
  const named = classes.filter((c) => c.name.trim());

  if (named.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-ink-800/15 text-sm text-ink-800/40">
        Add classes to see a diagram preview
      </div>
    );
  }

  const cols = Math.min(3, named.length);
  const boxW = 160;
  const boxH = 56;
  const gapX = 60;
  const gapY = 50;
  const rows = Math.ceil(named.length / cols);
  const width = cols * boxW + (cols - 1) * gapX + 20;
  const height = rows * boxH + (rows - 1) * gapY + 20;

  const positions = named.map((c, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    return {
      name: c.name,
      x: 10 + col * (boxW + gapX),
      y: 10 + row * (boxH + gapY),
    };
  });

  const centerOf = (name: string) => {
    const p = positions.find((p) => p.name === name);
    if (!p) return null;
    return { cx: p.x + boxW / 2, cy: p.y + boxH / 2, x: p.x, y: p.y };
  };

  return (
    <div className="overflow-x-auto rounded-md border border-ink-800/10 bg-white p-3">
      <svg width={Math.max(width, 300)} height={Math.max(height, 140)} className="min-w-full">
        <defs>
          <marker id="arrow-open" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L8,5 L0,10" fill="none" stroke="#2C5F8A" strokeWidth="1.5" />
          </marker>
          <marker id="arrow-hollow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M0,0 L10,6 L0,12 Z" fill="white" stroke="#2C5F8A" strokeWidth="1.5" />
          </marker>
          <marker id="diamond-filled" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M0,6 L6,0 L12,6 L6,12 Z" fill="#2C5F8A" />
          </marker>
          <marker id="diamond-hollow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M0,6 L6,0 L12,6 L6,12 Z" fill="white" stroke="#2C5F8A" strokeWidth="1.5" />
          </marker>
        </defs>

        {relationships
          .filter((r) => r.classA && r.classB)
          .map((r, i) => {
            const a = centerOf(r.classA);
            const b = centerOf(r.classB);
            if (!a || !b) return null;
            const style = RELATIONSHIP_STYLE[r.relationshipType] ?? RELATIONSHIP_STYLE.association;
            const midX = (a.cx + b.cx) / 2;
            const midY = (a.cy + b.cy) / 2;
            return (
              <g key={i}>
                <line
                  x1={a.cx}
                  y1={a.cy}
                  x2={b.cx}
                  y2={b.cy}
                  stroke="#2C5F8A"
                  strokeWidth="1.5"
                  strokeDasharray={style.dash}
                  markerEnd={style.marker}
                />
                <rect x={midX - 34} y={midY - 9} width={68} height={16} fill="#F7F5F0" opacity="0.9" />
                <text x={midX} y={midY + 3} textAnchor="middle" fontSize="9" fill="#12213D" fontFamily="monospace">
                  {r.relationshipType}
                </text>
              </g>
            );
          })}

        {positions.map((p) => (
          <g key={p.name}>
            <rect
              x={p.x}
              y={p.y}
              width={boxW}
              height={boxH}
              rx={6}
              fill="#F7F5F0"
              stroke="#12213D"
              strokeOpacity={0.25}
            />
            <text x={p.x + boxW / 2} y={p.y + boxH / 2 + 4} textAnchor="middle" fontSize="12" fontWeight={600} fill="#12213D">
              {p.name.length > 18 ? p.name.slice(0, 17) + "…" : p.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
