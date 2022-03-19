import React, {FC, useState, useEffect, useRef} from 'react';
import {
  CardKeyValue,
  EmptyData,
  FABList,
  Header,
  OneLineInfo,
  SkeletonLoading,
} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {Card, Chip, Button} from 'react-native-paper';
import dayjs from 'dayjs';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type LesType = {
  namaLes: string;
  totalPertemuan: number;
  siswa: string;
  jumlah_pertemuan: number;
  pertemuanSelesai: number | null;
  tglMulai: number | null;
  tglSelesai: number | null;
  statusles: number | null;
  idles: string;
};

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Les'>,
  StackScreenProps<AppStackParamList>
>;

export const Les: FC<ScreenProps> = ({navigation}) => {
  const [listData, setListData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const isFocus = useIsFocused();
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDiplayButton] = useState(false);
  const componentMounted = useRef(true); // (3) component is mounted
  const [loadingData, setLoadingData] = useState(false);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: '/les/histori',
      params: {
        page: NextPage,
        cari: '',
        status: '',
        orderBy: 'idles',
        sort: 'desc',
      },
    }).then(res => {
      // console.log(res.data.length);
      if (res.data == null) {
        setLoadingData(false);
        return setDiplayButton(false);
      }
      setListData(listData.concat(res.data));
      if (res.data.length < 10) {
        setDiplayButton(false);
      } else if (res.data.length == 10) {
        setButtonLoadMore(false);
        setPage(NextPage);
      }
      setLoadingData(false);
    });
  };
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/les/histori',
        params: {
          page: 1,
          cari: '',
          status: '',
          orderBy: 'idles',
          sort: 'desc',
        },
      });
      if (componentMounted.current) {
        setListData(data.data);
        console.log('component mounted current');
      }
      if (isActive) {
        if (isLoadMoreData) {
          setListData(listData);
        } else {
          if (data.data.length == 10) {
            setDiplayButton(true);
            setButtonLoadMore(false);
          }
          setListData(data.data);
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
  }, [isRefreshing, isLoading, isFocus, listData, isLoadMoreData]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />
      <Header noBackButton title="Daftar Les" />

      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : listData == null ? (
        <EmptyData />
      ) : (
        <>
          <FlatList
            ListHeaderComponent={
              <OneLineInfo info="Klik item untuk melihat detail" />
            }
            contentContainerStyle={styles.scrollContainer}
            data={listData}
            keyExtractor={(item: LesType) => item.idles}
            renderItem={({item}: ListRenderItemInfo<LesType>) => (
              <StudentItem
                key={item.idles}
                item={item}
                onPress={() => {
                  navigation.navigate<any>('DetailLes', {data: item});
                }}
              />
            )}
            extraData={listData}
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
      {/* <Gap y={72} /> */}
      {/* </ScrollView> */}

      {/* Add button */}
      <FABList
        label="Tambah Les Baru"
        onPress={() => {
          navigation.navigate('AddLes');
        }}
      />
    </SafeAreaView>
  );
};

const StudentItem: FC<{item: LesType; onPress: () => void}> = ({
  item,
  onPress,
}) => {
  const tglMulai =
    item.tglMulai && dayjs.unix(item.tglMulai).format('DD MMMM YYYY');
  const tglSelesai =
    item.tglSelesai && dayjs.unix(item.tglSelesai).format('DD MMMM YYYY');
  const jmlhPertemuanSelesai = item.pertemuanSelesai
    ? `${item.pertemuanSelesai}/`
    : '';

  const statusData = () => {
    if (item.statusles == 0) {
      return {text: 'Menunggu ada tutor', bgColor: '#93C5FD'};
    }
    // if (item.statusles === 1) {
    //   return {text: 'Belum pilih tutor', bgColor: '#FBBF24'};
    // }
    if (item.statusles === 2) {
      return {text: 'Belum bayar les', bgColor: '#F87171'};
    }
    if (item.statusles === 3) {
      return {text: 'Menunggu konfirmasi les', bgColor: color.bg_grey};
    }
    if (item.statusles === 4) {
      return {text: 'Les telah berjalan', bgColor: color.green_500};
    }
    if (item.statusles === 5) {
      return {text: 'Pembayaran ditolak', bgColor: color.red};
    }
    return null;
  };

  return (
    <Card style={{marginTop: dimens.standard}} onPress={onPress}>
      <Card.Title
        title={item.namaLes}
        subtitle={`${jmlhPertemuanSelesai}${item.jumlah_pertemuan} Pertemuan`}
      />

      <Card.Content>
        <CardKeyValue keyName="Siswa" value={item.siswa} />
        {/* {item.tutor && <CardKeyValue keyName="Tutor" value={item.tutor} />} */}
        {tglMulai && tglSelesai && (
          <>
            <CardKeyValue keyName="Tgl Mulai" value={tglMulai} />
            <CardKeyValue keyName="Tgl Selesai" value={tglSelesai} />
          </>
        )}

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {statusData() && (
            <Chip
              icon="cash-multiple"
              style={[
                styles.chipStatus,
                {backgroundColor: statusData()?.bgColor},
              ]}>
              {statusData()?.text}
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
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
  chipStatus: {
    marginTop: dimens.small,
    marginRight: dimens.small,
  },
});
