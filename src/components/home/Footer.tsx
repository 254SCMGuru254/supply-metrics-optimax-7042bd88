import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import "../../Landing.css";

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
    }, { threshold: 0.5 });


    document.querySelectorAll('.stat-number').forEach(stat => {
        if(stat.textContent !== "24/7") {
             statsObserver.observe(stat);
        }
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
            <a href="#" className="cta-button">
              Launch Portal
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Chain.IO</h1>
          <p>Tenderzville Portal - Your Gateway to the Decentralized Future</p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">
              Enter Portal
            </a>
            <a href="#" className="btn-secondary">
              Explore Features
            </a>
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">10M+</span>
              <span className="stat-label">Transactions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
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
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>
                Experience blazing-fast transactions with our optimized
                blockchain infrastructure. Sub-second confirmations for seamless
                trading.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Ultra Secure</h3>
              <p>
                Military-grade encryption and multi-layer security protocols
                protect your assets. Your funds are always safe with us.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Cross-Chain</h3>
              <p>
                Seamlessly interact with multiple blockchains through our
                unified portal. Trade across networks without barriers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>
                Access your portfolio and trade on-the-go with our responsive
                design. Full functionality on any device.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered</h3>
              <p>
                Smart contract automation and AI-driven insights help you make
                better trading decisions with confidence.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>DeFi Native</h3>
              <p>
                Built for the decentralized future with native DeFi
                integrations, yield farming, and liquidity mining options.
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
              <p>
                The future of decentralized finance is here. Join thousands of
                users already trading on Tenderzville Portal.
              </p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <p>
                <a href="#">Documentation</a>
              </p>
              <p>
                <a href="#">API Reference</a>
              </p>
              <p>
                <a href="#">Tutorials</a>
              </p>
              <p>
                <a href="#">Community</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <p>
                <a href="#">Help Center</a>
              </p>
              <p>
                <a href="#">Contact Us</a>
              </p>
              <p>
                <a href="#">Bug Reports</a>
              </p>
              <p>
                <a href="#">Feature Requests</a>
              </p>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <p>
                <a href="#">Privacy Policy</a>
              </p>
              <p>
                <a href="#">Terms of Service</a>
              </p>
              <p>
                <a href="#">Cookie Policy</a>
              </p>
              <p>
                <a href="#">Compliance</a>
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Chain.IO - Tenderzville Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default NewLandingPage;
