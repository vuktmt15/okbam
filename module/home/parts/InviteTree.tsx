import React from "react";

type Props = {
  levels?: number[]; // number of nodes per level (excluding YOU)
};

// Bố cục theo yêu cầu: YOU (1), Lv1: 2, Lv2: 4, Lv3: 6
const DEFAULT_LEVELS = [2, 4, 6];

export default function InviteTree({levels = DEFAULT_LEVELS}: Props): JSX.Element {
  return (
    <div className="invite-tree">
      <div className="row you" aria-label="YOU">
        <div className="label">YOU</div>
        <div className="nodes">
          <div className="node you"><span className="emoji">🧸</span></div>
        </div>
        <div className="pct" />
        <div className="hr" />
      </div>

      {levels.map((count, idx) => (
        <div key={idx} className={`row lv lv${idx + 1}`}>
          <div className="label">Lv{idx + 1} ▸</div>
          <div className="nodes">
            {Array.from({length: count}).map((_, i) => (
              <div key={i} className="node">
                <span className="emoji">🧸</span>
                {idx < levels.length - 1 && <span className="stem" />}
              </div>
            ))}
          </div>
          <div className="pct">{idx === 0 ? "50%" : idx === 1 ? "25%" : "10%"}</div>
          <div className="hr" />
        </div>
      ))}
    </div>
  );
}


