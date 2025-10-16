import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  totalPages: number = 1;
  pages: number[] = [];
  perPageOptions: number[] = [5, 10, 20, 50];

  ngOnChanges(): void {
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    if (this.currentPage > this.totalPages) {
      this.changePage(this.totalPages || 1);
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  changeItemsPerPage(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.itemsPerPage = value;
    this.itemsPerPageChange.emit(value);
    this.calculatePagination();
    this.changePage(1); // On revient à la page 1 après un changement
  }
}
