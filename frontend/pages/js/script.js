gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const lenis = new Lenis();
window.lenis = lenis;

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.ticker.lagSmoothing(0);

// ANIMACAO DE SEPARACAO DOS CARDS
gsap.to(".planos-grid", {
    scrollTrigger: {
        trigger: "#planos",
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1,
    },
    gap: "2.5rem",
    ease: "power2.out"
});

// ANIMACAO DE BLUR + ENTRADA DOS CARDS
gsap.utils.toArray(".plan-card").forEach((card) => {
    gsap.from(card, {
        y: -90,
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95,
        immediateRender: false,
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 60%",
            scrub: 1, 
        },
        duration: 1,
        ease: "power3.out"
    });
});

// ANIMACAO DE FOCO DOS CARDS
gsap.to(".plan-card", {
    scrollTrigger: {
        trigger: "#planos",
        start: "top center",
        end: "bottom center",
        scrub: 1,
    },
    scale: 1.05, 
    ease: "power2.out"
});

//REFRESH DA PAGINA
window.addEventListener('load', () => {
    ScrollTrigger.refresh()
})

// ANIMACAO DE SCROLL E PULSACAO DA NAVBAR
let pulseAnimation = gsap.to("header", {
    borderBottom: "2px solid rgba(0, 0, 0, 0)",
    boxShadow: "0px 5px 25px rgba(255,140,0,0.8)",
    repeat: -1,
    yoyo: true,
    duration: 1.85,
    ease: "power1.inOut",
    paused: true
});

ScrollTrigger.create({
    trigger: "body",
    start: "top -10",
    end: "bottom top",

    onEnter: () => pulseAnimation.play(),
    onLeaveBack: () => {
        pulseAnimation.pause();
        gsap.to("header", {
            boxShadow: "0px 0px 0px rgba(255,140,0,0)",
            borderBottom: "2px solid rgba(255, 140, 0, 1)",
            duration: 0.7
        });
    }
});

gsap.to("header", {
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=200",
        scrub: 1,
    },
    borderBottom: "2px solid rgba(255,140,0,1)",
    boxShadow: "0px 5px 20px rgba(255,140,0,0.5)",
    opacity: 0.95,
    ease: "power3.inOut"
});

document.querySelectorAll(".plan-card").forEach(card => {

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 30;
        const rotateY = (x - centerX) / 30;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 2000,
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            y: 0,
            scale: 1.05,
            duration: 0.5,
            ease: "power3.out"
        });

    });

});

//EFEITO PARALAX

gsap.to("#home.hero ", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  },
});

