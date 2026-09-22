/* Cookie consent and deferred Google Analytics loading for ThreeS. */
(() => {
    'use strict';

    const CONSENT_KEY = 'threes-cookie-consent-v1';
    const ANALYTICS_ID = 'G-LF1TDYRYJ9';
    const ACCEPTED_FOR_MS = 365 * 24 * 60 * 60 * 1000;
    const DECLINED_FOR_MS = 180 * 24 * 60 * 60 * 1000;

    const readConsent = () => {
        try {
            const stored = JSON.parse(localStorage.getItem(CONSENT_KEY));
            if (!stored || !['accepted', 'declined'].includes(stored.choice)) {
                return null;
            }

            if (!stored.expiresAt || Date.now() >= stored.expiresAt) {
                localStorage.removeItem(CONSENT_KEY);
                return null;
            }

            return stored;
        } catch (error) {
            return null;
        }
    };

    const removeAnalyticsCookies = () => {
        const cookieNames = [
            '_ga',
            `_ga_${ANALYTICS_ID.replace(/^G-/, '')}`
        ];

        cookieNames.forEach((name) => {
            document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
        });
    };

    const disableAnalytics = () => {
        window[`ga-disable-${ANALYTICS_ID}`] = true;
        removeAnalyticsCookies();
    };

    const loadAnalytics = () => {
        if (window.__threeSAnalyticsLoaded) {
            return;
        }

        window[`ga-disable-${ANALYTICS_ID}`] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag() {
            window.dataLayer.push(arguments);
        };

        window.gtag('js', new Date());
        window.gtag('config', ANALYTICS_ID, {
            anonymize_ip: true,
            cookie_expires: 63072000,
            cookie_update: false
        });

        const analyticsScript = document.createElement('script');
        analyticsScript.async = true;
        analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
        analyticsScript.dataset.threesAnalytics = 'true';
        document.head.appendChild(analyticsScript);
        window.__threeSAnalyticsLoaded = true;
    };

    const saveConsent = (choice) => {
        const accepted = choice === 'accepted';
        const consent = {
            choice,
            version: 1,
            updatedAt: new Date().toISOString(),
            expiresAt: Date.now() + (accepted ? ACCEPTED_FOR_MS : DECLINED_FOR_MS)
        };

        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        } catch (error) {
            // The banner still works if storage is unavailable for this visit.
        }

        if (accepted) {
            loadAnalytics();
        } else {
            disableAnalytics();
        }
    };

    const removeBanner = () => {
        document.getElementById('cookie-consent-banner')?.remove();
    };

    const showBanner = () => {
        removeBanner();

        const banner = document.createElement('aside');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-labelledby', 'cookie-consent-title');
        banner.innerHTML = `
            <div class="cookie-banner__content">
                <h2 id="cookie-consent-title">Cookies a soukromí</h2>
                <p>Web používá technické úložiště pro zapamatování motivu a volitelné analytické cookies Google Analytics. Analytické cookies aktivujeme pouze po vašem souhlasu.</p>
                <a href="ochrana-soukromi.html">Více informací o cookies a soukromí</a>
            </div>
            <div class="cookie-banner__actions">
                <button type="button" class="btn btn-outline" data-cookie-choice="declined">Odmítnout</button>
                <button type="button" class="btn btn-primary" data-cookie-choice="accepted">Přijmout analytické cookies</button>
            </div>
        `;

        banner.addEventListener('click', (event) => {
            const choiceButton = event.target.closest('[data-cookie-choice]');
            if (!choiceButton) {
                return;
            }

            saveConsent(choiceButton.dataset.cookieChoice);
            removeBanner();
        });

        document.body.appendChild(banner);
    };

    const openCookieSettings = (event) => {
        event.preventDefault();
        showBanner();
        document.querySelector('#cookie-consent-banner [data-cookie-choice="declined"]')?.focus();
    };

    const initialize = () => {
        document.querySelectorAll('[data-cookie-settings]').forEach((link) => {
            link.addEventListener('click', openCookieSettings);
        });

        const consent = readConsent();
        if (consent?.choice === 'accepted') {
            loadAnalytics();
        } else if (!consent) {
            showBanner();
        } else {
            disableAnalytics();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
