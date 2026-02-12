import type { Config } from "vike/types";
import vikeVue from "vike-vue/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "$gitoken Checker — How much is your GitHub worth?",
  description: "Check your GitHub worth in $gitoken. Repos, stars, followers, orgs, gists & account age.",

  extends: [vikeVue],
} as Config;
