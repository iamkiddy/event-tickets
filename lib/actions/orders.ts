'use server';

import { ApiError } from "next/dist/server/api-utils";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import { TicketDiscountRequest, TicketDiscountResponse, TicketCheckoutRequest, TicketCheckoutResponse } from "../models/_orders_models";
import { cookies } from 'next/headers';

export const getTicketsDiscount = async (request: TicketDiscountRequest): Promise<TicketDiscountResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        const response = await apiController<TicketDiscountResponse>({
            method: 'POST',
            url: APIUrls.getTicketsDiscount,
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

export const getTicketsCheckout = async (request: TicketCheckoutRequest): Promise<TicketCheckoutResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Authentication required');

        const response = await apiController<TicketCheckoutResponse>({
            method: 'POST',
            url: APIUrls.getTicketsCheckout,
            data: request,
            token,
            contentType: 'application/json',
        });

        return response;
    } catch (error) {
        console.error('Error checking out tickets:', error);
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "Failed to check out tickets";
        throw new Error(errorMessage);
    }
};