import { createStore, combineReducers } from 'redux'
import user from './reducers/user'
import sections from './reducers/section'
import products from './reducers/product'

const reducers = combineReducers({ user, sections, products })

const storeConfig = createStore(reducers)

export default storeConfig