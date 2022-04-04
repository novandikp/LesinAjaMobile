import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/core';
import Modal from 'react-native-modal';
import {Icon, Image} from 'react-native-elements';

import {apiGet, getSingleDocument, apiPostFile} from '@utils';
type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'PembayaranTutor'>,
  StackScreenProps<AppStackParamList>
>;
export const PembayaranTutor: FC<ScreenProps> = ({}) => {
  const [riwayat, setRiwayat] = useState([]);
  // paembayaran
  const [images, setImages] = useState<any>([]);
  const [buktiBayar, setBuktiBayar] = useState({
    path: '',
  });
  const [idles, setIdles] = useState('');
  const [idguru, setIdguru] = useState('');
  const [gaji, setGaji] = useState('');

  const [modalImage, setModalImage] = useState(false);
  const [loading, setLoading] = useState(false);
  // load data
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let Active = true;
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/admin/guru/rekap',
        params: {
          // cari: '',
          orderBy: 'guru',
          guru: '',
          sort: 'desc',
          page: '1',
        },
      });
      if (componentMounted.current) {
        setRiwayat(data.data);
      } else if (Active) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      componentMounted.current = false;
      Active = false;
    };
  }, [isFocus, isLoading, isRefreshing]);
  // const onPressUploadBuktiBayar =
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Pembayaran Tutor" noBackButton />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {riwayat.map((item: any, key) => {
            return (
              <Card key={key} style={{marginBottom: 10}}>
                <Card.Title title={'Pembayaran tutor'} />
                <Card.Content>
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama tutor"
                    value={item.guru}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama siswa"
                    value={item.siswa}
                  />

                  <CardKeyValue
                    keyFlex={9}
                    keyName="Jumlah pertemuan"
                    value={item.jumlah_pertemuan}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Jumlah mengajar"
                    value={item.jumlah_mengajar}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Gaji tutor"
                    value={item.gaji
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  />
                  <CardKeyValue keyFlex={9} keyName="Bank" value={item.bank} />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="No.rekening"
                    value={item.rekening}
                  />
                </Card.Content>

                <Card.Actions>
                  {/* <Button>Lihat Bukti Pembayaran</Button> */}
                  <Button
                    onPress={async () => {
                      if (buktiBayar.path === '') {
                        const res = await getSingleDocument();
                        if (res) {
                          setBuktiBayar(prev => ({...prev, path: res.uri}));
                          setImages(res);
                          setGaji(item.gaji);
                          setIdles(item.idles);
                          setIdguru(item.idguru);
                          setModalImage(true);
                        }
                      }
                    }}>
                    Bayar
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
          {modalImage && (
            <Modal isVisible={modalImage}>
              <View>
                <Icon
                  name="cancel"
                  onPress={() => {
                    setModalImage(false);
                    setBuktiBayar(prev => ({...prev, path: ''}));
                  }}
                  disabled={loading}
                  color={color.red}
                  iconStyle={{alignSelf: 'flex-end'}}
                />

                {buktiBayar.path && (
                  <Image
                    source={{uri: buktiBayar.path}}
                    style={{
                      height: 400,
                      resizeMode: 'contain',
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}>
                  <Button
                    mode="text"
                    disabled={loading}
                    loading={loading}
                    onPress={async () => {
                      setLoading(true);
                      const newData = new FormData();
                      newData.append('jumlah_gaji', gaji);
                      newData.append('idles', idles);
                      newData.append('idguru', idguru);
                      newData.append('bukti[0][file]', {
                        uri:
                          Platform.OS === 'ios'
                            ? images?.uri.replace('file://', '')
                            : images?.uri,
                        type: images?.type,
                        name: images?.name,
                      });
                      const {success} = await apiPostFile({
                        url: 'admin/guru/bayar',
                        payload: newData,
                      });
                      if (success) {
                        setBuktiBayar(prev => ({...prev, path: ''}));
                        setModalImage(false);
                      }
                    }}>
                    Kirim
                  </Button>
                </View>
              </View>
            </Modal>
          )}
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
