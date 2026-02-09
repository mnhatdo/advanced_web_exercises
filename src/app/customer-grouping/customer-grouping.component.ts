import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Customer {
  Id: string;
  Name: string;
  Email: string;
  Age: number;
  Image: string;
}

interface CustomerGroup {
  CustomerTypeId: number;
  CustomterTypeName: string;
  Customers: Customer[];
}

@Component({
  selector: 'app-customer-grouping',
  imports: [CommonModule],
  templateUrl: './customer-grouping.component.html',
  styleUrls: ['./customer-grouping.component.css']
})
export class CustomerGroupingComponent implements OnInit {
  customerGroups: CustomerGroup[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<CustomerGroup[]>('assets/data/customers.json')
      .subscribe({
        next: (data) => {
          this.customerGroups = data;
          this.loading = false;
          console.log('Customer data loaded successfully:', data);
        },
        error: (err) => {
          this.error = 'Failed to load customer data';
          this.loading = false;
          console.error('Error loading customer data:', err);
        }
      });
  }
}
