const seedPrograms = [
  { id: 'frontend', title: 'Frontend Development', category: 'technology', label: 'TECHNOLOGY', duration: '4 WEEKS', symbol: '</>', color: '#c9e74a', description: 'Design and build thoughtful interfaces for the web.', tags: ['HTML', 'CSS', 'JAVASCRIPT'] },
  { id: 'data', title: 'Data Analytics', category: 'data', label: 'DATA & AI', duration: '6 WEEKS', symbol: '↗', color: '#ffb69f', description: 'Find stories in data and turn insights into decisions.', tags: ['PYTHON', 'SQL', 'POWER BI'] },
  { id: 'uiux', title: 'UI/UX Design', category: 'design', label: 'DESIGN', duration: '4 WEEKS', symbol: '✦', color: '#b6d9db', description: 'Create human-centered digital experiences from idea to prototype.', tags: ['FIGMA', 'RESEARCH', 'PROTOTYPING'] },
  { id: 'python', title: 'Python Programming', category: 'technology', label: 'TECHNOLOGY', duration: '4 WEEKS', symbol: '⌘', color: '#ffd67f', description: 'Use Python to solve practical problems and automate work.', tags: ['PYTHON', 'APIS', 'GIT'] },
  { id: 'ml', title: 'Machine Learning', category: 'data', label: 'DATA & AI', duration: '8 WEEKS', symbol: '∿', color: '#d8c8ff', description: 'Build predictive models with a clear project-based roadmap.', tags: ['PYTHON', 'PANDAS', 'SCIKIT-LEARN'] },
  { id: 'cyber', title: 'Cybersecurity', category: 'technology', label: 'TECHNOLOGY', duration: '6 WEEKS', symbol: '◈', color: '#ffbba9', description: 'Learn the foundations of safer systems and security practice.', tags: ['NETWORKS', 'LINUX', 'SECURITY'] },
];

const defaultApplicants = [
  { name: 'Ananya Mehta', email: 'ananya@email.com', program: 'Frontend Development', status: 'New' },
  { name: 'Kabir Shah', email: 'kabir@email.com', program: 'Data Analytics', status: 'Reviewed' },
  { name: 'Isha Verma', email: 'isha@email.com', program: 'Python Programming', status: 'New' },
];
const defaultStudents = [
  {
    id: 'student-demo', name: 'Aarav Kapoor', email: 'student@devconnect.test', password: 'demo2026',
    program: 'Frontend Development', cohort: 'September 2026', applicationStatus: 'Active internship',
    tasks: [
      { title: 'Set up your development workspace', type: 'Orientation task', done: true },
      { title: 'Build a responsive landing page', type: 'Project 1', done: true },
      { title: 'Create an accessible sign-up flow', type: 'Project 2', done: false },
      { title: 'Publish your portfolio case study', type: 'Final submission', done: false },
    ],
  },
];
const demoCertificate = { id: 'SK-2026-1842', name: 'Priya Sharma', program: 'Frontend Development', date: '18 September 2026', status: 'Verified' };
const state = {
  programs: JSON.parse(localStorage.getItem('devconnect-programs') || 'null') || seedPrograms,
  applicants: JSON.parse(localStorage.getItem('devconnect-applicants') || 'null') || defaultApplicants,
  certificates: JSON.parse(localStorage.getItem('devconnect-certificates') || 'null') || [demoCertificate],
  students: JSON.parse(localStorage.getItem('devconnect-students') || 'null') || defaultStudents,
};

function persist() {
  localStorage.setItem('devconnect-programs', JSON.stringify(state.programs));
  localStorage.setItem('devconnect-applicants', JSON.stringify(state.applicants));
  localStorage.setItem('devconnect-certificates', JSON.stringify(state.certificates));
  localStorage.setItem('devconnect-students', JSON.stringify(state.students));
}

