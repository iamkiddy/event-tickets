'use server';

import { ApiError } from "next/dist/server/api-utils";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import { TicketDiscountRequest, TicketDiscountResponse, TicketCheckoutRequest, TicketCheckoutResponse, MomoPayForm, MomoResponse } from "../models/_orders_models";
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
export const getTicketsCheckout = async (request: TicketCheckoutRequest): Promise<TicketCheckoutResponse> => {
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


// init momo pay
export const momoPayInit = async (form: MomoPayForm) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Authentication required');

    try{
        const response = await apiController<MomoResponse>({
            method: 'POST',
            url: APIUrls.initMomoPay,
            data: form,
            token,
            contentType: 'application/json',
        });

        return response;
    } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
}