import React, {FC, useContext} from 'react';
import {Header} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import {AuthContext} from '@context/AuthContext';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Settings'>,
  StackScreenProps<AppStackParamList>
>;
export const Settings: FC<ScreenProps> = ({navigation}) => {
  const {
    state: {userRole},
    logout,
  } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header noBackButton title="Pengaturan" />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1}}>
          <Button
            contentStyle={styles.settingsItem}
            labelStyle={styles.settingsText}
            onPress={() => {
              // console.log(userRole);
              if (userRole == 'tutor') {
                navigation.navigate('AccountTutor');
              } else if (userRole == 'parent') {
                navigation.navigate('Account');
              }
            }}>
            Ubah Data Pribadi
          </Button>
          {userRole == 'parent' && (
            <Button
              contentStyle={styles.settingsItem}
              labelStyle={styles.settingsText}
              onPress={() => {
                navigation.navigate('ListStudents');
              }}>
              Daftar Siswa
            </Button>
          )}
        </View>
        <Button
          contentStyle={{
            paddingVertical: dimens.tiny_6,
            marginBottom: dimens.standard,
          }}
          labelStyle={{fontSize: dimens.standard_18, color: color.error_text}}
          onPress={logout}>
          Keluar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  settingsItem: {
    justifyContent: 'flex-start',
    paddingVertical: dimens.medium,
  },
  settingsText: {
    fontSize: dimens.standard_18,
    color: '#4B5563',
  },
});
