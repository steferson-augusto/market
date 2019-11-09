import { createStore, combineReducers } from 'redux'
import user from './reducers/user'
import sections from './reducers/section'
import products from './reducers/product'
import cart from './reducers/cart'

const reducers = combineReducers({ user, sections, products, cart })

const storeConfig = createStore(reducers)

export default storeConfig