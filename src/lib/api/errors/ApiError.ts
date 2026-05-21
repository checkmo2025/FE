export class ApiError extends Error {
    code: string;
    response?: any;

    constructor(message: string, code: string = "UNKNOWN_ERROR", response?: any) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.response = response;
    }
}

export interface ErrorWithCode {
    code: string;
    message?: string;
}

export function hasErrorCode(error: unknown): error is ErrorWithCode {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as Record<string, unknown>).code === "string"
    );
}
