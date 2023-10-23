import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';
import Overview from './Overview';
import ProjectStatistic from './ProjectStatistic';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';

const Statistic = () => {
  const activedColors = useActivedColors();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'overview', title: 'Overview'},
    {key: 'projectStatistic', title: 'Project'},
  ]);

  const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

  return (
    <SafeView hasDismissKeyboard={false}>
      <Header title={'Statistic'} />
      <View style={{flex: 1, width: '100%'}}>
        <TabView
          lazy
          initialLayout={initialLayout}
          navigationState={{index, routes}}
          renderScene={SceneMap({
            overview: Overview,
            projectStatistic: ProjectStatistic,
          })}
          onIndexChange={setIndex}
          renderTabBar={props => (
            <TabBar
              {...props}
              activeColor={activedColors.primary}
              inactiveColor={activedColors.textSec}
              indicatorStyle={{
                backgroundColor: activedColors.primary,
                height: 3,
              }}
              indicatorContainerStyle={{
                marginHorizontal: 40,
                paddingHorizontal: 80,
              }}
              labelStyle={[
                common.text,
                {fontWeight: '600', textTransform: 'capitalize'},
              ]}
              style={{
                backgroundColor: activedColors.background,
                borderBottomColor: activedColors.border,
                borderBottomWidth: 1,
                elevation: 0,
              }}
              contentContainerStyle={{flexGrow: 1}}
            />
          )}
        />
      </View>
    </SafeView>
  );
};

export default Statistic;

const styles = StyleSheet.create({});