function renderPrograms(filter = 'all') {
  const grid = document.querySelector('#programGrid');
  const source = filter === 'all' ? state.programs : state.programs.filter(program => program.category === filter);
  grid.innerHTML = '';
  source.forEach(program => {
    const node = document.querySelector('#programTemplate').content.cloneNode(true);
    node.querySelector('.program-icon').style.setProperty('--card-color', program.color);
    node.querySelector('.program-icon').style.setProperty('--card-symbol', `'${program.symbol}'`);
    node.querySelector('.program-duration').textContent = program.duration;
    node.querySelector('.program-category').textContent = program.label;
    node.querySelector('h3').textContent = program.title;
    node.querySelector('.program-description').textContent = program.description;
    node.querySelector('.program-tags').innerHTML = program.tags.map(tag => `<span>${tag}</span>`).join('');
    node.querySelector('.card-link').addEventListener('click', () => openApplication(program));
    grid.append(node);
  });
  document.querySelector('#seePrograms').classList.toggle('hidden', source.length >= state.programs.length);
}

function openApplication(program) {
  const dialog = document.querySelector('#applyDialog');
  document.querySelector('#applicationContent').innerHTML = `
    <div class="modal-inner"><p class="eyebrow">APPLICATION · ${program.duration}</p><h2>${program.title}</h2><p>Start your application. You can manage every response from the admin area.</p>
    <form id="applicationForm"><input type="hidden" name="program" value="${program.title}" /><div class="form-grid">
      <div class="field"><label for="appName">FULL NAME</label><input required id="appName" name="name" placeholder="Your name" /></div>
      <div class="field"><label for="appEmail">EMAIL ADDRESS</label><input required type="email" id="appEmail" name="email" placeholder="you@email.com" /></div>
      <div class="field full"><label for="appCollege">COLLEGE / UNIVERSITY</label><input required id="appCollege" name="college" placeholder="Where are you studying?" /></div>
      <div class="field full"><label for="appDuration">PREFERRED DURATION</label><select id="appDuration" name="duration"><option>4 weeks</option><option>6 weeks</option><option>8 weeks</option></select></div>
    </div><button class="button button-primary" type="submit">Send application <span>→</span></button><p class="form-message" id="applicationMessage"></p></form></div>`;
  dialog.showModal();
  document.querySelector('#applicationForm').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target));
    state.applicants.unshift({ name: values.name, email: values.email, program: values.program, status: 'New' });
    persist();
    document.querySelector('#applicationMessage').textContent = 'Application received — your team can see it in Admin → Applicants.';
    event.target.querySelector('button').disabled = true;
  });
}

function verifyCertificate(id) {
  const result = document.querySelector('#verificationResult');
  const certificate = state.certificates.find(item => item.id.toLowerCase() === id.trim().toLowerCase());
  if (!id.trim()) { result.innerHTML = '<div class="result-card error">Please enter a certificate ID.</div>'; return; }
  if (certificate) {
    result.innerHTML = `<div class="result-card"><strong>✓ Verified certificate</strong>${certificate.name} completed <b>${certificate.program}</b> on ${certificate.date}.<br /><small>Certificate ID: ${certificate.id}</small></div>`;
  } else {
    result.innerHTML = '<div class="result-card error"><strong>Certificate not found</strong>Check the ID and try again. If the problem continues, contact the program team.</div>';
  }
}

