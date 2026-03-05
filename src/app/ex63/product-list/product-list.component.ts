import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, Product } from '../cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl:    './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private cartService = inject(CartService);

  products: Product[] = [];
  loading   = true;
  cartCount = 0;
  feedback: { [id: string]: string | undefined } = {};

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.cartService.getProducts().subscribe({
      next: (p) => { this.products = p; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
    this.cartService.getCart().subscribe({
      next: (cart) => { this.cartCount = cart.reduce((s, i) => s + i.qty, 0); },
      error: ()    => {}
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product._id).subscribe({
      next: (res) => {
        this.cartCount = res.cart.reduce((s, i) => s + i.qty, 0);
        this.feedback[product._id] = '✓ Added';
        setTimeout(() => delete this.feedback[product._id], 1500);
      },
      error: () => { this.feedback[product._id] = 'Error!'; }
    });
  }

  stars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  formatPrice(p: number): string {
    return '$' + p.toFixed(2);
  }
}
