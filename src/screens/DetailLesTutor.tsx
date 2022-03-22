import React, {FC, useEffect, useState, useRef} from 'react';
import {
  CardKeyValue,
  Gap,
  Header,
  NestedCard,
  SkeletonLoading,
} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  // ScrollView,
  FlatList,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {Card, Subheading, Button} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';
type JadwalType = {
  idabsen: string;
  tglabsen: string;
  flagabsen: number;
  flagabsenwali: number;
  paket: string;
  jumlah_pertemuan: number;
  siswa: string;
  jenjang: string;
  kelas: string;
  alamat_wali: string;
  guru: string;
  alamat_guru: string;
};
type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLesTutor'>;
export const DetailLesTutor: FC<ScreenProps> = ({navigation, route}) => {
  const {data}: any = route.params;
  const [coursePresenceList, setCoursePresenceList] = useState([]);
  // loading
  const [page, setPage] = useState(1);
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
    let NextPage = page + 1;
    await apiGet({
      url: '/jadwal/les/' + data.idles,
      params: {
        cari: '',
        orderBy: 'tglabsen',
        sort: 'asc',
        page: NextPage,
      },
      // '?cari=&orderBy=siswa&sort=desc&page=1',
    })
      .then(res => {
        if (res.data == null) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setCoursePresenceList(coursePresenceList.concat(res.data));
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
    console.log(data.idles);
    const getInitialData = async () => {
      const jadwalles = await apiGet({
        url: '/jadwal/les/' + data.idles,
        params: {
          cari: '',
          orderBy: 'tglabsen',
          sort: 'asc',
          page: '1',
        },
      });
      if (componentMounted.current) {
        setCoursePresenceList(jadwalles.data);
        console.log('component mounted current');
      }
      if (isActive) {
        if (isLoadMoreData) {
          setCoursePresenceList(coursePresenceList);
        } else {
          if (jadwalles.data.length == 10) {
            setButtonLoadMore(false);
            setDisplayButton(true);
          }
          setCoursePresenceList(jadwalles.data);
        }
        setIsLoading(false);
        setIsRefreshing(false);
      }
      // conso
    };
    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }

    return () => {
      isActive = false;
    };
  }, [
    coursePresenceList,
    data.idles,
    isFocus,
    isLoadMoreData,
    isLoading,
    isRefreshing,
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Les" />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <SafeAreaView
          style={{flexGrow: 1, padding: dimens.standard}}
          // contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}
        >
          {/* About Les */}
          <Card>
            <Card.Title
              title={data.paket + ' ' + data.kelas + ' ' + data.jenjang}
              subtitle={data.jumlah_pertemuan + ' pertemuan'}
            />
            <Card.Content>
              <CardKeyValue keyName="Siswa" value={data.siswa} keyFlex={8} />
              <CardKeyValue keyName="Tutor" value="-" keyFlex={8} />
              <CardKeyValue
                keyName="Tgl Mulai"
                value={new Date(data.tglles).toLocaleDateString()}
                // {coursePresenceList[0].tglabsen.toISOString()}
                keyFlex={8}
              />
              {/* <CardKeyValue keyName="Tgl Selesai" value="-" keyFlex={8} /> */}
            </Card.Content>
          </Card>

          {/* There is no applying tutor */}
          {data.statusles == 4 && (
            <Card style={{marginTop: dimens.standard}}>
              <Card.Title
                title="Sedang berlangsung"
                titleStyle={{color: color.green_500}}
              />
              <Card.Content>
                <Subheading>
                  {/* Menunggu wali murid konfirmasi tutor yang akan mengajar di les
                  ini */}
                  Les sedang berlangsung
                </Subheading>
              </Card.Content>
            </Card>
          )}
          {/* Presence */}
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Presensi Les"
              titleStyle={{color: '#2563EB'}}
              subtitle="Klik item untuk melihat detail presensi"
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
            <Card.Content>
              <FlatList
                // ListHeaderComponent={<></>}
                style={{
                  height: 400,
                  // minHeight
                }}
                nestedScrollEnabled={true}
                contentContainerStyle={{
                  flexGrow: 1,
                  padding: dimens.standard,
                  paddingTop: dimens.small,
                }}
                data={coursePresenceList}
                keyExtractor={(item: JadwalType) => item.idabsen}
                renderItem={({item}: ListRenderItemInfo<JadwalType>) => (
                  <NestedCard
                    key={item.idabsen}
                    title={new Date(item.tglabsen).toLocaleDateString()}
                    subtitle="-"
                    additionalText={
                      item.flagabsen == 1
                        ? 'Tutor sudah mengisi absen'
                        : item.flagabsen == 2
                        ? 'Tutor tidak hadir'
                        : 'Tutor belum mengisi absen'
                    }
                    onPress={() => {
                      navigation.navigate<any>('DetailPresensi', {data: item});
                    }}
                  />
                )}
                extraData={coursePresenceList}
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
              {/* {coursePresenceList.map((item: any, index: number) => {
                return (
                  <NestedCard
                    key={index}
                    title={new Date(item.tglabsen).toLocaleDateString()}
                    subtitle="-"
                    additionalText={
                      item.flagabsen == 1
                        ? 'Tutor sudah mengisi absen'
                        : item.flagabsen == 2
                        ? 'Tutor tidak hadir'
                        : 'Tutor belum mengisi absen'
                    }
                    onPress={() => {
                      navigation.navigate<any>('DetailPresensi', {data: item});
                    }}
                  />
                );
              })} */}
            </Card.Content>
          </Card>
          <Gap y={dimens.standard} />
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
});
