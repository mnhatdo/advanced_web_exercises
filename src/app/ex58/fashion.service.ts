import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Fashion {
  _id: string;
  title: string;
  details: string;
  thumbnail: string;
  style: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FashionService {
  private http = inject(HttpClient);
  private base = 'http://localhost:4000/api/fashions';

  getAll(): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(this.base);
  }

  getByStyle(style: string): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(`${this.base}/style/${encodeURIComponent(style)}`);
  }

  getById(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`${this.base}/${id}`);
  }

  create(data: Partial<Fashion>): Observable<Fashion> {
    return this.http.post<Fashion>(this.base, data);
  }

  update(id: string, data: Partial<Fashion>): Observable<Fashion> {
    return this.http.put<Fashion>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
