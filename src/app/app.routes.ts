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
import { LoginComponent } from './ex61/login/login.component';
import { ProductListComponent } from './ex63/product-list/product-list.component';
import { CartViewComponent } from './ex63/cart-view/cart-view.component';
import { FashionAdminListComponent } from './ex58/admin/fashion-admin-list/fashion-admin-list.component';
import { FashionAdminFormComponent } from './ex58/admin/fashion-admin-form/fashion-admin-form.component';
import { FashionAdminDetailComponent } from './ex58/admin/fashion-admin-detail/fashion-admin-detail.component';
import { FashionClientListComponent } from './ex58/client/fashion-client-list/fashion-client-list.component';
import { FashionClientDetailComponent } from './ex58/client/fashion-client-detail/fashion-client-detail.component';

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
  { path: 'ex50/books/details/:id', component: BookDetailsComponent },

  // Ex61 - Cookies: Save Login Information
  { path: 'ex61/login', component: LoginComponent },

  // Ex63 - Session: Shopping Cart
  { path: 'ex63/products', component: ProductListComponent },
  { path: 'ex63/cart',     component: CartViewComponent },

  // Ex58 - Fashion Website Admin (admin-fashion module, port 4001)
  { path: 'ex58/admin',              component: FashionAdminListComponent },
  { path: 'ex58/admin/create',       component: FashionAdminFormComponent },
  { path: 'ex58/admin/edit/:id',     component: FashionAdminFormComponent },
  { path: 'ex58/admin/detail/:id',   component: FashionAdminDetailComponent },

  // Ex58 - Fashion Website Client (client-fashion module, port 4002)
  { path: 'ex58/client',             component: FashionClientListComponent },
  { path: 'ex58/client/:id',         component: FashionClientDetailComponent }
];
