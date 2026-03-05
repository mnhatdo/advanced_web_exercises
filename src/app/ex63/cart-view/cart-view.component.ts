import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem, CartUpdate } from '../cart.service';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart-view.component.html',
  styleUrl:    './cart-view.component.css'
})
export class CartViewComponent implements OnInit {
  private cartService = inject(CartService);

  cart:    CartItem[] = [];
  loading  = true;
  message  = '';
  // working copy of qty per product
  qtys: { [id: string]: number | undefined } = {};
  // checked state for removal
  checked: { [id: string]: boolean | undefined } = {};

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cart    = items;
        this.loading = false;
        this.qtys    = {};
        this.checked = {};
        items.forEach(item => {
          this.qtys[item.product._id]    = item.qty;
          this.checked[item.product._id] = false;
        });
      },
      error: () => { this.loading = false; }
    });
  }

  updateCart(): void {
    const updates: CartUpdate[] = this.cart.map(item => ({
      productId: item.product._id,
      qty: this.qtys[item.product._id] ?? item.qty
    }));
    // Remove checked items
    this.cart.forEach(item => {
      if (this.checked[item.product._id]) {
        const u = updates.find(u => u.productId === item.product._id);
        if (u) u.qty = 0;
      }
    });
    this.cartService.updateCart(updates).subscribe({
      next: (res) => {
        this.message = 'Cart updated successfully!';
        this.cart = res.cart;
        this.qtys    = {};
        this.checked = {};
        res.cart.forEach(item => {
          this.qtys[item.product._id]    = item.qty;
          this.checked[item.product._id] = false;
        });
        setTimeout(() => this.message = '', 2500);
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: (res) => {
        this.cart = res.cart;
        delete this.qtys[productId];
        delete this.checked[productId];
      }
    });
  }

  get subtotal(): number {
    return this.cart.reduce((s, i) => s + i.product.price * (this.qtys[i.product._id] ?? i.qty), 0);
  }

  formatPrice(p: number): string { return '$' + p.toFixed(2); }
}
