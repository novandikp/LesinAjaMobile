import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header, SkeletonLoading} from '@components';
import {useIsFocused} from '@react-navigation/core';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,

} from 'react-native';
import {Button, Card} from 'react-native-paper';
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
  const [riwayat, setRiwayat] = useState<any>([]);
  const componentMounted = useRef(true); // (3) component is mounted
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  useEffect(() => {
    let active = true
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/les?cari=&orderBy=siswa&sort=desc&page=1&status=BAYAR_BELUMKONFIRMASI',
      });
      if (active) {
        setRiwayat(data.data);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      active = false;
    };
  }, [isFocus, isLoading, isRefreshing, riwayat]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Konfirmasi Pembayaran" noBackButton />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
        {isLoading || isRefreshing ? (
            <SkeletonLoading />
          ) : (
               <>
          {
            riwayat.map((item: any, key: number) => {
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
                    value={item.biaya
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
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
                        //setIsLoading(true)
                        navigation.navigate('KonfirmasiPembayaran');
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
            </>)}
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
