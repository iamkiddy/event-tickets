export interface TicketDiscountResponse {
    id: string;
    discountType: 'amount' | 'percentage';
    discountAmount: number;
}

export interface TicketDiscountRequest {
    coupon: string;
}

export interface TicketItem {
    ticket: string;
    quantity: number;
}

export interface TicketCheckoutRequest {
    event: string;
    tickets: TicketItem[];
    coupon?: string;
}

export interface TicketCheckoutResponse {
    message: string;
    orderCode: string;
}