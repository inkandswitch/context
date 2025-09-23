import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      entryRoot: "src",
      outDir: "dist",
      include: ["src/**/*"],
      exclude: ["src/**/*.test.*"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.tsx",
        react: "src/frameworks/react.ts",
        diff: "src/apis/diff.ts",
        selection: "src/apis/selection.ts",
      },
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "@automerge/automerge-repo", "@automerge/automerge"],
      preserveEntrySignatures: "allow-extension",
      output: {
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    target: "esnext",
  },
});
