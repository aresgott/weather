export interface responseService {
    hasError: boolean,
    statusCode: number,
    message?: string,
    result?: Array<any>
}