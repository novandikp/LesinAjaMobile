import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header, SkeletonLoading, Gap} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {Icon, Image} from 'react-native-elements';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {useIsFocused} from '@react-navigation/core';
import Modal from 'react-native-modal';

import {apiGet, checkPersimisson} from '@utils';
type ScreenProps = StackScreenProps<AppStackParamList, 'HistoryPembayaran'>;
type riwayatItem = {
  idles: string;
  idpaket: string;
  idsiswa: string;
  tglles: string;
  jamles: string;
  hari: string;
  status: string;
  statusles: string;
  jumlah_pertemuan: string;
  biaya: number;
  siswa: string;
  jenjang: string;
  kelas: string;
  jeniskelamin: string;
  gaji: number;
  guru: string;
  tglbayar: string;
  idwali: string;
  wali: string;
  alamat: string;
  bukti: string;
  paket: string;
};
export const HistoryPembayaran: FC<ScreenProps> = ({}) => {
  const [riwayat, setRiwayat] = useState([]);
  const [modalImage, setModalImage] = useState(false);
  const [uriPicture, setUriPicture] = useState('');
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
        url: '/les/terkonfirmasi',
        params: {
          cari: '',
          orderBy: 'idles',
          sort: 'desc',
          page: '1',
        },
      });
      if (componentMounted.current) {
        setRiwayat(data.data);
      }
      if (Active) {
        if (isLoadMoreData) {
          setRiwayat(riwayat);
        } else {
          if (data.data.length == 10) {
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
      url: '/les/terkonfirmasi',
      params: {
        cari: '',
        orderBy: 'idles',
        sort: 'desc',
        page: NextPage,
      },
    }).then(res => {
      if (res.data.length == 0) {
        setLoadingData(false);
        return setDiplayButton(false);
      }
      setRiwayat(riwayat.concat(res.data));
      if (res.data.length < 10) {
        setDiplayButton(false);
      } else if (res.data.length == 10) {
        setLoadingData(false);
        setPage(NextPage);
      }
      setLoadingData(false);
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Riwayat Pembayaran Les" />

      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={riwayat}
            keyExtractor={(item: riwayatItem) => item.idles}
            renderItem={({item}: ListRenderItemInfo<riwayatItem>) => (
              <Card style={{marginBottom: 10}}>
                <Card.Title title={'Pembayaran Les'} />
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
                    keyName="Kelas"
                    value={item.kelas + ' ' + item.jenjang}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Paket"
                    value={item.paket}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Jumlah pertemuan"
                    value={item.jumlah_pertemuan}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Biaya Les"
                    value={item.biaya
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Gaji tutor"
                    value={item.gaji
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Hari Les"
                    value={item.hari}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="jam Les"
                    value={item.jamles}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal Les"
                    value={new Date(item.tglles).toLocaleDateString()}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal Pembayaran"
                    value={new Date(item.tglbayar).toLocaleDateString()}
                  />
                </Card.Content>
                <Card.Actions style={{alignSelf: 'flex-end'}}>
                  <Icon
                    name="eye"
                    type="font-awesome"
                    color={color.green_500}
                    onPress={() => {
                      setUriPicture(item.bukti);
                      setModalImage(true);
                    }}
                  />
                  <Gap x={10} />
                  <Icon
                    name="download"
                    type="font-awesome"
                    color={color.green_500}
                    onPress={() => {
                      if (item.bukti != null) {
                        checkPersimisson(item.bukti, 'bukti');
                      }
                    }}
                  />
                  <Gap x={10} />
                </Card.Actions>
              </Card>
            )}
            initialNumToRender={10}
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
                    setUriPicture('');
                  }}
                  color={color.red}
                  iconStyle={{alignSelf: 'flex-end'}}
                />
                {uriPicture && (
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: 'http://45.76.149.250/bukti/' + uriPicture,
                    }}
                    style={{
                      height: '100%',
                    }}
                  />
                )}
              </View>
            </Modal>
          )}
        </SafeAreaView>
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
