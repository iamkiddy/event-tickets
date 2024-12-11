export interface GetAllBlogsResponse {
    page: number;
    total: number;
    limit: number;
    data: {
        id: string;
        image: string;
        title: string;
        summary: string;
        author: string;
        date: string;
    }[];
}
