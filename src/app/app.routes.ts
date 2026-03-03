import { Routes } from '@angular/router';
import { CustomerGroupingComponent } from './customer-grouping/customer-grouping.component';
import { ServiceProductImageEventComponent } from './ex13/service-product-image-event/service-product-image-event.component';
import { ServiceProductImageEventDetailComponent } from './ex13/service-product-image-event-detail/service-product-image-event-detail.component';
import { Ex14CatalogComponent } from './ex14/ex14-catalog/ex14-catalog.component';
import { BookListComponent } from './ex50/book-list/book-list.component';
import { BookFormComponent } from './ex50/book-form/book-form.component';
import { BookDetailsComponent } from './ex50/book-details/book-details.component';
import { MomoShopComponent } from './ex-momo/momo-shop.component';
import { MomoResultComponent } from './ex-momo/momo-result.component';

export const routes: Routes = [
  // Ex-Momo - Adidas Shop with MoMo Payment
  { path: 'ex-momo', component: MomoShopComponent },
  { path: 'ex-momo/result', component: MomoResultComponent },

  // Ex18 - Customer Grouping (default route)
  { path: '', redirectTo: '/ex18/customer-grouping', pathMatch: 'full' },
  { path: 'ex18/customer-grouping', component: CustomerGroupingComponent },
  
  // Ex13 - Product Service with Images and Events
  { path: 'ex13/service-product-image-event', component: ServiceProductImageEventComponent },
  { path: 'ex13/service-product-image-event/:id', component: ServiceProductImageEventDetailComponent },
  
  // Ex14 - Catalog Service
  { path: 'ex14/catalog', component: Ex14CatalogComponent },

  // Ex50 - Book Management (RESTful API)
  { path: 'ex50/books', component: BookListComponent },
  { path: 'ex50/books/create', component: BookFormComponent },
  { path: 'ex50/books/edit/:id', component: BookFormComponent },
  { path: 'ex50/books/details/:id', component: BookDetailsComponent }
];
