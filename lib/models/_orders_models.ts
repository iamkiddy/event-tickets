export interface TicketDiscountResponse {
    id: string;
    discountType: 'amount' | 'percentage';
    discountAmount: number;
}


export interface TicketDiscountRequest {
    event: string;
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


// checkout details
export interface CheckoutDetailResponse {
    email:        string;
    tickets:      CheckoutTicket[];
    total:        number;
    subtotal:     number;
    paymentTotal: number;
    currency:     string;
    coupon?:      number;
    couponType?:  string;
}

export interface CheckoutTicket {
    ticketName: string;
    quantity:   number;
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


// momo confirm response
export interface MomoConfirmResponse {
    status:  boolean;
    message: string;
    data:    MomoConfirmResponseData;
}

export interface MomoConfirmResponseData {
    status:       string;
    message:      string;
}


// all orders response
export interface AllOrdersResponse {
    page: number;
    total: number;
    limit: number;
    data: OrderData[];
}

export interface OrderData {
    id: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    orderCode: string;
    totalPrice: number;
    numberOfTickets: number;
}