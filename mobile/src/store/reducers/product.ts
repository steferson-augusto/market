import { SET_PRODUCTS, RESET_PRODUCTS } from '../actionTypes'
import { Product } from '../../services/types'

export interface State {
    data: Array<Product>
    total: number
    lastPage: number
}

const initialState: State = { data: [], total: 0, lastPage: 0 }

const reducer = (state: State = initialState, { type, payload }) => {
    switch (type) {
        case SET_PRODUCTS:
            if (!payload.data) payload.data = []
            return { ...state, ...payload, data: [...state.data, ...payload.data] }
        case RESET_PRODUCTS:
            return { ...state, data: [] }
        default:
            return state
    }
}

export default reducer