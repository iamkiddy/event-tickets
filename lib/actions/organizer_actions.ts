"use server"

import { cookies } from "next/headers"
import APIUrls from "../apiurls";
import apiController from "../apiController";
import { OrgProfileDetailModel, OrgProfileViewModel } from "../models/_org_models";
import { ApiError } from "next/dist/server/api-utils";
import { ResponseModel } from "../models/_util_models";


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


// create a new profile
export const createOrgProfile = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value;

    try {
        const response = await apiController<ResponseModel>({
            method: 'POST',
            url: APIUrls.createOrgProfile,
            token,
            data: formData,
            contentType: 'multipart/form-data',
        });

        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}



// get a profile by id
export const getOrgProfileById = async (id: string) => {
    const token = (await cookies()).get('token')?.value;

    try {
        const response = await apiController<OrgProfileDetailModel>({
            method: 'GET',
            url: `${APIUrls.getOrgProfileById}${id}`,
            token,
        });

        return response;
    } catch (error: unknown) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An unexpected error occurred";
        throw new Error(errorMessage);
    }
}