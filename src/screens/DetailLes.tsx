import React, {FC, useState, useEffect} from 'react';
import {CardKeyValue, Gap, Header, NestedCard} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  // Avatar,
  Button,
  Card,
  Subheading,
  ActivityIndicator,
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {getSingleDocument, apiGet, apiPostFile} from '@utils';
import {Icon} from 'react-native-elements';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLes'>;
export const DetailLes: FC<ScreenProps> = ({navigation, route}) => {
  const {data}: any = route.params;
  let id = data.idles;
  const bayar = data.biaya;
  const statusles = data.statusles;
  const [buktiBayar, setBuktiBayar] = useState({
    path: '',
  });
  const [images, setImages] = useState<any>([]);
  const [isLoading, setLoading] = useState(false);
  const onPressUploadBuktiBayar = async () => {
    if (buktiBayar.path === '') {
      const res = await getSingleDocument();
      if (res) {
        setBuktiBayar(prev => ({...prev, path: res.uri}));
        setImages(res);
      }
    } else {
      setLoading(true);
      const item = new FormData();
      item.append('idles', id.toString());
      item.append('jumlahbayar', bayar.toString());
      item.append('tglbayar', new Date().toISOString().slice(0, 10));
      item.append('bukti[0][file]', {
        uri:
          Platform.OS === 'ios'
            ? images?.uri.replace('file://', '')
            : images?.uri,
        type: images?.type,
        name: images?.name,
      });
      const {success} = await apiPostFile({
        url: 'bayar',
        payload: item,
      });
      if (success) {
        navigation.navigate<any>('MainTabs');
      }
    }
  };
  const [detailLes, setDetailLes] = useState<any>([]);
  const [listApplyingTutor, setListApplyingTutor] = useState<any>([]);

  const [coursePresenceList, setCoursePresenceList] = useState<any>([]);
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const applyingTutor = await apiGet({
        url: '/lowongan/pelamar/' + id,
      });
      const jadwalles = await apiGet({
        url: '/jadwal/les/' + data.idles,
        params: {
          cari: '',
          orderBy: 'tglabsen',
          sort: 'asc',
          page: '1',
        },
        // '?cari=&orderBy=siswa&sort=desc&page=1',
      });
      if (isActive) {
        setDetailLes(data);
        setListApplyingTutor(applyingTutor.data);
        setCoursePresenceList(jadwalles.data);
      }
    };
    getInitialData();

    return () => {
      isActive = false;
    };
  });
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Les" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        {/* About Les */}
        <Card>
          <Card.Title
            title={detailLes.kelas + ' ' + detailLes.jenjang}
            subtitle={detailLes.jumlah_pertemuan + ' Pertemuan'}
          />
          <Card.Content>
            <CardKeyValue
              keyName="Siswa"
              value={detailLes.siswa != null ? detailLes.siswa : '-'}
              keyFlex={8}
            />
            <CardKeyValue keyName="Tutor" value="-" keyFlex={8} />
            <CardKeyValue
              keyName="Tgl Mulai"
              value={
                detailLes != null
                  ? new Date(detailLes.tglles).toLocaleDateString()
                  : '-'
              }
              keyFlex={8}
            />
            <CardKeyValue keyName="Hari" value={detailLes.hari} keyFlex={8} />

            {/* <CardKeyValue keyName="Tgl Selesai" value="-" keyFlex={8} /> */}
          </Card.Content>
        </Card>

        {/* Pay Les */}
        {statusles == 3 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Proses Konfirmasi Pembayaran"
              subtitle="Menunggu admin konfirmasi pembayaran"
              titleStyle={{color: '#EF4444'}}
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
          </Card>
        )}
        {statusles == 2 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Anda Belum Membayar Biaya Les"
              subtitle="Biaya Les: Rp 200.000 (Ukuran maks.2mb)"
              titleStyle={{color: '#EF4444'}}
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
            {buktiBayar.path !== '' && (
              <Card.Cover
                source={{uri: buktiBayar.path}}
                style={{
                  marginTop: dimens.small,
                  marginHorizontal: dimens.standard,
                  // height: 500,
                  // resizeMode: 'contain',
                }}
              />
            )}
            <Card.Actions>
              <Button disabled={isLoading} onPress={onPressUploadBuktiBayar}>
                {buktiBayar.path === '' ? 'Unggah Bukti Pembayaran' : 'Kirim'}
              </Button>
              {isLoading && <ActivityIndicator animating={isLoading} />}
            </Card.Actions>
          </Card>
        )}
        {statusles == 5 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Anda Belum Membayar Biaya Les"
              subtitle="Biaya Les: Rp 200.000 (Ukuran maks.2mb)"
              titleStyle={{color: '#EF4444'}}
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
            {buktiBayar.path !== '' && (
              <Card.Cover
                source={{uri: buktiBayar.path}}
                style={{
                  marginTop: dimens.small,
                  marginHorizontal: dimens.standard,
                }}
              />
            )}
            <Card.Actions>
              <Button disabled={isLoading} onPress={onPressUploadBuktiBayar}>
                {buktiBayar.path === '' ? 'Unggah Bukti Pembayaran' : 'Kirim'}
              </Button>
              {isLoading && <ActivityIndicator animating={isLoading} />}
            </Card.Actions>
          </Card>
        )}
        {/* There is no applying tutor */}
        {statusles == 0 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Menunggu Ada Tutor"
              titleStyle={{color: '#2563EB'}}
            />
            <Card.Content>
              <Subheading>Belum ada tutor yang mengambil les ini</Subheading>
            </Card.Content>
          </Card>
        )}

        {/* Choose Tutor */}
        {statusles == 0 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              style={{width: '100%'}}
              title="Anda Belum Memilih Tutor"
              subtitle="Klik item untuk melihat detail tutor "
              titleStyle={{color: '#F59E0B'}}
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
            <Card.Content>
              {listApplyingTutor.map((item: any, index: number) => {
                return (
                  <NestedCard
                    key={index}
                    title={item.guru}
                    subtitle={item.perguruantinggi}
                    onPress={() => {
                      navigation.navigate<any>('DetailTutor', {data: item});
                    }}
                    left={
                      // props
                      () => (
                        // <Avatar.Image
                        //   {...props}
                        //   size={45}
                        //   source={{uri: 'http://placekitten.com/100/100'}}
                        // />
                        <Icon
                          // {...props}
                          name="user"
                          type="font-awesome"
                          size={45}
                        />
                      )
                    }
                  />
                );
              })}
            </Card.Content>
          </Card>
        )}

        {/* Presence */}
        {statusles == 4 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Presensi Les"
              titleStyle={{color: '#2563EB'}}
              subtitle="Klik item untuk melihat detail presensi"
              subtitleStyle={{fontSize: dimens.medium_14}}
            />
            <Card.Content>
              {coursePresenceList.map((item: any, index: number) => {
                return (
                  <NestedCard
                    key={index}
                    title={new Date(item.tglabsen).toLocaleDateString()}
                    // subtitle={}
                    subtitle="-"
                    additionalText={
                      item.flagabsen == 1 ? 'Sudah absen' : 'Belum absen'
                    }
                    onPress={() => {
                      navigation.navigate<any>('DetailPresensi', {data: item});
                    }}
                  />
                );
              })}
            </Card.Content>
          </Card>
        )}
        <Gap y={dimens.standard} />
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
