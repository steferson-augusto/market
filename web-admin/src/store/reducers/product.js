import { SET_PRODUCTS} from '../actionTypes'

const initialState = {
    total: 0,
    page: 0,
    perPage: 5,
    sorting: [{ columnName: 'name', direction: 'asc' }],
    rowChanges: {},
    editingRowIds: [],
    addedRows: [],
    filters: [],
    hiddenColumnNames: ['id', 'description'],
    marks: [],
    sections: [],
    ums: [],
    data: []
}

const reducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_PRODUCTS:
            return {
                ...state,
                ...payload,
            }
        default:
            return state
    }
}

export default reducer