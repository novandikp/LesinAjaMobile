import React, {FC, useContext, useEffect, useState} from 'react';
import {
  Account,
  Les,
  AddLes,
  LoginAdmin,
  DetailLes,
  DetailTutor,
  EditStudent,
  LoginGeneral,
  ListStudents,
  Splash,
  DetailPresensi,
  DetailLowongan,
  DetailWalmur,
  DetailListMaster,
  EditListMaster,
  EditListLes,
  AccountTutor,
  InputLaporan,
} from '@screens';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {clearLocalStorage, getLocalStorage} from '@utils';
import {lsKey} from '@constants';
import {AuthContext} from '@context/AuthContext';
import {MainTabs} from './MainTabs';
import {AdminDrawer} from './AdminDrawer';
import {AppStackParamList} from './RouteTypes';
import {DetailLesTutor} from '@screens/DetailLesTutor';

const AppStack = createStackNavigator<AppStackParamList>();
// Main router fo the App
const AppRouter: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    state: {userRole},
    setUserRole,
  } = useContext(AuthContext);

  useEffect(() => {
    // Check data
    getLocalStorage(lsKey.userRole).then(res => {
      if (res) {
        setUserRole(res);
      }
      setIsLoading(false);
    });

    // clearLocalStorage();
  }, [setUserRole]);

  // When checking data, show splash screen
  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{headerShown: false}}>
        {/* Authentication Stack */}
        {!userRole && (
          <>
            <AppStack.Screen name="LoginGeneral" component={LoginGeneral} />
            <AppStack.Screen name="LoginAdmin" component={LoginAdmin} />
          </>
        )}
        {/* Admin Stack */}
        {userRole === 'admin' && (
          <>
            <AppStack.Screen name="AdminDrawer" component={AdminDrawer} />
            <AppStack.Screen name="DetailTutor" component={DetailTutor} />
            <AppStack.Screen name="DetailWalmur" component={DetailWalmur} />
            <AppStack.Screen
              name="DetailListMaster"
              component={DetailListMaster}
            />
            <AppStack.Screen name="EditListMaster" component={EditListMaster} />
            <AppStack.Screen name="EditListLes" component={EditListLes} />
            <AppStack.Screen name="InputLaporan" component={InputLaporan} />
          </>
        )}
        {/* Parent Stack */}
        {userRole === 'parent' && (
          <>
            <AppStack.Screen name="MainTabs" component={MainTabs} />
            <AppStack.Screen name="ListStudents" component={ListStudents} />
            <AppStack.Screen name="EditStudent" component={EditStudent} />
            <AppStack.Screen name="AddLes" component={AddLes} />
            <AppStack.Screen name="DetailLes" component={DetailLes} />
            <AppStack.Screen name="Les" component={Les} />
            <AppStack.Screen name="DetailTutor" component={DetailTutor} />
            <AppStack.Screen name="DetailPresensi" component={DetailPresensi} />
            <AppStack.Screen name="Account" component={Account} />
          </>
        )}
        {/* Tutor Stack */}
        {userRole === 'tutor' && (
          <>
            <AppStack.Screen name="MainTabs" component={MainTabs} />
            <AppStack.Screen name="DetailLesTutor" component={DetailLesTutor} />
            <AppStack.Screen name="DetailLowongan" component={DetailLowongan} />
            <AppStack.Screen name="DetailPresensi" component={DetailPresensi} />
            <AppStack.Screen name="AccountTutor" component={AccountTutor} />
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppRouter;