function adminMarkup() {
  return `<div class="admin-shell"><aside class="admin-sidebar"><a href="#home" class="brand"><span class="brand-mark">D</span><span>devconnect</span></a><p>ADMIN WORKSPACE</p><nav class="admin-nav"><button class="active" data-admin-tab="overview">Overview</button><button data-admin-tab="applicants">Applicants</button><button data-admin-tab="programs">Programs</button><button data-admin-tab="certificates">Certificates</button><button data-admin-tab="settings">Site settings</button></nav></aside>
  <div class="admin-main"><section class="admin-section active" data-admin-section="overview"><div class="admin-top"><div><p class="eyebrow">GOOD MORNING, ADMIN</p><h2>Your program pulse</h2></div><button class="sign-out" id="signOut">Sign out</button></div><div class="metrics"><div class="metric"><span>TOTAL APPLICANTS</span><b>${state.applicants.length}</b><small>↑ 12% this cohort</small></div><div class="metric"><span>ACTIVE PROGRAMS</span><b>${state.programs.length}</b><small>Open for applications</small></div><div class="metric"><span>CERTIFICATES ISSUED</span><b>${state.certificates.length}</b><small>All are verifiable</small></div></div><div class="admin-panel"><div class="panel-head"><h3>Latest applicants</h3><button class="button button-outline" data-admin-tab="applicants">View all <span>→</span></button></div>${applicantTable(state.applicants.slice(0,4))}</div></section>
  <section class="admin-section" data-admin-section="applicants"><div class="admin-top"><div><p class="eyebrow">APPLICATION MANAGEMENT</p><h2>Applicants</h2></div></div><div class="admin-panel" style="margin-top:24px"><div class="panel-head"><h3>${state.applicants.length} total submissions</h3></div>${applicantTable(state.applicants, true)}</div></section>
  <section class="admin-section" data-admin-section="programs"><div class="admin-top"><div><p class="eyebrow">PROGRAM MANAGEMENT</p><h2>Programs</h2></div></div><form class="admin-panel admin-form" id="addProgram" style="margin-top:24px"><h3>Add a new program</h3><div class="form-grid"><div class="field"><label>PROGRAM NAME</label><input required name="title" placeholder="e.g. Cloud Foundations" /></div><div class="field"><label>CATEGORY</label><select name="category"><option value="technology">Technology</option><option value="data">Data & AI</option><option value="design">Design</option></select></div><div class="field"><label>DURATION</label><input required name="duration" placeholder="e.g. 4 WEEKS" /></div><div class="field"><label>SYMBOL</label><input name="symbol" maxlength="3" value="✦" /></div><div class="field full"><label>SHORT DESCRIPTION</label><input required name="description" placeholder="A short program description" /></div></div><button class="button button-primary" type="submit">Add program <span>→</span></button></form><div class="admin-panel" style="margin-top:20px"><div class="panel-head"><h3>Published programs</h3></div><table class="data-table"><thead><tr><th>PROGRAM</th><th>CATEGORY</th><th>DURATION</th><th></th></tr></thead><tbody>${state.programs.map(p => `<tr><td><b>${p.title}</b></td><td>${p.label}</td><td>${p.duration}</td><td><button data-delete-program="${p.id}">Remove</button></td></tr>`).join('')}</tbody></table></div></section>
  <section class="admin-section" data-admin-section="certificates"><div class="admin-top"><div><p class="eyebrow">CERTIFICATE MANAGEMENT</p><h2>Issue certificates</h2></div></div><form class="admin-panel admin-form" id="issueCertificate" style="margin-top:24px"><h3>Create a verifiable record</h3><div class="form-grid"><div class="field"><label>RECIPIENT NAME</label><input required name="name" placeholder="Student name" /></div><div class="field"><label>PROGRAM</label><select name="program">${state.programs.map(p => `<option>${p.title}</option>`).join('')}</select></div><div class="field full"><label>COMPLETION DATE</label><input required type="date" name="date" value="2026-09-19" /></div></div><button class="button button-primary" type="submit">Issue certificate <span>→</span></button><p class="form-message" id="certificateMessage"></p></form><div class="admin-panel" style="margin-top:20px"><div class="panel-head"><h3>Certificate register</h3></div><table class="data-table"><thead><tr><th>ID</th><th>RECIPIENT</th><th>PROGRAM</th><th>STATUS</th></tr></thead><tbody>${certificateTable()}</tbody></table></div></section>
  <section class="admin-section" data-admin-section="settings"><div class="admin-top"><div><p class="eyebrow">PLATFORM SETUP</p><h2>Site settings</h2></div></div><div class="admin-panel settings-info" style="margin-top:24px"><b>This is a functional front-end demo.</b><br />It stores changes in this browser using local storage. For your public site, connect it to a secure database, authenticated admin users, email delivery, payments (if applicable), and your own domain. Your developer can use this as the complete visual and functional brief.</div></section></div></div>`;
}

