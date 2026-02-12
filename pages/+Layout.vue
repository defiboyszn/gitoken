<!-- https://vike.dev/Layout -->

<template>
  <div class="layout">
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="footer-logo">$gitoken</span>
          <span class="footer-tagline">GitHub worth checker</span>
        </div>
        <nav class="footer-nav">
          <a
            href="https://clanker.world/clanker/0x082B20C7748cB46e205F4D007c833dB939b15b07"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
            >Trade on Clanker</a
          >
          <a
            href="https://github.com/defiboyszn"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
            >GitHub</a
          >
        </nav>
        <p class="footer-disclaimer">
          Not financial advice. For entertainment only.
        </p>
        <p class="footer-legal">
          $gitoken is not affiliated with GitHub. GitHub is a trademark of
          GitHub, Inc.
        </p>
        <p class="footer-credit">
          Made with <span class="footer-heart">❤️</span> by
          <a
            href="https://twitter.com/defiboyszn"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
            >@defiboyszn</a
          >
        </p>
        <p class="footer-copy">© {{ new Date().getFullYear() }} $gitoken</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import "../assets/theme.css";
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: var(--gitoken-bg);
  color: var(--gitoken-text);
}
* {
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
}
.content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
  flex-grow: 1;
}
/* Page Transition Animation */
#page-content {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
body.page-transition #page-content {
  opacity: 0;
}

/* —— Footer —— */
.footer {
  margin-top: auto;
  padding: 2rem 1.5rem 1.5rem;
  border-top: 1px solid var(--gitoken-border);
  background: var(--gitoken-surface);
}
.footer-inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
}
.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}
.footer-logo {
  font-family: "Syne", "Space Mono", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  background: var(--gitoken-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.footer-tagline {
  font-size: 0.8rem;
  color: var(--gitoken-text-dim);
}
.footer-nav {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}
.footer-link {
  font-size: 0.9rem;
  color: var(--gitoken-text-muted);
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--gitoken-primary-muted);
}
.footer-disclaimer {
  font-size: 0.75rem;
  color: var(--gitoken-text-dim);
  margin: 0 0 0.5rem;
  opacity: 0.9;
}
.footer-legal {
  font-size: 0.75rem;
  color: var(--gitoken-text-dim);
  margin: 0 0 0.75rem;
  opacity: 0.85;
  line-height: 1.4;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
.footer-credit {
  font-size: 0.85rem;
  color: var(--gitoken-text-muted);
  margin: 0 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.footer-credit .footer-link {
  font-weight: 600;
  color: var(--gitoken-primary-muted);
}
.footer-credit .footer-link:hover {
  color: var(--gitoken-primary-bright);
}
.footer-heart {
  display: inline-block;
  font-style: normal;
  animation: footer-heart-pulse 1.5s ease-in-out infinite;
}
@keyframes footer-heart-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.9; }
}
.footer-copy {
  font-size: 0.75rem;
  color: var(--gitoken-text-dim);
  margin: 0;
  opacity: 0.7;
}
</style>
