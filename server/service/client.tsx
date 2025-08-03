import axios from 'axios';
import { AppUtils } from '../utils/AppUtils';

// Tạo instance của axios
const ApiClient = axios.create({
    // baseURL: window.location.origin,
    baseURL: AppUtils.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout sau 10 giây
});

// Request Interceptor (Thêm token vào header)
// ApiClient.interceptors.request.use(
//     (config) => {
//         if(config.url === '/api/auth/login') return config;
//         const token = localStorage.getItem('accessToken');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         console.log('Request sent:', config);
//         return config;
//     },
//     (error) => {
//         console.error('Request error:', error);
//         return Promise.reject(error);
//     }
// );

// Response Interceptor (Xử lý lỗi chung)
ApiClient.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        let errorMessage = 'Unknown error';
        if (error.response) {
            const { status } = error.response;
            if (status === 400) {
                console.error('Bad request - Dữ liệu không hợp lệ');
            } else if (status === 401) {
                console.error('Unauthorized - Chuyển hướng đến trang đăng nhập');
                localStorage.removeItem('accessToken');
                window.location.href = '/admin/login';
            } else if (status === 403) {
                errorMessage = 'Forbidden - Không có quyền truy cập';
            } else if (status === 404) {
                errorMessage = 'Not found - Không tìm thấy';
            } else if (status >= 500) {
                errorMessage = 'Server error - Lỗi server, vui lòng thử lại sau';
            }
        } else if (error.request) {
            errorMessage = 'Không có phản hồi từ server';
        } else {
            errorMessage = 'Lỗi không xác định:' + error.message;
        }
        console.log(errorMessage);
        return Promise.reject({...error, message: errorMessage});
    }
);

export default ApiClient;