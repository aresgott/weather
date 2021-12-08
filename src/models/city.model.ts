export interface City {
    id: string,
    name: string
}

export interface Cities {
    hasError: boolean,
    count: number,
    message?: string,
    result?: Array<City>
}