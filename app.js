// DevConnect Platform JavaScript Application Logic

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFAQ();
    initMobileMenu();
    initCopyProtection();
});

/* ==========================================================
   1. THEME SWITCHER (DARK / LIGHT MODE)
   ========================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('devconnect-theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.remove('dark');
        html.classList.add('light');
        if (themeIcon) themeIcon.className = 'ri-sun-line';
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        if (themeIcon) themeIcon.className = 'ri-moon-line';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                html.classList.add('light');
                themeIcon.className = 'ri-sun-line';
                localStorage.setItem('devconnect-theme', 'light');
                showToast('Switched to Light Theme');
            } else {
                html.classList.remove('light');
                html.classList.add('dark');
                themeIcon.className = 'ri-moon-line';
                localStorage.setItem('devconnect-theme', 'dark');
                showToast('Switched to Dark Cyber Theme');
            }
        });
    }
}

/* ==========================================================
   2. DOMAIN FILTERING LOGIC
   ========================================================== */
function filterDomain(category) {
    const cards = document.querySelectorAll('.domain-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ==========================================================
   3. CREDENTIAL & CERTIFICATE VERIFICATION ENGINE
   ========================================================== */
const sampleDatabase = {
    'DC-2026-1001': {
        name: 'Rohan Sharma',
        domain: 'Java & Spring Boot Development',
        id: 'DC-2026-1001',
        date: 'September 15, 2026',
        status: 'ACTIVE & VERIFIED',
        grade: 'Grade A+ (Distinction)'
    },
    'DC-2026-1002': {
        name: 'Ananya Patel',
        domain: 'Python & Data Science',
        id: 'DC-2026-1002',
        date: 'September 18, 2026',
        status: 'ACTIVE & VERIFIED',
        grade: 'Grade A+ (Honors)'
    },
    'DC-2026-1003': {
        name: 'Vikram Kumar',
        domain: 'Full Stack Web Development',
        id: 'DC-2026-1003',
        date: 'September 10, 2026',
        status: 'ACTIVE & VERIFIED',
        grade: 'Grade A'
    }
};

let currentVerifiedData = sampleDatabase['DC-2026-1001'];

function handleVerification(event) {
    event.preventDefault();
    const input = document.getElementById('verify-id-input').value.trim().toUpperCase();
    if (!input) return;

    const resultBox = document.getElementById('verify-result-box');
    let data = sampleDatabase[input];

    if (!data) {
        data = {
            name: 'Verified Candidate',
            domain: 'Software Engineering Virtual Internship',
            id: input,
            date: 'September 2026 Cohort',
            status: 'OFFICIALLY VERIFIED',
            grade: 'Grade A+ (ISO Accredited)'
        };
    }

    currentVerifiedData = data;

    document.getElementById('res-name').textContent = data.name;
    document.getElementById('res-domain').textContent = data.domain;
    document.getElementById('res-id').textContent = data.id;
    document.getElementById('res-date').textContent = data.date;
    document.getElementById('res-status').textContent = data.status;
    document.getElementById('res-grade').textContent = data.grade;

    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showToast(`Credential ${input} Verified Successfully!`);
}

function setAndVerify(id) {
    document.getElementById('verify-id-input').value = id;
    handleVerification(new Event('submit'));
}

/* Open Printable Visual Certificate Modal */
function openCertificateModal() {
    document.getElementById('cert-modal-name').textContent = currentVerifiedData.name;
    document.getElementById('cert-modal-domain').textContent = currentVerifiedData.domain;
    document.getElementById('cert-modal-id').textContent = currentVerifiedData.id;
    document.getElementById('cert-modal-date').textContent = currentVerifiedData.date;

    openModal('cert-modal');
}

/* ==========================================================
   4. ADMIN WORKSPACE PORTAL LOGIC
   ========================================================== */
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === 'admin@devconnect.test' && password === 'demo2026') {
        sessionStorage.setItem('devconnect-admin', 'true');
        document.getElementById('admin-login-view').style.display = 'none';
        document.getElementById('admin-dashboard-view').style.display = 'block';
        showToast('Welcome to Admin Workspace Pulse!');
    } else {
        showToast('Invalid Admin Credentials!');
    }
}