function applicantTable(applicants, includeActions = false) {
  return `<table class="data-table"><thead><tr><th>APPLICANT</th><th>PROGRAM</th><th>STATUS</th>${includeActions ? '<th>ACTION</th>' : ''}</tr></thead><tbody>${applicants.map((a, index) => `<tr><td><b>${a.name}</b><br /><small>${a.email}</small></td><td>${a.program}</td><td><span class="pill ${a.status === 'New' ? 'pending' : ''}">${a.status}</span></td>${includeActions ? `<td><button data-approve-applicant="${index}">Mark reviewed</button></td>` : ''}</tr>`).join('')}</tbody></table>`;
}
function certificateTable() { return state.certificates.map(c => `<tr><td><b>${c.id}</b></td><td>${c.name}</td><td>${c.program}</td><td><span class="pill">Verified</span></td></tr>`).join(''); }
function formatDate(input) { return new Intl.DateTimeFormat('en-IN', { day:'numeric', month:'long', year:'numeric' }).format(new Date(`${input}T12:00:00`)); }

function openAdmin() {
  const dialog = document.querySelector('#adminDialog');
  const loggedIn = sessionStorage.getItem('devconnect-admin') === 'true';
  document.querySelector('#adminContent').innerHTML = loggedIn ? adminMarkup() : `<div class="modal-inner admin-login"><p class="eyebrow">RESTRICTED AREA</p><h2>Admin sign in</h2><p>Use the demo account to test managing applicants, programs, and certificates.</p><p class="demo-credentials">Email: admin@devconnect.test<br />Password: demo2026</p><form id="loginForm"><div class="field"><label for="loginEmail">EMAIL</label><input id="loginEmail" required type="email" /></div><div class="field" style="margin-top:13px"><label for="loginPassword">PASSWORD</label><input id="loginPassword" required type="password" /></div><button class="button button-primary" type="submit">Sign in <span>→</span></button><p class="form-message" id="loginMessage"></p></form></div>`;
  dialog.showModal();
  if (!loggedIn) document.querySelector('#loginForm').addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    if (email === 'admin@devconnect.test' && password === 'demo2026') { sessionStorage.setItem('devconnect-admin', 'true'); openAdmin(); }
    else document.querySelector('#loginMessage').textContent = 'That email or password is not correct.';
  }); else bindAdmin();
}

