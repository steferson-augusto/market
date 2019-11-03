import axios from 'axios'
import { AsyncStorage } from 'react-native'

const api = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 5000,
})
// ou 'http://10.0.2.2:3333' + cmd 'adb reverse tcp:3333 tcp:3333'

api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@RPG:token')

        if (token) config.headers.Authorization = `Bearer ${token}`

        return config
    } catch (err) {
        console.log(err)
    }
})

export const getToken = (): string => {
    const token = async () => await AsyncStorage.getItem('@RPG:token')
    return `Bearer ${token}`
}

export default api