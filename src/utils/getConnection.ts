import NetInfo from '@react-native-community/netinfo';

export const getConnection = async () => {
  const net = await NetInfo.fetch();

  return net.isConnected;
};
