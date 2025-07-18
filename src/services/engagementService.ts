import axiosInstance from '../lib/axios';

export interface LearningContextItem {
    count: number;
    percentage: number;
    users: number;
}

export interface LearningContextResponse {
    code: number;
    message: string;
    data: {
        learning: LearningContextItem;
        fun: LearningContextItem;
        unknown: LearningContextItem;
    };
    metadata: {
        total_logs: number;
        total_users: number;
        last_updated: string;
    };
}

export interface TopLogUser {
    id: number;
    name: string;
    email: string;
    level: string;
    log_count: number;
    rank: number;
}

export interface TopLogUsersResponse {
    code: number;
    message: string;
    data: {
        users: TopLogUser[];
        total_users: number;
        category_filter: string;
    };
    metadata: {
        last_updated: string;
    };
}

export interface TopLessonUser {
    id: number;
    name: string;
    email: string;
    level: string;
    total_activities: number;
    vocab_activities: number;
    grammar_activities: number;
    rank: number;
}

export interface TopLessonUsersResponse {
    code: number;
    message: string;
    data: {
        users: TopLessonUser[];
        total_users: number;
    };
    metadata: {
        last_updated: string;
    };
}

export interface PopularContentItem {
    id: number;
    title: string;
    title_en: string;
    title_id: string;
    views: number;
    rank: number;
}

export interface PopularContentResponse {
    code: number;
    message: string;
    data: {
        content: PopularContentItem[];
        total_content: number;
    };
    metadata: {
        last_updated: string;
    };
}

export interface UsageDistributionResponse {
    code: number;
    message: string;
    data: {
        learning_journey: {
            percentage: number;
            log_count: number;
            users: number;
        };
        ask_anything: {
            percentage: number;
            log_count: number;
            users: number;
        };
    };
    metadata: {
        total_logs: number;
        total_users: number;
        last_updated: string;
    };
}

// Filter parameter interfaces - Updated to support global filters
export interface EngagementFilterParams {
    groupIds?: string[];
    startDate?: string;
    endDate?: string;
}

export interface TopLogUsersParams extends EngagementFilterParams {
    category?: 'ALL' | 'LEARNING' | 'FUN' | 'UNKNOWN';
    limit?: number;
}

export interface TopLessonUsersParams extends EngagementFilterParams {
    limit?: number;
}

export interface PopularContentParams extends EngagementFilterParams {
    limit?: number;
}

export const engagementService = {
    getLearningContext: async (params: EngagementFilterParams = {}): Promise<LearningContextResponse> => {
        const queryParams = new URLSearchParams();

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

        const response = await axiosInstance.get<LearningContextResponse>('/client-dashboard/engagement/learning-context', {
            params: queryParams
        });
        return response.data;
    },

    getTopLogUsers: async (params: TopLogUsersParams = {}): Promise<TopLogUsersResponse> => {
        const queryParams = new URLSearchParams();

        // Default parameters
        queryParams.append('category', params.category || 'ALL');
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

        const response = await axiosInstance.get<TopLogUsersResponse>('/client-dashboard/engagement/top-log-users', {
            params: queryParams
        });
        return response.data;
    },

    getTopLessonUsers: async (params: TopLessonUsersParams = {}): Promise<TopLessonUsersResponse> => {
        const queryParams = new URLSearchParams();

        // Default parameters
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

        const response = await axiosInstance.get<TopLessonUsersResponse>('/client-dashboard/engagement/top-lesson-users', {
            params: queryParams
        });
        return response.data;
    },

    getPopularContent: async (params: PopularContentParams = {}): Promise<PopularContentResponse> => {
        const queryParams = new URLSearchParams();

        // Default parameters
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

        const response = await axiosInstance.get<PopularContentResponse>('/client-dashboard/engagement/popular-content', {
            params: queryParams
        });
        return response.data;
    },

    getUsageDistribution: async (params: EngagementFilterParams = {}): Promise<UsageDistributionResponse> => {
        const queryParams = new URLSearchParams();

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

        const response = await axiosInstance.get<UsageDistributionResponse>('/client-dashboard/engagement/usage-distribution', {
            params: queryParams
        });
        return response.data;
    },
};