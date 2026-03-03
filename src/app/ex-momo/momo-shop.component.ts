import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  sizes: string[];
}

interface OrderForm {
  name: string;
  phone: string;
  size: string;
  quantity: number;
}

@Component({
  selector: 'app-momo-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './momo-shop.component.html',
  styleUrl: './momo-shop.component.css'
})
export class MomoShopComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Ultraboost 22',
      brand: 'Adidas',
      price: 3500000,
      originalPrice: 4200000,
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
      description: 'Giày chạy bộ hiệu suất cao với đế Boost™ siêu đàn hồi, ôm sát bàn chân tối ưu.',
      sizes: ['39', '40', '41', '42', '43', '44']
    },
    {
      id: 2,
      name: 'Stan Smith',
      brand: 'Adidas',
      price: 2800000,
      originalPrice: 3200000,
      image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg',
      description: 'Giày sneaker cổ điển biểu tượng với thiết kế trắng sạch, phù hợp mọi phong cách.',
      sizes: ['38', '39', '40', '41', '42', '43']
    }
  ];

  selectedProduct: Product | null = null;
  showModal = false;
  isLoading = false;
  errorMessage = '';

  orderForm: OrderForm = {
    name: '',
    phone: '',
    size: '',
    quantity: 1
  };

  readonly BACKEND_URL = 'http://localhost:3030';

  constructor(private http: HttpClient) {}

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + '₫';
  }

  discountPercent(product: Product): number {
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }

  openCheckout(product: Product): void {
    this.selectedProduct = product;
    this.orderForm = { name: '', phone: '', size: product.sizes[0], quantity: 1 };
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.errorMessage = '';
  }

  get totalPrice(): number {
    return (this.selectedProduct?.price ?? 0) * this.orderForm.quantity;
  }

  isFormValid(): boolean {
    return (
      this.orderForm.name.trim().length >= 2 &&
      /^(0[3|5|7|8|9])+([0-9]{8})$/.test(this.orderForm.phone) &&
      !!this.orderForm.size &&
      this.orderForm.quantity >= 1
    );
  }

  payWithMomo(): void {
    if (!this.isFormValid() || !this.selectedProduct) return;

    this.isLoading = true;
    this.errorMessage = '';

    const orderId = `ADIDAS_${this.selectedProduct.id}_${Date.now()}`;

    const payload = {
      orderId,
      amount: this.totalPrice,
      orderInfo: `[${this.selectedProduct.brand}] ${this.selectedProduct.name} - Size ${this.orderForm.size} x${this.orderForm.quantity}`,
      customerName: this.orderForm.name.trim(),
      customerPhone: this.orderForm.phone.trim(),
      redirectUrl: `${window.location.origin}/ex-momo/result`,
      ipnUrl: `${this.BACKEND_URL}/momo/ipn`
    };

    this.http.post<{ payUrl: string; message: string }>(`${this.BACKEND_URL}/momo/create-payment`, payload)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.payUrl) {
            window.location.href = res.payUrl;
          } else {
            this.errorMessage = res.message || 'Không thể tạo liên kết thanh toán.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 0) {
            this.errorMessage = 'Không kết nối được server. Hãy chạy: node momo-server.js';
          } else {
            this.errorMessage = err.error?.message || 'Lỗi hệ thống, thử lại sau.';
          }
        }
      });
  }
}
