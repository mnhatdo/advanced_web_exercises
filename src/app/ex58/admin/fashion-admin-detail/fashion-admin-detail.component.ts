import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FashionService, Fashion } from '../../fashion.service';

@Component({
  selector: 'app-fashion-admin-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <div class="detail-header">
        <a routerLink="/ex58/admin" class="btn-back">← Back to List</a>
        @if (fashion) {
          <a [routerLink]="['/ex58/admin/edit', fashion._id]" class="btn-edit">Edit</a>
        }
      </div>

      @if (loading) {
        <div class="loading">Loading…</div>
      } @else if (fashion) {
        <div class="fashion-detail">
          <img [src]="fashion.thumbnail || 'https://placehold.co/600x400?text=No+Image'"
               [alt]="fashion.title" class="detail-thumb" />
          <div class="detail-meta">
            <span class="badge">{{ fashion.style }}</span>
            <span class="date">{{ fashion.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <h1 class="detail-title">{{ fashion.title }}</h1>
          <div class="detail-content" [innerHTML]="safeDetails"></div>
        </div>
      } @else {
        <div class="error-msg">Fashion not found.</div>
      }
    </div>
  `,
  styles: [`
    .detail-container { padding: 24px; max-width: 800px; font-family: var(--font-mono, monospace); }
    .detail-header { display: flex; gap: 12px; margin-bottom: 24px; }
    .btn-back, .btn-edit { padding: 8px 16px; text-decoration: none; border: 2px solid #000; font-weight: 700; }
    .btn-back { background: #fff; color: #000; }
    .btn-back:hover { background: #000; color: #fff; }
    .btn-edit { background: #ffe500; color: #000; }
    .btn-edit:hover { background: #000; color: #fff; }
    .loading { padding: 20px; }
    .detail-thumb { width: 100%; max-height: 400px; object-fit: cover; border: 3px solid #000; margin-bottom: 16px; }
    .detail-meta { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
    .badge { background: #000; color: #fff; padding: 3px 10px; font-size: 12px; font-weight: 700; }
    .date { font-size: 13px; color: #666; }
    .detail-title { font-size: 26px; font-weight: 900; margin: 0 0 20px; border-bottom: 3px solid #000; padding-bottom: 12px; }
    .detail-content { line-height: 1.8; font-size: 15px; }
    .error-msg { padding: 12px; background: #fdd; border: 2px solid #f00; color: #900; }
  `]
})
export class FashionAdminDetailComponent implements OnInit {
  private svc      = inject(FashionService);
  private route    = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  fashion?: Fashion;
  loading = true;

  get safeDetails(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.fashion?.details ?? '');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getById(id).subscribe({
      next: (f) => { this.fashion = f; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
