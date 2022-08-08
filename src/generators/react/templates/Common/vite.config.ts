import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import wc from "wildcard-match";
import { resolve } from "path";
import { dependencies } from "./package.json";
import react from "@vitejs/plugin-react";

/**
 * an array file directives to override the default Vite compilation params for specific files.
 */
 const FILE_DIRECTIVES: {
    isMatch: ReturnType<typeof wc>;
    directive: URLSearchParams | ((url: URL) => URLSearchParams);
}[] = [];

/**
 * Dependencies to be chunked together instead of individually.
 */
 const MANUAL_CHUNKS: { [chunkName: string]: (keyof typeof dependencies)[] } = {
    react: ["react", "react-dom", "react-router-dom"],
    <% if (mantine) { %>mantine: ["@mantine/core", "@mantine/hooks"],<% } %>
    <% if (i18next) { %>i18next: ["i18next","i18next-browser-languagedetector","i18next-resources-to-backend","react-i18next",],<% } %>
};

const chunkDependencies = () => {
    const chunks: { [key: string]: string[] } = {};
    const chunked: string[] = Object.values(MANUAL_CHUNKS).flat();
    Object.keys(dependencies).forEach((key) => {
        if (chunked.includes(key)) return;
        chunks[key] = [key];
    });
    return chunks;
};

export default defineConfig({
    plugins: [
        imagetools({
            include: "**/*.{jpeg,jpg,png,webp}*",
            defaultDirectives: (url) => {
                const fileDirective = FILE_DIRECTIVES.find(({ isMatch }) =>
                    isMatch(url.pathname)
                );

                if (fileDirective) {
                    if (typeof fileDirective.directive === "function") {
                        return fileDirective.directive(url);
                    }
                    return fileDirective.directive;
                }

                // Default directive. Convert asset to webp format.
                return new URLSearchParams({
                    format: "webp",
                });
            },
        }),
        react(),
    ],
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        assetsInlineLimit: 0,
        sourcemap: false,
        rollupOptions: {
            input: resolve(__dirname, "src/index.html"),
            output: {
                assetFileNames: () => {
                    // If you want to preserve the asset file name, use the post-build script instead to copy the file to the dist folder.
                    // Assets used in the website should have a hash to prevent showing outdated assets due to caching.
                    return "assets/[name].[hash].[ext]";
                },
                manualChunks: {
                    ...MANUAL_CHUNKS,
                    ...chunkDependencies(),
                },
            },
        },
    },
    preview: {
        port: 3001,
        strictPort: true,
    },
});
