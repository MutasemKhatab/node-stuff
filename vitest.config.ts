import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["test/**/*.test.ts"],
          name: "util tests",
        },
      },
    ],
  },
});
