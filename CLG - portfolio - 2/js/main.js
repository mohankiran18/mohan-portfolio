/* ============================================================
   KADALI MOHAN KIRAN — PORTFOLIO JS
   Deep-Space Neural / Precision Futurism
   ============================================================ */

// ===== INIT AOS =====
AOS.init({ duration: 750, once: true, easing: 'ease-out-quart', offset: 60 });

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / max * 100) + '%';
});

// ===== PARTICLES BACKGROUND (keep existing) =====
if (typeof particlesJS !== 'undefined') {
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 1200 } },
      color: { value: ["#00d4ff", "#6366f1", "#8b5cf6"] },
      shape: { type: "circle" },
      opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.05, sync: false } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 140, color: "#6366f1", opacity: 0.08, width: 1 },
      move: { enable: true, speed: 0.8, direction: "none", random: true, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } } }
    },
    retina_detect: true
  });
}

// ===== THREE.JS HERO 3D SCENE =====
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

  // ── Ambient + directional light ──
  scene.add(new THREE.AmbientLight(0x1a1a3e, 3));
  const dirLight = new THREE.DirectionalLight(0x00d4ff, 1.5);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // ── Neural network nodes ──
  const nodeCount = 80;
  const nodeGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(nodeCount * 3);
  const nodeData   = [];

  for (let i = 0; i < nodeCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos((Math.random() * 2) - 1);
    const r     = 7 + Math.random() * 3;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    nodeData.push({ speed: 0.002 + Math.random() * 0.003, phase: Math.random() * Math.PI * 2 });
  }
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const nodeMat = new THREE.PointsMaterial({
    color: 0x00d4ff, size: 0.12, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const nodesMesh = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodesMesh);

  // ── Neural lines (edges between nearby nodes) ──
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x6366f1, transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const lineGeo  = new THREE.BufferGeometry();
  const lineVerts = [];
  const posArr    = nodeGeo.attributes.position.array;
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = posArr[i*3]   - posArr[j*3];
      const dy = posArr[i*3+1] - posArr[j*3+1];
      const dz = posArr[i*3+2] - posArr[j*3+2];
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 5) {
        lineVerts.push(posArr[i*3], posArr[i*3+1], posArr[i*3+2]);
        lineVerts.push(posArr[j*3], posArr[j*3+1], posArr[j*3+2]);
      }
    }
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  // ── Central glowing sphere ──
  const sphereGeo = new THREE.SphereGeometry(2.5, 32, 32);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x0a1628, emissive: 0x003355, transparent: true, opacity: 0.6,
    shininess: 100, wireframe: false
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.06 });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(2.55, 18, 18), wireMat));

  // ── Mouse parallax ──
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  });

  // ── Animate ──
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    nodesMesh.rotation.y = t * 0.12 + mouseX * 0.3;
    nodesMesh.rotation.x = t * 0.06 + mouseY * 0.2;
    sphere.rotation.y    = t * 0.3;
    sphere.rotation.x    = Math.sin(t * 0.5) * 0.15;

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();

// ===== CUSTOM CURSOR =====
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mx = 0, my = 0, ox = 0, oy = 0;

if (cursorDot && cursorOutline) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  (function animateOutline() {
    ox += (mx - ox) * 0.14;
    oy += (my - oy) * 0.14;
    cursorOutline.style.left = ox + 'px';
    cursorOutline.style.top  = oy + 'px';
    requestAnimationFrame(animateOutline);
  })();

  document.querySelectorAll('a, button, .glass-card, .tech-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
  });
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;
  sections.forEach(sec => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(a => {
        a.classList.remove('active-link');
        if (a.getAttribute('href') === '#' + sec.id) a.classList.add('active-link');
      });
    }
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
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
    document.querySelectorAll('.tab-content').forEach(t => {
      t.classList.add('hidden');
      t.classList.remove('active');
    });
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    target.classList.remove('hidden');
    void target.offsetWidth;
    target.classList.add('active');
    // Re-trigger skill bars
    animateSkillBars(target);
  });
});

// ===== SKILL BAR ANIMATION (IntersectionObserver) =====
function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(fill => {
    fill.classList.remove('animated');
    void fill.offsetWidth;
    fill.classList.add('animated');
  });
}

const skillSection = document.getElementById('skills');
if (skillSection) {
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateSkillBars(document.getElementById('technical'));
      skillObs.disconnect();
    }
  }, { threshold: 0.2 });
  skillObs.observe(skillSection);
}

// ===== 3D CARD TILT =====
document.querySelectorAll('.glass-card, .project-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const r = this.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
    this.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
  });
});

// ===== TYPEWRITER for hero role =====
(function heroTypewriter() {
  const el = document.querySelector('.hero-role');
  if (!el) return;
  const roles = ['CS Engineer & ML Enthusiast', 'AI Developer', 'Problem Solver', 'Python & Data Science'];
  let ri = 0, ci = 0, deleting = false;
  const baseText = '';

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.slice(0, ci--);
      if (ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  // Start after a short delay
  setTimeout(type, 1200);
})();

// ===== EMAILJS CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  const btn      = document.querySelector('.submit-btn');
  const nameEl   = document.getElementById('name');
  const emailEl  = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const msgEl    = document.getElementById('message');

  btn.disabled = true;
  const original = btn.innerHTML;
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
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed — Try Again';
    btn.style.background = 'rgba(220,38,38,0.5)';
    setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 4000);
  });
}