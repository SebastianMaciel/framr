type Labels = {
  ariaLabel: string;
  image: string;
  catalog: string;
  catalogSub: string;
  transformsTitle: string;
  transformsSub: string;
  presetCardTitle: string;
  presetCardSub1: string;
  presetCardSub2: string;
  computeFrameTitle: string;
  computeFrameSub: string;
};

export default function WalkDiagram({ labels }: { labels: Labels }) {
  return (
    <div className="wk-diagram">
      <svg
        viewBox="0 0 880 280"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={labels.ariaLabel}
      >
        <style>{`
          .box{fill:#fff;stroke:#000;stroke-width:3}
          .y{fill:#fff200;stroke:#000;stroke-width:3}
          .lbl{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:14px;fill:#000}
          .sub{font-family:'JetBrains Mono',monospace;font-size:10px;fill:#000}
          .arrow{stroke:#000;stroke-width:3;fill:none;marker-end:url(#tri)}
        `}</style>
        <defs>
          <marker id="tri" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#000" />
          </marker>
        </defs>
        <rect x="10" y="50" width="140" height="80" className="y" />
        <text x="80" y="85" textAnchor="middle" className="lbl">{labels.image}</text>
        <text x="80" y="105" textAnchor="middle" className="sub">PNG · JPG · WEBP</text>

        <rect x="190" y="50" width="140" height="80" className="box" />
        <text x="260" y="80" textAnchor="middle" className="lbl">HTMLImageElement</text>
        <text x="260" y="100" textAnchor="middle" className="sub">naturalW · naturalH</text>
        <text x="260" y="115" textAnchor="middle" className="sub">blob URL</text>

        <rect x="370" y="20" width="160" height="60" className="box" />
        <text x="450" y="45" textAnchor="middle" className="lbl">{labels.catalog}</text>
        <text x="450" y="65" textAnchor="middle" className="sub">{labels.catalogSub}</text>

        <rect x="370" y="100" width="160" height="60" className="box" />
        <text x="450" y="125" textAnchor="middle" className="lbl">{labels.transformsTitle}</text>
        <text x="450" y="145" textAnchor="middle" className="sub">{labels.transformsSub}</text>

        <rect x="570" y="50" width="140" height="80" className="box" />
        <text x="640" y="80" textAnchor="middle" className="lbl">{labels.presetCardTitle}</text>
        <text x="640" y="100" textAnchor="middle" className="sub">{labels.presetCardSub1}</text>
        <text x="640" y="115" textAnchor="middle" className="sub">{labels.presetCardSub2}</text>

        <rect x="750" y="50" width="120" height="80" className="y" />
        <text x="810" y="85" textAnchor="middle" className="lbl">.WEBP</text>
        <text x="810" y="105" textAnchor="middle" className="sub">+ZIP</text>

        <rect x="285" y="200" width="320" height="50" className="box" />
        <text x="445" y="220" textAnchor="middle" className="lbl">{labels.computeFrameTitle}</text>
        <text x="445" y="237" textAnchor="middle" className="sub">{labels.computeFrameSub}</text>

        <path className="arrow" d="M150,90 L188,90" />
        <path className="arrow" d="M330,90 L368,40" />
        <path className="arrow" d="M330,90 L368,130" />
        <path className="arrow" d="M530,50 L568,80" />
        <path className="arrow" d="M530,130 L568,100" />
        <path className="arrow" d="M710,90 L748,90" />
        <path className="arrow" d="M640,135 L445,198" />
        <path className="arrow" d="M445,250 L640,135" strokeDasharray="6,4" />
      </svg>
    </div>
  );
}
