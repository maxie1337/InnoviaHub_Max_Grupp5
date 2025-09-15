export type ApiResult<T> = {
    success: boolean;
    data?: T;
    message?: string;
};
