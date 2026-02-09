import { Injectable } from '@angular/core';

export interface Product {
  ProductId: string;
  ProductName: string;
  Price: number;
  Image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsImage: Product[] = [
    { ProductId: 'p1', ProductName: 'Coca', Price: 100, Image: 'assets/images/h1.png' },
    { ProductId: 'p2', ProductName: 'Pepsi', Price: 300, Image: 'assets/images/h2.png' },
    { ProductId: 'p3', ProductName: 'Sting', Price: 200, Image: 'assets/images/h3.png' }
  ];

  getProductsWithImages(): Product[] {
    return this.productsImage;
  }

  getProductDetail(id: string): Product | undefined {
    return this.productsImage.find(p => p.ProductId === id);
  }
}
