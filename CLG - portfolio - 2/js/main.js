/* ============================================================
   KADALI MOHAN KIRAN — PORTFOLIO JS  v2.0
   Deep-Space Neural / Precision Futurism
   ============================================================ */

// ===== AOS =====
AOS.init({ duration: 750, once: true, easing: 'ease-out-quart', offset: 60 });

// ===== SCROLL PROGRESS =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}, { passive: true });

// ===== GALAXY CANVAS =====
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, animId;

  const STAR_COUNT   = 350;
  const NEBULA_COUNT = 7;
  const STAR_COLS    = [
    'rgba(0,212,255,A)',    // cyan
    'rgba(99,102,241,A)',   // indigo
    'rgba(139,92,246,A)',   // violet
    'rgba(255,255,255,A)',  // white
    'rgba(236,72,153,A)',   // pink
    'rgba(20,184,166,A)',   // teal
  ];

  let stars = [], nebulae = [], shooters = [];
  let shootTimer = 0;
  let gmx = 0, gmy = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkStar() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     0.25 + Math.random() * 1.5,
      col:   STAR_COLS[Math.floor(Math.random() * STAR_COLS.length)],
      alpha: 0.15 + Math.random() * 0.85,
      speed: 0.0004 + Math.random() * 0.001,
      phase: Math.random() * Math.PI * 2,
      depth: 0.2 + Math.random() * 0.8,   // parallax layer
    };
  }

  function mkNebula() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      rx:    100 + Math.random() * 280,
      ry:    70  + Math.random() * 180,
      hue:   [260, 200, 330, 180, 210][Math.floor(Math.random() * 5)],
      alpha: 0.018 + Math.random() * 0.038,
      rot:   Math.random() * Math.PI,
    };
  }

  function mkShooter() {
    const angle = Math.PI / 6 + Math.random() * (Math.PI / 5);
    const speed = 5 + Math.random() * 10;
    return {
      x: Math.random() * W * 0.65,
      y: Math.random() * H * 0.45,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      len: 70 + Math.random() * 100,
      alpha: 1,
      life: 0,
    };
  }

  function build() {
    stars   = Array.from({ length: STAR_COUNT },   mkStar);
    nebulae = Array.from({ length: NEBULA_COUNT }, mkNebula);
  }

  function draw(ts) {
    animId = requestAnimationFrame(draw);

    ctx.clearRect(0, 0, W, H);

    // deep space bg
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
    bg.addColorStop(0,   '#0c0a18');
    bg.addColorStop(0.45,'#070510');
    bg.addColorStop(1,   '#020208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // nebulae
    for (const n of nebulae) {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx);
      g.addColorStop(0, `hsla(${n.hue},70%,55%,${n.alpha})`);
      g.addColorStop(1, `hsla(${n.hue},70%,40%,0)`);
      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(0, 0, n.rx, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    // parallax offset from mouse
    const ox = (gmx / W - 0.5) * 22;
    const oy = (gmy / H - 0.5) * 14;
    const t  = ts * 0.001;

    // stars
    for (const s of stars) {
      const twinkle = 0.4 + 0.6 * Math.sin(t * s.speed * 1000 + s.phase);
      const a   = twinkle * s.alpha;
      const px  = s.x + ox * s.depth;
      const py  = s.y + oy * s.depth;
      const col = s.col.replace('A', a.toFixed(2));

      if (s.r > 1.0) {
        const glow = ctx.createRadialGradient(px, py, 0, px, py, s.r * 5);
        glow.addColorStop(0, s.col.replace('A', (a * 0.3).toFixed(2)));
        glow.addColorStop(1, s.col.replace('A', '0'));
        ctx.beginPath();
        ctx.arc(px, py, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }

    // shooting stars
    shootTimer++;
    if (shootTimer > 200 + Math.random() * 100) {
      shooters.push(mkShooter());
      shootTimer = 0;
    }
    shooters = shooters.filter(s => s.alpha > 0.02);
    for (const s of shooters) {
      s.x += s.vx; s.y += s.vy; s.life++;
      s.alpha = Math.max(0, 1 - s.life / 38);
      const tx = s.x - s.vx * (s.len / 8);
      const ty = s.y - s.vy * (s.len / 8);
      const g  = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0,   `rgba(255,255,255,0)`);
      g.addColorStop(0.5, `rgba(160,120,255,${(s.alpha * 0.5).toFixed(2)})`);
      g.addColorStop(1,   `rgba(255,255,255,${s.alpha.toFixed(2)})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(2)})`;
      ctx.fill();
    }
  }

  // mouse parallax for galaxy
  document.addEventListener('mousemove', e => { gmx = e.clientX; gmy = e.clientY; }, { passive: true });
  window.addEventListener('resize', () => { resize(); build(); }, { passive: true });

  resize();
  build();
  requestAnimationFrame(draw);
})();

// ===== PARTICLES (original kept) =====
if (typeof particlesJS !== 'undefined') {
  particlesJS('particles-js', {
    particles: {
      number:  { value: 50, density: { enable: true, value_area: 1200 } },
      color:   { value: ['#00d4ff','#6366f1','#8b5cf6'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.2, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.04, sync: false } },
      size:    { value: 2, random: true },
      line_linked: { enable: true, distance: 130, color: '#6366f1', opacity: 0.07, width: 1 },
      move:    { enable: true, speed: 0.7, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      detect_on: 'canvas',
      events:    { onhover: { enable: true, mode: 'grab' }, resize: true },
      modes:     { grab: { distance: 180, line_linked: { opacity: 0.28 } } },
    },
    retina_detect: true,
  });
}

// ===== THREE.JS HERO 3D =====
(function initHero3D() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  camera.position.set(0, 0, 22);

  scene.add(new THREE.AmbientLight(0x1a1a3e, 3));
  const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.5);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // nodes
  const nodeCount = 80;
  const nodeGeo   = new THREE.BufferGeometry();
  const positions = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(Math.random() * 2 - 1);
    const r     = 7 + Math.random() * 3;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const nodeMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.12, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
  const nodesMesh = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodesMesh);

  // edges
  const lineMat  = new THREE.LineBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false });
  const lineVerts = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = positions[i*3] - positions[j*3];
      const dy = positions[i*3+1] - positions[j*3+1];
      const dz = positions[i*3+2] - positions[j*3+2];
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 5) {
        lineVerts.push(positions[i*3],positions[i*3+1],positions[i*3+2]);
        lineVerts.push(positions[j*3],positions[j*3+1],positions[j*3+2]);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  // sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x0a1628, emissive: 0x003355, transparent: true, opacity: 0.6, shininess: 100 })
  );
  scene.add(sphere);
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(2.55, 18, 18), new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06 })));

  let hmx = 0, hmy = 0, t3 = 0;
  document.addEventListener('mousemove', e => { hmx = (e.clientX / window.innerWidth - 0.5) * 0.8; hmy = (e.clientY / window.innerHeight - 0.5) * 0.8; }, { passive: true });

  (function animate3D() {
    requestAnimationFrame(animate3D);
    t3 += 0.005;
    nodesMesh.rotation.y = t3 * 0.12 + hmx * 0.3;
    nodesMesh.rotation.x = t3 * 0.06 + hmy * 0.2;
    sphere.rotation.y    = t3 * 0.3;
    sphere.rotation.x    = Math.sin(t3 * 0.5) * 0.15;
    camera.position.x   += (hmx * 3 - camera.position.x) * 0.03;
    camera.position.y   += (-hmy * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
})();

// ===== CUSTOM CURSOR  — fixed ghost-box bug =====
(function initCursor() {
  const dot     = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;

  let mx = -999, my = -999, ox = -999, oy = -999, ready = false;

  // Only show cursors after the FIRST real mouse move
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    if (!ready) {
      ready = true;
      ox = mx; oy = my;   // snap ring to cursor so it doesn't drift from 0,0
      document.body.classList.add('cursor-ready');  // CSS opacity:1 kicks in
    }
  }, { passive: true });

  // Lagging ring
  (function animRing() {
    if (ready) {
      ox += (mx - ox) * 0.14;
      oy += (my - oy) * 0.14;
      outline.style.left = ox + 'px';
      outline.style.top  = oy + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  // Hover enlarge
  document.querySelectorAll('a, button, .glass-card, .tech-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });

  // Hide on touch devices
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

// Hamburger
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
      animateSkillBars(document.getElementById('technical'));
      entries[0].target._skillObserver?.disconnect();
    }
  }, { threshold: 0.2 }).observe(skillSection);
}

// ===== 3D CARD TILT =====
document.querySelectorAll('.glass-card, .project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const r = this.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 10;
    this.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// ===== TYPEWRITER =====
(function heroTypewriter() {
  const el = document.querySelector('.hero-role');
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

  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    numEls.forEach(el => {
      const raw    = el.textContent.replace(/\D/g, '');
      const suffix = el.textContent.replace(/[\d]/g, '');
      animateNum(el, parseInt(raw), suffix);
    });
  }, { threshold: 0.5 }).observe(document.querySelector('.hero-stats') || numEls[0]);
})();

// ===== EMAILJS CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  const btn       = document.querySelector('.submit-btn');
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const msgEl     = document.getElementById('message');
  const original  = btn.innerHTML;

  btn.disabled  = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

  emailjs.send('service_0ttufbh', 'template_b2zui0l', {
    from_name: nameEl.value,
    reply_to:  emailEl.value,
    subject:   subjectEl.value,
    message:   msgEl.value,
  })
  .then(() => {
    btn.classList.add('success');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
    nameEl.value = ''; emailEl.value = ''; subjectEl.value = ''; msgEl.value = '';
    setTimeout(() => { btn.disabled = false; btn.classList.remove('success'); btn.innerHTML = original; }, 4000);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    btn.disabled  = false;
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed — Try Again';
    btn.style.background = 'rgba(220,38,38,0.5)';
    setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 4000);
  });
}
