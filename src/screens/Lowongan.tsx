import React, {FC, useState, useEffect, useRef} from 'react';
import {Header, NestedCard, OneLineInfo} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  ListRenderItemInfo,
} from 'react-native';
import {Headline, Subheading, Card, Button, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {apiGet} from '@utils';
import {Picker} from '@react-native-picker/picker';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Lowongan'>,
  StackScreenProps<AppStackParamList>
>;
type FormDataType = {
  jenjang: string;
  prefrensi: string;
};
type ItemType = {
  idlowongan: string;
  statuslowongan: string;
  idles: string;
  idpaket: string;
  idsiswa: string;
  tglles: string;
  jamles: string;
  hari: string;
  prefrensi: string;
  statusles: string;
  paket: string;
  jumlah_pertemuan: string;
  biaya: string;
  siswa: string;
  jenjang: string;
  kelas: string;
  jeniskelamin: string;
  gaji: number;
};
export const Lowongan: FC<ScreenProps> = ({navigation}) => {
  const [lowonganList, setLowonganList] = useState<any>([]);
  const [filterJenjang, setFilterJenjang] = useState();
  const [filterPrefrensi, setFilterPrenfrensi] = useState();
  const [page, setPage] = useState(1);
  const [modalFilter, setModalFilter] = useState(false);
  const [listJenjang, setListJenjang] = useState([]);
  const [jenjang, setJenjang] = useState();
  const [prefrensi, setPrefrensi] = useState();
  const [idkabupaten, setIdKabupaten] = useState();
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: '/lowongan/' + idkabupaten,
      params: {
        page: NextPage,
        cari: '',
        orderBy: 'idlowongan',
        sort: 'ASC',
        jenjang: filterJenjang,
        prefrensi: filterPrefrensi,
      },
    }).then(res => {
      setLowonganList(lowonganList.concat(res.data));
      if (res.data.length < 10) {
        setButtonLoadMore(true);
        setIsRefreshing(true);
      } else if (res.data.length == 10) {
        setButtonLoadMore(false);
      }
    });
    // setPage(NextPage);
  };
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const tutor = await apiGet({url: '/guru/profile'});
      if (tutor.data.idkecamatan != null) {
        const lowonganKabupaten = await apiGet({
          url: '/lowongan/' + tutor.data.idkecamatan,
          params: {
            page: 1,
            cari: '',
            orderBy: 'idlowongan',
            sort: 'ASC',
            jenjang: filterJenjang,
            prefrensi: filterPrefrensi,
          },
        });
        const dataJenjang = await apiGet({url: '/paket/jenjang'});
        if (lowonganKabupaten.data.length == 10) {
          setButtonLoadMore(false);
        }
        if (componentMounted) {
          setIdKabupaten(tutor.data.idkecamatan);
        }
        if (isActive) {
          setLowonganList(lowonganKabupaten.data);
          setListJenjang(dataJenjang.data);
          setIsRefreshing(false);
          // setLowonganList(lowonganList.concat(lowonganKabupaten.data));
        }
      } else if (tutor.data.idkecamatan == null) {
        if (isActive) {
          setLowonganList(null);
        }
      }
    };
    if (isRefreshing) {
      getInitialData();
    }
    // loadMoreData();
    return () => {
      isActive = false;
      // cancelApiRequest();
    };
  }, [
    lowonganList,
    listJenjang,
    filterJenjang,
    filterPrefrensi,
    page,
    isRefreshing,
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        title="Lowongan"
        withFilter={true}
        onPressFilter={() => setModalFilter(true)}
      />

      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      <OneLineInfo info="Klik item untuk melihat detail" />
      <Modal
        isVisible={modalFilter}
        onBackdropPress={() => setModalFilter(false)}>
        <Card
          style={{
            paddingVertical: 15,
          }}>
          <Text
            style={{
              fontSize: 22,
              paddingVertical: 10,
              textAlign: 'center',
            }}>
            Filter Lowongan
          </Text>
          <View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              maxHeight: 40,
            }}>
            {/* {' '} */}
            <Text
              style={{
                fontSize: 15,
                flex: 1,
                paddingTop: 20,
              }}>
              Jenjang:
            </Text>
            <Picker
              style={{flex: 2}}
              mode="dropdown"
              selectedValue={jenjang}
              itemStyle={{height: 10, backgroundColor: 'white'}}
              onValueChange={itemValue => setJenjang(itemValue)}>
              {listJenjang.map((item: any, index: number) => {
                return (
                  <Picker.Item
                    key={index}
                    label={item.jenjang}
                    value={item.jenjang}
                  />
                );
              })}
            </Picker>
          </View>

          <View
            style={{
              marginHorizontal: 20,
              flexDirection: 'row',
              maxHeight: 40,
            }}>
            {/* {' '} */}
            <Text
              style={{
                fontSize: 15,
                flex: 1,
                paddingTop: 20,
              }}>
              Prefrensi:
            </Text>
            <Picker
              style={{flex: 2}}
              mode="dropdown"
              // mode="dialog"
              selectedValue={prefrensi}
              itemStyle={{height: 10, backgroundColor: 'white'}}
              onValueChange={itemValue => setPrefrensi(itemValue)}>
              <Picker.Item label="Wanita" value="Wanita" />
              <Picker.Item label="Pria" value="Pria" />
              <Picker.Item label="Bebas" value="Bebas" />
            </Picker>
          </View>
          <Button
            style={{maxWidth: 100, alignSelf: 'flex-end', marginRight: 20}}
            onPress={() => {
              setFilterJenjang(jenjang);
              setFilterPrenfrensi(prefrensi);
              setModalFilter(false);
            }}>
            ok
          </Button>
        </Card>
      </Modal>

      {lowonganList != null ? (
        // lowonganList.map((item: any, index: number) => {
        //   return (
        //     <NestedCard
        //       key={index}
        //       title={'' + item.paket + ' ' + item.jenjang}
        //       subtitle={`${item.jumlah_pertemuan} pertemuan `}
        //       additionalText={
        //         'Rp.' + item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        //       }
        //       onPress={() => {
        //         navigation.navigate<any>('DetailLowongan', {item});
        //       }}
        //     />
        //   );
        // })
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={lowonganList}
          keyExtractor={(item: ItemType) => item.idlowongan}
          renderItem={({item}: ListRenderItemInfo<ItemType>) => (
            <NestedCard
              key={item.idlowongan}
              title={'' + item.paket + ' ' + item.jenjang + ' ' + item.siswa}
              subtitle={`${item.jumlah_pertemuan} pertemuan `}
              additionalText={
                'Rp.' + item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
              }
              onPress={() => {
                navigation.navigate<any>('DetailLowongan', {item});
              }}
            />
          )}
          // refreshControl={isRefreshing}
          // onEndReached={() => {
          //   loadMoreData();
          // }}
          extraData={lowonganList}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            <Button
              onPress={() => {
                loadMoreData();
              }}
              mode="contained"
              disabled={buttonLoadMore}
              // disabled={true}
              style={{
                alignSelf: 'center',
                // backgroundColor: color.green_500,
                marginHorizontal: 10,
              }}>
              Load More Data
            </Button>
          }
        />
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
      {/* </ScrollView> */}
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
  paragraph: {
    marginLeft: dimens.standard,
    marginBottom: dimens.standard,
    marginTop: 0,
    color: color.green_500,
  },
});
