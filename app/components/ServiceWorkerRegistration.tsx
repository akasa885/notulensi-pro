'use client';

import { useEffect } from 'react';

export function registerServiceWorker() {
    if (
        typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        process.env.NODE_ENV === 'production'
    ) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
}

export function ServiceWorkerRegister() {
    // Register service worker on client side
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
}
