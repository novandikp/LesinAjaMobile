import React, {FC, useState, useEffect, useRef} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {Header, OneLineInfo, CardKeyValue, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Card, Button} from 'react-native-paper';
import {apiGet} from '@utils';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListStudentAdmin'>,
  StackScreenProps<AppStackParamList>
>;
type muridType = {
  idsiswa: string;
  idortu: string;
  siswa: string;
  jeniskelamin: string;
  jenjang: string;
  kelas: string;
  sekolah: string;
};
export const ListStudentAdmin: FC<ScreenProps> = ({navigation}) => {
  const [studentList, setStudentList] = useState([]);
  //update data
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
      url: 'siswa',
      params: {
        page: NextPage,
        orderBy: 'idsiswa',
        sort: 'ASC',
      },
    })
      .then(res => {
        if (res.data == null) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setStudentList(studentList.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          return setDisplayButton(false);
        } else if (res.data.length == 10) {
          setLoadingData(false);
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
      const murid = await apiGet({
        // ?page=1&guru=Budi&orderBy=guru&sort=ASC
        url: 'siswa',
        params: {
          page: '1',
          orderBy: 'idsiswa',
          sort: 'ASC',
        },
      });
      if (componentMounted.current) {
        setStudentList(murid.data);
      }
      if (isActive) {
        if (isLoadMoreData) {
          setStudentList(studentList);
        } else {
          setStudentList(murid.data);
          if (murid.data.length == 10) {
            setButtonLoadMore(false);
            setDisplayButton(true);
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
  }, [isFocus, isLoadMoreData, isLoading, isRefreshing, studentList]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Siswa"
        onPressFilter={() => {}}
      />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <OneLineInfo info="Klik item untuk melihat detail" />
            </>
          }
          contentContainerStyle={styles.scrollContainer}
          data={studentList}
          keyExtractor={(item: muridType) => item.idsiswa}
          renderItem={({item}: ListRenderItemInfo<muridType>) => (
            <Card
              style={{marginTop: dimens.standard}}
              //   onPress={() =>
              //     navigation.navigate<any>('DetailTutor', {data: item})
              //   }
            >
              <Card.Title title={item.siswa} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.siswa} />
                <CardKeyValue
                  keyName="Kelas"
                  value={item.kelas + ' ' + item.jenjang}
                />
                <CardKeyValue
                  keyName="Jenis Kelamin"
                  value={item.jeniskelamin}
                />
                {/* <CardKeyValue keyName="Nomor WA" value={item.telp} /> */}
                {/* <CardKeyValue keyName="Alamat" value={item.alamat} /> */}
              </Card.Content>
            </Card>
          )}
          extraData={studentList}
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
      )}
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {/* <OneLineInfo info="Klik item untuk melihat detail" /> */}
      {/* {tutorList.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              style={{marginTop: dimens.standard}}
              onPress={() =>
                navigation.navigate<any>('DetailTutor', {data: item})
              }>
              <Card.Title title={item.guru} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.guru} />
                <CardKeyValue keyName="Email" value={item.email} />
                <CardKeyValue keyName="Nomor WA" value={item.telp} />
                <CardKeyValue keyName="Alamat" value={item.alamat} />
              </Card.Content>
            </Card> 
          );
        })} */}
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
});
