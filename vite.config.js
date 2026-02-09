import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handlebars from 'vite-plugin-handlebars';
import svgSpritemap from 'vite-plugin-svg-spritemap';
// import { imagetools } from 'vite-imagetools';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// دالة ذكية بتلف على كل ملفات الـ HTML في src وتخليها مداخل (Entries) للمشروع
function getPagesInput() {
  const srcDir = path.resolve(__dirname, "src");
  if (!fs.existsSync(srcDir)) return {};

  return fs.readdirSync(srcDir).reduce((entries, file) => {
    if (file.endsWith(".html")) {
      const name = file.replace(".html", "");
      entries[name] = path.resolve(srcDir, file);
    }
    return entries;
  }, {});
}

export default defineConfig({
  root: "src", 
  base: './',
  css: {
    // transformer: 'postcss',
    // lightningcss: false,
    devSourcemap: false ,
    // transformer: 'lightningcss',
    lightningcss: {
      targets: {
        browsers: ['> 0.25%, not dead'], // تحديد المتصفحات التي تدعمها
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false, 
    assetsInlineLimit: 0,
    cssMinify: 'lightningcss',
    rollupOptions: {
      input: getPagesInput(),
      output: {
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'file';
          const extType = name.split('.').pop();

          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          } else if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  // optimizeDeps: {
  //   exclude: ['lightningcss']
  // },
  // server: {
  //   watch: {
  //     ignored: ['**/style/css/AE.css'], 
  //   },
  // },
  plugins: [

    ViteImageOptimizer({

      jpeg: {
        quality: 75,
      },

      png: {
        quality: 75,
        compressionLevel: 9,
      },
      webp: {
        quality: 75,
      },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs', active: true },
        ],
      },
    }),


    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"),
    }),
    svgSpritemap({

      pattern: 'src/assets/icons/*.svg',

      filename: 'assets/icons/sprites.svg',

      svgo: {
        plugins: [
          {
            name: 'removeAttrs',
            params: { attrs: '(fill|stroke)' }
          }
        ]
      },

      injectSVGOnDev: true,
    }),
  ],


  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});