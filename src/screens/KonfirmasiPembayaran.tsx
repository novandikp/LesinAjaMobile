import React, {FC, useState, useEffect} from 'react';
import {CardKeyValue, Header} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {apiGet, apiPost} from '@utils';

type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'RiwayatPembayaran'>,
  StackScreenProps<AppStackParamList>
>;
export const KonfirmasiPembayaran: FC<ScreenProps> = ({navigation}) => {
  const [riwayat, setRiwayat] = useState([
    // {
    //   keterangan: 'Bayar Gaji Tutor',
    //   wali: 'Handoko',
    //   siswa: 'Waluyo',
    //   biaya: 'Rp 1.200.000',
    // },
  ]);
  useEffect(() => {
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/les?cari=&orderBy=siswa&sort=desc&page=1&status=BAYAR_BELUMKONFIRMASI',
      });
      setRiwayat(data.data);
    };
    getInitialData();
    return () => {};
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Konfirmasi Pembayaran" noBackButton />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {riwayat.map((item: any, key) => {
            return (
              <Card key={key} style={{marginBottom: 10}}>
                <Card.Title title={'Pembayaran pada ananda ' + item.siswa} />
                <Card.Content>
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Keterangan"
                    value={item.status}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama Wali Murid"
                    value={item.wali}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama Siswa"
                    value={item.siswa}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Biaya Gaji Tutor"
                    value={item.biaya}
                  />
                </Card.Content>
                <Card.Actions>
                  <Button
                    onPress={async () => {
                      const konfirmasi = await apiPost({
                        url: 'les/konfirmasi/' + item.idles,
                        payload: {},
                      });
                      if (konfirmasi) {
                        navigation.navigate('HomeAdmin');
                      }
                    }}>
                    Konfirmasi
                  </Button>
                  <Button
                    onPress={async () => {
                      const tolak = await apiPost({
                        url: '/les/tolak/' + item.idles,
                        payload: {},
                      });
                      if (tolak) {
                        navigation.navigate('HomeAdmin');
                      }
                    }}>
                    Tolak
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
