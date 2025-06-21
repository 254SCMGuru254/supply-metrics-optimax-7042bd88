import { useEffect } from "react";
import "./Landing.css";

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
    <>
      <div className="particles" id="particles"></div>
      <header>
        <div className="container">
          <nav>
            <div className="logo">Chain.IO</div>
            <ul className="nav-links">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#portal">Portal</a>
              </li>
              <li>
                <a href="#docs">Docs</a>
              </li>
              <li>
                <a href="#support">Support</a>
              </li>
            </ul>
            <a href="/dashboard" className="cta-button">
              Launch App
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Intelligent Supply Chain Optimization</h1>
          <p>Supply Chain 3.0: Outthink. Outmaneuver. Outperform. Build a resilient, efficient, and sustainable supply chain.</p>
          <div className="hero-buttons">
            <a href="/dashboard" className="btn-primary">
              Enter Portal
            </a>
            <a href="#features" className="btn-secondary">
              Explore Features
            </a>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number" data-value="15" data-suffix="%">15%</span>
              <span className="stat-label">Average Cost Reduction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="20" data-suffix="%">20%</span>
              <span className="stat-label">Efficiency Gain</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="98.5" data-suffix="%">98.5%</span>
              <span className="stat-label">On-Time Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" data-value="1000" data-suffix="+">1000+</span>
              <span className="stat-label">Scenarios Modelled</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <h2>Powerful Optimization Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Network Design</h3>
              <p>
                Model your end-to-end supply chain. Find optimal facility locations and product flows with our advanced algorithms.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Demand Forecasting</h3>
              <p>
                Utilize advanced statistical models to accurately predict demand and reduce uncertainty in your planning.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Inventory Optimization</h3>
              <p>
                Balance service levels and costs. Utilize demand forecasting and multi-echelon inventory policies to hold the right amount of stock.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Route Optimization</h3>
              <p>
                Minimize transport costs and delivery times. Our routing engine handles complex constraints including capacity, time windows, and more.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Center of Gravity</h3>
              <p>
                Identify the ideal location for a new distribution center or facility based on demand points and shipping volumes.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌊</div>
              <h3>Risk & Resilience Simulation</h3>
              <p>
                Test your supply chain against disruptions. Identify vulnerabilities and build a more resilient network with "what-if" scenario analysis.
              </p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Cost-to-Serve Modeling</h3>
                <p>
                Analyze the total cost of serving each customer and product to identify opportunities for profitability improvement.
                </p>
            </div>
            <div className="feature-card">
                <div className="feature-icon">🛰️</div>
                <h3>Fleet Management</h3>
                <p>
                Monitor your fleet in real-time, manage vehicle capacity, and optimize dispatching to improve asset utilization.
                </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Chain.IO</h3>
              <p>Supply Chain 3.0: Outthink. Outmaneuver. Outperform.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <a href="/documentation">Documentation</a>
              <a href="#features">Features</a>
              <a href="/dashboard">Portal Login</a>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Bug Reports</a>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Chain.IO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NewLandingPage; 