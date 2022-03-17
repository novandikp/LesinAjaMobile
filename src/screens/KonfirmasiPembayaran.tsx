import React, {FC, useState, useEffect, useRef} from 'react';
import {CardKeyValue, Header} from '@components';
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
import {apiGet, apiPost, checkPersimisson} from '@utils';
import Modal from 'react-native-modal';
type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'RiwayatPembayaran'>,
  StackScreenProps<AppStackParamList>
>;
export const KonfirmasiPembayaran: FC<ScreenProps> = ({navigation}) => {
  const [riwayat, setRiwayat] = useState([]);
  const [modalImage, setModalImage] = useState(false);
  const [uriPicture, setUriPicture] = useState('');
  const componentMounted = useRef(true); // (3) component is mounted

  useEffect(() => {
    const getInitialData = async () => {
      const data = await apiGet({
        // ?cari=&orderBy=siswa&sort=desc&page=1&status=BAYAR_BELUMKONFIRMASI
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
      }
    };
    getInitialData();
    return () => {
      componentMounted.current = false;
    };
  }, [riwayat, uriPicture, modalImage]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Konfirmasi Pembayaran" noBackButton />

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
                    keyName="Biaya Gaji Tutor"
                    value={item.biaya
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  />
                </Card.Content>
                {/* TODO: BUAT BUTTON TAMPILAN IMG */}
                <Card.Actions>
                  <Button
                    onPress={async () => {
                      const konfirmasi = await apiPost({
                        url: 'les/konfirmasi/' + item.idles,
                        payload: {},
                      });
                      if (konfirmasi) {
                        navigation.navigate('HomeAdmin');
                      }
                    }}>
                    Konfirmasi
                  </Button>
                  <Button
                    onPress={async () => {
                      const tolak = await apiPost({
                        url: '/les/tolak/' + item.idles,
                        payload: {},
                      });
                      if (tolak) {
                        navigation.navigate('HomeAdmin');
                      }
                    }}>
                    Tolak
                  </Button>
                  <View style={{marginRight: 20}}>
                    <Icon
                      name="eye"
                      type="font-awesome"
                      color={color.green_500}
                      onPress={() => {
                        setUriPicture(item.bukti);
                        setModalImage(true);
                      }}
                    />
                  </View>

                  <View style={{marginRight: 30}}>
                    <Icon
                      name="download"
                      type="font-awesome"
                      color={color.green_500}
                      // style={{paddingRight: 20}}
                      onPress={() => {
                        checkPersimisson(item.bukti);
                      }}
                    />
                  </View>
                </Card.Actions>
              </Card>
            );
          })}
        </View>
        {modalImage && (
          <Modal
            isVisible={modalImage}
            onBackdropPress={() => {
              setModalImage(false);
              setUriPicture('');
            }}>
            {uriPicture && (
              <Image
                source={{
                  uri: 'http://45.76.149.250:8081/bukti/' + uriPicture,
                }}
                style={{
                  // backgroundColor: 'red',
                  // maxheight: 300,
                  // maxwidth: 300,
                  // minWidth: 100,
                  // minHeight: 100,
                  alignSelf: 'center',
                  width: 100,
                  height: 100,
                }}
              />
            )}
            {/* <Text>test</Text> */}
            {/* </View> */}
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
