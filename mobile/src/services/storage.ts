import AsyncStorage from '@react-native-community/async-storage'

export const removeItemValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key)
    return true
  }
  catch (exception) {
    return false
  }
}