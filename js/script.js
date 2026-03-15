// ==================== TRACKING PLACEHOLDER ====================
// Replace with your actual tracking URL
const TRACKING_URL = 'YOUR_TRACKING_URL_HERE';

// Add tracking to all elements with data-tracking attribute
document.querySelectorAll('[data-tracking]').forEach(element => {
    element.addEventListener('click', function (e) {
        const trackingId = this.getAttribute('data-tracking');
        console.log('Tracking:', trackingId);
        // Uncomment and modify when tracking URL is available:
        // fetch(`${TRACKING_URL}?event=${trackingId}&timestamp=${Date.now()}`);
    });
});
// =============================================================

// Mobile Detection
function isMobileOrTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile', 'tablet'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
        (window.innerWidth <= 1024 && 'ontouchstart' in window);
}

function showMobileModal() {
    const modal = document.getElementById('mobileModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeMobileModal() {
    const modal = document.getElementById('mobileModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Show mobile warning on page load if on mobile/tablet
if (isMobileOrTablet()) {
    showMobileModal();
}

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Sticky CTA visibility
const stickyCta = document.getElementById('stickyCta');
const hero = document.getElementById('hero');

if (stickyCta && hero) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Appear only after scrolling past the hero section completely + 200px buffer
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (scrollY > heroBottom + 200) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}

// Scroll animations
const animateElements = document.querySelectorAll('.animate-on-scroll');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(element => {
    observer.observe(element);
});

// Particle system
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

createParticles();

// AAA Storefront Carousel logic
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const indicatorsContainer = document.getElementById('carouselIndicators');

if (slides.length > 0 && prevBtn && nextBtn && indicatorsContainer) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let carouselInterval;
    let animationDuration = 3000;

    // Generate Indicators
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        dot.addEventListener('click', () => {
            if (currentSlide !== index) {
                currentSlide = index;
                updateCarousel();
                resetAutoSlide();
            }
        });
        indicatorsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.indicator-dot');

    function updateCarousel() {
        // Remove all existing positioning classes
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next', 'prev-far', 'next-far');
            dots[index].classList.remove('active');
            
            // Hack to reset the CSS animation on the dot
            void dots[index].offsetWidth;
        });

        // Calculate indices using modulo math for infinite looping
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        const nextIndex = (currentSlide + 1) % totalSlides;
        const prevFarIndex = (currentSlide - 2 + totalSlides) % totalSlides;
        const nextFarIndex = (currentSlide + 2) % totalSlides;

        // Apply classes
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        slides[prevIndex].classList.add('prev');
        slides[nextIndex].classList.add('next');
        if(totalSlides > 3) {
            slides[prevFarIndex].classList.add('prev-far');
            slides[nextFarIndex].classList.add('next-far');
        }
    }

    function slideNext() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }

    function slidePrev() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetAutoSlide();
    }

    // Event Listeners for Arrows
    nextBtn.addEventListener('click', slideNext);
    prevBtn.addEventListener('click', slidePrev);

    // Make side slides clickable
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            if (slide.classList.contains('active')) return;
            currentSlide = index;
            updateCarousel();
            resetAutoSlide();
        });
    });

    // Auto-slide functionality
    function startAutoSlide() {
        carouselInterval = setInterval(slideNext, animationDuration); 
    }

    function resetAutoSlide() {
        clearInterval(carouselInterval);
        startAutoSlide();
    }

    updateCarousel();
    startAutoSlide();

    // Pause on hover over carousel container
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
            dots.forEach(d => d.style.animationPlayState = 'paused');
        });
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
            dots.forEach(d => d.style.animationPlayState = 'running');
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    slidePrev();
                } else {
                    slideNext();
                }
            }
        });
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Glitch effect randomization
function randomGlitch() {
    const glitchElement = document.querySelector('.glitch');
    if (glitchElement && Math.random() > 0.95) {
        glitchElement.style.textShadow = `
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 var(--neon-cyan),
            ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 var(--neon-pink)
        `;
        setTimeout(() => {
            glitchElement.style.textShadow = '';
        }, 100);
    }
}

setInterval(randomGlitch, 2000);
