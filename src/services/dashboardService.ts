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

export const dashboardService = {
    getOverview: async (): Promise<DashboardOverviewResponse> => {
        const response = await axiosInstance.get<DashboardOverviewResponse>('/client-dashboard/overview');
        return response.data;
    },
};