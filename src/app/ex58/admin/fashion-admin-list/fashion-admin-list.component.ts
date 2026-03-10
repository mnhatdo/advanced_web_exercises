import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FashionService, Fashion } from '../../fashion.service';

@Component({
  selector: 'app-fashion-admin-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h2>Fashion Admin</h2>
        <a routerLink="/ex58/admin/create" class="btn-add">+ Add Fashion</a>
      </div>

      @if (loading) {
        <div class="loading">Loading fashions…</div>
      } @else if (fashions.length === 0) {
        <div class="empty">No fashions found. Make sure the server is running on port 4000.</div>
      } @else {
        <table class="fashion-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Style</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (f of fashions; track f._id) {
              <tr>
                <td class="thumb-cell">
                  <img [src]="f.thumbnail || 'https://placehold.co/80x60?text=No+Img'" [alt]="f.title" class="thumb" />
                </td>
                <td class="title-cell">{{ f.title }}</td>
                <td><span class="badge">{{ f.style }}</span></td>
                <td>{{ f.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="actions-cell">
                  <a [routerLink]="['/ex58/admin/detail', f._id]" class="btn-view">View</a>
                  <a [routerLink]="['/ex58/admin/edit', f._id]" class="btn-edit">Edit</a>
                  <button (click)="deleteFashion(f)" class="btn-delete">Delete</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }

      @if (errorMsg) {
        <div class="error-msg">{{ errorMsg }}</div>
      }
    </div>
  `,
  styles: [`
    .admin-container { padding: 24px; font-family: var(--font-mono, monospace); }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .admin-header h2 { margin: 0; font-size: 22px; }
    .btn-add { background: #000; color: #fff; padding: 10px 20px; text-decoration: none; font-weight: 700; border: 2px solid #000; }
    .btn-add:hover { background: #fff; color: #000; }
    .loading, .empty { padding: 20px; border: 2px solid #ccc; text-align: center; }
    .fashion-table { width: 100%; border-collapse: collapse; }
    .fashion-table th { background: #000; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
    .fashion-table td { padding: 10px 12px; border-bottom: 2px solid #eee; vertical-align: middle; }
    .fashion-table tr:hover td { background: #f9f9f9; }
    .thumb { width: 80px; height: 60px; object-fit: cover; border: 2px solid #000; }
    .thumb-cell { width: 100px; }
    .title-cell { max-width: 300px; font-weight: 600; }
    .badge { background: #000; color: #fff; padding: 2px 8px; font-size: 11px; font-weight: 700; }
    .actions-cell { white-space: nowrap; }
    .btn-view, .btn-edit, .btn-delete { padding: 5px 12px; font-size: 12px; font-weight: 700; border: 2px solid #000; cursor: pointer; margin-right: 4px; text-decoration: none; display: inline-block; font-family: inherit; }
    .btn-view { background: #fff; color: #000; }
    .btn-edit { background: #ffe500; color: #000; }
    .btn-delete { background: #ff3e3e; color: #fff; border-color: #ff3e3e; }
    .btn-view:hover { background: #000; color: #fff; }
    .btn-edit:hover { background: #000; color: #fff; }
    .btn-delete:hover { background: #c00; border-color: #c00; }
    .error-msg { margin-top: 16px; padding: 12px; background: #fdd; border: 2px solid #f00; color: #900; }
  `]
})
export class FashionAdminListComponent implements OnInit {
  private svc = inject(FashionService);

  fashions: Fashion[] = [];
  loading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (data) => { this.fashions = data; this.loading = false; },
      error: () => { this.errorMsg = 'Cannot connect to server. Please start: node server/ex58-server.js'; this.loading = false; }
    });
  }

  deleteFashion(f: Fashion): void {
    if (!confirm(`Delete "${f.title}"?\nThis cannot be undone.`)) return;
    this.svc.delete(f._id).subscribe({
      next: () => this.fashions = this.fashions.filter(x => x._id !== f._id),
      error: () => this.errorMsg = 'Delete failed.'
    });
  }
}
