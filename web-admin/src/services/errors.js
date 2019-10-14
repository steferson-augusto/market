export const hasError = (field, errors) => {
    let has = false
    errors.every(err => {
        has = err.field === field
        return !has
    })
    return has
}

export const getError = (field, errors) => {
    let message = ''
    let has = false
    errors.every(err => {
        has = err.field === field
        if (has) message = err.message
        return !has
    })
    return message
}

export const responseToError = response => {
    if (!response) return [{ field: 'general', message: 'Não foi possível comunicar com o servidor' }]
    return response.data.error
}