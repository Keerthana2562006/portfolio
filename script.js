/**
 * KEERTHANA R. — DATA SCIENCE & ANALYTICS PORTFOLIO
 * HR-FRIENDLY & BUSINESS-FOCUSED INTERACTIVE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initCursorGlow();
  initNavigation();
  initRoleTicker();
  initPortraitTilt();
  initScrollReveal();
  initDataSciencePipeline();
  initAttendanceSimulator();
  initPowerBiSimulation();
  initSkillsFilter();
  initContactActions();
  initDynamicYear();
});

/* ========================================================
   1. AMBIENT DATA PARTICLES & CONSTELLATION CANVAS
   ======================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(34, 211, 238, ' : 'rgba(99, 102, 241, ';
      this.alpha = Math.random() * 0.4 + 0.15;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      // Gentle floating
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse subtle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let dirX = dx / dist;
          let dirY = dy / dist;
          this.x -= dirX * force * 1.5;
          this.y -= dirY * force * 1.5;
        }
      }

      this.draw();
    }
  }

  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 18000), 65);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let opacity = (1 - dist / maxDist) * 0.14;
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ========================================================
   2. CURSOR GLOW FOLLOWER
   ======================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = -1000;
  let mouseY = -1000;
  let currentX = -1000;
  let currentY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(render);
  }

  render();
}

/* ========================================================
   3. NAVIGATION & SCROLL TRACKING
   ======================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section indicator via IntersectionObserver
  const sections = document.querySelectorAll('section[id], header[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));
}

/* ========================================================
   4. DYNAMIC ROLE TICKER TYPEWRITER
   ======================================================== */
