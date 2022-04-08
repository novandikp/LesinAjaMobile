import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Gap, Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ListRenderItemInfo,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  Card,
  DataTable,
  FAB,
  Portal,
  Provider,
  Button,
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'Laporan'>,
  StackScreenProps<AppStackParamList>
>;
type pemasukanItem = {
  idkeuangan: string;
  tglkeuangan: string;
  masuk: string;
  keluar: string;
  keterangan: string;
  saldo: string;
};

export const Laporan: FC<ScreenProps> = ({navigation}) => {
  // Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocus = useIsFocused();
  const componentMounted = useRef(true);
  // paging pemasukan
  const [buttonLoadMorePemasukan, setButtonLoadMorePemasukan] = useState(true);
  const [displayButtonPemasukan, setDiplayButtonPemasukan] = useState(false);
  const [loadingDataPemasukan, setLoadingDataPemasukan] = useState(false);
  const [isLoadMoreDataPemasukan, setLoadMoreDataPemasukan] = useState(false);
  const [pagePemasukan, setPagePemasukan] = useState(1);
  // paging Pengeluaran
  const [buttonLoadMorePengeluaran, setButtonLoadMorePengeluaran] =
    useState(true);
  const [displayButtonPengeluaran, setDiplayButtonPengeluaran] =
    useState(false);
  const [loadingDataPengeluaran, setLoadingDataPengeluaran] = useState(false);
  const [isLoadMoreDataPengeluaran, setLoadMoreDataPengeluaran] =
    useState(false);
  const [pagePengeluaran, setPagePengeluaran] = useState(1);
  const loadMoreDataPemasukan = async () => {
    let NextPage = pagePemasukan + 1;
    await apiGet({
      url: '/keuangan/pemasukan',
      params: {
        page: NextPage,
        cari: '',
        sort: 'ASC',
      },
    }).then(res => {
      if (res.data.data.length == 0) {
        setLoadingDataPemasukan(false);
        return setDiplayButtonPemasukan(false);
      } else if (res.data.length != 0) {
        let newArray = pemasukan.concat(res.data.data);
        setPemasukan(newArray);
        if (res.data.length < 10) {
          setDiplayButtonPemasukan(false);
        } else if (res.data.length == 10) {
          setLoadingDataPemasukan(false);
          setPagePemasukan(NextPage);
        }
        setLoadingDataPemasukan(false);
      }
    });
  };
  const loadMoreDataPengeluaran = async () => {
    let NextPagePengeluaran = pagePengeluaran + 1;
    await apiGet({
      url: '/keuangan/pengeluaran',
      params: {
        page: NextPagePengeluaran,
        cari: '',
        sort: 'ASC',
      },
    }).then(res => {
      if (res.data.data.length == 0) {
        setLoadingDataPengeluaran(false);
        return setDiplayButtonPengeluaran(false);
      } else if (res.data.data.length != 0) {
        let newArray = pengeluaran.concat(res.data.data);
        setPengeluaran(newArray);
        if (res.data.data.length < 10) {
          setDiplayButtonPengeluaran(false);
          setLoadingDataPengeluaran(false);
        } else if (res.data.data.length == 10) {
          setLoadingDataPengeluaran(false);
          setPagePengeluaran(NextPagePengeluaran);
          setLoadingDataPengeluaran(false);
          // return setPengeluaran(pengeluaran.concat(res.data.data));
        }
      }
    });
  };
  // Data
  const [openFab, setOpenFab] = useState(false);
  const [pemasukan, setPemasukan] = useState<any>([]);
  const [pengeluaran, setPengeluaran] = useState<any>([]);
  const [sadaqah, setSadaqah] = useState([
    {tgl: '2021-09-15', nominal: '20.000'},
  ]);
  const [laporanMurid, setLaporanMurid] = useState([
    {
      tgl: '17 September 2021',
      wali: 'John Doe',
      siswa: 'Jean Doe',
      Nominal: 'Rp 200.000',
    },
  ]);
  const [laporanLes, setLaporanLes] = useState([
    {
      tgl: '17 September 2021',
      wali: 'John Doe',
      siswa: 'Jean Doe',
      Nominal: 'Rp 200.000',
    },
  ]);
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const dataPemasukan = await apiGet({
        url: '/keuangan/pemasukan',
        params: {
          page: 1,
          cari: '',
          sort: 'ASC',
        },
      });
      const dataPengeluaran = await apiGet({
        // ?page=1&cari=&sort=ASC
        url: '/keuangan/pengeluaran',
        params: {
          page: 1,
          cari: '',
          sort: 'ASC',
        },
      });
      // console.log(dataPemasukan.data);
      if (componentMounted.current) {
        setPemasukan(dataPemasukan.data.data);
        setPengeluaran(dataPengeluaran.data.data);
      }
      if (isActive) {
        if (isLoadMoreDataPemasukan) {
          setPemasukan(pemasukan);
        } else if (isLoadMoreDataPemasukan == false) {
          if (dataPemasukan.data.data.length == 10) {
            setDiplayButtonPemasukan(true);
            setButtonLoadMorePemasukan(false);
          }
          setPemasukan(dataPemasukan.data.data);
        }
        if (isLoadMoreDataPengeluaran) {
          setPengeluaran(pengeluaran);
        } else if (isLoadMoreDataPengeluaran == false) {
          if (dataPengeluaran.data.data.length == 10) {
            setDiplayButtonPengeluaran(true);
            setButtonLoadMorePengeluaran(false);
            setPengeluaran(dataPengeluaran.data.data);
          }
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
      isActive = false;
    };
  }, [
    isFocus,
    isLoadMoreDataPemasukan,
    isLoadMoreDataPengeluaran,
    isLoading,
    isRefreshing,
    pemasukan,
    pengeluaran,
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Laporan Keuangan" withFilter noBackButton />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, padding: dimens.standard}}>
            <Card>
              <Card.Title title="Desember 2021" subtitle="Rangkuman" />
              <Card.Content>
                <CardKeyValue
                  keyFlex={9}
                  keyName="Pemasukan biaya les"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Pembayaran Tutor"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Laba Kotor"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Penjualan"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Sadaqah"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Pengeluaran"
                  value="Rp 500.000"
                />
                <CardKeyValue
                  keyFlex={9}
                  keyName="Laba bersih"
                  value="Rp 1.316.374"
                />
              </Card.Content>
            </Card>

            {/* pemasukan */}
            <Card style={{marginTop: dimens.large}}>
              <Card.Title title="Penjualan" />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{minWidth: 100}}>
                      Tanggal
                    </DataTable.Title>
                    {/*<DataTable.Title style={{minWidth: 100}}>
                    Jumlah
                  </DataTable.Title> */}
                    <DataTable.Title style={{minWidth: 100}}>
                      Keterangan
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nominal
                    </DataTable.Title>
                  </DataTable.Header>
                  {/* {pemasukan.map((item: any, key: number) => {
                    return
                  })} */}
                  <FlatList
                    data={pemasukan}
                    keyExtractor={(item: pemasukanItem) => item.idkeuangan}
                    renderItem={({item}: ListRenderItemInfo<pemasukanItem>) => (
                      <PenjualanRow item={item} key={item.idkeuangan} />
                    )}
                    extraData={pemasukan}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                      <View
                        style={{
                          // padding: dimens.standard,
                          paddingVertical: dimens.small,
                        }}>
                        {displayButtonPemasukan && (
                          <Button
                            loading={loadingDataPemasukan}
                            onPress={() => {
                              setLoadMoreDataPemasukan(true);
                              setLoadingDataPemasukan(true);
                              loadMoreDataPemasukan();
                            }}
                            mode="contained"
                            disabled={buttonLoadMorePemasukan}
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
                  {/* {console.log(penjualan)} */}
                </DataTable>
              </ScrollView>
            </Card>

            {/* Pengeluaran */}
            <Card style={{marginTop: dimens.large}}>
              <Card.Title title="Pengeluaran" />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{minWidth: 100}}>
                      Tanggal
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Keterangan
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nominal
                    </DataTable.Title>
                  </DataTable.Header>
                  {/* {pengeluaran.map((item: any, key: number) => {
                    return 
                  })} */}
                  <FlatList
                    data={pengeluaran}
                    keyExtractor={(item: pemasukanItem) => item.idkeuangan}
                    renderItem={({item}: ListRenderItemInfo<pemasukanItem>) => (
                      <PengeluaranRow item={item} key={item.idkeuangan} />
                    )}
                    extraData={pengeluaran}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                      <View
                        style={{
                          // padding: dimens.standard,
                          paddingVertical: dimens.small,
                        }}>
                        {displayButtonPengeluaran && (
                          <Button
                            loading={loadingDataPengeluaran}
                            onPress={() => {
                              setLoadMoreDataPengeluaran(true);
                              setLoadingDataPengeluaran(true);
                              loadMoreDataPengeluaran();
                            }}
                            mode="contained"
                            disabled={buttonLoadMorePengeluaran}
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
                </DataTable>
              </ScrollView>
            </Card>

            {/* Sadaqah */}
            <Card style={{marginTop: dimens.large}}>
              <Card.Title title="Sadaqah" />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{minWidth: 100}}>
                      Tanggal
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nominal
                    </DataTable.Title>
                  </DataTable.Header>
                  {sadaqah.map((item, key) => {
                    return <SadaqahRow item={item} key={key} />;
                  })}
                </DataTable>
              </ScrollView>
            </Card>

            {/* laporan Murid */}
            <Card style={{marginTop: dimens.large}}>
              <Card.Title title="Laporan Murid" />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{minWidth: 100}}>
                      Tanggal
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nama Wali Murid
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nama Siswa
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nominal
                    </DataTable.Title>
                  </DataTable.Header>
                  {laporanMurid.map((item, key) => {
                    return <LaporanSiswaLesRow item={item} key={key} />;
                  })}
                </DataTable>
              </ScrollView>
            </Card>

            {/* laporan les */}
            <Card style={{marginTop: dimens.large}}>
              <Card.Title title="Laporan Les" />
              <ScrollView horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={{minWidth: 100}}>
                      Tanggal
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nama Wali Murid
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nama Siswa
                    </DataTable.Title>
                    <DataTable.Title style={{minWidth: 100}}>
                      Nominal
                    </DataTable.Title>
                  </DataTable.Header>
                  {laporanLes.map((item, key) => {
                    return <LaporanSiswaLesRow item={item} key={key} />;
                  })}
                </DataTable>
              </ScrollView>
            </Card>
          </View>

          <Gap y={100} />
        </ScrollView>
      )}
      {/* FAB */}
      <Provider>
        <Portal>
          <FAB.Group
            fabStyle={{marginBottom: 45, marginRight: 40}}
            visible
            open={openFab}
            icon={openFab ? 'close' : 'plus'}
            actions={[
              {
                icon: 'cash-multiple',
                label: 'Input Pemasukan',
                onPress: () =>
                  navigation.navigate<any>('InputLaporan', {
                    detailType: 'Pemasukan',
                  }),
                // navigation.navigate<any>('inputLaporan)
                small: false,
                style: {marginRight: 40},
              },
              {
                icon: 'bell',
                label: 'Input Pengeluaran',
                onPress: () =>
                  navigation.navigate<any>('InputLaporan', {
                    detailType: 'Pengeluaran',
                  }),
                small: false,
                style: {marginRight: 40},
              },
              {
                icon: 'credit-card-outline',
                label: 'Input Sadaqah',
                onPress: () => console.log(''),
                small: false,
                style: {marginRight: 40},
              },
            ]}
            onStateChange={({open}) => {
              setOpenFab(open);
            }}
            onPress={() => {
              if (openFab) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
    </SafeAreaView>
  );
};

const PenjualanRow: FC<{item: any}> = ({item}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={{minWidth: 100}}>
        {new Date(item.tglkeuangan).toISOString().slice(0, 10)}
      </DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100, marginLeft: 10}}>
        {item.keterangan}
      </DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.masuk}</DataTable.Cell>
      {/* <DataTable.Cell style={{minWidth: 100}}>{item.nominal}</DataTable.Cell> */}
    </DataTable.Row>
  );
};
const PengeluaranRow: FC<{item: any}> = ({item}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={{minWidth: 100}}>
        {new Date(item.tglkeuangan).toISOString().slice(0, 10)}
      </DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.keterangan}</DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.keluar}</DataTable.Cell>
    </DataTable.Row>
  );
};
const SadaqahRow: FC<{item: any}> = ({item}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={{minWidth: 100}}>{item.tgl}</DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.nominal}</DataTable.Cell>
    </DataTable.Row>
  );
};
const LaporanSiswaLesRow: FC<{item: any}> = ({item}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={{minWidth: 100}}>{item.tgl}</DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.wali}</DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.siswa}</DataTable.Cell>
      <DataTable.Cell style={{minWidth: 100}}>{item.nominal}</DataTable.Cell>
    </DataTable.Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
