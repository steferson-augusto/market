import { SET_CART, RESET_CART, EDIT_CART, DEL_FROM_CART } from '../actionTypes'
import { Cart } from '../../services/types'

const initialState: Cart = { products: [], total: 0 }

const reducer = (state: Cart = initialState, { type, payload }) => {
    let products = []
    let total = 0
    switch (type) {
        case SET_CART:
            if (!payload.products) payload.products = []
            total = payload.products.reduce((sum, item) => sum + (item.quantity * item.product.price), 0)
            return { ...state, ...payload, total }
        case RESET_CART:
            return { products: [], total: 0 }
        case EDIT_CART:
            products = [...state.products]
            let item = products.find(p => (payload.product.id == p.product.id))
            let value = 0
            if (item) {
                value = state.total - (item.quantity * item.product.price)
                item.quantity = payload.quantity
                item.product = payload.product
                value = value + (payload.quantity * payload.product.price)
                if (payload.quantity == 0) products = products.filter(p => p.product.id != payload.product.id)
            } else {
                products.push(payload)
                value = state.total + (payload.quantity * payload.product.price)
            }
            return { ...state, products, total: value }
        case DEL_FROM_CART:
            total = state.total - payload.price
            products = state.products.filter(p => p.product.id != payload.id)
            return { ...state, products, total }
        default:
            return state
    }
}

export default reducer