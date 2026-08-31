import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      NEXT_PUBLIC_CHECKOUT_URL: "https://checkout.filixpay.com",
      NEXT_PUBLIC_SITE_URL: "https://www.filixpay.com",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