function initRoleTicker() {
  const tickerEl = document.getElementById('role-ticker');
  if (!tickerEl) return;

  const roles = [
    'DATA SCIENCE',
    'DATA ANALYTICS',
    'POWER BI & DAX',
    'DATABASE MANAGEMENT',
    'BUSINESS INSIGHTS',
  ];

  let currentRoleIdx = 0;
  let charIdx = roles[0].length;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 2200;
  const pauseStart = 450;

  function type() {
    const fullText = roles[currentRoleIdx];

    if (isDeleting) {
      charIdx--;
      tickerEl.textContent = fullText.substring(0, charIdx);
    } else {
      charIdx++;
      tickerEl.textContent = fullText.substring(0, charIdx);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === fullText.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, pauseEnd);
}

/* ========================================================
   5. ASYMMETRIC PORTRAIT 3D TILT EFFECT
   ======================================================== */
function initPortraitTilt() {
  const card = document.getElementById('portrait-card');
  const wrapper = document.getElementById('portrait-wrapper');
  if (!card || !wrapper) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ========================================================
   6. SCROLL REVEAL OBSERVER
   ======================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-item');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ========================================================
   7. INTERACTIVE DATA SCIENCE PIPELINE (HR & BUSINESS FRIENDLY)
   ======================================================== */
function initDataSciencePipeline() {
  const tabs = document.querySelectorAll('.pipeline-tab');
  const stageNum = document.getElementById('stage-num');
  const stageTitle = document.getElementById('stage-title');
  const stageTools = document.getElementById('stage-tools');
  const stageSubtitle = document.getElementById('stage-subtitle');
  const stageText = document.getElementById('stage-text');
  const stageMetrics = document.getElementById('stage-metrics');
  const deliverableTag = document.getElementById('stage-deliverable-tag');
  const deliverableTitle = document.getElementById('stage-deliverable-title');
  const deliverableList = document.getElementById('stage-deliverable-list');
  const impactText = document.getElementById('stage-impact-text');

  if (!tabs.length || !stageTitle) return;

  const stagesData = [
    {
      num: 'STAGE 01',
      title: 'Raw Data Ingestion & Schema Validation',
      tools: 'Python · Pandas · SQL · Databases',
      subtitle: 'Establishing data integrity from disparate operational records',
      text: 'Every reliable analytics pipeline begins with understanding data types, missing values, duplicates, and boundary constraints. Whether handling CSVs, SQL relations, or database documents, I ensure the structural integrity of every attribute before modeling.',
      metrics: [
        { title: 'Input Formats', val: 'CSV, Excel, SQL' },
        { title: 'Data Checks', val: 'Types, Nulls, Bounds' },
        { title: 'Objective', val: '100% Data Accuracy' },
      ],
      deliverableTag: 'DATA READINESS',
      deliverableTitle: 'Verified & Structured Raw Ingestion',
      deliverables: [
        'Comprehensive audit of incoming datasets across all departments.',
        'Automated validation of column definitions, timestamps, and customer IDs.',
        'Eliminates corrupt or incomplete files before business metrics are computed.',
      ],
      impact: 'Prevents costly reporting errors early by ensuring executive reports are built only on verified, trustworthy records.',
    },
    {
      num: 'STAGE 02',
      title: 'Data Cleaning & Preprocessing',
      tools: 'Data Quality · Standardizing · Imputation',
      subtitle: 'Eliminating noise and ensuring high-quality reliable inputs',
      text: 'Real-world data is inherently messy. I apply systematic strategies to handle missing values, standardize date-time timestamps, remove duplicated customer transactions, and eliminate statistical outliers so models and reports reflect reality.',
      metrics: [
        { title: 'Data Strategy', val: 'Targeted Imputation' },
        { title: 'Deduplication', val: 'Unique Key Auditing' },
        { title: 'Quality Target', val: 'Zero Null Values' },
      ],
      deliverableTag: 'DATA QUALITY',
      deliverableTitle: 'Clean & Standardized Dataset',
      deliverables: [
        'Removal of repeated transactions to prevent inflated revenue counts.',
        'Standardization of product categories and geographical names.',
        'Intelligent treatment of missing numbers using category medians.',
      ],
      impact: 'Guarantees reliable metrics for leadership without skew from duplicates or bad entries.',
    },
    {
      num: 'STAGE 03',
      title: 'Exploratory Data Analysis (EDA)',
      tools: 'Statistical Analysis · Distribution Trends',
      subtitle: 'Uncovering distributional shapes, variance, and correlations',
      text: 'Analyzing historical distributions reveals the underlying business story: identifying high-volume sales seasons, customer purchase patterns, and product profitability clusters that guide smarter commercial decisions.',
      metrics: [
        { title: 'Analysis', val: 'Pattern Detection' },
        { title: 'Correlations', val: 'Trend Identification' },
        { title: 'Deliverable', val: 'Visual Heatmaps' },
      ],
      deliverableTag: 'BUSINESS PATTERNS',
      deliverableTitle: 'Statistical Profiling & Insights',
      deliverables: [
        'Identifies top 20% products that generate 80% of net margin.',
        'Exposes seasonal demand peaks across retail quarters.',
        'Flags regional underperformance to direct marketing interventions.',
      ],
      impact: 'Provides leadership with clear diagnostic clarity on what is driving growth and where revenue is slipping.',
    },
    {
      num: 'STAGE 04',
      title: 'Predictive Modeling & Analysis',
      tools: 'Classification · Regression · Forecasting',
      subtitle: 'Transforming historical patterns into predictive signals',
      text: 'Applying statistical algorithms (such as Decision Trees and Random Forest) to test hypotheses, categorize customer behaviors, and forecast future demand scenarios using cross-validated accuracy testing.',
      metrics: [
        { title: 'Validation', val: 'Train/Test Split' },
        { title: 'Methods', val: 'Classification & Trees' },
        { title: 'Benchmark', val: 'High Accuracy Metric' },
      ],
      deliverableTag: 'PREDICTIVE SIGNAL',
      deliverableTitle: 'Predictive Model Evaluation',
      deliverables: [
        'Forecasts customer retention and identifies churn risks before they leave.',
        'Estimates demand levels to prevent both stockouts and excess inventory.',
        'Compares multiple algorithms to deploy the most reliable model.',
      ],
      impact: 'Shifts organizational posture from reactive problem-solving to proactive forecasting and planning.',
    },
    {
      num: 'STAGE 05',
      title: 'Interactive Visual Analytics & Power BI',
      tools: 'Power BI · Business Intelligence · KPIs',
      subtitle: 'Translating complex data models into executive dashboards',
      text: 'Structuring clean data relationships and authoring dynamic business calculations (YoY growth, net margin %, sales quotas) that empower managers and executives with intuitive, interactive drill-down reports.',
      metrics: [
        { title: 'Design', val: 'Star Schema' },
        { title: 'Calculations', val: 'Dynamic DAX KPIs' },
        { title: 'Experience', val: 'One-Click Slicing' },
      ],
      deliverableTag: 'EXECUTIVE VISUALS',
      deliverableTitle: 'Interactive Executive Dashboard',
      deliverables: [
        'High-level summary cards for Total Sales, Net Profit, and Order Volume.',
        'Interactive category and regional filters for granular performance audits.',
        'Automated scheduled refreshes ensuring decision-makers view real-time data.',
      ],
      impact: 'Empowers non-technical executives and managers to make informed, data-backed decisions in seconds.',
    },
    {
      num: 'STAGE 06',
      title: 'Actionable Business Insight & Delivery',
      tools: 'Executive Reporting · Strategic Recommendations',
      subtitle: 'Closing the loop: Turning statistical conclusions into real impact',
      text: 'Data science is only valuable when it leads to measurable business outcomes. Translating analytical findings into concrete operational steps—such as adjusting promotional discounts or streamlining operations—delivers tangible return on investment.',
      metrics: [
        { title: 'Outcome', val: 'Strategic Action' },
        { title: 'Focus', val: 'Revenue & Efficiency' },
        { title: 'Audience', val: 'Business Leadership' },
      ],
      deliverableTag: 'STRATEGIC ACTION',
      deliverableTitle: 'Operational Takeaways & ROI',
      deliverables: [
        'Capping promotional discounts above 20% preserves margin profitability.',
        'Early attendance threshold warnings prevent academic default with 94% lead time.',
        'Inventory rebalancing in high-return regions minimizes logistical overhead.',
      ],
      impact: 'Delivers clear, high-impact ROI by directly improving operational efficiency and safeguarding margins.',
    },
  ];

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const stageIndex = parseInt(tab.getAttribute('data-stage'), 10);
      const data = stagesData[stageIndex];

      // Update content
      stageNum.textContent = data.num;
      stageTitle.textContent = data.title;
      stageTools.textContent = data.tools;
      stageSubtitle.textContent = data.subtitle;
      stageText.textContent = data.text;

      // Update deliverables card
      if (deliverableTag) deliverableTag.textContent = data.deliverableTag;
      if (deliverableTitle) deliverableTitle.textContent = data.deliverableTitle;
      if (deliverableList) {
        deliverableList.innerHTML = data.deliverables.map((item) => `<li>${item}</li>`).join('');
      }
      if (impactText) impactText.textContent = data.impact;

      // Update metrics
      stageMetrics.innerHTML = data.metrics
        .map(
          (m) => `
        <div class="stage-metric-box">
          <span class="metric-title">${m.title}</span>
          <span class="metric-value">${m.val}</span>
        </div>`
        )
        .join('');
    });
  });
}

