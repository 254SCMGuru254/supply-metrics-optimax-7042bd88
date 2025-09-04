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
          <h1>Supply Chain Optimization That Actually Works</h1>
          <p>Python-powered optimization engine with 15+ proven models. Real results, not promises.</p>
          <div className="hero-buttons">
            <a href="/dashboard" className="btn-primary">Start Free Trial</a>
            <a href="#features" className="btn-secondary">See How It Works</a>
          </div>
          <div style={{marginTop: '1rem', fontSize: '0.9rem', color: '#888'}}>
            ✓ No credit card required &nbsp;&nbsp; ✓ Real optimization algorithms &nbsp;&nbsp; ✓ Export professional reports
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Proven Models</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Real Data Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">85%</span>
              <span className="stat-label">Avg Cost Savings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Open</span>
              <span className="stat-label">Source Core</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <h2>Python-Powered Optimization Engine</h2>
          <p style={{textAlign: 'center', marginBottom: '2rem', color: '#666'}}>
            Built with industry-standard libraries: PuLP, SciPy, NumPy, NetworkX, Gurobi, OR-Tools
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏭</div>
              <h3>Multi‑Echelon Inventory</h3>
              <p>
                <strong>How:</strong> EOQ, Safety Stock, ABC, JIT algorithms with PuLP optimization<br/>
                <strong>When:</strong> Managing 3+ warehouse tiers, seasonal demand<br/>
                <strong>Why:</strong> Reduces inventory costs by 25-40% while maintaining service levels
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Network Optimization</h3>
              <p>
                <strong>How:</strong> Minimum cost flow, P-median algorithms via NetworkX<br/>
                <strong>When:</strong> Designing distribution networks, opening new facilities<br/>
                <strong>Why:</strong> Optimizes total landed costs, improves delivery times by 30%
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>AI Demand Forecasting</h3>
              <p>
                <strong>How:</strong> Prophet, ARIMA, LSTM models with scikit-learn<br/>
                <strong>When:</strong> Volatile demand, seasonal products, new market entry<br/>
                <strong>Why:</strong> Reduces forecast error by 45%, prevents stockouts
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚛</div>
              <h3>Route Optimization</h3>
              <p>
                <strong>How:</strong> Vehicle routing, TSP algorithms with OR-Tools<br/>
                <strong>When:</strong> Last-mile delivery, field service routing<br/>
                <strong>Why:</strong> Cuts transportation costs by 20-35%, improves efficiency
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚠️</div>
              <h3>Risk & Simulation</h3>
              <p>
                <strong>How:</strong> Monte Carlo simulation, VaR calculations with SciPy<br/>
                <strong>When:</strong> Supply chain disruptions, scenario planning<br/>
                <strong>Why:</strong> Quantifies risk exposure, builds resilient networks
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-Time Analytics</h3>
              <p>
                <strong>How:</strong> Matplotlib visualizations, live dashboards<br/>
                <strong>When:</strong> Daily operations, performance monitoring<br/>
                <strong>Why:</strong> Provides actionable insights, tracks KPI performance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sectors" style={{padding: '4rem 0', backgroundColor: '#f8f9fa'}}>
        <div className="container">
          <h2 style={{textAlign: 'center', marginBottom: '3rem'}}>Industry Applications</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Agriculture & Farming</h3>
              <p>
                <strong>Tea & Coffee Cooperatives:</strong> Collection route optimization, quality-based inventory<br/>
                <strong>Horticulture:</strong> Cold chain management, export logistics timing<br/>
                <strong>Grain:</strong> Storage optimization, seasonal price hedging
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Supply Chain Consultants</h3>
              <p>
                <strong>Client Analysis:</strong> Network design, cost optimization models<br/>
                <strong>ROI Validation:</strong> Before/after scenarios, savings quantification<br/>
                <strong>Presentations:</strong> Professional reports, executive dashboards
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👔</div>
              <h3>CEOs & Executives</h3>
              <p>
                <strong>Strategic Planning:</strong> Facility location, market expansion<br/>
                <strong>Cost Control:</strong> Inventory optimization, logistics efficiency<br/>
                <strong>Risk Management:</strong> Supplier diversification, scenario analysis
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏭</div>
              <h3>Manufacturing</h3>
              <p>
                <strong>Production Planning:</strong> Multi-echelon inventory, capacity planning<br/>
                <strong>Distribution:</strong> Warehouse network design, transportation<br/>
                <strong>Procurement:</strong> Supplier optimization, risk assessment
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Retail & FMCG</h3>
              <p>
                <strong>Inventory:</strong> SKU-level optimization, promotional planning<br/>
                <strong>Distribution:</strong> DC location, last-mile delivery<br/>
                <strong>Forecasting:</strong> Demand planning, seasonality modeling
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⛏️</div>
              <h3>Mining & Heavy Industry</h3>
              <p>
                <strong>Equipment:</strong> Maintenance scheduling, spare parts optimization<br/>
                <strong>Logistics:</strong> Heavy haul transport, port coordination<br/>
                <strong>Operations:</strong> Production planning, resource allocation
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
              
              <p>
                <a href="#">Privacy Policy</a>
              </p>
              <p>
                <a href="#">Terms of Service</a>
              </p>
              <p>
                <a href="#">2025 Chain.io . All rights reserved.</a>
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