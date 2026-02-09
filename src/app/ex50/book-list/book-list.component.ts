import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  
  books: Book[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.loading = false;
      }
    });
  }

  deleteBook(id: number, tensach: string): void {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${tensach}"?`)) {
      this.bookService.deleteBook(id).subscribe({
        next: (success) => {
          if (success) {
            this.loadBooks();
          } else {
            alert('Không thể xóa sách. Vui lòng thử lại.');
          }
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          alert('Có lỗi xảy ra khi xóa sách.');
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
