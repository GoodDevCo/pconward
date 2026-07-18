export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;}
html,body,#root{margin:0;padding:0;height:100%;}
:root{
  --brand:#4F46E5; --brand-d:#4338CA; --brand-soft:#EEF0FE;
  --ink:#1E2230; --mut:#6B7280; --faint:#9AA1AE;
  --bg:#F6F7FB; --card:#FFFFFF; --line:#E7E9F1; --line2:#EFF1F6;
  --ok:#3EA46B; --warn:#E0913B;
}
body{background:var(--bg);color:var(--ink);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px;}

/* header */
.hdr{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.hdr-in{max-width:1120px;margin:0 auto;padding:13px 22px;display:flex;align-items:center;gap:20px;}
.brand{display:flex;align-items:center;gap:9px;font-weight:800;font-size:19px;letter-spacing:-.02em;cursor:pointer;}
.brand-mk{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--brand),#7C74F0);display:flex;align-items:center;justify-content:center;color:#fff;}
.brand b{color:var(--brand);}
.nav{display:flex;gap:4px;margin-left:8px;}
.nav a{padding:7px 12px;border-radius:8px;font-size:14px;font-weight:500;color:var(--mut);cursor:pointer;}
.nav a:hover{background:var(--line2);color:var(--ink);}
.nav a.on{color:var(--brand);background:var(--brand-soft);}
.hdr-sp{flex:1;}
.conn{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--ok);background:#EAF7F0;border:1px solid #CDEBDB;padding:7px 12px;border-radius:9px;}
.conn .dot{width:8px;height:8px;border-radius:50%;background:var(--ok);}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:7px;border:none;border-radius:10px;padding:10px 16px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:.15s;}
.btn-primary{background:var(--brand);color:#fff;box-shadow:0 1px 2px rgba(79,70,229,.35);}
.btn-primary:hover{background:var(--brand-d);}
.btn-ghost{background:#fff;color:var(--ink);border:1px solid var(--line);}
.btn-ghost:hover{border-color:var(--brand);color:var(--brand);}
.btn-sm{padding:7px 12px;font-size:13px;border-radius:9px;}
.btn:disabled{opacity:.5;cursor:default;}

/* hero */
.hero{padding:60px 0 30px;text-align:center;}
.hero h1{font-size:clamp(30px,5vw,50px);font-weight:800;letter-spacing:-.03em;line-height:1.05;margin:0 0 16px;}
.hero h1 span{background:linear-gradient(120deg,var(--brand),#8B7CF6);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.hero p{font-size:clamp(15px,2vw,18px);color:var(--mut);max-width:560px;margin:0 auto 24px;line-height:1.55;}
.hero-cta{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.hero-meta{margin-top:16px;font-size:12.5px;color:var(--faint);}

/* filters */
.filters{display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:8px 0 20px;border-bottom:1px solid var(--line);margin-bottom:24px;}
.fgroup{display:flex;gap:6px;align-items:center;}
.fgroup .lbl{font-size:12px;font-weight:600;color:var(--faint);text-transform:uppercase;letter-spacing:.06em;margin-right:2px;}
.chip{background:#fff;border:1px solid var(--line);color:var(--mut);padding:7px 13px;border-radius:999px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;transition:.13s;}
.chip:hover{border-color:var(--brand);color:var(--brand);}
.chip-on{background:var(--brand);border-color:var(--brand);color:#fff;}

/* catalog grid */
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.tcard{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;display:flex;flex-direction:column;cursor:pointer;transition:.16s;}
.tcard:hover{border-color:#CED3F5;box-shadow:0 10px 30px rgba(60,66,120,.09);transform:translateY(-2px);}
.tcard-top{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.ttile{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.tcard h3{margin:0;font-size:16px;font-weight:700;letter-spacing:-.01em;}
.tbadges{display:flex;gap:6px;margin-top:3px;}
.badge{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:6px;}
.badge-easy{background:#EAF7F0;color:#2E7D50;}
.badge-dev{background:#FEF2E3;color:#B5721F;}
.badge-cat{background:var(--line2);color:var(--mut);}
.tcard p{color:var(--mut);font-size:13.5px;line-height:1.5;margin:0 0 16px;flex:1;}
.tcard-foot{display:flex;align-items:center;justify-content:space-between;}
.price{font-size:14px;font-weight:700;}
.price small{font-weight:500;color:var(--faint);font-size:12px;}
.price-free{color:var(--ok);}
.installed-tag{display:flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;color:var(--ok);}

/* detail */
.detail-top{display:flex;gap:18px;align-items:flex-start;padding:32px 0 22px;border-bottom:1px solid var(--line);flex-wrap:wrap;}
.detail-top .ttile{width:60px;height:60px;border-radius:15px;}
.detail-h1{font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 6px;}
.detail-tag{color:var(--mut);font-size:15px;line-height:1.5;max-width:620px;}
.detail-side{margin-left:auto;text-align:right;display:flex;flex-direction:column;gap:10px;align-items:flex-end;}
.detail-price{font-size:24px;font-weight:800;}
.detail-body{display:grid;grid-template-columns:1fr 300px;gap:32px;padding:24px 0 60px;}
.detail-desc{font-size:15px;line-height:1.7;color:#374050;}
.section-h{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--faint);margin:26px 0 10px;}
.meta-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;}
.meta-row{display:flex;justify-content:space-between;padding:9px 0;font-size:13.5px;border-top:1px solid var(--line2);}
.meta-row:first-child{border-top:none;}
.meta-row .k{color:var(--mut);}
.meta-row .v{font-weight:600;}
.scopes{display:flex;flex-wrap:wrap;gap:6px;}
.scope{font-size:11.5px;background:var(--brand-soft);color:var(--brand-d);padding:3px 8px;border-radius:6px;font-weight:600;}
.repo{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--mut);margin-top:4px;}

/* run panel */
.run-head{display:flex;align-items:center;gap:14px;padding:26px 0 18px;border-bottom:1px solid var(--line);flex-wrap:wrap;}
.run-head .ttile{width:46px;height:46px;border-radius:12px;}
.run-title{font-size:20px;font-weight:800;letter-spacing:-.02em;margin:0;}
.run-sub{font-size:13px;color:var(--faint);}
.run-body{padding:24px 0 60px;}
.demo-ribbon{display:flex;align-items:center;gap:9px;background:#FFF8E8;border:1px solid #F3E2B8;color:#8A6A1E;font-size:13px;padding:10px 14px;border-radius:11px;margin:18px 0 22px;}

/* tool ui kit */
.tool-controls{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
.tool-loading{display:flex;align-items:center;gap:11px;color:var(--mut);padding:50px 0;justify-content:center;font-size:14px;}
.spin{animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:8px;}
.stat{background:#fff;border:1px solid var(--line);border-radius:13px;padding:15px 16px;}
.stat-label{font-size:12px;color:var(--faint);font-weight:600;text-transform:uppercase;letter-spacing:.04em;}
.stat-value{font-size:24px;font-weight:800;margin-top:5px;letter-spacing:-.02em;}
.stat-sub{font-size:12px;color:var(--mut);margin-top:3px;}
.tool-h{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--faint);margin:26px 0 12px;}
.barlist{display:flex;flex-direction:column;gap:9px;}
.barrow{display:grid;grid-template-columns:150px 1fr 110px;align-items:center;gap:12px;}
.barrow-label{font-size:13.5px;color:#374050;font-weight:500;}
.barrow-track{height:12px;background:var(--line2);border-radius:7px;overflow:hidden;}
.barrow-fill{height:100%;border-radius:7px;transition:width .7s cubic-bezier(.2,.7,.2,1);}
.barrow-val{text-align:right;font-size:13.5px;font-weight:700;font-variant-numeric:tabular-nums;}
.chart-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;}
.linechart{width:100%;height:130px;display:block;}
.chart-axis{display:flex;justify-content:space-between;font-size:11.5px;color:var(--faint);margin-top:6px;}
.tbl-wrap{border:1px solid var(--line);border-radius:12px;overflow:hidden;}
.tbl{width:100%;border-collapse:collapse;font-size:14px;}
.tbl th{background:#FafBff;text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--faint);font-weight:700;padding:11px 14px;border-bottom:1px solid var(--line);}
.tbl td{padding:11px 14px;border-bottom:1px solid var(--line2);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:#FbFcff;}

/* statements split */
.split{display:grid;grid-template-columns:280px 1fr;gap:22px;}
.split-side{border-right:1px solid var(--line);padding-right:22px;}
.tool-search,.dev-config .field input,.tool-search input{font-family:inherit;}
.tool-search{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:10px;padding:9px 12px;color:var(--faint);margin-bottom:12px;}
.tool-search input{border:none;outline:none;font-size:14px;flex:1;color:var(--ink);}
.person-list{display:flex;flex-direction:column;gap:4px;}
.person{display:flex;flex-direction:column;align-items:flex-start;text-align:left;background:none;border:none;padding:9px 11px;border-radius:9px;cursor:pointer;font-family:inherit;}
.person:hover{background:var(--line2);}
.person-on{background:var(--brand-soft);}
.person span{font-size:14px;font-weight:600;}
.person small{font-size:11.5px;color:var(--faint);}
.empty{color:var(--faint);padding:50px 20px;text-align:center;font-size:14px;}
.statement{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px;}
.statement-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:18px;}
.statement-org{font-weight:800;font-size:17px;}
.statement-title{font-size:14px;color:var(--mut);}
.statement-person{font-size:13px;color:var(--faint);margin-top:6px;}
.statement-total{display:flex;justify-content:space-between;align-items:center;padding:14px 2px 4px;font-size:15px;}
.statement-total b{font-size:20px;}
.statement-fine{font-size:12px;color:var(--faint);line-height:1.5;margin-top:12px;}

/* dev tool */
.dev-config{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:16px;}
.field{display:flex;flex-direction:column;gap:5px;}
.field label{font-size:12px;font-weight:600;color:var(--mut);}
.field input{border:1px solid var(--line);border-radius:9px;padding:9px 11px;font-size:14px;outline:none;font-family:inherit;}
.field input:focus{border-color:var(--brand);}
.dev-result{margin-top:20px;}
.dev-result-head{display:flex;align-items:center;gap:9px;color:var(--ok);font-size:14px;margin-bottom:12px;}
.dev-more{font-size:12.5px;color:var(--faint);padding:8px 2px;}

/* developers page */
.dev-hero{padding:50px 0 10px;}
.dev-hero h1{font-size:clamp(26px,4vw,40px);font-weight:800;letter-spacing:-.02em;margin:0 0 12px;}
.dev-hero p{font-size:16px;color:var(--mut);max-width:620px;line-height:1.6;}
.dev-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:30px 0;}
.dev-step{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;}
.dev-step .n{width:28px;height:28px;border-radius:8px;background:var(--brand-soft);color:var(--brand-d);font-weight:800;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:12px;}
.dev-step h3{margin:0 0 6px;font-size:15px;}
.dev-step p{margin:0;font-size:13.5px;color:var(--mut);line-height:1.5;}
.code{background:#12141C;color:#E6E8F0;border-radius:14px;padding:20px 22px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.65;overflow:auto;}
.code .c{color:#7C8296;}
.code .k{color:#C99BFF;}
.code .s{color:#9BE0A0;}

/* modal */
.modal-bg{position:fixed;inset:0;background:rgba(20,22,34,.5);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px;}
.modal{background:#fff;border-radius:18px;max-width:440px;width:100%;padding:26px;box-shadow:0 30px 70px rgba(0,0,0,.3);}
.modal h3{margin:0 0 6px;font-size:19px;font-weight:800;}
.modal p{color:var(--mut);font-size:14px;line-height:1.55;margin:0 0 18px;}
.modal-tool{display:flex;align-items:center;gap:11px;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:16px;}
.modal-row{display:flex;justify-content:space-between;font-size:14px;padding:7px 0;}
.modal-total{display:flex;justify-content:space-between;font-size:16px;font-weight:800;padding:12px 0 4px;border-top:1px solid var(--line);margin-top:6px;}
.modal-actions{display:flex;gap:10px;margin-top:20px;}
.modal-actions .btn{flex:1;justify-content:center;}
.modal-fine{font-size:11.5px;color:var(--faint);text-align:center;margin-top:12px;}
.scope-list{display:flex;flex-direction:column;gap:8px;margin-bottom:8px;}
.scope-item{display:flex;align-items:center;gap:9px;font-size:13.5px;color:#374050;}

/* footer */
.ftr{border-top:1px solid var(--line);padding:30px 0;margin-top:20px;color:var(--faint);font-size:13px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;}

@media(max-width:860px){
  .grid,.dev-steps{grid-template-columns:1fr 1fr;}
  .stat-row,.dev-config{grid-template-columns:1fr 1fr;}
  .detail-body{grid-template-columns:1fr;}
  .split{grid-template-columns:1fr;}.split-side{border-right:none;border-bottom:1px solid var(--line);padding-right:0;padding-bottom:16px;}
  .barrow{grid-template-columns:110px 1fr 84px;}
}
@media(max-width:560px){
  .grid,.dev-steps,.stat-row,.dev-config{grid-template-columns:1fr;}
  .nav{display:none;}
}
`;
