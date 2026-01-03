
export interface APIError {
    "status": string,
    "status_code": number,
    "error": {
        "code": string,
        "message": string,
        "details": string,
        "timestamp": string,
        "path": string,
        "suggestion": string,
    },
    "request_id": string,
    "documentation_url": string,
}