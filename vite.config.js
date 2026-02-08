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
  root: "src", // مجلد العمل هو src
  base: './',
  css: {
    transformer: 'postcss', 
    lightningcss: false,
    devSourcemap: false // 🚀 ضيف دي عشان تسرع قراءة ملف الـ CSS الكبير
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false, // خليها true لو عايز تعمل Debug في الـ Production
    rollupOptions: {
      input: getPagesInput(),
      output: {
        // تنظيم الملفات بـ Hash لضمان أفضل Caching للمستخدم
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'file';
          const extType = name.split('.').pop();

          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/css/i.test(extType)) {
            return `css/[name]-[hash][extname]`;
          } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  optimizeDeps: {
    exclude: ['lightningcss'] // 👈 ضيف السطر ده عشان يهرب من المشكلة
  },
  // server: {
  //   watch: {
  //     ignored: ['**/style/css/AE.css'], 
  //   },
  // },
  plugins: [

    ViteImageOptimizer({
      // ضغط الصور الـ JPG
      jpeg: {
        quality: 75, // توازن ممتاز بين الجودة والمساحة
      },
      // ضغط الصور الـ PNG (الأهم عندك)
      png: {
        quality: 75,
        compressionLevel: 9, // أقصى مستوى ضغط
      },
      // ضغط الـ SVG لو عندك أيقونات
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs', active: true },
        ],
      },
    }),

    // لتقسيم الـ HTML لمكونات (Header/Footer)
    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"),
    }),
    svgSpritemap({
      // 1. مكان الأيقونات (تأكد إن المجلد ده موجود)
      pattern: 'src/assets/icons/*.svg',
      // 2. اسم الملف اللي هيطلع
      filename: 'assets/icons/sprites.svg',
      // 3. تنظيف الأيقونات من الألوان القديمة
      svgo: {
        plugins: [
          {
            name: 'removeAttrs',
            params: { attrs: '(fill|stroke)' }
          }
        ]
      },
      // 4. خيار مهم عشان يسهل عليك الاستخدام
      injectSVGOnDev: true,
    }),
  ],

  // إعداد اختياري لسهولة كتابة المسارات (Paths)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});