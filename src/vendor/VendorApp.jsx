import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const VENDOR = { name:"Shree Kirana Store", area:"Station Road, Nagpur", upi:"shreekirana@upi" };
const SLA_SECONDS = 300;
const ADD_PRESETS = [5,10,20,50];
const PLATFORM_FEE_PCT = 0.05;
const fmt = (n) => "₹" + Number(n).toFixed(0);

const INITIAL_PRODUCTS = [
  { id:1,  name:"Amul Full Cream Milk",   sku:"DRY001", unit:"500ml",  price:28,  category:"Dairy",        stock:4,  safetyStock:12, reorderPt:8,  avgDaily:6.2, fastMoving:true,  listed:true,  image:"🥛" },
  { id:2,  name:"Parle-G Biscuits",        sku:"SNK001", unit:"800g",   price:50,  category:"Snacks",       stock:22, safetyStock:15, reorderPt:10, avgDaily:7.8, fastMoving:true,  listed:true,  image:"🍪" },
  { id:3,  name:"Britannia Bread",         sku:"ESS001", unit:"400g",   price:45,  category:"Essentials",   stock:6,  safetyStock:10, reorderPt:6,  avgDaily:5.4, fastMoving:true,  listed:true,  image:"🍞" },
  { id:4,  name:"Fortune Sunflower Oil",   sku:"ESS002", unit:"1L",     price:149, category:"Essentials",   stock:0,  safetyStock:6,  reorderPt:4,  avgDaily:2.8, fastMoving:false, listed:false, image:"🫙" },
  { id:5,  name:"Maggi Noodles",           sku:"INS001", unit:"4-pack", price:68,  category:"Instant Food", stock:18, safetyStock:12, reorderPt:8,  avgDaily:6.9, fastMoving:true,  listed:true,  image:"🍜" },
  { id:6,  name:"Tata Salt",               sku:"ESS003", unit:"1kg",    price:26,  category:"Essentials",   stock:3,  safetyStock:8,  reorderPt:5,  avgDaily:2.1, fastMoving:false, listed:true,  image:"🧂" },
  { id:7,  name:"Coca-Cola",               sku:"BEV001", unit:"750ml",  price:40,  category:"Beverages",    stock:0,  safetyStock:10, reorderPt:6,  avgDaily:3.9, fastMoving:false, listed:false, image:"🥤" },
  { id:8,  name:"Dettol Handwash",         sku:"PRC001", unit:"250ml",  price:89,  category:"Personal Care",stock:8,  safetyStock:6,  reorderPt:4,  avgDaily:1.5, fastMoving:false, listed:true,  image:"🧴" },
  { id:9,  name:"Haldiram's Aloo Bhujia", sku:"SNK002", unit:"200g",   price:55,  category:"Snacks",       stock:5,  safetyStock:10, reorderPt:6,  avgDaily:4.1, fastMoving:true,  listed:true,  image:"🟡" },
  { id:10, name:"Amul Butter",             sku:"DRY002", unit:"100g",   price:58,  category:"Dairy",        stock:14, safetyStock:8,  reorderPt:5,  avgDaily:3.3, fastMoving:false, listed:true,  image:"🧈" },
  { id:11, name:"Nescafé Classic",         sku:"BEV002", unit:"50g",    price:119, category:"Beverages",    stock:7,  safetyStock:6,  reorderPt:4,  avgDaily:2.2, fastMoving:false, listed:true,  image:"☕" },
  { id:12, name:"Vim Bar",                 sku:"HLD001", unit:"200g",   price:32,  category:"Household",    stock:0,  safetyStock:8,  reorderPt:4,  avgDaily:1.8, fastMoving:false, listed:false, image:"🫧" },
  { id:13, name:"Poha",                    sku:"ESS004", unit:"500g",   price:38,  category:"Essentials",   stock:11, safetyStock:8,  reorderPt:5,  avgDaily:2.6, fastMoving:false, listed:true,  image:"🍚" },
  { id:14, name:"Good Day Cookies",        sku:"SNK003", unit:"150g",   price:30,  category:"Snacks",       stock:3,  safetyStock:8,  reorderPt:5,  avgDaily:3.4, fastMoving:true,  listed:true,  image:"🍪" },
  { id:15, name:"Clinic Plus Shampoo",     sku:"PRC002", unit:"80ml",   price:35,  category:"Personal Care",stock:9,  safetyStock:6,  reorderPt:4,  avgDaily:1.2, fastMoving:false, listed:true,  image:"🧴" },
  { id:16, name:"Sprite",                  sku:"BEV003", unit:"1L",     price:55,  category:"Beverages",    stock:16, safetyStock:8,  reorderPt:5,  avgDaily:2.9, fastMoving:false, listed:true,  image:"🫙" },
];

const SEED_ORDERS = [
  { id:"BLK904321", status:"new",      placedAt:new Date(Date.now()-55000),  area:"Lal Bagh",   landmark:"Near SBI ATM", payment:"COD",    checkedItems:{}, items:[{productId:2,qty:2},{productId:1,qty:3},{productId:5,qty:1},{productId:6,qty:1}] },
  { id:"BLK904298", status:"accepted", placedAt:new Date(Date.now()-195000), area:"Civil Lines",landmark:"Opp. D-Mart",  payment:"Online", checkedItems:{}, items:[{productId:3,qty:2},{productId:14,qty:4},{productId:10,qty:1}] },
];

const COMPLETED_SEED = [
  { id:"BLK903010", status:"delivered", placedAt:new Date(Date.now()-5400000),  area:"Sadar",      payment:"Online", items:[{productId:1,qty:2},{productId:5,qty:2}], refund:null },
  { id:"BLK903089", status:"delivered", placedAt:new Date(Date.now()-7200000),  area:"Gandhibagh", payment:"COD",    items:[{productId:2,qty:3},{productId:6,qty:1}], refund:null },
  { id:"BLK903120", status:"refunded",  placedAt:new Date(Date.now()-8100000),  area:"Sitabuldi",  payment:"Online", items:[{productId:3,qty:1}], refund:{reason:"Wrong item delivered",amount:45} },
  { id:"BLK903201", status:"delivered", placedAt:new Date(Date.now()-10800000), area:"Dhantoli",   payment:"COD",    items:[{productId:14,qty:2},{productId:8,qty:1}],refund:null },
];

const ISSUES = [
  { id:"out_of_stock",label:"Item out of stock",icon:"📦"},
  { id:"wrong_qty",   label:"Can't fulfill quantity",icon:"🔢"},
  { id:"damaged",     label:"Item damaged / expired",icon:"🚫"},
  { id:"other",       label:"Other issue",icon:"💬"},
];

