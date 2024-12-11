export interface GetEventTypeUtilsResponse {
    id: string;
    name: string;
}

export interface GetCategoryUtilsResponse {
    id: string;
    icon: string;
    name: string;
    subCategories: string[];
}

export interface GetBannerUtilsResponse {
    id: string;
    image: string;
    title: string;
}

export interface GetFaqUtilsResponse {
    question: string;
    answer: string;
}