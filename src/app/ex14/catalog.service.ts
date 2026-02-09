import { Injectable } from '@angular/core';

export interface Product {
  ProductId: string;
  ProductName: string;
  Price: number;
  Image: string;
}

export interface Category {
  Cateid: string;
  CateName: string;
  Products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private datas: Category[] = [
    {
      Cateid: 'cate1',
      CateName: 'Nước ngọt',
      Products: [
        {
          ProductId: 'p1',
          ProductName: 'Coca Cola',
          Price: 100,
          Image: 'assets/images/h1.png',
        },
        {
          ProductId: 'p2',
          ProductName: 'Pepsi',
          Price: 300,
          Image: 'assets/images/h2.png',
        },
        {
          ProductId: 'p3',
          ProductName: 'Sting Dâu',
          Price: 200,
          Image: 'assets/images/h3.png',
        },
      ],
    },
    {
      Cateid: 'cate2',
      CateName: 'Bia',
      Products: [
        {
          ProductId: 'p4',
          ProductName: 'Heineken',
          Price: 500,
          Image: 'assets/images/h1.png',
        },
        {
          ProductId: 'p5',
          ProductName: 'Bia 333',
          Price: 400,
          Image: 'assets/images/h2.png',
        },
        {
          ProductId: 'p6',
          ProductName: 'Bia Sài Gòn',
          Price: 600,
          Image: 'assets/images/h3.png',
        },
      ],
    },
  ];

  getCategories(): Category[] {
    return this.datas;
  }
}