const getStockStatus  = (p) => p.stock===0?"out":p.stock<=p.reorderPt?"low":p.stock<=p.safetyStock?"warn":"ok";
const suggestReorder  = (p) => Math.max(0,Math.round(p.avgDaily*7-p.stock));
const calcOrderTotal  = (o,prods) => o.items.reduce((s,it)=>{const p=prods.find(x=>x.id===it.productId);return s+(p?p.price*it.qty:0);},0);
const fmtTime         = (d) => d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;}
body{font-family:'DM Sans',-apple-system,sans-serif;background:#EBEBEA;}
:root{
  --or:#F97316;--or-d:#EA6C10;--or-l:#FFF4ED;--or-b:#FED7AA;
  --gr:#16A34A;--gr-l:#DCFCE7;--gr-d:#15803D;
  --rd:#DC2626;--rd-l:#FEE2E2;--rd-d:#B91C1C;
  --yw:#D97706;--yw-l:#FFFBEB;--yw-b:#FDE68A;
  --pu:#7C3AED;--pu-l:#EDE9FE;
  --bl:#0369A1;--bl-l:#F0F9FF;--bl-b:#BAE6FD;
  --t1:#0D0D0D;--t2:#5C5C5C;--t3:#A8A8A8;
  --bd:#E0DED9;--bg:#F6F5F2;--wh:#fff;
  --r:14px;--rs:10px;
  --sh:0 1px 4px rgba(0,0,0,.07);
  --fd:'Syne',sans-serif;
}
.vapp{max-width:520px;margin:0 auto;min-height:100vh;background:#EBEBEA;display:flex;flex-direction:column;}
.ghdr{background:var(--t1);padding:14px 16px 0;position:sticky;top:0;z-index:200;}
.ghr1{display:flex;align-items:center;gap:10px;margin-bottom:13px;}
.ghs{flex:1;}.ghn{font-family:var(--fd);font-size:17px;font-weight:800;color:#fff;letter-spacing:-.3px;}
.gha{font-size:11px;color:#6B7280;margin-top:1px;}
.ghrt{display:flex;align-items:center;gap:8px;}
.nbt2{width:36px;height:36px;border-radius:10px;background:#1F2937;display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;border:none;position:relative;}
.ndot2{position:absolute;top:5px;right:5px;width:8px;height:8px;background:var(--or);border-radius:50%;border:2px solid var(--t1);}
.otog{display:flex;align-items:center;gap:7px;background:#1F2937;border-radius:20px;padding:5px 11px 5px 7px;cursor:pointer;}
.tkw{width:34px;height:19px;border-radius:10px;background:#374151;position:relative;transition:background .2s;flex-shrink:0;}
.tkw.on{background:var(--gr);}
.tk{position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .2s;}
.tkw.on .tk{transform:translateX(15px);}
.tll{font-size:11px;font-weight:600;color:#9CA3AF;}.tll.on{color:#6EE7B7;}
.ntabs{display:flex;background:var(--t1);padding:0 16px 14px;gap:6px;}
.ntab{flex:1;height:38px;border-radius:9px;border:none;font-family:var(--fd);font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:5px;}
.ntab.active{background:var(--or);color:#fff;}
.ntab:not(.active){background:#1F2937;color:#6B7280;}
.nbdg{background:rgba(255,255,255,.25);color:#fff;font-size:10px;font-weight:800;min-width:17px;height:17px;border-radius:8px;padding:0 3px;display:flex;align-items:center;justify-content:center;}
.ntab:not(.active) .nbdg{background:#374151;color:#9CA3AF;}
.idot2{width:7px;height:7px;border-radius:50%;background:var(--rd);}
.offline-ov{position:fixed;inset:0;background:var(--t1);z-index:500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:32px;}
.ov-ic{font-size:52px;margin-bottom:6px;}.ov-ti{font-family:var(--fd);font-size:22px;font-weight:800;color:#fff;text-align:center;}
.ov-su{font-size:14px;color:#9CA3AF;text-align:center;line-height:1.5;}
.btn-goon{margin-top:16px;height:54px;width:100%;background:var(--or);color:#fff;border:none;border-radius:var(--r);font-family:var(--fd);font-size:16px;font-weight:700;cursor:pointer;}
.ordwrap{flex:1;overflow-y:auto;padding-bottom:12px;}
.ostbar{background:var(--t1);padding:0 16px 14px;display:flex;gap:7px;}
.ost{flex:1;background:#1F2937;border-radius:8px;padding:8px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;}
.osn{font-family:var(--fd);font-size:18px;font-weight:800;color:#fff;}.osn.or{color:var(--or);}.osn.gr{color:#6EE7B7;}
.osl{font-size:9px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.4px;}
@keyframes pab{0%,100%{opacity:1}50%{opacity:.85}}
.newban{margin:12px 13px 0;padding:12px 14px;background:var(--or);border-radius:var(--r);display:flex;align-items:center;gap:11px;animation:pab 1.6s ease-in-out infinite;box-shadow:0 4px 16px rgba(249,115,22,.4);}
.nbi{font-size:22px;}.nbt{font-family:var(--fd);font-size:14px;font-weight:700;color:#fff;}
.nbs{font-size:11px;color:rgba(255,255,255,.8);margin-top:1px;}
.nbc{margin-left:auto;background:rgba(255,255,255,.22);color:#fff;font-family:var(--fd);font-size:20px;font-weight:800;width:40px;height:40px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.seclbl{font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;padding:12px 16px 6px;}
.ocard2{margin:0 13px 10px;background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;border:2px solid transparent;transition:border-color .2s;}
.ocard2.isnew{border-color:var(--or);}.ocard2.isbreach{border-color:var(--rd);}
.ochdx{padding:10px 13px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #F3F2EF;}
.ocidx{font-family:var(--fd);font-size:13px;font-weight:700;color:var(--t1);}
.ocsp{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;}
.ocsp.new{background:#FFF0E6;color:var(--or-d);}.ocsp.accepted{background:var(--yw-l);color:var(--yw);}
.ocsp.packing{background:var(--pu-l);color:var(--pu);}.ocsp.waiting_rider{background:var(--gr-l);color:var(--gr-d);}
.slax{display:flex;flex-direction:column;align-items:flex-end;margin-left:auto;}
.slnx{font-family:var(--fd);font-size:15px;font-weight:800;}
.slnx.ok{color:var(--gr);}.slnx.warn{color:var(--yw);}.slnx.breach{color:var(--rd);animation:blk .8s ease-in-out infinite;}
@keyframes blk{0%,100%{opacity:1}50%{opacity:.4}}
.slsx{font-size:9px;color:var(--t3);text-align:right;}
.ocmx{padding:9px 13px;display:flex;align-items:center;gap:8px;background:var(--bg);}
.oclx{font-size:13px;font-weight:600;color:var(--t1);flex:1;}.oclmx{font-size:11px;color:var(--t2);}
.ppx{font-size:11px;font-weight:700;padding:4px 9px;border-radius:6px;}
.ppx.cod{background:#FEF3C7;color:#92400E;}.ppx.online{background:var(--gr-l);color:var(--gr-d);}
.ilst2{padding:4px 13px 8px;}
.irowx{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F3F2EF;cursor:pointer;transition:opacity .15s;}
.irowx:last-child{border-bottom:none;}.irowx.ck2{opacity:.5;}.irowx.dis2{cursor:default;}
.icbx{width:26px;height:26px;border-radius:7px;border:2.5px solid var(--bd);background:var(--wh);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.icbx.on{background:var(--gr);border-color:var(--gr);}
.ickx{color:#fff;font-size:13px;}.iemx{font-size:20px;flex-shrink:0;}.iinx{flex:1;}
.inmx{font-size:13px;font-weight:700;color:var(--t1);}.iunx{font-size:11px;color:var(--t2);}
.irx{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
.iqx{font-family:var(--fd);font-size:14px;font-weight:800;color:var(--t1);}
.istx{font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;}
.istx.ok{background:var(--gr-l);color:var(--gr-d);}.istx.low{background:var(--yw-l);color:#92400E;}.istx.out{background:var(--rd-l);color:var(--rd-d);}
.fstx{font-size:9px;font-weight:700;background:#FFF0E6;color:var(--or-d);padding:2px 5px;border-radius:4px;}
.pgwx{padding:0 13px 9px;}
.pgbx{height:5px;background:var(--bg);border-radius:3px;overflow:hidden;}
.pgfx{height:100%;background:var(--or);border-radius:3px;transition:width .3s;}.pgfx.dn{background:var(--gr);}
.pglx{font-size:10px;color:var(--t3);margin-top:4px;}
.wtcx{margin:5px 13px;background:var(--bl-l);border:1.5px solid var(--bl-b);border-radius:var(--rs);padding:10px 13px;display:flex;align-items:center;gap:8px;}
.wttx{font-size:13px;font-weight:600;color:var(--bl);}.wtsx{font-size:11px;color:#0EA5E9;margin-top:1px;}
.rdcx{margin:5px 13px;background:var(--gr-l);border:1.5px solid #86EFAC;border-radius:var(--rs);padding:10px 13px;display:flex;align-items:center;gap:8px;}
.rdnx{font-size:13px;font-weight:700;color:var(--gr-d);}.rdvx{font-size:11px;color:var(--gr);margin-top:1px;}
.cactx{padding:9px 13px 12px;display:flex;flex-direction:column;gap:7px;border-top:1px solid #F5F4F1;}
.bacx{width:100%;height:48px;background:var(--or);color:#fff;font-family:var(--fd);font-size:14px;font-weight:700;border:none;border-radius:var(--r);cursor:pointer;}
.bacx:active{background:var(--or-d);}
.bstx{width:100%;height:48px;background:var(--pu);color:#fff;font-family:var(--fd);font-size:14px;font-weight:700;border:none;border-radius:var(--r);cursor:pointer;}
.bpkx{width:100%;height:52px;background:var(--gr);color:#fff;font-family:var(--fd);font-size:15px;font-weight:800;border:none;border-radius:var(--r);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;}
.bpkx:disabled{background:#D1D5DB;cursor:not-allowed;}.bpkx:not(:disabled):active{background:var(--gr-d);}
.scax{display:flex;gap:7px;}
.bisx{flex:1;height:40px;border:1.5px solid var(--bd);border-radius:var(--rs);background:var(--wh);font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:4px;}
.eordx{display:flex;flex-direction:column;align-items:center;padding:52px 24px;text-align:center;gap:7px;}
.eoix{font-size:44px;opacity:.5;margin-bottom:3px;}.eotx{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--t2);}
.eosx{font-size:13px;color:var(--t3);line-height:1.5;}
/* INVENTORY */
.invwrap{flex:1;overflow-y:auto;}
.invhdr{background:var(--t1);padding:0 16px 14px;}
.invhr{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.invht{font-family:var(--fd);font-size:17px;font-weight:800;color:#fff;flex:1;letter-spacing:-.3px;}
.syncb{display:flex;align-items:center;gap:5px;background:#1F2937;border-radius:20px;padding:5px 10px;cursor:pointer;}
.syncd{width:7px;height:7px;border-radius:50%;background:#6EE7B7;flex-shrink:0;}
.syncd.stale{background:var(--yw-b);}.syncd.err{background:#FCA5A5;}
.synct{font-size:11px;color:#9CA3AF;}.synci{font-size:12px;color:#6B7280;}
.invsrch{display:flex;align-items:center;gap:8px;background:#1F2937;border-radius:9px;padding:10px 12px;}
.invsrch input{border:none;background:transparent;font-size:14px;flex:1;outline:none;font-family:inherit;color:#E5E7EB;}
.invsrch input::placeholder{color:#6B7280;}
.invsc{font-size:15px;color:#6B7280;cursor:pointer;}
.invtabs{display:flex;background:var(--t1);padding:0 16px 14px;gap:5px;}
.invtab{flex:1;height:35px;border-radius:8px;border:none;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;}
.invtab.active{background:var(--or);color:#fff;}.invtab:not(.active){background:#1F2937;color:#9CA3AF;}
.invtab .tc{font-size:9px;margin-left:3px;opacity:.75;}
.alrtbar{background:var(--rd);padding:10px 15px;display:flex;align-items:center;gap:9px;}
.altxt{font-size:13px;font-weight:600;color:#fff;flex:1;}
.alcta{font-size:11px;font-weight:700;color:#fff;background:rgba(255,255,255,.2);padding:5px 11px;border-radius:6px;cursor:pointer;border:none;font-family:inherit;}
.invstats{display:flex;gap:7px;padding:11px 13px 4px;}
.invsc2{flex:1;background:var(--wh);border-radius:9px;padding:9px 6px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:var(--sh);}
.invn{font-family:var(--fd);font-size:19px;font-weight:800;color:var(--t1);}
.invn.rd{color:var(--rd);}.invn.yw{color:var(--yw);}.invn.or{color:var(--or);}.invn.gr{color:var(--gr);}
.invl{font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.4px;}
.invrow{background:var(--wh);margin:0 11px 8px;border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;border-left:4px solid transparent;}
.invmain{display:flex;align-items:center;gap:10px;padding:12px 13px;}
.invinfo{flex:1;min-width:0;}
.invname{font-size:14px;font-weight:700;color:var(--t1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.invmeta{display:flex;align-items:center;gap:5px;margin-top:3px;}
.invunit{font-size:11px;color:var(--t2);}.invsku{font-size:10px;color:var(--t3);}
.fastbdg{font-size:9px;font-weight:700;background:#FFF0E6;color:var(--or-d);padding:2px 5px;border-radius:4px;}
.unlistb{font-size:9px;font-weight:700;background:#F3F4F6;color:var(--t3);padding:2px 5px;border-radius:4px;}
.invright{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
.invstk{font-family:var(--fd);font-size:21px;font-weight:800;line-height:1;}
.invstk.rd{color:var(--rd);}.invstk.yw{color:var(--yw);}.invstk.or{color:var(--or);}.invstk.gr{color:var(--gr);}
.invsub{font-size:9px;color:var(--t3);}
.invstag{font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;}
.invstag.out{background:var(--rd-l);color:var(--rd-d);}.invstag.low{background:#FEF3C7;color:#92400E;}
.invstag.warn{background:var(--or-l);color:var(--or-d);}.invstag.ok{background:var(--gr-l);color:var(--gr-d);}
.reordst{background:var(--yw-l);border-top:1px solid var(--yw-b);padding:8px 13px;display:flex;align-items:center;gap:7px;}
.reordt{font-size:12px;font-weight:600;color:#92400E;flex:1;}.reordq{font-family:var(--fd);font-size:13px;font-weight:800;color:#78350F;}
.invacts{padding:9px 13px 11px;display:flex;gap:7px;border-top:1px solid #F5F4F1;}
.btnadd{flex:1;height:40px;background:var(--or);color:#fff;border:none;border-radius:var(--rs);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:4px;}
.btnadd:active{background:var(--or-d);}
.btnoos{flex:1;height:40px;background:transparent;border:1.5px solid var(--bd);border-radius:var(--rs);font-size:12px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;}
.btnrl{flex:1;height:40px;background:var(--gr-l);border:1.5px solid #86EFAC;border-radius:var(--rs);font-size:12px;font-weight:700;color:var(--gr-d);cursor:pointer;font-family:inherit;}
.invempty{display:flex;flex-direction:column;align-items:center;padding:52px 24px;text-align:center;gap:7px;}
.invei{font-size:44px;opacity:.5;margin-bottom:3px;}.invet{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--t2);}
.inves{font-size:13px;color:var(--t3);line-height:1.5;}
/* SALES */
.saleswrap{flex:1;overflow-y:auto;padding-bottom:20px;}
.saleshdr{background:var(--t1);padding:0 16px 14px;}
.saleshr{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
.salesht{font-family:var(--fd);font-size:17px;font-weight:800;color:#fff;flex:1;letter-spacing:-.3px;}
.setlbdg{font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;}
.setlbdg.pending{background:#1F2937;color:var(--yw-b);}.setlbdg.processing{background:#1F2937;color:#93C5FD;}.setlbdg.completed{background:rgba(22,163,74,.25);color:#6EE7B7;}
.datetabs{display:flex;gap:6px;}
.datetab{height:32px;padding:0 14px;border-radius:20px;border:none;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;}
.datetab.active{background:var(--or);color:#fff;}.datetab:not(.active){background:#1F2937;color:#6B7280;}
.sumgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 13px 0;}
.sumcard{background:var(--wh);border-radius:var(--r);padding:14px;box-shadow:var(--sh);}
.sumcard.earn{grid-column:1/-1;background:var(--t1);position:relative;overflow:hidden;}
.sumcard.earn::before{content:'';position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:rgba(249,115,22,.12);}
.sclbl{font-size:11px;font-weight:600;color:var(--t3);margin-bottom:6px;}
.sumcard.earn .sclbl{color:#9CA3AF;}
.scval{font-family:var(--fd);font-size:24px;font-weight:800;color:var(--t1);}
.sumcard.earn .scval{font-size:32px;color:var(--or);}
.scsub{font-size:11px;color:var(--t3);margin-top:3px;}.sumcard.earn .scsub{color:#6B7280;}
.deductcard{margin:10px 13px 0;background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.dctog{display:flex;align-items:center;justify-content:space-between;padding:14px;cursor:pointer;}
.dclbl{font-size:13px;font-weight:700;color:var(--t1);}
.dctot{font-size:12px;color:var(--rd);font-weight:600;}
.dcchev{font-size:14px;color:var(--t3);transition:transform .25s;}
.dcchev.open{transform:rotate(180deg);}
.dcbody{border-top:1px solid var(--bd);overflow:hidden;transition:max-height .3s ease;}
.drow{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-bottom:1px solid #F5F4F1;}
.drow:last-child{border-bottom:none;}
.drleft{flex:1;}.drname{font-size:13px;font-weight:600;color:var(--t1);}
.drsub{font-size:11px;color:var(--t3);margin-top:2px;}.dramt{font-size:14px;font-weight:700;color:var(--rd);}
.pccard{margin:10px 13px 0;background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);padding:16px;}
.pctitle{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:12px;}
.pcrow{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.pclbl{font-size:12px;color:var(--t2);}.pcval{font-size:13px;font-weight:600;color:var(--t1);}
.pcst{display:flex;align-items:center;gap:6px;}
.pcdot{width:9px;height:9px;border-radius:50%;}
.pcdot.pending{background:var(--yw);}.pcdot.processing{background:#60A5FA;animation:blk .9s ease-in-out infinite;}.pcdot.completed{background:var(--gr);}
.pctxt{font-size:13px;font-weight:700;}
.pctxt.pending{color:var(--yw);}.pctxt.processing{color:#60A5FA;}.pctxt.completed{color:var(--gr);}
.pcmsg{font-size:12px;color:var(--t2);background:var(--bg);border-radius:8px;padding:9px 12px;margin-top:8px;line-height:1.5;}
.ordlistcard{margin:10px 13px 0;background:var(--wh);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.olchdr{padding:14px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
.olctitle{font-size:13px;font-weight:700;color:var(--t1);}.olcsub{font-size:11px;color:var(--t3);}
.ordrow2{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #F5F4F1;cursor:pointer;}
.ordrow2:last-child{border-bottom:none;}.ordrow2:active{background:var(--bg);}
.orid{font-family:var(--fd);font-size:12px;font-weight:700;color:var(--t1);}
.ortime{font-size:11px;color:var(--t3);}
.ormid{flex:1;}.orarea{font-size:13px;font-weight:600;color:var(--t1);}.orpay{font-size:11px;color:var(--t3);}
.orright{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
.oramt{font-family:var(--fd);font-size:14px;font-weight:800;color:var(--t1);}
.orst{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;}
.orst.delivered{background:var(--gr-l);color:var(--gr-d);}.orst.refunded{background:var(--rd-l);color:var(--rd-d);}
.nosales{display:flex;flex-direction:column;align-items:center;padding:56px 24px;text-align:center;gap:8px;}
.nsic{font-size:48px;opacity:.5;margin-bottom:4px;}.nsti{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--t2);}
.nssu{font-size:13px;color:var(--t3);line-height:1.5;}
/* MODALS */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.52);z-index:400;display:flex;align-items:flex-end;justify-content:center;}
.modal-sh{background:var(--wh);width:100%;max-width:520px;border-radius:20px 20px 0 0;padding:20px 17px 32px;animation:shup .22s ease;}
@keyframes shup{from{transform:translateY(100%)}to{transform:translateY(0)}}
.mhdl{width:36px;height:4px;background:var(--bd);border-radius:2px;margin:0 auto 15px;}
.mtitle{font-family:var(--fd);font-size:17px;font-weight:700;color:var(--t1);margin-bottom:4px;}
.msub{font-size:13px;color:var(--t2);margin-bottom:16px;}
.pregrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:14px;}
.prebtn{height:50px;border-radius:9px;border:2px solid var(--bd);background:var(--wh);font-family:var(--fd);font-size:17px;font-weight:800;color:var(--t1);cursor:pointer;transition:all .15s;}
.prebtn.sel,.prebtn:active{border-color:var(--or);background:var(--or-l);color:var(--or-d);}
.manrow{display:flex;align-items:center;gap:9px;margin-bottom:16px;}
.manlbl{font-size:13px;font-weight:600;color:var(--t2);white-space:nowrap;}
.maninp{flex:1;height:46px;border:1.5px solid var(--bd);border-radius:9px;padding:0 13px;font-size:18px;font-family:var(--fd);font-weight:700;color:var(--t1);outline:none;text-align:center;}
.maninp:focus{border-color:var(--or);}
.btnconf{width:100%;height:50px;background:var(--or);color:#fff;border:none;border-radius:var(--r);font-family:var(--fd);font-size:16px;font-weight:700;cursor:pointer;}
.btnconf:active{background:var(--or-d);}
.btncanc{width:100%;height:42px;background:transparent;border:none;font-size:14px;font-weight:600;color:var(--t2);cursor:pointer;margin-top:7px;font-family:inherit;}
.issopts{display:flex;flex-direction:column;gap:7px;margin-bottom:15px;}
.issopt{padding:13px 15px;border-radius:9px;border:2px solid var(--bd);font-size:14px;font-weight:600;color:var(--t1);cursor:pointer;background:var(--wh);font-family:inherit;text-align:left;display:flex;align-items:center;gap:9px;transition:all .15s;}
.issopt.sel,.issopt:active{border-color:var(--or);background:var(--or-l);}
.btnrep{width:100%;height:50px;background:var(--rd);color:#fff;border:none;border-radius:var(--r);font-family:var(--fd);font-size:15px;font-weight:700;cursor:pointer;}
.toast{position:fixed;bottom:72px;left:50%;transform:translateX(-50%);background:var(--t1);color:#fff;font-size:13px;font-weight:600;padding:10px 19px;border-radius:22px;z-index:600;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.13);animation:tst 2.5s forwards;pointer-events:none;}
@keyframes tst{0%{opacity:0;transform:translateX(-50%) translateY(8px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}75%{opacity:1}100%{opacity:0}}
.demobar{position:sticky;bottom:0;background:#111;padding:9px 13px;display:flex;align-items:center;gap:7px;z-index:300;border-top:1px solid #222;}
.demolbl{font-size:9px;font-weight:700;color:#6B7280;flex-shrink:0;letter-spacing:.5px;}
.demobtns{display:flex;gap:5px;flex-wrap:wrap;}
.demobtn{height:26px;padding:0 9px;border-radius:5px;border:1px solid #333;background:#1F2937;color:#9CA3AF;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;}
.demobtn:active{background:var(--or);border-color:var(--or);color:#fff;}
`;

function SLATimer({ placedAt, status }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now()-placedAt)/1000));
  useEffect(() => {
    if (["packed","waiting_rider"].includes(status)) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now()-placedAt)/1000)), 1000);
    return () => clearInterval(id);
  }, [placedAt, status]);
  const rem = SLA_SECONDS - elapsed;
  const mins = Math.abs(Math.floor(rem/60));
  const secs = Math.abs(rem%60);
  const cls = rem<=0?"breach":rem<=120?"warn":"ok";
  return (
    <div className="slax">
      <span className={`slnx ${cls}`}>{rem<0?"-":""}{mins}:{String(secs).padStart(2,"0")}</span>
      <span className="slsx">{rem<=0?"BREACHED":rem<=120?"Running out":"Pack in"}</span>
    </div>
  );
}

function OrderCard({ order, products, onUpdate, onIssue }) {
  const isPacked  = ["packed","waiting_rider"].includes(order.status);
  const isNew     = order.status === "new";
  const elapsed   = Math.floor((Date.now()-order.placedAt)/1000);
  const isBreach  = SLA_SECONDS-elapsed <= 0;
  const enriched  = order.items.map(it => ({ ...it, product: products.find(p=>p.id===it.productId) }));
  const total     = enriched.length;
  const checked   = Object.values(order.checkedItems||{}).filter(Boolean).length;
  const allOk     = checked === total;
  const spCls     = { new:"new", accepted:"accepted", packing:"packing", packed:"waiting_rider", waiting_rider:"waiting_rider" }[order.status]||"new";
  const spLbl     = { new:"New", accepted:"Accepted", packing:"Packing", packed:"Packed", waiting_rider:"Waiting Rider" }[order.status];
  const toggle    = (pid) => { if (isNew||isPacked) return; onUpdate(order.id, { checkedItems:{...order.checkedItems,[pid]:!order.checkedItems[pid]} }); };
  return (
    <div className={`ocard2 ${isNew?"isnew":""} ${isBreach&&!isPacked?"isbreach":""}`}>
      <div className="ochdx">
        <div><div className="ocidx">#{order.id}</div><span className={`ocsp ${spCls}`}>{spLbl}</span></div>
        <SLATimer placedAt={order.placedAt} status={order.status}/>
      </div>
      <div className="ocmx">
        <div><div className="oclx">📍 {order.area}</div><div className="oclmx">{order.landmark}</div></div>
        <span className={`ppx ${order.payment==="COD"?"cod":"online"}`}>{order.payment==="COD"?"💵 COD":"✅ Paid"}</span>
      </div>
      <div className="ilst2">
        {enriched.map(({productId,qty,product}) => {
          const isChk = !!order.checkedItems[productId];
          const st = product ? getStockStatus(product) : "ok";
          return (
            <div key={productId} className={`irowx ${isChk?"ck2":""} ${isNew||isPacked?"dis2":""}`} onClick={()=>toggle(productId)}>
              <div className={`icbx ${isChk?"on":""}`}>{isChk&&<span className="ickx">✓</span>}</div>
              <span className="iemx">{product?.image||"📦"}</span>
              <div className="iinx"><div className="inmx">{product?.name||`#${productId}`}</div><div className="iunx">{product?.unit}</div></div>
              <div className="irx">
                <span className="iqx">×{qty}</span>
                <div style={{display:"flex",gap:3}}>
                  {product?.fastMoving&&<span className="fstx">⚡</span>}
                  {product&&st!=="ok"&&<span className={`istx ${st}`}>{st==="out"?"OOS":`${product.stock} left`}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {["accepted","packing"].includes(order.status)&&(
        <div className="pgwx">
          <div className="pgbx"><div className={`pgfx ${allOk?"dn":""}`} style={{width:`${(checked/total)*100}%`}}/></div>
          <div className="pglx">{checked} of {total} items checked</div>
        </div>
      )}
      {order.status==="waiting_rider"&&(order.riderAssigned
        ?<div className="rdcx"><span style={{fontSize:22}}>🛵</span><div><div className="rdnx">Rider: {order.riderName}</div><div className="rdvx">🪪 {order.riderVehicle}</div></div></div>
        :<div className="wtcx"><span style={{fontSize:20}}>🔍</span><div><div className="wttx">Waiting for rider…</div><div className="wtsx">Usually 1–2 minutes</div></div></div>
      )}
      <div className="cactx">
        {isNew&&<button className="bacx" onClick={()=>onUpdate(order.id,{status:"accepted"})}>✋ Accept Order</button>}
        {order.status==="accepted"&&<button className="bstx" onClick={()=>onUpdate(order.id,{status:"packing"})}>📦 Start Packing</button>}
        {order.status==="packing"&&(
          <button className="bpkx" disabled={!allOk} onClick={()=>onUpdate(order.id,{status:"packed",packMeta:enriched})}>
            {allOk?<><span>✅</span>Mark as Packed</>:<><span>🔒</span>Check all items first</>}
          </button>
        )}
        {!isPacked&&<div className="scax"><button className="bisx" onClick={()=>onIssue(order.id)}>⚠ Report Issue</button><button className="bisx">📞 Support</button></div>}
      </div>
    </div>
  );
}

function AddStockSheet({ product, onConfirm, onClose }) {
  const [sel, setSel] = useState(null);
  const [manual, setManual] = useState("");
  const qty = manual!==""?(parseInt(manual)||0):sel;
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal-sh" onClick={e=>e.stopPropagation()}>
        <div className="mhdl"/>
        <div className="mtitle">Add Stock — {product.name}</div>
        <div className="msub">Current: <strong>{product.stock}</strong> {product.unit}</div>
        <div className="pregrid">{ADD_PRESETS.map(n=><button key={n} className={`prebtn ${sel===n&&manual===""?"sel":""}`} onClick={()=>{setSel(n);setManual("");}}>+{n}</button>)}</div>
        <div className="manrow"><span className="manlbl">Custom:</span><input className="maninp" type="number" min="1" placeholder="0" value={manual} onChange={e=>{setManual(e.target.value);setSel(null);}}/><span style={{fontSize:12,color:"var(--t3)"}}>{product.unit}</span></div>
        <button className="btnconf" style={{opacity:qty>0?1:.45,cursor:qty>0?"pointer":"default"}} disabled={!qty||qty<=0} onClick={()=>qty>0&&onConfirm(product.id,qty)}>✓ Add {qty||0} units</button>
        <button className="btncanc" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function IssueModal({ orderId, onClose, onConfirm }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="modal-ov" onClick={onClose}>
      <div className="modal-sh" onClick={e=>e.stopPropagation()}>
        <div className="mhdl"/>
        <div className="mtitle">Report Issue — #{orderId}</div>
        <div className="issopts">{ISSUES.map(i=><button key={i.id} className={`issopt ${sel===i.id?"sel":""}`} onClick={()=>setSel(i.id)}><span style={{fontSize:18}}>{i.icon}</span>{i.label}</button>)}</div>
        <button className="btnrep" style={{opacity:sel?1:.45}} disabled={!sel} onClick={()=>sel&&onConfirm(orderId,sel)}>⚠ Confirm Issue</button>
        <button className="btncanc" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function SalesScreen({ completed, products }) {
  const [deductOpen, setDeductOpen] = useState(false);
  const [datePeriod, setDatePeriod] = useState("today");
  const [detailOrd,  setDetailOrd]  = useState(null);
  const delivered = completed.filter(o=>o.status==="delivered");
  const refunded  = completed.filter(o=>o.status==="refunded");
  const grossSales    = completed.reduce((s,o)=>s+calcOrderTotal(o,products),0);
  const totalRefunds  = refunded.reduce((s,o)=>s+(o.refund?.amount||0),0);
  const platformFee   = Math.round((grossSales-totalRefunds)*PLATFORM_FEE_PCT);
  const netEarnings   = grossSales - totalRefunds - platformFee;
  const settleStatus  = netEarnings>2000?"completed":netEarnings>0?"processing":"pending";
  return (
    <div className="saleswrap">
      <div className="saleshdr">
        <div className="saleshr">
          <div className="salesht">Today's Sales</div>
          <span className={`setlbdg ${settleStatus}`}>{settleStatus==="completed"?"✅ Settled":settleStatus==="processing"?"⏳ Processing":"Pending"}</span>
        </div>
        <div className="datetabs">
          {["today","yesterday"].map(d=><button key={d} className={`datetab ${datePeriod===d?"active":""}`} onClick={()=>setDatePeriod(d)}>{d==="today"?"Today":"Yesterday"}</button>)}
        </div>
      </div>
      {completed.length===0
        ?<div className="nosales"><div className="nsic">📊</div><div className="nsti">No sales yet today</div><div className="nssu">Completed orders appear here automatically.</div></div>
        :<>
          <div className="sumgrid">
            <div className="sumcard"><div className="sclbl">Total Orders</div><div className="scval">{completed.length}</div><div className="scsub">{delivered.length} delivered · {refunded.length} refunded</div></div>
            <div className="sumcard"><div className="sclbl">Gross Sales</div><div className="scval">{fmt(grossSales)}</div><div className="scsub">Before deductions</div></div>
            <div className="sumcard earn"><div className="sclbl">Your Net Earnings</div><div className="scval">{fmt(netEarnings)}</div><div className="scsub">After platform fee · {VENDOR.upi}</div></div>
          </div>
          <div className="deductcard">
            <div className="dctog" onClick={()=>setDeductOpen(v=>!v)}>
              <div><div className="dclbl">Deductions</div><div className="dctot">−{fmt(totalRefunds+platformFee)}</div></div>
              <span className={`dcchev ${deductOpen?"open":""}`}>▼</span>
            </div>
            <div className="dcbody" style={{maxHeight:deductOpen?400:0}}>
              <div className="drow"><div className="drleft"><div className="drname">Platform fee (5%)</div><div className="drsub">BLinkeRs commission on net sales</div></div><span className="dramt">−{fmt(platformFee)}</span></div>
              <div className="drow"><div className="drleft"><div className="drname">Delivery handling</div><div className="drsub">Absorbed by BLinkeRs — ₹0 from you</div></div><span className="dramt" style={{color:"var(--gr)"}}>₹0</span></div>
              {totalRefunds>0&&<div className="drow"><div className="drleft"><div className="drname">Refunds & adjustments</div><div className="drsub">{refunded.length} order{refunded.length>1?"s":""} adjusted</div></div><span className="dramt">−{fmt(totalRefunds)}</span></div>}
              <div style={{padding:"12px 14px",background:"var(--bg)",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>Net Earnings</span><span style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800,color:"var(--or)"}}>{fmt(netEarnings)}</span></div>
            </div>
          </div>
          <div className="pccard">
            <div className="pctitle">💳 Payout Status</div>
            <div className="pcrow"><span className="pclbl">Settlement mode</span><span className="pcval">UPI · {VENDOR.upi}</span></div>
            <div className="pcrow"><span className="pclbl">Expected by</span><span className="pcval">{settleStatus==="completed"?"Paid today":"By 11:00 PM today"}</span></div>
            <div className="pcrow" style={{marginBottom:0}}><span className="pclbl">Status</span><div className="pcst"><div className={`pcdot ${settleStatus}`}/><span className={`pctxt ${settleStatus}`}>{settleStatus==="completed"?"Payment sent ✓":settleStatus==="processing"?"Processing…":"Pending"}</span></div></div>
            <div className="pcmsg">{settleStatus==="completed"?"✅ Your earnings have been sent to your UPI.":settleStatus==="processing"?"Your payment is being processed. It will reach your UPI by end of day.":"Payments are processed daily at 9:00 PM. Your earnings are safe."}</div>
          </div>
          <div className="ordlistcard">
            <div className="olchdr"><span className="olctitle">All Orders</span><span className="olcsub">{completed.length} completed</span></div>
            {completed.map(o=>{
              const amt=calcOrderTotal(o,products);
              return(
                <div key={o.id} className="ordrow2" onClick={()=>setDetailOrd(o)}>
                  <div><div className="orid">#{o.id}</div><div className="ortime">{fmtTime(o.placedAt)}</div></div>
                  <div className="ormid"><div className="orarea">{o.area}</div><div className="orpay">{o.payment}</div></div>
                  <div className="orright"><span className="oramt">{fmt(amt)}</span><span className={`orst ${o.status}`}>{o.status==="delivered"?"Completed":"Refunded"}</span></div>
                </div>
              );
            })}
          </div>
        </>
      }
      {detailOrd&&(
        <div className="modal-ov" onClick={()=>setDetailOrd(null)}>
          <div className="modal-sh" onClick={e=>e.stopPropagation()}>
            <div className="mhdl"/>
            <div className="mtitle">#{detailOrd.id}</div>
            <div className="msub">{fmtTime(detailOrd.placedAt)} · {detailOrd.area} · {detailOrd.payment}</div>
            {detailOrd.items.map((it,i)=>{const p=products.find(x=>x.id===it.productId);return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #F5F4F1"}}>
                <span style={{fontSize:20}}>{p?.image||"📦"}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{p?.name}</div><div style={{fontSize:11,color:"var(--t2)"}}>{p?.unit}</div></div>
                <span style={{fontSize:12,color:"var(--t2)"}}>×{it.qty}</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t1)"}}>{fmt((p?.price||0)*it.qty)}</span>
              </div>
            );})}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:14,fontWeight:700,color:"var(--t1)"}}><span>Total</span><span>{fmt(calcOrderTotal(detailOrd,products))}</span></div>
            {detailOrd.refund&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:600,color:"var(--rd)"}}><span>Adjustment</span><span>−{fmt(detailOrd.refund.amount)}</span></div>}
            <button className="btncanc" onClick={()=>setDetailOrd(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorApp() {
  const [tab,        setTab]      = useState("orders");
  const [isOnline,   setIsOnline] = useState(true);
  const [products,   setProducts] = useState(INITIAL_PRODUCTS);
  const [orders,     setOrders]   = useState(SEED_ORDERS.map(o=>({...o,checkedItems:{}})));
  const [completed,  setCompleted]= useState(COMPLETED_SEED);
  const [issueId,    setIssueId]  = useState(null);
  const [adding,     setAdding]   = useState(null);
  const [toast,      setToast]    = useState(null);
  const [lastSync,   setLastSync] = useState(new Date(Date.now()-11*60000));
  const [syncErr,    setSyncErr]  = useState(false);
  const [invTab,     setInvTab]   = useState("low");
  const [invSrch,    setInvSrch]  = useState("");
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(null);
    requestAnimationFrame(() => {
      setToast(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2600);
    });
  }, []);

  const updateOrder = useCallback((id, patch) => {
    if (patch.status==="packed" && patch.packMeta) {
      setProducts(prev => prev.map(p => {
        const it = patch.packMeta.find(x=>x.productId===p.id);
        if (!it) return p;
        const ns = Math.max(0, p.stock - it.qty);
        return { ...p, stock:ns, listed:ns>0?p.listed:false };
      }));
      showToast("Order packed ✅ — inventory updated");
      setTimeout(() => {
        setOrders(prev => prev.map(o => o.id===id ? {...o, status:"waiting_rider", riderName:"Suresh K.", riderVehicle:"MH31 AB 1234"} : o));
      }, 80);
      setTimeout(() => {
        setOrders(prev => prev.map(o => o.id===id ? {...o, riderAssigned:true} : o));
        showToast("Rider assigned 🛵");
      }, 3500);
      const ord = orders.find(o=>o.id===id);
      if (ord) {
        const total = calcOrderTotal(ord, products);
        setTimeout(() => {
          setCompleted(prev => [{...ord, status:"delivered", refund:null}, ...prev]);
          showToast("💰 Sale recorded");
        }, 4000);
      }
    } else {
      if (patch.status==="accepted") showToast("Order accepted ✓");
      if (patch.status==="packing")  showToast("Packing started — check off items");
    }
    setOrders(prev => prev.map(o => o.id===id ? {...o,...patch} : o));
  }, [orders, products, showToast]);

  const handleAddStock = useCallback((id, qty) => {
    setProducts(prev => prev.map(p => p.id===id ? {...p, stock:p.stock+qty, listed:true} : p));
    const p = products.find(x=>x.id===id);
    showToast(`✓ Added ${qty} units · ${p?.name}`);
  }, [products, showToast]);

  const handleMarkOOS = useCallback((id) => {
    setProducts(prev => prev.map(p => p.id===id ? {...p, stock:0, listed:false} : p));
    const p = products.find(x=>x.id===id);
    showToast(`🚫 ${p?.name} marked OOS`);
  }, [products, showToast]);

  const handleRelist = useCallback((id) => {
    setProducts(prev => prev.map(p => p.id===id ? {...p, listed:true} : p));
    const p = products.find(x=>x.id===id);
    showToast(`✅ ${p?.name} relisted`);
  }, [products, showToast]);

  const handleIssue = useCallback((ordId, type) => {
    setIssueId(null);
    showToast(`Issue reported: ${ISSUES.find(i=>i.id===type)?.label}`);
  }, [showToast]);

  const newCount  = orders.filter(o=>o.status==="new").length;
  const lowCount  = products.filter(p=>["low","warn","out"].includes(getStockStatus(p))).length;
  const inProg    = orders.filter(o=>["accepted","packing"].includes(o.status));
  const waiting   = orders.filter(o=>o.status==="waiting_rider");
  const minsAgo   = Math.floor((Date.now()-lastSync)/60000);

  const iCts = useMemo(() => ({
    all:  products.length,
    low:  products.filter(p=>["low","warn","out"].includes(getStockStatus(p))).length,
    fast: products.filter(p=>p.fastMoving).length,
    out:  products.filter(p=>getStockStatus(p)==="out").length,
  }), [products]);

  const iFilt = useMemo(() => {
    let l = products;
    if (invSrch.trim()) { const q=invSrch.toLowerCase(); l=l.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)); }
    if (invTab==="low")  l = l.filter(p=>["low","warn","out"].includes(getStockStatus(p)));
    if (invTab==="fast") l = l.filter(p=>p.fastMoving);
    if (invTab==="out")  l = l.filter(p=>getStockStatus(p)==="out");
    const o={out:0,low:1,warn:2,ok:3};
    return [...l].sort((a,b)=>{const d=o[getStockStatus(a)]-o[getStockStatus(b)];return d!==0?d:(b.fastMoving?1:0)-(a.fastMoving?1:0);});
  }, [products, invTab, invSrch]);

  const addNewOrder = () => {
    const o = { id:"BLK"+Math.floor(900000+Math.random()*99999), status:"new", placedAt:new Date(), area:"Dharampeth", landmark:"Near CCD", payment:"Online", checkedItems:{}, items:[{productId:14,qty:3},{productId:10,qty:1},{productId:16,qty:2}] };
    setOrders(prev=>[o,...prev]);
    showToast("🔔 New order received!");
  };

  return (
    <>
      <style>{css}</style>
      <div className="vapp">
        {!isOnline && (
          <div className="offline-ov">
            <div className="ov-ic">🔕</div>
            <div className="ov-ti">Store is Offline</div>
            <div className="ov-su">You won't receive new orders while offline.</div>
            <button className="btn-goon" onClick={()=>setIsOnline(true)}>Go Online →</button>
          </div>
        )}
        <div className="ghdr">
          <div className="ghr1">
            <div className="ghs"><div className="ghn">{VENDOR.name}</div><div className="gha">{VENDOR.area}</div></div>
            <div className="ghrt">
              <button className="nbt2">{newCount>0&&<span className="ndot2"/>}🔔</button>
              <div className="otog" onClick={()=>setIsOnline(v=>!v)}>
                <div className={`tkw ${isOnline?"on":""}`}><div className="tk"/></div>
                <span className={`tll ${isOnline?"on":""}`}>{isOnline?"Online":"Offline"}</span>
              </div>
            </div>
          </div>
          <div className="ntabs">
            <button className={`ntab ${tab==="orders"?"active":""}`} onClick={()=>setTab("orders")}>
              📋 Orders{newCount>0&&<span className="nbdg">{newCount}</span>}
            </button>
            <button className={`ntab ${tab==="inventory"?"active":""}`} onClick={()=>setTab("inventory")}>
              📦 Inventory{lowCount>0&&tab!=="inventory"&&<span className="idot2"/>}
            </button>
            <button className={`ntab ${tab==="sales"?"active":""}`} onClick={()=>setTab("sales")}>
              💰 Sales{completed.length>0&&<span className="nbdg">{completed.length}</span>}
            </button>
          </div>
        </div>

        {tab==="orders" && (
          <div className="ordwrap">
            <div className="ostbar">
              <div className="ost"><span className={`osn ${newCount>0?"or":""}`}>{newCount}</span><span className="osl">New</span></div>
              <div className="ost"><span className="osn">{inProg.length}</span><span className="osl">Packing</span></div>
              <div className="ost"><span className={`osn ${waiting.length>0?"gr":""}`}>{waiting.length}</span><span className="osl">Packed</span></div>
              <div className="ost"><span className="osn" style={{color:"#6B7280"}}>{orders.length}</span><span className="osl">Today</span></div>
            </div>
            {newCount>0&&isOnline&&<div className="newban"><span className="nbi">🔔</span><div><div className="nbt">New Order{newCount>1?"s":""} Received!</div><div className="nbs">Accept & pack within 5 mins</div></div><div className="nbc">{newCount}</div></div>}
            {orders.length===0
              ?<div className="eordx"><div className="eoix">🛒</div><div className="eotx">No orders right now</div><div className="eosx">New orders appear instantly.</div></div>
              :<>
                {orders.filter(o=>o.status==="new").length>0&&<><div className="seclbl">⚡ New — Accept immediately</div>{orders.filter(o=>o.status==="new").map(o=><OrderCard key={o.id} order={o} products={products} onUpdate={updateOrder} onIssue={setIssueId}/>)}</>}
                {inProg.length>0&&<><div className="seclbl">📦 Currently packing</div>{inProg.map(o=><OrderCard key={o.id} order={o} products={products} onUpdate={updateOrder} onIssue={setIssueId}/>)}</>}
                {waiting.length>0&&<><div className="seclbl">✅ Packed — awaiting rider</div>{waiting.map(o=><OrderCard key={o.id} order={o} products={products} onUpdate={updateOrder} onIssue={setIssueId}/>)}</>}
              </>
            }
            <div style={{height:12}}/>
          </div>
        )}

        {tab==="inventory" && (
          <div className="invwrap">
            <div className="invhdr">
              <div className="invhr">
                <div className="invht">Inventory</div>
                <div className="syncb" onClick={()=>{setLastSync(new Date());setSyncErr(false);showToast("🔄 Synced");}}>
                  <div className={`syncd ${minsAgo>30?"stale":syncErr?"err":""}`}/>
                  <span className="synct">{minsAgo<1?"Just now":`${minsAgo}m ago`}</span>
                  <span className="synci">↻</span>
                </div>
              </div>
              <div className="invsrch">
                <span style={{fontSize:14,color:"#6B7280"}}>🔍</span>
                <input placeholder="Search product or SKU…" value={invSrch} onChange={e=>setInvSrch(e.target.value)}/>
                {invSrch&&<span className="invsc" onClick={()=>setInvSrch("")}>✕</span>}
              </div>
            </div>
            <div className="invtabs">
              {[["all","All",iCts.all],["low","Low Stock",iCts.low],["fast","Fast Moving",iCts.fast],["out","Out of Stock",iCts.out]].map(([k,l,c])=>(
                <button key={k} className={`invtab ${invTab===k?"active":""}`} onClick={()=>setInvTab(k)}>{l}<span className="tc">({c})</span></button>
              ))}
            </div>
            {iCts.low>0&&invTab!=="low"&&<div className="alrtbar"><span style={{fontSize:14}}>🔴</span><span className="altxt">{iCts.low} items need restocking</span><button className="alcta" onClick={()=>setInvTab("low")}>View Now</button></div>}
            <div className="invstats">
              <div className="invsc2"><span className={`invn ${iCts.out>0?"rd":""}`}>{iCts.out}</span><span className="invl">Out</span></div>
              <div className="invsc2"><span className={`invn ${products.filter(p=>getStockStatus(p)==="low").length>0?"yw":""}`}>{products.filter(p=>getStockStatus(p)==="low").length}</span><span className="invl">Low</span></div>
              <div className="invsc2"><span className={`invn ${products.filter(p=>getStockStatus(p)==="warn").length>0?"or":""}`}>{products.filter(p=>getStockStatus(p)==="warn").length}</span><span className="invl">Reorder</span></div>
              <div className="invsc2"><span className="invn gr">{products.filter(p=>getStockStatus(p)==="ok").length}</span><span className="invl">Healthy</span></div>
            </div>
            {iFilt.length===0
              ?<div className="invempty"><div className="invei">{invSrch?"🔍":"✅"}</div><div className="invet">{invSrch?"No results":"All clear!"}</div><div className="inves">{invSrch?`No results for "${invSrch}"`:"All products are well stocked."}</div></div>
              :<div style={{paddingBottom:14}}>{iFilt.map(p=>{
                const st=getStockStatus(p),rq=suggestReorder(p);
                const sc=st==="out"?"rd":st==="low"?"yw":st==="warn"?"or":"gr";
                const stTx=st==="out"?"Out of Stock":st==="low"?"Low Stock":st==="warn"?"Reorder Soon":"Healthy";
                const bc=st==="out"?"var(--rd)":st==="low"?"var(--yw)":st==="warn"?"var(--or)":"var(--gr)";
                return(
                  <div key={p.id} className="invrow" style={{borderLeftColor:bc}}>
                    <div className="invmain">
                      <div className="invinfo">
                        <div className="invname">{p.name}</div>
                        <div className="invmeta"><span className="invunit">{p.unit}</span><span className="invsku">{p.sku}</span>{p.fastMoving&&<span className="fastbdg">🔥 Fast</span>}{!p.listed&&<span className="unlistb">Unlisted</span>}</div>
                      </div>
                      <div className="invright">
                        <div className={`invstk ${sc}`}>{p.stock}</div>
                        <div className="invsub">units</div>
                        <span className={`invstag ${st}`}>{stTx}</span>
                      </div>
                    </div>
                    {(st==="low"||st==="warn"||st==="out")&&rq>0&&<div className="reordst"><span style={{fontSize:14}}>📦</span><span className="reordt">Recommended reorder</span><span className="reordq">{rq} units</span></div>}
                    <div className="invacts">
                      <button className="btnadd" onClick={()=>setAdding(p)}>＋ Add Stock</button>
                      {p.listed?(st!=="out"?<button className="btnoos" onClick={()=>handleMarkOOS(p.id)}>🚫 Mark OOS</button>:<button className="btnrl" onClick={()=>handleRelist(p.id)}>✅ Relist</button>):<button className="btnrl" onClick={()=>handleRelist(p.id)}>✅ Relist</button>}
                    </div>
                  </div>
                );
              })}</div>
            }
          </div>
        )}

        {tab==="sales" && <SalesScreen completed={completed} products={products}/>}

        {issueId&&<IssueModal orderId={issueId} onClose={()=>setIssueId(null)} onConfirm={handleIssue}/>}
        {adding&&<AddStockSheet product={adding} onConfirm={handleAddStock} onClose={()=>setAdding(null)}/>}
        {toast&&<div key={toast+Date.now()} className="toast">{toast}</div>}

        <div className="demobar">
          <span className="demolbl">DEMO</span>
          <div className="demobtns">
            <button className="demobtn" onClick={addNewOrder}>+ Order</button>
            <button className="demobtn" onClick={()=>setIsOnline(v=>!v)}>{isOnline?"Offline":"Online"}</button>
            <button className="demobtn" onClick={()=>{const f={id:"BLK"+Math.floor(900000+Math.random()*99999),status:"delivered",placedAt:new Date(Date.now()-Math.random()*3600000),area:"Sitabuldi",landmark:"Near Mall",payment:"COD",items:[{productId:2,qty:2},{productId:5,qty:1}],refund:null};setCompleted(prev=>[f,...prev]);showToast("💰 Sale recorded");}}>+ Sale</button>
            <button className="demobtn" onClick={()=>{setProducts(p=>p.map(x=>({...x,stock:Math.max(0,x.stock-Math.floor(Math.random()*3+1))})));showToast("Stock reduced");}}>Sim Stock</button>
            <button className="demobtn" onClick={()=>{setProducts(INITIAL_PRODUCTS);setOrders(SEED_ORDERS.map(o=>({...o,checkedItems:{}})));setCompleted(COMPLETED_SEED);showToast("Reset complete");}}>Reset</button>
          </div>
        </div>
      </div>
    </>
  );
}
