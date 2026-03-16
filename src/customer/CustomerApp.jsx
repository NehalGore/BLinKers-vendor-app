import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["All","Essentials","Snacks","Beverages","Dairy","Instant Food","Personal Care","Household"];
const CAT_ICONS  = { All:"🔥", Essentials:"🧺", Snacks:"🍿", Beverages:"🥤", Dairy:"🥛", "Instant Food":"🍜", "Personal Care":"🧴", Household:"🏠" };

const PRODUCTS = [
  { id:1,  name:"Amul Full Cream Milk",   unit:"500ml",          price:28,  category:"Dairy",         tag:"Best Seller",  stock:24, avgSales:42, image:"🥛", bg:"#FFF8E7" },
  { id:2,  name:"Britannia Bread",         unit:"400g",           price:45,  category:"Essentials",    tag:"Fast Moving",  stock:18, avgSales:38, image:"🍞", bg:"#FFF3E0" },
  { id:3,  name:"Fortune Sunflower Oil",   unit:"1L",             price:149, category:"Essentials",    tag:"Best Seller",  stock:10, avgSales:31, image:"🫙", bg:"#FFFDE7" },
  { id:4,  name:"Haldiram's Aloo Bhujia", unit:"200g",           price:55,  category:"Snacks",        tag:"Most Ordered", stock:30, avgSales:29, image:"🟡", bg:"#FFF8E7" },
  { id:5,  name:"Parle-G Biscuits",        unit:"800g",           price:50,  category:"Snacks",        tag:"Best Seller",  stock:40, avgSales:55, image:"🍪", bg:"#FFF3E0" },
  { id:6,  name:"Coca-Cola",               unit:"750ml",          price:40,  category:"Beverages",     tag:"Fast Moving",  stock:22, avgSales:27, image:"🥤", bg:"#FFF8E7" },
  { id:7,  name:"Nescafé Classic",         unit:"50g",            price:119, category:"Beverages",     tag:null,           stock:15, avgSales:18, image:"☕", bg:"#EFEBE9" },
  { id:8,  name:"Maggi Noodles",           unit:"2-min, 4 packs", price:68,  category:"Instant Food",  tag:"Most Ordered", stock:35, avgSales:48, image:"🍜", bg:"#FFF8E7" },
  { id:9,  name:"Tata Salt",               unit:"1kg",            price:26,  category:"Essentials",    tag:null,           stock:50, avgSales:33, image:"🧂", bg:"#F3F4F6" },
  { id:10, name:"Dettol Handwash",         unit:"250ml",          price:89,  category:"Personal Care", tag:null,           stock:12, avgSales:16, image:"🧴", bg:"#E8F5E9" },
  { id:11, name:"Vim Bar",                 unit:"200g",           price:32,  category:"Household",     tag:null,           stock:28, avgSales:22, image:"🫧", bg:"#E3F2FD" },
  { id:12, name:"Amul Butter",             unit:"100g",           price:58,  category:"Dairy",         tag:"Best Seller",  stock:8,  avgSales:25, image:"🧈", bg:"#FFFDE7" },
  { id:13, name:"Sprite",                  unit:"1L",             price:55,  category:"Beverages",     tag:null,           stock:20, avgSales:20, image:"🫙", bg:"#E8F5E9" },
  { id:14, name:"Poha",                    unit:"500g",           price:38,  category:"Essentials",    tag:null,           stock:18, avgSales:19, image:"🍚", bg:"#FFF8E7" },
  { id:15, name:"Good Day Cookies",        unit:"150g",           price:30,  category:"Snacks",        tag:"Fast Moving",  stock:25, avgSales:24, image:"🍪", bg:"#FFF3E0" },
  { id:16, name:"Clinic Plus Shampoo",     unit:"80ml",           price:35,  category:"Personal Care", tag:null,           stock:20, avgSales:14, image:"🧴", bg:"#E8F5E9" },
];

const SAVED_ADDRESSES = [
  { id:1, label:"Home", address:"Near Hanuman Mandir, Lal Bagh", landmark:"Opposite SBI ATM",         phone:"9876543210" },
  { id:2, label:"Work", address:"2nd Floor, Shree Complex, Station Road", landmark:"Above Bajaj Showroom", phone:"9876543210" },
];

const STAGES = [
  { key:"placed",    label:"Order Placed",  icon:"📋", msg:"Your order has been confirmed!" },
  { key:"packed",    label:"Being Packed",  icon:"📦", msg:"Vendor is carefully packing your order" },
  { key:"picked",    label:"Picked Up",     icon:"🛵", msg:"Rider is heading to your location" },
  { key:"delivered", label:"Delivered",     icon:"✅", msg:"Delivered! Enjoy your order 😊" },
];
const STATUS_ORDER = ["placed","packed","picked","delivered"];
const SIM_DELAYS   = [0, 5000, 11000, 18000];

