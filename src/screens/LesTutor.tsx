import React, {FC, useState, useEffect} from 'react';
import {
  CardKeyValue,
  EmptyData,
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
  ScrollView,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {Card, Chip, Button} from 'react-native-paper';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type LesType = {
  statusles: number;
  biaya: number;
  tglles: string;
  kelas: string;
  hari: string;
  idles: number;
  idpaket: number;
  idortu: number;
  jamles: string;
  jenjang: string;
  jumlah_pertemuan: number;
  jeniskelamin: string;
  paket: string;
  siswa: string;
};

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'LesTutor'>,
  StackScreenProps<AppStackParamList>
>;
export const LesTutor: FC<ScreenProps> = ({navigation}) => {
  const [isEmptyData, setisEmptyData] = useState(false);
  const [lesItems, setLesItem] = useState([]);
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDisplayButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  const [page, setPage] = useState(1);
  //loading page
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocus = useIsFocused();
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: '/siswa/my',
      params: {
        page: NextPage,
        siswa: '',
        orderBy: 'siswa',
        sort: 'asc',
      },
    })
      .then(res => {
        if (res.data == null) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setLesItem(lesItems.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          return setDisplayButton(false);
        } else if (res.data.length == 10) {
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
      const siswaku = await apiGet({
        url: '/siswa/my',
        params: {
          page: '1',
          siswa: '',
          orderBy: 'siswa',
          sort: 'asc',
        },
      });
      if (isActive) {
        if (isLoadMoreData) {
          setLesItem(lesItems);
        }
        if (siswaku.data == null) {
          setisEmptyData(true);
        } else if (siswaku.data != null) {
          if (siswaku.data.length == 10) {
            setButtonLoadMore(false);
            setDisplayButton(true);
          }
          setLesItem(siswaku.data);
        }
        // setSelf(myself.data);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      isActive = false;
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />
      <Header
        noBackButton
        withFilter
        title="Daftar Les"
        // onPressFilter={() => {
        // alert('Belum jadi');
        // }}
      />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : isEmptyData ? (
        <EmptyData />
      ) : (
        <>
          <FlatList
            ListHeaderComponent={
              <>
                <OneLineInfo info="Klik item untuk melihat detail" />
              </>
            }
            data={lesItems}
            keyExtractor={(item: LesType, index: number) => index.toString()}
            renderItem={({item}: ListRenderItemInfo<LesType>) => (
              <>
                <StudentItem
                  item={item}
                  onPress={() => {
                    navigation.navigate<any>('DetailLesTutor', {data: item});
                  }}
                />
              </>
            )}
            extraData={lesItems}
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
        </>
      )}
    </SafeAreaView>
  );
};

const StudentItem: FC<{item: LesType; onPress: () => void}> = ({
  item,
  onPress,
}) => {
  const tglMulai = new Date(item.tglles).toLocaleDateString();
  const jmlhPertemuan = item.jumlah_pertemuan ? `${item.jumlah_pertemuan}` : '';

  const statusData = () => {
    if (item.statusles == 4) {
      return {text: 'Sedang berlangsung ', bgColor: color.green_500};
    }
    if (item.statusles == 3) {
      return {
        text: 'Sedang menunggu konfirmasi pembayaran ',
        bgColor: color.green_500,
      };
    }
    if (item.statusles == 5) {
      return {
        text: 'Pembayaran ditolak',
        bgColor: color.green_500,
      };
    }
    return null;
  };

  return (
    <Card style={{marginTop: dimens.standard}} onPress={onPress}>
      <Card.Title
        title={item.paket + item.jenjang}
        subtitle={`${jmlhPertemuan} Pertemuan`}
        // /${item.totalPertemuan}
      />

      <Card.Content>
        <CardKeyValue keyName="Siswa" value={item.siswa} />
        <CardKeyValue keyName="Tgl Mulai" value={tglMulai} />
        <CardKeyValue keyName="Jam" value={item.jamles} />

        {/* {item.tutor && <CardKeyValue keyName="Tutor" value={item.tutor} />}
        {tglMulai && tglSelesai && (
          <>
            // <CardKeyValue keyName="Tgl Mulai" value={tglMulai} />
            // <CardKeyValue keyName="Tgl Selesai" value={tglSelesai} />
          </>
        )} */}
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {statusData() && (
            <Chip
              icon="account-clock"
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
