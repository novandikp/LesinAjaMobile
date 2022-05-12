import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {apiGet, apiPost} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'KonfirmasiGTutor'>,
  StackScreenProps<AppStackParamList>
>;
export const KonfirmasiGTutor: FC<ScreenProps> = ({navigation}) => {
  const [listData, setListData] = useState([]);
  // load data
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [reset, setReset] = useState(false);
  useEffect(() => {
    let Active = true;
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/les/ulang/daftar',
        params: {
          cari: '',
          orderBy: 'idpenggantian',
          sort: 'desc',
          page: '1',
          status: 'PENDING',
        },
      });
      if (componentMounted.current) {
        setListData(data.data);
      }
      if (Active) {
        setListData(data.data);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing || isLoading || isFocus || reset) {
      getInitialData();
    }
    return () => {
      componentMounted.current = false;
      Active = false;
      setReset(false);
    };
  }, [isRefreshing, isLoading, isFocus, reset]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        title="Konfirmasi Pengganti Tutor"
        noBackButton
        withHistory
        onPressFilter={() => {
          navigation.navigate('HistoryGTutor');
        }}
      />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, padding: dimens.standard}}>
            {listData.map((item: any, key) => {
              return (
                <Card key={key} style={{marginBottom: 10}}>
                  <Card.Title title={'Ganti Tutor'} />
                  <Card.Content>
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Nama Guru"
                      value={item.guru}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Nama Siswa"
                      value={item.siswa}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Kelas"
                      value={item.kelas + ' ' + item.jenjang}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Tanggal Les"
                      value={new Date(item.tglles).toLocaleDateString()}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Hari"
                      value={item.hari}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Jam Les"
                      value={item.jamles}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Biaya Les"
                      value={item.biaya
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Alasan"
                      value={item.alasan}
                    />
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      onPress={async () => {
                        await apiPost({
                          url: '/les/ulang/terima',
                          payload: {idpenggantian: item.idpenggantian},
                        });
                        setReset(true);
                      }}>
                      Konfirmasi
                    </Button>
                    <Button
                      onPress={async () => {
                        await apiPost({
                          url: '/les/ulang/tolak',
                          payload: {idpenggantian: item.idpenggantian},
                        });
                        setReset(true);
                      }}>
                      Tolak
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })}
          </View>
        </ScrollView>
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
