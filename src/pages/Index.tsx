import { useEffect } from "react";
import "../Landing.css";
const Index = () => {
  useEffect(() => {
    // Create animated particles with full page coverage
    function createParticles() {
      const particlesContainer = document.getElementById("particles");
      if (!particlesContainer) return;

      // Clear any existing particles
      particlesContainer.innerHTML = '';
      const particleCount = 80; // Increased for better coverage
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%"; // Add vertical positioning
        particle.style.animationDelay = Math.random() * 20 + "s";
        particle.style.animationDuration = Math.random() * 10 + 15 + "s";
        particlesContainer.appendChild(particle);
      }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href") as string);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
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
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stat = entry.target as HTMLElement;
          const value = stat.textContent || '';
          if (value.includes('M+')) {
            const num = parseFloat(value) * 1000000;
            stat.dataset.suffix = 'M+';
            stat.textContent = '0';
            animateCounter(stat, num);
          } else if (value.includes('K+')) {
            const num = parseFloat(value) * 1000;
            stat.dataset.suffix = 'K+';
            stat.textContent = '0';
            animateCounter(stat, num);
          } else if (value.includes('%')) {
            const num = parseFloat(value);
            stat.dataset.suffix = '%';
            stat.textContent = '0%';
            let start = 0;
            const timer = setInterval(() => {
              start += 0.1;
              if (start >= num) {
                stat.textContent = value;
                clearInterval(timer);
              } else {
                stat.textContent = start.toFixed(1) + '%';
              }
            }, 20);
          }
          statsObserver.unobserve(stat);
        }
      });
    }, {
      threshold: 0.5
    });
    document.querySelectorAll('.stat-number').forEach(stat => {
      if (stat.textContent !== "24/7") {
        statsObserver.observe(stat);
      }
    });

    // Intersection Observer for feature cards
    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target as HTMLElement;
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          cardObserver.unobserve(card);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
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
      const glowValue = 20 + glowIntensity * 20;
      if (heroTitle) {
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
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener("click", () => {});
      });
    };
  }, []);
  return <>
      <div className="particles fixed inset-0 w-full h-full z-0" id="particles"></div>
      <header className="relative z-10">
        <div className="container">
          <nav>
            <div className="logo">Chain.io</div>
            <ul className="nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="/analytics">Analytics</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/documentation">Docs</a></li>
              <li><a href="/support">Support</a></li>
            </ul>
            <a href="/dashboard" className="cta-button">Launch Portal</a>
          </nav>
        </div>
      </header>

      <section className="hero relative z-10">
        <div className="container">
          <h1>Supply Metrics Optimax</h1>
          <p>Advanced Supply Chain Intelligence - Your Gateway to Optimized Operations</p>
          <div className="hero-buttons">
            <a href="/dashboard" className="btn-primary">Enter Portal</a>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">40+</span>
              <span className="stat-label">Optimization Models</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100K+</span>
              <span className="stat-label">Data Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Multi‑Echelon Inventory</h3>
              <p>
                Optimize safety stock and base stock across plants, DCs, and stores with EOQ, Safety Stock, ABC, and JIT policies.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Route & Network Optimization</h3>
              <p>
                Real routing, facility location, and network design with constraints, costs, and service levels.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Demand Forecasting AI</h3>
              <p>
                Machine‑learning powered forecasts with seasonality and error tracking for better replenishment decisions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏭</div>
              <h3>Facility Location</h3>
              <p>
                Determine optimal sites and capacities to minimize total landed cost and maximize service.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Resilience & Simulation</h3>
              <p>
                Disruption scenarios, Monte Carlo, and recovery strategies to harden your supply chain.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔌</div>
              <h3>Data Integration</h3>
              <p>
                Import CSVs, use Supabase storage, and connect to enterprise sources. No blockchain or DeFi claims.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Supply Metrics Optimax</h3>
              <p>
                Advanced supply chain optimization platform for real‑world operations. No blockchain hype — just results.
              </p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <p>
                <a href="/documentation">Documentation</a>
              </p>
              <p>
                <a href="/analytics">Analytics</a>
              </p>
              <p>
                <a href="/pricing">Pricing</a>
              </p>
              <p>
                <a href="/support">Support</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>Resources</h3>
              <p>
                <a href="/data-management">Data Management</a>
              </p>
              <p>
                <a href="/demand-forecasting">Demand Forecasting</a>
              </p>
              <p>
                <a href="/network-optimization">Network Optimization</a>
              </p>
              <p>
                <a href="/inventory-management">Inventory</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>2025 Chain.io . All rights reserved.</h3>
              <p>
                <a href="#">Privacy Policy</a>
              </p>
              <p>
                <a href="#">Terms of Service</a>
              </p>
              <p>
                <a href="#">2025 Chain.io Metrics Optimax. All rights reserved.</a>
              </p>
              <p>
                <a href="#">Compliance</a>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Supply Metrics Optimax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>;
};
export default Index;