function bindAdmin() {
  document.querySelectorAll('[data-admin-tab]').forEach(button => button.addEventListener('click', () => {
    const tab = button.dataset.adminTab;
    document.querySelectorAll('[data-admin-tab]').forEach(item => item.classList.toggle('active', item.dataset.adminTab === tab));
    document.querySelectorAll('[data-admin-section]').forEach(section => section.classList.toggle('active', section.dataset.adminSection === tab));
  }));
  document.querySelector('#signOut')?.addEventListener('click', () => { sessionStorage.removeItem('devconnect-admin'); openAdmin(); });
  document.querySelector('#addProgram')?.addEventListener('submit', event => {
    event.preventDefault(); const f = Object.fromEntries(new FormData(event.target));
    state.programs.push({ id: `${f.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`, title:f.title, category:f.category, label: f.category === 'data' ? 'DATA & AI' : f.category.toUpperCase(), duration:f.duration.toUpperCase(), symbol:f.symbol || '✦', color:'#c9e74a', description:f.description, tags:['NEW', 'PROJECT-BASED'] }); persist(); openAdmin();
  });
  document.querySelector('#issueCertificate')?.addEventListener('submit', event => {
    event.preventDefault(); const f = Object.fromEntries(new FormData(event.target)); const id = `SK-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random()*9000))}`;
    state.certificates.unshift({ id, name:f.name, program:f.program, date:formatDate(f.date), status:'Verified' }); persist(); document.querySelector('#certificateMessage').textContent = `Issued ${id}. It is now visible through public verification.`; event.target.reset();
  });
  document.querySelectorAll('[data-delete-program]').forEach(button => button.addEventListener('click', () => { state.programs = state.programs.filter(p => p.id !== button.dataset.deleteProgram); persist(); openAdmin(); renderPrograms(); }));
  document.querySelectorAll('[data-approve-applicant]').forEach(button => button.addEventListener('click', () => { const i = Number(button.dataset.approveApplicant); state.applicants[i].status = 'Reviewed'; persist(); openAdmin(); }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function currentStudent() {
  const email = sessionStorage.getItem('devconnect-student');
  return state.students.find(student => student.email === email);
}

function completedTasks(student) {
  return (student.tasks || []).filter(task => task.done).length;
}

function studentTasksMarkup(student, limit = Infinity) {
  const tasks = (student.tasks || []).slice(0, limit);
  if (!tasks.length) return '<div class="student-empty"><h3>No active tasks yet</h3><p>Once the admin places you in a program, your project roadmap will appear here.</p><button class="button button-primary" type="button" data-student-action="programs">Explore programs <span>→</span></button></div>';
  return `<div class="task-list">${tasks.map((task, index) => `<article class="task-item"><div><button type="button" class="task-check ${task.done ? 'done' : ''}" aria-label="Mark ${escapeHtml(task.title)} ${task.done ? 'incomplete' : 'complete'}" data-toggle-task="${index}">✓</button><p><b>${escapeHtml(task.title)}</b><small>${escapeHtml(task.type)}</small></p></div><span class="task-state ${task.done ? 'done' : ''}">${task.done ? 'Complete' : 'To do'}</span></article>`).join('')}</div>`;
}

function studentDashboardMarkup(student) {
  const enrolled = Boolean(student.program);
  const done = completedTasks(student);
  const total = (student.tasks || []).length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const issuedCertificate = state.certificates.find(certificate => certificate.name.toLowerCase() === student.name.toLowerCase() && certificate.program === student.program);
  const initial = escapeHtml(student.name.charAt(0).toUpperCase());
  const safeName = escapeHtml(student.name);
  const safeProgram = escapeHtml(student.program || 'Not assigned');
  const overview = enrolled ? `
    <div class="student-overview"><article class="student-course"><p class="eyebrow">ACTIVE INTERNSHIP · ${escapeHtml(student.cohort || 'Current cohort').toUpperCase()}</p><h3>${safeProgram}</h3><p>Keep moving through the project roadmap. Your next milestone is ready when you are.</p><div class="course-progress"><b>${progress}%</b><span>${done} of ${total} project tasks completed</span></div></article><div class="student-summary"><article class="summary-card"><span>NEXT MILESTONE</span><b>${done === total ? 'Program complete' : 'Submit your next task'}</b><small>${done === total ? 'Your certificate can now be issued.' : 'Project review is due this week.'}</small></article><article class="summary-card"><span>CERTIFICATE</span><b>${issuedCertificate ? 'Available' : 'In progress'}</b><small>${issuedCertificate ? `ID: ${issuedCertificate.id}` : 'Unlocks after all tasks are approved.'}</small></article></div></div><section class="student-panel"><h3>Continue where you left off</h3>${studentTasksMarkup(student, 3)}</section>` : `<div class="student-empty"><p class="eyebrow">ACCOUNT READY</p><h3>Choose an internship to begin.</h3><p>Your Devconnect account is ready. Apply to a program and your project roadmap, internship status, and certificate progress will appear here.</p><button class="button button-primary" type="button" data-student-action="programs">Browse internships <span>→</span></button></div>`;
  const certificateContent = !enrolled ? '<div class="student-empty"><h3>No certificate yet</h3><p>Apply to a program and finish its projects to unlock a verified completion certificate.</p></div>' : issuedCertificate ? `<article class="cert-card"><span>VERIFIED COMPLETION CERTIFICATE</span><h3>${safeProgram}</h3><p>Issued to ${safeName} · Certificate ID: ${issuedCertificate.id}<br />This certificate can be checked from the public verification page.</p></article>` : `<div class="student-empty"><h3>Your certificate is in progress</h3><p>Complete and submit all ${total} project tasks. The program team can issue a public verification ID after review.</p></div>`;
  return `<div class="student-shell"><aside class="student-sidebar"><a href="#home" class="brand"><span class="brand-mark">D</span><span>devconnect</span></a><div class="student-profile"><span class="profile-initial">${initial}</span><div><b>${safeName}</b><span>Student account</span></div></div><nav class="student-nav"><button class="active" data-student-tab="overview">Overview</button><button data-student-tab="tasks">My tasks</button><button data-student-tab="certificates">Certificates</button><button data-student-tab="account">Account</button></nav><p class="student-side-footer">BUILD · SUBMIT · GROW<br />Your progress is saved in this demo browser.</p></aside><main class="student-main"><div class="student-section active" data-student-section="overview"><div class="student-top"><div><p class="eyebrow">STUDENT DASHBOARD</p><h2>Welcome back, ${escapeHtml(student.name.split(' ')[0])}.</h2></div><button class="button button-outline" type="button" data-student-action="programs">Explore programs <span>↗</span></button></div>${overview}</div><div class="student-section" data-student-section="tasks"><div class="student-top"><div><p class="eyebrow">YOUR PROJECT ROADMAP</p><h2>Tasks & submissions</h2></div></div>${enrolled ? `<section class="student-panel">${studentTasksMarkup(student)}</section>` : overview}</div><div class="student-section" data-student-section="certificates"><div class="student-top"><div><p class="eyebrow">YOUR ACHIEVEMENTS</p><h2>Certificates</h2></div></div>${certificateContent}</div><div class="student-section" data-student-section="account"><div class="student-top"><div><p class="eyebrow">PROFILE SETTINGS</p><h2>Your account</h2></div></div><section class="account-card"><h3>Account details</h3><div class="account-data"><div><span>Name</span><b>${safeName}</b></div><div><span>Email</span><b>${escapeHtml(student.email)}</b></div><div><span>Internship status</span><b>${escapeHtml(student.applicationStatus || 'Account created')}</b></div><div><span>Current program</span><b>${safeProgram}</b></div></div><button type="button" class="signout-student" id="studentSignOut">Sign out of this demo account</button></section></div></main></div>`;
}

function studentAuthMarkup(mode) {
  const signup = mode === 'signup';
  return `<div class="auth-shell"><aside class="auth-aside"><div><a href="#home" class="brand"><span class="brand-mark">D</span><span>devconnect</span></a><h2>Make your first work <em>count.</em></h2><p>Keep your applications, project milestones, and verified achievements in one place.</p><div class="auth-list"><div><span>✓</span> A personal internship dashboard</div><div><span>✓</span> Project tasks and milestones</div><div><span>✓</span> Publicly verifiable certificates</div></div></div><small>DEVCONNECT STUDENT PORTAL</small></aside><div class="auth-main"><p class="eyebrow">STUDENT PORTAL</p><h2>${signup ? 'Create your account' : 'Welcome back'}</h2><p>${signup ? 'Create an account to follow applications and see your internship work in one place.' : 'Sign in to view your program roadmap, tasks, and certificate status.'}</p>${!signup ? '<p class="demo-credentials">Demo student: student@devconnect.test<br />Password: demo2026</p>' : ''}<form id="studentAuthForm">${signup ? `<div class="field"><label for="studentName">FULL NAME</label><input id="studentName" name="name" required placeholder="Your full name" /></div>` : ''}<div class="field"${signup ? ' style="margin-top:13px"' : ''}><label for="studentEmail">EMAIL ADDRESS</label><input id="studentEmail" name="email" type="email" required placeholder="you@email.com" /></div><div class="field" style="margin-top:13px"><label for="studentPassword">PASSWORD</label><input id="studentPassword" name="password" type="password" required minlength="6" placeholder="At least 6 characters" /></div>${signup ? `<div class="field" style="margin-top:13px"><label for="studentConfirmPassword">CONFIRM PASSWORD</label><input id="studentConfirmPassword" name="confirmPassword" type="password" required minlength="6" placeholder="Repeat your password" /></div>` : ''}<button class="button button-primary" type="submit">${signup ? 'Create account' : 'Log in'} <span>→</span></button><p class="form-message" id="studentAuthMessage"></p></form><p class="auth-switch">${signup ? 'Already have an account?' : 'New to Devconnect?'} <button type="button" data-switch-auth="${signup ? 'login' : 'signup'}">${signup ? 'Log in' : 'Create an account'}</button></p></div></div>`;
}

function openStudentAuth(mode = 'login') {
  const dialog = document.querySelector('#studentDialog');
  const signedInStudent = currentStudent();
  if (signedInStudent) { openStudentDashboard(); return; }
  document.querySelector('#studentContent').innerHTML = studentAuthMarkup(mode);
  if (!dialog.open) dialog.showModal();
  document.querySelector('[data-switch-auth]').addEventListener('click', () => openStudentAuth(document.querySelector('[data-switch-auth]').dataset.switchAuth));
  document.querySelector('#studentAuthForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.target));
    const message = document.querySelector('#studentAuthMessage');
    const email = form.email.trim().toLowerCase();
    if (mode === 'signup') {
      if (form.password !== form.confirmPassword) { message.textContent = 'The two passwords need to match.'; return; }
      if (state.students.some(student => student.email.toLowerCase() === email)) { message.textContent = 'An account already exists for this email. Please log in instead.'; return; }
      state.students.push({ id: `student-${Date.now()}`, name: form.name.trim(), email, password: form.password, program: '', cohort: '', applicationStatus: 'Account created', tasks: [] });
      persist();
      sessionStorage.setItem('devconnect-student', email);
      openStudentDashboard();
    } else {
      const student = state.students.find(candidate => candidate.email.toLowerCase() === email && candidate.password === form.password);
      if (!student) { message.textContent = 'That email or password is not correct.'; return; }
      sessionStorage.setItem('devconnect-student', student.email);
      openStudentDashboard();
    }
  });
}

function openStudentDashboard() {
  const dialog = document.querySelector('#studentDialog');
  const student = currentStudent();
  if (!student) { openStudentAuth(); return; }
  document.querySelector('#studentContent').innerHTML = studentDashboardMarkup(student);
  if (!dialog.open) dialog.showModal();
  document.querySelectorAll('[data-student-tab]').forEach(button => button.addEventListener('click', () => {
    const tab = button.dataset.studentTab;
    document.querySelectorAll('[data-student-tab]').forEach(item => item.classList.toggle('active', item.dataset.studentTab === tab));
    document.querySelectorAll('[data-student-section]').forEach(section => section.classList.toggle('active', section.dataset.studentSection === tab));
  }));
  document.querySelectorAll('[data-toggle-task]').forEach(button => button.addEventListener('click', () => {
    const taskIndex = Number(button.dataset.toggleTask);
    student.tasks[taskIndex].done = !student.tasks[taskIndex].done;
    if (student.tasks.length && student.tasks.every(task => task.done) && !state.certificates.some(certificate => certificate.name.toLowerCase() === student.name.toLowerCase() && certificate.program === student.program)) {
      state.certificates.unshift({ id: `DC-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`, name: student.name, program: student.program, date: formatDate(new Date().toISOString().slice(0, 10)), status: 'Verified' });
    }
    persist();
    openStudentDashboard();
  }));
  document.querySelectorAll('[data-student-action="programs"]').forEach(button => button.addEventListener('click', () => { dialog.close(); document.querySelector('#programs').scrollIntoView({ behavior: 'smooth' }); }));
  document.querySelector('#studentSignOut')?.addEventListener('click', () => { sessionStorage.removeItem('devconnect-student'); openStudentAuth('login'); });
}

document.querySelector('#year').textContent = new Date().getFullYear();
renderPrograms();
document.querySelectorAll('.filter-row button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter-row button').forEach(item => item.classList.remove('active')); button.classList.add('active'); renderPrograms(button.dataset.filter); }));
document.querySelector('#verifyForm').addEventListener('submit', event => { event.preventDefault(); verifyCertificate(document.querySelector('#certificateId').value); });
document.querySelector('#demoVerify').addEventListener('click', () => { document.querySelector('#certificateId').value = demoCertificate.id; verifyCertificate(demoCertificate.id); });
document.querySelectorAll('.close-dialog').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }));
document.querySelectorAll('a[href="#admin"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); openAdmin(); }));
document.querySelectorAll('[data-student-auth]').forEach(button => button.addEventListener('click', () => openStudentAuth(button.dataset.studentAuth)));
document.querySelectorAll('a[href="#dashboard"]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); currentStudent() ? openStudentDashboard() : openStudentAuth('login'); }));
document.querySelector('#menuButton').addEventListener('click', () => { const header = document.querySelector('.site-header'); const open = header.classList.toggle('menu-open'); document.querySelector('#menuButton').setAttribute('aria-expanded', open); });
document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => document.querySelector('.site-header').classList.remove('menu-open')));
