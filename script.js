document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Active State on Scroll (Existing)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Dynamic Learning Management ---
    const learningList = document.getElementById('learning-list');
    const openAddLearningBtn = document.getElementById('open-add-learning-btn');
    const addLearningModal = document.getElementById('add-learning-modal');
    const closeLearningModal = document.querySelector('.close-learning-modal');
    const saveLearningBtn = document.getElementById('save-learning');
    const learningModalTitle = document.getElementById('learning-modal-title');
    const editLearningIndex = document.getElementById('edit-learning-index');

    let isAdmin = false; // Tracks if admin is logged in

    let learnings = JSON.parse(localStorage.getItem('learnings')) || [
        { date: 'Jan 12, 2026', title: 'Professional Self-Introduction', desc: 'Learned how to introduce oneself professionally in various settings.' },
        { date: 'Jan 19, 2026', title: "How to answer someone's question", desc: 'Studied techniques for providing clear and concise answers.' },
        { date: 'Feb 02, 2026', title: 'How to present ourself in front of others', desc: 'Confidence building and body language tips for presentations.' },
        { date: 'Feb 09, 2026', title: 'What is Carbon footprint and what are its harmful effects', desc: 'Explored environmental impact and ways to reduce carbon footprint.' },
        { date: 'Feb 16, 2026', title: 'Advanced Web Development Concepts', desc: 'Deep dive into modern web architecture and performance optimization.' }
    ];

    function renderLearnings() {
        if (!learningList) return;
        learningList.innerHTML = '';
        learnings.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('learning-card');

            let adminButtons = '';
            if (isAdmin) {
                adminButtons = `
                    <div class="card-admin-actions">
                        <button class="btn-icon-small edit-learning" data-index="${index}">Edit</button>
                        <button class="btn-icon-small delete-learning" data-index="${index}">Delete</button>
                    </div>
                `;
            }

            card.innerHTML = `
                ${adminButtons}
                <span class="date">${item.date}</span>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            `;
            learningList.appendChild(card);
        });

        // Add Event Listeners to dynamic buttons
        document.querySelectorAll('.edit-learning').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                openEditLearning(index);
            });
        });

        document.querySelectorAll('.delete-learning').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this learning entry?')) {
                    learnings.splice(index, 1);
                    saveAndRender();
                }
            });
        });
    }

    function saveAndRender() {
        localStorage.setItem('learnings', JSON.stringify(learnings));
        renderLearnings();
    }

    function openEditLearning(index) {
        const item = learnings[index];
        learningModalTitle.textContent = 'Edit Learning';
        editLearningIndex.value = index;
        document.getElementById('new-learning-date').value = item.date;
        document.getElementById('new-learning-title').value = item.title;
        document.getElementById('new-learning-desc').value = item.desc;
        addLearningModal.classList.remove('hidden');
    }

    renderLearnings();

    // Modal Handlers for Learnings
    openAddLearningBtn.addEventListener('click', () => {
        learningModalTitle.textContent = 'Add New Learning';
        editLearningIndex.value = '';
        document.getElementById('new-learning-date').value = '';
        document.getElementById('new-learning-title').value = '';
        document.getElementById('new-learning-desc').value = '';
        addLearningModal.classList.remove('hidden');
    });

    closeLearningModal.addEventListener('click', () => {
        addLearningModal.classList.add('hidden');
    });

    saveLearningBtn.addEventListener('click', () => {
        const date = document.getElementById('new-learning-date').value;
        const title = document.getElementById('new-learning-title').value;
        const desc = document.getElementById('new-learning-desc').value;
        const index = editLearningIndex.value;

        if (date && title && desc) {
            const learningData = { date, title, desc };
            if (index !== '') {
                learnings[index] = learningData;
            } else {
                learnings.unshift(learningData); // Add to top
            }
            saveAndRender();
            addLearningModal.classList.add('hidden');
        } else {
            alert('Please fill in all fields.');
        }
    });

    // --- Hero Video Management (Persistent) ---
    const introVideo = document.getElementById('intro-video');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const heroVideoInput = document.getElementById('hero-video-input');
    const uploadVideoBtn = document.getElementById('upload-video-btn');
    const videoError = document.getElementById('video-error');

    // Load saved video on startup
    const savedVideo = localStorage.getItem('heroVideo');
    if (savedVideo && introVideo) {
        introVideo.src = `videos/${savedVideo}`;
        introVideo.classList.remove('hidden');
        videoPlaceholder.classList.add('hidden');
        introVideo.load();
    }

    if (introVideo) {
        introVideo.addEventListener('loadeddata', () => {
            introVideo.classList.remove('hidden');
            videoPlaceholder.classList.add('hidden');
        });

        introVideo.addEventListener('error', () => {
            // Only hide and show placeholder if no manual blob is active
            if (!introVideo.src.startsWith('blob:')) {
                introVideo.classList.add('hidden');
                videoPlaceholder.classList.remove('hidden');
                console.log("Hero video not found at the expected path.");
            }
        });
    }

    uploadVideoBtn.addEventListener('click', () => {
        heroVideoInput.click();
    });

    heroVideoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                videoError.textContent = "File too large. Please choose a video under 50MB.";
                videoError.classList.remove('hidden');
                return;
            }
            videoError.classList.add('hidden');

            // Save filename for GitHub persistence
            localStorage.setItem('heroVideo', file.name);

            const fileUrl = URL.createObjectURL(file);
            introVideo.src = fileUrl;
            introVideo.classList.remove('hidden');
            videoPlaceholder.classList.add('hidden');
            introVideo.load();
            alert(`Video set to ${file.name}. Remember to push this file to your 'videos' folder on GitHub!`);
        }
    });


    // 2. Admin Login Logic (New)
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    const loginSubmit = document.getElementById('login-submit');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const addModalBtn = document.getElementById('open-add-modal-btn');

    // Show Login Modal
    adminLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    // Hide Modal on Close
    closeModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        loginError.textContent = '';
        passwordInput.value = '';
    });

    // Login Submission
    loginSubmit.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === 'admin123') { // Simple client-side check
            isAdmin = true;
            loginModal.classList.add('hidden');
            addModalBtn.classList.remove('hidden'); // Show the "Add Assignment" button
            openAddLearningBtn.classList.remove('hidden'); // Show the "Add Learning" button
            uploadVideoBtn.classList.remove('hidden'); // Show the "Upload Video" button
            adminLoginBtn.textContent = 'Admin (Logged In)';
            adminLoginBtn.disabled = true;
            renderLearnings(); // Refresh to show edit/delete buttons
            alert('Welcome back, Admin!');
        } else {
            loginError.textContent = 'Incorrect password. Try "admin123"';
        }
    });


    // --- Add Assignment Logic (New & Persistent) ---
    const addAssignmentModal = document.getElementById('add-assignment-modal');
    const closeAddModal = document.querySelector('.close-add-modal');
    const saveAssignmentBtn = document.getElementById('save-assignment');
    const assignmentsList = document.getElementById('assignments-list');
    const fileInput = document.getElementById('new-assign-file');
    const fileChosenName = document.getElementById('file-chosen-name');

    let assignments = JSON.parse(localStorage.getItem('assignments')) || [
        {
            title: 'Assignment 1: Self-Introduction',
            desc: 'Creating complex grid layouts using CSS Grid and Flexbox.',
            fileName: '',
            fileUrl: ''
        }
    ];

    function renderAssignments() {
        if (!assignmentsList) return;
        assignmentsList.innerHTML = '';
        assignments.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('assignment-card');

            let adminButtons = '';
            if (isAdmin) {
                adminButtons = `
                    <div class="card-admin-actions">
                        <button class="btn-icon-small delete-assignment" data-index="${index}">Delete</button>
                    </div>
                `;
            }

            let attachmentHtml = '';
            // If we have a fileUrl (blob or path), show the link
            if (item.fileUrl || item.fileName) {
                const link = item.fileUrl || `documents/${item.fileName}`;
                const displayName = item.fileName || 'View Attachment';
                attachmentHtml = `
                    <a href="${link}" target="_blank" class="attachment-link">
                        ${displayName}
                    </a>
                `;
            }

            card.innerHTML = `
                ${adminButtons}
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
                ${attachmentHtml}
            `;
            assignmentsList.appendChild(card);
        });

        // Add Delete Handlers
        document.querySelectorAll('.delete-assignment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (confirm('Are you sure you want to delete this assignment?')) {
                    assignments.splice(index, 1);
                    saveAndRenderAssignments();
                }
            });
        });
    }

    function saveAndRenderAssignments() {
        localStorage.setItem('assignments', JSON.stringify(assignments));
        renderAssignments();
    }

    // Initial render
    renderAssignments();

    // Show Add Modal
    addModalBtn.addEventListener('click', () => {
        addAssignmentModal.classList.remove('hidden');
    });

    // Update File Chosen Name in Modal
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileChosenName.textContent = fileInput.files[0].name;
            const fileNameInput = document.getElementById('new-assign-filename');
            if (!fileNameInput.value) {
                fileNameInput.value = fileInput.files[0].name;
            }
        } else {
            fileChosenName.textContent = 'No file chosen';
        }
    });

    // Hide Add Modal
    closeAddModal.addEventListener('click', () => {
        addAssignmentModal.classList.add('hidden');
    });

    // Save New Assignment
    saveAssignmentBtn.addEventListener('click', () => {
        const title = document.getElementById('new-assign-title').value;
        const desc = document.getElementById('new-assign-desc').value;
        const file = fileInput.files[0];
        const customFileName = document.getElementById('new-assign-filename').value;

        if (title && desc) {
            const newAssignment = {
                title: title,
                desc: desc,
                fileName: customFileName || (file ? file.name : ''),
                fileUrl: file ? URL.createObjectURL(file) : ''
            };

            assignments.unshift(newAssignment);
            saveAndRenderAssignments();

            // Clean up
            addAssignmentModal.classList.add('hidden');
            document.getElementById('new-assign-title').value = '';
            document.getElementById('new-assign-desc').value = '';
            fileInput.value = '';
            fileChosenName.textContent = 'No file chosen';
            document.getElementById('new-assign-filename').value = '';
        } else {
            alert('Please fill in both title and description.');
        }
    });

    // Close Modals on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
        if (e.target === addAssignmentModal) {
            addAssignmentModal.classList.add('hidden');
        }
        if (e.target === addLearningModal) {
            addLearningModal.classList.add('hidden');
        }
    });
});

