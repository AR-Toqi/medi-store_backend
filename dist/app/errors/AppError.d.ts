declare class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string | undefined, stack?: string);
}
export default AppError;
//# sourceMappingURL=AppError.d.ts.map