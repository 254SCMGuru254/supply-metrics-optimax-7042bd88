import "./Landing.css";

const logos = [
  "/public/logo1.png",
  "/public/logo2.png",
  "/public/logo3.png",
];

const testimonials = [
  {
    quote: "Chain.IO gave us real-time visibility and cut our logistics costs by 18% in 3 months.",
    author: "Jane Doe, COO, MegaRetail"
  },
  {
    quote: "The AI-powered insights are a game changer for our global operations.",
    author: "John Smith, VP Supply Chain, AgroCorp"
  }
];

const stats = [
  { label: "Transactions", value: 12000000 },
  { label: "Active Users", value: 40000 },
  { label: "Uptime", value: 99.99, suffix: "%" },
  { label: "Global Clients", value: 120 }
];

const features = [
  {
    title: "Network Design",
    desc: "Model and optimize your end-to-end supply chain network.",
    icon: "network"
  },
  {
    title: "Inventory Optimization",
    desc: "Reduce stockouts and costs with AI-driven inventory policies.",
    icon: "inventory"
  },
  {
    title: "Route Optimization",
    desc: "Minimize transport costs and delivery times with advanced algorithms.",
    icon: "route"
  },
  {
    title: "Risk & Resilience",
    desc: "Simulate disruptions and build a more resilient supply chain.",
    icon: "risk"
  }
];

const FeatureCard = ({ title, desc }) => (
  <div className="bg-blue-900 bg-opacity-60 rounded-xl p-6 shadow-lg flex flex-col items-start">
    <div className="mb-4 text-2xl">🔹</div>
    <div className="font-bold text-lg mb-2">{title}</div>
    <div className="text-blue-100 text-sm">{desc}</div>
  </div>
);

const TestimonialCard = ({ quote, author }) => (
  <div className="bg-blue-950 bg-opacity-80 rounded-xl p-6 shadow-md max-w-xs">
    <div className="italic mb-3">“{quote}”</div>
    <div className="text-blue-300 font-semibold">{author}</div>
  </div>
);

const StatBox = ({ label, value, suffix }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold text-blue-300">
      {value.toLocaleString()}{suffix || ""}
    </div>
    <div className="text-blue-100 text-sm mt-1">{label}</div>
  </div>
);

import React, { useEffect } from "react";

const NewLandingPage = () => {
  useEffect(() => {
    // Create animated particles
    function createParticles() {
      const particlesContainer = document.getElementById("particles");
      if (!particlesContainer) return;

      // Clear any existing particles
      particlesContainer.innerHTML = '';

      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 20 + "s";
        particle.style.animationDuration =
          Math.random() * 10 + 15 + "s";
        particlesContainer.appendChild(particle);
      }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href") as string);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Counter animation for stats
    function animateCounter(element: HTMLElement, target: number, duration = 2000) {
      let start = 0;
      const increment = target / (duration / 16);

      function updateCounter() {
        start += increment;
        if (start < target) {
          element.textContent = Math.floor(start).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
        }
      }
      updateCounter();
    }
    
    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const stat = entry.target as HTMLElement;
                const value = stat.dataset.value || '';
                const suffix = stat.dataset.suffix || '';
                const num = parseFloat(value);

                if(!isNaN(num)) {
                    stat.textContent = '0' + suffix;
                    animateCounter(stat, num);
                }
                statsObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Intersection Observer for feature cards
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
            cardObserver.unobserve(card);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card').forEach(card => {
        const htmlCard = card as HTMLElement;
        htmlCard.style.opacity = '0';
        htmlCard.style.transform = 'translateY(50px)';
        htmlCard.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });

    // Dynamic glow effect for hero title
    const heroTitle = document.querySelector('.hero h1') as HTMLElement;
    let glowIntensity = 0;
    let glowDirection = 1;

    const glowInterval = setInterval(() => {
        glowIntensity += glowDirection * 0.02;
        if (glowIntensity >= 1) glowDirection = -1;
        if (glowIntensity <= 0) glowDirection = 1;
        
        const glowValue = 20 + (glowIntensity * 20);
        if(heroTitle) {
            heroTitle.style.filter = `drop-shadow(0 0 ${glowValue}px rgba(0, 212, 255, ${0.3 + glowIntensity * 0.3}))`;
        }
    }, 50);


    // Initial setup
    createParticles();

    // Cleanup function
    return () => {
        clearInterval(glowInterval);
        statsObserver.disconnect();
        cardObserver.disconnect();
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
             anchor.removeEventListener("click", () => {});
        });
    }

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-blue-400">Chain</span>.<span className="text-blue-300">IO</span>
        </div>
        <nav className="space-x-6">
          <a href="#features" className="hover:underline">Features</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
          <a href="#docs" className="hover:underline">Docs</a>
          <a href="#support" className="hover:underline">Support</a>
          <button className="ml-6 px-5 py-2 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition">Launch App</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Supply Chain 3.0: Outthink. Outmaneuver. Outperform
          </h1>
          <p className="text-lg text-blue-100">
            The next generation of supply chain optimization. Harness AI and advanced analytics to build a resilient, efficient, and sustainable supply chain.
          </p>
          <div className="flex space-x-4 mt-6">
            <button className="px-6 py-3 bg-blue-500 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-600 transition">Get Started Free</button>
            <button className="px-6 py-3 border border-blue-400 rounded-lg font-bold text-lg hover:bg-blue-700 transition">See Live Demo</button>
          </div>
          {/* Animated Stats */}
          <div className="flex space-x-8 mt-8">
            {stats.map((stat) => (
              <StatBox
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix ?? ""}
              />
            ))}
          </div>
        </div>
        {/* Illustration or Animation */}
        <div className="md:w-1/2 flex justify-center mt-12 md:mt-0">
          <img src="/public/illustration-supplychain.svg" alt="Supply Chain Illustration" className="w-96 h-auto" />
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 bg-blue-950 bg-opacity-80">
        <div className="text-center text-blue-200 mb-4">Trusted by leading brands</div>
        <div className="flex justify-center space-x-8">
          {logos.map((logo, i) => <img key={i} src={logo} alt={`Brand${i+1}`} className="h-8" />)}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-8">
        <h2 className="text-3xl font-bold text-center mb-10">Powerful Optimization Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-950 bg-opacity-80">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="flex justify-center space-x-8">
          {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-blue-200 flex flex-col md:flex-row justify-between items-center border-t border-blue-800">
        <div>© {new Date().getFullYear()} Chain.IO. All rights reserved.</div>
        <div className="space-x-6">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms of Service</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage; 