import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, Category } from '../catalog.service';

@Component({
  selector: 'app-ex14-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ex14-catalog.component.html',
  styleUrls: ['./ex14-catalog.component.css']
})
export class Ex14CatalogComponent implements OnInit {
  categories: Category[] = [];

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.categories = this.catalogService.getCategories();
  }
}
