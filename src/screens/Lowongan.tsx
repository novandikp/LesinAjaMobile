import React, {FC, useState, useEffect, useRef} from 'react';
import {Header, NestedCard, OneLineInfo, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
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
import {useIsFocused} from '@react-navigation/core';

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
  alamat: string;
};
export const Lowongan: FC<ScreenProps> = ({navigation}) => {
  const [lowonganList, setLowonganList] = useState<any>([]);
  const [filterJenjang, setFilterJenjang] = useState<any>();
  const [filterPrefrensi, setFilterPrenfrensi] = useState();
  const [modalFilter, setModalFilter] = useState(false);
  const [listJenjang, setListJenjang] = useState([]);
  const [jenjang, setJenjang] = useState();
  const [idkecamatan, setIdKecamatan] = useState();
  //update data
  const [page, setPage] = useState(1);
  const [filterOn, setFilterOn] = useState(false);
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDisplayButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  // Loading page
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreData, setLoadMoreData] = useState(false);

  const loadMoreData = async () => {
    console.log(idkecamatan);
    let NextPage = page + 1;
    await apiGet({
      url: '/lowongan/' + idkecamatan,
      params: {
        page: NextPage,
        cari: '',
        orderBy: 'idlowongan',
        sort: 'desc',
        jenjang: filterJenjang,
        prefrensi: filterPrefrensi,
      },
    })
      .then(res => {
        if (res.data.length == 0) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setLowonganList(lowonganList.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          return setDisplayButton(false);
        } else if (res.data.length == 10) {
          setLoadingData(false);
          setButtonLoadMore(false);
          setPage(NextPage);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const tutor = await apiGet({url: '/guru/profile'});
      setFilterPrenfrensi(tutor.data.jeniskelaminguru);
      if (tutor.data.idkecamatan != null) {
        const lowonganKabupaten = await apiGet({
          url: '/lowongan/' + tutor.data.idkecamatan,
          params: {
            page: 1,
            cari: '',
            orderBy: 'idlowongan',
            sort: 'desc',
            jenjang: filterJenjang,
            prefrensi: tutor.data.jeniskelaminguru,
          },
        });
        const dataJenjang = await apiGet({url: '/paket/jenjang'});
        if (componentMounted.current) {
          setLowonganList(lowonganKabupaten.data);
          setIdKecamatan(tutor.data.idkecamatan);
          setListJenjang(dataJenjang.data);
          console.log('component mounted current');
        }
        if (isActive) {
          if (isLoadMoreData) {
            if (filterOn == true) {
              setLowonganList(lowonganKabupaten.data);
            } else {
              setLowonganList(lowonganList);
            }
          } else {
            if (lowonganKabupaten.data.length == 10) {
              setButtonLoadMore(false);
              setDisplayButton(true);
            }
            setLowonganList(lowonganKabupaten.data);
          }
          setIdKecamatan(tutor.data.idkecamatan);
          setListJenjang(dataJenjang.data);
          setFilterOn(false);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      } else if (tutor.data.idkecamatan == null) {
        if (isActive) {
          console.log('tutor data null');
          setLowonganList(null);
          setIsLoading(false);
          setIsRefreshing(false);
        }
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
    lowonganList,
    listJenjang,
    filterJenjang,
    filterPrefrensi,
    page,
    isRefreshing,
    isLoading,
    isFocus,
    isLoadMoreData,
    filterOn,
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
              <Picker.Item label="SEMUA" value="SEMUA" />
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
          {/* <Card.Actions style={{alignContent: 'flex-end'}}> */}

          <Button
            style={{alignSelf: 'flex-end'}}
            onPress={() => {
              if (jenjang == null) {
                setFilterJenjang(null);
                setFilterOn(true);
                setIsRefreshing(true);
                setModalFilter(false);
              } else if (jenjang == 'SEMUA') {
                setFilterJenjang(null);
                setFilterOn(true);
                setIsRefreshing(true);
                setModalFilter(false);
              } else {
                setFilterJenjang(jenjang);
                setFilterOn(true);
                setModalFilter(false);
              }
            }}>
            ok
          </Button>
          {/* </Card.Actions> */}
        </Card>
      </Modal>
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : lowonganList == null ? (
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
      ) : lowonganList.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <View>
              <OneLineInfo info="Klik item untuk melihat detail" />
            </View>
          }
          contentContainerStyle={styles.scrollContainer}
          data={lowonganList}
          keyExtractor={(item: ItemType) => item.idlowongan}
          renderItem={({item}: ListRenderItemInfo<ItemType>) => (
            <NestedCard
              key={item.idlowongan}
              title={'' + item.paket + ' ' + item.jenjang}
              subtitle={
                `${item.jumlah_pertemuan} pertemuan`
                // item.siswa
              }
              additionalText={
                'Gaji Rp.' +
                item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
              }
              onPress={() => {
                navigation.navigate<any>('DetailLowongan', {item});
              }}
            />
          )}
          extraData={lowonganList}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            <View>
              {displayButton == true && (
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
