
// response model
export interface ResponseModel {
    message: string;
    error?: string;
}


// event types models
export interface EventTypesModel {
    id:   string;
    name: string;
}


// category model
export interface CategoryModel {
    id:            string;
    icon:          string;
    name:          string;
    subCategories: string[];
}


// banner model
export interface BannerModel {
    id:    string;
    image: string;
    title: string;
}


// faq model
export interface FAQModel {
    question: string;
    answer:   string;
}