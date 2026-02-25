import { useState, useEffect } from "react";

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;
const fmtFull = (n) => `$${Math.round(n).toLocaleString()}`;
const fmtX = (n) => `${n.toFixed(1)}x`;

export default function ROICalculator() {
  const [activeTab, setActiveTab] = useState("option1");
  const [annualRevenue, setAnnualRevenue] = useState(400000);
  const [showFormulas, setShowFormulas] = useState(false);

  // Option 1 inputs
  const [leadsPerWeek, setLeadsPerWeek] = useState(10);
  const [closeRate1, setCloseRate1] = useState(25);
  const [jobValue1, setJobValue1] = useState(8000);
  const [margin1, setMargin1] = useState(35);

  // Option 2 inputs
  const [closeRate2, setCloseRate2] = useState(25);
  const [jobValue2, setJobValue2] = useState(8000);
  const [margin2, setMargin2] = useState(35);

  // Option 1 math
  const cpl = leadsPerWeek >= 20 ? 55 : 70;
  const monthlyLeads1 = leadsPerWeek * 4.3;
  const closedJobs1 = monthlyLeads1 * (closeRate1 / 100);
  const monthlyRevenue1 = closedJobs1 * jobValue1;
  const grossProfit1 = monthlyRevenue1 * (margin1 / 100);
  const leadCost1 = monthlyLeads1 * cpl;
  const setupFee1 = 1500;
  const totalInvestment1 = leadCost1 + (setupFee1 / 12);
  const netProfit1 = grossProfit1 - totalInvestment1;
  const roi1 = totalInvestment1 > 0 ? grossProfit1 / totalInvestment1 : 0;

  // Option 2 math
  const retainer2 = 2500;
  const adSpend2 = 3000;
  const totalInvestment2 = retainer2 + adSpend2;
  const leadsLow2 = Math.round(adSpend2 / 100); // $100 CPL conservative
  const leadsHigh2 = Math.round(adSpend2 / 25); // $25 CPL optimistic
  const apptLow2 = Math.round(adSpend2 / 100);
  const apptHigh2 = Math.round(adSpend2 / 50);
  const apptMid2 = Math.round((apptLow2 + apptHigh2) / 2);
  const closedJobs2 = apptMid2 * (closeRate2 / 100);
  const monthlyRevenue2 = closedJobs2 * jobValue2;
  const grossProfit2 = monthlyRevenue2 * (margin2 / 100);
  const netProfit2 = grossProfit2 - totalInvestment2;
  const roi2 = totalInvestment2 > 0 ? grossProfit2 / totalInvestment2 : 0;

  // Recommendation logic
  const rec = annualRevenue < 500000 ? "option1" : "option2";
  const recStrong = annualRevenue >= 1000000;

  const recLabel = recStrong
    ? "⚡ Strongly Recommended for Your Stage"
    : "✓ Recommended for Your Stage";

  return (
    <div style={{
      fontFamily: "'Libre Baskerville', Georgia, serif",
      background: "#0d0f14",
      minHeight: "100vh",
      color: "#e8e4dc",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dmSans { font-family: 'DM Sans', sans-serif; }

        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: #2a2d35;
          outline: none;
          cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c8a96e;
          cursor: pointer;
          transition: transform 0.15s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }

        .tab-btn {
          padding: 12px 28px;
          border: 1px solid #2a2d35;
          background: transparent;
          color: #888;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .tab-btn:first-child { border-radius: 6px 0 0 6px; }
        .tab-btn:last-child { border-radius: 0 6px 6px 0; }
        .tab-btn.active {
          background: #c8a96e;
          border-color: #c8a96e;
          color: #0d0f14;
          font-weight: 600;
        }
        .tab-btn:not(.active):hover { border-color: #c8a96e; color: #c8a96e; }

        .card {
          background: #161921;
          border: 1px solid #22252d;
          border-radius: 12px;
          padding: 28px;
        }

        .metric-box {
          background: #0d0f14;
          border: 1px solid #22252d;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .metric-box.highlight {
          border-color: #c8a96e;
          background: #1a1506;
        }
        .metric-value {
          font-size: 26px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #e8e4dc;
          line-height: 1;
          margin-bottom: 6px;
        }
        .metric-value.gold { color: #c8a96e; }
        .metric-value.green { color: #6bbf8a; }
        .metric-label {
          font-size: 11px;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #555;
        }
        .formula-line {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #666;
          padding: 6px 10px;
          background: #0d0f14;
          border-radius: 4px;
          margin: 4px 0;
          border-left: 2px solid #2a2d35;
        }
        .slider-label {
          display: flex;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          margin-bottom: 8px;
          color: #aaa;
        }
        .slider-value { color: #c8a96e; font-weight: 600; }

        .rec-badge {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .rec-badge.recommended { background: #1a2a1a; color: #6bbf8a; border: 1px solid #3a5a3a; }
        .rec-badge.strong { background: #2a1a06; color: #c8a96e; border: 1px solid #5a3a10; }
        .rec-badge.neutral { background: #1a1921; color: #666; border: 1px solid #2a2d35; }

        .risk-box {
          background: #111318;
          border: 1px solid #1e2128;
          border-radius: 8px;
          padding: 18px;
          margin-top: 16px;
        }
        .risk-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #999;
          line-height: 1.5;
        }
        .risk-item:last-child { margin-bottom: 0; }
        .risk-icon { color: #6bbf8a; font-size: 14px; flex-shrink: 0; margin-top: 1px; }

        .compare-row {
          display: grid;
          grid-template-columns: 160px 1fr 1fr;
          gap: 1px;
          background: #22252d;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1px;
        }
        .compare-cell {
          background: #161921;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
        }
        .compare-cell.label { color: #666; font-size: 12px; letter-spacing: 0.05em; }
        .compare-cell.opt1 { color: #aaa; }
        .compare-cell.opt2 { color: #aaa; }
        .compare-cell.winner { color: #c8a96e; font-weight: 600; }

        .section-divider {
          border: none;
          border-top: 1px solid #1e2128;
          margin: 28px 0;
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e2128", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8a96e", marginBottom: 6 }}>
            Season Proof Growth
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Marketing ROI Calculator
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555" }}>
          Live Sales Tool<br />
          <span style={{ color: "#3a3d45" }}>v2.0</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* Company Revenue Input */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 4 }}>Step 1</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>What's your approximate annual revenue?</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="metric-value gold">{fmt(annualRevenue)}</div>
              <div className="metric-label">Annual Revenue</div>
            </div>
          </div>
          <div className="slider-label">
            <span>$100K</span>
            <span className="slider-value">{fmtFull(annualRevenue)}</span>
            <span>$2M+</span>
          </div>
          <input type="range" min={100000} max={2000000} step={50000}
            value={annualRevenue} onChange={e => setAnnualRevenue(+e.target.value)} />

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, padding: "14px 18px", borderRadius: 8, border: `1px solid ${rec === "option1" ? "#3a5a3a" : "#22252d"}`, background: rec === "option1" ? "#111a11" : "#111318" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", marginBottom: 4 }}>Option 1 · Pay Per Lead</div>
              <span className={`rec-badge ${rec === "option1" ? "recommended" : "neutral"}`}>
                {rec === "option1" ? "✓ Recommended for You" : "Available"}
              </span>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555", marginTop: 8, lineHeight: 1.5 }}>
                Ideal under $500K — lower upfront risk, immediate lead flow
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, padding: "14px 18px", borderRadius: 8, border: `1px solid ${rec === "option2" ? (recStrong ? "#5a3a10" : "#3a5a3a") : "#22252d"}`, background: rec === "option2" ? (recStrong ? "#1a1506" : "#111a11") : "#111318" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", marginBottom: 4 }}>Option 2 · System Ownership</div>
              <span className={`rec-badge ${rec === "option2" ? (recStrong ? "strong" : "recommended") : "neutral"}`}>
                {rec === "option2" ? recLabel : "Available"}
              </span>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555", marginTop: 8, lineHeight: 1.5 }}>
                Ideal $500K+ — own your pipeline, lower cost per lead at scale
              </div>
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div>
            <button className={`tab-btn ${activeTab === "option1" ? "active" : ""}`} onClick={() => setActiveTab("option1")}>
              Option 1 · Pay Per Lead
            </button>
            <button className={`tab-btn ${activeTab === "option2" ? "active" : ""}`} onClick={() => setActiveTab("option2")}>
              Option 2 · System Ownership
            </button>
          </div>
        </div>

        {/* OPTION 1 */}
        {activeTab === "option1" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              {/* Inputs */}
              <div className="card">
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>Your Numbers</div>

                <div style={{ marginBottom: 20 }}>
                  <div className="slider-label">
                    <span>Leads per Week</span>
                    <span className="slider-value">{leadsPerWeek} leads/wk · {fmt(cpl)}/lead</span>
                  </div>
                  <input type="range" min={5} max={40} step={5}
                    value={leadsPerWeek} onChange={e => setLeadsPerWeek(+e.target.value)} />
                  {leadsPerWeek >= 20 && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#6bbf8a", marginTop: 6 }}>
                      ✓ Volume discount applied — $55/lead
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div className="slider-label">
                    <span>Close Rate</span>
                    <span className="slider-value">{closeRate1}%</span>
                  </div>
                  <input type="range" min={10} max={60} step={5}
                    value={closeRate1} onChange={e => setCloseRate1(+e.target.value)} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div className="slider-label">
                    <span>Average Job Value</span>
                    <span className="slider-value">{fmtFull(jobValue1)}</span>
                  </div>
                  <input type="range" min={2000} max={50000} step={500}
                    value={jobValue1} onChange={e => setJobValue1(+e.target.value)} />
                </div>

                <div>
                  <div className="slider-label">
                    <span>Gross Profit Margin</span>
                    <span className="slider-value">{margin1}%</span>
                  </div>
                  <input type="range" min={15} max={60} step={5}
                    value={margin1} onChange={e => setMargin1(+e.target.value)} />
                </div>
              </div>

              {/* Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="metric-box">
                    <div className="metric-value">{Math.round(monthlyLeads1)}</div>
                    <div className="metric-label">Monthly Leads</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{Math.round(closedJobs1)}</div>
                    <div className="metric-label">Closed Jobs/Mo</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{fmtFull(monthlyRevenue1)}</div>
                    <div className="metric-label">Monthly Revenue</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{fmtFull(totalInvestment1)}</div>
                    <div className="metric-label">Monthly Investment</div>
                  </div>
                </div>
                <div className="metric-box highlight">
                  <div className="metric-value green">{fmtFull(netProfit1)}</div>
                  <div className="metric-label">Net Profit After Marketing</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="metric-box highlight">
                    <div className="metric-value gold">{fmtX(roi1)}</div>
                    <div className="metric-label">ROI Multiple</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{fmt(cpl)}</div>
                    <div className="metric-label">Cost Per Lead</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula transparency */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFormulas ? 14 : 0 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666" }}>
                  Math Transparency
                </div>
                <button onClick={() => setShowFormulas(!showFormulas)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c8a96e", background: "none", border: "none", cursor: "pointer" }}>
                  {showFormulas ? "Hide" : "Show"} Formulas ▾
                </button>
              </div>
              {showFormulas && (
                <div>
                  <div className="formula-line">Monthly Leads = {leadsPerWeek} leads/wk × 4.3 weeks = {Math.round(monthlyLeads1)}</div>
                  <div className="formula-line">Closed Jobs = {Math.round(monthlyLeads1)} leads × {closeRate1}% close rate = {Math.round(closedJobs1)}</div>
                  <div className="formula-line">Monthly Revenue = {Math.round(closedJobs1)} jobs × {fmtFull(jobValue1)} = {fmtFull(monthlyRevenue1)}</div>
                  <div className="formula-line">Gross Profit = {fmtFull(monthlyRevenue1)} × {margin1}% = {fmtFull(grossProfit1)}</div>
                  <div className="formula-line">Lead Cost = {Math.round(monthlyLeads1)} leads × {fmt(cpl)}/lead = {fmtFull(leadCost1)}</div>
                  <div className="formula-line">Total Investment = {fmtFull(leadCost1)} + ($1,500 setup ÷ 12) = {fmtFull(totalInvestment1)}/mo</div>
                  <div className="formula-line">Net Profit = {fmtFull(grossProfit1)} gross profit − {fmtFull(totalInvestment1)} investment = {fmtFull(netProfit1)}</div>
                  <div className="formula-line">ROI = {fmtFull(grossProfit1)} gross profit ÷ {fmtFull(totalInvestment1)} investment = {fmtX(roi1)}</div>
                </div>
              )}
            </div>

            {/* Risk Reversal */}
            <div className="risk-box">
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>
                Risk Reversal · Option 1
              </div>
              {[
                ["You only pay for real, verified leads.", "No pay-to-play, no retainer, no guessing."],
                ["Every lead is 100% exclusive to you.", "No lead farms. No shared pools. Your competitor will never get the same contact."],
                ["No long-term contract required.", "Start, pause, or scale on your schedule."],
                ["If a lead isn't a real homeowner contact, you don't pay for it.", "Built-in quality protection."],
              ].map(([title, sub], i) => (
                <div className="risk-item" key={i}>
                  <span className="risk-icon">✓</span>
                  <span><strong style={{ color: "#ccc" }}>{title}</strong> {sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OPTION 2 */}
        {activeTab === "option2" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              {/* Inputs */}
              <div className="card">
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>Your Numbers</div>

                <div style={{ padding: "14px 16px", borderRadius: 8, border: "1px solid #2a2d35", marginBottom: 20 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#666", marginBottom: 10 }}>Fixed Monthly Investment</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#e8e4dc" }}>$2,500</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>Management Retainer</div>
                    </div>
                    <div style={{ color: "#333", fontSize: 20, paddingTop: 4 }}>+</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#e8e4dc" }}>$3,000</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>Ad Spend</div>
                    </div>
                    <div style={{ color: "#333", fontSize: 20, paddingTop: 4 }}>=</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#c8a96e" }}>$5,500</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#555" }}>Total/Month</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div className="slider-label">
                    <span>Close Rate (Appt → Job)</span>
                    <span className="slider-value">{closeRate2}%</span>
                  </div>
                  <input type="range" min={10} max={60} step={5}
                    value={closeRate2} onChange={e => setCloseRate2(+e.target.value)} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div className="slider-label">
                    <span>Average Job Value</span>
                    <span className="slider-value">{fmtFull(jobValue2)}</span>
                  </div>
                  <input type="range" min={2000} max={50000} step={500}
                    value={jobValue2} onChange={e => setJobValue2(+e.target.value)} />
                </div>

                <div>
                  <div className="slider-label">
                    <span>Gross Profit Margin</span>
                    <span className="slider-value">{margin2}%</span>
                  </div>
                  <input type="range" min={15} max={60} step={5}
                    value={margin2} onChange={e => setMargin2(+e.target.value)} />
                </div>
              </div>

              {/* Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="metric-box">
                    <div className="metric-value">{apptLow2}–{apptHigh2}</div>
                    <div className="metric-label">Booked Appts/Mo</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{Math.round(closedJobs2)}</div>
                    <div className="metric-label">Closed Jobs/Mo</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">{fmtFull(monthlyRevenue2)}</div>
                    <div className="metric-label">Monthly Revenue</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">$5,500</div>
                    <div className="metric-label">Monthly Investment</div>
                  </div>
                </div>
                <div className="metric-box highlight">
                  <div className="metric-value green">{fmtFull(netProfit2)}</div>
                  <div className="metric-label">Net Profit After Marketing</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="metric-box highlight">
                    <div className="metric-value gold">{fmtX(roi2)}</div>
                    <div className="metric-label">ROI Multiple</div>
                  </div>
                  <div className="metric-box">
                    <div className="metric-value">$25–$100</div>
                    <div className="metric-label">Cost Per Lead</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula transparency */}
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFormulas ? 14 : 0 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666" }}>
                  Math Transparency
                </div>
                <button onClick={() => setShowFormulas(!showFormulas)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c8a96e", background: "none", border: "none", cursor: "pointer" }}>
                  {showFormulas ? "Hide" : "Show"} Formulas ▾
                </button>
              </div>
              {showFormulas && (
                <div>
                  <div className="formula-line">Ad spend = $3,000/mo on Facebook + Google</div>
                  <div className="formula-line">Booked Appointments = $3,000 ÷ $50–$100 cost/appt = {apptLow2}–{apptHigh2} appointments (using midpoint: {apptMid2})</div>
                  <div className="formula-line">Closed Jobs = {apptMid2} appointments × {closeRate2}% close rate = {Math.round(closedJobs2)}</div>
                  <div className="formula-line">Monthly Revenue = {Math.round(closedJobs2)} jobs × {fmtFull(jobValue2)} = {fmtFull(monthlyRevenue2)}</div>
                  <div className="formula-line">Gross Profit = {fmtFull(monthlyRevenue2)} × {margin2}% = {fmtFull(grossProfit2)}</div>
                  <div className="formula-line">Total Investment = $2,500 retainer + $3,000 ad spend = $5,500/mo</div>
                  <div className="formula-line">Net Profit = {fmtFull(grossProfit2)} − $5,500 = {fmtFull(netProfit2)}</div>
                  <div className="formula-line">ROI = {fmtFull(grossProfit2)} gross profit ÷ $5,500 investment = {fmtX(roi2)}</div>
                </div>
              )}
            </div>

            {/* Guarantee callout */}
            <div style={{ padding: "16px 20px", background: "#111a11", border: "1px solid #2a4a2a", borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#6bbf8a", marginBottom: 6, fontWeight: 600, letterSpacing: "0.05em" }}>
                ⚡ APPOINTMENT MINIMUM GUARANTEE
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
                If we don't hit the agreed minimum appointment threshold in any given month, that month's retainer is free. You only pay for results — not effort.
              </div>
            </div>

            {/* Risk Reversal */}
            <div className="risk-box">
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>
                Risk Reversal · Option 2
              </div>
              {[
                ["Appointment minimum guarantee.", "If we don't hit the threshold, you don't pay the retainer. Period."],
                ["You own everything.", "The ad account, the data, the audience. Not us. You."],
                ["Your brand gets stronger every month.", "Retargeting audiences grow. Cost per lead decreases over time."],
                ["Predictable, scalable cost structure.", "As you scale, your blended CPL drops — the system gets more efficient, not more expensive."],
              ].map(([title, sub], i) => (
                <div className="risk-item" key={i}>
                  <span className="risk-icon">✓</span>
                  <span><strong style={{ color: "#ccc" }}>{title}</strong> {sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison */}
        <hr className="section-divider" />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>
          Side-by-Side Comparison
        </div>

        <div>
          <div className="compare-row">
            <div className="compare-cell label" style={{ background: "#111318", fontWeight: 600 }}></div>
            <div className="compare-cell" style={{ background: "#111318", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c8a96e", fontWeight: 600, letterSpacing: "0.05em" }}>Option 1 · Pay Per Lead</div>
            <div className="compare-cell" style={{ background: "#111318", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#c8a96e", fontWeight: 600, letterSpacing: "0.05em" }}>Option 2 · System Ownership</div>
          </div>
          {[
            ["Monthly Investment", fmtFull(totalInvestment1), "$5,500", annualRevenue >= 500000 ? "opt2" : "opt1"],
            ["Cost Per Lead", `${fmt(cpl)}/lead`, "$25–$100/lead", annualRevenue >= 500000 ? "opt2" : "opt1"],
            ["Monthly Leads/Appts", `${Math.round(monthlyLeads1)} leads`, `${apptLow2}–${apptHigh2} appts`, null],
            ["Closed Jobs/Month", `${Math.round(closedJobs1)}`, `${Math.round(closedJobs2)}`, null],
            ["ROI Multiple", fmtX(roi1), fmtX(roi2), roi1 > roi2 ? "opt1" : "opt2"],
            ["You Own the System", "No", "Yes ✓", "opt2"],
            ["Brand Equity Builds", "No", "Yes ✓", "opt2"],
            ["Scalability", "Medium", "High", "opt2"],
            ["Upfront Risk", "Low ($1,500)", "Medium ($5,500/mo)", "opt1"],
            ["Guarantee", "Verified leads only", "Appointment minimum", null],
          ].map(([label, v1, v2, winner], i) => (
            <div className="compare-row" key={i}>
              <div className="compare-cell label">{label}</div>
              <div className={`compare-cell ${winner === "opt1" ? "winner" : "opt1"}`}>{v1}</div>
              <div className={`compare-cell ${winner === "opt2" ? "winner" : "opt2"}`}>{v2}</div>
            </div>
          ))}
        </div>

        {/* Recommendation Summary */}
        <div style={{ marginTop: 24, padding: "22px 24px", borderRadius: 10, border: `1px solid ${rec === "option2" && recStrong ? "#5a3a10" : "#3a5a3a"}`, background: rec === "option2" && recStrong ? "#1a1506" : "#111a11" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 8 }}>
            Our Recommendation for You
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            {rec === "option1"
              ? "Start with Option 1 — Pay Per Lead"
              : recStrong
                ? "Option 2 is the Clear Choice at Your Scale"
                : "Option 2 — System Ownership will serve you better"}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888", lineHeight: 1.7 }}>
            {rec === "option1"
              ? `At ${fmtFull(annualRevenue)}/year, Option 1 gives you verified leads immediately with minimal upfront risk. You can test your close rate and average job value before committing to a retainer. When you're consistently closing leads and ready to scale, Option 2 becomes a natural upgrade.`
              : recStrong
                ? `At ${fmtFull(annualRevenue)}/year, you have the infrastructure to support a full pipeline system. Option 2 will produce a lower blended CPL, build brand equity, and give you a predictable, scalable growth engine — assets you own permanently.`
                : `At ${fmtFull(annualRevenue)}/year, you're in the range where Option 2 starts making strong financial sense. You have the team to convert the volume, and a fully-owned system will get more efficient every month you run it.`}
          </div>
        </div>

        {/* Call Script */}
        <hr className="section-divider" />
        <div className="card">
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666", marginBottom: 16 }}>
            How to Use This Live on a Sales Call
          </div>
          {[
            ["Step 1 — Anchor the revenue question", `"Before I show you the numbers, quick question — where are you at right now, revenue-wise? Just ballpark." → Drag the revenue slider to their number. Let the recommendation badge populate. Don't explain it yet — let them see it.`],
            ["Step 2 — Flip to the right option", `"Based on your stage, here's where I'd start." → Click the recommended tab. Don't hard sell. Frame it as a fit conversation.`],
            ["Step 3 — Let them set the inputs", `"What's your average job value? What do you typically close at?" → Hand them the sliders conceptually. When they give you numbers, enter them in real time. They're building their own ROI case.`],
            ["Step 4 — Reveal the net profit", `Pause on the "Net Profit After Marketing" number. "So if those numbers hold — and they're your numbers, not mine — you'd be netting ${fmtFull(netProfit1 || netProfit2)} a month after the marketing spend. Does that feel conservative to you, or pretty accurate?"`],
            ["Step 5 — Show the formulas", `Click "Show Formulas." "I want you to be able to see exactly how I got here. Nothing is hidden. You can take this to your accountant." → Transparency = trust.`],
            ["Step 6 — Risk reversal close", `"The only risk here is [leads that aren't real / missing the appointment guarantee]. Here's what happens in that case..." → Walk through the risk reversal bullets. Then: "So what would need to be true for this to make sense to move forward?""`],
          ].map(([title, script], i) => (
            <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < 5 ? "1px solid #1e2128" : "none" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#c8a96e", marginBottom: 6 }}>{title}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", lineHeight: 1.7, fontStyle: "italic" }}>{script}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#333", letterSpacing: "0.08em" }}>
          SEASON PROOF GROWTH · Exclusive Territory · Done-For-You Lead Generation
        </div>
      </div>
    </div>
  );
}
