export interface TicketDiscountResponse {
    id: string;
    discountType: 'amount' | 'percentage';
    discountAmount: number;
}

export interface TicketDiscountRequest {
    coupon: string;
}