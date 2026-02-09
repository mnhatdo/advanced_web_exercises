import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-service-product-image-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-product-image-event.component.html',
  styleUrls: ['./service-product-image-event.component.css']
})
export class ServiceProductImageEventComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProductsWithImages();
  }

  viewDetail(productId: string): void {
    this.router.navigate(['/ex13/service-product-image-event', productId]);
  }
}
