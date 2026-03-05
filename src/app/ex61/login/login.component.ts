import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private loginService = inject(LoginService);

  username = '';
  password = '';
  message  = '';
  success  = false;
  loading  = false;
  loggedIn = false;
  cookieUsername = '';

  ngOnInit(): void {
    // Đọc cookie đã lưu – pre-fill form nếu có
    this.loginService.readCookie().subscribe({
      next: (info) => {
        if (info.username) {
          this.username         = info.username;
          this.password         = info.password;
          this.cookieUsername   = info.username;
          this.loggedIn         = true;
          this.message          = `Cookie khôi phục thông tin đăng nhập: ${info.username}`;
          this.success          = true;
        }
      },
      error: () => {
        // Server chưa chạy hoặc không có cookie – bỏ qua
      }
    });
  }

  onLogin(): void {
    if (!this.username || !this.password) return;

    this.loading = true;
    this.message = '';

    this.loginService.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading        = false;
        this.success        = res.success;
        this.message        = res.message;
        this.loggedIn       = res.success;
        this.cookieUsername = res.success ? (res.username ?? '') : '';
      },
      error: (err) => {
        this.loading  = false;
        this.success  = false;
        this.message  = err.error?.message ?? 'Lỗi kết nối tới server';
        this.loggedIn = false;
      }
    });
  }

  onLogout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        this.username       = '';
        this.password       = '';
        this.message        = 'Đã đăng xuất – cookie đã bị xoá';
        this.success        = false;
        this.loggedIn       = false;
        this.cookieUsername = '';
      }
    });
  }
}
