import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["All","Essentials","Snacks","Beverages","Dairy","Instant Food","Personal Care","Household"];
const PRODUCTS = [
  { id:1,  name:"Amul Full Cream Milk",   unit:"500ml",         price:28,  category:"Dairy",         tag:"Best Seller",  stock:24, avgSales:42, image:"🥛" },
  { id:2,  name:"Britannia Bread",         unit:"400g",          price:45,  category:"Essentials",    tag:"Fast Moving",  stock:18, avgSales:38, image:"🍞" },
  { id:3,  name:"Fortune Sunflower Oil",   unit:"1L",            price:149, category:"Essentials",    tag:"Best Seller",  stock:10, avgSales:31, image:"🫙" },
  { id:4,  name:"Haldiram's Aloo Bhujia", unit:"200g",          price:55,  category:"Snacks",        tag:"Most Ordered", stock:30, avgSales:29, image:"🟡" },
  { id:5,  name:"Parle-G Biscuits",        unit:"800g",          price:50,  category:"Snacks",        tag:"Best Seller",  stock:40, avgSales:55, image:"🍪" },
  { id:6,  name:"Coca-Cola",               unit:"750ml",         price:40,  category:"Beverages",     tag:"Fast Moving",  stock:22, avgSales:27, image:"🥤" },
  { id:7,  name:"Nescafé Classic",         unit:"50g",           price:119, category:"Beverages",     tag:null,           stock:15, avgSales:18, image:"☕" },
  { id:8,  name:"Maggi Noodles",           unit:"2-min, 4 packs",price:68, category:"Instant Food",  tag:"Most Ordered", stock:35, avgSales:48, image:"🍜" },
  { id:9,  name:"Tata Salt",               unit:"1kg",           price:26,  category:"Essentials",    tag:null,           stock:50, avgSales:33, image:"🧂" },
  { id:10, name:"Dettol Handwash",         unit:"250ml",         price:89,  category:"Personal Care", tag:null,           stock:12, avgSales:16, image:"🧴" },
];
const SAVED_ADDRESSES = [
  { id:1, label:"Home", address:"Near Hanuman Mandir, Lal Bagh", landmark:"Opposite SBI ATM",    phone:"9876543210" },
  { id:2, label:"Work", address:"2nd Floor, Shree Complex, Station Road", landmark:"Above Bajaj Showroom", phone:"9876543210" },
];
const STAGES = [
  { key:"placed",    label:"Order Placed",  icon:"📋", msg:"Your order has been placed successfully" },
  { key:"packed",    label:"Being Packed",  icon:"📦", msg:"Vendor is packing your order" },
  { key:"picked",    label:"Picked Up",     icon:"🛵", msg:"Rider is heading to your location" },
  { key:"delivered", label:"Delivered",     icon:"✅", msg:"Delivered successfully! Enjoy 😊" },
];
const STATUS_ORDER = ["placed","packed","picked","delivered"];
const SIM_DELAYS   = [0, 5000, 11000, 18000];
const cartTotal = (cart) => Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>p.id===Number(id)); return s+(p?p.price*q:0); },0);
const cartCount = (cart) => Object.values(cart).reduce((s,v)=>s+v,0);
const fmtTime   = (d) => d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
const genOrderId= () => "BLK"+Math.floor(100000+Math.random()*900000);

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
body{font-family:'DM Sans',-apple-system,sans-serif;background:#EBEBEB;}
:root{--or:#F97316;--or-d:#EA6C10;--or-l:#FFF7ED;--or-b:#FED7AA;--gr:#16A34A;--gr-l:#DCFCE7;--rd:#DC2626;--rd-l:#FEE2E2;--yw:#D97706;--yw-l:#FEF3C7;--t1:#111827;--t2:#6B7280;--t3:#9CA3AF;--bd:#E5E7EB;--bg:#F9FAFB;--wh:#ffffff;--r:14px;--rs:10px;--sh:0 1px 3px rgba(0,0,0,.08);}
.app{max-width:420px;margin:0 auto;min-height:100vh;background:#EBEBEB;position:relative;overflow-x:hidden;}
.lst-header{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid var(--bd);padding:12px 16px 0;}
.lst-row1{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.location-btn{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:600;color:var(--t1);cursor:pointer;}
.del-badge{font-size:11px;color:var(--gr);font-weight:500;background:#F0FDF4;padding:3px 8px;border-radius:20px;}
.cart-btn{position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.cart-badge{position:absolute;top:0;right:0;background:var(--or);color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.search-bar{display:flex;align-items:center;gap:8px;background:#F9FAFB;border:1px solid var(--bd);border-radius:10px;padding:10px 12px;margin-bottom:12px;}
.search-bar input{border:none;background:transparent;font-size:14px;flex:1;outline:none;font-family:inherit;color:var(--t1);}
.cat-scroll{overflow-x:auto;display:flex;gap:8px;padding:0 16px 12px;scrollbar-width:none;}
.cat-scroll::-webkit-scrollbar{display:none;}
.cat-tab{flex-shrink:0;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--bd);background:#fff;color:var(--t2);transition:all .15s;white-space:nowrap;font-family:inherit;}
.cat-tab.active{background:var(--or);color:#fff;border-color:var(--or);font-weight:600;}
.products-wrap{padding:0 16px 130px;}
.sec-title{font-size:15px;font-weight:700;color:var(--t1);margin:16px 0 12px;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.p-card{background:#fff;border:1px solid var(--bd);border-radius:var(--r);padding:12px;position:relative;}
.p-img{width:100%;aspect-ratio:1;background:var(--bg);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:8px;}
.p-tag{position:absolute;top:10px;left:10px;font-size:10px;font-weight:600;padding:2px 7px;border-radius:4px;}
.p-tag.best{background:#FEF3C7;color:#92400E;}
.p-tag.fast{background:var(--gr-l);color:#166534;}
.p-tag.most{background:#EDE9FE;color:#5B21B6;}
.p-tag.ltd{background:var(--rd-l);color:#991B1B;}
.p-name{font-size:13px;font-weight:600;color:var(--t1);line-height:1.3;margin-bottom:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.p-unit{font-size:11px;color:var(--t2);margin-bottom:8px;}
.p-foot{display:flex;align-items:center;justify-content:space-between;}
.p-price{font-size:15px;font-weight:700;color:var(--t1);}
.add-btn{width:36px;height:36px;background:var(--or);border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;color:#fff;font-size:20px;flex-shrink:0;}
.stepper{display:flex;align-items:center;background:var(--or);border-radius:8px;overflow:hidden;}
.stpr-btn{width:32px;height:36px;border:none;background:transparent;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.stpr-qty{color:#fff;font-size:14px;font-weight:700;min-width:24px;text-align:center;}
.cart-bar{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:420px;background:var(--or);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;z-index:200;}
.cb-left{color:#fff;}
.cb-count{font-size:12px;font-weight:500;opacity:.9;}
.cb-total{font-size:17px;font-weight:700;}
.cb-btn{background:#fff;color:var(--or);font-size:14px;font-weight:700;padding:10px 18px;border-radius:8px;cursor:pointer;border:none;font-family:inherit;}
.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.2s infinite;border-radius:8px;}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
.screen{min-height:100vh;background:#fff;display:flex;flex-direction:column;}
.scr-hdr{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--bd);position:sticky;top:0;background:#fff;z-index:50;}
.back-btn{width:36px;height:36px;border-radius:8px;border:none;background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;flex-shrink:0;font-family:inherit;}
.scr-title{font-size:17px;font-weight:700;color:var(--t1);}
.scr-body{flex:1;padding:16px;padding-bottom:96px;overflow-y:auto;}
.sticky-cta{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:420px;padding:12px 16px;background:#fff;border-top:1px solid var(--bd);z-index:50;}
.pri-btn{width:100%;height:52px;background:var(--or);color:#fff;font-size:16px;font-weight:700;border:none;border-radius:var(--r);cursor:pointer;font-family:inherit;}
.pri-btn:active{background:var(--or-d);}
.step-bar{display:flex;align-items:center;padding:0 16px 14px;gap:4px;}
.step-seg{height:3px;border-radius:3px;flex:1;background:var(--bd);transition:background .3s;}
.step-seg.done{background:var(--or);}
.card{background:#fff;border:1px solid var(--bd);border-radius:var(--r);margin-bottom:12px;overflow:hidden;box-shadow:var(--sh);}
.card-hdr{padding:14px 16px;border-bottom:1px solid var(--bd);font-size:14px;font-weight:700;color:var(--t1);}
.oi-row{display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid #F9FAFB;gap:10px;}
.oi-emoji{font-size:24px;width:36px;text-align:center;flex-shrink:0;}
.oi-name{font-size:13px;font-weight:500;color:var(--t1);flex:1;}
.oi-unit{font-size:11px;color:var(--t2);}
.oi-stpr{display:flex;align-items:center;gap:4px;}
.oi-sbtn{width:28px;height:28px;border-radius:6px;border:1.5px solid var(--bd);background:#fff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--t1);font-family:inherit;}
.oi-qty{font-size:13px;font-weight:700;min-width:20px;text-align:center;}
.oi-price{font-size:13px;font-weight:600;color:var(--t1);min-width:44px;text-align:right;}
.pr-row{display:flex;justify-content:space-between;padding:10px 16px;font-size:13px;color:var(--t2);}
.pr-row.total{font-size:15px;font-weight:700;color:var(--t1);border-top:1px solid var(--bd);}
.del-promise{background:var(--or-l);border:1.5px solid var(--or-b);border-radius:var(--r);padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.dp-icon{width:44px;height:44px;background:var(--or);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.dp-title{font-size:15px;font-weight:700;color:#9A3412;}
.dp-sub{font-size:12px;color:#C2410C;margin-top:2px;}
.addr-opt{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;cursor:pointer;border-bottom:1px solid #F9FAFB;}
.addr-radio{width:20px;height:20px;border-radius:50%;border:2px solid var(--bd);flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;}
.addr-radio.sel{border-color:var(--or);}
.addr-radio.sel::after{content:'';width:10px;height:10px;background:var(--or);border-radius:50%;}
.addr-lbl{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:2px;}
.addr-txt{font-size:12px;color:var(--t2);line-height:1.5;}
.add-new-btn{width:100%;height:48px;border:1.5px dashed var(--bd);border-radius:10px;background:transparent;font-size:14px;font-weight:500;color:var(--t2);cursor:pointer;font-family:inherit;}
.form-wrap{padding:16px;}
.f-label{font-size:12px;font-weight:600;color:var(--t2);margin-bottom:6px;display:block;}
.f-input{width:100%;height:48px;border:1.5px solid var(--bd);border-radius:10px;padding:0 14px;font-size:14px;font-family:inherit;outline:none;color:var(--t1);margin-bottom:14px;}
.f-input:focus{border-color:var(--or);}
.f-err{font-size:11px;color:var(--rd);margin-top:-10px;margin-bottom:14px;}
.pay-opt{display:flex;align-items:center;gap:14px;padding:16px;cursor:pointer;border-bottom:1px solid var(--bd);}
.pay-name{font-size:14px;font-weight:600;color:var(--t1);}
.pay-sub{font-size:12px;color:var(--t2);}
.pay-radio{margin-left:auto;width:20px;height:20px;border-radius:50%;border:2px solid var(--bd);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.pay-radio.sel{border-color:var(--or);}
.pay-radio.sel::after{content:'';width:10px;height:10px;background:var(--or);border-radius:50%;}
.pay-opt.disabled{opacity:.4;pointer-events:none;}
.cod-badge{background:var(--or-l);color:var(--or-d);font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;}
.mini-sum{background:var(--bg);border-radius:10px;padding:12px 16px;margin-bottom:12px;}
.ms-row{display:flex;justify-content:space-between;font-size:13px;color:var(--t2);margin-bottom:4px;}
.ms-total{font-size:15px;font-weight:700;color:var(--t1);border-top:1px solid var(--bd);padding-top:8px;margin-top:8px;display:flex;justify-content:space-between;}
.confirm-wrap{min-height:100vh;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;text-align:center;}
.check-circle{width:80px;height:80px;background:var(--gr-l);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px;animation:pop .35s cubic-bezier(.36,.07,.19,.97);}
@keyframes pop{0%{transform:scale(.5);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.conf-title{font-size:22px;font-weight:700;color:var(--t1);margin-bottom:8px;}
.conf-sub{font-size:14px;color:var(--t2);margin-bottom:28px;}
.conf-card{width:100%;background:var(--bg);border-radius:var(--r);padding:16px;text-align:left;margin-bottom:24px;}
.conf-row{display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px;}
.eta-pill{display:inline-flex;align-items:center;gap:6px;background:#FEF3C7;color:#92400E;font-size:13px;font-weight:700;padding:8px 16px;border-radius:20px;margin-bottom:28px;}
.track-btn{width:100%;height:52px;background:var(--or);border:none;border-radius:var(--r);font-size:16px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;}
.sec-btn{width:100%;height:48px;background:transparent;border:1.5px solid var(--bd);border-radius:var(--r);font-size:14px;font-weight:600;color:var(--t1);cursor:pointer;font-family:inherit;margin-top:10px;}
.trk-bg{min-height:100vh;background:#EBEBEB;}
.trk-hdr{background:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:50;}
.trk-title{font-size:16px;font-weight:700;color:var(--t1);}
.trk-oid{font-size:12px;color:var(--t2);margin-top:1px;}
.trk-card{background:#fff;border-radius:var(--r);box-shadow:var(--sh);margin:12px 14px 0;overflow:hidden;}
.promise-card{background:var(--or-l);border:1.5px solid var(--or-b);border-radius:var(--r);margin:12px 14px 0;padding:16px;display:flex;align-items:center;gap:14px;}
.pr-icon{width:46px;height:46px;background:var(--or);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.pr-eta{font-size:19px;font-weight:700;color:#9A3412;line-height:1.2;}
.pr-sub{font-size:12px;color:#C2410C;margin-top:3px;font-weight:500;}
.pr-live{font-size:11px;color:var(--or-d);margin-top:4px;display:flex;align-items:center;gap:4px;}
.pulse-dot{width:7px;height:7px;background:var(--or);border-radius:50%;animation:pls 1.4s ease-in-out infinite;}
@keyframes pls{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.75)}}
.tl{padding:20px 16px 4px;}
.tl-row{display:flex;gap:14px;}
.tl-left{display:flex;flex-direction:column;align-items:center;width:36px;flex-shrink:0;}
.tl-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .4s;position:relative;z-index:1;}
.tl-icon.done{background:var(--gr-l);border:2px solid var(--gr);}
.tl-icon.active{background:var(--or-l);border:2.5px solid var(--or);animation:ring 1.8s ease-in-out infinite;}
.tl-icon.future{background:var(--bg);border:2px solid var(--bd);}
@keyframes ring{0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.25)}50%{box-shadow:0 0 0 6px rgba(249,115,22,0)}}
.tl-line{flex:1;width:2px;background:var(--bd);min-height:32px;margin:3px 0;transition:background .4s;}
.tl-line.done{background:var(--gr);}
.tl-line.active{background:linear-gradient(to bottom,var(--gr),var(--bd));}
.tl-right{flex:1;padding-bottom:28px;}
.tl-lbl{font-size:14px;font-weight:700;color:var(--t1);margin-bottom:2px;transition:color .3s;}
.tl-lbl.future{color:var(--t3);font-weight:500;}
.tl-lbl.active{color:var(--or-d);}
.tl-time{font-size:11px;color:var(--t2);}
.tl-time.active{color:var(--or);font-weight:600;}
.live-msg{margin:4px 14px 0;background:var(--t1);border-radius:var(--rs);padding:14px 16px;display:flex;align-items:center;gap:10px;}
.lm-dot{width:8px;height:8px;background:var(--or);border-radius:50%;flex-shrink:0;animation:pls 1.4s ease-in-out infinite;}
.lm-text{font-size:14px;font-weight:600;color:#fff;flex:1;}
.live-msg.delivered{background:var(--gr-l);}
.live-msg.delivered .lm-text{color:#14532D;}
.live-msg.delivered .lm-dot{background:var(--gr);animation:none;}
.rider-card-t{padding:16px;}
.rider-lbl{font-size:11px;font-weight:700;color:var(--t3);letter-spacing:.6px;text-transform:uppercase;margin-bottom:12px;}
.rider-row{display:flex;align-items:center;gap:12px;}
.rider-av{width:48px;height:48px;background:var(--or-l);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:2px solid var(--or-b);}
.rider-name{font-size:16px;font-weight:700;color:var(--t1);}
.rider-veh{font-size:12px;color:var(--t2);margin-top:2px;}
.call-btn{margin-left:auto;width:44px;height:44px;background:var(--gr-l);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;border:none;flex-shrink:0;}
.sum-toggle{display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;}
.sum-toggle-lbl{font-size:14px;font-weight:700;color:var(--t1);}
.sum-toggle-meta{font-size:12px;color:var(--t2);}
.chevron{font-size:14px;color:var(--t3);transition:transform .25s;}
.chevron.open{transform:rotate(180deg);}
.sum-body{border-top:1px solid var(--bd);padding:0 16px;overflow:hidden;transition:max-height .3s ease;}
.si-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F3F4F6;}
.si-emoji{font-size:20px;width:30px;text-align:center;}
.si-name{font-size:13px;font-weight:500;color:var(--t1);flex:1;}
.si-unit{font-size:11px;color:var(--t2);}
.si-qty{font-size:12px;color:var(--t2);}
.si-price{font-size:13px;font-weight:600;color:var(--t1);min-width:40px;text-align:right;}
.sum-total{display:flex;justify-content:space-between;padding:12px 0;font-size:14px;font-weight:700;color:var(--t1);}
.sum-addr{display:flex;align-items:flex-start;gap:8px;background:var(--bg);border-radius:8px;padding:10px 12px;margin-bottom:14px;}
.sa-text{font-size:12px;color:var(--t2);line-height:1.5;}
.trk-bottom{margin:12px 14px 28px;}
.help-btn{width:100%;height:48px;border:1.5px solid var(--bd);border-radius:var(--rs);background:#fff;font-size:14px;font-weight:600;color:var(--t2);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;}
.rate-btn{width:100%;height:52px;background:var(--or);border:none;border-radius:var(--rs);font-size:15px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;margin-bottom:10px;}
.issue-btn-t{width:100%;height:44px;border:1.5px solid var(--rd);border-radius:var(--rs);background:transparent;font-size:13px;font-weight:600;color:var(--rd);cursor:pointer;font-family:inherit;}
.demo-bar{position:sticky;bottom:0;background:#111;padding:10px 14px;display:flex;align-items:center;gap:8px;z-index:300;border-top:1px solid #222;}
.demo-lbl{font-size:10px;font-weight:700;color:#6B7280;flex-shrink:0;}
.demo-btns{display:flex;gap:6px;flex-wrap:wrap;}
.demo-btn{height:26px;padding:0 9px;border-radius:5px;border:1px solid #333;background:#1F2937;color:#9CA3AF;font-size:10px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;}
.demo-btn.active{background:var(--or);border-color:var(--or);color:#fff;}
.toast{position:fixed;top:76px;left:50%;transform:translateX(-50%);background:#111827;color:#fff;font-size:13px;font-weight:500;padding:9px 18px;border-radius:20px;z-index:999;white-space:nowrap;animation:toastFade 2s forwards;pointer-events:none;}
@keyframes toastFade{0%{opacity:0;transform:translateX(-50%) translateY(-6px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}70%{opacity:1}100%{opacity:0}}
`;

function SLATimer({ placedAt, status }) {
  const [elapsed, setElapsed] = useState(() => Math.floor((Date.now()-placedAt)/1000));
  useEffect(()=>{
    if(["packed","waiting_rider"].includes(status)) return;
    const id=setInterval(()=>setElapsed(Math.floor((Date.now()-placedAt)/1000)),1000);
    return ()=>clearInterval(id);
  },[placedAt,status]);
  const rem=300-elapsed; const mins=Math.abs(Math.floor(rem/60)); const secs=Math.abs(rem%60);
  const cls=rem<=0?"breach":rem<=120?"warn":"ok";
  return <div style={{textAlign:"right"}}><span style={{fontWeight:800,fontSize:16,color:rem<=0?"#DC2626":rem<=120?"#D97706":"#16A34A"}}>{rem<0?"-":""}{mins}:{String(secs).padStart(2,"0")}</span><br/><span style={{fontSize:10,color:"#9CA3AF"}}>{rem<=0?"BREACHED":rem<=120?"Running out":"Pack in"}</span></div>;
}

export default function CustomerApp() {
  const [cart, setCart]     = useState({});
  const [screen, setScreen] = useState("listing");
  const [order, setOrder]   = useState(null);
  const [trackStatus, setTrackStatus] = useState("placed");
  const [trackTS, setTrackTS]         = useState({placed:new Date()});
  const [summaryOpen, setSumOpen]     = useState(false);
  const [activeCat, setActiveCat]     = useState("All");
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [step, setStep]               = useState(1);
  const [selAddr, setSelAddr]         = useState(1);
  const [addingNew, setAddingNew]     = useState(false);
  const [newAddr, setNewAddr]         = useState({area:"",landmark:"",house:"",phone:""});
  const [errors, setErrors]           = useState({});
  const [selPay, setSelPay]           = useState("cod");
  const [autoPlay, setAutoPlay]       = useState(false);
  const timerRefs = useRef([]);
  const toastTimer = useRef(null);

  useEffect(()=>{ const t=setTimeout(()=>setLoading(false),900); return ()=>clearTimeout(t); },[]);

  useEffect(()=>{
    if(!autoPlay) return;
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current=[];
    STATUS_ORDER.forEach((s,i)=>{
      if(i===0) return;
      const t=setTimeout(()=>{ setTrackStatus(s); setTrackTS(ts=>({...ts,[s]:new Date()})); },[0,5000,11000,18000][i]);
      timerRefs.current.push(t);
    });
    return ()=>timerRefs.current.forEach(clearTimeout);
  },[autoPlay]);

  const showToast=(msg)=>{ setToast(msg); clearTimeout(toastTimer.current); toastTimer.current=setTimeout(()=>setToast(null),2000); };
  const handleAdd=(id)=>{ setCart(c=>({...c,[id]:(c[id]||0)+1})); if(!cart[id]) showToast("Added to cart ✓"); };
  const handleRem=(id)=>{ setCart(c=>{ const n={...c,[id]:(c[id]||1)-1}; if(n[id]<=0) delete n[id]; return n; }); };
  const total=cartTotal(cart); const count=cartCount(cart);
  const cartItems=Object.entries(cart).filter(([,q])=>q>0).map(([id,qty])=>({...PRODUCTS.find(p=>p.id===Number(id)),qty}));
  const filtered=PRODUCTS.filter(p=>activeCat==="All"||p.category===activeCat).sort((a,b)=>b.avgSales-a.avgSales);
  const selAddrObj=SAVED_ADDRESSES.find(a=>a.id===selAddr);
  const activeIdx=STATUS_ORDER.indexOf(trackStatus);
  const etaText=trackStatus==="delivered"?"Delivered!":trackStatus==="picked"?"Arriving in 5–10 mins":trackStatus==="packed"?"Arriving in 8–15 mins":"Arriving in 10–20 mins";
  const stage=STAGES.find(s=>s.key===trackStatus);

  const validateAddr=()=>{ const e={}; if(addingNew&&!newAddr.area.trim()) e.area="Required"; if(addingNew&&!newAddr.landmark.trim()) e.landmark="Required"; setErrors(e); return Object.keys(e).length===0; };
  const placeOrder=()=>{
    const oid=genOrderId();
    setOrder({id:oid,items:cartItems,total,address:addingNew?newAddr.area:selAddrObj?.address||"",landmark:addingNew?newAddr.landmark:selAddrObj?.landmark||"",vendor:"Shree Kirana, Station Road",placedAt:new Date()});
    setCart({}); setStep(1); setAutoPlay(true); setTrackStatus("placed"); setTrackTS({placed:new Date()}); setScreen("tracking");
  };

  const PAYMENTS=[
    {id:"cod",icon:"💵",name:"Cash on Delivery",sub:"Pay when delivered",badge:"Recommended"},
    {id:"upi",icon:"📱",name:"UPI",sub:"GPay, PhonePe, Paytm"},
    {id:"wallet",icon:"👜",name:"Wallet",sub:"Coming soon",disabled:true},
    {id:"card",icon:"💳",name:"Card",sub:"Coming soon",disabled:true},
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {toast && <div className="toast">{toast}</div>}

        {screen==="listing" && (
          <>
            <div className="lst-header">
              <div className="lst-row1">
                <div className="location-btn"><span>📍</span><span>Lal Bagh, Nagpur</span><span style={{fontSize:10,color:"#F97316"}}>▼</span></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="del-badge">⚡ 10–20 mins</span>
                  <div className="cart-btn" onClick={()=>count>0&&setScreen("checkout")}>
                    <span style={{fontSize:22}}>🛒</span>
                    {count>0&&<span className="cart-badge">{count}</span>}
                  </div>
                </div>
              </div>
              <div className="search-bar"><span style={{fontSize:16,color:"#9CA3AF"}}>🔍</span><input placeholder="Search essentials, snacks, drinks…"/></div>
              <div className="cat-scroll">{CATEGORIES.map(c=><button key={c} className={`cat-tab ${activeCat===c?"active":""}`} onClick={()=>setActiveCat(c)}>{c}</button>)}</div>
            </div>
            <div className="products-wrap">
              <div className="sec-title">🔥 Fast-moving near you</div>
              <div className="p-grid">
                {loading ? Array.from({length:6}).map((_,i)=>(
                  <div key={i} className="p-card">
                    <div className="p-img skeleton" style={{height:100}}/>
                    <div className="skeleton" style={{height:14,width:"80%",marginBottom:6}}/>
                    <div className="skeleton" style={{height:11,width:"50%",marginBottom:12}}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div className="skeleton" style={{height:18,width:40}}/><div className="skeleton" style={{height:36,width:36,borderRadius:8}}/></div>
                  </div>
                )) : filtered.map(p=>{
                  const qty=cart[p.id]||0; const isLtd=p.stock<=10;
                  const tagCls=p.tag==="Best Seller"?"best":p.tag==="Fast Moving"?"fast":"most";
                  return (
                    <div key={p.id} className="p-card">
                      {qty===0&&(isLtd?<span className="p-tag ltd">Limited</span>:p.tag&&<span className={`p-tag ${tagCls}`}>{p.tag}</span>)}
                      <div className="p-img">{p.image}</div>
                      <div className="p-name">{p.name}</div>
                      <div className="p-unit">{p.unit}</div>
                      <div className="p-foot">
                        <span className="p-price">₹{p.price}</span>
                        {qty===0?<button className="add-btn" onClick={()=>handleAdd(p.id)}>+</button>
                          :<div className="stepper"><button className="stpr-btn" onClick={()=>handleRem(p.id)}>−</button><span className="stpr-qty">{qty}</span><button className="stpr-btn" onClick={()=>handleAdd(p.id)}>+</button></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {count>0&&<div className="cart-bar"><div className="cb-left"><div className="cb-count">{count} item{count>1?"s":""}</div><div className="cb-total">₹{total}</div></div><button className="cb-btn" onClick={()=>setScreen("checkout")}>Checkout →</button></div>}
          </>
        )}

        {screen==="checkout" && step<4 && (
          <div className="screen">
            <div className="scr-hdr"><button className="back-btn" onClick={step===1?()=>setScreen("listing"):()=>setStep(step-1)}>←</button><div className="scr-title">{step===1?"Checkout":step===2?"Delivery Address":"Payment"}</div></div>
            <div className="step-bar">{[1,2,3].map(s=><div key={s} className={`step-seg ${step>=s?"done":""}`}/>)}</div>
            <div className="scr-body">
              {step===1&&<>
                <div className="del-promise"><div className="dp-icon">⚡</div><div><div className="dp-title">Delivered in 10–20 minutes</div><div className="dp-sub">From nearby local stores</div></div></div>
                <div className="card">
                  <div className="card-hdr">Your order ({count} items)</div>
                  {cartItems.map(item=>(
                    <div key={item.id} className="oi-row">
                      <span className="oi-emoji">{item.image}</span>
                      <div style={{flex:1}}><div className="oi-name">{item.name}</div><div className="oi-unit">{item.unit}</div></div>
                      <div className="oi-stpr"><button className="oi-sbtn" onClick={()=>handleRem(item.id)}>−</button><span className="oi-qty">{item.qty}</span><button className="oi-sbtn" onClick={()=>handleAdd(item.id)}>+</button></div>
                      <span className="oi-price">₹{item.price*item.qty}</span>
                    </div>
                  ))}
                  <div className="pr-row"><span>Subtotal</span><span>₹{total}</span></div>
                  <div className="pr-row"><span>Delivery</span><span style={{color:"#16A34A"}}>FREE</span></div>
                  <div className="pr-row total"><span>Total</span><span>₹{total}</span></div>
                </div>
              </>}
              {step===2&&<>
                <div className="card" style={{marginBottom:12}}>
                  <div className="card-hdr">Saved addresses</div>
                  {SAVED_ADDRESSES.map(addr=>(
                    <div key={addr.id} className="addr-opt" onClick={()=>{setSelAddr(addr.id);setAddingNew(false);}}>
                      <div className={`addr-radio ${selAddr===addr.id&&!addingNew?"sel":""}`}/>
                      <div><div className="addr-lbl">{addr.label}</div><div className="addr-txt">{addr.address}</div><div className="addr-txt">Landmark: {addr.landmark}</div><div className="addr-txt">📞 {addr.phone}</div></div>
                    </div>
                  ))}
                </div>
                {!addingNew?<button className="add-new-btn" onClick={()=>{setAddingNew(true);setSelAddr(null);}}>+ Add new address</button>
                  :<div className="card"><div className="card-hdr">New address</div><div className="form-wrap">
                    <label className="f-label">Area / Locality *</label>
                    <input className={`f-input ${errors.area?"":""}` } placeholder="e.g. Lal Bagh" value={newAddr.area} onChange={e=>setNewAddr({...newAddr,area:e.target.value})}/>
                    {errors.area&&<div className="f-err">{errors.area}</div>}
                    <label className="f-label">Landmark *</label>
                    <input className="f-input" placeholder="e.g. Near SBI ATM" value={newAddr.landmark} onChange={e=>setNewAddr({...newAddr,landmark:e.target.value})}/>
                    {errors.landmark&&<div className="f-err">{errors.landmark}</div>}
                    <label className="f-label">Contact phone</label>
                    <input className="f-input" placeholder="10-digit mobile" type="tel" value={newAddr.phone} onChange={e=>setNewAddr({...newAddr,phone:e.target.value})}/>
                  </div></div>}
              </>}
              {step===3&&<>
                <div className="card" style={{marginBottom:12}}>
                  {PAYMENTS.map(p=>(
                    <div key={p.id} className={`pay-opt ${p.disabled?"disabled":""}`} onClick={()=>!p.disabled&&setSelPay(p.id)}>
                      <span style={{fontSize:24,width:40,textAlign:"center"}}>{p.icon}</span>
                      <div><div style={{display:"flex",alignItems:"center",gap:6}}><span className="pay-name">{p.name}</span>{p.badge&&<span className="cod-badge">{p.badge}</span>}</div><div className="pay-sub">{p.sub}</div></div>
                      <div className={`pay-radio ${selPay===p.id?"sel":""}`}/>
                    </div>
                  ))}
                </div>
                <div className="mini-sum"><div className="ms-row"><span>Items ({count})</span><span>₹{total}</span></div><div className="ms-row"><span>Delivery</span><span style={{color:"#16A34A"}}>FREE</span></div><div className="ms-total"><span>Total</span><span>₹{total}</span></div></div>
              </>}
            </div>
            <div className="sticky-cta">
              {step===1&&<button className="pri-btn" onClick={()=>setStep(2)}>Continue to Address →</button>}
              {step===2&&<button className="pri-btn" onClick={()=>{if(validateAddr()) setStep(3);}}>Confirm Address →</button>}
              {step===3&&<button className="pri-btn" onClick={placeOrder}>Place Order · ₹{total}</button>}
            </div>
          </div>
        )}

        {screen==="tracking" && order && (
          <div className="trk-bg">
            <div className="trk-hdr">
              <button className="back-btn" onClick={()=>setScreen("listing")}>←</button>
              <div><div className="trk-title">Order Tracking</div><div className="trk-oid">#{order.id} · {order.vendor}</div></div>
            </div>
            <div className="promise-card">
              <div className="pr-icon">{trackStatus==="delivered"?"🎉":"⚡"}</div>
              <div>
                <div className="pr-eta">{etaText}</div>
                <div className="pr-sub">From {order.vendor}</div>
                {trackStatus!=="delivered"&&<div className="pr-live"><div className="pulse-dot"/>Live tracking active</div>}
              </div>
            </div>
            <div className="trk-card">
              <div className="tl">
                {STAGES.map((st,i)=>{
                  const isDone=i<activeIdx; const isActive=i===activeIdx; const isFuture=i>activeIdx;
                  return(
                    <div key={st.key} className="tl-row">
                      <div className="tl-left">
                        <div className={`tl-icon ${isDone?"done":isActive?"active":"future"}`}>{isDone?<span style={{color:"#16A34A",fontWeight:700}}>✓</span>:<span>{st.icon}</span>}</div>
                        {i<STAGES.length-1&&<div className={`tl-line ${isDone?"done":isActive?"active":""}`}/>}
                      </div>
                      <div className="tl-right">
                        <div className={`tl-lbl ${isFuture?"future":isActive?"active":""}`}>{st.label}</div>
                        {(isDone||isActive)&&<div className={`tl-time ${isActive?"active":""}`}>{isDone?`✓ ${fmtTime(trackTS[st.key]||new Date())}`:"In progress…"}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={`live-msg ${trackStatus==="delivered"?"delivered":""}`}>
              <div className="lm-dot"/><div className="lm-text">{stage?.msg}</div>
            </div>
            {activeIdx>=2&&<div className="trk-card"><div className="rider-card-t"><div className="rider-lbl">Your delivery partner</div><div className="rider-row"><div className="rider-av">🧑</div><div><div className="rider-name">Suresh K.</div><div className="rider-veh">🛵 MH31 AB 1234</div></div><button className="call-btn">📞</button></div></div></div>}
            <div className="trk-card">
              <div className="sum-toggle" onClick={()=>setSumOpen(o=>!o)}>
                <div><div className="sum-toggle-lbl">Order Summary</div><div className="sum-toggle-meta">{order.items.length} items · ₹{order.total}</div></div>
                <span className={`chevron ${summaryOpen?"open":""}`}>▼</span>
              </div>
              <div className="sum-body" style={{maxHeight:summaryOpen?400:0}}>
                {order.items.map((item,i)=>(
                  <div key={i} className="si-row"><span className="si-emoji">{item.image}</span><div style={{flex:1}}><div className="si-name">{item.name}</div><div className="si-unit">{item.unit}</div></div><span className="si-qty">×{item.qty}</span><span className="si-price">₹{item.price*item.qty}</span></div>
                ))}
                <div className="sum-total"><span>Total paid</span><span>₹{order.total}</span></div>
                <div className="sum-addr"><span style={{fontSize:16}}>📍</span><div className="sa-text">{order.address}{order.landmark&&<><br/>Landmark: {order.landmark}</>}</div></div>
              </div>
            </div>
            <div className="trk-bottom">
              {trackStatus==="delivered"?<><button className="rate-btn">⭐ Rate your experience</button><button className="issue-btn-t">⚠ Report an issue</button><button className="sec-btn" style={{marginTop:10}} onClick={()=>{setOrder(null);setScreen("listing");}}>🛒 Continue Shopping</button></>
                :<button className="help-btn">💬 Need Help?</button>}
            </div>
            <div className="demo-bar">
              <span className="demo-lbl">DEMO</span>
              <div className="demo-btns">
                {STATUS_ORDER.map(s=><button key={s} className={`demo-btn ${trackStatus===s?"active":""}`} onClick={()=>{setAutoPlay(false);timerRefs.current.forEach(clearTimeout);setTrackStatus(s);setTrackTS(ts=>({...ts,[s]:new Date()}));}}>{s}</button>)}
                <span style={{fontSize:10,color:"#6B7280",cursor:"pointer",marginLeft:4}} onClick={()=>{setAutoPlay(true);setTrackStatus("placed");setTrackTS({placed:new Date()});}}>↺ reset</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
