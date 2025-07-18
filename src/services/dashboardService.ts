import axiosInstance from '../lib/axios';

export interface DashboardOverviewResponse {
    code: number;
    message: string;
    data: {
        activeUsers: number;
        totalUsers: number;
        activeHours: string;
        conversationLogs: number;
        metadata: {
            period: string;
            groupsIncluded: string[];
        };
    };
}

export interface RecentActivityItem {
    id: number;
    userId: number;
    userName: string;
    activity: string;
    timestamp: string;
    relativeTime: string;
    type: string;
}

export interface RecentActivityResponse {
    code: number;
    message: string;
    data: RecentActivityItem[];
    total: number;
    page: number;
    totalPages: number;
}

export interface TopPerformerItem {
    rank: number;
    userId: number;
    name: string;
    email: string;
    curriculumProgress: number;
    conversationLogs: number;
    level?: string; // Optional field, will be added later by backend
}

export interface TopPerformersResponse {
    code: number;
    message: string;
    data: TopPerformerItem[];
}

export interface ProgressChartItem {
    week: string;
    averageProgress: number;
}

export interface ProgressChartResponse {
    code: number;
    message: string;
    data: ProgressChartItem[];
}

// Filter parameter interfaces
export interface DashboardFilterParams {
    groupIds?: string[];
    startDate?: string;
    endDate?: string;
}

export interface RecentActivityParams {
    page?: number;
    limit?: number;
    groupIds?: number[];
    startDate?: string;
    endDate?: string;
}

export interface TopPerformersParams extends DashboardFilterParams {
    // No additional params needed for now
}

export interface ProgressChartParams extends DashboardFilterParams {
    // No additional params needed for now
}

export const dashboardService = {
    getOverview: async (params: DashboardFilterParams = {}): Promise<DashboardOverviewResponse> => {
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

        const response = await axiosInstance.get<DashboardOverviewResponse>('/client-dashboard/overview', {
            params: queryParams
        });
        return response.data;
    },

    getRecentActivity: async (params: RecentActivityParams = {}): Promise<RecentActivityResponse> => {
        const queryParams = new URLSearchParams();
        
        if (params.page) {
          queryParams.append('page', params.page.toString());
        }
        
        if (params.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        
        if (params.groupIds && params.groupIds.length > 0) {
          params.groupIds.forEach(id => {
            queryParams.append('groupIds[]', id.toString());
          });
        }
        
        if (params.startDate) {
          queryParams.append('startDate', params.startDate);
        }
        
        if (params.endDate) {
          queryParams.append('endDate', params.endDate);
        }

        const response = await axiosInstance.get<RecentActivityResponse>(
          `/client-dashboard/recent-activity?${queryParams}`
        );
        
        return response.data;
    },

    getTopPerformers: async (params: TopPerformersParams = {}): Promise<TopPerformersResponse> => {
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

        const response = await axiosInstance.get<TopPerformersResponse>('/client-dashboard/top-performers', {
            params: queryParams
        });
        return response.data;
    },

    getProgressChart: async (params: ProgressChartParams = {}): Promise<ProgressChartResponse> => {
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

        const response = await axiosInstance.get<ProgressChartResponse>('/client-dashboard/progress-chart', {
            params: queryParams
        });
        return response.data;
    },
};