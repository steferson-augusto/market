import { createStore, combineReducers } from 'redux'
import user from './reducers/user'
import sections from './reducers/section'

const reducers = combineReducers({ user, sections })

const storeConfig = createStore(reducers)

export default storeConfig