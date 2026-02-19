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
            loginModal.classList.add('hidden');
            addModalBtn.classList.remove('hidden'); // Show the "Add Assignment" button
            adminLoginBtn.textContent = 'Admin (Logged In)';
            adminLoginBtn.disabled = true;
            alert('Welcome back, Admin!');
        } else {
            loginError.textContent = 'Incorrect password. Try "admin123"';
        }
    });

    // 3. Add Assignment Logic (New)
    const addAssignmentModal = document.getElementById('add-assignment-modal');
    const closeAddModal = document.querySelector('.close-add-modal');
    const saveAssignmentBtn = document.getElementById('save-assignment');
    const assignmentsList = document.getElementById('assignments-list');

    // Show Add Modal
    addModalBtn.addEventListener('click', () => {
        addAssignmentModal.classList.remove('hidden');
    });

    // Hide Add Modal
    closeAddModal.addEventListener('click', () => {
        addAssignmentModal.classList.add('hidden');
    });

    // Save New Assignment
    saveAssignmentBtn.addEventListener('click', () => {
        const title = document.getElementById('new-assign-title').value;
        const desc = document.getElementById('new-assign-desc').value;

        if (title && desc) {
            // Create new card element
            const newCard = document.createElement('div');
            newCard.classList.add('assignment-card');
            newCard.innerHTML = `
                <h3>${title}</h3>
                <p>${desc}</p>
            `;

            // Prepend to list (show newest first)
            assignmentsList.prepend(newCard);

            // Clean up
            addAssignmentModal.classList.add('hidden');
            document.getElementById('new-assign-title').value = '';
            document.getElementById('new-assign-desc').value = '';
        } else {
            alert('Please fill in both fields.');
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
    });
});
