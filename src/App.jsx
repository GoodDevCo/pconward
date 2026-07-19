import React, { useMemo, useState } from "react";
import {
  LayoutGrid, Plug, Check, CheckCircle2, ArrowLeft, ArrowRight,
  ShieldCheck, Github, Code2, Zap, Lock, Store,
} from "lucide-react";
import { BRAND, CATEGORIES, TIERS } from "./config.js";
import { getTools, getTool } from "./platform/registry.js";
import { createClient } from "./pco/client.js";
import { CSS } from "./styles.js";
import "./tools/index.js"; // registers all tools

const priceLabel = (n) => (n === 0 ? "Free" : `$${n}`);

export default function App() {
  const [view, setView] = useState({ name: "market" });
  const [session, setSession] = useState(null);          // connected PCO org
  const [installed, setInstalled] = useState(() => new Set());
  const [filters, setFilters] = useState({ category: "all", tier: "all" });
  const [modal, setModal] = useState(null);              // { type, toolId }

  const client = useMemo(() => createClient(session), [session]);
  const tools = getTools();

  const go = (name, toolId) => { setView({ name, toolId }); window.scrollTo(0, 0); };

  function install(tool) {
    if (installed.has(tool.id)) return openTool(tool);
    if (tool.priceMonthly === 0) {
      setInstalled((s) => new Set(s).add(tool.id));
    } else {
      setModal({ type: "buy", toolId: tool.id });
    }
  }
  function confirmBuy(tool) {
    setInstalled((s) => new Set(s).add(tool.id));
    setModal(null);
  }
  function openTool(tool) {
    if (!session) { setModal({ type: "connect", toolId: tool.id }); return; }
    go("run", tool.id);
  }
  function confirmConnect() {
    setSession({ org: client.org, connectedAt: Date.now() });
    const pending = modal?.toolId;
    setModal(null);
    if (pending) {
      setInstalled((s) => (getTool(pending).priceMonthly === 0 ? new Set(s).add(pending) : s));
      const t = getTool(pending);
      if (t.priceMonthly === 0) go("run", pending);
    }
  }

  return (
    <>
      <style>{CSS}</style>
      <Header view={view} go={go} session={session} onConnect={() => setModal({ type: "connect" })} />

      {view.name === "market" && (
        <Market tools={tools} filters={filters} setFilters={setFilters} installed={installed} go={go} />
      )}
      {view.name === "detail" && (
        <Detail tool={getTool(view.toolId)} installed={installed} onInstall={install} onOpen={openTool} go={go} />
      )}
      {view.name === "run" && (
        <Run tool={getTool(view.toolId)} client={client} session={session} go={go} />
      )}
      {view.name === "developers" && <Developers go={go} />}

      <Footer go={go} />

      {modal?.type === "buy" && (
        <BuyModal tool={getTool(modal.toolId)} onClose={() => setModal(null)} onConfirm={confirmBuy} />
      )}
      {modal?.type === "connect" && (
        <ConnectModal tool={modal.toolId ? getTool(modal.toolId) : null} onClose={() => setModal(null)} onConfirm={confirmConnect} />
      )}
    </>
  );
}

/* ── header ─────────────────────────────────────────── */
function Header({ view, go, session, onConnect }) {
  return (
    <header className="hdr">
      <div className="hdr-in">
        <div className="brand" onClick={() => go("market")}>
          <img className="brand-logo" src="/logo.png" alt="PCO Go" />
        </div>
        <nav className="nav">
          <a className={view.name === "market" ? "on" : ""} onClick={() => go("market")}>Marketplace</a>
          <a className={view.name === "developers" ? "on" : ""} onClick={() => go("developers")}>For developers</a>
        </nav>
        <div className="hdr-sp" />
        {session ? (
          <div className="conn"><span className="dot" />{session.org.name}</div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onConnect}>
            <Plug size={15} /> Connect Planning Center
          </button>
        )}
      </div>
    </header>
  );
}

