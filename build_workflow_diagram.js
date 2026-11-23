// Builds "NGDC Migration Workflow Diagram.pptx" (one slide, 11 stages in three swimlanes).
// Usage: npm install pptxgenjs && node build_workflow_diagram.js "NGDC Migration Workflow Diagram.pptx"
// Afterwards strip folder entries (zip -dq out.pptx "*/") and run the pptx skill validate.py.
// Builds "NGDC Migration Workflow Diagram.pptx" (one slide, 11 stages in three swimlanes).
// Usage: npm install pptxgenjs && node build_workflow_diagram.js "NGDC Migration Workflow Diagram.pptx"
// Afterwards strip folder entries (zip -dq out.pptx "*/") and run the pptx skill validate.py.
const pptxgen = require("pptxgenjs");
const out = process.argv[2];

const NAVY = "1E2761", TEAL = "028090", ORANGE = "C2570C";
const INK = "1F2937", GRAY = "4B5563", LINE = "6B7280", BAND = "F3F4F6", RULE = "D1D5DB";
const FONT = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.title = "NGDC Migration Workflow Diagram";
const S = pres.ShapeType;
const slide = pres.addSlide();
slide.background = { color: "FFFFFF" };

// ---- geometry -------------------------------------------------------------
const X0 = 1.45, P = 1.15, W = 0.98, H = 1.04;
const BAND_X = 0.4, BAND_W = 12.55, BAND_H = 1.64, BAND_TOP = 1.5, BAND_GAP = 0.04;
const lanes = {
  P: { name: "Provider", color: TEAL, top: BAND_TOP },
  C: { name: "Central team", color: NAVY, top: BAND_TOP + (BAND_H + BAND_GAP) },
  K: { name: "Consumer", color: ORANGE, top: BAND_TOP + 2 * (BAND_H + BAND_GAP) },
};
for (const k of Object.keys(lanes)) lanes[k].cy = lanes[k].top + BAND_H / 2;
const bx = (c) => X0 + c * P;
const cx = (c) => bx(c) + W / 2;
const gx = (c) => bx(c) + W + (P - W) / 2; // centre of gap right of column c

// ---- title ----------------------------------------------------------------
slide.addText("11 stages from provider ticket to heritage retirement", {
  x: 0.4, y: 0.3, w: 12.5, h: 0.6, fontFace: FONT, fontSize: 28, bold: true,
  color: NAVY, margin: 0, valign: "middle", isTextBox: true,
});

// ---- scope pills ----------------------------------------------------------
const pill = (x, w, l1, l2) =>
  slide.addText([{ text: l1, options: { breakLine: true } }, { text: l2 }], {
    shape: S.roundRect, rectRadius: 0.08, x, y: 1.0, w, h: 0.4,
    fill: { color: "FFFFFF" }, line: { color: RULE, width: 1 },
    fontFace: FONT, fontSize: 10, color: GRAY, align: "center", valign: "middle", margin: 0.02,
  });
pill(bx(0), bx(6) + W - bx(0), "Per provider application", "stages 0 to 7");
pill(bx(7), bx(8) + W - bx(7), "Per consumer–API pair", "stages 8 and 9");
pill(bx(9), W, "Per proxy", "stage 10");

// ---- lanes ----------------------------------------------------------------
for (const k of ["P", "C", "K"]) {
  const l = lanes[k];
  slide.addShape(S.rect, { x: BAND_X, y: l.top, w: BAND_W, h: BAND_H, fill: { color: BAND }, line: { color: BAND, width: 0 } });
  slide.addText(l.name, {
    x: BAND_X + 0.08, y: l.top, w: 0.9, h: BAND_H, fontFace: FONT, fontSize: 12, bold: true,
    color: l.color, valign: "middle", align: "left", margin: 0, isTextBox: true,
  });
}

// ---- connector helpers ----------------------------------------------------
function seg(x1, y1, x2, y2, o = {}) {
  slide.addShape(S.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.color || LINE, width: o.width || 1.25, dashType: o.dash ? "dash" : "solid", endArrowType: o.arrow ? "triangle" : undefined },
  });
}
function path(pts, o = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const last = i === pts.length - 2;
    seg(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], { ...o, arrow: o.arrow && last });
  }
}
const cyL = (k) => lanes[k].cy;

