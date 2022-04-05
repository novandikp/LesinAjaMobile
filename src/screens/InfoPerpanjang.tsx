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
} from 'react-native';
import {Card, Chip, Button} from 'react-native-paper';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
import {apiGet, apiPost} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type InfoType = {
  idles: string;
  idpaket: string;
  idsiswa: string;
  tglles: string;
  jamles: string;
  hari: string;
  statusles: string;
  prefrensi: string;
  tglperpanjang: string;
  idguru: string;
  statuslowongan: string;
  idortu: string;
  jumlah_pertemuan: string;
  biaya: string;
  siswa: string;
  jenjang: string;
  kelas: string;
  jeniskelamin: string;
  gaji: string;
};

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'InfoPerpanjang'>,
  StackScreenProps<AppStackParamList>
>;
export const InfoPerpanjang: FC<ScreenProps> = ({navigation}) => {
  const [isEmptyData, setisEmptyData] = useState(false);
  const [lesItems, setLesItem] = useState([]);

  //loading page
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isFocus = useIsFocused();

  useEffect(() => {
    let isActive = true;

    const getInitialData = async () => {
      const siswaku = await apiGet({
        url: '/les/permintaan',
        // params: {
        //   page: '1',
        //   siswa: '',
        //   orderBy: 'siswa',
        //   sort: 'asc',
        // },
      });
      if (isActive) {
        if (siswaku.data == null) {
          setisEmptyData(true);
        } else if (siswaku.data != null) {
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
  }, [isFocus, isLoading, isRefreshing, lesItems]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />
      <Header noBackButton title="Permintaan Perpanjangan Les" />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : isEmptyData ? (
        <EmptyData />
      ) : (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, padding: dimens.standard}}>
            {lesItems.map((item: any) => {
              return (
                <Card key={item.idles} style={{marginBottom: 10}}>
                  <Card.Title title={'Perpanjang les siswa ' + item.siswa} />
                  <Card.Content>
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Nama Siswa"
                      value={item.siswa}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Hari les"
                      value={item.hari}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Jam Les"
                      value={item.jamles}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Jumlah pertemuan"
                      value={item.jumlah_pertemuan}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Gaji"
                      value={item.gaji
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Alamat"
                      value={item.alamat == null ? '-' : item.alamat}
                    />
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      onPress={async () => {
                        await apiPost({
                          url: '/les/permintaan/terima/' + item.idles,
                          payload: {},
                        });
                      }}>
                      Setuju
                    </Button>
                    <Button
                      onPress={async () => {
                        await apiPost({
                          url: '/les/permintaan/tolak/' + item.idles,
                          payload: {},
                        });
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