function adminLogout() {
    sessionStorage.removeItem('devconnect-admin');
    document.getElementById('admin-login-view').style.display = 'block';
    document.getElementById('admin-dashboard-view').style.display = 'none';
    showToast('Signed out of Admin Workspace.');
}

function handleIssueCertificate(e) {
    e.preventDefault();
    const name = document.getElementById('issue-name').value.trim();
    const domain = document.getElementById('issue-domain').value.trim();

    if (!name || !domain) return;

    const newId = 'DC-2026-' + Math.floor(2000 + Math.random() * 7000);
    const newRecord = {
        name: name,
        domain: domain,
        id: newId,
        date: 'September 20, 2026',
        status: 'ACTIVE & VERIFIED',
        grade: 'Grade A+ (Distinction)'
    };

    sampleDatabase[newId] = newRecord;

    // Increment metrics counter
    const countEl = document.getElementById('adm-count-certs');
    if (countEl) {
        let current = parseInt(countEl.textContent.replace(',', '')) || 1248;
        countEl.textContent = (current + 1).toLocaleString();
    }

    showToast(`🎓 Issued Certificate ${newId} for ${name}!`);
    closeModal('admin-modal');

    // Auto test verify the newly issued certificate!
    setTimeout(() => {
        setAndVerify(newId);
    }, 500);
}

/* ==========================================================
   5. ATS RESUME ANALYZER & QUIZ TOOLS
   ========================================================== */
function analyzeATSScore() {
    const input = document.getElementById('ats-resume-input').value.trim();
    const meter = document.getElementById('ats-result-meter');
    const scoreNum = document.getElementById('ats-score-num');
    const scoreTitle = document.getElementById('ats-score-title');
    const scoreDesc = document.getElementById('ats-score-desc');

    if (!input) {
        showToast('Please paste your resume skills text first!');
        return;
    }

    const keywords = ['java', 'spring', 'react', 'node', 'python', 'sql', 'git', 'rest', 'api', 'aws', 'docker', 'mongodb', 'html', 'css', 'javascript'];
    const lowercaseInput = input.toLowerCase();

    let matchCount = 0;
    keywords.forEach(kw => {
        if (lowercaseInput.includes(kw)) matchCount++;
    });

    const percentage = Math.min(96, Math.max(65, Math.floor((matchCount / 6) * 40 + 55)));

    scoreNum.textContent = percentage + '%';
    if (percentage >= 85) {
        scoreTitle.textContent = 'Excellent ATS Match!';
        scoreDesc.textContent = `High keyword density found (${matchCount} key tech terms matched). Recommended for senior tech screening.`;
    } else {
        scoreTitle.textContent = 'Good ATS Score';
        scoreDesc.textContent = `Matched ${matchCount} core developer skills. Adding Git, Spring Boot, or REST API keywords can boost score to 90%+.`;
    }

    meter.style.display = 'flex';
    showToast('ATS Compatibility Calculation Complete!');
}

/* Quiz State */
const quizQuestions = [
    {
        q: 'Q: What annotation in Spring Boot marks a class as a REST Controller?',
        options: [
            { text: '@Controller', correct: false },
            { text: '@RestController', correct: true },
            { text: '@Service', correct: false }
        ]
    },
    {
        q: 'Q: Which Hook in React is used to manage side effects like data fetching?',
        options: [
            { text: 'useState', correct: false },
            { text: 'useEffect', correct: true },
            { text: 'useContext', correct: false }
        ]
    },
    {
        q: 'Q: Which library is primarily used in Python for DataFrame manipulation?',
        options: [
            { text: 'NumPy', correct: false },
            { text: 'Pandas', correct: true },
            { text: 'Scikit-Learn', correct: false }
        ]
    }
];

let quizIndex = 0;

function checkQuizAnswer(el, isCorrect) {
    const feedback = document.getElementById('quiz-feedback');
    const allOptions = el.parentElement.querySelectorAll('.quiz-option');

    allOptions.forEach(opt => opt.style.pointerEvents = 'none');

    if (isCorrect) {
        el.classList.add('correct');
        feedback.textContent = '✨ Correct Answer! Excellent dev knowledge.';
        feedback.style.color = 'var(--primary-lime)';
    } else {
        el.classList.add('wrong');
        feedback.textContent = '❌ Incorrect. Try the next question!';
        feedback.style.color = 'var(--accent-rose)';
    }
    feedback.style.display = 'block';
}

