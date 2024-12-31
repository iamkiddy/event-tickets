export interface TicketDiscountResponse {
    message: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    isValid: boolean;
}

export interface TicketDiscountRequest {
    coupon: string;
}