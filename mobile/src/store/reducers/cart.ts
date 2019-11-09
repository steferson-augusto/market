import { SET_CART, RESET_CART } from '../actionTypes'
import { Cart } from '../../services/types'

const initialState: Cart = { products: [{
    product: {
        id: 1,
        name: 'PRODUTO REDUX',
        price: 3.5
    },
    quantity: 3
}], total: 0 }

const reducer = (state: Cart = initialState, { type, payload }) => {
    switch (type) {
        case SET_CART:
            if (!payload.products) payload.products = []
            const total = payload.products.reduce((sum, item) => sum + (item.quantity * item.product.price), 0)
            return { ...state, ...payload, total }
        case RESET_CART:
            return { products: [], total: 0 }
        default:
            return state
    }
}

export default reducer