/* ========================================================
   8. PROJECT 01: ATTENDANCE SYSTEM SIMULATOR WIDGET
   ======================================================== */
function initAttendanceSimulator() {
  const totalInput = document.getElementById('att-total');
  const attendedInput = document.getElementById('att-attended');
  const pctEl = document.getElementById('att-percentage');
  const barEl = document.getElementById('att-bar');
  const msgEl = document.getElementById('att-msg');

  if (!totalInput || !attendedInput || !pctEl) return;

  function recalculate() {
    let total = parseInt(totalInput.value, 10) || 0;
    let attended = parseInt(attendedInput.value, 10) || 0;

    if (total <= 0) total = 1;
    if (attended < 0) attended = 0;
    if (attended > total) attended = total;

    const percentage = ((attended / total) * 100);
    const pctFormatted = percentage.toFixed(1) + '%';
    pctEl.textContent = pctFormatted;
    barEl.style.width = Math.min(percentage, 100) + '%';

    if (percentage >= 75) {
      pctEl.className = 'sim-val text-green';
      barEl.style.background = 'linear-gradient(90deg, #10B981, #22D3EE)';
      const safeBuffer = Math.floor((attended - 0.75 * total) / 0.75);
      msgEl.innerHTML = `Compliant with 75% policy! You can miss up to <strong>${Math.max(0, safeBuffer)} classes</strong> while maintaining required attendance.`;
    } else {
      pctEl.className = 'sim-val text-warning';
      barEl.style.background = 'linear-gradient(90deg, #F59E0B, #EF4444)';
      // Formula: (attended + x) / (total + x) >= 0.75  =>  x >= (0.75*total - attended) / 0.25
      const classesNeeded = Math.ceil((0.75 * total - attended) / 0.25);
      msgEl.innerHTML = `Warning: Attendance below threshold. Must attend <strong>${classesNeeded} consecutive classes</strong> to reach 75%.`;
    }
  }

  totalInput.addEventListener('input', recalculate);
  attendedInput.addEventListener('input', recalculate);
}

