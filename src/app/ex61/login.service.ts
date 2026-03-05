import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  username?: string;
}

export interface CookieInfo {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3003/ex61';

  /** POST /ex61/login – Đăng nhập, server sẽ set cookie nếu thành công */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    });
  }

  /** GET /ex61/read-cookie – Đọc cookie đã lưu để pre-fill form */
  readCookie(): Observable<CookieInfo> {
    return this.http.get<CookieInfo>(`${this.apiUrl}/read-cookie`, {
      withCredentials: true
    });
  }

  /** POST /ex61/logout – Xoá cookie đăng nhập */
  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }
}
