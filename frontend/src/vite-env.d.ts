/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_WS_URL: string
    readonly VITE_ENABLE_ANALYTICS: string
    readonly VITE_ENABLE_NOTIFICATIONS: string
    readonly VITE_ENABLE_PWA: string
    readonly VITE_ENABLE_CHAT: string
    readonly VITE_ENABLE_PAYMENTS: string
    readonly VITE_DEBUG: string
    readonly VITE_MOCK_API: string
    readonly VITE_DEV_TOOLS: string
    readonly VITE_GOOGLE_ANALYTICS_ID: string
    readonly VITE_SENTRY_DSN: string
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string
    readonly VITE_GOOGLE_MAPS_API_KEY: string
    readonly VITE_FACEBOOK_APP_ID: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_ENABLE_CSP: string
    readonly VITE_ENABLE_HTTPS_ONLY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
