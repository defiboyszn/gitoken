<template>
  <div class="checker" id="page-content">
    <!-- <div class="bg">
      <div class="bg-gradient" />
      <div class="bg-orb orb-1" />
      <div class="bg-orb orb-2" />
      <div class="bg-orb orb-3" />
      <div class="bg-noise" />
    </div> -->

    <header class="hero">
      <img :src="logoUrl" alt="$gitoken" class="hero-logo" />
      <h1 class="title">GitHub Worth</h1>
      <p class="title-sub">Checker</p>
      <p class="tagline">
        How much is your GitHub hustle <em>really</em> worth?
      </p>
    </header>

    <section class="input-section">
      <div class="input-wrap">
        <input
          v-model="username"
          type="text"
          class="input"
          placeholder="your username"
          @keydown.enter="check"
          style="padding-left: 30px"
        />
      </div>
      <button
        type="button"
        class="btn"
        :disabled="!username.trim() || loading"
        @click="check"
      >
        <span v-if="loading" class="btn-text">
          <span class="btn-dot" /> <span class="btn-dot" />
          <span class="btn-dot" />
        </span>
        <span v-else class="btn-text">Check my worth</span>
      </button>
    </section>

    <template v-if="error">
      <Transition name="result">
        <section class="result error">
          <span class="error-icon">!</span>
          <p>{{ error }}</p>
        </section>
      </Transition>
    </template>
    <template v-else-if="result">
      <Transition name="result">
        <section class="result card">
          <div class="card-glow" />
          <div class="worth-row">
            <span class="worth-label">Your GitHub is worth</span>
            <span class="worth-value">
              {{ formatWorth(result.worth) }}
              <em>$gitoken</em>
            </span>
          </div>
          <div class="breakdown">
            <div class="stat">
              <span class="stat-value"
                >{{ result.public_repos
                }}{{
                  result.private_repos != null ? `+${result.private_repos}` : ""
                }}</span
              >
              <span class="stat-label">Repos</span>
            </div>
            <div class="stat-divider" />
            <div class="stat">
              <span class="stat-value">{{ result.followers }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-divider" />
            <div class="stat">
              <span class="stat-value">{{ result.total_stars }}</span>
              <span class="stat-label">Stars</span>
            </div>
            <div class="stat-divider" />
            <div class="stat">
              <span class="stat-value"
                >{{ result.gists
                }}{{
                  result.private_gists != null && result.private_gists > 0
                    ? `+${result.private_gists}`
                    : ""
                }}</span
              >
              <span class="stat-label">Gists</span>
            </div>
          </div>
          <p class="hint">
            Repos, followers, stars, orgs, gists{{
              result.private_repos != null ? ", private repos" : ""
            }}
            &amp; account age.
          </p>
        </section>
      </Transition>
    </template>

    <p v-else class="hint-standalone">
      Drop your GitHub username above. We won’t judge.
    </p>
    <div class="token-stats-container">
      <section v-if="tokenStats" class="token-stats">
        <h2 class="token-stats-title">Token details</h2>
        <a
          :href="`https://clanker.world/clanker/${tokenStats.contract_address}`"
          target="_blank"
          rel="noopener noreferrer"
          class="token-stats-link"
        >
          <div class="token-card-header">
            <img :src="faviconUrl" alt="$gitoken token" class="token-avatar" />
            <div class="token-meta">
              <div class="token-name">Gitoken</div>
              <div class="token-symbol">$gitoken</div>
            </div>
          </div>

          <div class="token-card-stats">
            <span class="token-stat">
              <span class="token-stat-label">Price</span>
              <span class="token-stat-value">
                {{ tokenStats.priceFormatted }}
              </span>
            </span>
            <span class="token-stat">
              <span class="token-stat-label">MCap</span>
              <span class="token-stat-value">
                {{ tokenStats.mcapFormatted }}
              </span>
            </span>
            <span v-if="tokenStats.priceChange24h != null" class="token-stat">
              <span class="token-stat-label">24h</span>
              <span
                class="token-stat-value"
                :class="tokenStats.priceChange24h >= 0 ? 'up' : 'down'"
              >
                {{ tokenStats.priceChange24h >= 0 ? "+" : "" }}
                {{ tokenStats.priceChange24h.toFixed(1) }}%
              </span>
            </span>
          </div>
        </a>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useData } from "vike-vue/useData";
