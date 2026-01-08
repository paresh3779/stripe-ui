import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService, Invoice, InvoiceStatistics, InvoicePrintData } from '../../../../core/services/invoice.service';
import { NotificationService } from '../../../../core/services/notification.service';

/**
 * Centralized Invoice Management Page
 * Features: List, Filter, View, Download PDF, Print, View on Stripe
 */
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  private readonly invoiceService = inject(InvoiceService);
  private readonly notificationService = inject(NotificationService);

  // State
  invoices = signal<Invoice[]>([]);
  statistics = signal<InvoiceStatistics | null>(null);
  selectedInvoice = signal<Invoice | null>(null);
  printData = signal<InvoicePrintData | null>(null);
  loading = signal(false);
  loadingStats = signal(false);
  syncing = signal(false);
  sendingEmail = signal<string | null>(null);

  // Pagination
  currentPage = signal(1);
  totalPages = signal(1);
  perPage = signal(10);
  totalInvoices = signal(0);

  // Filters
  statusFilter = signal<string>('');
  fromDate = signal<string>('');
  toDate = signal<string>('');

  // View state
  viewMode = signal<'list' | 'detail' | 'print'>('list');

  // Computed
  hasInvoices = computed(() => this.invoices().length > 0);
  hasStatistics = computed(() => this.statistics() !== null);
  
  formattedTotalPaid = computed(() => {
    const stats = this.statistics();
    if (!stats) return '$0.00';
    return this.formatAmount(stats.total_paid_amount, 'usd');
  });

  formattedPendingAmount = computed(() => {
    const stats = this.statistics();
    if (!stats) return '$0.00';
    return this.formatAmount(stats.pending_amount, 'usd');
  });

  ngOnInit(): void {
    this.loadInvoices();
    this.loadStatistics();
  }

  /** Load invoices with filters */
  loadInvoices(): void {
    this.loading.set(true);
    
    const params: any = {
      page: this.currentPage(),
      per_page: this.perPage()
    };

    if (this.statusFilter()) {
      params.status = this.statusFilter();
    }
    if (this.fromDate()) {
      params.from_date = this.fromDate();
    }
    if (this.toDate()) {
      params.to_date = this.toDate();
    }

    this.invoiceService.getInvoices(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.invoices.set(response.data);
          if (response.meta) {
            this.currentPage.set(response.meta.current_page);
            this.totalPages.set(response.meta.last_page);
            this.totalInvoices.set(response.meta.total);
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to load invoices');
        this.loading.set(false);
      }
    });
  }

  /** Load invoice statistics */
  loadStatistics(): void {
    this.loadingStats.set(true);
    this.invoiceService.getStatistics().subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics.set(response.data);
        }
        this.loadingStats.set(false);
      },
      error: () => {
        this.loadingStats.set(false);
      }
    });
  }

  /** Sync invoices from Stripe */
  syncFromStripe(): void {
    this.syncing.set(true);
    this.invoiceService.syncFromStripe().subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success(`Synced ${response.data.synced_count} invoices from Stripe`);
          this.loadInvoices();
          this.loadStatistics();
        }
        this.syncing.set(false);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to sync invoices');
        this.syncing.set(false);
      }
    });
  }

  /** Apply filters */
  applyFilters(): void {
    this.currentPage.set(1);
    this.loadInvoices();
  }

  /** Clear filters */
  clearFilters(): void {
    this.statusFilter.set('');
    this.fromDate.set('');
    this.toDate.set('');
    this.currentPage.set(1);
    this.loadInvoices();
  }

  /** Go to page */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadInvoices();
    }
  }

  /** View invoice detail */
  viewInvoice(invoice: Invoice): void {
    this.selectedInvoice.set(invoice);
    this.viewMode.set('detail');
  }

  /** Back to list */
  backToList(): void {
    this.selectedInvoice.set(null);
    this.printData.set(null);
    this.viewMode.set('list');
  }

  /** Download invoice PDF */
  downloadPdf(invoice: Invoice): void {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, '_blank');
      return;
    }

    this.invoiceService.downloadPdf(invoice.id).subscribe({
      next: (response) => {
        if (response.success && response.data.pdf_url) {
          window.open(response.data.pdf_url, '_blank');
        }
      },
      error: () => {
        this.notificationService.error('Failed to download PDF');
      }
    });
  }

  /** View invoice on Stripe */
  viewOnStripe(invoice: Invoice): void {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
      return;
    }

    this.invoiceService.viewOnStripe(invoice.id).subscribe({
      next: (response) => {
        if (response.success && response.data.hosted_url) {
          window.open(response.data.hosted_url, '_blank');
        }
      },
      error: () => {
        this.notificationService.error('Stripe invoice page not available');
      }
    });
  }

  /** Print invoice */
  printInvoice(invoice: Invoice): void {
    this.selectedInvoice.set(invoice);
    this.viewMode.set('print');
    
    this.invoiceService.getPrintData(invoice.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.printData.set(response.data);
          // Trigger print after a short delay
          setTimeout(() => window.print(), 500);
        }
      },
      error: () => {
        this.notificationService.error('Failed to load print data');
        this.viewMode.set('list');
      }
    });
  }

  /** Resend invoice email */
  resendEmail(invoice: Invoice): void {
    this.sendingEmail.set(invoice.id);
    this.invoiceService.resendEmail(invoice.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Invoice email sent successfully');
        }
        this.sendingEmail.set(null);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to send email');
        this.sendingEmail.set(null);
      }
    });
  }

  /** Check if sending email for invoice */
  isSendingEmail(invoiceId: string): boolean {
    return this.sendingEmail() === invoiceId;
  }

  /** Format amount */
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  /** Format date */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /** Get status badge class */
  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'paid': 'bg-success',
      'open': 'bg-warning',
      'draft': 'bg-secondary',
      'void': 'bg-dark',
      'uncollectible': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  }

  /** Get page numbers for pagination */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
