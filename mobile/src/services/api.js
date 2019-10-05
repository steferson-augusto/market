import axios from 'axios'
import { AsyncStorage } from 'react-native'

const api = axios.create({
    baseURL: 'http://10.0.2.2:3333',
})
// ou 'http://10.0.2.2:3333' + cmd 'adb reverse tcp:3333 tcp:3333'

api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('@RPG:token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    } catch (err) {
        console.log(err)
    }
})

export default api