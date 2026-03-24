document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    // Mobile Menu Toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // Language Toggle
    const htmlElem = document.documentElement;
    const langToggleBtn = document.getElementById('lang-toggle');
    const translatableElements = document.querySelectorAll('[data-en][data-tr]');

    function updateLanguage(targetLang) {
        htmlElem.setAttribute('data-lang', targetLang);
        htmlElem.setAttribute('lang', targetLang);
        
        translatableElements.forEach(el => {
            el.textContent = targetLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-tr');
        });

        if (langToggleBtn) {
            langToggleBtn.textContent = targetLang === 'en' ? 'TR' : 'EN';
        }
        
        try { localStorage.setItem('lang', targetLang); } catch(e) {}
    }

    // Initialize Language
    let currentLang = 'en';
    try {
        currentLang = localStorage.getItem('lang') || 'en';
    } catch(e) {}
    updateLanguage(currentLang);

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = htmlElem.getAttribute('data-lang') === 'en' ? 'tr' : 'en';
            updateLanguage(nextLang);
        });
    }
});
