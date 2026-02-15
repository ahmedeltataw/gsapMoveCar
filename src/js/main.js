
import "../style/scss/style.scss";


// ======header scrolling========
let header = document.querySelector("header");
let Body = document.body;
const HeaderFun = () => {
    // let HeaderHeight = header.offsetHeight;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 150) {
            header.classList.add("scroll");
            // Body.style.paddingTop = `${HeaderHeight}px`;
        } else {
            header.classList.remove("scroll");
            // Body.style.paddingTop = 0;
        }

    });
}
HeaderFun();



// =================
gsap.registerPlugin(ScrollTrigger);


function firstAnimations() {

    const tl = gsap.timeline({ defaults: { ease: "power3.out" },onComplete: () => {
            Body.classList.remove('stop-scrolling') ;
            document.querySelector('.intro').style.display = 'none';
            // fristMove(); 
        } });
    tl.to(".intro img", {
        y: 0,
        opacity: 1,
        duration: .8,
        ease: "back.out(1.7)"
    })
        .to(".intro img", {
            width: "100vw",
            height: "100svh",
            borderRadius: 0,   
            duration: 1,
            delay: 0.3
        })
        .to(".intro", {
            opacity: 0,
            duration: .2,
        })
        .to(".carWarpper svg", {
            x: "200px",
            autoAlpha: 1,
            duration: 1.8,
            ease: "back.out(1.7)",
        })
        .to("#backWheal, #FrontWheal", {
            rotation: 360,
            transformOrigin: "50% 50%",
            duration: 1.8,
            ease: "back.out(1.7)",
        }, "<")
        .to(".carWarpper svg #light", {
            opacity: 1,
            duration: 0.15,
            repeat: 3,
            ease: 'none',
            yoyo: true,
        }, "-=0.5")


}

function fristMove() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            endTrigger: ".About",

            start: "top +=0%",
            end: "+=75%",
            pin: '.carWarpper',
            scrub: 1,
            markers: true,
            pinSpacing: false,
            pointerEvents: "none",
            onEnter: () => {
                gsap.set("#backWheal, #FrontWheal", {
                    style: "animation-play-state: running; --TimeSpeed: 2s"
                });
            },
        }
    });

    tl
        .to(".carWarpper svg", {
            //   rotate:'-15deg',
            y: "1vh",
            scale: .7,
            duration: 3,
            ease: "none"

        })
    tl.to(".carWarpper svg", {
        rotate: '-15deg',
        duration: 1,
        ease: "power1.inOut"
    }, 0)

        .to(".carWarpper svg", {
            rotate: '1deg',
            duration: 1,
            ease: "power1.inOut"
        }, 2);
    tl.to(".carWarpper svg #light", {
        opacity: 1,
        duration: 3,
        // repeat: 3, 
        ease: 'none',
        // yoyo: true,
    }, 0)
    tl.to("#backWheal, #FrontWheal", {
        rotation: "-=1080",
        transformOrigin: "50% 50%",
        duration: 3,
        ease: "none"
    }, 0);


}


function playVideo(){
    let Video = document.querySelector('.VideoScroll video');

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".VideoScroll",
            endTrigger: ".About",
            start: "top +=0%",
            end: "+=90%",
            pin: true,
            scrub: true,
            markers: true,
            pinSpacing: true,
            pointerEvents: "none",
            
        }
        
    });
    tl.fromTo(Video, { currentTime: 0 }, { currentTime: Video.duration || 3 });
}

document.addEventListener('DOMContentLoaded', () => {
    firstAnimations();
    playVideo();
})

