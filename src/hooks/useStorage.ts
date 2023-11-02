import storage from '@react-native-firebase/storage';

export const useStorage = () => {
  const setUserAvatar = async (userId: string, uri: string) => {
    try {
      const reference = storage().ref(`avatar/${userId}/${userId}.png`);
      await reference.putFile(uri);

      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.log('setavatar', error);
    }
  };

  const deleteAvatar = async (userId: string) => {
    try {
      const reference = storage().ref(`avatar/${userId}/${userId}.png`);

      await reference.delete();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    setUserAvatar,
    deleteAvatar,
  };
};
