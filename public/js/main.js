document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const flockInput = document.getElementById('flockInput');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('authForm');
    const formMessage = document.getElementById('formMessage');

    let currentMode = 'join';

    // ---- Tab switching ----
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.tab;
            updateFormForMode(currentMode);
            clearMessages();
        });
    });

    function updateFormForMode(mode) {
        if (mode === 'create') {
            flockInput.placeholder = 'Flock Name';
            flockInput.name = 'flockName';
            confirmPasswordField.hidden = false;
            confirmPasswordInput.required = true;
            submitBtn.textContent = 'Create Flock';
        } else {
            flockInput.placeholder = 'Flock Code';
            flockInput.name = 'flockCode';
            confirmPasswordField.hidden = true;
            confirmPasswordInput.required = false;
            confirmPasswordInput.value = '';
            submitBtn.textContent = 'Join Flock';
        }
    }

    // ---- Validation helpers ----
    function setFieldError(input, message) {
        input.classList.toggle('invalid', Boolean(message));
        const errorEl = input.closest('.form-group').querySelector('.field-error');
        if (errorEl) errorEl.textContent = message || '';
    }

    function clearMessages() {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        form.querySelectorAll('input').forEach(input => setFieldError(input, ''));
    }

    // Clear a field's error as soon as the user starts fixing it
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => setFieldError(input, ''));
    });

    function validate() {
        let isValid = true;

        const fullName = form.fullName;
        const skillRackId = form.skillRackId;
        const password = document.getElementById('passwordInput');

        if (!fullName.value.trim()) {
            setFieldError(fullName, 'Full name is required.');
            isValid = false;
        }

        if (!skillRackId.value.trim()) {
            setFieldError(skillRackId, 'SkillRack ID is required.');
            isValid = false;
        }

        if (!flockInput.value.trim()) {
            setFieldError(flockInput, currentMode === 'create' ? 'Flock name is required.' : 'Flock code is required.');
            isValid = false;
        }

        if (!password.value) {
            setFieldError(password, 'Password is required.');
            isValid = false;
        } else if (password.value.length < 6) {
            setFieldError(password, 'Password must be at least 6 characters.');
            isValid = false;
        }

        if (currentMode === 'create') {
            if (!confirmPasswordInput.value) {
                setFieldError(confirmPasswordInput, 'Please confirm your password.');
                isValid = false;
            } else if (confirmPasswordInput.value !== password.value) {
                setFieldError(confirmPasswordInput, 'Passwords do not match.');
                isValid = false;
            }
        }

        return isValid;
    }

    // ---- Form submission ----
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMessages();

        if (!validate()) {
            formMessage.textContent = 'Please fix the errors above.';
            formMessage.classList.add('error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = currentMode === 'create' ? 'Creating flock...' : 'Joining flock...';

        // Simulate an async request (replace with a real API call when the backend is ready)
        setTimeout(() => {
            formMessage.textContent = currentMode === 'create'
                ? 'Flock created! You are ready to fly.'
                : 'Welcome back! You have joined the flock.';
            formMessage.classList.add('success');

            submitBtn.disabled = false;
            submitBtn.textContent = currentMode === 'create' ? 'Create Flock' : 'Join Flock';

            form.reset();
        }, 900);
    });

    // Initialize in "join" mode
    updateFormForMode(currentMode);
});