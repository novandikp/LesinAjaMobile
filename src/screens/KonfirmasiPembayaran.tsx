import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Gap, Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Icon, Image} from 'react-native-elements';
import {Button, Card} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import Modal from 'react-native-modal';
import {apiGet, apiPost, checkPersimisson} from '@utils';
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'RiwayatPembayaran'>,
  StackScreenProps<AppStackParamList>
>;
export const KonfirmasiPembayaran: FC<ScreenProps> = ({}) => {
  const [riwayat, setRiwayat] = useState([]);
  const [modalImage, setModalImage] = useState(false);
  const [uriPicture, setUriPicture] = useState('');
  // load data
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let Active = true;
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/les',
        params: {
          cari: '',
          orderBy: 'siswa',
          sort: 'desc',
          page: '1',
          status: 'BAYAR_BELUMKONFIRMASI',
        },
      });
      if (componentMounted.current) {
        setRiwayat(data.data);
      } else if (Active) {
        setRiwayat(data.data);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      componentMounted.current = false;
      Active = false;
    };
  }, [riwayat, uriPicture, modalImage, isRefreshing, isLoading, isFocus]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Konfirmasi Pembayaran" noBackButton />
      {isLoading || isRefreshing ? (
        <SkeletonLoading />
      ) : (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={{flex: 1, padding: dimens.standard}}>
            {riwayat.map((item: any, key) => {
              return (
                <Card key={key} style={{marginBottom: 10}}>
                  <Card.Title title={'Pembayaran pada ananda ' + item.siswa} />
                  <Card.Content>
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Keterangan"
                      value={item.status}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Nama Wali Murid"
                      value={item.wali}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Nama Siswa"
                      value={item.siswa}
                    />
                    <CardKeyValue
                      keyFlex={9}
                      keyName="Biaya Les"
                      value={item.biaya
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                    />
                  </Card.Content>
                  <Card.Actions>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Button
                          onPress={async () => {
                            await apiPost({
                              url: 'les/konfirmasi/' + item.idles,
                              payload: {},
                            });
                            // if (konfirmasi) {
                            //   navigation.navigate('HomeAdmin');
                            // }
                          }}>
                          Konfirmasi
                        </Button>
                        <Button
                          onPress={async () => {
                            await apiPost({
                              url: '/les/tolak/' + item.idles,
                              payload: {},
                            });
                            // if (tolak) {
                            //   navigation.navigate('HomeAdmin');
                            // }
                          }}>
                          Tolak
                        </Button>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Icon
                          name="eye"
                          type="font-awesome"
                          color={color.green_500}
                          onPress={() => {
                            setUriPicture(item.bukti);
                            setModalImage(true);
                          }}
                        />
                        <Gap x={10} />
                        <Icon
                          name="download"
                          type="font-awesome"
                          color={color.green_500}
                          onPress={() => {
                            if (item.bukti != null) {
                              checkPersimisson(item.bukti);
                            }
                          }}
                        />
                      </View>
                    </View>
                  </Card.Actions>
                </Card>
              );
            })}
          </View>
          {modalImage && (
            <Modal isVisible={modalImage}>
              <View>
                <Icon
                  name="cancel"
                  onPress={() => {
                    setModalImage(false);
                    setUriPicture('');
                  }}
                  color={color.red}
                  iconStyle={{alignSelf: 'flex-end'}}
                />
                {uriPicture && (
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: 'http://45.76.149.250/bukti/' + uriPicture,
                    }}
                    style={{
                      height: '100%',
                    }}
                  />
                )}
              </View>
            </Modal>
          )}
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
