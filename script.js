/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.getElementById('primary-navigation');
    const mobileViewport = window.matchMedia('(max-width: 768px)');

    if (menuToggle && navigation) {
        const setMenuOpen = (open, restoreFocus = false) => {
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
            navigation.classList.toggle('is-open', open);
            if (restoreFocus) menuToggle.focus();
        };

        menuToggle.addEventListener('click', () => {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });
        navigation.addEventListener('click', (event) => {
            if (event.target.closest('a')) setMenuOpen(false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false, true);
            }
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('header')) setMenuOpen(false);
        });
        document.addEventListener('focusin', (event) => {
            if (!event.target.closest('header')) setMenuOpen(false);
        });
        mobileViewport.addEventListener('change', () => {
            const focusInMenu = navigation.contains(document.activeElement);
            setMenuOpen(false, mobileViewport.matches && focusInMenu);
        });
        menuToggle.hidden = false;
    }

    // Theme toggling functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('threes-theme');
    // Výchozí vzhled je tmavý; světlý pouze po volbě návštěvníka.
    
    if (savedTheme !== 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateIcon(true);
    } else {
        updateIcon(false);
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('threes-theme', 'light');
            updateIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('threes-theme', 'dark');
            updateIcon(true);
        }
    });
    
    function updateIcon(isDark) {
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Scroll Header effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Reveal Animation on scroll using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Zvýraznění aktivní položky menu
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const targetHref = link.getAttribute('href');
        // Přeskočíme index.html v první vlně, řešíme jej zvlášť
        if (targetHref !== 'index.html' && currentUrl.includes(targetHref)) {
            link.classList.add('nav-active');
        }
    });

    // Ošetření pro indexové stránky (Homepage)
    if (currentUrl.endsWith('/') || currentUrl.endsWith('index.html') || !currentUrl.includes('.html')) {
        const homeLink = document.querySelector('.nav-links a[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('nav-active');
        }
    }
});

// WhatsApp na počítači / telefonu; pokud aplikace není dostupná, uživatel může použít e-mail.
document.querySelectorAll('.contact-whatsapp').forEach(a=>{a.title='Otevřít WhatsApp; pokud není dostupný, napište na podpora@threes.cz';});
