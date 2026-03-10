import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FashionService, Fashion } from '../../fashion.service';

@Component({
  selector: 'app-fashion-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-wrapper">
      <a routerLink="/ex58/client" class="btn-back">← Back to Fashions</a>

      @if (loading) {
        <div class="loading">Loading…</div>
      } @else if (fashion) {
        <article class="fashion-article">
          <header class="article-header">
            <span class="style-tag">{{ fashion.style }}</span>
            <h1 class="article-title">{{ fashion.title }}</h1>
            <p class="article-date">{{ fashion.createdAt | date:'MMMM d, y' }}</p>
          </header>

          <figure class="article-figure">
            <img [src]="fashion.thumbnail || 'https://placehold.co/800x500?text=No+Image'"
                 [alt]="fashion.title" class="article-image" />
          </figure>

          <div class="article-body" [innerHTML]="safeDetails"></div>
        </article>
      } @else {
        <div class="error-msg">Fashion not found.</div>
      }
    </div>
  `,
  styles: [`
    .detail-wrapper { padding: 32px; max-width: 860px; margin: 0 auto; font-family: 'Georgia', serif; }
    .btn-back { display: inline-block; margin-bottom: 24px; padding: 8px 18px; border: 2px solid #000; text-decoration: none; font-family: 'Arial', sans-serif; font-weight: 700; font-size: 13px; background: #fff; color: #000; }
    .btn-back:hover { background: #000; color: #fff; }
    .loading { padding: 40px; text-align: center; }
    .article-header { margin-bottom: 20px; }
    .style-tag { display: inline-block; background: #000; color: #fff; padding: 3px 12px; font-family: 'Arial', sans-serif; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
    .article-title { font-size: 28px; font-weight: 900; margin: 0 0 8px; line-height: 1.3; }
    .article-date { font-size: 13px; color: #777; font-family: 'Arial', sans-serif; font-style: italic; }
    .article-figure { margin: 0 0 28px; }
    .article-image { width: 100%; max-height: 500px; object-fit: cover; border: 1px solid #ddd; }
    .article-body { font-size: 16px; line-height: 1.85; color: #222; }
    .article-body p { margin-bottom: 16px; }
    .error-msg { padding: 16px; background: #fdd; border: 2px solid #f00; color: #900; }
  `]
})
export class FashionClientDetailComponent implements OnInit {
  private svc       = inject(FashionService);
  private route     = inject(ActivatedRoute);
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
