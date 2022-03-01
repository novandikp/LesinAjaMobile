import React, {FC, useState, useEffect} from 'react';
import {CardKeyValue, Gap, Header} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Card, DataTable, FAB, Portal, Provider} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {apiGet} from '@utils';

type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'Laporan'>,
  StackScreenProps<AppStackParamList>
>;
export const Laporan: FC<ScreenProps> = ({navigation}) => {
  const [openFab, setOpenFab] = useState(false);
  const [penjualan, setPenjualan] = useState<any>([]);
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
    const getInitialData = async () => {
      const dataPemasukan = await apiGet({
        url: '/keuangan/pemasukan?page=1&cari=&sort=ASC',
      });
      const dataPengeluaran = await apiGet({
        url: '/keuangan/pengeluaran?page=1&cari=&sort=ASC',
      });
      // console.log(dataPemasukan.data);
      setPenjualan(dataPemasukan.data.data);
      setPengeluaran(dataPengeluaran.data.data);
    };
    getInitialData();
    return () => {
      // isActive = false;
    };
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Laporan Keuangan" withFilter noBackButton />

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
              <CardKeyValue keyFlex={9} keyName="Sadaqah" value="Rp 500.000" />
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

          {/* Penjualan */}
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
                {penjualan.map((item: any, key: number) => {
                  return <PenjualanRow item={item} key={key} />;
                })}
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
                {pengeluaran.map((item: any, key: number) => {
                  return <PengeluaranRow item={item} key={key} />;
                })}
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
