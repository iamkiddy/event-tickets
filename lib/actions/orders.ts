'use server';

import { ApiError } from "next/dist/server/api-utils";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import { TicketDiscountRequest, TicketDiscountResponse, TicketCheckoutRequest, TicketCheckoutResponse, MomoPayForm, MomoResponse, CheckoutDetailResponse, MomoConfirmResponse } from "../models/_orders_models";
import { cookies } from 'next/headers';


// apply coupon
export const getTicketsDiscount = async (request: TicketDiscountRequest): Promise<TicketDiscountResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        const response = await apiController<TicketDiscountResponse>({
            method: 'POST',
            url: APIUrls.applyDiscount,
            data: { coupon: request.coupon },
            token,
            contentType: 'application/json',
        });

        return response;
    } catch (error) {
        console.error('Error applying ticket discount:', error);
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to apply discount";
        throw new Error(errorMessage);
    }
};

// check 
export const initCheckout = async (request: TicketCheckoutRequest): Promise<TicketCheckoutResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        const response = await apiController<TicketCheckoutResponse>({
            method: 'POST',
            url: APIUrls.initCheckout,
            data: request,
            token,
            contentType: 'application/json',
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
};


// get checkout details
export const getCheckoutDetails = async (orderCode: string): Promise<CheckoutDetailResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        const response = await apiController<CheckoutDetailResponse>({
            method: 'GET',
            url: `${APIUrls.getCheckoutDetails}${orderCode}`,
            token,
            contentType: 'application/json',
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to get checkout details";
        throw new Error(errorMessage);
    }
};


// init payment with reference
export const paymentInit = async (orderCode: string, reference: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        await apiController({
            method: 'POST',
            url: APIUrls.paymentInit,
            data: { orderCode, reference },
            token,
            contentType: 'application/json',
        });
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to init payment";
        throw new Error(errorMessage);
    }
};


// init momo pay
export const momoPayInit = async (form: MomoPayForm) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", process.env.NEXT_PUBLIC_PAYMENT_KEY || '');

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(form),
      };

    try{
        const response = await fetch(APIUrls.initMomoPay, requestOptions);
        const responseData = await response.json();
        return responseData as MomoResponse;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
}



// momo pay verification
export const momoPayOTPVerify = async (reference: string, otp: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", process.env.NEXT_PUBLIC_PAYMENT_KEY || '');

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({reference, otp}),
      };

    try{
        const response = await fetch(APIUrls.momoOTPCode, requestOptions);
        const responseData = await response.json();
        return responseData as MomoResponse;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
}


// confirm momo payment
export const confirmMomoPay = async (reference: string) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("api-key", process.env.NEXT_PUBLIC_PAYMENT_KEY || '');

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

    try{
        const response = await fetch(APIUrls.confirmMomoPayment+reference, requestOptions);
        const responseData = await response.json();
        return responseData as MomoConfirmResponse;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
}