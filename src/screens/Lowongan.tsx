import React, {FC, useState, useEffect} from 'react';
import {Header, NestedCard, OneLineInfo} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {Headline, Subheading} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const [lowonganList, setLowonganList] = useState<any>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const getInitialData = async () => {
      const tutor = await apiGet({url: '/guru/profile'});
      if (tutor.data.idkecamatan != null) {
        const lowonganKabupaten = await apiGet({
          url:
            '/lowongan/' +
            tutor.data.idkecamatan +
            '?page=' +
            page +
            '&cari=&orderBy=idlowongan&sort=ASC',
        });
        setLowonganList(lowonganKabupaten.data);
      } else if (tutor.data.idkecamatan == null) {
        setLowonganList(null);
      }
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header noBackButton title="Lowongan" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {lowonganList != null ? (
          lowonganList.map((item: any, index: number) => {
            return (
              <NestedCard
                key={index}
                title={'' + item.paket + ' ' + item.jenjang}
                subtitle={`${item.jumlah_pertemuan} pertemuan `}
                additionalText={
                  'Rp.' +
                  item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
                onPress={() => {
                  navigation.navigate<any>('DetailLowongan', {item});
                }}
              />
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: dimens.massive,
            }}>
            <MaterialCommunityIcons
              name="database-remove"
              size={130}
              style={{color: 'grey'}}
            />

            <Headline style={{textAlign: 'center', marginTop: dimens.large}}>
              Belum ada data.
            </Headline>
            <Subheading
              style={{textAlign: 'center', paddingHorizontal: dimens.large}}>
              Harap isi data diri
            </Subheading>
          </View>
        )}
        {lowonganList.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: dimens.massive,
            }}>
            <MaterialCommunityIcons
              name="database-remove"
              size={130}
              style={{color: 'grey'}}
            />

            <Headline style={{textAlign: 'center', marginTop: dimens.large}}>
              Belum ada data.
            </Headline>
          </View>
        )}
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
