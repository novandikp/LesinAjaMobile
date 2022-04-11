import React, {FC, useEffect, useState, useRef} from 'react';
import {
  Header,
  OneLineInfo,
  CardKeyValue,
  FABList,
  // Gap,
  SkeletonLoading,
} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  // ScrollView,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Button, Card} from 'react-native-paper';
import {apiDelete, apiGet} from '@utils';
import {useIsFocused} from '@react-navigation/core';
type paketType = {
  idpaket: string;
  paket: string;
  jumlah_pertemuan: string;
  biaya: number;
  gaji: number;
  jenjang: string;
};
type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListLes'>,
  StackScreenProps<AppStackParamList>
>;

export const ListLes: FC<ScreenProps> = ({navigation}) => {
  const [lesList, setLesList] = useState([]);
  //update data
  const [page, setPage] = useState(1);
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDisplayButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  // Loading page
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  const componentMounted = useRef(true); // (3) component is mounted
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: 'paket',
      params: {
        page: NextPage,
        orderBy: 'idpaket',
        sort: 'asc',
        paket: '',
      },
    })
      .then(res => {
        if (res.data.length == 0) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setLesList(lesList.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          setLoadingData(false);
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
      const data = await apiGet({
        // url: '/paket?page=1&paket&orderBy=biaya&sort=ASC',
        url: '/paket',
        params: {
          page: '1',
          orderBy: 'idpaket',
          sort: 'asc',
          paket: '',
        },
      });
      if (componentMounted.current) {
        setLesList(data.data);
        console.log('component mounted current');
      }
      if (isActive) {
        if (isLoadMoreData) {
          setLesList(lesList);
        } else {
          if (data.data.length == 10) {
            setDisplayButton(true);
            setButtonLoadMore(false);
          }
          setLesList(data.data);
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
  }, [isFocus, isLoadMoreData, isLoading, isRefreshing, lesList]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Les"
        onPressFilter={() => {}}
      />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={
            <>
              <OneLineInfo info="Klik item untuk melihat detail" />
            </>
          }
          data={lesList}
          keyExtractor={(item: paketType) => item.idpaket}
          renderItem={({item}: ListRenderItemInfo<paketType>) => (
            <Card style={{marginTop: dimens.standard}}>
              {/* <Card.Title title={`${item.mapel} ${item.jenjangKelas}`} /> */}
              <Card.Content>
                <CardKeyValue keyName="Paket" value={item.paket} />
                <CardKeyValue keyName="Jenjang" value={item.jenjang} />
                <CardKeyValue
                  keyName="Jumlah Pertemuan"
                  value={item.jumlah_pertemuan}
                />
                <CardKeyValue
                  keyName="Biaya les"
                  value={item.biaya
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
                <CardKeyValue
                  keyName="Gaji Tutor"
                  value={item.gaji
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate<any>('EditListLes', {data: item})
                  }>
                  Edit
                </Button>
                <Button
                  onPress={async () => {
                    await apiDelete({
                      url: '/paket/' + item.idpaket,
                    });
                  }}>
                  Hapus
                </Button>
              </Card.Actions>
            </Card>
          )}
          extraData={lesList}
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
          ListEmptyComponent={<></>}
        />
      )}
      {/* <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {lesList.map((item: any, index: number) => {
          return (
            <Card key={index} style={{marginTop: dimens.standard}}>
              {/* <Card.Title title={`${item.mapel} ${item.jenjangKelas}`} /> 
              <Card.Content>
                <CardKeyValue keyName="Paket" value={item.paket} />
                <CardKeyValue keyName="Jenjang" value={item.jenjang} />
                <CardKeyValue
                  keyName="Jumlah Pertemuan"
                  value={item.jumlah_pertemuan}
                />
                <CardKeyValue
                  keyName="Biaya"
                  value={item.biaya
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
                <CardKeyValue
                  keyName="Gaji Tutor"
                  value={item.gaji
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate<any>('EditListLes', {data: item})
                  }>
                  Edit
                </Button>
                <Button
                  onPress={async () => {
                    const {success} = await apiDelete({
                      url: '/paket/' + item.idpaket,
                    });
                    // console.log(success);
                    if (success) {
                      navigation.navigate('ListLes');
                    }
                  }}>
                  Hapus
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
        <Gap y={72} />
      </ScrollView> */}

      {/* Add button */}
      <FABList
        label="Tambah Data"
        onPress={() => navigation.navigate<any>('EditListLes', {data: null})}
      />
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
