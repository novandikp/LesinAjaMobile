import React, {FC, useState, useEffect} from 'react';
import {Header, NestedCard, OneLineInfo} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {apiGet} from '@utils';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Lowongan'>,
  StackScreenProps<AppStackParamList>
>;

export const Lowongan: FC<ScreenProps> = ({navigation}) => {
  const [lowonganList, setLowonganList] = useState([]);
  useEffect(() => {
    const getInitialData = async () => {
      const tutor = await apiGet({url: '/guru/profile'});
      const lowonganKabupaten = await apiGet({
        url:
          '/lowongan/' +
          tutor.data.idkecamatan +
          '?page=1&cari=&orderBy=idlowongan&sort=ASC',
      });
      console.log(lowonganKabupaten.data);
      setLowonganList(lowonganKabupaten.data);
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, [lowonganList]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header noBackButton title="Lowongan" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />

        {lowonganList.map((item: any, index: number) => {
          return (
            <NestedCard
              key={index}
              title={'' + item.paket + ' ' + item.jenjang}
              subtitle={`${item.jumlah_pertemuan} pertemuan `}
              additionalText={`Rp. ${item.gaji}`}
              onPress={() => {
                navigation.navigate<any>('DetailLowongan', {item});
              }}
            />
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
