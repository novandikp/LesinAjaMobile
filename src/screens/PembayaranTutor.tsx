import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  FlatList,
  ListRenderItemInfo,
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
type rekaptutor = {
  idles: string;
  idguru: string;
  guru: string;
  idsiswa: string;
  siswa: string;
  tglles: string;
  jeniskelamin: string;
  jumlah_pertemuan: string;
  jumlah_mengajar: string;
  gaji: number;
  statusles: string;
  rekening: string;
  bank: string;
  status: string;
};

export const PembayaranTutor: FC<ScreenProps> = ({}) => {
  const [riwayat, setRiwayat] = useState([]);
  // paembayaran
  const [images, setImages] = useState<any>([]);
  const [buktiBayar, setBuktiBayar] = useState({
    path: '',
  });
  const [idles, setIdles] = useState('');
  const [idguru, setIdguru] = useState('');
  const [gaji, setGaji] = useState(0);

  const [modalImage, setModalImage] = useState(false);
  const [loading, setLoading] = useState(false);
  // load more data
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDiplayButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  const [page, setPage] = useState(1);
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
      }
      if (Active) {
        if (isLoadMoreData) {
          console.log(riwayat.length);
          setRiwayat(riwayat);
        } else {
          if (data.data.length % 10 == 0) {
            setDiplayButton(true);
            setButtonLoadMore(false);
          }
          setRiwayat(data.data);
        }
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
  }, [isFocus, isLoadMoreData, isLoading, isRefreshing, riwayat]);
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: '/admin/guru/rekap',
      params: {
        // cari: '',
        orderBy: 'guru',
        guru: '',
        sort: 'desc',
        page: NextPage,
      },
    }).then(res => {
      if (res.data.length == 0) {
        setLoadingData(false);
        return setDiplayButton(false);
      }
      let newRiwayat = riwayat.concat(res.data);
      setRiwayat(newRiwayat);
      if (res.data.length < 10) {
        setDiplayButton(false);
      } else if (res.data.length % 10 == 0) {
        console.log('ini');
        setLoadingData(false);
        setPage(NextPage);
      }
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Rekap Mengajar Tutor" noBackButton />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={riwayat}
            keyExtractor={(item: rekaptutor, index: number) => index.toString()}
            renderItem={({item}: ListRenderItemInfo<rekaptutor>) => (
              <Card style={{marginBottom: 10}}>
                <Card.Title title={'Rekap tutor ' + item.guru} />
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
                  {item.status && (
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
                  )}
                </Card.Actions>
              </Card>
            )}
            extraData={riwayat}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              <View>
                {displayButton && (
                  <Button
                    loading={loadingData}
                    onPress={() => {
                      setLoadMoreData(true);
                      setLoadingData(true);
                      loadMoreData();
                    }}
                    mode="contained"
                    disabled={buttonLoadMore}
                    style={{
                      marginTop: 10,
                      alignSelf: 'center',
                      marginHorizontal: 10,
                    }}>
                    Load More Data
                  </Button>
                )}
              </View>
            }
          />
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
      )}
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
