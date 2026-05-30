gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
window.lenis = lenis;

function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.ticker.lagSmoothing(0);


// ANIMACAO DE BLUR + ENTRADA DOS CARDS
gsap.utils.toArray(".plan-card").forEach((card) => {
    gsap.from(card, {
        y: -90,
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.95,
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
        },
        duration: 0.8,
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
    boxShadow: "0px 5px 20px rgba(255,140,0,0.5)",
    opacity: 0.95,
    ease: "power3.inOut"
});

document.querySelectorAll(".plan-card").forEach(card => {
    let rafPending = false;

    card.addEventListener("mousemove", (e) => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const rotateX = -((e.clientY - rect.top) - rect.height / 2) / 30;
            const rotateY = ((e.clientX - rect.left) - rect.width / 2) / 30;
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 2000,
                y: -10,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
            rafPending = false;
        });
    });

    card.addEventListener("mouseleave", () => {
        rafPending = false;
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

// ANIMACAO DE ENTRADA DOS CARDS DE CORTES
gsap.utils.toArray(".corte-card").forEach((card, i) => {
    gsap.from(card, {
        y: 60,
        opacity: 0,
        filter: "blur(8px)",
        scale: 0.95,
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
        },
        duration: 0.7,
        delay: i * 0.08,
        ease: "power3.out"
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

