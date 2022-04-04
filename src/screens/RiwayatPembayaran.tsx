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
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/core';

import {apiGet} from '@utils';
type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'RiwayatPembayaran'>,
  StackScreenProps<AppStackParamList>
>;
type riwayatItem = {
  tanggalbayar: string;
  jumlah_gaji: string;
  bukti: string;
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
  idbayartutor: string;
};
export const RiwayatPembayaran: FC<ScreenProps> = ({}) => {
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
        url: '/admin/guru/pembayaran',
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
      url: '/admin/guru/pembayaran',
      params: {
        page: NextPage,
        orderBy: 'guru',
        guru: '',
        sort: 'desc',
      },
    }).then(res => {
      if (res.data == null) {
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

      <Header title="Riwayat Pembayaran" noBackButton />

      {/* <ScrollView contentContainerStyle={{flexGrow: 1}}> */}
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={riwayat}
            keyExtractor={(item: riwayatItem) => item.idbayartutor}
            renderItem={({item}: ListRenderItemInfo<riwayatItem>) => (
              <Card key={item.idbayartutor} style={{marginBottom: 10}}>
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

                  <CardKeyValue
                    keyFlex={9}
                    keyName="Tanggal Pembayaran"
                    value={new Date(item.tanggalbayar).toLocaleDateString()}
                  />
                </Card.Content>
              </Card>
            )}
            extraData={riwayat}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              <View
                style={{
                  // padding: dimens.standard,
                  paddingVertical: dimens.small,
                }}>
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
        </>
      )}
      {/* <View style={{flex: 1, padding: dimens.standard}}>
        {riwayat.map((item: any, key) => {
          return (
            
          );
        })}
      </View> */}
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