/* ========================================================
   9. PROJECT 03: POWER BI SIMULATION DASHBOARD WIDGET
   ======================================================== */
function initPowerBiSimulation() {
  const filterBtns = document.querySelectorAll('#bi-category-filters .bi-btn');
  const activeFilterName = document.getElementById('bi-active-filter-name');
  const salesVal = document.getElementById('kpi-sales');
  const profitVal = document.getElementById('kpi-profit');
  const qtyVal = document.getElementById('kpi-qty');
  const barsContainer = document.getElementById('bi-bars');

  if (!filterBtns.length || !salesVal) return;

  const dataset = {
    all: {
      name: 'Overall',
      sales: '₹2.29M',
      profit: '₹286.4K',
      qty: '37,873',
      regions: [
        { label: 'West', pct: 82, val: '₹108.4K' },
        { label: 'East', pct: 68, val: '₹91.5K' },
        { label: 'Central', pct: 44, val: '₹39.7K' },
        { label: 'South', pct: 52, val: '₹46.8K' },
      ],
    },
    tech: {
      name: 'Technology',
      sales: '₹836.1K',
      profit: '₹145.4K',
      qty: '6,939',
      regions: [
        { label: 'West', pct: 90, val: '₹60.2K' },
        { label: 'East', pct: 75, val: '₹47.5K' },
        { label: 'Central', pct: 48, val: '₹19.2K' },
        { label: 'South', pct: 40, val: '₹18.5K' },
      ],
    },
    furn: {
      name: 'Furniture',
      sales: '₹741.9K',
      profit: '₹18.4K',
      qty: '8,028',
      regions: [
        { label: 'West', pct: 55, val: '₹11.5K' },
        { label: 'East', pct: 42, val: '₹8.2K' },
        { label: 'Central', pct: 15, val: '-₹2.9K' },
        { label: 'South', pct: 25, val: '₹1.6K' },
      ],
    },
    off: {
      name: 'Office Supplies',
      sales: '₹719.0K',
      profit: '₹122.5K',
      qty: '22,906',
      regions: [
        { label: 'West', pct: 78, val: '₹36.7K' },
        { label: 'East', pct: 70, val: '₹35.8K' },
        { label: 'Central', pct: 54, val: '₹23.4K' },
        { label: 'South', pct: 62, val: '₹26.6K' },
      ],
    },
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const catKey = btn.getAttribute('data-cat');
      const data = dataset[catKey];

      activeFilterName.textContent = data.name;
      salesVal.textContent = data.sales;
      profitVal.textContent = data.profit;
      qtyVal.textContent = data.qty;

      // Update regional bars
      barsContainer.innerHTML = data.regions
        .map(
          (r) => `
        <div class="bar-item">
          <span class="bar-lbl mono">${r.label}</span>
          <div class="bar-track"><div class="bar-fill" style="width: ${r.pct}%;"></div></div>
          <span class="bar-val mono">${r.val}</span>
        </div>`
        )
        .join('');
    });
  });
}

/* ========================================================
   10. SKILLS FILTER MATRIX
   ======================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-tab-btn');
  const skillGroups = document.querySelectorAll('.skill-category-group');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillGroups.forEach((group) => {
        const groupType = group.getAttribute('data-group');
        if (filter === 'all' || filter === groupType) {
          group.style.display = 'flex';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });
}

/* ========================================================
   11. CONTACT COPY ACTIONS & TOAST
   ======================================================== */
function initContactActions() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('copy-toast');
  const email = 'keerthanar2566@gmail.com';

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showToast);
    } else {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast();
    }
  });

  function showToast() {
    copyBtn.textContent = 'Copied!';
    toast.classList.add('show');
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ========================================================
   12. DYNAMIC YEAR
   ======================================================== */
function initDynamicYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
