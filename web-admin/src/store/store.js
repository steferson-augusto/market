import { createStore, combineReducers } from 'redux'
import user from './reducers/user'

const reducers = combineReducers({
    user,
})

const storeConfig = createStore(reducers)

export default storeConfig