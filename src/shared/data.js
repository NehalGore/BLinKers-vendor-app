export const VENDOR = { name: "Shree Kirana Store", area: "Station Road, Nagpur", upi: "shreekirana@upi" };

export const PRODUCTS = [
  { id:1,  name:"Amul Full Cream Milk",   sku:"DRY001", unit:"500ml",  category:"Dairy",        stock:4,  safetyStock:12, reorderPt:8,  avgDaily:6.2, fastMoving:true,  listed:true,  image:"🥛", price:28  },
  { id:2,  name:"Parle-G Biscuits",        sku:"SNK001", unit:"800g",   category:"Snacks",       stock:22, safetyStock:15, reorderPt:10, avgDaily:7.8, fastMoving:true,  listed:true,  image:"🍪", price:50  },
  { id:3,  name:"Britannia Bread",         sku:"ESS001", unit:"400g",   category:"Essentials",   stock:6,  safetyStock:10, reorderPt:6,  avgDaily:5.4, fastMoving:true,  listed:true,  image:"🍞", price:45  },
  { id:4,  name:"Fortune Sunflower Oil",   sku:"ESS002", unit:"1L",     category:"Essentials",   stock:0,  safetyStock:6,  reorderPt:4,  avgDaily:2.8, fastMoving:false, listed:false, image:"🫙", price:149 },
  { id:5,  name:"Maggi Noodles",           sku:"INS001", unit:"4-pack", category:"Instant Food", stock:18, safetyStock:12, reorderPt:8,  avgDaily:6.9, fastMoving:true,  listed:true,  image:"🍜", price:68  },
  { id:6,  name:"Tata Salt",               sku:"ESS003", unit:"1kg",    category:"Essentials",   stock:3,  safetyStock:8,  reorderPt:5,  avgDaily:2.1, fastMoving:false, listed:true,  image:"🧂", price:26  },
  { id:7,  name:"Coca-Cola",               sku:"BEV001", unit:"750ml",  category:"Beverages",    stock:0,  safetyStock:10, reorderPt:6,  avgDaily:3.9, fastMoving:false, listed:false, image:"🥤", price:40  },
  { id:8,  name:"Dettol Handwash",         sku:"PRC001", unit:"250ml",  category:"Personal Care",stock:8,  safetyStock:6,  reorderPt:4,  avgDaily:1.5, fastMoving:false, listed:true,  image:"🧴", price:89  },
  { id:9,  name:"Haldiram's Aloo Bhujia", sku:"SNK002", unit:"200g",   category:"Snacks",       stock:5,  safetyStock:10, reorderPt:6,  avgDaily:4.1, fastMoving:true,  listed:true,  image:"🟡", price:55  },
  { id:10, name:"Amul Butter",             sku:"DRY002", unit:"100g",   category:"Dairy",        stock:14, safetyStock:8,  reorderPt:5,  avgDaily:3.3, fastMoving:false, listed:true,  image:"🧈", price:58  },
  { id:11, name:"Nescafé Classic",         sku:"BEV002", unit:"50g",    category:"Beverages",    stock:7,  safetyStock:6,  reorderPt:4,  avgDaily:2.2, fastMoving:false, listed:true,  image:"☕", price:119 },
  { id:12, name:"Vim Bar",                 sku:"HLD001", unit:"200g",   category:"Household",    stock:0,  safetyStock:8,  reorderPt:4,  avgDaily:1.8, fastMoving:false, listed:false, image:"🫧", price:32  },
  { id:13, name:"Poha",                    sku:"ESS004", unit:"500g",   category:"Essentials",   stock:11, safetyStock:8,  reorderPt:5,  avgDaily:2.6, fastMoving:false, listed:true,  image:"🍚", price:38  },
  { id:14, name:"Good Day Cookies",        sku:"SNK003", unit:"150g",   category:"Snacks",       stock:3,  safetyStock:8,  reorderPt:5,  avgDaily:3.4, fastMoving:true,  listed:true,  image:"🍪", price:30  },
  { id:15, name:"Clinic Plus Shampoo",     sku:"PRC002", unit:"80ml",   category:"Personal Care",stock:9,  safetyStock:6,  reorderPt:4,  avgDaily:1.2, fastMoving:false, listed:true,  image:"🧴", price:35  },
  { id:16, name:"Sprite",                  sku:"BEV003", unit:"1L",     category:"Beverages",    stock:16, safetyStock:8,  reorderPt:5,  avgDaily:2.9, fastMoving:false, listed:true,  image:"🫙", price:55  },
];

