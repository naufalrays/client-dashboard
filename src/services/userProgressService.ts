import axiosInstance from '../lib/axios';

export interface UserProgressItem {
    id: number;
    name: string;
    email: string;
    group?: string;
    subscription: string;
    level: string;
    referralCode: string;
    logs: number;
    context: string;
    curriculumProgress: number;
    vocabularyProgress: number;
    grammarProgress: number;
    lastActiveTime: string;
}

export interface UserProgressResponse {
    code: number;
    message: string;
    data: UserProgressItem[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ActiveTodayResponse {
    code: number;
    message: string;
    data: {
        count: number;
        percentage: number;
    };
}

export interface UserProgressFilterParams {
    groupIds?: string[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    level?: string;
    subscription?: string;
}

export interface ActiveTodayParams {
    groupIds?: string[];
}

export const userProgressService = {
    getUserProgress: async (params: UserProgressFilterParams = {}): Promise<UserProgressResponse> => {
        const queryParams = new URLSearchParams();

        // Pagination
        queryParams.append('page', (params.page || 1).toString());
        queryParams.append('limit', (params.limit || 10).toString());

        // Filter parameters
        if (params.groupIds && params.groupIds.length > 0) {
            params.groupIds.forEach(groupId => {
                queryParams.append('groupIds', groupId);
            });
        }
        if (params.startDate) {
            queryParams.append('startDate', params.startDate);
        }
        if (params.endDate) {
            queryParams.append('endDate', params.endDate);
        }
        if (params.search) {
            queryParams.append('search', params.search);
        }
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy);
        }
        if (params.sortOrder) {
            queryParams.append('sortOrder', params.sortOrder);
        }
        if (params.level) {
            queryParams.append('level', params.level);
        }
        if (params.subscription) {
            queryParams.append('subscription', params.subscription);
        }

        const response = await axiosInstance.get<UserProgressResponse>('/client-dashboard/user-progress', {
            params: queryParams
        });
        return response.data;
    },

    getActiveToday: async (params: ActiveTodayParams = {}): Promise<ActiveTodayResponse> => {
        const queryParams = new URLSearchParams();

        if (params.groupIds && params.groupIds.length > 0) {
            params.groupIds.forEach(groupId => {
                queryParams.append('groupIds', groupId);
            });
        }

        const response = await axiosInstance.get<ActiveTodayResponse>('/client-dashboard/user-progress/active-today', {
            params: queryParams
        });
        return response.data;
    },
};