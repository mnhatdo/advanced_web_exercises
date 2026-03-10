import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FashionService, Fashion } from '../../fashion.service';

@Component({
  selector: 'app-fashion-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="client-container">
      <!-- Search Bar -->
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
               placeholder='TRY "STREET STYLE"' class="search-input" />
        <button (click)="onSearch()" class="btn-search">SEARCH</button>
      </div>

      <!-- Style filter dropdown -->
      <div class="filter-bar">
        <label>Filter by Style:</label>
        <select [(ngModel)]="selectedStyle" (ngModelChange)="onStyleChange()" class="style-select">
          <option value="">All Styles</option>
          @for (s of allStyles; track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
      </div>

      @if (loading) {
        <div class="loading">Loading fashions…</div>
      } @else if (errorMsg) {
        <div class="error-msg">{{ errorMsg }}</div>
      } @else {
        <!-- Group by style -->
        @for (styleGroup of groupedFashions; track styleGroup.style) {
          <section class="style-section">
            <h2 class="style-heading">{{ styleGroup.style }}</h2>
            <div class="fashion-grid">
              @for (f of styleGroup.items; track f._id) {
                <a [routerLink]="['/ex58/client', f._id]" class="fashion-card">
                  <div class="card-thumb-wrapper">
                    <img [src]="f.thumbnail || 'https://placehold.co/300x200?text=No+Image'"
                         [alt]="f.title" class="card-thumb" />
                    <div class="card-overlay">
                      <span class="overlay-icon">⊙</span>
                    </div>
                  </div>
                  <p class="card-title">{{ f.title }}</p>
                </a>
              }
            </div>
          </section>
        }

        @if (groupedFashions.length === 0) {
          <div class="empty-msg">No fashions match your search.</div>
        }
      }
    </div>
  `,
  styles: [`
    .client-container { padding: 24px; font-family: 'Georgia', serif; max-width: 1100px; margin: 0 auto; }
    .search-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; border: 2px solid #222; padding: 6px 12px; }
    .search-icon { font-size: 16px; color: #666; }
    .search-input { flex: 1; border: none; outline: none; font-size: 14px; font-style: italic; color: #555; letter-spacing: 1px; font-family: inherit; }
    .btn-search { background: #000; color: #fff; border: none; padding: 8px 20px; font-weight: 700; font-size: 12px; letter-spacing: 1px; cursor: pointer; font-family: 'Arial', sans-serif; }
    .btn-search:hover { background: #333; }
    .filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
    .filter-bar label { font-weight: 700; font-size: 13px; text-transform: uppercase; font-family: 'Arial', sans-serif; }
    .style-select { padding: 8px 12px; border: 2px solid #000; font-family: inherit; font-size: 14px; cursor: pointer; }
    .loading { padding: 40px; text-align: center; }
    .error-msg { padding: 20px; background: #fdd; border: 2px solid #f00; color: #900; }
    .empty-msg { padding: 40px; text-align: center; color: #666; }
    .style-section { margin-bottom: 48px; }
    .style-heading { text-align: center; font-size: 18px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; font-family: 'Arial', sans-serif; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; margin-bottom: 20px; }
    .fashion-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    @media(max-width:900px) { .fashion-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width:500px) { .fashion-grid { grid-template-columns: 1fr; } }
    .fashion-card { text-decoration: none; color: inherit; display: block; }
    .fashion-card:hover .card-overlay { opacity: 1; }
    .card-thumb-wrapper { position: relative; overflow: hidden; }
    .card-thumb { width: 100%; height: 200px; object-fit: cover; display: block; }
    .card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .25s; }
    .overlay-icon { background: rgba(255,255,255,.9); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .card-title { margin: 8px 0 0; font-size: 13px; font-weight: 700; line-height: 1.4; font-family: 'Arial', sans-serif; }
  `]
})
export class FashionClientListComponent implements OnInit {
  private svc = inject(FashionService);

  allFashions: Fashion[] = [];
  displayedFashions: Fashion[] = [];
  allStyles: string[] = [];
  groupedFashions: { style: string; items: Fashion[] }[] = [];

  loading = true;
  errorMsg = '';
  searchQuery = '';
  selectedStyle = '';

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: (data: Fashion[]) => {
        this.allFashions = data;
        this.allStyles = [...new Set(data.map((f: Fashion) => f.style))];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Cannot connect to server. Please start: node server/ex58-server.js';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.selectedStyle = '';
    this.applyFilter();
  }

  onStyleChange(): void {
    this.searchQuery = '';
    this.applyFilter();
  }

  applyFilter(): void {
    let items = [...this.allFashions];

    if (this.selectedStyle) {
      items = items.filter(f => f.style === this.selectedStyle);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(f =>
        f.title.toLowerCase().includes(q) ||
        f.style.toLowerCase().includes(q)
      );
    }

    this.displayedFashions = items;
    this.buildGroups();
  }

  buildGroups(): void {
    const map = new Map<string, Fashion[]>();
    for (const f of this.displayedFashions) {
      if (!map.has(f.style)) map.set(f.style, []);
      map.get(f.style)!.push(f);
    }
    this.groupedFashions = Array.from(map.entries()).map(([style, items]) => ({ style, items }));
  }
}
