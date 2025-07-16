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

export const dashboardService = {
    getOverview: async (): Promise<DashboardOverviewResponse> => {
        const response = await axiosInstance.get<DashboardOverviewResponse>('/client-dashboard/overview');
        return response.data;
    },

    getRecentActivity: async (page: number = 1, limit: number = 10): Promise<RecentActivityResponse> => {
        const response = await axiosInstance.get<RecentActivityResponse>('/client-dashboard/recent-activity', {
            params: { page }
        });
        return response.data;
    },

    getTopPerformers: async (): Promise<TopPerformersResponse> => {
        const response = await axiosInstance.get<TopPerformersResponse>('/client-dashboard/top-performers');
        return response.data;
    },

    getProgressChart: async (): Promise<ProgressChartResponse> => {
        const response = await axiosInstance.get<ProgressChartResponse>('/client-dashboard/progress-chart');
        return response.data;
    },
};