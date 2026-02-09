import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  bookId: number | null = null;
  loading = false;
  saving = false;

  book: Omit<Book, 'id'> = {
    tensach: '',
    giaban: 0,
    mota: '',
    anhbia: '',
    ngaycapnhat: new Date().toISOString(),
    soluongton: 0,
    macd: 0,
    manxb: 0
  };

  // For image preview
  imagePreview: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = parseInt(id, 10);
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        if (book) {
          this.book = {
            tensach: book.tensach,
            giaban: book.giaban,
            mota: book.mota,
            anhbia: book.anhbia,
            ngaycapnhat: book.ngaycapnhat,
            soluongton: book.soluongton,
            macd: book.macd,
            manxb: book.manxb
          };
          if (book.anhbia) {
            this.imagePreview = `assets/images/books/${book.anhbia}`;
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading book:', err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.book.tensach.trim()) {
      alert('Vui lòng nhập tên sách');
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.bookId) {
      // Update existing book
      this.bookService.updateBook(this.bookId, this.book).subscribe({
        next: (result) => {
          this.saving = false;
          if (result) {
            this.router.navigate(['/ex50/books']);
          } else {
            alert('Không thể cập nhật sách. Vui lòng thử lại.');
          }
        },
        error: (err) => {
          console.error('Error updating book:', err);
          this.saving = false;
          alert('Có lỗi xảy ra khi cập nhật sách.');
        }
      });
    } else {
      // Create new book
      this.book.ngaycapnhat = new Date().toISOString();
      this.bookService.createBook(this.book).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/ex50/books']);
        },
        error: (err) => {
          console.error('Error creating book:', err);
          this.saving = false;
          alert('Có lỗi xảy ra khi tạo sách mới.');
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.book.anhbia = file.name;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.router.navigate(['/ex50/books']);
  }
}
