import { createStore, combineReducers } from 'redux'
import devToolsEnhancer from 'remote-redux-devtools'
import user from './reducers/user'
import marks from './reducers/mark'

const reducers = combineReducers({ user, marks })

const storeConfig = createStore(reducers, devToolsEnhancer())

export default storeConfig