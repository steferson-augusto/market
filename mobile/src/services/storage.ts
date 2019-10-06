import { AsyncStorage } from 'react-native'

export const removeItemValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  }
  catch (exception) {
    return false
  }
}