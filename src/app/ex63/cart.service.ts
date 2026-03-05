import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  ratingCount: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface CartUpdate {
  productId: string;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private api  = 'http://localhost:3005/ex63';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`, { withCredentials: true });
  }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.api}/cart`, { withCredentials: true });
  }

  addToCart(productId: string): Observable<{ message: string; cart: CartItem[] }> {
    return this.http.post<{ message: string; cart: CartItem[] }>(
      `${this.api}/cart/add`, { productId }, { withCredentials: true }
    );
  }

  updateCart(updates: CartUpdate[]): Observable<{ message: string; cart: CartItem[] }> {
    return this.http.put<{ message: string; cart: CartItem[] }>(
      `${this.api}/cart/update`, updates, { withCredentials: true }
    );
  }

  removeItem(productId: string): Observable<{ message: string; cart: CartItem[] }> {
    return this.http.delete<{ message: string; cart: CartItem[] }>(
      `${this.api}/cart/remove/${productId}`, { withCredentials: true }
    );
  }

  clearCart(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.api}/cart/clear`, { withCredentials: true }
    );
  }
}
