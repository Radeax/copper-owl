/// <reference types="vite/client" />

// Ambient fallback for the optional private rules package. When @copper-owl/rules
// is installed the real package types take precedence; this declaration lets the
// engine compile cleanly in public clones where the package is absent.
declare module '@copper-owl/rules' {}
