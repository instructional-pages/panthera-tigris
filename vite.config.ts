import { defineConfig } from "vite";

// Relative base so the site works from instructional-pages.github.io/panthera-tigris/.
export default defineConfig({
  base: "./",
  build: { target: "es2022" },
});
