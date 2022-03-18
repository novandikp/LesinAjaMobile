import React, {FC, useState, useEffect} from 'react';

import {Header, OneLineInfo, CardKeyValue, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Card} from 'react-native-paper';
import {apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListTutor'>,
  StackScreenProps<AppStackParamList>
>;

export const ListTutor: FC<ScreenProps> = ({navigation}) => {
  const [Loading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocus = useIsFocused();
  // const tutorList = [
  //   {
  //     nama: 'Nico Prakoso',
  //     email: 'nico@null.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'bojong kidul',
  //   },
  //   {
  //     nama: 'Akbar Wibowo',
  //     email: 'akbar@void.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'bojong lor',
  //   },
  //   {
  //     nama: 'Prasetyo',
  //     email: 'pras@lewd.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'bojong utara',
  //   },
  //   {
  //     nama: 'Wendy Akbar',
  //     email: 'wendy@mock.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'bojong tenggara',
  //   },
  // ];
  const [tutorList, setTutorList] = useState([]);
  useEffect(() => {
    const getInitialData = async () => {
      const tutor = await apiGet({
        url: 'admin/guru?page=1&guru=Budi&orderBy=guru&sort=ASC',
      });
      setTutorList(tutor.data);
    };

    if (isRefreshing || Loading || isFocus) {
      getInitialData();}

    return () => {
      // cancelApiRequest();
    };
  }, [isFocus, Loading, isRefreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Tutor"
        onPressFilter={() => {}}
      />
        {Loading || isRefreshing ? (
                        <SkeletonLoading />
                      ) : (

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {tutorList.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              style={{marginTop: dimens.standard}}
              onPress={() =>
                navigation.navigate<any>('DetailTutor', {data: item})
              }>
              <Card.Title title={item.guru} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.guru} />
                <CardKeyValue keyName="Email" value={item.email} />
                <CardKeyValue keyName="Nomor WA" value={item.telp} />
                <CardKeyValue keyName="Alamat" value={item.alamat} />
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView> )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: dimens.standard,
    paddingTop: dimens.small,
  },
});