/* ── marketplace ────────────────────────────────────── */
function Market({ tools, filters, setFilters, installed, go }) {
  const shown = tools.filter(
    (t) =>
      (filters.category === "all" || t.category === filters.category) &&
      (filters.tier === "all" || t.tier === filters.tier)
  );
  return (
    <main className="wrap">
      <section className="hero">
        <h1>Make Planning Center<br /><span>do more.</span></h1>
        <p>{BRAND.blurb}</p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => document.getElementById("catalog").scrollIntoView({ behavior: "smooth" })}>
            Browse the marketplace <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost" onClick={() => go("developers")}>
            <Code2 size={16} /> Build & sell a tool
          </button>
        </div>
        <div className="hero-meta">Connect once · install in a click · your data stays in Planning Center</div>
      </section>

      <div id="catalog" className="filters">
        <div className="fgroup">
          <span className="lbl">Type</span>
          <button className={`chip ${filters.category === "all" ? "chip-on" : ""}`} onClick={() => setFilters((f) => ({ ...f, category: "all" }))}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`chip ${filters.category === c.id ? "chip-on" : ""}`} onClick={() => setFilters((f) => ({ ...f, category: c.id }))}>{c.label}</button>
          ))}
        </div>
        <div className="fgroup">
          <span className="lbl">Level</span>
          <button className={`chip ${filters.tier === "all" ? "chip-on" : ""}`} onClick={() => setFilters((f) => ({ ...f, tier: "all" }))}>All</button>
          {Object.values(TIERS).map((t) => (
            <button key={t.id} className={`chip ${filters.tier === t.id ? "chip-on" : ""}`} onClick={() => setFilters((f) => ({ ...f, tier: t.id }))}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="grid">
        {shown.map((t) => <ToolCard key={t.id} tool={t} installed={installed.has(t.id)} go={go} />)}
      </div>
    </main>
  );
}

function ToolCard({ tool, installed, go }) {
  const { Icon } = tool;
  return (
    <div className="tcard" onClick={() => go("detail", tool.id)}>
      <div className="tcard-top">
        <div className="ttile" style={{ background: tool.accent }}><Icon size={22} /></div>
        <div>
          <h3>{tool.name}</h3>
          <div className="tbadges">
            <span className={`badge ${tool.tier === "easy" ? "badge-easy" : "badge-dev"}`}>{TIERS[tool.tier].label}</span>
            <span className="badge badge-cat">{CATEGORIES.find((c) => c.id === tool.category).label}</span>
          </div>
        </div>
      </div>
      <p>{tool.tagline}</p>
      <div className="tcard-foot">
        <div className={`price ${tool.priceMonthly === 0 ? "price-free" : ""}`}>
          {priceLabel(tool.priceMonthly)}{tool.priceMonthly > 0 && <small>/mo</small>}
        </div>
        {installed
          ? <span className="installed-tag"><Check size={15} /> Installed</span>
          : <span className="btn btn-ghost btn-sm">View</span>}
      </div>
    </div>
  );
}

/* ── tool detail ────────────────────────────────────── */
function Detail({ tool, installed, onInstall, onOpen, go }) {
  if (!tool) return null;
  const { Icon } = tool;
  const isIn = installed.has(tool.id);
  return (
    <main className="wrap">
      <a className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => go("market")}><ArrowLeft size={15} /> Marketplace</a>
      <div className="detail-top">
        <div className="ttile" style={{ background: tool.accent }}><Icon size={28} /></div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h1 className="detail-h1">{tool.name}</h1>
          <div className="detail-tag">{tool.tagline}</div>
          <div className="tbadges" style={{ marginTop: 10 }}>
            <span className={`badge ${tool.tier === "easy" ? "badge-easy" : "badge-dev"}`}>{TIERS[tool.tier].label}</span>
            <span className="badge badge-cat">{CATEGORIES.find((c) => c.id === tool.category).label}</span>
          </div>
        </div>
        <div className="detail-side">
          <div className="detail-price">{priceLabel(tool.priceMonthly)}{tool.priceMonthly > 0 && <small style={{ fontSize: 14, color: "var(--faint)", fontWeight: 500 }}>/mo</small>}</div>
          {isIn
            ? <button className="btn btn-primary" onClick={() => onOpen(tool)}><Zap size={16} /> Open tool</button>
            : <button className="btn btn-primary" onClick={() => onInstall(tool)}>{tool.priceMonthly === 0 ? "Install free" : "Get it"}</button>}
          {isIn && <div className="installed-tag"><Check size={14} /> Installed</div>}
        </div>
      </div>

      <div className="detail-body">
        <div>
          <div className="section-h">Overview</div>
          <div className="detail-desc">{tool.description}</div>
          <div className="section-h">What it reads</div>
          <div className="detail-desc" style={{ marginBottom: 6 }}>
            {TIERS[tool.tier].desc}
          </div>
          {tool.source && (
            <div className="repo"><Github size={16} /> Open source · <code>{tool.source.repo}</code></div>
          )}
        </div>
        <aside>
          <div className="meta-card">
            <div className="meta-row"><span className="k">Publisher</span><span className="v">{tool.author.name}</span></div>
            <div className="meta-row"><span className="k">Category</span><span className="v">{CATEGORIES.find((c) => c.id === tool.category).label}</span></div>
            <div className="meta-row"><span className="k">Level</span><span className="v">{TIERS[tool.tier].label}</span></div>
            <div className="meta-row"><span className="k">Price</span><span className="v">{priceLabel(tool.priceMonthly)}{tool.priceMonthly > 0 ? "/mo" : ""}</span></div>
          </div>
          <div className="section-h">Planning Center access</div>
          <div className="scopes">
            {tool.scopes.map((s) => <span className="scope" key={s}>{s}</span>)}
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ── run a tool ─────────────────────────────────────── */
function Run({ tool, client, session, go }) {
  if (!tool) return null;
  const { Icon, Component } = tool;
  return (
    <main className="wrap">
      <a className="btn btn-ghost btn-sm" style={{ marginTop: 20 }} onClick={() => go("detail", tool.id)}><ArrowLeft size={15} /> Back</a>
      <div className="run-head">
        <div className="ttile" style={{ background: tool.accent }}><Icon size={22} /></div>
        <div>
          <h1 className="run-title">{tool.name}</h1>
          <div className="run-sub">Running against {session.org.name}</div>
        </div>
      </div>
      <div className="run-body">
        {client.mode === "demo" && (
          <div className="demo-ribbon">
            <ShieldCheck size={16} />
            Demo data — connect a real Planning Center org and the exact same tool renders your live numbers.
          </div>
        )}
        <Component client={client} />
      </div>
    </main>
  );
}

/* ── developers page ────────────────────────────────── */
function Developers({ go }) {
  return (
    <main className="wrap">
      <section className="dev-hero">
        <h1>Build a tool. Ship it. Get paid.</h1>
        <p>
          Every tool here — first-party or yours — is one manifest and one React component against a single
          Planning Center data client. Write the tool, point us at your repo, and {BRAND.name} handles auth,
          hosting, billing, and distribution. Easy tools plug in for churches; developer tools give you room to
          go deep — both served the same way.
        </p>
      </section>

      <div className="dev-steps">
        <div className="dev-step"><div className="n">1</div><h3>Write a manifest</h3><p>Declare your tool's name, category, price, and the PCO scopes it needs. That's the whole contract.</p></div>
        <div className="dev-step"><div className="n">2</div><h3>Build the component</h3><p>One React component that receives a ready-authed <code>client</code>. Read giving, people, check-ins — no OAuth plumbing.</p></div>
        <div className="dev-step"><div className="n">3</div><h3>Connect your repo</h3><p>Push to GitHub, connect it here. We build, host, list it in the marketplace, and split the revenue.</p></div>
      </div>

      <div className="section-h">The contract</div>
      <pre className="code"><span className="c">// every tool is just this — a manifest + a component</span>{"\n"}<span className="k">export const</span> manifest = {"{"}{"\n"}{"  "}id: <span className="s">"serving-gaps"</span>,{"\n"}{"  "}name: <span className="s">"Serving Gaps"</span>,{"\n"}{"  "}category: <span className="s">"apps"</span>, tier: <span className="s">"dev"</span>, priceMonthly: <span className="s">15</span>,{"\n"}{"  "}scopes: [<span className="s">"services"</span>, <span className="s">"people"</span>],{"\n"}{"  "}Component,{"\n"}{"}"};{"\n"}{"\n"}<span className="k">function</span> Component({"{"} client {"}"}) {"{"}{"\n"}{"  "}<span className="c">// client is authed to the church's PCO — just read data</span>{"\n"}{"  "}<span className="k">const</span> teams = <span className="k">await</span> client.services();{"\n"}{"  "}<span className="k">return</span> &lt;Dashboard teams={"{"}teams{"}"} /&gt;;{"\n"}{"}"}</pre>

      <div style={{ margin: "26px 0 60px" }}>
        <button className="btn btn-primary" onClick={() => go("market")}><Github size={16} /> See tools built this way</button>
      </div>
    </main>
  );
}

/* ── modals ─────────────────────────────────────────── */
function BuyModal({ tool, onClose, onConfirm }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add {tool.name}</h3>
        <p>Start a subscription for this tool. Cancel anytime — billing is per church, per month.</p>
        <div className="modal-tool">
          <div className="ttile" style={{ background: tool.accent, width: 38, height: 38, borderRadius: 10 }}><tool.Icon size={19} /></div>
          <div><div style={{ fontWeight: 700 }}>{tool.name}</div><div style={{ fontSize: 12.5, color: "var(--mut)" }}>{tool.author.name}</div></div>
        </div>
        <div className="modal-row"><span>{tool.name} · monthly</span><span>${tool.priceMonthly}.00</span></div>
        <div className="modal-total"><span>Due today</span><span>${tool.priceMonthly}.00</span></div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm(tool)}><Lock size={15} /> Subscribe</button>
        </div>
        <div className="modal-fine">Checkout is a demo. Real payments plug into Stripe at the billing milestone.</div>
      </div>
    </div>
  );
}

function ConnectModal({ tool, onClose, onConfirm }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Connect Planning Center</h3>
        <p>{tool ? `${tool.name} needs to read your Planning Center data.` : "Link your Planning Center account so tools can read your data."} You'll approve this in Planning Center — {BRAND.name} never sees your password.</p>
        <div className="scope-list">
          <div className="scope-item"><ShieldCheck size={16} color="var(--ok)" /> Read-only access to the areas each tool declares</div>
          <div className="scope-item"><Lock size={16} color="var(--ok)" /> Revoke anytime from your PCO account</div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Not now</button>
          <button className="btn btn-primary" onClick={onConfirm}><Plug size={15} /> Authorize with PCO</button>
        </div>
        <div className="modal-fine">Demo connect. Real OAuth wires in at the auth milestone.</div>
      </div>
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer className="wrap">
      <div className="ftr">
        <span>© {new Date().getFullYear()} {BRAND.name} · Not affiliated with Planning Center.</span>
        <span style={{ display: "flex", gap: 16 }}>
          <a onClick={() => go("market")}>Marketplace</a>
          <a onClick={() => go("developers")}>For developers</a>
        </span>
      </div>
    </footer>
  );
}
