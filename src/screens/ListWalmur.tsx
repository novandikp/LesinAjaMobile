import React, {FC, useEffect, useState, useRef} from 'react';
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
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListWalmur'>,
  StackScreenProps<AppStackParamList>
>;
type walmur = {
  wali: string;
  email: string;
  telp: string;
  alamat: string;
  idwali: string;
};
export const ListWalmur: FC<ScreenProps> = ({navigation}) => {
  const [walmurList, setWalmurList] = useState([]);
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
      url: 'admin/wali',
      params: {
        page: NextPage,
        wali: '',
        orderBy: 'wali',
        sort: 'ASC',
      },
    })
      .then(res => {
        if (res.data == null) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setWalmurList(walmurList.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          return setDisplayButton(false);
        } else if (res.data.length == 10) {
          setLoadingData(false);
          // setButtonLoadMore(false);
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
      const walmur = await apiGet({
        // ?page=1&wali=Budi&orderBy=wali&sort=ASC
        url: 'admin/wali',
        params: {
          page: '1',
          wali: '',
          orderBy: 'wali',
          sort: 'ASC',
        },
      });
      if (componentMounted.current) {
        setWalmurList(walmur.data);
      }
      if (isActive) {
        if (isLoadMoreData) {
          setWalmurList(walmurList);
        } else {
          setWalmurList(walmur.data);
          if (walmur.data.length == 10) {
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
  }, [isFocus, isLoadMoreData, isLoading, isRefreshing, walmurList]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Wali Murid"
        onPressFilter={() => {}}
      />

      {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
      {/* <OneLineInfo info="Klik item untuk melihat detail" /> */}
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
          data={walmurList}
          keyExtractor={(item: walmur) => item.idwali}
          renderItem={({item}: ListRenderItemInfo<walmur>) => (
            <Card
              style={{marginTop: dimens.standard}}
              onPress={() =>
                navigation.navigate<any>('DetailWalmur', {data: item})
              }>
              <Card.Title title={item.wali} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.wali} />
                <CardKeyValue keyName="Email" value={item.email} />
                <CardKeyValue keyName="Nomor WA" value={item.telp} />
                <CardKeyValue keyName="Alamat" value={item.alamat} />
              </Card.Content>
            </Card>
          )}
          extraData={walmurList}
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
      {/* {walmurList.map((item: any, index: number) => {
        return (
          <Card
            key={index}
            style={{marginTop: dimens.standard}}
            onPress={() =>
              navigation.navigate<any>('DetailWalmur', {data: item})
            }>
            <Card.Title title={item.wali} />
            <Card.Content>
              <CardKeyValue keyName="Nama" value={item.wali} />
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