export const CATEGORIES = ["All","Essentials","Snacks","Beverages","Dairy","Instant Food","Personal Care","Household"];

export const SAVED_ADDRESSES = [
  { id:1, label:"Home", address:"Near Hanuman Mandir, Lal Bagh", landmark:"Opposite SBI ATM",         phone:"9876543210" },
  { id:2, label:"Work", address:"2nd Floor, Shree Complex, Station Road", landmark:"Above Bajaj Showroom", phone:"9876543210" },
];

export const SEED_COMPLETED_ORDERS = [
  { id:"BLK904101", completedAt:new Date(Date.now()-3*3600000),    area:"Lal Bagh",    payment:"COD",    amount:284, refund:0,   items:[{productId:2,qty:2},{productId:5,qty:2},{productId:6,qty:2}] },
  { id:"BLK904147", completedAt:new Date(Date.now()-2.5*3600000),  area:"Dharampeth",  payment:"Online", amount:196, refund:0,   items:[{productId:1,qty:4},{productId:8,qty:1}] },
  { id:"BLK904189", completedAt:new Date(Date.now()-2*3600000),    area:"Civil Lines", payment:"Online", amount:458, refund:45,  items:[{productId:11,qty:1},{productId:4,qty:2},{productId:2,qty:1}] },
  { id:"BLK904212", completedAt:new Date(Date.now()-1.5*3600000),  area:"Sitabuldi",   payment:"COD",    amount:174, refund:0,   items:[{productId:1,qty:3},{productId:5,qty:1},{productId:14,qty:2}] },
  { id:"BLK904256", completedAt:new Date(Date.now()-0.8*3600000),  area:"Lal Bagh",    payment:"Online", amount:321, refund:0,   items:[{productId:9,qty:3},{productId:16,qty:2},{productId:10,qty:1}] },
  { id:"BLK904289", completedAt:new Date(Date.now()-0.3*3600000),  area:"Ramdaspeth",  payment:"COD",    amount:139, refund:139, items:[{productId:13,qty:2},{productId:6,qty:3}] },
];

export const MOCK_ACTIVE_ORDERS = [
  { id:"BLK904321", status:"new",      placedAt:new Date(Date.now()-55000),  area:"Lal Bagh",    landmark:"Near SBI ATM", payment:"COD",    checkedItems:{}, items:[{productId:2,qty:2},{productId:1,qty:3},{productId:5,qty:1},{productId:6,qty:1}] },
  { id:"BLK904298", status:"accepted", placedAt:new Date(Date.now()-195000), area:"Civil Lines", landmark:"Opp. D-Mart",  payment:"Online", checkedItems:{}, items:[{productId:3,qty:2},{productId:7,qty:4},{productId:4,qty:1}] },
];

export const ISSUES_LIST = [
  { id:"out_of_stock", label:"Item out of stock",      icon:"📦" },
  { id:"wrong_qty",    label:"Can't fulfill quantity", icon:"🔢" },
  { id:"damaged",      label:"Item damaged / expired", icon:"🚫" },
  { id:"other",        label:"Other issue",            icon:"💬" },
];

export const SLA_SECONDS        = 300;
export const PLATFORM_FEE_RATE  = 0.02;
export const DELIVERY_FEE_FIXED = 10;
export const ADD_PRESETS        = [5, 10, 20, 50];
