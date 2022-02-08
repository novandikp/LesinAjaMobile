import React, {FC, useEffect, useState} from 'react';
import {Header, OneLineInfo, CardKeyValue} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Card} from 'react-native-paper';
import {apiGet} from '@utils';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListWalmur'>,
  StackScreenProps<AppStackParamList>
>;

export const ListWalmur: FC<ScreenProps> = ({navigation}) => {
  // const walmurList = [
  //   {
  //     nama: 'Hari Wibowo',
  //     email: 'hari@gmail.com',
  //     nomorWhatsApp: '089889889331',
  //     alamat: 'durian runtuh',
  //   },
  //   {
  //     nama: 'Ari Jayanto',
  //     email: 'arj@void.net',
  //     nomorWhatsApp: '08977888988',
  //     alamat: 'cipete',
  //   },
  //   {
  //     nama: 'Heri Heru',
  //     email: 'hh@lewd.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'cisarua',
  //   },
  //   {
  //     nama: 'Sitikus',
  //     email: 'stk@mock.net',
  //     nomorWhatsApp: '089778889331',
  //     alamat: 'wonoplintahan',
  //   },
  // ];
  const [walmurList, setWalmurList] = useState([]);
  useEffect(() => {
    const getInitialData = async () => {
      const walmur = await apiGet({
        url: 'admin/wali?page=1&wali=Budi&orderBy=wali&sort=ASC',
      });
      setWalmurList(walmur.data);
    };
    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Wali Murid"
        onPressFilter={() => {}}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {walmurList.map((item, index) => {
          return (
            <Card
              key={index}
              style={{marginTop: dimens.standard}}
              onPress={() => navigation.navigate('DetailWalmur')}>
              <Card.Title title={item.wali} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.wali} />
                <CardKeyValue keyName="Email" value={item.email} />
                <CardKeyValue keyName="Nomor WA" value={item.telp} />
                <CardKeyValue keyName="Alamat" value={item.alamat} />
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
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