const cartTotal = (cart) => Object.entries(cart).reduce((s,[id,q])=>{ const p=PRODUCTS.find(p=>p.id===Number(id)); return s+(p?p.price*q:0); },0);
const cartCount = (cart) => Object.values(cart).reduce((s,v)=>s+v,0);
const fmtTime   = (d) => d ? d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true}) : null;
const genOrderId= () => "BLK"+Math.floor(100000+Math.random()*900000);

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;1,700&display=swap');

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
html,body { height:100%; }
body { font-family:'Plus Jakarta Sans',-apple-system,sans-serif; background:#F7F4F0; }

:root {
  --or:#F97316; --or2:#FB923C; --or3:#FDBA74; --or-d:#EA6C10;
  --or-l:#FFF7ED; --or-xl:#FFFBF5;
  --dk:#1A1208; --dk2:#2D1F0A; --dk3:#3D2B10;
  --gr:#16A34A; --gr-l:#DCFCE7; --gr-d:#15803D;
  --rd:#DC2626; --rd-l:#FEE2E2;
  --yw:#D97706; --yw-l:#FEF3C7;
  --t1:#1A1208; --t2:#6B5B45; --t3:#A89880;
  --bd:#E8E0D4; --bg:#F7F4F0; --wh:#FFFFFF;
  --r:16px; --r2:20px; --rs:12px;
  --sh:0 2px 12px rgba(26,18,8,.08), 0 1px 3px rgba(26,18,8,.05);
  --sh2:0 8px 32px rgba(26,18,8,.12), 0 2px 8px rgba(26,18,8,.06);
  --sh3:0 20px 60px rgba(249,115,22,.25), 0 4px 16px rgba(249,115,22,.15);
  --fd:'Fraunces',serif;
  --fs:'Plus Jakarta Sans',sans-serif;
}

.app { max-width:430px; margin:0 auto; min-height:100vh; background:var(--bg); overflow-x:hidden; }

/* ══ HEADER ══════════════════════════════════════════════════════ */
.hdr {
  background:linear-gradient(135deg, var(--dk) 0%, var(--dk2) 60%, #4A3418 100%);
  padding:0 18px;
  position:sticky; top:0; z-index:100;
}
.hdr-top {
  display:flex; align-items:center; justify-content:space-between;
  padding:16px 0 14px;
}
.loc-wrap { display:flex; align-items:center; gap:8px; cursor:pointer; }
.loc-pin {
  width:32px; height:32px; background:rgba(249,115,22,.2);
  border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:15px;
}
.loc-text { }
.loc-label { font-size:11px; color:rgba(255,255,255,.5); font-weight:500; letter-spacing:.4px; }
.loc-name { font-size:14px; font-weight:700; color:#fff; display:flex; align-items:center; gap:4px; }
.loc-arr { font-size:10px; color:var(--or3); }
.hdr-right { display:flex; align-items:center; gap:10px; }
.eta-chip {
  display:flex; align-items:center; gap:5px;
  background:rgba(249,115,22,.2); border:1px solid rgba(249,115,22,.3);
  border-radius:20px; padding:5px 11px;
}
.eta-dot { width:6px; height:6px; background:#4ADE80; border-radius:50%; animation:etaPulse 1.5s ease-in-out infinite; }
@keyframes etaPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
.eta-text { font-size:11px; font-weight:700; color:var(--or3); }
.cart-wrap { position:relative; cursor:pointer; }
.cart-icon {
  width:40px; height:40px; background:rgba(255,255,255,.1);
  border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px;
  border:1px solid rgba(255,255,255,.15); transition:background .15s;
}
.cart-icon:active { background:rgba(255,255,255,.2); }
.cart-bdg {
  position:absolute; top:-4px; right:-4px;
  background:var(--or); color:#fff; font-size:10px; font-weight:800;
  min-width:18px; height:18px; border-radius:9px; padding:0 4px;
  display:flex; align-items:center; justify-content:center;
  border:2px solid var(--dk); animation:popIn .2s cubic-bezier(.36,.07,.19,.97);
}
@keyframes popIn { 0%{transform:scale(0)} 80%{transform:scale(1.15)} 100%{transform:scale(1)} }

/* Search */
.search-wrap {
  background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.12);
  border-radius:14px; padding:11px 14px; display:flex; align-items:center; gap:10px;
  margin-bottom:16px; transition:background .2s;
}
.search-wrap:focus-within { background:rgba(255,255,255,.15); border-color:rgba(249,115,22,.4); }
.search-wrap input { border:none; background:transparent; font-size:14px; flex:1; outline:none; font-family:var(--fs); color:#fff; font-weight:500; }
.search-wrap input::placeholder { color:rgba(255,255,255,.35); }
.search-ic { font-size:15px; opacity:.5; }

/* Category tabs */
.cats {
  display:flex; gap:8px; overflow-x:auto; padding-bottom:16px;
  scrollbar-width:none;
}
.cats::-webkit-scrollbar { display:none; }
.cat-btn {
  flex-shrink:0; display:flex; align-items:center; gap:6px;
  padding:8px 14px; border-radius:24px;
  font-size:12px; font-weight:600; cursor:pointer; border:none;
  transition:all .2s; white-space:nowrap; font-family:var(--fs);
}
.cat-btn:not(.on) { background:rgba(255,255,255,.08); color:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.1); }
.cat-btn.on { background:var(--or); color:#fff; box-shadow:0 4px 12px rgba(249,115,22,.4); }
.cat-ic { font-size:13px; }

/* ══ HERO BANNER ═══════════════════════════════════════════════ */
.hero {
  margin:16px 16px 0;
  background:linear-gradient(135deg, #1A1208 0%, #3D2B10 100%);
  border-radius:var(--r2); padding:20px 20px 0; overflow:hidden; position:relative;
}
.hero::before {
  content:''; position:absolute; top:-30px; right:-30px;
  width:140px; height:140px; border-radius:50%;
  background:radial-gradient(circle, rgba(249,115,22,.3) 0%, transparent 70%);
}
.hero-label { font-size:11px; font-weight:700; color:var(--or3); letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
.hero-title { font-family:var(--fd); font-size:26px; font-weight:700; color:#fff; line-height:1.15; margin-bottom:8px; }
.hero-title em { font-style:italic; color:var(--or3); }
.hero-sub { font-size:13px; color:rgba(255,255,255,.55); margin-bottom:16px; line-height:1.5; }
.hero-cta {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--or); color:#fff; font-size:13px; font-weight:700;
  padding:10px 18px; border-radius:24px; margin-bottom:20px; cursor:pointer; border:none; font-family:var(--fs);
}
.hero-emoji { position:absolute; right:20px; bottom:0; font-size:72px; line-height:1; opacity:.9; }

/* ══ SECTION TITLE ═════════════════════════════════════════════ */
.sec { padding:20px 16px 10px; display:flex; align-items:center; justify-content:space-between; }
.sec-title { font-size:18px; font-weight:800; color:var(--t1); letter-spacing:-.3px; }
.sec-sub { font-size:12px; color:var(--t2); font-weight:500; }

/* ══ PRODUCT GRID ══════════════════════════════════════════════ */
.pgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px 140px; }

.pcard {
  background:var(--wh); border-radius:var(--r2); overflow:hidden;
  box-shadow:var(--sh); transition:transform .15s, box-shadow .15s;
  position:relative;
}
.pcard:active { transform:scale(.97); box-shadow:var(--sh); }

.pcard-img {
  width:100%; aspect-ratio:1; display:flex; align-items:center; justify-content:center;
  font-size:52px; position:relative;
}
.pcard-tag {
  position:absolute; top:10px; left:10px;
  font-size:9px; font-weight:800; padding:3px 8px; border-radius:20px;
  letter-spacing:.3px; text-transform:uppercase;
}
.pcard-tag.best { background:#FEF3C7; color:#92400E; }
.pcard-tag.fast { background:#DCFCE7; color:#166534; }
.pcard-tag.most { background:#EDE9FE; color:#5B21B6; }
.pcard-tag.ltd  { background:#FEE2E2; color:#991B1B; }

.pcard-body { padding:12px 12px 14px; }
.pcard-name {
  font-size:13px; font-weight:700; color:var(--t1); line-height:1.3; margin-bottom:3px;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.pcard-unit { font-size:11px; color:var(--t3); margin-bottom:10px; font-weight:500; }
.pcard-foot { display:flex; align-items:center; justify-content:space-between; }
.pcard-price { font-size:17px; font-weight:800; color:var(--t1); }
.pcard-price span { font-size:11px; font-weight:600; color:var(--t3); }

.add-btn {
  width:38px; height:38px; background:var(--or); border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; border:none; color:#fff; font-size:22px; font-weight:300;
  box-shadow:0 4px 12px rgba(249,115,22,.35); transition:transform .1s, box-shadow .1s;
  flex-shrink:0;
}
.add-btn:active { transform:scale(.88); box-shadow:0 2px 6px rgba(249,115,22,.3); }

.stepper {
  display:flex; align-items:center; background:var(--or);
  border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(249,115,22,.35);
}
.stpr-btn {
  width:34px; height:38px; border:none; background:transparent; color:#fff;
  font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:600;
}
.stpr-qty { color:#fff; font-size:14px; font-weight:800; min-width:26px; text-align:center; }

/* Skeleton */
.ske { background:linear-gradient(90deg,#f0ebe4 25%,#e8e2db 50%,#f0ebe4 75%); background-size:200% 100%; animation:ske 1.4s infinite; border-radius:10px; }
@keyframes ske { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ══ CART BAR ══════════════════════════════════════════════════ */
.cart-bar {
  position:fixed; bottom:0; left:50%; transform:translateX(-50%);
  width:100%; max-width:430px; padding:12px 16px 20px;
  background:linear-gradient(to top, var(--bg) 60%, transparent);
  z-index:200;
}
.cart-bar-inner {
  background:var(--dk); border-radius:18px; padding:14px 16px;
  display:flex; align-items:center; justify-content:space-between;
  box-shadow:var(--sh3);
}
.cb-left { color:#fff; }
.cb-count { font-size:11px; color:rgba(255,255,255,.55); font-weight:600; }
.cb-total { font-size:19px; font-weight:800; color:#fff; }
.cb-btn {
  background:var(--or); color:#fff; font-size:14px; font-weight:800;
  padding:12px 22px; border-radius:14px; cursor:pointer; border:none;
  font-family:var(--fs); box-shadow:0 4px 14px rgba(249,115,22,.4);
  display:flex; align-items:center; gap:6px;
}

/* ══ CHECKOUT SHELL ════════════════════════════════════════════ */
.co-screen { min-height:100vh; background:var(--bg); display:flex; flex-direction:column; }
.co-hdr {
  background:linear-gradient(135deg, var(--dk) 0%, var(--dk2) 100%);
  padding:16px 18px; display:flex; align-items:center; gap:12px;
  position:sticky; top:0; z-index:50;
}
.co-back {
  width:38px; height:38px; background:rgba(255,255,255,.1); border-radius:12px;
  display:flex; align-items:center; justify-content:center; cursor:pointer;
  border:1px solid rgba(255,255,255,.15); font-size:18px; color:#fff; flex-shrink:0; font-family:var(--fs); border:none;
}
.co-title { font-size:17px; font-weight:800; color:#fff; flex:1; }
.step-pills { display:flex; gap:6px; padding:14px 18px; }
.step-pill { flex:1; height:4px; border-radius:4px; background:rgba(249,115,22,.2); transition:background .3s; }
.step-pill.done { background:var(--or); }
.co-body { flex:1; padding:16px; padding-bottom:100px; overflow-y:auto; }

/* Cards */
.co-card { background:var(--wh); border-radius:var(--r2); margin-bottom:14px; overflow:hidden; box-shadow:var(--sh); }
.co-card-hdr { padding:16px 18px; border-bottom:1px solid var(--bd); display:flex; align-items:center; gap:8px; }
.co-card-ic { width:32px; height:32px; background:var(--or-l); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; }
.co-card-title { font-size:14px; font-weight:800; color:var(--t1); }

/* Delivery promise */
.del-banner {
  background:linear-gradient(135deg, #1A1208, #3D2B10);
  border-radius:var(--r2); padding:16px 18px; display:flex; align-items:center; gap:14px; margin-bottom:14px;
}
.del-ic { width:46px; height:46px; background:var(--or); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; box-shadow:0 4px 12px rgba(249,115,22,.4); }
.del-title { font-size:16px; font-weight:800; color:#fff; margin-bottom:3px; }
.del-sub { font-size:12px; color:rgba(255,255,255,.5); }

/* Order items */
.oi-row { display:flex; align-items:center; padding:14px 18px; border-bottom:1px solid #FAF8F5; gap:12px; }
.oi-img { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; }
.oi-name { font-size:13px; font-weight:700; color:var(--t1); flex:1; }
.oi-unit { font-size:11px; color:var(--t3); margin-top:2px; }
.oi-stpr { display:flex; align-items:center; gap:6px; }
.oi-sbtn { width:30px; height:30px; border-radius:9px; border:1.5px solid var(--bd); background:var(--bg); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; color:var(--t1); font-family:var(--fs); }
.oi-qty { font-size:14px; font-weight:800; min-width:22px; text-align:center; color:var(--t1); }
.oi-price { font-size:14px; font-weight:800; color:var(--t1); min-width:48px; text-align:right; }

/* Price rows */
.pr-row { display:flex; justify-content:space-between; align-items:center; padding:10px 18px; font-size:13px; color:var(--t2); }
.pr-row.total { font-size:16px; font-weight:800; color:var(--t1); border-top:2px solid var(--bd); padding:14px 18px; }
.pr-free { color:var(--gr); font-weight:700; }

/* Address */
.addr-opt { display:flex; align-items:flex-start; gap:14px; padding:16px 18px; cursor:pointer; border-bottom:1px solid #FAF8F5; }
.addr-radio { width:22px; height:22px; border-radius:50%; border:2px solid var(--bd); flex-shrink:0; margin-top:2px; display:flex; align-items:center; justify-content:center; transition:border-color .15s; }
.addr-radio.sel { border-color:var(--or); }
.addr-radio.sel::after { content:''; width:11px; height:11px; background:var(--or); border-radius:50%; }
.addr-label-badge { font-size:11px; font-weight:800; background:var(--or-l); color:var(--or-d); padding:2px 8px; border-radius:6px; margin-bottom:4px; display:inline-block; }
.addr-txt { font-size:13px; color:var(--t1); font-weight:600; line-height:1.5; }
.addr-lm { font-size:11px; color:var(--t3); }
.add-new-btn { width:100%; height:52px; border:2px dashed var(--bd); border-radius:var(--r2); background:transparent; font-size:14px; font-weight:700; color:var(--t2); cursor:pointer; font-family:var(--fs); display:flex; align-items:center; justify-content:center; gap:8px; }
.f-group { margin-bottom:16px; }
.f-label { font-size:12px; font-weight:700; color:var(--t2); margin-bottom:8px; display:block; letter-spacing:.2px; }
.f-input { width:100%; height:52px; border:2px solid var(--bd); border-radius:var(--r); padding:0 16px; font-size:14px; font-family:var(--fs); outline:none; color:var(--t1); font-weight:600; background:var(--bg); transition:border-color .2s; }
.f-input:focus { border-color:var(--or); background:var(--wh); }
.f-err { font-size:11px; color:var(--rd); margin-top:6px; font-weight:600; }

/* Payment */
.pay-opt { display:flex; align-items:center; gap:14px; padding:16px 18px; cursor:pointer; border-bottom:1px solid #FAF8F5; transition:background .15s; }
.pay-opt:active { background:var(--bg); }
.pay-icon-wrap { width:44px; height:44px; border-radius:14px; background:var(--bg); display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
.pay-name { font-size:14px; font-weight:700; color:var(--t1); }
.pay-sub { font-size:12px; color:var(--t3); margin-top:2px; }
.pay-radio { margin-left:auto; width:22px; height:22px; border-radius:50%; border:2px solid var(--bd); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all .15s; }
.pay-radio.sel { border-color:var(--or); }
.pay-radio.sel::after { content:''; width:11px; height:11px; background:var(--or); border-radius:50%; }
.pay-opt.disabled { opacity:.35; pointer-events:none; }
.pay-rec { font-size:10px; font-weight:800; background:var(--or-l); color:var(--or-d); padding:2px 7px; border-radius:6px; margin-left:6px; }
.mini-sum { background:var(--bg); border-radius:var(--r); padding:14px 18px; margin-bottom:14px; border:1px solid var(--bd); }
.ms-row { display:flex; justify-content:space-between; font-size:13px; color:var(--t2); margin-bottom:6px; }
.ms-total { display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:var(--t1); padding-top:10px; border-top:2px solid var(--bd); margin-top:8px; }

/* Sticky CTA */
.sticky-cta { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:430px; padding:12px 16px 24px; background:linear-gradient(to top, var(--bg) 70%, transparent); z-index:50; }
.pri-btn { width:100%; height:56px; background:var(--or); color:#fff; font-size:16px; font-weight:800; border:none; border-radius:var(--r2); cursor:pointer; font-family:var(--fs); box-shadow:0 8px 24px rgba(249,115,22,.35); transition:transform .1s, box-shadow .1s; letter-spacing:-.2px; }
.pri-btn:active { transform:scale(.98); box-shadow:0 4px 12px rgba(249,115,22,.3); }
.pri-btn:disabled { background:#D1D5DB; box-shadow:none; cursor:default; }

/* Confirm screen */
.conf-screen {
  min-height:100vh;
  background:linear-gradient(135deg, var(--dk) 0%, #2D1F0A 50%, #1A1208 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 24px; text-align:center;
}
.conf-check {
  width:90px; height:90px; background:rgba(249,115,22,.2); border:2px solid rgba(249,115,22,.4);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  margin:0 auto 24px; font-size:42px; animation:confPop .4s cubic-bezier(.36,.07,.19,.97);
}
@keyframes confPop { 0%{transform:scale(.3);opacity:0} 80%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
.conf-title { font-family:var(--fd); font-size:30px; font-weight:700; color:#fff; margin-bottom:8px; }
.conf-title em { font-style:italic; color:var(--or3); }
.conf-sub { font-size:14px; color:rgba(255,255,255,.5); margin-bottom:28px; }
.conf-eta { display:inline-flex; align-items:center; gap:8px; background:rgba(249,115,22,.2); border:1px solid rgba(249,115,22,.3); color:var(--or3); font-size:14px; font-weight:800; padding:10px 20px; border-radius:24px; margin-bottom:28px; }
.conf-card { width:100%; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:var(--r2); padding:18px; text-align:left; margin-bottom:28px; }
.conf-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:13px; }
.conf-row:last-child { margin-bottom:0; }
.conf-key { color:rgba(255,255,255,.45); font-weight:500; }
.conf-val { color:#fff; font-weight:700; text-align:right; max-width:60%; }
.track-btn { width:100%; height:56px; background:var(--or); border:none; border-radius:var(--r2); font-size:16px; font-weight:800; color:#fff; cursor:pointer; font-family:var(--fs); box-shadow:var(--sh3); margin-bottom:12px; }
.cont-btn { width:100%; height:48px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:var(--r2); font-size:14px; font-weight:700; color:rgba(255,255,255,.7); cursor:pointer; font-family:var(--fs); }

/* ══ TRACKING ══════════════════════════════════════════════════ */
.trk-bg { min-height:100vh; background:var(--bg); }
.trk-hdr {
  background:linear-gradient(135deg, var(--dk), var(--dk2));
  padding:16px 18px; display:flex; align-items:center; gap:12px;
  position:sticky; top:0; z-index:50;
}
.trk-title { font-size:17px; font-weight:800; color:#fff; }
.trk-oid { font-size:11px; color:rgba(255,255,255,.4); margin-top:2px; }
.trk-back { width:38px; height:38px; background:rgba(255,255,255,.1); border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; border:1px solid rgba(255,255,255,.15); font-size:18px; color:#fff; flex-shrink:0; font-family:var(--fs); }

.promise-wrap {
  margin:16px 16px 0;
  background:linear-gradient(135deg, var(--dk), #3D2B10);
  border-radius:var(--r2); padding:18px 20px; display:flex; align-items:center; gap:16px;
  position:relative; overflow:hidden;
}
.promise-wrap::after { content:''; position:absolute; top:-40px; right:-40px; width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, rgba(249,115,22,.2) 0%, transparent 70%); }
.pw-icon { width:52px; height:52px; background:var(--or); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; box-shadow:0 6px 16px rgba(249,115,22,.4); }
.pw-eta { font-family:var(--fd); font-size:22px; font-weight:700; color:#fff; line-height:1.1; }
.pw-sub { font-size:12px; color:rgba(255,255,255,.45); margin-top:4px; }
.pw-live { display:flex; align-items:center; gap:5px; margin-top:6px; }
.pw-dot { width:6px; height:6px; background:#4ADE80; border-radius:50%; animation:etaPulse 1.5s ease-in-out infinite; }
.pw-txt { font-size:11px; color:#4ADE80; font-weight:700; }

/* Timeline */
.tl-card { margin:12px 16px 0; background:var(--wh); border-radius:var(--r2); box-shadow:var(--sh); padding:20px 18px 8px; }
.tl-row { display:flex; gap:16px; }
.tl-l { display:flex; flex-direction:column; align-items:center; width:40px; flex-shrink:0; }
.tl-ic { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; transition:all .4s; }
.tl-ic.done { background:var(--gr-l); border:2px solid var(--gr); }
.tl-ic.active { background:var(--or-l); border:2.5px solid var(--or); animation:tlRing 1.8s ease-in-out infinite; }
.tl-ic.future { background:var(--bg); border:2px solid var(--bd); }
@keyframes tlRing { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,.25)} 50%{box-shadow:0 0 0 8px rgba(249,115,22,0)} }
.tl-line { flex:1; width:2px; background:var(--bd); min-height:36px; margin:4px 0; transition:background .5s; }
.tl-line.done { background:var(--gr); }
.tl-line.active { background:linear-gradient(to bottom, var(--gr), var(--bd)); }
.tl-r { flex:1; padding-bottom:28px; }
.tl-lbl { font-size:14px; font-weight:800; color:var(--t1); margin-bottom:3px; }
.tl-lbl.future { color:var(--t3); font-weight:500; }
.tl-lbl.active { color:var(--or-d); }
.tl-time { font-size:11px; color:var(--t3); font-weight:500; }
.tl-time.active { color:var(--or); font-weight:700; }
.tl-check { color:var(--gr); font-size:16px; }

/* Live message */
.live-msg { margin:10px 16px 0; background:var(--dk); border-radius:var(--r); padding:16px 18px; display:flex; align-items:center; gap:12px; }
.lm-dot { width:9px; height:9px; background:var(--or); border-radius:50%; flex-shrink:0; animation:etaPulse 1.4s ease-in-out infinite; }
.lm-txt { font-size:14px; font-weight:700; color:#fff; flex:1; }
.live-msg.delivered { background:var(--gr-l); }
.live-msg.delivered .lm-txt { color:var(--gr-d); }
.live-msg.delivered .lm-dot { background:var(--gr); animation:none; }

/* Rider card */
.rider-card2 { margin:10px 16px 0; background:var(--wh); border-radius:var(--r2); box-shadow:var(--sh); padding:16px 18px; }
.rc-lbl { font-size:10px; font-weight:800; color:var(--t3); text-transform:uppercase; letter-spacing:.8px; margin-bottom:14px; }
.rc-row { display:flex; align-items:center; gap:14px; }
.rc-av { width:52px; height:52px; background:var(--or-l); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; border:2px solid var(--or-b); flex-shrink:0; }
.rc-name { font-size:16px; font-weight:800; color:var(--t1); }
.rc-veh { font-size:12px; color:var(--t3); margin-top:3px; font-weight:500; }
.call-btn2 { margin-left:auto; width:46px; height:46px; background:var(--gr-l); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; cursor:pointer; border:none; flex-shrink:0; }

/* Summary collapsible */
.sum-card { margin:10px 16px 0; background:var(--wh); border-radius:var(--r2); box-shadow:var(--sh); overflow:hidden; }
.sum-tog { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; cursor:pointer; }
.sum-tog-lbl { font-size:14px; font-weight:800; color:var(--t1); }
.sum-tog-meta { font-size:12px; color:var(--t3); margin-top:2px; }
.chevron { font-size:14px; color:var(--t3); transition:transform .25s; }
.chevron.open { transform:rotate(180deg); }
.sum-body { border-top:1px solid var(--bd); padding:0 18px; overflow:hidden; transition:max-height .3s ease; }
.si-row2 { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #FAF8F5; }
.si-row2:last-child { border-bottom:none; }
.si-em { font-size:22px; width:36px; text-align:center; }
.si-inf { flex:1; }
.si-n { font-size:13px; font-weight:700; color:var(--t1); }
.si-u { font-size:11px; color:var(--t3); }
.si-q { font-size:12px; color:var(--t3); }
.si-p { font-size:13px; font-weight:800; color:var(--t1); }
.sum-tot { display:flex; justify-content:space-between; padding:14px 0; font-size:15px; font-weight:800; color:var(--t1); }
.sum-addr2 { display:flex; align-items:flex-start; gap:10px; background:var(--bg); border-radius:var(--r); padding:12px 14px; margin-bottom:14px; }
.sa-txt { font-size:12px; color:var(--t2); line-height:1.6; font-weight:500; }

/* Bottom actions */
.trk-btm { margin:12px 16px 32px; display:flex; flex-direction:column; gap:10px; }
.help-btn2 { width:100%; height:52px; border:2px solid var(--bd); border-radius:var(--r2); background:var(--wh); font-size:14px; font-weight:700; color:var(--t2); cursor:pointer; font-family:var(--fs); box-shadow:var(--sh); }
.rate-btn2 { width:100%; height:56px; background:var(--or); border:none; border-radius:var(--r2); font-size:15px; font-weight:800; color:#fff; cursor:pointer; font-family:var(--fs); box-shadow:var(--sh3); }
.issue-btn2 { width:100%; height:48px; border:2px solid var(--rd-l); border-radius:var(--r2); background:transparent; font-size:13px; font-weight:700; color:var(--rd); cursor:pointer; font-family:var(--fs); }

/* Demo bar */
.demo-bar { position:sticky; bottom:0; background:#1A1208; padding:10px 14px; display:flex; align-items:center; gap:8px; z-index:300; border-top:1px solid rgba(255,255,255,.08); }
.demo-lbl { font-size:9px; font-weight:800; color:rgba(255,255,255,.3); flex-shrink:0; letter-spacing:.8px; }
.demo-btns { display:flex; gap:5px; flex-wrap:wrap; }
.demo-btn { height:26px; padding:0 10px; border-radius:6px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); color:rgba(255,255,255,.5); font-size:10px; font-weight:700; cursor:pointer; font-family:var(--fs); white-space:nowrap; }
.demo-btn.on { background:var(--or); border-color:var(--or); color:#fff; }

/* Toast */
.toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:var(--dk); color:#fff; font-size:13px; font-weight:700; padding:12px 22px; border-radius:24px; z-index:999; white-space:nowrap; box-shadow:0 8px 32px rgba(26,18,8,.3); animation:toastIn 2.5s forwards; pointer-events:none; }
@keyframes toastIn { 0%{opacity:0;transform:translateX(-50%) translateY(10px)} 12%{opacity:1;transform:translateX(-50%) translateY(0)} 75%{opacity:1} 100%{opacity:0} }
`;

export default function CustomerApp() {
  const [cart,         setCart]        = useState({});
  const [screen,       setScreen]      = useState("listing");
  const [order,        setOrder]       = useState(null);
  const [trackStatus,  setTrackStatus] = useState("placed");
  const [trackTS,      setTrackTS]     = useState({ placed: new Date() });
  const [sumOpen,      setSumOpen]     = useState(false);
  const [activeCat,    setActiveCat]   = useState("All");
  const [loading,      setLoading]     = useState(true);
  const [toast,        setToast]       = useState(null);
  const [step,         setStep]        = useState(1);
  const [selAddr,      setSelAddr]     = useState(1);
  const [addingNew,    setAddingNew]   = useState(false);
  const [newAddr,      setNewAddr]     = useState({ area:"", landmark:"", house:"", phone:"" });
  const [errors,       setErrors]      = useState({});
  const [selPay,       setSelPay]      = useState("cod");
  const [autoPlay,     setAutoPlay]    = useState(false);
  const timerRefs  = useRef([]);
  const toastTimer = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!autoPlay) return;
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
    STATUS_ORDER.forEach((s, i) => {
      if (i === 0) return;
      const t = setTimeout(() => { setTrackStatus(s); setTrackTS(ts => ({ ...ts, [s]: new Date() })); }, SIM_DELAYS[i]);
      timerRefs.current.push(t);
    });
    return () => timerRefs.current.forEach(clearTimeout);
  }, [autoPlay]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const handleAdd = (id) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
    if (!cart[id]) showToast("Added to cart ✓");
  };
  const handleRem = (id) => {
    setCart(c => { const n = { ...c, [id]: (c[id] || 1) - 1 }; if (n[id] <= 0) delete n[id]; return n; });
  };

  const total     = cartTotal(cart);
  const count     = cartCount(cart);
  const cartItems = Object.entries(cart).filter(([,q]) => q > 0).map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === Number(id)), qty }));
  const filtered  = PRODUCTS.filter(p => activeCat === "All" || p.category === activeCat).sort((a,b) => b.avgSales - a.avgSales);
  const selAddrObj= SAVED_ADDRESSES.find(a => a.id === selAddr);
  const activeIdx = STATUS_ORDER.indexOf(trackStatus);
  const etaText   = trackStatus === "delivered" ? "Delivered! 🎉" : trackStatus === "picked" ? "5–10 mins away" : trackStatus === "packed" ? "8–15 mins away" : "10–20 mins away";
  const stage     = STAGES.find(s => s.key === trackStatus);

  const validateAddr = () => {
    const e = {};
    if (addingNew && !newAddr.area.trim())     e.area = "Area is required";
    if (addingNew && !newAddr.landmark.trim()) e.landmark = "Landmark is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = () => {
    const oid = genOrderId();
    setOrder({ id: oid, items: cartItems, total, address: addingNew ? newAddr.area : selAddrObj?.address || "", landmark: addingNew ? newAddr.landmark : selAddrObj?.landmark || "", vendor: "Shree Kirana, Station Road", placedAt: new Date() });
    setCart({}); setStep(1); setAutoPlay(true); setTrackStatus("placed"); setTrackTS({ placed: new Date() }); setScreen("tracking");
  };

  const PAYMENTS = [
    { id:"cod",    icon:"💵", name:"Cash on Delivery", sub:"Pay when delivered",    rec:true },
    { id:"upi",    icon:"📱", name:"UPI",               sub:"GPay, PhonePe, Paytm" },
    { id:"wallet", icon:"👜", name:"Wallet",            sub:"Coming soon",           disabled:true },
    { id:"card",   icon:"💳", name:"Card",              sub:"Coming soon",           disabled:true },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {toast && <div key={toast + Date.now()} className="toast">{toast}</div>}

        {/* ── LISTING ── */}
        {screen === "listing" && (
          <>
            <div className="hdr">
              <div className="hdr-top">
                <div className="loc-wrap">
                  <div className="loc-pin">📍</div>
                  <div className="loc-text">
                    <div className="loc-label">DELIVERING TO</div>
                    <div className="loc-name">Lal Bagh, Nagpur <span className="loc-arr">▾</span></div>
                  </div>
                </div>
                <div className="hdr-right">
                  <div className="eta-chip">
                    <div className="eta-dot"/>
                    <span className="eta-text">10–20 min</span>
                  </div>
                  <div className="cart-wrap" onClick={() => count > 0 && setScreen("checkout")}>
                    <div className="cart-icon">🛒</div>
                    {count > 0 && <span className="cart-bdg">{count}</span>}
                  </div>
                </div>
              </div>
              <div className="search-wrap">
                <span className="search-ic">🔍</span>
                <input placeholder="Search essentials, snacks, drinks…" />
              </div>
              <div className="cats">
                {CATEGORIES.map(c => (
                  <button key={c} className={`cat-btn ${activeCat === c ? "on" : ""}`} onClick={() => setActiveCat(c)}>
                    <span className="cat-ic">{CAT_ICONS[c]}</span>{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero */}
            {activeCat === "All" && (
              <div className="hero">
                <div className="hero-label">⚡ Fastest in town</div>
                <div className="hero-title">Fresh groceries,<br/><em>in minutes</em></div>
                <div className="hero-sub">From your neighbourhood kirana — direct to your door</div>
                <button className="hero-cta">Shop now →</button>
                <div className="hero-emoji">🛍️</div>
              </div>
            )}

            <div className="sec">
              <div>
                <div className="sec-title">{activeCat === "All" ? "🔥 Fast-moving near you" : CAT_ICONS[activeCat] + " " + activeCat}</div>
              </div>
              <div className="sec-sub">{filtered.length} items</div>
            </div>

            <div className="pgrid">
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 2px 12px rgba(26,18,8,.06)" }}>
                  <div className="ske" style={{ height: 140 }} />
                  <div style={{ padding: 14 }}>
                    <div className="ske" style={{ height: 13, width: "75%", marginBottom: 8 }} />
                    <div className="ske" style={{ height: 11, width: "50%", marginBottom: 14 }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div className="ske" style={{ height: 20, width: 48 }} />
                      <div className="ske" style={{ height: 38, width: 38, borderRadius: 12 }} />
                    </div>
                  </div>
                </div>
              )) : filtered.map(p => {
                const qty    = cart[p.id] || 0;
                const isLtd  = p.stock <= 10;
                const tagCls = p.tag === "Best Seller" ? "best" : p.tag === "Fast Moving" ? "fast" : "most";
                return (
                  <div key={p.id} className="pcard">
                    <div className="pcard-img" style={{ background: p.bg || "#FFF8E7" }}>
                      {qty === 0 && (isLtd
                        ? <span className="pcard-tag ltd">Limited</span>
                        : p.tag && <span className={`pcard-tag ${tagCls}`}>{p.tag}</span>
                      )}
                      {p.image}
                    </div>
                    <div className="pcard-body">
                      <div className="pcard-name">{p.name}</div>
                      <div className="pcard-unit">{p.unit}</div>
                      <div className="pcard-foot">
                        <div className="pcard-price"><span>₹</span>{p.price}</div>
                        {qty === 0
                          ? <button className="add-btn" onClick={() => handleAdd(p.id)}>+</button>
                          : <div className="stepper">
                              <button className="stpr-btn" onClick={() => handleRem(p.id)}>−</button>
                              <span className="stpr-qty">{qty}</span>
                              <button className="stpr-btn" onClick={() => handleAdd(p.id)}>+</button>
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {count > 0 && (
              <div className="cart-bar">
                <div className="cart-bar-inner">
                  <div className="cb-left">
                    <div className="cb-count">{count} item{count > 1 ? "s" : ""} in cart</div>
                    <div className="cb-total">₹{total}</div>
                  </div>
                  <button className="cb-btn" onClick={() => setScreen("checkout")}>
                    Checkout <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CHECKOUT ── */}
        {screen === "checkout" && step <= 3 && (
          <div className="co-screen">
            <div className="co-hdr">
              <button className="co-back" onClick={step === 1 ? () => setScreen("listing") : () => setStep(step - 1)}>←</button>
              <div className="co-title">{step === 1 ? "Your Order" : step === 2 ? "Delivery Address" : "Payment"}</div>
            </div>
            <div className="step-pills">
              {[1,2,3].map(s => <div key={s} className={`step-pill ${step >= s ? "done" : ""}`} />)}
            </div>
            <div className="co-body">
              {step === 1 && <>
                <div className="del-banner">
                  <div className="del-ic">⚡</div>
                  <div>
                    <div className="del-title">Delivered in 10–20 minutes</div>
                    <div className="del-sub">From Shree Kirana, Station Road</div>
                  </div>
                </div>
                <div className="co-card">
                  <div className="co-card-hdr"><div className="co-card-ic">🛍️</div><div className="co-card-title">Order items ({count})</div></div>
                  {cartItems.map(item => (
                    <div key={item.id} className="oi-row">
                      <div className="oi-img" style={{ background: item.bg || "#FFF8E7" }}>{item.image}</div>
                      <div style={{ flex:1 }}>
                        <div className="oi-name">{item.name}</div>
                        <div className="oi-unit">{item.unit}</div>
                      </div>
                      <div className="oi-stpr">
                        <button className="oi-sbtn" onClick={() => handleRem(item.id)}>−</button>
                        <span className="oi-qty">{item.qty}</span>
                        <button className="oi-sbtn" onClick={() => handleAdd(item.id)}>+</button>
                      </div>
                      <span className="oi-price">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div className="pr-row"><span>Subtotal</span><span>₹{total}</span></div>
                  <div className="pr-row"><span>Delivery fee</span><span className="pr-free">FREE</span></div>
                  <div className="pr-row" style={{ fontSize:11, color:"var(--t3)" }}><span>Taxes & charges</span><span>Included</span></div>
                  <div className="pr-row total"><span>Total</span><span>₹{total}</span></div>
                </div>
              </>}

              {step === 2 && <>
                <div className="co-card" style={{ marginBottom:14 }}>
                  <div className="co-card-hdr"><div className="co-card-ic">📍</div><div className="co-card-title">Saved addresses</div></div>
                  {SAVED_ADDRESSES.map(addr => (
                    <div key={addr.id} className="addr-opt" onClick={() => { setSelAddr(addr.id); setAddingNew(false); }}>
                      <div className={`addr-radio ${selAddr === addr.id && !addingNew ? "sel" : ""}`} />
                      <div>
                        <div className="addr-label-badge">{addr.label}</div>
                        <div className="addr-txt">{addr.address}</div>
                        <div className="addr-lm">📌 {addr.landmark} · 📞 {addr.phone}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {!addingNew
                  ? <button className="add-new-btn" onClick={() => { setAddingNew(true); setSelAddr(null); }}>＋ Add new address</button>
                  : <div className="co-card">
                      <div className="co-card-hdr"><div className="co-card-ic">🏠</div><div className="co-card-title">New address</div></div>
                      <div style={{ padding:18 }}>
                        <div className="f-group">
                          <label className="f-label">Area / Locality *</label>
                          <input className="f-input" placeholder="e.g. Lal Bagh, Nagpur" value={newAddr.area} onChange={e => setNewAddr({ ...newAddr, area: e.target.value })} />
                          {errors.area && <div className="f-err">⚠ {errors.area}</div>}
                        </div>
                        <div className="f-group">
                          <label className="f-label">Landmark *</label>
                          <input className="f-input" placeholder="e.g. Near SBI ATM" value={newAddr.landmark} onChange={e => setNewAddr({ ...newAddr, landmark: e.target.value })} />
                          {errors.landmark && <div className="f-err">⚠ {errors.landmark}</div>}
                        </div>
                        <div className="f-group" style={{ marginBottom:0 }}>
                          <label className="f-label">Contact phone</label>
                          <input className="f-input" placeholder="10-digit mobile" type="tel" value={newAddr.phone} onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })} />
                        </div>
                      </div>
                    </div>
                }
              </>}

              {step === 3 && <>
                <div className="co-card" style={{ marginBottom:14 }}>
                  <div className="co-card-hdr"><div className="co-card-ic">💳</div><div className="co-card-title">Choose payment</div></div>
                  {PAYMENTS.map(p => (
                    <div key={p.id} className={`pay-opt ${p.disabled ? "disabled" : ""}`} onClick={() => !p.disabled && setSelPay(p.id)}>
                      <div className="pay-icon-wrap">{p.icon}</div>
                      <div>
                        <div style={{ display:"flex", alignItems:"center" }}>
                          <span className="pay-name">{p.name}</span>
                          {p.rec && <span className="pay-rec">Recommended</span>}
                        </div>
                        <div className="pay-sub">{p.sub}</div>
                      </div>
                      <div className={`pay-radio ${selPay === p.id ? "sel" : ""}`} />
                    </div>
                  ))}
                </div>
                <div className="mini-sum">
                  <div className="ms-row"><span>Items ({count})</span><span>₹{total}</span></div>
                  <div className="ms-row"><span>Delivery</span><span style={{ color:"var(--gr)", fontWeight:700 }}>FREE</span></div>
                  <div className="ms-total"><span>Total payable</span><span>₹{total}</span></div>
                </div>
                {selAddrObj && (
                  <div style={{ display:"flex", gap:10, padding:"14px 16px", background:"var(--wh)", borderRadius:"var(--r2)", border:"1px solid var(--bd)", boxShadow:"var(--sh)", marginBottom:14 }}>
                    <span style={{ fontSize:20 }}>📍</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:"var(--t1)", marginBottom:3 }}>Delivering to {selAddrObj.label}</div>
                      <div style={{ fontSize:12, color:"var(--t3)" }}>{selAddrObj.address}</div>
                    </div>
                  </div>
                )}
              </>}
            </div>
            <div className="sticky-cta">
              {step === 1 && <button className="pri-btn" onClick={() => setStep(2)}>Continue to Address →</button>}
              {step === 2 && <button className="pri-btn" onClick={() => { if (validateAddr()) setStep(3); }}>Confirm Address →</button>}
              {step === 3 && <button className="pri-btn" onClick={placeOrder}>Place Order · ₹{total}</button>}
            </div>
          </div>
        )}

        {/* ── TRACKING ── */}
        {screen === "tracking" && order && (
          <div className="trk-bg">
            <div className="trk-hdr">
              <button className="trk-back" onClick={() => setScreen("listing")}>←</button>
              <div>
                <div className="trk-title">Order Tracking</div>
                <div className="trk-oid">#{order.id} · {order.vendor}</div>
              </div>
            </div>

            <div className="promise-wrap">
              <div className="pw-icon">{trackStatus === "delivered" ? "🎉" : "⚡"}</div>
              <div>
                <div className="pw-eta">{etaText}</div>
                <div className="pw-sub">From {order.vendor}</div>
                {trackStatus !== "delivered" && (
                  <div className="pw-live"><div className="pw-dot" /><span className="pw-txt">Live tracking active</span></div>
                )}
              </div>
            </div>

            <div className="tl-card">
              {STAGES.map((st, i) => {
                const isDone = i < activeIdx, isActive = i === activeIdx, isFuture = i > activeIdx;
                return (
                  <div key={st.key} className="tl-row">
                    <div className="tl-l">
                      <div className={`tl-ic ${isDone ? "done" : isActive ? "active" : "future"}`}>
                        {isDone ? <span className="tl-check">✓</span> : <span>{st.icon}</span>}
                      </div>
                      {i < STAGES.length - 1 && <div className={`tl-line ${isDone ? "done" : isActive ? "active" : ""}`} />}
                    </div>
                    <div className="tl-r">
                      <div className={`tl-lbl ${isFuture ? "future" : isActive ? "active" : ""}`}>{st.label}</div>
                      {(isDone || isActive) && (
                        <div className={`tl-time ${isActive ? "active" : ""}`}>
                          {isDone ? `✓ ${fmtTime(trackTS[st.key] || new Date())}` : "In progress…"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`live-msg ${trackStatus === "delivered" ? "delivered" : ""}`}>
              <div className="lm-dot" />
              <div className="lm-txt">{stage?.msg}</div>
            </div>

            {activeIdx >= 2 && (
              <div className="rider-card2">
                <div className="rc-lbl">Your delivery partner</div>
                <div className="rc-row">
                  <div className="rc-av">🧑</div>
                  <div>
                    <div className="rc-name">Suresh K.</div>
                    <div className="rc-veh">🛵 MH31 AB 1234</div>
                  </div>
                  <button className="call-btn2">📞</button>
                </div>
              </div>
            )}

            <div className="sum-card">
              <div className="sum-tog" onClick={() => setSumOpen(o => !o)}>
                <div>
                  <div className="sum-tog-lbl">Order Summary</div>
                  <div className="sum-tog-meta">{order.items.length} items · ₹{order.total}</div>
                </div>
                <span className={`chevron ${sumOpen ? "open" : ""}`}>▾</span>
              </div>
              <div className="sum-body" style={{ maxHeight: sumOpen ? 500 : 0 }}>
                {order.items.map((item, i) => (
                  <div key={i} className="si-row2">
                    <span className="si-em">{item.image}</span>
                    <div className="si-inf"><div className="si-n">{item.name}</div><div className="si-u">{item.unit}</div></div>
                    <span className="si-q">×{item.qty}</span>
                    <span className="si-p">₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="sum-tot"><span>Total paid</span><span>₹{order.total}</span></div>
                <div className="sum-addr2">
                  <span style={{ fontSize:16 }}>📍</span>
                  <div className="sa-txt">{order.address}{order.landmark && <><br />Landmark: {order.landmark}</>}</div>
                </div>
              </div>
            </div>

            <div className="trk-btm">
              {trackStatus === "delivered" ? (
                <>
                  <button className="rate-btn2">⭐ Rate your experience</button>
                  <button className="issue-btn2">⚠ Report an issue</button>
                  <button className="help-btn2" onClick={() => { setOrder(null); setScreen("listing"); }}>🛒 Continue Shopping</button>
                </>
              ) : <button className="help-btn2">💬 Need Help?</button>}
            </div>

            <div className="demo-bar">
              <span className="demo-lbl">DEMO</span>
              <div className="demo-btns">
                {STATUS_ORDER.map(s => (
                  <button key={s} className={`demo-btn ${trackStatus === s ? "on" : ""}`} onClick={() => {
                    setAutoPlay(false);
                    timerRefs.current.forEach(clearTimeout);
                    setTrackStatus(s);
                    setTrackTS(ts => ({ ...ts, [s]: new Date() }));
                  }}>{s}</button>
                ))}
                <span style={{ fontSize:10, color:"rgba(255,255,255,.3)", cursor:"pointer", marginLeft:4 }} onClick={() => { setAutoPlay(true); setTrackStatus("placed"); setTrackTS({ placed: new Date() }); }}>↺</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
