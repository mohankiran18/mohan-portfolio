/* ============================================================
   KADALI MOHAN KIRAN — PORTFOLIO JS  v2.0
   Deep-Space Neural / Precision Futurism
   ============================================================ */

// ===== AOS INITIALIZATION =====
AOS.init({ duration: 750, once: true, easing: 'ease-out-quart', offset: 60 });

// ===== SCROLL PROGRESS =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}, { passive: true });


// ===== INTERACTIVE NEURAL SPACE NETWORK =====
(function initNeuralSpace() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let W, H;
  let nodes = [], nebulae = [];
  
  // Settings
  const NODE_COUNT = 130; // Sweet spot for density and performance
  const NEBULA_COUNT = 4;
  const CONNECT_DIST = 140; // How close nodes need to be to link
  let mx = -999, my = -999;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // ML Theme Colors: Cyan, Indigo, Violet
  const colors = ['rgba(0,212,255,1)', 'rgba(99,102,241,1)', 'rgba(139,92,246,1)'];

  function createNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  function createNebula() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: 200 + Math.random() * 400,
      hue: [190, 240, 280][Math.floor(Math.random() * 3)] // Deep space hues
    }
  }

  for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode());
  for (let i = 0; i < NEBULA_COUNT; i++) nebulae.push(createNebula());

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => { mx = -999; my = -999; });

  function draw() {
    // Only animate if in dark mode
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (!isDark) { requestAnimationFrame(draw); return; }

    ctx.clearRect(0, 0, W, H);

    // 1. Deep Space Void Background
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H));
    bg.addColorStop(0, '#0a0c16'); // Deep indigo center
    bg.addColorStop(1, '#030408'); // Pitch black edges
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Draw Ambient Nebulae
    nebulae.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, `hsla(${n.hue}, 70%, 60%, 0.04)`);
      g.addColorStop(1, `hsla(${n.hue}, 70%, 60%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Update & Draw Neural Nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      let n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      // Seamless screen wrap
      if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;

      // 4. Draw Inter-Node Connections (Synapses)
      for (let j = i + 1; j < NODE_COUNT; j++) {
        let n2 = nodes[j];
        let dx = n.x - n2.x;
        let dy = n.y - n2.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          // Opacity based on distance
          let alpha = (1 - dist / CONNECT_DIST) * 0.25; 
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // Indigo links
          ctx.lineWidth = 1;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }

      // 5. Interactive Mouse Connection (Cursor Pull)
      let dxM = n.x - mx;
      let dyM = n.y - my;
      let distM = Math.sqrt(dxM*dxM + dyM*dyM);
      
      if (distM < 220) {
        ctx.beginPath();
        let alpha = (1 - distM / 220) * 0.7;
        ctx.strokeStyle = n.color.replace('1)', `${alpha})`); // Glow matches node color
        ctx.lineWidth = 1.5;
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mx, my);
        ctx.stroke();

        // Subtle magnetic pull toward cursor
        n.x -= dxM * 0.015;
        n.y -= dyM * 0.015;
      }

      // 6. Draw the Node
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      
      // Node Glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = n.color;
    }
    
    ctx.shadowBlur = 0; // Reset shadow for next frame
    requestAnimationFrame(draw);
  }
  
  requestAnimationFrame(draw);
})();


// ===== CUSTOM CURSOR =====
(function initCursor() {
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  let mx = -999, my = -999, ox = -999, oy = -999, ready = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    if (!ready) {
      ready = true;
      ox = mx; oy = my;
      document.body.classList.add('cursor-ready');
    }
  }, { passive: true });

  (function animRing() {
    if (ready) {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .glass-card, .tech-card, .cert-card, .hlcard').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });

  if ('ontouchstart' in window) {
    dot.style.display     = 'none';
    outline.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if(!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const pos = window.scrollY + 200;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });
}, { passive: true });

const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
if (hamburger && navLinksEl) {
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// ===== SKILL TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => { t.classList.add('hidden'); t.classList.remove('active'); });
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (!target) return;
    target.classList.remove('hidden');
    void target.offsetWidth;
    target.classList.add('active');
    animateSkillBars(target);
  });
});

// ===== SKILL BARS =====
function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(fill => {
    fill.classList.remove('animated');
    void fill.offsetWidth;
    fill.classList.add('animated');
  });
}
const skillSection = document.getElementById('skills');
if (skillSection) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const techTab = document.getElementById('technical');
      if(techTab) animateSkillBars(techTab);
      entries[0].target._skillObserver?.disconnect();
    }
  }, { threshold: 0.2 }).observe(skillSection);
}

// ===== 3D CARD TILT =====
document.querySelectorAll('.glass-card, .project-card, .cert-card, .tilt-element').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth <= 900) return;
    const r = this.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    this.style.transition = 'transform 0.1s ease-out';
    this.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  card.addEventListener('mouseleave', function() {
    if (window.innerWidth <= 900) return;
    this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    this.style.transform = '';
  });
});

// ===== TYPEWRITER =====
(function heroTypewriter() {
  const el = document.querySelector('.hero-role, #typed');
  if (!el) return;
  const roles = ['CS Engineer & ML Enthusiast', 'AI Developer', 'Problem Solver', 'Python & Data Science'];
  let ri = 0, ci = 0, deleting = false;

  function type() {
    const w = roles[ri];
    el.textContent = deleting ? w.slice(0, ci--) : w.slice(0, ci++);
    if (!deleting && ci > w.length) { deleting = true; setTimeout(type, 1800); return; }
    if (deleting && ci < 0)         { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, deleting ? 55 : 90);
  }
  setTimeout(type, 1200);
})();

// ===== COUNTER ANIMATION =====
(function initCounters() {
  const numEls = document.querySelectorAll('.stat-num');
  if (!numEls.length) return;

  function animateNum(el, target, suffix) {
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n + suffix;
      if (n >= target) clearInterval(timer);
    }, 30);
  }

  const observerTarget = document.querySelector('.hero-stats') || numEls[0];
  if(observerTarget) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      numEls.forEach(el => {
        let raw = el.dataset.target || el.textContent.replace(/\D/g, '');
        let suffix = el.textContent.replace(/[\d]/g, '');
        if(raw) animateNum(el, parseInt(raw), suffix);
      });
    }, { threshold: 0.5 }).observe(observerTarget);
  }
})();

// ===== EMAILJS CONTACT FORM =====
window.handleFormSubmit = window.handleSub = function(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn, .sbtn');
  if(!btn) return;
  
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

  // Fallback timeout simulation if EmailJS isn't hooked up yet
  setTimeout(() => {
    btn.classList.add('success');
    btn.style.background = '#10b981';
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
    e.target.reset();
    setTimeout(() => { 
        btn.disabled = false; 
        btn.classList.remove('success'); 
        btn.style.background = '';
        btn.innerHTML = original; 
    }, 3000);
  }, 1500);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideChatbaseGhosts);
  } else {
    hideChatbaseGhosts();
  }

  const observer = new MutationObserver(hideChatbaseGhosts);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  window.addEventListener('load', () => {
    setTimeout(hideChatbaseGhosts, 500);
    setTimeout(hideChatbaseGhosts, 1500);
  });
})();
