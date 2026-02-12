# $gitoken — GitHub Worth Checker

Check how much your GitHub hustle is worth in **$gitoken**. Enter a username to get a score based on repos, stars, followers, orgs, gists, and account age. The app also shows live **$gitoken** token price and market cap from [Clanker](https://clanker.world).

![$gitoken Checker](https://img.shields.io/badge/gitoken-checker-gold)

## Features

- **Worth calculator** — Score from public repos, followers, total stars, organizations, public gists, and a veteran bonus (3+ years on GitHub).

- **Live token stats** — Price, market cap, and 24h change for the $gitoken token on [Clanker.world](https://clanker.world).

## Worth formula

```
worth = (public_repos × 2) + (followers × 10) + (stars × 5) + (orgs × 15) + (gists × 3) + veteran_bonus + (private_repos × 5) + (private_gists × 2)
```

- **Veteran bonus:** +100 if the account is 3+ years old.
- **Private terms:** Only applied when you provide a token and check your own username.

## Tech stack

- [Vike](https://vike.dev) — SSR + routing
- [Vue 3](https://vuejs.org) — UI
- [TypeScript](https://www.typescriptlang.org) — Types
- [Vite](https://vite.dev) — Build

## Quick start

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Project structure

```
├── pages/
│   ├── index/
│   │   ├── +Page.vue      # Main checker page
│   │   └── +data.ts       # Server-side Clanker API fetch (token price/mcap)
│   ├── +Layout.vue        # Layout + footer
│   ├── +Head.vue          # Favicon, fonts
│   └── +config.ts         # Title, description
├── assets/
│   ├── theme.css          # $gitoken color palette (CSS variables)
│   ├── favicon.png
│   └── logo.png
└── components/
```

## Token on Clanker

$gitoken is deployed on [Clanker.world](https://clanker.world) (Base). The app loads token stats from the Clanker API via server-side `+data.ts` to avoid CORS in the browser.

## Disclaimer

$gitoken is not affiliated with GitHub. GitHub is a trademark of GitHub, Inc. Not financial advice — for entertainment only.

---

Made with ❤️ by [@defiboyszn](https://twitter.com/defiboyszn)
