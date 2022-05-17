import AsyncStorage from '@react-native-async-storage/async-storage';

// Set data to Local storage
// key should be unique
export const setLocalStorage = async (key: string, value: string | object) => {
  try {
    if (typeof value === 'string') {
      await AsyncStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    // console.log({key, value});
  } catch (error) {
    console.log(error);
  }
};

// Get data from local storage
export const getLocalStorage = async (keyName: string) => {
  const data: any = await AsyncStorage.getItem(keyName);

  // If data is JSON string, parse the data
  // If not, then get the data directly
  let finalResult;
  try {
    finalResult = JSON.parse(data);
  } catch (error) {
    finalResult = data;
  }

  return finalResult;
};

// remove one key local storage
export const removeLocalStorage = async (keyName: string) => {
  try {
    await AsyncStorage.removeItem(keyName);
  } catch (error) {
    console.log(error);
  }
};

// Clear all keys dan values in local storage
export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};