// ---- flow connectors ------------------------------------------------------
// 0 -> 1
path([[cx(0), cyL("C") - H / 2], [cx(0), cyL("P") + H / 2]], { arrow: true });
// 1 -> 2
path([[bx(0) + W, cyL("P")], [gx(0), cyL("P")], [gx(0), cyL("C")], [bx(1), cyL("C")]], { arrow: true });
// 2 -> 3 -> 4
path([[bx(1) + W, cyL("C")], [bx(2), cyL("C")]], { arrow: true });
path([[bx(2) + W, cyL("C")], [bx(3), cyL("C")]], { arrow: true });
// 4 -> 5
path([[bx(3) + W, cyL("C")], [gx(3), cyL("C")], [gx(3), cyL("P")], [bx(4), cyL("P")]], { arrow: true });
// 5 -> 6 provider, and 5 -> 6 consumer (fork)
path([[bx(4) + W, cyL("P")], [bx(5), cyL("P")]], { arrow: true });
path([[gx(4), cyL("P")], [gx(4), cyL("K")], [bx(5), cyL("K")]], { arrow: true });
// 6 provider -> 7
path([[bx(5) + W, cyL("P")], [gx(5), cyL("P")], [gx(5), cyL("C")], [bx(6), cyL("C")]], { arrow: true });
// 6 consumer -> 8, 7 -> 8
path([[bx(5) + W, cyL("K")], [bx(7), cyL("K")]], { arrow: true });
path([[bx(6) + W, cyL("C")], [gx(6), cyL("C")], [gx(6), cyL("K")]]);
// 8 -> 9
path([[bx(7) + W, cyL("K")], [bx(8), cyL("K")]], { arrow: true });
// 9 -> 10
path([[bx(8) + W, cyL("K")], [gx(8), cyL("K")], [gx(8), cyL("C")], [bx(9), cyL("C")]], { arrow: true });

// ---- loops (dashed) -------------------------------------------------------
const noteOpts = { fontFace: FONT, fontSize: 10, italic: true, color: GRAY, align: "center", valign: "middle", margin: 0, isTextBox: true };
// 6 provider fails -> retest (above the provider lane boxes)
const pTop = cyL("P") - H / 2;
path([[cx(5), pTop], [cx(5), pTop - 0.12], [cx(4), pTop - 0.12], [cx(4), pTop]], { dash: true, arrow: true });
slide.addText("No: retest", { ...noteOpts, x: cx(4), y: pTop - 0.3, w: cx(5) - cx(4), h: 0.17 });
// 9 fails -> fix or revert (below the consumer boxes)
const kBot = cyL("K") + H / 2;
path([[cx(8), kBot], [cx(8), kBot + 0.14], [cx(7), kBot + 0.14], [cx(7), kBot]], { dash: true, arrow: true });
slide.addText("No: fix, or revert to the heritage URL", { ...noteOpts, x: (cx(7) + cx(8)) / 2 - 1.3, y: kBot + 0.15, w: 2.6, h: 0.17 });
// 2 fails -> earlier date or CIO risk; 6 consumer fails -> escalate (dashed stubs to a note)
const cBot = cyL("C") + H / 2;
seg(cx(1), cBot, cx(1), cBot + 0.12, { dash: true });
slide.addText("No: earlier date, else CIO risk", { ...noteOpts, x: cx(1) - 1.2, y: cBot + 0.13, w: 2.4, h: 0.17 });
seg(cx(5), kBot, cx(5), kBot + 0.12, { dash: true });
slide.addText("No: escalate (team, manager, CIO)", { ...noteOpts, x: cx(5) - 1.2, y: kBot + 0.13, w: 2.4, h: 0.17 });

// missed ticket-by date: weekly report to executive leadership, then back to stage 1 when the ticket arrives
const rx = bx(2), rw = bx(3) + W - bx(2);
path([[bx(0) + W, cyL("P")], [rx, cyL("P")]], { dash: true, arrow: true });
slide.addText("No ticket by the set date", { ...noteOpts, x: bx(0) + W + 0.06, y: cyL("P") - 0.4, w: rx - (bx(0) + W) - 0.12, h: 0.34 });
path([[rx + rw / 2, pTop], [rx + rw / 2, pTop - 0.12], [cx(0), pTop - 0.12], [cx(0), pTop]], { dash: true, arrow: true });
slide.addText("Ticket arrives", { ...noteOpts, x: cx(0), y: pTop - 0.3, w: rx + rw / 2 - cx(0), h: 0.17 });
slide.addText(
  [
    { text: "Weekly report to", options: { bold: true, fontSize: 11, breakLine: true } },
    { text: "executive leadership", options: { bold: true, fontSize: 11, breakLine: true } },
    { text: "Central team waits for the ticket", options: { fontSize: 10 } },
  ],
  { shape: S.roundRect, rectRadius: 0.08, x: rx, y: cyL("P") - H / 2, w: rw, h: H, fill: { color: NAVY }, line: { color: NAVY, width: 0 }, fontFace: FONT, color: "FFFFFF", align: "center", valign: "middle", margin: 0.04 }
);

