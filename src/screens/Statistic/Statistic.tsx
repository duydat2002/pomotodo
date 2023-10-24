import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

  const [tab, setTab] = useState<'Overview' | 'Project'>('Overview');

  return (
    <SafeView hasDismissKeyboard={false}>
      <Header title={'Statistic'} />
      <View style={{flex: 1, width: '100%'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              flex: 1,
              borderBottomColor: activedColors.primaryDark,
              borderBottomWidth: tab == 'Overview' ? 2 : 0,
            }}
            onPress={() => setTab('Overview')}>
            <Text
              style={[
                common.text,
                styles.tab,
                {
                  color:
                    tab == 'Overview'
                      ? activedColors.primary
                      : activedColors.primaryLight,
                },
              ]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              borderBottomColor: activedColors.primaryDark,
              borderBottomWidth: tab == 'Project' ? 2 : 0,
            }}
            onPress={() => setTab('Project')}>
            <Text
              style={[
                common.text,
                styles.tab,
                {
                  color:
                    tab == 'Project'
                      ? activedColors.primary
                      : activedColors.primaryLight,
                },
              ]}>
              Project
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{backgroundColor: activedColors.input}}>
          {tab == 'Overview' ? <Overview /> : <ProjectStatistic />}
        </ScrollView>
      </View>
    </SafeView>
  );
};

export default Statistic;

const styles = StyleSheet.create({
  tab: {
    padding: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
