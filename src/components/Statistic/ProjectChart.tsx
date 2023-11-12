import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import {useUser} from '@/hooks/useUser';
import {IProject, ITask} from '@/types';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';

interface IProps {
  project: IProject | null;
}

const ProjectChart: React.FC<IProps> = ({project}) => {
  const activedColors = useActivedColors();

  const {user} = useAppSelector(state => state.user);
  const {tasks} = useAppSelector(state => state.tasks);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {getLocalUserById} = useUser();

  const [tasksInProject, setTasksInProject] = useState<ITask[] | null>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [selectedPie, setSelectedPie] = useState<any>(null);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const tasksTemp = tasks?.filter(item => item.projectId == project?.id);

    if (tasksTemp && tasksTemp.length > 0) setTasksInProject(tasksTemp);
    else setTasksInProject(null);

    setSelectedPie(null);
  }, [project]);

  useEffect(() => {
    const getPieData = async () => {
      if (tasksInProject) {
        const datas = await projectOverview(tasksInProject);
        setPieData(datas);
        setTotalTasks(tasksInProject.length);
      } else {
        setPieData([]);
        setTotalTasks(0);
      }
    };

    getPieData();
  }, [tasksInProject]);

  const projectOverview = async (tasksInput: ITask[]) => {
    const taskCountObj: any = {};
    taskCountObj['Unfinished'] = 0;
    const overview: any[] = [];

    console.log('tasks');
    const usersTemp = await Promise.all(
      tasksInput.map(async item => {
        return item.isDone ? await getLocalUserById(item.completedBy) : null;
      }),
    );

    usersTemp.forEach(item => {
      if (item) {
        taskCountObj[item.username] =
          taskCountObj[item.username] == undefined
            ? 1
            : taskCountObj[item.username] + 1;
      } else {
        taskCountObj['Unfinished']++;
      }
    });

    overview.push({
      text: 'Unfinished',
      value: taskCountObj['Unfinished'],
      color: '#ff5757',
    });
    delete taskCountObj['Unfinished'];

    const sortTasks = Object.entries(taskCountObj)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([key, value]) => ({
        text: key,
        value: value,
        color: `hsl(${Math.random() * 360}, 100%, ${Math.random() * 15 + 70}%)`,
      }));

    return [...sortTasks, ...overview];
  };

  const centerLabelComponent = () => {
    if (selectedPie)
      return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={[
              common.subTitle,
              {fontWeight: '600', color: activedColors.text},
            ]}>
            {((selectedPie.value / totalTasks) * 100).toFixed(2)}%
          </Text>
          <Text style={[common.medium, {color: activedColors.text}]}>
            Tasks
          </Text>
        </View>
      );
  };

  return (
    <View style={[styles.widthFullCenter, {marginTop: 20}]}>
      {pieData && pieData.length != 0 ? (
        <View style={styles.widthFullCenter}>
          <PieChart
            data={pieData}
            donut
            showGradient
            focusOnPress
            toggleFocusOnPress={false}
            radius={120}
            innerRadius={60}
            innerCircleColor={activedColors.background}
            centerLabelComponent={centerLabelComponent}
            onPress={(item: any) => {
              setSelectedPie(item);
            }}
          />
          <View style={{marginTop: 20, width: '100%'}}>
            {pieData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      item == selectedPie ? item.color : 'transparent',
                  },
                ]}>
                <View
                  style={[
                    styles.colorBox,
                    {
                      backgroundColor:
                        item == selectedPie ? '#fff' : item.color,
                    },
                  ]}
                />
                <Text
                  style={[
                    common.text,
                    {
                      flex: 1,
                      marginLeft: 5,
                      color: item == selectedPie ? '#fff' : activedColors.text,
                    },
                  ]}>
                  {item.text}
                </Text>
                <Text
                  style={[
                    common.text,
                    {
                      textAlign: 'right',
                      color:
                        item == selectedPie ? '#fff' : activedColors.textSec,
                    },
                  ]}>
                  {item.value} tasks
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={[common.text, {color: activedColors.text}]}>No data</Text>
      )}
    </View>
  );
};

export default ProjectChart;

const styles = StyleSheet.create({
  widthFullCenter: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
});
