import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-momo-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="retro-container">
      <div class="result-window retro-card">

        <div class="window-titlebar">
          <div class="window-dots">
            <span class="window-dot"></span>
            <span class="window-dot"></span>
          </div>
          <span>payment.result</span>
        </div>

        <div class="result-body">
          <div class="status-badge" [class.status-ok]="isSuccess" [class.status-err]="!isSuccess">
            {{ isSuccess ? 'OK' : 'FAIL' }}
          </div>
          <h2 class="result-title">{{ isSuccess ? 'Thanh toan thanh cong' : 'Thanh toan that bai' }}</h2>
          <p *ngIf="isSuccess" class="result-msg">
            Don hang <strong>{{ orderId }}</strong> da duoc ghi nhan va dang xu ly.
          </p>
          <p *ngIf="!isSuccess" class="result-msg">
            Giao dich khong thanh cong hoac bi huy. Ma loi: {{ resultCode }}
          </p>
          <a routerLink="/ex-momo" class="retro-btn retro-btn-primary">Quay lai cua hang</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .retro-container { max-width: 1400px; margin: 0 auto; padding: 40px 30px; }
    .result-window { max-width: 420px; margin: 0 auto; overflow: hidden; }
    .result-body { padding: 32px 28px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .status-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 3px; padding: 6px 18px; border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
    .status-ok  { background: #000; color: #fff; }
    .status-err { background: #fff; color: #000; }
    .result-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
    .result-msg { font-size: 14px; color: #555; margin: 0; line-height: 1.6; }
  `]
})
export class MomoResultComponent implements OnInit {
  isSuccess = false;
  orderId = '';
  resultCode = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resultCode = params['resultCode'] ?? params['errorCode'] ?? '99';
      this.orderId = params['orderId'] ?? '';
      this.isSuccess = this.resultCode === '0';
    });
  }
}