// ---- stage boxes ----------------------------------------------------------
const stages = [
  { n: "0", c: 0, l: "C", t: "Inventory validated", s: "All parties recorded" },
  { n: "1", c: 0, l: "P", t: "Provider ticket raised", s: "TCI number, planned date", gate: true },
  { n: "2", c: 1, l: "C", t: "Wave planned", s: "Date checked vs window", gate: true },
  { n: "3", c: 2, l: "C", t: "Consumers reconciled", s: "Heritage logs vs inventory" },
  { n: "4", c: 3, l: "C", t: "UAT deploy and notify", s: "One notice per consumer" },
  { n: "5", c: 4, l: "P", t: "Partner testing", s: "Consumers test in UAT" },
  { n: "6", c: 5, l: "P", t: "Provider\nsign-off", s: "Once per application", gate: true },
  { n: "6", c: 5, l: "K", t: "Consumer\nsign-off", s: "Once per API it calls", gate: true },
  { n: "7", c: 6, l: "C", t: "Production deployment", s: "After provider sign-off" },
  { n: "8", c: 7, l: "K", t: "Consumer cutover", s: "Updates URL, weeks 1 to 3" },
  { n: "9", c: 8, l: "K", t: "Cutover closed", s: "Traffic only on NGDC", gate: true },
  { n: "10", c: 9, l: "C", t: "Heritage retired", s: "2 weeks of zero traffic" },
];
for (const st of stages) {
  const lane = lanes[st.l];
  const x = bx(st.c), y = lane.cy - H / 2;
  slide.addText(
    [
      ...st.t.split("\n").map((line) => ({ text: line, options: { bold: true, fontSize: 11, breakLine: true } })),
      { text: st.s, options: { fontSize: 10 } },
    ],
    {
      shape: S.roundRect, rectRadius: 0.08, x, y, w: W, h: H,
      fill: { color: lane.color }, line: { color: lane.color, width: 0 },
      fontFace: FONT, color: "FFFFFF", align: "center", valign: "middle", margin: 0.04,
    }
  );
}
// badges and gate markers on top of boxes
for (const st of stages) {
  const lane = lanes[st.l];
  const x = bx(st.c), y = lane.cy - H / 2;
  slide.addText(st.n, {
    shape: S.ellipse, x: x - 0.1, y: y - 0.14, w: 0.28, h: 0.28,
    fill: { color: "FFFFFF" }, line: { color: lane.color, width: 1.25 },
    fontFace: FONT, fontSize: 10, bold: true, color: lane.color, align: "center", valign: "middle", margin: 0,
  });
  if (st.gate) {
    slide.addText("?", {
      shape: S.diamond, x: x + W - 0.15, y: y + H - 0.15, w: 0.28, h: 0.28,
      fill: { color: "FFFFFF" }, line: { color: INK, width: 1 },
      fontFace: FONT, fontSize: 10, bold: true, color: INK, align: "center", valign: "middle", margin: 0,
    });
  }
}

// ---- legend ---------------------------------------------------------------
const LY = 6.7;
const legendText = (txt, x, w) =>
  slide.addText(txt, { x, y: LY, w, h: 0.26, fontFace: FONT, fontSize: 11, color: INK, valign: "middle", margin: 0, isTextBox: true });
const swatch = (color, x) =>
  slide.addShape(S.roundRect, { x, y: LY + 0.02, w: 0.22, h: 0.22, rectRadius: 0.04, fill: { color }, line: { color, width: 0 } });
swatch(NAVY, 0.4); legendText("Central team", 0.68, 1.1);
swatch(TEAL, 1.95); legendText("Provider", 2.23, 0.8);
swatch(ORANGE, 3.2); legendText("Consumer", 3.48, 0.9);
slide.addText("n", { shape: S.ellipse, x: 4.75, y: LY, w: 0.26, h: 0.26, fill: { color: "FFFFFF" }, line: { color: GRAY, width: 1.25 }, fontFace: FONT, fontSize: 10, bold: true, color: GRAY, align: "center", valign: "middle", margin: 0 });
legendText("Stage number", 5.08, 1.1);
slide.addText("?", { shape: S.diamond, x: 6.5, y: LY, w: 0.26, h: 0.26, fill: { color: "FFFFFF" }, line: { color: INK, width: 1 }, fontFace: FONT, fontSize: 10, bold: true, color: INK, align: "center", valign: "middle", margin: 0 });
legendText("Gate: must pass to continue", 6.83, 2.2);
seg(9.35, LY + 0.13, 9.8, LY + 0.13, { dash: true, arrow: true });
legendText("Loop back", 9.9, 1.0);

pres.writeFile({ fileName: out }).then(() => console.log("wrote", out));
