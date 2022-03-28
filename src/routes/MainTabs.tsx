import React, {FC, useContext} from 'react';
import {Home, Latihan, Les, LesTutor, Lowongan, Settings} from '@screens';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MainTabParamList} from './RouteTypes';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {AuthContext} from '@context/AuthContext';

const MainTab = createMaterialBottomTabNavigator<MainTabParamList>();
export const MainTabs: FC = () => {
  const {
    state: {userRole},
  } = useContext(AuthContext);

  if (userRole == 'tutor') {
    return (
      <MainTab.Navigator
        initialRouteName="Home"
        barStyle={{backgroundColor: '#FCD34D'}}>
        <MainTab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Beranda',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <MainTab.Screen
          name="Les"
          component={LesTutor}
          options={{
            tabBarLabel: 'Les',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="book-open-variant"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <MainTab.Screen
          name="Lowongan"
          component={Lowongan}
          options={{
            tabBarLabel: 'Lowongan',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="teach" color={color} size={26} />
            ),
          }}
        />
        <MainTab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: 'Akun',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
      </MainTab.Navigator>
    );
  }

  return (
    <MainTab.Navigator
      initialRouteName="Home"
      barStyle={{backgroundColor: '#FCD34D'}}>
      <MainTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Beranda',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Les"
        component={Les}
        options={{
          tabBarLabel: 'Les',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <MainTab.Screen
        name="Latihan"
        component={Latihan}
        options={{
          tabBarLabel: 'Latihan',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="pencil-box" color={color} size={26} />
          ),
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Akun',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </MainTab.Navigator>
  );
};
