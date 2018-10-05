import { AsyncStorage } from 'react-native';

const prefix = 'taekwordo'

async function save(key, value) {
  try {
    await AsyncStorage.setItem(`${prefix}_${key}`, JSON.stringify(value));
  } catch (error) {
    console.log('Error during asyncstorage save', error);
  }
}

async function load(key) {
  try {
    const item = await AsyncStorage.getItem(`${prefix}_${key}`);

    return JSON.parse(item);
  } catch (error) {
    console.log('Error during asyncstorage load', error);
  }
}

async function remove(key) {
  try {
    await AsyncStorage.removeItem(`${prefix}_${key}`);
  } catch (error) {
    console.log('Error during asyncstorage remove', error);
  }
}


export default {
  save,
  load,
  remove
}

