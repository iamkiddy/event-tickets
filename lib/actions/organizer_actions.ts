"use server"

import { cookies } from "next/headers"
import APIUrls from "../apiurls";
import apiController from "../apiController";
import { OrgProfileViewModel } from "../models/_org_models";
import { ApiError } from "next/dist/server/api-utils";


// get all profiles
export const getAllOrgProfiles = async () => {
    const token = (await cookies()).get('token')?.value;

    try {
        const response = await apiController<OrgProfileViewModel[]>({
            method: 'GET',
            url: APIUrls.getOrgProfiles,
            token,
        });

        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }

}