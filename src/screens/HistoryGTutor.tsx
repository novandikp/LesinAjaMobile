import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header, SkeletonLoading} from '@components';
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
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {useIsFocused} from '@react-navigation/core';

import {apiGet} from '@utils';
type ScreenProps = StackScreenProps<AppStackParamList, 'HistoryGTutor'>;
type riwayatItem = {
  idpenggantian: string;
  alasan: string;
  tglpenggantian: string;
  status: string;
  idles: string;
  idpaket: string;
  idsiswa: string;
  tglles: string;
  jamles: string;
  hari: string;
  statusles: string;
  prefrensi: string;
  tglperpanjang: string;
  idguru: string;
  statuslowongan: string;
  idortu: string;
  jumlah_pertemuan: string;
  biaya: number;
  siswa: string;
  jenjang: string;
  kelas: string;
  jeniskelamin: string;
  gaji: number;
  guru: string;
};
export const HistoryGTutor: FC<ScreenProps> = ({}) => {
  const [riwayat, setRiwayat] = useState([]);

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
        url: 'les/ulang/daftar',
        // daftar?cari=&orderBy=idpenggantian&sort=desc&page=1&status=TERKONFIRMASI',
        params: {
          cari: '',
          orderBy: 'idpenggantian',
          sort: 'desc',
          page: '1',
          status: 'TERKONFIRMASI',
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
      url: 'les/ulang/daftar',
      // daftar?cari=&orderBy=idpenggantian&sort=desc&page=1&status=TERKONFIRMASI',
      params: {
        cari: '',
        orderBy: 'idpenggantian',
        sort: 'desc',
        page: NextPage,
        status: 'TERKONFIRMASI',
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

      <Header title="Riwayat Konfirmasi Ganti Tutor" />

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
                <Card.Title title={'Konfirmasi Ganti Tutor'} />
                <Card.Content>
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama Guru"
                    value={item.guru != null ? item.guru : 'BELUM TERSEDIA'}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Nama Siswa"
                    value={item.siswa}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Kelas"
                    value={item.kelas + ' ' + item.jenjang}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal Les"
                    value={new Date(item.tglles).toLocaleDateString()}
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal pergantian Tutor"
                    value={
                      item.tglpenggantian != null
                        ? new Date(item.tglpenggantian).toLocaleDateString()
                        : 'BELUM TERSEDIA'
                    }
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal Perpanjangan"
                    value={
                      item.tglperpanjang != null
                        ? new Date(item.tglperpanjang).toLocaleDateString()
                        : 'BELUM TERSEDIA'
                    }
                  />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Jumlah Pertemuan"
                    value={item.jumlah_pertemuan}
                  />

                  <CardKeyValue keyFlex={9} keyName="Hari" value={item.hari} />
                  <CardKeyValue
                    keyFlex={9}
                    keyName="Jam Les"
                    value={item.jamles}
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
                    keyName="Alasan"
                    value={item.alasan}
                  />
                </Card.Content>
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
