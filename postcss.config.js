// import autoprefixer from "autoprefixer";
// import cssnano from "cssnano";
import purgecss from "@fullhuman/postcss-purgecss";

export default {
  plugins: [
    // autoprefixer(),
    ...(process.env.NODE_ENV === 'production' || process.env.VITE_USER_NODE_ENV === 'production'
      ? [
          (purgecss.default || purgecss)({
            content: ["./src/**/*.html", "./src/**/*.js", "./index.html"], 
            defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],

            safelist: {
              standard: [
                'html', 'body',

                /active$/, /show$/, 
                /swiper/, /gsap/, /scrolltrigger/
              ],
              deep: [
                /swiper/, /gsap/, /carWarpper/
              ],
              greedy: [
                /swiper-/, /fa-/ , /.pin-spacer/, /gsap/, /scrolltrigger/
              ]
            }
          }),
          // cssnano({ 
          //   preset: ["default", { discardComments: { removeAll: true } }] 
          // }),
        ] 
      : []),
  ],
};