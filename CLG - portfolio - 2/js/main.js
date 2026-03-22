/* ============================================================
   KADALI MOHAN KIRAN — PORTFOLIO JS  v2.0
   Responsive 3D Neural Globe & Light Mode Constellations
   ============================================================ */

/* emailjs initialization */
if(typeof emailjs !== 'undefined') emailjs.init('UTc-rriJItIQjnX0w');

/* AOS initialization */
if(typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50, easing: 'ease-out-cubic' });

/* ── ADAPTIVE CANVAS BACKGROUND ─────────────────────────────── */
(function initCanvasBackground() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h;
  let mouseX = 0, mouseY = 0;
  
  // Globe Variables
  let currentRotX = 0, currentRotY = 0;
  let autoRotY = 0;
  const nodes = [];
  const links = [];
  const NODE_COUNT = 300; 

  // Star / Particle Variables
  const stars = [];
  const STAR_COUNT = 150;
  
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  document.addEventListener('mousemove', e => {
    // Normalized coords (-1 to 1) for 3D rotation
    mouseX = (e.clientX - (w / 2)) / (w / 2);
    mouseY = (e.clientY - (h / 2)) / (h / 2);
  }, { passive: true });
  
  // 1. Initialize 3D Globe Nodes
  const phi = Math.PI * (3 - Math.sqrt(5)); 
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({
      ox: Math.cos(theta) * radius,
      oy: y,
      oz: Math.sin(theta) * radius
    });
  }
  // Globe Links
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const dx = nodes[i].ox - nodes[j].ox;
      const dy = nodes[i].oy - nodes[j].oy;
      const dz = nodes[i].oz - nodes[j].oz;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < 0.28) links.push({ a: i, b: j }); 
    }
  }

  // 2. Initialize Background Stars / Particles
  for(let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * Math.PI * 2
    });
  }

  // Helper: Find exactly where the profile picture is to draw the globe behind it
  function getGlobeCenter() {
    const profilePic = document.querySelector('.hero-img-w');
    if (profilePic) {
      const rect = profilePic.getBoundingClientRect();
      // Only lock to profile picture if it's currently on screen (in Hero section)
      if (rect.top < window.innerHeight && rect.bottom > 0) {
          return {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
              radius: rect.width * 0.65 // Make globe slightly larger than profile picture
          };
      }
    }
    // Fallback if scrolled past Hero
    return { x: w * 0.75, y: h * 0.5, radius: Math.min(w, h) * 0.25 };
  }

  function animate() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.clearRect(0,0,w,h);

    if (isDark) {
      // ── DARK MODE RENDER ──
      
      // A. Deep Space Background
      ctx.fillStyle = '#040914';
      ctx.fillRect(0, 0, w, h);

      // B. Background Stars
      stars.forEach(s => {
        s.alpha += 0.02;
        const opacity = (Math.sin(s.alpha) * 0.5 + 0.5) * 0.6;
        ctx.fillStyle = `rgba(0, 212, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });

      // C. The 3D Neural Globe (Rendered directly behind profile picture)
      const target = getGlobeCenter();
      
      const targetRotX = mouseY * 0.4; 
      const targetRotY = mouseX * 0.6; 
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      autoRotY -= 0.003; 

      const rotX = currentRotX;
      const rotY = autoRotY + currentRotY;
      const sinX = Math.sin(rotX), cosX = Math.cos(rotX);
      const sinY = Math.sin(rotY), cosY = Math.cos(rotY);

      // Draw Atmospheric Glow behind globe
      const glow = ctx.createRadialGradient(target.x, target.y, target.radius * 0.5, target.x, target.y, target.radius * 1.8);
      glow.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
      glow.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(target.x, target.y, target.radius * 1.8, 0, Math.PI*2); ctx.fill();

      // Draw Orbital Rings (like the screenshot)
      ctx.beginPath();
      ctx.ellipse(target.x, target.y, target.radius * 1.6, target.radius * 0.6, Math.PI / -6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(target.x, target.y, target.radius * 1.4, target.radius * 1.4, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.stroke();

      // Project Nodes
      const projected = nodes.map(n => {
        let y1 = n.oy * cosX - n.oz * sinX;
        let z1 = n.oy * sinX + n.oz * cosX;
        let x2 = n.ox * cosY + z1 * sinY;
        let z2 = -n.ox * sinY + z1 * cosY;
        
        const scale = 2.5 / (2.5 - z2);
        return {
          x: target.x + x2 * target.radius * scale,
          y: target.y + y1 * target.radius * scale,
          z: z2, scale: scale
        };
      });

      // Draw Links
      ctx.lineWidth = 0.8;
      links.forEach(link => {
        const p1 = projected[link.a];
        const p2 = projected[link.b];
        if (p1.z > -0.4 || p2.z > -0.4) {
          const avgZ = (p1.z + p2.z) / 2;
          const alpha = Math.max(0.01, (avgZ + 1) / 2 * 0.4); 
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw Nodes
      projected.forEach(p => {
        const alpha = Math.max(0.05, (p.z + 1) / 2 * 0.8);
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

    } else {
      // ── LIGHT MODE RENDER ──
      // Background is handled by CSS Mesh Gradient. We just draw faint floating constellation lines here.
      
      stars.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < STAR_COUNT; i++) {
        for (let j = i + 1; j < STAR_COUNT; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 80) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist/80)})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
})();

/* ── THEME TOGGLE ── */
const html=document.documentElement, themeBtn=document.getElementById('themeBtn'), themeIco=document.getElementById('themeIco');
let dark=true;
if(themeBtn) {
  themeBtn.addEventListener('click',()=>{
    dark=!dark;
    html.setAttribute('data-theme',dark?'dark':'light');
    themeIco.className=dark?'fa-solid fa-sun':'fa-solid fa-moon';
  });
}

/* ── NAV SCROLL ── */
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
}, { passive: true });

/* ── MOBILE MENU ── */
const mob=document.getElementById('mobMenu');
const burger=document.getElementById('burger');
const mobCloseBtn=document.getElementById('mobClose');
if(burger && mob) burger.addEventListener('click',()=>mob.classList.add('open'));
if(mobCloseBtn && mob) mobCloseBtn.addEventListener('click',()=>mob.classList.remove('open'));
window.closeMob = function(){ if(mob) mob.classList.remove('open'); }

/* ── CUSTOM CURSOR ── */
const cdot=document.getElementById('cdot'), cring=document.getElementById('cring'), cringEl=document.getElementById('cringEl');
let curMx=-999, curMy=-999, rx=-999, ry=-999, curReady=false;

window.addEventListener('mousemove', e => {
  curMx=e.clientX; curMy=e.clientY;
  if(!curReady){
    curReady=true; rx=curMx; ry=curMy;
    if(cdot) cdot.classList.add('active');
    if(cring) cring.classList.add('active');
  }
}, { passive: true });

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
      cringEl.style.borderColor = 'rgba(0,212,255,0.7)';
    }
  });
});

if('ontouchstart' in window) document.querySelectorAll('.cur').forEach(c=>c.style.display='none');

/* ── 3D MAGNETIC CARD TILT ── */
const tiltElements = document.querySelectorAll('.tilt-element');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 900) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
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

/* ── REAL EMAILJS CONTACT FORM LOGIC ── */
window.handleFormSubmit = window.handleSub = function(e) {
  e.preventDefault();
  
  const btn = e.target.querySelector('.submit-btn, .sbtn');
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const msgEl = document.getElementById('message');
  
  if(!btn || !nameEl || !emailEl || !subjectEl || !msgEl) {
    console.error("Form elements missing IDs.");
    return;
  }
  
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

  emailjs.send('service_0ttufbh', 'template_b2zui0l', {
    from_name: nameEl.value,
    reply_to: emailEl.value,
    subject: subjectEl.value,
    message: msgEl.value,
  })
  .then(() => {
    btn.style.background = '#10b981'; // Success Green
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
    e.target.reset();
    
    setTimeout(() => { 
        btn.disabled = false; 
        btn.style.background = '';
        btn.innerHTML = originalText; 
    }, 4000);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed — Try Again';
    btn.style.background = '#ef4444'; // Error Red
    
    setTimeout(() => { 
        btn.innerHTML = originalText; 
        btn.style.background = ''; 
    }, 4000);
  });
};

// ===== CHATBASE BLANK BOX FIX =====
(function fixChatbase() {
  function hideChatbaseGhosts() {
    document.querySelectorAll('[id*="chatbase"], [class*="chatbase"], iframe[src*="chatbase"]').forEach(el => {
      const hasContent = el.children.length > 0 || el.src || (el.offsetWidth > 0 && el.offsetHeight > 0 && el.innerHTML.trim().length > 0);
      if (!hasContent) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      } else {
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      }
    });
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', hideChatbaseGhosts); } else { hideChatbaseGhosts(); }
  const observer = new MutationObserver(hideChatbaseGhosts);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
})();
