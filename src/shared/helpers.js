export const getStockStatus   = (p) => p.stock===0 ? "out" : p.stock<=p.reorderPt ? "low" : p.stock<=p.safetyStock ? "warn" : "ok";
export const suggestedReorder = (p) => Math.max(0, Math.round(p.avgDaily*7 - p.stock));
export const fmtINR           = (n) => "₹" + Number(n).toFixed(2).replace(/\.00$/,"").replace(/\B(?=(\d{3})+(?!\d))/g,",");
export const fmtTime          = (d) => d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
export const fmtDate          = (d) => d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
export const cartTotal        = (cart, products) => Object.entries(cart).reduce((s,[id,q])=>{const p=products.find(x=>x.id===Number(id));return s+(p?p.price*q:0);},0);
export const cartCount        = (cart) => Object.values(cart).reduce((s,v)=>s+v,0);
export const calcOrderTotal   = (order, products) => order.items.reduce((s,it)=>{const p=products.find(x=>x.id===it.productId);return s+(p?p.price*it.qty:0);},0);
export const genOrderId       = () => "BLK" + Math.floor(100000+Math.random()*900000);
