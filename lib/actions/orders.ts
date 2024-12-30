'use server';

import { ApiError } from "next/dist/server/api-utils";
import apiController from "../apiController";
import APIUrls from "../apiurls";
import { TicketDiscountRequest, TicketDiscountResponse } from "../models/_orders_models";

export const getTicketsDiscount = async (request: TicketDiscountRequest): Promise<TicketDiscountResponse> => {
    try {
        const response = await apiController<TicketDiscountResponse>({
            method: 'POST',
            url: APIUrls.getTicketsDiscount,
            data: { coupon: request.coupon },
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