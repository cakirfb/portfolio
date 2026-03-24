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
            if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
                el.textContent = targetLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-tr');
            }
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

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconMoon = document.querySelector('.icon-moon');
    const iconSun = document.querySelector('.icon-sun');

    function updateTheme(theme) {
        if (theme === 'dark') {
            htmlElem.setAttribute('data-theme', 'dark');
            if (iconMoon) iconMoon.style.display = 'none';
            if (iconSun) iconSun.style.display = 'block';
        } else {
            htmlElem.removeAttribute('data-theme');
            if (iconMoon) iconMoon.style.display = 'block';
            if (iconSun) iconSun.style.display = 'none';
        }
        try { localStorage.setItem('theme', theme); } catch(e) {}
    }

    let savedTheme = 'light';
    try {
        savedTheme = localStorage.getItem('theme') || 'light';
    } catch(e) {}
    updateTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlElem.getAttribute('data-theme') === 'dark';
            updateTheme(isDark ? 'light' : 'dark');
        });
    }

    // Nav Active Link Highlight
    const currentPath = window.location.pathname;
    const isBlogPage = currentPath.includes('blog.html');
    
    if (!isBlogPage) {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navItems.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(sec => observer.observe(sec));
    }
});
