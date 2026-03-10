import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FashionService, Fashion } from '../../fashion.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-fashion-admin-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-header">
        <a routerLink="/ex58/admin" class="btn-back">← Back to List</a>
        <h2>{{ isEdit ? 'Edit' : 'Add New' }} Fashion</h2>
      </div>

      @if (loading) {
        <div class="loading">Loading…</div>
      } @else {
        <form (ngSubmit)="onSubmit()" #frm="ngForm" class="fashion-form">
          <div class="form-group">
            <label for="title">Title *</label>
            <input id="title" name="title" [(ngModel)]="model.title" required class="form-input" placeholder="Fashion title" />
          </div>

          <div class="form-group">
            <label for="style">Style *</label>
            <input id="style" name="style" [(ngModel)]="model.style" required class="form-input" placeholder="e.g. Street Style, Trends, Runway" list="style-suggestions" />
            <datalist id="style-suggestions">
              <option value="Street Style"></option>
              <option value="Trends"></option>
              <option value="Runway"></option>
            </datalist>
          </div>

          <div class="form-group">
            <label for="thumbnail">Thumbnail URL</label>
            <input id="thumbnail" name="thumbnail" [(ngModel)]="model.thumbnail" class="form-input" placeholder="https://…" />
            @if (model.thumbnail) {
              <img [src]="model.thumbnail" alt="preview" class="thumb-preview" />
            }
          </div>

          <div class="form-group">
            <label for="details">Details (HTML / WYSIWYG)</label>
            <div class="wysiwyg-toolbar">
              <button type="button" (click)="insertTag('b')" title="Bold"><b>B</b></button>
              <button type="button" (click)="insertTag('i')" title="Italic"><i>I</i></button>
              <button type="button" (click)="insertTag('u')" title="Underline"><u>U</u></button>
              <button type="button" (click)="insertTag('h2')" title="Heading">H2</button>
              <button type="button" (click)="insertTag('h3')" title="Heading 3">H3</button>
              <button type="button" (click)="insertTag('p')" title="Paragraph">P</button>
              <button type="button" (click)="insertTag('ul')" title="List">UL</button>
              <button type="button" (click)="togglePreview()" class="btn-preview">
                {{ showPreview ? 'Edit HTML' : 'Preview' }}
              </button>
            </div>

            @if (!showPreview) {
              <textarea
                id="details"
                name="details"
                [(ngModel)]="model.details"
                rows="10"
                class="form-textarea"
                placeholder="Enter HTML content or use toolbar buttons above…"
                #detailsArea>
              </textarea>
            } @else {
              <div class="html-preview" [innerHTML]="safeHtml"></div>
            }
          </div>

          @if (errorMsg) {
            <div class="error-msg">{{ errorMsg }}</div>
          }
          @if (successMsg) {
            <div class="success-msg">{{ successMsg }}</div>
          }

          <div class="form-actions">
            <button type="submit" [disabled]="frm.invalid || saving" class="btn-save">
              {{ saving ? 'Saving…' : 'Save' }}
            </button>
            <a routerLink="/ex58/admin" class="btn-cancel">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .form-container { padding: 24px; max-width: 800px; font-family: var(--font-mono, monospace); }
    .form-header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
    .form-header h2 { margin: 0; }
    .btn-back { background: #fff; color: #000; padding: 8px 16px; text-decoration: none; border: 2px solid #000; font-weight: 700; }
    .btn-back:hover { background: #000; color: #fff; }
    .loading { padding: 20px; }
    .fashion-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-weight: 700; font-size: 13px; text-transform: uppercase; }
    .form-input { padding: 10px 12px; border: 2px solid #000; font-family: inherit; font-size: 14px; outline: none; }
    .form-input:focus { border-color: #007bff; }
    .thumb-preview { margin-top: 8px; width: 160px; height: 120px; object-fit: cover; border: 2px solid #000; }
    .wysiwyg-toolbar { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
    .wysiwyg-toolbar button { padding: 4px 10px; border: 2px solid #000; background: #fff; cursor: pointer; font-family: inherit; font-size: 12px; font-weight: 700; }
    .wysiwyg-toolbar button:hover { background: #000; color: #fff; }
    .btn-preview { background: #ffe500 !important; color: #000 !important; }
    .form-textarea { padding: 10px; border: 2px solid #000; font-family: 'Courier New', monospace; font-size: 13px; resize: vertical; min-height: 200px; }
    .html-preview { padding: 16px; border: 2px dashed #999; min-height: 200px; background: #fff; line-height: 1.6; }
    .form-actions { display: flex; gap: 12px; padding-top: 8px; }
    .btn-save { background: #000; color: #fff; padding: 12px 32px; border: 2px solid #000; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; }
    .btn-save:hover { background: #333; }
    .btn-save:disabled { background: #999; border-color: #999; cursor: not-allowed; }
    .btn-cancel { background: #fff; color: #000; padding: 12px 24px; text-decoration: none; border: 2px solid #000; font-weight: 700; display: inline-block; }
    .btn-cancel:hover { background: #000; color: #fff; }
    .error-msg { padding: 12px; background: #fdd; border: 2px solid #f00; color: #900; }
    .success-msg { padding: 12px; background: #dfd; border: 2px solid #0a0; color: #060; }
  `]
})
export class FashionAdminFormComponent implements OnInit {
  private svc      = inject(FashionService);
  private router   = inject(Router);
  private route    = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  model: Partial<Fashion> = { title: '', style: '', thumbnail: '', details: '' };
  isEdit    = false;
  loading   = false;
  saving    = false;
  showPreview = false;
  errorMsg  = '';
  successMsg = '';

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.model.details ?? '');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.svc.getById(id).subscribe({
        next: (f) => { this.model = { ...f }; this.loading = false; },
        error: () => { this.errorMsg = 'Could not load fashion.'; this.loading = false; }
      });
    }
  }

  insertTag(tag: string): void {
    const text = this.model.details ?? '';
    this.model.details = text + `<${tag}></${tag}>`;
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  onSubmit(): void {
    this.saving = true;
    this.errorMsg = '';
    const payload = {
      title:     this.model.title,
      details:   this.model.details,
      thumbnail: this.model.thumbnail,
      style:     this.model.style
    };

    const op = this.isEdit
      ? this.svc.update(this.model._id!, payload)
      : this.svc.create(payload);

    op.subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Saved successfully! Redirecting…';
        setTimeout(() => this.router.navigate(['/ex58/admin']), 1000);
      },
      error: () => {
        this.saving = false;
        this.errorMsg = 'Save failed. Please check the server.';
      }
    });
  }
}
