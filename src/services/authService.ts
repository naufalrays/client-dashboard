import Cookies from 'js-cookie';
import axiosInstance from '../lib/axios';
import type { AuthResponse, LoginRequest } from '../types/auth';

const COOKIE_NAME = 'auth_token';

export const authService = {
    // Login function
    login: async ({ email: email, password }: LoginRequest): Promise<string> => {
        try {
            const response = await axiosInstance.post<AuthResponse>('/admin/auth/login', {
                email: email,
                password,
            });

            const { data } = response.data;
            const { accessToken } = data;

            // Simpan token di cookie dengan opsi keamanan
            Cookies.set(COOKIE_NAME, accessToken, {
                expires: 7, // 7 hari
                // secure: process.env.NODE_ENV === 'production', // HTTPS only di production
                sameSite: 'strict',
                path: '/',
            });

            return accessToken;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    // Logout function
    logout: async (): Promise<void> => {
        try {
            // Optional: call logout endpoint
            // await axiosInstance.post('/auth/logout');
        } catch (error) {
            // Tetap lanjutkan logout meskipun API error
            console.error('Logout API error:', error);
        } finally {
            // Hapus token dari cookie
            Cookies.remove(COOKIE_NAME);
        }
    },

    // Get token from cookie
    getToken: (): string | undefined => {
        return Cookies.get(COOKIE_NAME);
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = Cookies.get(COOKIE_NAME);
        return !!token;
    },
};