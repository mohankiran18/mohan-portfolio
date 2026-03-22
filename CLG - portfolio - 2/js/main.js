/* emailjs initialization */
if(typeof emailjs!=='undefined') emailjs.init('UTc-rriJItIQjnX0w');

/* AOS initialization */
if(typeof AOS!=='undefined') AOS.init({ duration: 800, once: true, offset: 50, easing: 'ease-out-cubic' });

/* ── GALAXY CANVAS ────────────────────────────────────── */
(function initGalaxy(){
  const canvas = document.getElementById('galaxy-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], nebulae = [], shooters = [];
  const STAR_COUNT = 320;
  const NEBULA_COUNT = 6;

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const starCols = ['rgba(139,92,246,A)','rgba(34,211,238,A)','rgba(255,255,255,A)','rgba(236,72,153,A)','rgba(251,191,36,A)'];

  function mkStar(){
    const col = starCols[Math.floor(Math.random()*starCols.length)];
    return {
      x: Math.random()*W,
      y: Math.random()*H,
      r: 0.3 + Math.random()*1.4,
      col,
      alpha: 0.2 + Math.random()*0.8,
      speed: 0.0003 + Math.random()*0.0008,
      phase: Math.random()*Math.PI*2,
      depth: 0.2 + Math.random()*0.8
    };
  }

  function mkNebula(){
    return {
      x: Math.random()*W,
      y: Math.random()*H,
      rx: 120 + Math.random()*220,
      ry: 80 + Math.random()*160,
      hue: [270,190,320,210][Math.floor(Math.random()*4)],
      alpha: 0.025 + Math.random()*0.045,
      rot: Math.random()*Math.PI
    };
  }

  function mkShooter(){
    const angle = (Math.PI/6) + Math.random()*(Math.PI/6);
    const speed = 6 + Math.random()*8;
    return {
      x: Math.random()*W*0.7,
      y: Math.random()*H*0.4,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      len: 80 + Math.random()*80,
      alpha: 1,
      life: 0
    };
  }

  for(let i=0;i<STAR_COUNT;i++) stars.push(mkStar());
  for(let i=0;i<NEBULA_COUNT;i++) nebulae.push(mkNebula());

  let shootTimer = 0;
  let mx = W/2, my = H/2;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });

  function draw(ts){
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if(!isDark){ requestAnimationFrame(draw); return; }

    ctx.clearRect(0,0,W,H);

    const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.75);
    bg.addColorStop(0,'#0c0812');
    bg.addColorStop(0.5,'#070510');
    bg.addColorStop(1,'#030208');
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,W,H);

    for(const n of nebulae){
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot);
      const g = ctx.createRadialGradient(0,0,0,0,0,n.rx);
      g.addColorStop(0, `hsla(${n.hue},70%,55%,${n.alpha})`);
      g.addColorStop(1, `hsla(${n.hue},70%,40%,0)`);
      ctx.scale(1, n.ry/n.rx);
      ctx.beginPath();
      ctx.arc(0,0,n.rx,0,Math.PI*2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    const ox = (mx/W - 0.5) * 18;
    const oy = (my/H - 0.5) * 12;
    const t = ts * 0.001;

    for(const s of stars){
      const twinkle = 0.5 + 0.5*Math.sin(t*s.speed*1000 + s.phase);
      const a = (0.15 + twinkle*0.85) * s.alpha;
      const px = s.x + ox * s.depth;
      const py = s.y + oy * s.depth;
      const col = s.col.replace('A', a.toFixed(2));

      if(s.r > 1.1){
        ctx.beginPath();
        const glow = ctx.createRadialGradient(px,py,0,px,py,s.r*4);
        glow.addColorStop(0, s.col.replace('A','0.25'));
        glow.addColorStop(1, s.col.replace('A','0'));
        ctx.arc(px,py,s.r*4,0,Math.PI*2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI*2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    shootTimer += 1;
    if(shootTimer > 180 + Math.random()*120){
      shooters.push(mkShooter());
      shootTimer = 0;
    }
    shooters = shooters.filter(s => s.alpha > 0.01);
    for(const s of shooters){
      s.x += s.vx; s.y += s.vy; s.life++;
      s.alpha = Math.max(0, 1 - s.life/40);
      const tail = { x: s.x - s.vx*(s.len/8), y: s.y - s.vy*(s.len/8) };
      const g = ctx.createLinearGradient(tail.x, tail.y, s.x, s.y);
      g.addColorStop(0, `rgba(255,255,255,0)`);
      g.addColorStop(0.6, `rgba(180,140,255,${s.alpha*0.6})`);
      g.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ── THEME ── */
const html=document.documentElement,themeBtn=document.getElementById('themeBtn'),themeIco=document.getElementById('themeIco');
let dark=true;
if(themeBtn) {
  themeBtn.addEventListener('click',()=>{
    dark=!dark;
    html.setAttribute('data-theme',dark?'dark':'light');
    themeIco.className=dark?'fa-solid fa-sun':'fa-solid fa-moon';
  });
}

/* ── NAV ── */
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  if(!navEl) return;
  navEl.classList.toggle('scrolled',window.scrollY>40);
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const s=document.querySelector(a.getAttribute('href'));
    if(!s)return;
    const r=s.getBoundingClientRect();
    a.classList.toggle('active',r.top<=82&&r.bottom>82);
  });
});

/* ── MOBILE MENU ── */
const mob=document.getElementById('mobMenu');
const burger=document.getElementById('burger');
const mobCloseBtn=document.getElementById('mobClose');
if(burger && mob) burger.addEventListener('click',()=>mob.classList.add('open'));
if(mobCloseBtn && mob) mobCloseBtn.addEventListener('click',()=>mob.classList.remove('open'));
window.closeMob = function(){ if(mob) mob.classList.remove('open'); }

/* ── CURSOR ── */
const cdot=document.getElementById('cdot'), cring=document.getElementById('cring'), cringEl=document.getElementById('cringEl');
let curMx=-999, curMy=-999, rx=-999, ry=-999, curReady=false;

window.addEventListener('mousemove', e => {
  curMx=e.clientX; curMy=e.clientY;
  if(!curReady){
    curReady=true; rx=curMx; ry=curMy;
    if(cdot) cdot.classList.add('active');
    if(cring) cring.classList.add('active');
  }
});

(function cursorLoop(){
  rx+=(curMx-rx)*.15; ry+=(curMy-ry)*.15;
  if(cdot) cdot.style.cssText =`left:${curMx}px;top:${curMy}px`;
  if(cring) cring.style.cssText=`left:${rx}px;top:${ry}px`;
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, button, .tilt-element, .ipill, .tpill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if(cringEl) {
      cringEl.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cringEl.style.borderColor = 'var(--teal)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if(cringEl) {
      cringEl.style.transform = 'translate(-50%, -50%) scale(1)';
      cringEl.style.borderColor = 'rgba(139,92,246,.7)';
    }
  });
});

