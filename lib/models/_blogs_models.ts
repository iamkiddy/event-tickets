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

export interface GetBlogByIdResponse {
    id: string;
    image: string;
    title: string;
    content: string;
    author: string;
    date: string;
    totalViews: number;
    categories: string[];
    tags: string[];
    comments: number;
    totalLikes: number;
    userHasLiked: boolean;
}

export interface GetBlogCommentsResponse {
    page: number;
    total: number;
    limit: number;
    data: {
        id: string;
        user: string;
        content: string;
        date: string;
    }[];
}

export interface AddBlogCommentRequest {
    content: string;
}

export interface AddBlogCommentResponse {
    id: string;
    user: string;
    content: string;
    date: string;
}

export interface LikeBlogResponse {
    success: boolean;
}