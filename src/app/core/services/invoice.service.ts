import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';

/** Invoice interface */
export interface Invoice {
  id: string;
  stripe_invoice_id: string;
  number: string | null;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  subtotal: number;
  total: number;
  tax: number;
  currency: string;
  description: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  due_date: string | null;
  paid_at: string | null;
  period_start: string | null;
  period_end: string | null;
  line_items: InvoiceLineItem[];
  created_at: string;
  formatted: {
    total: string;
    amount_paid: string;
    amount_due: string;
  };
  subscription: {
    id: string;
    product_name: string;
    status: string;
  } | null;
  user: {
    name: string;
    email: string;
  };
}

/** Invoice line item */
export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity: number;
}

/** Invoice statistics */
export interface InvoiceStatistics {
  total_invoices: number;
  paid_invoices: number;
  open_invoices: number;
  total_paid_amount: number;
  pending_amount: number;
}

/** Invoice print data */
export interface InvoicePrintData {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  paid_date: string | null;
  status: string;
  customer: {
    name: string;
    email: string;
  };
  billing_period: {
    start: string | null;
    end: string | null;
  };
  line_items: InvoiceLineItem[];
  subtotal: string;
  tax: string;
  total: string;
  amount_paid: string;
  amount_due: string;
  currency: string;
  subscription: {
    product_name: string;
    description: string | null;
  } | null;
  company: {
    name: string;
    address: string;
    email: string;
  };
}

/** Paginated response meta */
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/** Paginated invoices response */
export interface PaginatedInvoicesResponse {
  data: Invoice[];
  meta: PaginationMeta;
}

/**
 * Centralized Invoice Management Service
 */
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrlService = inject(ApiUrlService);

  /** Get all invoices with pagination and filters */
  getInvoices(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    subscription_id?: string;
    from_date?: string;
    to_date?: string;
  }): Observable<ApiResponse<Invoice[]> & { meta?: PaginationMeta }> {
    let url = this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.LIST);
    
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.subscription_id) queryParams.append('subscription_id', params.subscription_id);
      if (params.from_date) queryParams.append('from_date', params.from_date);
      if (params.to_date) queryParams.append('to_date', params.to_date);
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += '?' + queryString;
      }
    }
    
    return this.http.get<ApiResponse<Invoice[]> & { meta?: PaginationMeta }>(url);
  }

  /** Get invoice statistics */
  getStatistics(): Observable<ApiResponse<InvoiceStatistics>> {
    return this.http.get<ApiResponse<InvoiceStatistics>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.STATISTICS)
    );
  }

  /** Sync invoices from Stripe */
  syncFromStripe(): Observable<ApiResponse<{ synced_count: number }>> {
    return this.http.post<ApiResponse<{ synced_count: number }>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.SYNC),
      {}
    );
  }

  /** Get single invoice */
  getInvoice(invoiceId: string): Observable<ApiResponse<Invoice>> {
    return this.http.get<ApiResponse<Invoice>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.GET(invoiceId))
    );
  }

  /** Get invoice PDF download URL */
  downloadPdf(invoiceId: string): Observable<ApiResponse<{ pdf_url: string; filename: string }>> {
    return this.http.get<ApiResponse<{ pdf_url: string; filename: string }>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.DOWNLOAD(invoiceId))
    );
  }

  /** Get Stripe hosted invoice URL */
  viewOnStripe(invoiceId: string): Observable<ApiResponse<{ hosted_url: string }>> {
    return this.http.get<ApiResponse<{ hosted_url: string }>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.VIEW_ON_STRIPE(invoiceId))
    );
  }

  /** Get invoice print data */
  getPrintData(invoiceId: string): Observable<ApiResponse<InvoicePrintData>> {
    return this.http.get<ApiResponse<InvoicePrintData>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.PRINT(invoiceId))
    );
  }

  /** Resend invoice email */
  resendEmail(invoiceId: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.INVOICES.RESEND_EMAIL(invoiceId)),
      {}
    );
  }
}
