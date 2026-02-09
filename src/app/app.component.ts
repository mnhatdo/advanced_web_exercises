import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ExerciseTab {
  path: string;
  label: string;
  shortLabel: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- Top Navigation Bar -->
      <header class="top-bar">
        <div class="logo">
          <span class="logo-icon">◉</span>
          <span class="logo-text">Angular Exercises</span>
        </div>
        <nav class="top-nav">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="tab.path" routerLinkActive="active" class="nav-link">
              {{ tab.shortLabel }}
            </a>
          }
        </nav>
      </header>

      <!-- Hero Section with Current Exercise Info -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Angular<br>Exercises.
          </h1>
          <p class="hero-subtitle">
            A collection of hands-on Angular exercises.<br>
            Built with modern Angular & retro vibes.
          </p>
        </div>
        <div class="hero-graphic">
          <div class="computer-icon">
            <div class="screen">
              <span class="screen-face">◉‿◉</span>
            </div>
            <div class="keyboard"></div>
          </div>
        </div>
      </section>

      <!-- Quick Links / Tabs -->
      <section class="quick-links-section">
        <h2 class="quick-links-title">Quick links</h2>
        <div class="tabs-container">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="tab.path" routerLinkActive="active" class="tab-card">
              <span class="tab-label">{{ tab.label }}</span>
              <span class="tab-arrow">↗</span>
            </a>
          }
        </div>
      </section>

      <!-- Main Content Area -->
      <main class="main-content">
        <div class="content-window">
          <div class="window-header">
            <div class="window-dots">
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="window-title">exercise-workspace.app</span>
          </div>
          <div class="window-body">
            <router-outlet></router-outlet>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>© 2026 Angular Exercises • Built with Angular 21</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ===== TOP BAR ===== */
    .top-bar {
      background: #000;
      color: #fff;
      padding: 12px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #000;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 16px;
    }

    .logo-icon {
      font-size: 24px;
    }

    .top-nav {
      display: flex;
      gap: 8px;
    }

    .nav-link {
      color: #fff;
      text-decoration: none;
      padding: 8px 16px;
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s ease;
      border: 2px solid transparent;
    }

    .nav-link:hover {
      border-color: #fff;
    }

    .nav-link.active {
      background: #fff;
      color: #000;
    }

    /* ===== HERO SECTION ===== */
    .hero-section {
      background: #fff;
      border-bottom: 3px solid #000;
      padding: 60px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .hero-content {
      flex: 1;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: 72px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 20px;
      letter-spacing: -2px;
    }

    .hero-subtitle {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .hero-graphic {
      flex: 0 0 250px;
      display: flex;
      justify-content: center;
    }

    .computer-icon {
      position: relative;
    }

    .screen {
      width: 150px;
      height: 120px;
      background: #fff;
      border: 4px solid #000;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .screen::before {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      background: #000;
      border-radius: 50%;
    }

    .screen-face {
      font-size: 32px;
      font-weight: bold;
      margin-top: 20px;
    }

    .keyboard {
      width: 180px;
      height: 15px;
      background: #000;
      margin: 8px auto 0;
      border-radius: 0 0 8px 8px;
    }

    /* ===== QUICK LINKS ===== */
    .quick-links-section {
      background: #fff;
      border-bottom: 3px solid #000;
      padding: 40px 30px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .quick-links-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .tabs-container {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .tab-card {
      flex: 1;
      min-width: 180px;
      max-width: 250px;
      padding: 16px 20px;
      background: #fff;
      border: 3px solid #000;
      text-decoration: none;
      color: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-weight: 600;
      font-size: 14px;
      transition: all 0.15s ease;
      box-shadow: 4px 4px 0 #000;
    }

    .tab-card:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0 #000;
    }

    .tab-card.active {
      background: #000;
      color: #fff;
    }

    .tab-arrow {
      font-size: 18px;
      font-weight: bold;
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      flex: 1;
      padding: 40px 30px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .content-window {
      background: #fff;
      border: 3px solid #000;
      box-shadow: 6px 6px 0 #000;
      overflow: hidden;
    }

    .window-header {
      background: #000;
      color: #fff;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
    }

    .window-dots {
      display: flex;
      gap: 6px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;
    }

    .window-title {
      opacity: 0.8;
    }

    .window-body {
      padding: 0;
      min-height: 400px;
    }

    /* ===== FOOTER ===== */
    .app-footer {
      background: #000;
      color: #fff;
      text-align: center;
      padding: 20px;
      font-family: var(--font-mono);
      font-size: 12px;
      border-top: 3px solid #000;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 40px 20px;
      }

      .hero-title {
        font-size: 48px;
      }

      .hero-graphic {
        margin-top: 30px;
      }

      .top-nav {
        display: none;
      }

      .tabs-container {
        flex-direction: column;
      }

      .tab-card {
        max-width: none;
      }
    }
  `]
})
export class AppComponent {
  title = 'Angular Exercises';
  
  // Tab configuration - easy to add new exercises
  tabs: ExerciseTab[] = [
    { path: '/ex13/service-product-image-event', label: 'Ex13 Product', shortLabel: 'Ex13' },
    { path: '/ex14/catalog', label: 'Ex14 Catalog', shortLabel: 'Ex14' },
    { path: '/ex18/customer-grouping', label: 'Ex18 Customers', shortLabel: 'Ex18' },
    { path: '/ex50/books', label: 'Ex50 Books', shortLabel: 'Ex50' }
  ];
}
