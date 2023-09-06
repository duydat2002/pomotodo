import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    alert(error);
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    alert(error);
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    alert(error);
  }
};

export const deleteAllData = async (excludes?: string[]) => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    if (excludes) {
      const deleteKeys = allKeys.filter(key => !excludes.includes(key));

      await AsyncStorage.multiRemove(deleteKeys);
    } else {
      await AsyncStorage.multiRemove(allKeys);
    }
  } catch (error) {
    alert(error);
  }
};
