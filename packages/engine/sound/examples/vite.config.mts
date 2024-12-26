import { defineConfig } from "vite";
import path from "path";

export default defineConfig(() => {
  return {
    publicDir: "assets",
    define: {},
    plugins: [],
    server: {
      port: 8080,
    },
    build: {},
    resolve: {
      alias: {
        "~": path.join(__dirname, "./src"),
      },
    },
  };
});
