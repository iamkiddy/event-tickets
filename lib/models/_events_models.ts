export interface Event {
    id: string;
    title: string;
    image: string;
    startDate: string;
    startTime: string;
    soldOut: number;
    totalGross: number;
    status: 'published' | 'draft';
}

export interface AllEventsResponse {
    page: number;
    total: number;
    limit: number;
    data: Event[];
}

export interface GetEventsParams {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
}