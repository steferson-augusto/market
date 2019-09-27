import { createStore, combineReducers } from 'redux'
import user from './reducers/user'
import marks from './reducers/mark'
import sections from './reducers/section'
import ums from './reducers/um'
import products from './reducers/product'

const reducers = combineReducers({ user, marks, sections, ums, products })

const storeConfig = createStore(reducers)

export default storeConfig