import logoUrl from "../../assets/logo.png";
import faviconUrl from "../../assets/favicon.png";

const data = useData();
const tokenStats = computed(() => data?.tokenStats ?? null);

const username = ref("");
const token = ref("");
const loading = ref(false);
const error = ref("");
const result = ref<{
  worth: number;
  public_repos: number;
  private_repos: number | null;
  followers: number;
  total_stars: number;
  orgs: number;
  gists: number;
  private_gists: number | null;
  years_on_github: number;
  veteran_bonus: number;
} | null>(null);

function formatWorth(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(Math.round(n));
}

const VETERAN_YEARS = 3;
const VETERAN_BONUS = 100;

function yearsSince(dateStr: string): number {
  const created = new Date(dateStr).getTime();
  return (Date.now() - created) / (365.25 * 24 * 60 * 60 * 1000);
}

async function check() {
  const u = username.value.trim();
  if (!u) return;

  loading.value = true;
  error.value = "";
  result.value = null;

  const authHeaders = token.value.trim()
    ? { Authorization: `Bearer ${token.value.trim()}` }
    : undefined;

  try {
    const [userRes, reposRes, orgsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(u)}`),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(u)}/repos?per_page=100`,
      ),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(u)}/orgs?per_page=100`,
      ),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error("User not found.");
      throw new Error("Could not load user. Try again later.");
    }

    const user = await userRes.json();
    const repos: { stargazers_count: number }[] = reposRes.ok
      ? await reposRes.json()
      : [];
    const total_stars = repos.reduce(
      (s, r) => s + (r.stargazers_count || 0),
      0,
    );
    const orgs: unknown[] = orgsRes.ok ? await orgsRes.json() : [];
    const orgsCount = orgs.length;

    const publicGists = user.public_gists ?? 0;
    const yearsOnGitHub = yearsSince(
      user.created_at ?? new Date().toISOString(),
    );
    const veteranBonus = yearsOnGitHub >= VETERAN_YEARS ? VETERAN_BONUS : 0;

    let privateRepos: number | null = null;
    let privateGists: number | null = null;

    if (authHeaders) {
      const meRes = await fetch("https://api.github.com/user", {
        headers: authHeaders,
      });
      if (meRes.ok) {
        const me = await meRes.json();
        if (String(me.login).toLowerCase() === u.toLowerCase()) {
          privateRepos = me.total_private_repos ?? 0;
          privateGists = me.total_private_gists ?? 0;
        }
      }
    }

    const worth =
      (user.public_repos || 0) * 2 +
      (user.followers || 0) * 10 +
      total_stars * 5 +
      orgsCount * 15 +
      publicGists * 3 +
      veteranBonus +
      (privateRepos ?? 0) * 5 +
      (privateGists ?? 0) * 2;

    result.value = {
      worth: Math.max(0, Math.round(worth)),
      public_repos: user.public_repos ?? 0,
      private_repos: privateRepos,
      followers: user.followers ?? 0,
      total_stars,
      orgs: orgsCount,
      gists: publicGists,
      private_gists: privateGists,
      years_on_github: Math.floor(yearsOnGitHub),
      veteran_bonus: veteranBonus,
    };
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Something went wrong.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.checker {
  position: relative;
  padding: 3rem 1.5rem 4rem;
  min-height: 100vh;
  max-width: 520px;
  margin: 0 auto;
  overflow: hidden;
}

/* —— Background —— */
.bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 120% 80% at 50% -20%,
      rgba(120, 53, 180, 0.35) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 100% 60% at 80% 100%,
      var(--gitoken-primary-glow) 0%,
      transparent 45%
    ),
    radial-gradient(
      ellipse 80% 50% at 10% 80%,
      rgba(190, 24, 93, 0.15) 0%,
      transparent 45%
    ),
    linear-gradient(
      180deg,
      var(--gitoken-bg) 0%,
      var(--gitoken-bg-subtle) 40%,
      #0a0612 100%
    );
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: orb-float 15s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    var(--gitoken-primary-glow) 0%,
    transparent 70%
  );
  top: -120px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    var(--gitoken-secondary-subtle) 0%,
    transparent 70%
  );
  bottom: -80px;
  left: -80px;
  animation-delay: -5s;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(236, 72, 153, 0.15) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

.bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

@keyframes orb-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(20px, -15px) scale(1.05);
  }
  66% {
    transform: translate(-15px, 10px) scale(0.98);
  }
}

/* —— Content (above bg) —— */
.hero,
.input-section,
.result,
.hint-standalone {
  position: relative;
  z-index: 1;
}

/* —— Hero —— */
.hero {
  text-align: center;
  margin-bottom: 2.75rem;
}

.hero-logo {
  display: block;
  width: 200px;
  margin: 0 auto 1rem;
  padding-bottom: 20px;
  object-fit: contain;
}

.hero-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gitoken-primary-muted);
  background: var(--gitoken-primary-subtle);
  border: 1px solid var(--gitoken-primary-glow);
  border-radius: 999px;
  margin-bottom: 1.25rem;
  animation: badge-pulse 3s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 0 0 var(--gitoken-primary-glow);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 20px 2px var(--gitoken-primary-subtle);
  }
}

.title {
  font-family: "Syne", "Space Mono", sans-serif;
  font-size: clamp(3rem, 12vw, 4.5rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 0.95;
  background: var(--gitoken-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px var(--gitoken-primary-glow);
  filter: drop-shadow(0 0 30px var(--gitoken-primary-subtle));
}

.title-sub {
  font-family: "Syne", sans-serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin: 0 0 1rem;
  color: var(--gitoken-text-muted);
}

.tagline {
  color: var(--gitoken-text-muted);
  font-size: 1rem;
  margin: 0;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}

.tagline em {
  font-style: normal;
  color: var(--gitoken-primary-muted);
}

.token-stats {
  margin-top: 1.25rem;
  width: 100%;
  max-width: 360px;
}

.token-stats-title {
  font-family: "Syne", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gitoken-text-muted);
  margin: 0 0 0.75rem;
  display: block;
  text-align: center;
}

.token-stats-link {
  display: inline-flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.6rem 1rem;
  background: var(--gitoken-surface);
  border: 1px solid var(--gitoken-border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.token-stats-link:hover {
  background: var(--gitoken-surface-hover);
  border-color: var(--gitoken-border-hover);
}

.token-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.token-stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--gitoken-text-dim);
}

.token-stat-value {
  font-family: "Space Mono", ui-monospace, monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gitoken-primary-muted);
}

.token-stat-value.up {
  color: var(--gitoken-success);
}

.token-stat-value.down {
  color: var(--gitoken-error-soft);
}

/* —— Input —— */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--gitoken-surface);
  border: 1px solid var(--gitoken-border);
  border-radius: 16px;
  overflow: hidden;
  transition:
    border-color 0.3s,
    box-shadow 0.3s,
    background 0.3s;
}

.input-wrap:hover {
  background: var(--gitoken-surface-hover);
  border-color: var(--gitoken-border-hover);
}

.input-wrap:focus-within {
  border-color: var(--gitoken-border-focus);
  box-shadow:
    0 0 0 1px var(--gitoken-primary-subtle),
    0 0 40px var(--gitoken-primary-subtle);
  background: var(--gitoken-surface-active);
}

.input-prefix {
  padding: 0 1.1rem;
  color: var(--gitoken-text-dim);
  font-size: 0.9rem;
  font-family: "Space Mono", ui-monospace, monospace;
}

.input {
  flex: 1;
  min-width: 0;
  padding: 1.1rem 1.1rem 1.1rem 0;
  background: transparent;
  border: none;
  color: var(--gitoken-text);
  font-size: 1rem;
  font-family: "Space Mono", ui-monospace, monospace;
  outline: none;
}

.input::placeholder {
  color: var(--gitoken-text-dim);
}

.token-wrap {
  width: 100%;
}

.token-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--gitoken-surface);
  border: 1px solid var(--gitoken-border);
  border-radius: 12px;
  color: var(--gitoken-text);
  font-size: 0.85rem;
  font-family: "Space Mono", ui-monospace, monospace;
  outline: none;
  transition: border-color 0.2s;
}

.token-input::placeholder {
  color: var(--gitoken-text-dim);
}

.token-input:focus {
  border-color: var(--gitoken-border-focus);
}

/* —— Button —— */
.btn {
  position: relative;
  padding: 1.15rem 1.75rem;
  background: var(--gitoken-gradient-button);
  color: var(--gitoken-text-inverse);
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  font-family: "Syne", sans-serif;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
  overflow: hidden;
}

.btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled)::before {
  opacity: 1;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 12px 40px var(--gitoken-primary-glow),
    0 0 0 1px var(--gitoken-primary-subtle);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.btn-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: dot-bounce 0.6s ease-in-out infinite;
}

.btn-dot:nth-child(2) {
  animation-delay: 0.1s;
}
.btn-dot:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes dot-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* —— Result —— */
.result {
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1rem;
}

.result.error {
  background: var(--gitoken-error-subtle);
  border: 1px solid var(--gitoken-error);
  color: var(--gitoken-error-soft);
  text-align: center;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--gitoken-error-subtle);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.result.card {
  position: relative;
  background: var(--gitoken-surface);
  border: 1px solid var(--gitoken-border);
  backdrop-filter: blur(20px);
}

.card-glow {
  position: absolute;
  inset: -1px;
  border-radius: 21px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    var(--gitoken-primary-glow) 0%,
    var(--gitoken-primary-subtle) 50%,
    transparent 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.worth-row {
  text-align: center;
  margin-bottom: 1.5rem;
}

.worth-label {
  display: block;
  color: var(--gitoken-text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.worth-value {
  font-family: "Space Mono", ui-monospace, monospace;
  font-size: clamp(2rem, 6vw, 2.75rem);
  font-weight: 700;
  background: var(--gitoken-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px var(--gitoken-primary-glow));
}

.worth-value em {
  font-style: normal;
  color: var(--gitoken-text-soft);
  -webkit-text-fill-color: var(--gitoken-text-soft);
}

.breakdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--gitoken-border);
  border-bottom: 1px solid var(--gitoken-border);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: "Space Mono", ui-monospace, monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gitoken-text);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gitoken-text-dim);
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--gitoken-border-hover);
}

.veteran-badge {
  margin: 1rem 0 0;
  font-size: 0.85rem;
  color: var(--gitoken-primary-muted);
  text-align: center;
  font-weight: 600;
}

.hint {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: var(--gitoken-text-dim);
  text-align: center;
}

.worth-explainer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gitoken-border);
}

.worth-explainer summary {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gitoken-primary-muted);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.worth-explainer summary::-webkit-details-marker {
  display: none;
}

.worth-explainer summary::before {
  content: "▶ ";
  font-size: 0.65rem;
  opacity: 0.8;
}

.worth-explainer[open] summary::before {
  content: "▼ ";
}

.worth-explainer-inner {
  margin-top: 0.75rem;
  padding-left: 0.25rem;
  font-size: 0.8rem;
  color: var(--gitoken-text-muted);
  line-height: 1.5;
}

.worth-explainer-inner p {
  margin: 0 0 0.5rem;
}

.worth-explainer-inner ul {
  margin: 0 0 0.5rem;
  padding-left: 1.25rem;
}

.worth-explainer-inner li {
  margin-bottom: 0.25rem;
}

.worth-explainer-inner strong {
  color: var(--gitoken-text-soft);
}

.worth-explainer-note {
  font-size: 0.75rem;
  color: var(--gitoken-text-dim);
  font-style: italic;
}

.worth-explainer-formula {
  margin-top: 0.75rem !important;
  font-family: "Space Mono", ui-monospace, monospace;
  font-size: 0.7rem;
  color: var(--gitoken-text-dim);
  word-break: break-all;
}

.hint-standalone {
  text-align: center;
  color: var(--gitoken-text-dim);
  font-size: 0.95rem;
  margin: 0;
}

/* —— Transitions —— */
.result-enter-active,
.result-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.result-enter-from,
.result-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.token-stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}


.token-stats-link {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  background: var(--gitoken-surface);
  border: 1px solid var(--gitoken-border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.token-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.token-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--gitoken-border-hover);
}

.token-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.token-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gitoken-text-soft);
}

.token-symbol {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--gitoken-text-dim);
}

.token-card-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
