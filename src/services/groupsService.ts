import axiosInstance from '../lib/axios';


export interface GroupUser {
    id: number;
    name: string;
    email: string;
    level?: string;
    referral?: string;
}

export interface Group {
    id: number;
    name: string;
    description: string;
    users: GroupUser[];
}

export interface GroupsResponse {
    code: number;
    message: string;
    data: Group[];
}

export interface CreateGroupRequest {
    groups: Array<{
        name: string;
        description?: string;
        userIds: number[];
    }>;
}

export interface CreateGroupResponse {
    code: number;
    message: string;
    data: Array<{
        id: number;
        name: string;
        description: string;
        clientReferralId: string | null;
        createdAt: string;
        updatedAt: string;
        clientReferral: any;
        users: Array<{
            user: {
                id: number;
                name: string | null;
                email: string;
                user_referral: string | null;
            };
        }>;
    }>;
}

export interface AvailableUser {
    id: number;
    name: string | null;
    email: string;
    userReferral: string | null;
}

export interface AvailableUsersResponse {
    code: number;
    message: string;
    data: AvailableUser[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AvailableUsersParams {
    page?: number;
    limit?: number;
    search?: string;
}


export const groupsService = {
    // Get all groups
    getGroups: async (): Promise<GroupsResponse> => {
        const response = await axiosInstance.get<GroupsResponse>('/client-dashboard/groups');
        return response.data;
    },

    // Create new group - Updated to match API specification
    createGroup: async (groupData: CreateGroupRequest): Promise<CreateGroupResponse> => {
        const response = await axiosInstance.post<CreateGroupResponse>('/client-dashboard/groups', groupData);
        return response.data;
    },

    // Get group by ID
    getGroupById: async (id: number): Promise<{ code: number; message: string; data: Group }> => {
        const response = await axiosInstance.get(`/client-dashboard/groups/${id}`);
        return response.data;
    },

    // Update group
    updateGroup: async (id: number, groupData: Partial<CreateGroupRequest>): Promise<CreateGroupResponse> => {
        const response = await axiosInstance.put<CreateGroupResponse>(`/client-dashboard/groups/${id}`, groupData);
        return response.data;
    },

    // Delete group
    deleteGroup: async (id: number): Promise<{ code: number; message: string }> => {
        const response = await axiosInstance.delete(`/client-dashboard/groups/${id}`);
        return response.data;
    },

    // Validate emails
    validateEmails: async (emails: string[]): Promise<any> => {
        try {
            const response = await axiosInstance.post('/admin/notification/users/validate-emails', { emails });
            return response.data;
        } catch (error) {
            console.error('Email validation error:', error);
            throw error;
        }
    },

    // Get available users with pagination and search
    getAvailableUsers: async (params: AvailableUsersParams = {}): Promise<AvailableUsersResponse> => {
        const queryParams = new URLSearchParams();

        if (params.page) {
            queryParams.append('page', params.page.toString());
        }

        if (params.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        if (params.search) {
            queryParams.append('search', params.search);
        }

        const response = await axiosInstance.get<AvailableUsersResponse>(
            `/client-dashboard/users/available?${queryParams}`
        );

        return response.data;
    },
};