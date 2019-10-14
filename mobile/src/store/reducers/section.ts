import { SET_SECTIONS } from '../actionTypes'
import { Section } from '../../services/types'

interface State {
    data: Array<Section>
}

const initialState: State = { data: [] }

const reducer = (state: State = initialState, { type, payload }) => {
    switch (type) {
        case SET_SECTIONS:
            return { data: payload }
        default:
            return state
    }
}

export default reducer