export interface Errors {
    message: string
    field: string
    validation?: string
}

export const hasError = (field: string = 'general', errors: Array<Errors> = []): boolean => {
    let has = false
    errors.every(err => {
        has = err.field == field
        return !has
    })
    return has
}

export const getError = (field: string = 'general', errors: Array<Errors> = []): string => {
    let message = '-'
    let has = false
    errors.every(err => {
        has = err.field == field
        if (has) message = err.message
        return !has
    })
    return message
}

export const responseToError = (response): Array<Errors> => {
    if (!response) return [{ field: 'general', message: 'Não foi possível comunicar com o servidor' }]
    return response.data.error
}