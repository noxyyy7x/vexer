import{useState,useEffect,useRef}from"react";
import{motion,AnimatePresence}from"framer-motion";
import{sanity}from"./sanity.js";

const fmt=p=>`£${Number(p).toFixed(2)}`;

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
body{background:#050508;color:#fff;font-family:'Inter',sans-serif;overflow-x:hidden;}
.orb{font-family:'Orbitron',sans-serif;}

/* NAV */
.vx-nav{position:fixed;top:0;left:0;right:0;z-index:500;transition:all 0.4s;}
.vx-nav.scrolled{background:rgba(5,5,8,0.92);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,0.06);}

/* BUTTONS */
.vx-btn{font-family:'Orbitron',sans-serif;font-weight:600;letter-spacing:0.12em;border:none;cursor:pointer;transition:all 0.3s;display:inline-flex;align-items:center;justify-content:center;gap:8px;}
.vx-btn-white{background:#fff;color:#050508;border-radius:4px;}
.vx-btn-white:hover{background:#e8e8e8;transform:translateY(-1px);}
.vx-btn-outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.4);border-radius:4px;}
.vx-btn-outline:hover{background:rgba(255,255,255,0.08);border-color:#fff;}
.vx-btn-dark{background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:4px;}
.vx-btn-dark:hover{background:rgba(255,255,255,0.15);}

/* INPUTS */
.vx-input{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:4px;padding:12px 16px;color:#fff;font-family:'Inter',sans-serif;font-size:14px;outline:none;transition:border 0.3s;}
.vx-input:focus{border-color:rgba(255,255,255,0.4);}
.vx-input::placeholder{color:rgba(255,255,255,0.3);}
select.vx-input option{background:#0a0a0f;color:#fff;}

/* CARDS */
.vx-card{background:#0a0a0f;border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;transition:all 0.4s;cursor:pointer;}
.vx-card:hover{border-color:rgba(255,255,255,0.2);transform:translateY(-6px);box-shadow:0 24px 48px rgba(0,0,0,0.5);}

/* GLASS */
.vx-glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);border-radius:8px;}

/* DIVIDER */
.vx-divider{height:1px;background:rgba(255,255,255,0.06);width:100%;}

/* SCROLLBAR */
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#050508;}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:2px;}

/* MOBILE */
@media(max-width:768px){
  .hide-mobile{display:none!important;}
  .mobile-col{flex-direction:column!important;}
  .mobile-full{width:100%!important;}
  .mobile-grid-1{grid-template-columns:1fr!important;}
  .mobile-grid-2{grid-template-columns:1fr 1fr!important;}
  .mobile-menu-btn{display:flex!important;}
  .mobile-pad{padding:0 16px!important;}
  .mobile-text-sm{font-size:clamp(2rem,8vw,3rem)!important;}
}
`;

// ── NAVBAR ────────────────────────────────────────────────────────────────────
const GENDERS=["MEN","WOMEN","KIDS","BABIES"];

function Navbar({page,setPage,cartCount,onCart,products,wishlist}){
  const [sc,setSc]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [searchQ,setSearchQ]=useState("");
  const [searchResults,setSearchResults]=useState([]);

  useEffect(()=>{
    const fn=()=>setSc(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    if(!searchQ.trim()){setSearchResults([]);return;}
    const q=searchQ.toLowerCase();
    const r=(products||[]).filter(p=>
      p.name?.toLowerCase().includes(q)||
      p.team?.toLowerCase().includes(q)||
      p.league?.toLowerCase().includes(q)||
      p.brand?.toLowerCase().includes(q)
    ).slice(0,6);
    setSearchResults(r);
  },[searchQ,products]);

  return(
    <nav className={`vx-nav${sc?" scrolled":""}`}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 24px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        
        {/* Logo */}
        <div onClick={()=>{setPage("home");setMenuOpen(false);}} style={{cursor:"pointer",flexShrink:0}}>
          <img src="/logo.png" alt="Vexer" style={{height:36,width:"auto"}}/>
        </div>

        {/* Desktop Gender Nav */}
        <div style={{display:"flex",gap:2,alignItems:"center"}} className="hide-mobile">
          {GENDERS.map(g=>{
            const gKey=g.toLowerCase();
            return(
              <button key={g} onClick={()=>setPage("gender_"+gKey)} className="vx-btn"
                style={{padding:"8px 20px",fontSize:11,background:"none",color:page==="gender_"+gKey?"#fff":"rgba(255,255,255,0.5)",borderBottom:page==="gender_"+gKey?"2px solid #fff":"2px solid transparent",borderRadius:0,letterSpacing:"0.15em"}}>
                {g}
              </button>
            );
          })}
          <div style={{width:1,height:20,background:"rgba(255,255,255,0.15)",margin:"0 8px"}}/>
          {[["REVIEWS","reviews"],["CONTACT","contact"]].map(([label,p])=>(
            <button key={p} onClick={()=>setPage(p)} className="vx-btn"
              style={{padding:"8px 16px",fontSize:11,background:"none",color:page===p?"#fff":"rgba(255,255,255,0.4)",borderBottom:page===p?"2px solid #fff":"2px solid transparent",borderRadius:0,letterSpacing:"0.15em"}}>
              {label}
            </button>
          ))}
        </div>

        {/* Right icons */}
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {/* Search */}
          <div style={{position:"relative"}}>
            <button onClick={()=>{setSearchOpen(!searchOpen);setSearchQ("");}} style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:20,color:"rgba(255,255,255,0.7)",transition:"color 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}>🔍</button>
            <AnimatePresence>
              {searchOpen&&(
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                  style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:340,zIndex:100}}>
                  <div className="vx-glass" style={{padding:16,borderRadius:8,boxShadow:"0 20px 40px rgba(0,0,0,0.6)"}}>
                    <input className="vx-input" placeholder="Search teams, leagues..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} autoFocus/>
                    {searchResults.length>0&&(
                      <div style={{marginTop:8}}>
                        {searchResults.map(p=>(
                          <div key={p.id} onClick={()=>{setPage("product_"+p.id);setSearchOpen(false);setSearchQ("");}}
                            style={{display:"flex",alignItems:"center",gap:12,padding:"10px 8px",borderRadius:6,cursor:"pointer",transition:"background 0.2s"}}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <img src={p.img} alt={p.name} style={{width:44,height:44,objectFit:"cover",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)"}}/>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{p.team}</div>
                              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.name}</div>
                            </div>
                            <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{fmt(p.currentPrice||p.originalPrice)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchQ&&!searchResults.length&&(
                      <div style={{padding:"16px 0",textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.3)"}}>No results found</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist */}
          <button onClick={()=>setPage("wishlist")} style={{background:"none",border:"none",cursor:"pointer",padding:"8px",fontSize:20,color:"rgba(255,255,255,0.7)",transition:"color 0.2s",position:"relative"}}
            onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}>
            🤍
            {wishlist?.length>0&&<span style={{position:"absolute",top:-4,right:-4,background:"#fff",color:"#050508",borderRadius:"50%",width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontFamily:"'Orbitron',sans-serif"}}>{wishlist.length}</span>}
          </button>

          {/* Cart */}
          <button onClick={onCart} className="vx-btn vx-btn-white" style={{padding:"8px 16px",fontSize:10,borderRadius:4,position:"relative"}}>
            <span className="orb" style={{fontSize:9,letterSpacing:"0.15em"}}>CART</span>
            {cartCount>0&&<span style={{background:"#050508",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:9,display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{cartCount}</span>}
          </button>

          {/* Hamburger mobile */}
          <button onClick={()=>setMenuOpen(!menuOpen)} className="vx-btn vx-btn-dark mobile-menu-btn" style={{padding:"8px 10px",borderRadius:4,display:"none",flexDirection:"column",gap:4}}>
            <div style={{width:18,height:1.5,background:"#fff",transition:"all 0.3s",transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none"}}/>
            <div style={{width:18,height:1.5,background:"#fff",opacity:menuOpen?0:1,transition:"all 0.3s"}}/>
            <div style={{width:18,height:1.5,background:"#fff",transition:"all 0.3s",transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none"}}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen&&(
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{background:"rgba(5,5,8,0.98)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{padding:"24px"}}>
              <div style={{marginBottom:20}}>
                <input className="vx-input" placeholder="Search jerseys..." value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
                {searchResults.map(p=>(
                  <div key={p.id} onClick={()=>{setPage("product_"+p.id);setMenuOpen(false);}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"8px",borderRadius:6,cursor:"pointer",marginTop:4}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <img src={p.img} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:4}}/>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{p.team}</div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{p.name}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="vx-divider" style={{marginBottom:20}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {GENDERS.map(g=>(
                  <button key={g} onClick={()=>{setPage("gender_"+g.toLowerCase());setMenuOpen(false);}}
                    className="vx-btn vx-btn-dark" style={{padding:"12px",fontSize:10,letterSpacing:"0.15em",justifyContent:"center"}}>
                    {g}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                {[["REVIEWS","reviews"],["CONTACT","contact"]].map(([label,p])=>(
                  <button key={p} onClick={()=>{setPage(p);setMenuOpen(false);}} className="vx-btn vx-btn-outline" style={{flex:1,padding:"10px",fontSize:9,letterSpacing:"0.15em"}}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── COOKIE CONSENT ────────────────────────────────────────────────────────────
function CookieConsent(){
  const [show,setShow]=useState(false);
  useEffect(()=>{if(!localStorage.getItem("vexer_cookies"))setTimeout(()=>setShow(true),2000);},[]);
  if(!show) return null;
  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
      style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99998,width:"100%",background:"rgba(10,10,15,0.98)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"16px 20px",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:12,boxShadow:"0 8px 32px rgba(0,0,0,0.8)"}}>
      <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",margin:0,flex:1}}>We use cookies to improve your experience on <span style={{color:"#fff"}}>vexer.org</span></p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{localStorage.setItem("vexer_cookies","rejected");setShow(false);}} className="vx-btn vx-btn-outline" style={{padding:"7px 16px",fontSize:9}}>REJECT</button>
        <button onClick={()=>{localStorage.setItem("vexer_cookies","accepted");setShow(false);}} className="vx-btn vx-btn-white" style={{padding:"7px 16px",fontSize:9}}>ACCEPT</button>
      </div>
    </motion.div>
  );
}

// ── DISCORD WIDGET ────────────────────────────────────────────────────────────
function DiscordWidget(){
  const [showPopup,setShowPopup]=useState(false);
  const [dismissed,setDismissed]=useState(()=>localStorage.getItem("vexer_discord")==="true");
  useEffect(()=>{if(!dismissed){const t=setTimeout(()=>setShowPopup(true),3000);return()=>clearTimeout(t);}},[dismissed]);
  const dismiss=()=>{setShowPopup(false);setDismissed(true);localStorage.setItem("vexer_discord","true");};
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:99997,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
      <AnimatePresence>
        {showPopup&&(
          <motion.div initial={{opacity:0,y:10,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.95}}
            className="vx-glass" style={{padding:"16px 20px",maxWidth:240,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em"}}>NEED HELP?</span>
              <button onClick={dismiss} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6,marginBottom:12}}>Can't find your jersey? Chat with us on Discord!</p>
            <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer"
              style={{display:"block",textAlign:"center",padding:"9px",background:"#5865f2",color:"#fff",borderRadius:6,textDecoration:"none",fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.12em"}}>
              JOIN DISCORD →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" whileHover={{scale:1.1}} whileTap={{scale:0.95}}
        style={{width:50,height:50,borderRadius:"50%",background:"#5865f2",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(88,101,242,0.5)",textDecoration:"none",fontSize:22}}>
        💬
      </motion.a>
    </div>
  );
}

// ── JERSEY CARD ───────────────────────────────────────────────────────────────
function JCard({jersey,index,onAdd,setPage,wishlist,onWishlist}){
  const [hov,setHov]=useState(false);
  const [added,setAdded]=useState(false);
  const price=jersey.currentPrice||jersey.originalPrice;
  const hasDiscount=jersey.currentPrice&&jersey.currentPrice<jersey.originalPrice;
  const isLowStock=jersey.trackStock&&jersey.stockQuantity<=jersey.lowStockThreshold&&jersey.stockQuantity>0;
  const isOutOfStock=jersey.trackStock&&!jersey.inStock;
  const isCustom=jersey.hasPlayerName||jersey.hasBadge||jersey.hasNotes;
  const isWishlisted=wishlist?.includes(jersey.id);

  const add=e=>{
    e.stopPropagation();
    if(isOutOfStock) return;
    if(isCustom){setPage("product_"+jersey.id);return;}
    onAdd({...jersey,cartId:jersey.id+"_"+Date.now(),qty:1,price});
    setAdded(true);setTimeout(()=>setAdded(false),1600);
  };

  return(
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:index*0.05}}
      className="vx-card" onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={()=>setPage("product_"+jersey.id)} style={{opacity:isOutOfStock?0.5:1}}>

      {/* Image */}
      <div style={{position:"relative",aspectRatio:"3/4",overflow:"hidden",background:"#0d0d12"}}>
        <img src={jersey.img} alt={jersey.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.6s ease",transform:hov?"scale(1.06)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 50%,rgba(5,5,8,0.9) 100%)"}}/>

        {/* Wishlist */}
        <button onClick={e=>{e.stopPropagation();onWishlist(jersey.id);}} style={{position:"absolute",top:12,right:12,background:"rgba(5,5,8,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,transition:"all 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.15)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(5,5,8,0.6)"}>
          {isWishlisted?"❤️":"🤍"}
        </button>

        {/* Badges */}
        {jersey.tag&&<div style={{position:"absolute",top:12,left:12,background:"#fff",color:"#050508",fontSize:8,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.2em",padding:"3px 10px",borderRadius:2,fontWeight:700}}>{jersey.tag}</div>}
        {isLowStock&&<div style={{position:"absolute",bottom:12,left:12,background:"rgba(239,68,68,0.9)",color:"#fff",fontSize:8,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.15em",padding:"3px 8px",borderRadius:2}}>LOW STOCK</div>}
        {isOutOfStock&&<div style={{position:"absolute",bottom:12,left:12,background:"rgba(100,100,100,0.9)",color:"#fff",fontSize:8,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.15em",padding:"3px 8px",borderRadius:2}}>SOLD OUT</div>}
        {jersey.kitType&&!isLowStock&&!isOutOfStock&&<div style={{position:"absolute",bottom:12,left:12,background:"rgba(5,5,8,0.7)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.7)",fontSize:7,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.15em",padding:"3px 8px",borderRadius:2}}>{jersey.kitType.toUpperCase()}</div>}
      </div>

      {/* Info */}
      <div style={{padding:"16px"}}>
        <div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.4)",letterSpacing:"0.2em",marginBottom:4}}>{jersey.team?.toUpperCase()}</div>
        <div style={{fontSize:14,fontWeight:600,color:hov?"rgba(255,255,255,0.8)":"#fff",transition:"color 0.3s",marginBottom:4,lineHeight:1.3}}>{jersey.name}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:12}}>{jersey.brand}{jersey.season?` · ${jersey.season}`:""}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            {hasDiscount&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",textDecoration:"line-through",marginBottom:2}}>{fmt(jersey.originalPrice)}</div>}
            <div style={{fontSize:16,fontFamily:"'Orbitron',sans-serif",fontWeight:700,color:hasDiscount?"#4ade80":"#fff"}}>{fmt(price)}</div>
          </div>
          <button className="vx-btn" onClick={add} style={{padding:"8px 16px",fontSize:8,letterSpacing:"0.15em",background:isOutOfStock?"rgba(255,255,255,0.08)":added?"#16a34a":"#fff",color:isOutOfStock||added?"#fff":"#050508",borderRadius:4,fontWeight:700}}>
            {isOutOfStock?"SOLD OUT":added?"✓ ADDED":isCustom?"CUSTOMISE":"ADD"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── CART PANEL ────────────────────────────────────────────────────────────────
function CartPanel({items,onClose,onRemove,setPage}){
  const total=items.reduce((s,i)=>s+(i.price||i.currentPrice||i.originalPrice)*i.qty,0);
  return(
    <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"tween",ease:[0.76,0,0.24,1],duration:0.4}}
      style={{position:"fixed",top:0,right:0,bottom:0,width:"min(420px,100vw)",background:"rgba(5,5,8,0.99)",backdropFilter:"blur(28px)",borderLeft:"1px solid rgba(255,255,255,0.08)",zIndex:10000,display:"flex",flexDirection:"column",padding:"28px 24px"}}>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:-1}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,paddingBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div>
          <div className="orb" style={{fontSize:13,letterSpacing:"0.3em",color:"#fff"}}>YOUR CART</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:3}}>{items.length} item{items.length!==1?"s":""}</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",width:32,height:32,cursor:"pointer",fontSize:16,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
        {items.length===0?(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
            <div className="orb" style={{fontSize:32,color:"rgba(255,255,255,0.1)"}}>V</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>Your cart is empty</p>
            <button className="vx-btn vx-btn-outline" style={{padding:"10px 20px",fontSize:9}} onClick={()=>{onClose();setPage("gender_men");}}>BROWSE JERSEYS</button>
          </div>
        ):(
          <AnimatePresence>
            {items.map(item=>(
              <motion.div key={item.cartId} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}}
                style={{display:"flex",gap:12,padding:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8}}>
                <img src={item.img} alt={item.name} style={{width:60,height:60,objectFit:"cover",borderRadius:6,flexShrink:0,border:"1px solid rgba(255,255,255,0.08)"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:2}}>{item.team}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{item.name}</div>
                  {item.selectedGender&&<div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Gender: {item.selectedGender}</div>}
                  {item.selectedSize&&<div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Size: {item.selectedSize}</div>}
                  {item.playerName&&<div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Name: {item.playerName} #{item.playerNumber}</div>}
                  <div style={{fontSize:14,fontFamily:"'Orbitron',sans-serif",fontWeight:700,color:"#fff",marginTop:6}}>{fmt((item.price||item.currentPrice||item.originalPrice)*item.qty)}</div>
                </div>
                <button onClick={()=>onRemove(item.cartId)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:18,lineHeight:1,alignSelf:"flex-start"}}
                  onMouseEnter={e=>e.target.style.color="#ef4444"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.2)"}>×</button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {items.length>0&&(
        <div style={{marginTop:20,paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Shipping</span>
            <span style={{fontSize:11,color:"#4ade80",fontFamily:"'Orbitron',sans-serif"}}>INCLUDED</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.2em",color:"rgba(255,255,255,0.5)"}}>TOTAL</span>
            <span style={{fontSize:22,fontFamily:"'Orbitron',sans-serif",fontWeight:700,color:"#fff"}}>{fmt(total)}</span>
          </div>
          <button className="vx-btn vx-btn-white" style={{width:"100%",padding:"15px",fontSize:10,letterSpacing:"0.2em",marginBottom:10}}
            onClick={async()=>{
              try{
                const res=await fetch('/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});
                const data=await res.json();
                if(data.url)window.location.href=data.url;
              }catch(e){console.error(e);}
            }}>PROCEED TO CHECKOUT</button>
          <p style={{textAlign:"center",fontSize:9,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.2)",letterSpacing:"0.12em"}}>SECURE · ENCRYPTED · WORLDWIDE</p>
        </div>
      )}
    </motion.div>
  );
}

// ── HERO CAROUSEL ─────────────────────────────────────────────────────────────
function HeroCarousel({setPage}){
  const [current,setCurrent]=useState(0);
  const slides=[
    {key:"national",label:"NATIONAL",sub:"Club Jerseys",desc:"The world's greatest club kits. Premier League, La Liga, Serie A and more.",cta:"SHOP NATIONAL",page:"gender_men",color:"#fff",bg:"linear-gradient(135deg,#0a0a14 0%,#0d1a2e 100%)"},
    {key:"international",label:"INTERNATIONAL",sub:"Country Kits",desc:"Represent your nation. International kits from every corner of the globe.",cta:"SHOP INTERNATIONAL",page:"gender_men",color:"#fff",bg:"linear-gradient(135deg,#0a0a0a 0%,#1a0a0a 100%)"},
    {key:"retro",label:"RETRO",sub:"Classic Kits",desc:"Iconic jerseys from football's greatest eras. Own a piece of history.",cta:"SHOP RETRO",page:"gender_men",color:"#fff",bg:"linear-gradient(135deg,#0a0a0a 0%,#1a1a0a 100%)"},
  ];

  useEffect(()=>{
    const t=setInterval(()=>setCurrent(c=>(c+1)%slides.length),5000);
    return()=>clearInterval(t);
  },[]);

  return(
    <div style={{height:"100vh",position:"relative",overflow:"hidden",paddingTop:64}}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}}
          style={{position:"absolute",inset:0,background:slides[current].bg}}>
          {/* Grid pattern */}
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",backgroundSize:"80px 80px"}}/>
          {/* Glow */}
          <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:600,background:"radial-gradient(circle,rgba(255,255,255,0.04) 0%,transparent 70%)",borderRadius:"50%"}}/>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div style={{position:"relative",zIndex:1,height:"100%",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"0 24px"}}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:0.6}}>
            <div className="orb" style={{fontSize:11,letterSpacing:"0.6em",color:"rgba(255,255,255,0.4)",marginBottom:16}}>{slides[current].sub.toUpperCase()}</div>
            <h1 className="orb mobile-text-sm" style={{fontSize:"clamp(3rem,10vw,8rem)",fontWeight:900,color:"#fff",lineHeight:0.9,marginBottom:24,letterSpacing:"-0.02em"}}>{slides[current].label}</h1>
            <p style={{fontSize:"clamp(13px,1.5vw,16px)",color:"rgba(255,255,255,0.5)",marginBottom:40,maxWidth:480,margin:"0 auto 40px",lineHeight:1.7}}>{slides[current].desc}</p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="vx-btn vx-btn-white" style={{padding:"14px 36px",fontSize:10,letterSpacing:"0.2em"}} onClick={()=>setPage(slides[current].page)}>{slides[current].cta}</button>
              <button className="vx-btn vx-btn-outline" style={{padding:"14px 36px",fontSize:10,letterSpacing:"0.2em"}} onClick={()=>setPage("gender_men")}>ALL JERSEYS</button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8,zIndex:1}}>
        {slides.map((_,i)=>(
          <button key={i} onClick={()=>setCurrent(i)} style={{width:i===current?32:8,height:3,background:i===current?"#fff":"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",borderRadius:2,transition:"all 0.4s"}}/>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{position:"absolute",bottom:32,right:32,zIndex:1}}>
        <div className="orb" style={{fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)",writingMode:"vertical-rl"}}>SCROLL</div>
      </div>
    </div>
  );
}

// ── GENDER STRIP ──────────────────────────────────────────────────────────────
function GenderStrip({setPage}){
  const genders=[
    {key:"men",label:"MEN'S",sub:"All Men's Jerseys"},
    {key:"women",label:"WOMEN'S",sub:"All Women's Jerseys"},
    {key:"kids",label:"KIDS'",sub:"All Kids' Jerseys"},
    {key:"babies",label:"BABIES'",sub:"All Baby Jerseys"},
  ];
  return(
    <section style={{padding:"80px 24px",background:"rgba(255,255,255,0.01)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>SHOP BY</div>
          <h2 className="orb" style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:800,color:"#fff"}}>FIND YOUR FIT</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="mobile-grid-2">
          {genders.map(({key,label,sub},i)=>(
            <motion.div key={key} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.1}}
              onClick={()=>setPage("gender_"+key)}
              style={{padding:"32px 24px",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,cursor:"pointer",textAlign:"center",transition:"all 0.3s",background:"rgba(255,255,255,0.02)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.background="rgba(255,255,255,0.02)";}}>
              <div className="orb" style={{fontSize:"clamp(1.2rem,2.5vw,2rem)",fontWeight:800,color:"#fff",marginBottom:8}}>{label}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{sub}</div>
              <div className="orb" style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:12,letterSpacing:"0.2em"}}>SHOP →</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FEATURED JERSEYS ──────────────────────────────────────────────────────────
function FeaturedJerseys({products,onAdd,setPage,wishlist,onWishlist}){
  const featured=(products||[]).filter(p=>p.featured).slice(0,8);
  if(!featured.length) return null;
  return(
    <section style={{padding:"80px 24px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40,flexWrap:"wrap",gap:16}}>
          <div>
            <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:8}}>FEATURED</div>
            <h2 className="orb" style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:800,color:"#fff"}}>TOP PICKS</h2>
          </div>
          <button className="vx-btn vx-btn-outline" style={{padding:"10px 24px",fontSize:9,letterSpacing:"0.2em"}} onClick={()=>setPage("gender_men")}>VIEW ALL →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
          {featured.map((j,i)=><JCard key={j.id} jersey={j} index={i} onAdd={onAdd} setPage={setPage} wishlist={wishlist} onWishlist={onWishlist}/>)}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks(){
  return(
    <section style={{padding:"80px 24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>SIMPLE PROCESS</div>
          <h2 className="orb" style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:800,color:"#fff"}}>HOW IT WORKS</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40}} className="mobile-grid-1">
          {[
            {n:"01",t:"Browse & Select",s:"Find your perfect jersey from our collection of club, international and retro kits."},
            {n:"02",t:"Place Your Order",s:"Choose size, add player name/number if desired and checkout securely worldwide."},
            {n:"03",t:"We Source & Deliver",s:"We source your jersey and ship directly to your door. Worldwide delivery included."},
          ].map(({n,t,s},i)=>(
            <motion.div key={n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,delay:i*0.15}}
              style={{textAlign:"center",padding:"32px 24px"}}>
              <div className="orb" style={{fontSize:48,fontWeight:900,color:"rgba(255,255,255,0.06)",marginBottom:16,lineHeight:1}}>{n}</div>
              <div className="orb" style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:10,letterSpacing:"0.05em"}}>{t}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>{s}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TRUST BADGES ──────────────────────────────────────────────────────────────
function TrustBadges(){
  return(
    <div style={{padding:"24px",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1400,margin:"0 auto",display:"flex",justifyContent:"center",flexWrap:"wrap",gap:40}}>
        {[["🌍","Worldwide Delivery"],["🔒","Secure Checkout"],["⚡","Fast Processing"],["💬","Discord Support"],["✅","Premium Quality"]].map(([icon,label])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{icon}</span>
            <span className="orb" style={{fontSize:9,letterSpacing:"0.15em",color:"rgba(255,255,255,0.4)"}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DISCORD CTA ───────────────────────────────────────────────────────────────
function DiscordCTA(){
  return(
    <section style={{padding:"80px 24px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div style={{fontSize:40,marginBottom:16}}>💬</div>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>COMMUNITY</div>
          <h2 className="orb" style={{fontSize:"clamp(1.5rem,3vw,2.2rem)",fontWeight:800,color:"#fff",marginBottom:12}}>CAN'T FIND YOUR JERSEY?</h2>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.8,marginBottom:32}}>Join our Discord and open a ticket. We'll source any jersey you're looking for.</p>
          <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-white"
            style={{padding:"14px 36px",fontSize:10,letterSpacing:"0.2em",textDecoration:"none",display:"inline-flex"}}>
            JOIN DISCORD →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ── REVIEWS PAGE ──────────────────────────────────────────────────────────────
function ReviewsPage(){
  const [reviews,setReviews]=useState([]);
  const [form,setForm]=useState({name:"",rating:5,comment:""});
  const [image,setImage]=useState(null);
  const [imagePreview,setImagePreview]=useState(null);
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [err,setErr]=useState("");

  useEffect(()=>{
    sanity.fetch(`*[_type=="review"&&approved==true]|order(submittedAt desc){
      name,rating,comment,submittedAt,"image":image.asset->url
    }`).then(setReviews).catch(()=>{});
  },[]);

  const handleImage=e=>{
    const file=e.target.files[0];
    if(!file) return;
    setImage(file);
    const reader=new FileReader();
    reader.onload=ev=>setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit=async()=>{
    if(!form.name||!form.comment){setErr("Please fill in your name and review.");return;}
    setErr("");setSending(true);
    try{
      const res=await fetch('/api/submit-review',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...form}),
      });
      const data=await res.json();
      if(data.success){setSent(true);}
      else{setErr("Failed to submit. Please try again.");}
    }catch(e){setErr("Failed to submit. Please try again.");}
    setSending(false);
  };

  const stars=n=>Array.from({length:5},(_,i)=>(
    <span key={i} style={{fontSize:16,opacity:i<n?1:0.2}}>⭐</span>
  ));

  return(
    <div style={{paddingTop:64,minHeight:"100vh"}}>
      <div style={{padding:"60px 24px 40px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>VEXER · REVIEWS</div>
        <h1 className="orb" style={{fontSize:"clamp(2rem,5vw,4rem)",fontWeight:900,color:"#fff",marginBottom:12}}>CUSTOMER REVIEWS</h1>
        {reviews.length>0&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:8}}>
            <div style={{fontSize:20}}>⭐⭐⭐⭐⭐</div>
            <span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>{reviews.length} review{reviews.length!==1?"s":""}</span>
          </div>
        )}
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"60px 24px"}}>
        
        {/* Submit review */}
        {sent?(
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} className="vx-glass" style={{padding:"40px",textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:32,marginBottom:12}}>✅</div>
            <div className="orb" style={{fontSize:13,color:"#fff",marginBottom:8}}>REVIEW SUBMITTED</div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Thank you! Your review will appear once approved.</p>
          </motion.div>
        ):(
          <div className="vx-glass" style={{padding:"32px",marginBottom:48}}>
            <div className="orb" style={{fontSize:10,letterSpacing:"0.3em",color:"rgba(255,255,255,0.5)",marginBottom:20}}>LEAVE A REVIEW</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <input className="vx-input" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8}}>Rating</div>
                <div style={{display:"flex",gap:8}}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} onClick={()=>setForm(f=>({...f,rating:n}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:24,opacity:n<=form.rating?1:0.3,transition:"opacity 0.2s"}}>⭐</button>
                  ))}
                </div>
              </div>
              <textarea className="vx-input" placeholder="Share your experience with Vexer..." rows={4} value={form.comment} onChange={e=>setForm(f=>({...f,comment:e.target.value}))} style={{resize:"vertical"}}/>
              
              {/* Image upload */}
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8}}>Photo <span style={{color:"rgba(255,255,255,0.2)"}}>(Optional)</span></div>
                <label style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:6,cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"}>
                  <input type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/>
                  {imagePreview?(
                    <img src={imagePreview} alt="preview" style={{width:48,height:48,objectFit:"cover",borderRadius:6}}/>
                  ):(
                    <span style={{fontSize:24}}>📷</span>
                  )}
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{image?image.name:"Click to upload a photo"}</span>
                </label>
              </div>

              {err&&<p style={{fontSize:11,color:"#fca5a5"}}>{err}</p>}
              <button className="vx-btn vx-btn-white" style={{padding:"12px 28px",fontSize:9,alignSelf:"flex-start",letterSpacing:"0.2em"}} onClick={submit} disabled={sending}>
                {sending?"SUBMITTING...":"SUBMIT REVIEW"}
              </button>
            </div>
          </div>
        )}

        {/* Reviews list */}
        {reviews.length===0?(
          <div style={{textAlign:"center",padding:"48px 0"}}>
            <div className="orb" style={{fontSize:11,color:"rgba(255,255,255,0.2)"}}>NO REVIEWS YET — BE THE FIRST!</div>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {reviews.map((r,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.05}}
                className="vx-glass" style={{padding:"24px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#fff",marginBottom:4}}>{r.name}</div>
                    <div style={{display:"flex",gap:2}}>{stars(r.rating)}</div>
                  </div>
                  {r.submittedAt&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{new Date(r.submittedAt).toLocaleDateString('en-GB')}</div>}
                </div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginBottom:r.image?12:0}}>{r.comment}</p>
                {r.image&&<img src={r.image} alt="review" style={{width:"100%",maxHeight:200,objectFit:"cover",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"}}/>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({setPage,onAdd,products,wishlist,onWishlist}){
  return(
    <div>
      <HeroCarousel setPage={setPage}/>
      <TrustBadges/>
      <FeaturedJerseys products={products} onAdd={onAdd} setPage={setPage} wishlist={wishlist} onWishlist={onWishlist}/>
      <GenderStrip setPage={setPage}/>
      <HowItWorks/>
      <DiscordCTA/>
    </div>
  );
}

// ── GENDER PAGE ───────────────────────────────────────────────────────────────
function GenderPage({gender,onAdd,setPage,products,wishlist,onWishlist}){
  const genderLabel={men:"Men's",women:"Women's",kids:"Kids'",babies:"Babies'"};
  const all=(products||[]).filter(p=>(p.genderOptions||[]).map(g=>g.toLowerCase()).includes(gender));

  const availableLeagues=[...new Set(all.map(p=>p.league).filter(Boolean))];
  const availableBrands=[...new Set(all.map(p=>p.brand).filter(Boolean))];
  const availableSeasons=[...new Set(all.map(p=>p.season).filter(Boolean))];
  const availableKitTypes=[...new Set(all.map(p=>p.kitType).filter(Boolean))];

  const [filters,setFilters]=useState({category:"",league:"",brand:"",season:"",kitType:"",playerName:false});
  const setF=(k,v)=>setFilters(f=>({...f,[k]:v}));
  const anyActive=Object.values(filters).some(v=>v);

  const displayed=all.filter(p=>{
    if(filters.category&&p.category!==filters.category) return false;
    if(filters.league&&p.league!==filters.league) return false;
    if(filters.brand&&p.brand!==filters.brand) return false;
    if(filters.season&&p.season!==filters.season) return false;
    if(filters.kitType&&p.kitType!==filters.kitType) return false;
    if(filters.playerName&&!p.hasPlayerName) return false;
    return true;
  });

  const Sel=({label,val,opts,onChange})=>opts.length===0?null:(
    <div style={{position:"relative"}}>
      <select value={val} onChange={e=>onChange(e.target.value)} className="vx-input" style={{padding:"8px 32px 8px 14px",fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.1em",cursor:"pointer",minWidth:130,appearance:"none",color:val?"#fff":"rgba(255,255,255,0.4)"}}>
        <option value="">{label}</option>
        {opts.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.4)",pointerEvents:"none",fontSize:9}}>▼</span>
    </div>
  );

  return(
    <div style={{paddingTop:64,minHeight:"100vh"}}>
      {/* Header */}
      <div style={{padding:"48px 24px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:8}}>VEXER · {gender.toUpperCase()}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
            <h1 className="orb" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,color:"#fff"}}>{genderLabel[gender]?.toUpperCase()} JERSEYS</h1>
            <div className="orb" style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{displayed.length} RESULTS</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"32px 24px 80px"}}>
        {/* Category tabs */}
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
          {["","national","international","retro"].map(cat=>(
            <button key={cat} onClick={()=>setF("category",cat)} className="vx-btn" style={{padding:"8px 20px",fontSize:9,letterSpacing:"0.15em",background:filters.category===cat?"#fff":"transparent",color:filters.category===cat?"#050508":"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:4}}>
              {cat===""?"ALL":cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:32,padding:"16px 20px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8}}>
          <span className="orb" style={{fontSize:8,letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)"}}>FILTER</span>
          <Sel label="LEAGUE" val={filters.league} opts={availableLeagues} onChange={v=>setF("league",v)}/>
          <Sel label="BRAND" val={filters.brand} opts={availableBrands} onChange={v=>setF("brand",v)}/>
          <Sel label="SEASON" val={filters.season} opts={availableSeasons} onChange={v=>setF("season",v)}/>
          <Sel label="KIT TYPE" val={filters.kitType} opts={availableKitTypes} onChange={v=>setF("kitType",v)}/>
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            <input type="checkbox" checked={filters.playerName} onChange={e=>setF("playerName",e.target.checked)} style={{accentColor:"#fff"}}/>
            <span className="orb" style={{fontSize:8,color:"rgba(255,255,255,0.4)",letterSpacing:"0.1em"}}>PLAYER NAME</span>
          </label>
          {anyActive&&(
            <button onClick={()=>setFilters({category:"",league:"",brand:"",season:"",kitType:"",playerName:false})}
              style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontFamily:"'Orbitron',sans-serif",fontSize:8,cursor:"pointer",textDecoration:"underline",letterSpacing:"0.1em",marginLeft:"auto"}}>
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Grid */}
        {displayed.length===0?(
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <div className="orb" style={{fontSize:32,color:"rgba(255,255,255,0.06)",marginBottom:16}}>V</div>
            <p className="orb" style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>{anyActive?"NO JERSEYS MATCH YOUR FILTERS":"MORE JERSEYS COMING SOON"}</p>
            {anyActive&&<button className="vx-btn vx-btn-outline" style={{marginTop:16,padding:"10px 24px",fontSize:9}} onClick={()=>setFilters({category:"",league:"",brand:"",season:"",kitType:"",playerName:false})}>CLEAR FILTERS</button>}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
            {displayed.map((j,i)=><JCard key={j.id} jersey={j} index={i} onAdd={onAdd} setPage={setPage} wishlist={wishlist} onWishlist={onWishlist}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PRODUCT PAGE ──────────────────────────────────────────────────────────────
function ProductPage({productId,onAdd,setPage,products,wishlist,onWishlist}){
  const jersey=(products||[]).find(p=>p.id===productId);
  if(!jersey)return<div style={{paddingTop:120,textAlign:"center",minHeight:"60vh"}}><p style={{color:"rgba(255,255,255,0.3)"}}>Jersey not found.</p></div>;

  const basePrice=jersey.currentPrice||jersey.originalPrice;
  const hasDiscount=jersey.currentPrice&&jersey.currentPrice<jersey.originalPrice;
  const isLowStock=jersey.trackStock&&jersey.stockQuantity<=jersey.lowStockThreshold&&jersey.stockQuantity>0;
  const isOutOfStock=jersey.trackStock&&!jersey.inStock;
  const isWishlisted=wishlist?.includes(jersey.id);

  const [selectedGender,setSelectedGender]=useState(jersey.genderOptions?.[0]||"");
  const [selectedSize,setSelectedSize]=useState("");
  const [playerName,setPlayerName]=useState("");
  const [playerNumber,setPlayerNumber]=useState("");
  const [addBadge,setAddBadge]=useState(false);
  const [notes,setNotes]=useState("");
  const [added,setAdded]=useState(false);
  const [err,setErr]=useState("");
  const [activeImg,setActiveImg]=useState(0);

  const allImages=[jersey.img,...(jersey.images||[])].filter(Boolean);
  const finalPrice=basePrice+(playerName&&jersey.playerNamePrice?jersey.playerNamePrice:0)+(addBadge&&jersey.badgePrice?jersey.badgePrice:0);

  const addToCart=()=>{
    if(!selectedSize&&jersey.sizes?.length>0){setErr("Please select a size.");return;}
    if(jersey.hasPlayerName&&playerName&&!playerNumber){setErr("Please enter a player number.");return;}
    setErr("");
    onAdd({...jersey,price:finalPrice,selectedGender,selectedSize,playerName:playerName||undefined,playerNumber:playerNumber||undefined,addBadge:addBadge||undefined,notes:notes||undefined,cartId:jersey.id+"_"+Date.now(),qty:1});
    setAdded(true);setTimeout(()=>setAdded(false),2000);
  };

  return(
    <div style={{paddingTop:64,minHeight:"100vh"}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"48px 24px 96px"}}>

        {/* Back */}
        <button onClick={()=>setPage("gender_men")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",marginBottom:40,display:"flex",alignItems:"center",gap:8}}
          onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
          ← BACK
        </button>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}} className="mobile-grid-1">

          {/* Images */}
          <div>
            <div style={{position:"relative",aspectRatio:"3/4",borderRadius:8,overflow:"hidden",background:"#0d0d12",border:"1px solid rgba(255,255,255,0.08)",marginBottom:12}}>
              <img src={allImages[activeImg]} alt={jersey.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {jersey.tag&&<div style={{position:"absolute",top:16,left:16,background:"#fff",color:"#050508",fontSize:8,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.2em",padding:"4px 12px",borderRadius:2,fontWeight:700}}>{jersey.tag}</div>}
              <button onClick={()=>onWishlist(jersey.id)} style={{position:"absolute",top:16,right:16,background:"rgba(5,5,8,0.7)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>
                {isWishlisted?"❤️":"🤍"}
              </button>
            </div>
            {allImages.length>1&&(
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {allImages.map((img,i)=>(
                  <div key={i} onClick={()=>setActiveImg(i)} style={{width:64,height:64,borderRadius:6,overflow:"hidden",border:`1px solid ${activeImg===i?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.08)"}`,cursor:"pointer"}}>
                    <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.4)",letterSpacing:"0.3em",marginBottom:8}}>{jersey.team?.toUpperCase()} · {jersey.league||""}</div>
            <h1 style={{fontSize:"clamp(1.5rem,3vw,2.5rem)",fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:8}}>{jersey.name}</h1>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:8}}>{jersey.brand}{jersey.season?` · ${jersey.season}`:""}</div>

            {/* Stars */}
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:20}}>
              <div style={{fontSize:14}}>⭐⭐⭐⭐⭐</div>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>5.0</span>
            </div>

            {/* Price */}
            <div style={{marginBottom:24}}>
              {hasDiscount&&<div style={{fontSize:14,color:"rgba(255,255,255,0.3)",textDecoration:"line-through",marginBottom:4}}>{fmt(jersey.originalPrice)}</div>}
              <div style={{fontSize:36,fontFamily:"'Orbitron',sans-serif",fontWeight:900,color:hasDiscount?"#4ade80":"#fff"}}>{fmt(finalPrice)}</div>
              {hasDiscount&&<div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",color:"#4ade80",marginTop:4}}>YOU SAVE {fmt(jersey.originalPrice-jersey.currentPrice)}</div>}
            </div>

            {/* Delivery */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,marginBottom:24}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80",flexShrink:0}}/>
              <span style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.5)",letterSpacing:"0.08em"}}>WORLDWIDE DELIVERY · ~2 WEEKS · TRACKED</span>
            </div>

            <div style={{height:1,background:"rgba(255,255,255,0.06)",marginBottom:24}}/>

            {/* Gender */}
            {jersey.genderOptions?.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:10}}>GENDER</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {jersey.genderOptions.map(g=>(
                    <button key={g} onClick={()=>setSelectedGender(g)} style={{padding:"9px 20px",fontSize:11,fontWeight:600,background:selectedGender===g?"#fff":"transparent",color:selectedGender===g?"#050508":"rgba(255,255,255,0.5)",border:"1px solid",borderColor:selectedGender===g?"#fff":"rgba(255,255,255,0.15)",cursor:"pointer",transition:"all 0.2s",borderRadius:4}}>{g}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {jersey.sizes?.length>0&&(
              <div style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)"}}>SIZE</div>
                  <button onClick={()=>setPage("sizeguide")} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,0.4)",textDecoration:"underline",fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.1em"}}>SIZE GUIDE</button>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {jersey.sizes.map(s=>(
                    <button key={s} onClick={()=>setSelectedSize(s)} style={{padding:"9px 16px",fontSize:11,fontWeight:600,background:selectedSize===s?"#fff":"transparent",color:selectedSize===s?"#050508":"rgba(255,255,255,0.5)",border:"1px solid",borderColor:selectedSize===s?"#fff":"rgba(255,255,255,0.15)",cursor:"pointer",transition:"all 0.2s",borderRadius:4}}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Player Name */}
            {jersey.hasPlayerName&&(
              <div style={{marginBottom:20,padding:"16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.2em",color:"rgba(255,255,255,0.5)"}}>PLAYER NAME & NUMBER <span style={{color:"rgba(255,255,255,0.25)"}}>(OPTIONAL)</span></div>
                  {jersey.playerNamePrice&&<div style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"#4ade80",fontWeight:600}}>+{fmt(jersey.playerNamePrice)}</div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10}}>
                  <input className="vx-input" placeholder="e.g. SALAH" value={playerName} onChange={e=>setPlayerName(e.target.value.toUpperCase())} maxLength={20}/>
                  <input className="vx-input" placeholder="#" value={playerNumber} onChange={e=>setPlayerNumber(e.target.value.replace(/\D/g,""))} maxLength={2} style={{width:60}}/>
                </div>
              </div>
            )}

            {/* Badge */}
            {jersey.hasBadge&&(
              <div style={{marginBottom:20}}>
                <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"14px 16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6}}>
                  <input type="checkbox" checked={addBadge} onChange={e=>setAddBadge(e.target.checked)} style={{accentColor:"#fff",width:16,height:16}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#fff"}}>Add Badge</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>Include official badge on jersey</div>
                  </div>
                  {jersey.badgePrice&&<div style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"#4ade80",fontWeight:600}}>+{fmt(jersey.badgePrice)}</div>}
                </label>
              </div>
            )}

            {/* Notes */}
            {jersey.hasNotes&&(
              <div style={{marginBottom:20}}>
                <div style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",marginBottom:10}}>ORDER NOTES <span style={{color:"rgba(255,255,255,0.2)"}}>(OPTIONAL)</span></div>
                <textarea className="vx-input" placeholder="Any special requests..." rows={3} value={notes} onChange={e=>setNotes(e.target.value)} style={{resize:"vertical"}}/>
              </div>
            )}

            {err&&<div style={{fontSize:11,fontFamily:"'Orbitron',sans-serif",color:"#fca5a5",marginBottom:14,padding:"10px 14px",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,letterSpacing:"0.08em"}}>{err}</div>}

            {isOutOfStock?(
              <div style={{padding:"16px",textAlign:"center",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,marginBottom:12}}>
                <span style={{fontSize:10,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.3)",letterSpacing:"0.2em"}}>OUT OF STOCK</span>
              </div>
            ):(
              <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.99}} className="vx-btn vx-btn-white" style={{width:"100%",padding:"16px",fontSize:10,letterSpacing:"0.2em",marginBottom:12,borderRadius:4}} onClick={addToCart}>
                {added?"✓ ADDED TO CART":"ADD TO CART — "+fmt(finalPrice)}
              </motion.button>
            )}

            <p style={{textAlign:"center",fontSize:9,fontFamily:"'Orbitron',sans-serif",color:"rgba(255,255,255,0.2)",letterSpacing:"0.12em",marginBottom:24}}>SECURE CHECKOUT · WORLDWIDE DELIVERY</p>

            {/* Details */}
            {jersey.description&&<div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.8,marginBottom:20,padding:"16px",background:"rgba(255,255,255,0.02)",borderRadius:6,border:"1px solid rgba(255,255,255,0.06)"}}>{jersey.description}</div>}

            <div style={{border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,overflow:"hidden"}}>
              {[jersey.brand&&["Brand",jersey.brand],jersey.season&&["Season",jersey.season],jersey.kitType&&["Kit",jersey.kitType.toUpperCase()],["Delivery","~2 Weeks Worldwide"],["Returns","3 Days (No Custom)"]].filter(Boolean).map(([label,value],i)=>(
                <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"rgba(255,255,255,0.01)":"transparent"}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{label}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WISHLIST PAGE ─────────────────────────────────────────────────────────────
function WishlistPage({wishlist,products,onAdd,setPage,onWishlist}){
  const items=(products||[]).filter(p=>wishlist?.includes(p.id));
  return(
    <div style={{paddingTop:64,minHeight:"100vh"}}>
      <div style={{padding:"48px 24px 32px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:8}}>VEXER</div>
          <h1 className="orb" style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,color:"#fff"}}>WISHLIST</h1>
        </div>
      </div>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"40px 24px 80px"}}>
        {items.length===0?(
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <div style={{fontSize:32,marginBottom:16}}>🤍</div>
            <div className="orb" style={{fontSize:12,color:"rgba(255,255,255,0.2)",marginBottom:20}}>YOUR WISHLIST IS EMPTY</div>
            <button className="vx-btn vx-btn-outline" style={{padding:"12px 28px",fontSize:9,letterSpacing:"0.2em"}} onClick={()=>setPage("gender_men")}>BROWSE JERSEYS</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
            {items.map((j,i)=><JCard key={j.id} jersey={j} index={i} onAdd={onAdd} setPage={setPage} wishlist={wishlist} onWishlist={onWishlist}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────────────────────
function ContactPage(){
  return(
    <div style={{paddingTop:64,minHeight:"100vh"}}>
      <div style={{padding:"60px 24px 40px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>VEXER</div>
        <h1 className="orb" style={{fontSize:"clamp(2rem,5vw,4rem)",fontWeight:900,color:"#fff",marginBottom:12}}>CONTACT US</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Questions or can't find your jersey? We're here.</p>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"60px 24px",display:"flex",flexDirection:"column",gap:16}}>
        <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer"
          style={{display:"flex",alignItems:"center",gap:20,padding:"24px",background:"rgba(88,101,242,0.08)",border:"1px solid rgba(88,101,242,0.25)",borderRadius:8,textDecoration:"none",transition:"all 0.3s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(88,101,242,0.5)";e.currentTarget.style.background="rgba(88,101,242,0.12)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(88,101,242,0.25)";e.currentTarget.style.background="rgba(88,101,242,0.08)";}}>
          <span style={{fontSize:28}}>💬</span>
          <div style={{flex:1}}>
            <div className="orb" style={{fontSize:11,color:"#7289da",letterSpacing:"0.15em",marginBottom:4}}>DISCORD — FASTEST RESPONSE</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Open a support ticket in our server</div>
          </div>
          <span className="orb" style={{fontSize:9,color:"#7289da"}}>JOIN →</span>
        </a>
        <div style={{padding:"24px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:8}}>EMAIL</div>
          <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>support@vexer.org</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:4}}>Response within 24 hours</div>
        </div>
        <div style={{padding:"24px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8}}>
          <div className="orb" style={{fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:8}}>DELIVERY INFO</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7}}>Worldwide delivery · Approximately 2 weeks · Tracked shipping included in price</div>
        </div>
      </div>
    </div>
  );
}

// ── ORDER SUCCESS ─────────────────────────────────────────────────────────────
function OrderSuccessPage({setPage}){
  return(
    <div style={{paddingTop:64,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} style={{maxWidth:480,width:"100%",textAlign:"center",padding:"48px 40px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div className="orb" style={{fontSize:9,letterSpacing:"0.5em",color:"rgba(255,255,255,0.4)",marginBottom:12}}>ORDER CONFIRMED</div>
        <h2 className="orb" style={{fontSize:"clamp(1.5rem,3vw,2rem)",fontWeight:800,color:"#fff",marginBottom:12}}>THANK YOU!</h2>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:28}}>Your order is confirmed. You'll receive a confirmation email with your order details shortly.</p>
        <button className="vx-btn vx-btn-white" style={{padding:"12px 32px",fontSize:9,letterSpacing:"0.2em"}} onClick={()=>setPage("home")}>CONTINUE SHOPPING</button>
      </motion.div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({setPage}){
  return(
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"60px 24px 32px"}}>
      <div style={{maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:48}} className="mobile-grid-2">
          <div>
            <img src="/logo.png" alt="Vexer" style={{height:36,width:"auto",marginBottom:20}}/>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.35)",lineHeight:1.8,maxWidth:260,marginBottom:20}}>Premium football jerseys from the world's greatest clubs and nations. Worldwide delivery.</p>
            <a href="https://discord.gg/6Xk2HmgT9N" target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 16px",background:"rgba(88,101,242,0.1)",border:"1px solid rgba(88,101,242,0.25)",borderRadius:6,textDecoration:"none",color:"#7289da",fontSize:10,fontFamily:"'Orbitron',sans-serif",letterSpacing:"0.1em"}}>
              💬 DISCORD
            </a>
          </div>
          <div>
            <div className="orb" style={{fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:16}}>SHOP</div>
            {[["MEN'S","gender_men"],["WOMEN'S","gender_women"],["KIDS'","gender_kids"],["BABIES'","gender_babies"]].map(([label,p])=>(
              <button key={p} onClick={()=>setPage(p)} style={{display:"block",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:10,textAlign:"left",transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>{label}</button>
            ))}
          </div>
          <div>
            <div className="orb" style={{fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:16}}>INFO</div>
            {[["FAQs","faqs"],["Size Guide","sizeguide"],["Shipping","shipping"],["Returns","returns"],["Reviews","reviews"]].map(([label,p])=>(
              <button key={p} onClick={()=>setPage(p)} style={{display:"block",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:10,textAlign:"left",transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>{label}</button>
            ))}
          </div>
          <div>
            <div className="orb" style={{fontSize:9,letterSpacing:"0.3em",color:"rgba(255,255,255,0.4)",marginBottom:16}}>LEGAL</div>
            {[["Privacy Policy","privacy"],["Terms","terms"],["Sitemap","sitemap"]].map(([label,p])=>(
              <button key={p} onClick={()=>setPage(p)} style={{display:"block",background:"none",border:"none",cursor:"pointer",fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:10,textAlign:"left",transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{height:1,background:"rgba(255,255,255,0.06)",marginBottom:24}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div className="orb" style={{fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:"0.15em"}}>© 2026 VEXER. ALL RIGHTS RESERVED.</div>
          <div className="orb" style={{fontSize:9,color:"rgba(255,255,255,0.2)",letterSpacing:"0.15em"}}>support@vexer.org</div>
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
const INFO_PAGES=["faqs","sizeguide","shipping","returns","privacy","terms","sitemap"];

export default function App(){
  const [products,setProducts]=useState([]);
  useEffect(()=>{
    sanity.fetch(`*[_type=="jersey"]{
      "id":_id,name,team,league,category,kitType,brand,season,
      subtitle,description,originalPrice,currentPrice,tag,featured,
      "img":image.asset->url,"images":images[].asset->url,
      genderOptions,sizes,hasPlayerName,playerNamePrice,hasBadge,badgePrice,hasNotes,
      trackStock,stockQuantity,lowStockThreshold,inStock
    }`).then(setProducts).catch(()=>{});
  },[]);

  const [page,setPage]=useState(()=>{
    try{
      const p=new URLSearchParams(window.location.search);
      if(p.get("success")==="true"){localStorage.removeItem("vexer_cart");return"order-success";}
      if(p.get("cancelled")==="true") return"home";
      return localStorage.getItem("vexer_page")||"home";
    }catch{return"home";}
  });

  const [cart,setCart]=useState(()=>{
    try{
      const p=new URLSearchParams(window.location.search);
      if(p.get("success")==="true") return[];
      const s=localStorage.getItem("vexer_cart");
      return s?JSON.parse(s):[];
    }catch{return[];}
  });

  const [wishlist,setWishlist]=useState(()=>{
    try{const s=localStorage.getItem("vexer_wishlist");return s?JSON.parse(s):[];}catch{return[];}
  });

  const [cartOpen,setCartOpen]=useState(false);

  useEffect(()=>{localStorage.setItem("vexer_cart",JSON.stringify(cart));},[cart]);
  useEffect(()=>{localStorage.setItem("vexer_wishlist",JSON.stringify(wishlist));},[wishlist]);
  useEffect(()=>{localStorage.setItem("vexer_page",page);window.scrollTo({top:0,behavior:"smooth"});},[page]);

  const navigate=p=>{setPage(p);localStorage.setItem("vexer_page",p);window.scrollTo({top:0,behavior:"smooth"});};
  const addToCart=p=>{setCart(prev=>{const ex=prev.find(i=>i.cartId===p.cartId);if(ex)return prev.map(i=>i.cartId===p.cartId?{...i,qty:i.qty+1}:i);return[...prev,p];});};
  const removeFromCart=id=>setCart(prev=>prev.filter(i=>i.cartId!==id));
  const toggleWishlist=id=>setWishlist(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  const renderPage=()=>{
    if(page==="order-success") return<OrderSuccessPage setPage={navigate}/>;
    if(page==="home") return<HomePage setPage={navigate} onAdd={addToCart} products={products} wishlist={wishlist} onWishlist={toggleWishlist}/>;
    if(page==="reviews") return<ReviewsPage/>;
    if(page==="contact") return<ContactPage/>;
    if(page==="wishlist") return<WishlistPage wishlist={wishlist} products={products} onAdd={addToCart} setPage={navigate} onWishlist={toggleWishlist}/>;
    if(page.startsWith("product_")) return<ProductPage productId={page.replace("product_","")} onAdd={addToCart} setPage={navigate} products={products} wishlist={wishlist} onWishlist={toggleWishlist}/>;
    if(page.startsWith("gender_")) return<GenderPage gender={page.replace("gender_","")} onAdd={addToCart} setPage={navigate} products={products} wishlist={wishlist} onWishlist={toggleWishlist}/>;
    if(INFO_PAGES.includes(page)) return(
      <div style={{paddingTop:120,textAlign:"center",minHeight:"60vh"}}>
        <div className="orb" style={{fontSize:20,color:"rgba(255,255,255,0.1)",marginBottom:16}}>{page.toUpperCase()}</div>
        <p style={{color:"rgba(255,255,255,0.3)"}}>This page is coming soon.</p>
      </div>
    );
    return<HomePage setPage={navigate} onAdd={addToCart} products={products} wishlist={wishlist} onWishlist={toggleWishlist}/>;
  };

  return(
    <>
      <style>{CSS}</style>
      <AnimatePresence>
        {cartOpen&&<CartPanel key="cart" items={cart} onClose={()=>setCartOpen(false)} onRemove={removeFromCart} setPage={navigate}/>}
      </AnimatePresence>
      <div style={{minHeight:"100vh",background:"#050508",display:"flex",flexDirection:"column"}}>
        <Navbar page={page} setPage={navigate} cartCount={cartCount} onCart={()=>setCartOpen(true)} products={products} wishlist={wishlist}/>
        <main style={{flex:1}}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}>
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer setPage={navigate}/>
        <CookieConsent/>
        <DiscordWidget/>
      </div>
    </>
  );
}