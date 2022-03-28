import React, {FC, useState, useEffect, useRef} from 'react';
import {EmptyData, Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {Card} from 'react-native-paper';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/core';

type LatihanType = {
  matkul: string;
  jenjang: string;
  kelas: string;
  jumlah_soal: string;
  idlatihan: string;
};

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Latihan'>,
  StackScreenProps<AppStackParamList>
>;

export const Latihan: FC<ScreenProps> = ({navigation}) => {
  // data
  // const [listData, setListData] = useState<any>([]);
  const listData = [
    {
      matkul: 'Matematika',
      jenjang: 'SD',
      kelas: '6',
      jumlah_soal: '20',
      idlatihan: '00',
    },
  ];
  // const [page, setPage] = useState(1);
  // loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocus = useIsFocused();
  const componentMounted = useRef(true); // (3) component is mounted
  // paging
  // const [buttonLoadMore, setButtonLoadMore] = useState(true);
  // const [displayButton, setDiplayButton] = useState(false);
  // const [loadingData, setLoadingData] = useState(false);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  // const loadMoreData = async () => {
  //   let NextPage = page + 1;
  //   await apiGet({
  //     url: '/les/histori',
  //     params: {
  //       page: NextPage,
  //       cari: '',
  //       status: '',
  //       orderBy: 'idles',
  //       sort: 'desc',
  //     },
  //   }).then(res => {
  //     // console.log(res.data.length);
  //     if (res.data == null) {
  //       setLoadingData(false);
  //       return setDiplayButton(false);
  //     }
  //     setListData(listData.concat(res.data));
  //     if (res.data.length < 10) {
  //       setDiplayButton(false);
  //     } else if (res.data.length == 10) {
  //       setLoadingData(false);
  //       setPage(NextPage);
  //     }
  //     setLoadingData(false);
  //   });
  // };
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      //   const data = await apiGet({
      //     url: '/les/histori',
      //     params: {
      //       page: 1,
      //       cari: '',
      //       status: '',
      //       orderBy: 'idles',
      //       sort: 'desc',
      //     },
      //   });
      //   if (componentMounted.current) {
      //     setListData(data.data);
      //     console.log('component mounted current');
      //   }
      if (isActive) {
        //     if (isLoadMoreData) {
        //       setListData(listData);
        //     } else {
        //       if (data.data.length == 10) {
        //         setDiplayButton(true);
        //         setButtonLoadMore(false);
        //       }
        //       setListData(data.data);
        //     }
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
      <Header noBackButton title="Latihan Soal" />

      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : listData == null ? (
        <EmptyData />
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.scrollContainer}
            data={listData}
            keyExtractor={(item: LatihanType) => item.idlatihan}
            renderItem={({item}: ListRenderItemInfo<LatihanType>) => (
              <StudentItem
                key={item.idlatihan}
                item={item}
                onPress={() => {
                  navigation.navigate<any>('Soal', {data: item});
                }}
              />
            )}
            extraData={listData}
            onEndReachedThreshold={0.1}
            // ListFooterComponent={
            //   <View
            //     style={{
            //       // padding: dimens.standard,
            //       paddingVertical: dimens.small,
            //     }}>
            //     {displayButton && (
            //       <Button
            //         loading={loadingData}
            //         onPress={() => {
            //           setLoadMoreData(true);
            //           setLoadingData(true);
            //           loadMoreData();
            //         }}
            //         mode="contained"
            //         disabled={buttonLoadMore}
            //         style={{
            //           marginTop: 10,
            //           alignSelf: 'center',
            //           marginHorizontal: 10,
            //         }}>
            //         Load More Data
            //       </Button>
            //     )}
            //   </View>
            // }
          />
        </>
      )}
    </SafeAreaView>
  );
};
const StudentItem: FC<{item: LatihanType; onPress: () => void}> = ({
  item,
  onPress,
}) => {
  return (
    <Card style={{marginTop: dimens.standard}} onPress={onPress}>
      <Card.Title
        title={item.matkul + ' ' + item.jenjang + ' ' + item.kelas}
        subtitle={`jumlah soal ${item.jumlah_soal}`}
      />

      {/* <Card.Content>
        <CardKeyValue keyName="Siswa" value={item.siswa} />
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
      </Card.Content> */}
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
