'use server';

import apiController from "../apiController";
import APIUrls from "../apiurls";
import { cookies } from 'next/headers';
import {GetAllBlogsResponse} from "../models/_blogs_models";
import { ApiError } from 'next/dist/server/api-utils';


export const getAllBlogs = async ():Promise<GetAllBlogsResponse> => {
    try

}