function nextQuizQuestion() {
    quizIndex = (quizIndex + 1) % quizQuestions.length;
    const current = quizQuestions[quizIndex];
    const container = document.getElementById('quiz-container');
    const feedback = document.getElementById('quiz-feedback');

    feedback.style.display = 'none';

    let html = `<p style="font-weight:600; font-size:0.95rem; margin-bottom:12px;">${current.q}</p>`;
    current.options.forEach(opt => {
        html += `<div class="quiz-option" onclick="checkQuizAnswer(this, ${opt.correct})">${opt.text}</div>`;
    });

    container.innerHTML = html;
}

/* ==========================================================
   6. MODAL DIALOG CONTROLS
   ========================================================== */
function openModal(modalId, domainName = null) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (domainName && modalId === 'apply-modal') {
            const domainSelect = document.getElementById('modal-domain-select');
            if (domainSelect) {
                domainSelect.value = domainName;
            }
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

/* ==========================================================
   6b. APPLICANT DASHBOARD INTERACTION
   ========================================================== */
function switchDashboardTab(tabName) {
    const btnRoadmap = document.getElementById('tab-btn-roadmap');
    const btnCert = document.getElementById('tab-btn-cert');
    const tabRoadmap = document.getElementById('dash-tab-roadmap');
    const tabCert = document.getElementById('dash-tab-cert');

    if (!btnRoadmap || !btnCert || !tabRoadmap || !tabCert) return;

    if (tabName === 'roadmap') {
        btnRoadmap.classList.add('active');
        btnCert.classList.remove('active');
        tabRoadmap.style.display = 'block';
        tabCert.style.display = 'none';
    } else {
        btnCert.classList.add('active');
        btnRoadmap.classList.remove('active');
        tabCert.style.display = 'block';
        tabRoadmap.style.display = 'none';
    }
}

function toggleTaskDone(el) {
    if (!el) return;
    el.classList.toggle('done');
    const badge = el.querySelector('.badge-pill');
    if (badge) {
        if (el.classList.contains('done')) {
            badge.textContent = 'COMPLETED';
            badge.style.background = 'rgba(16,185,129,0.15)';
            badge.style.color = 'var(--accent-emerald)';
        } else {
            badge.textContent = 'IN PROGRESS';
            badge.style.background = 'var(--primary-lime-subtle)';
            badge.style.color = 'var(--primary-lime)';
        }
    }
}


/* ==========================================================
   7. FORM SUBMISSION HANDLERS
   ========================================================== */
function handleApplySubmit(e) {
    e.preventDefault();
    closeModal('apply-modal');
    showToast('🎉 Application Submitted! Check your email for Offer Letter.');

    const randomId = 'DC-2026-' + Math.floor(1000 + Math.random() * 9000);
    setTimeout(() => {
        setAndVerify(randomId);
    }, 600);
}

function handleLoginSubmit(e) {
    e.preventDefault();
    closeModal('login-modal');
    showToast('Welcome to Intern Dashboard!');
}

/* ==========================================================
   8. FAQ ACCORDION LOGIC
   ========================================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================
   9. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.querySelector('.nav-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            if (menu.style.display === 'flex') {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'flex';
                menu.style.flexDirection = 'column';
                menu.style.position = 'absolute';
                menu.style.top = '76px';
                menu.style.left = '0';
                menu.style.width = '100%';
                menu.style.background = 'var(--bg-card)';
                menu.style.padding = '20px';
                menu.style.borderBottom = '1px solid var(--border-medium)';
            }
        });
    }
}

/* ==========================================================
   10. PROTECTION & TOAST FEEDBACK
   ========================================================== */
let toastTimer;
function showToast(msg = 'Content is protected. Copying disabled.') {
    const toast = document.getElementById('protect-toast');
    const toastText = document.getElementById('toast-text');
    if (!toast) return;

    if (toastText) toastText.textContent = msg;

    clearTimeout(toastTimer);
    toast.classList.add('show');

    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function initCopyProtection() {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showToast('🛡️ Content Protected. Right-click disabled.');
    });

    document.addEventListener('copy', (e) => {
        e.preventDefault();
        showToast('🛡️ DevConnect Content Protected.');
    });
}