if('ontouchstart' in window) document.querySelectorAll('.cur').forEach(c=>c.style.display='none');

/* ── 3D MAGNETIC CARD TILT WITH GLARE ── */
const tiltElements = document.querySelectorAll('.tilt-element');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 900) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set dynamic glare position variables
    el.style.setProperty('--gx', `${x}px`);
    el.style.setProperty('--gy', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-8 to 8 degrees max)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    el.style.transition = 'transform 0.1s ease-out';
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
  });
  
  el.addEventListener('mouseleave', () => {
    if (window.innerWidth <= 900) return;
    el.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0)`;
  });
});

/* ── TYPED TEXT ── */
const phrases=['CS Engineer','ML Enthusiast','GenAI Explorer','Python Developer'];
let pi=0,ci=0,del=false;
const tel=document.getElementById('typed');
function typeText(){
  if(!tel)return;
  const w=phrases[pi];
  tel.textContent=del?w.slice(0,ci--):w.slice(0,ci++);
  if(!del&&ci>w.length){setTimeout(()=>{del=true;typeText()},1800);return}
  if(del&&ci<0){del=false;pi=(pi+1)%phrases.length;ci=0;setTimeout(typeText,400);return}
  setTimeout(typeText,del?60:90);
}
typeText();

/* ── COUNTERS ── */
let cran=false;
function animCounts(){
  document.querySelectorAll('.stat-num[data-target]').forEach(el=>{
    const t=+el.dataset.target,plus=t>=100;
    let n=0;const step=Math.ceil(t/40);
    const tm=setInterval(()=>{n=Math.min(n+step,t);el.textContent=n+(plus?'+':'');if(n>=t)clearInterval(tm)},35);
  });
}
const heroStats = document.querySelector('.hero-stats');
if(heroStats){
  new IntersectionObserver(([e])=>{if(e.isIntersecting&&!cran){cran=true;animCounts()}},{threshold:.5}).observe(heroStats);
}

/* ── SKILL BARS ── */
const skillsSec = document.getElementById('skills');
if(skillsSec){
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting) e.target.querySelectorAll('.sk-fill[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');
  },{threshold:.3}).observe(skillsSec);
}

/* ── CONTACT FORM ── */
window.handleSub = function(e){
  e.preventDefault();
  const btn=e.target.querySelector('.sbtn');
  btn.innerHTML='<i class="fa-solid fa-check"></i> Sent!';
  btn.style.background='#22c55e';
  setTimeout(()=>{btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Send Message';btn.style.background='';e.target.reset()},3200);
}
