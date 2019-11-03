import { SET_PRODUCTS, RESET_PRODUCTS } from '../actionTypes'
import { Product } from '../../services/types'

export interface State {
    data: Array<Product>
    cart: Array<Product>
    total: number
    lastPage: number
}

const cart = [1,2,3,4,5,6,7,8].map(n => ({
    id: n,
    name: `Item 0${n}`,
    price: Math.floor(Math.random() * 10) + 1,
    quantity: Math.floor(Math.random() * 10),
}))

const initialState: State = { data: [], cart, total: 0, lastPage: 0 }

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