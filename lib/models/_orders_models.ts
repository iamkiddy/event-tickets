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
    totalPrice: number;
}

// momo form pay
export interface MomoPayForm {
    amount:       number;
    email:        string;
    currency:     string;
    mobile_money: MobileMoney;
}

export interface MobileMoney {
    phone:    string;
    provider: string;
}


// momo response
export interface MomoResponse {
    status:  boolean;
    message: string;
    data:    MomoResponseData;
}

export interface MomoResponseData {
    reference:    string;
    status:       string;
    display_text: string;
}
