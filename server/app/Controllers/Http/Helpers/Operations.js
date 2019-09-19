const operators = {
    'equal': (columnName, value) => [columnName, '=', value],
    'notEqual': (columnName, value) => [columnName, '<>', value],
    'greaterThan': (columnName, value) => [columnName, '>', value],
    'greaterThanOrEqual': (columnName, value) => [columnName, '>=', value],
    'lessThan': (columnName, value) => [columnName, '<', value],
    'lessThanOrEqual': (columnName, value) => [columnName, '<=', value],
    'contains': (columnName, value) => [columnName, 'like', `%${value}%`],
    'startsWith': (columnName, value) => [columnName, 'like', `${value}%`],
    'endsWith': (columnName, value) => [columnName, 'like', `%${value}`],
}

module.exports.operation = function (query, filters) {
    for (let filter of filters) {
        const { columnName, operation, value} = filter
        if (operation !== 'notContains'){
            query = query.where(...operators[operation](columnName, value))
        } else query = query.whereNot(...operators.contains(columnName, value))
    }
    return query
}