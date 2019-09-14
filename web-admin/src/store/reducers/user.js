import { SET_USER } from '../actionTypes'

const initialState = {
    id: null,
    name: null,
    email: null,
    active: false,
    date_birth: null,
    image_path: null,
    description: null,
}

const reducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_USER:
            return {
                ...state,
                ...payload,
            }
        default:
            return state
    }
}

export default reducer