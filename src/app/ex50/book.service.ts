import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Book {
  id: number;
  tensach: string;      // Book name
  giaban: number;       // Price
  mota: string;         // Description
  anhbia: string;       // Cover image
  ngaycapnhat: string;  // Update date
  soluongton: number;   // Quantity in stock
  macd: number;         // CD code
  manxb: number;        // Publisher code
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'assets/data/books.json';
  
  // In-memory storage for CRUD operations (simulating a backend)
  private booksSubject = new BehaviorSubject<Book[]>([]);
  private booksLoaded = false;
  private nextId = 6; // Start from 6 since we have 5 initial books

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (!this.booksLoaded) {
      this.http.get<Book[]>(this.apiUrl).subscribe({
        next: (books) => {
          this.booksSubject.next(books);
          this.booksLoaded = true;
          // Calculate next ID based on existing data
          const maxId = Math.max(...books.map(b => b.id), 0);
          this.nextId = maxId + 1;
        },
        error: (err) => {
          console.error('Error loading books:', err);
          this.booksSubject.next([]);
        }
      });
    }
  }

  // GET all books
  getBooks(): Observable<Book[]> {
    if (!this.booksLoaded) {
      return this.http.get<Book[]>(this.apiUrl).pipe(
        tap(books => {
          this.booksSubject.next(books);
          this.booksLoaded = true;
          const maxId = Math.max(...books.map(b => b.id), 0);
          this.nextId = maxId + 1;
        })
      );
    }
    return this.booksSubject.asObservable();
  }

  // GET book by ID
  getBookById(id: number): Observable<Book | undefined> {
    return this.booksSubject.pipe(
      map(books => books.find(book => book.id === id))
    );
  }

  // POST - Create new book
  createBook(book: Omit<Book, 'id'>): Observable<Book> {
    const newBook: Book = {
      ...book,
      id: this.nextId++
    };
    
    const currentBooks = this.booksSubject.value;
    this.booksSubject.next([...currentBooks, newBook]);
    
    return of(newBook);
  }

  // PUT - Update book
  updateBook(id: number, book: Partial<Book>): Observable<Book | undefined> {
    const currentBooks = this.booksSubject.value;
    const index = currentBooks.findIndex(b => b.id === id);
    
    if (index !== -1) {
      const updatedBook = { ...currentBooks[index], ...book, id };
      const updatedBooks = [...currentBooks];
      updatedBooks[index] = updatedBook;
      this.booksSubject.next(updatedBooks);
      return of(updatedBook);
    }
    
    return of(undefined);
  }

  // DELETE - Remove book
  deleteBook(id: number): Observable<boolean> {
    const currentBooks = this.booksSubject.value;
    const filteredBooks = currentBooks.filter(book => book.id !== id);
    
    if (filteredBooks.length < currentBooks.length) {
      this.booksSubject.next(filteredBooks);
      return of(true);
    }
    
    return of(false);
  }
}
