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
import {Avatar, Button, Card, Subheading} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {getSingleDocument, apiGet, apiPostFile} from '@utils';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLes'>;
export const DetailLes: FC<ScreenProps> = ({navigation, route}) => {
  const {data}: any = route.params;
  let id = data.idles;
  const bayar = data.biaya;
  const statusles = data.statusles;
  const [buktiBayar, setBuktiBayar] = useState({
    path: '',
  });
  const [images, setImages] = useState(null);
  const onPressUploadBuktiBayar = async () => {
    if (buktiBayar.path === '') {
      const res = await getSingleDocument();
      if (res) {
        setBuktiBayar(prev => ({...prev, path: res.uri}));
        setImages(res);
      }
    } else {
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
        navigation.navigate('Les');
      }
      // const gbr = images;
    }
  };
  const [detailLes, setDetailLes] = useState<any>([]);
  const [listApplyingTutor, setListApplyingTutor] = useState<any>([]);
  useEffect(() => {
    const getInitialData = async () => {
      const applyingTutor = await apiGet({
        url: '/lowongan/pelamar/' + id,
      });
      setListApplyingTutor(applyingTutor.data);
      setDetailLes(data);
      if (statusles > 3) {
        setBuktiBayar(prev => ({...prev, path: 'ada'}));
      }
    };
    getInitialData();

    return () => {
      // isActive = false;
    };
  }, []);
  const coursePresenceList = [
    {
      tanggal: 'Kamis, 02 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
      status: 'selesai',
    },
    {
      tanggal: 'Jumat, 03 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
      status: 'selesai',
    },
    {
      tanggal: 'Sabtu, 04 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
    },
    {
      tanggal: 'Minggu, 06 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
    },
  ];

  // const listApplyingTutor = [
  //   {
  //     nama: 'Fahrul Firdaus',
  //     perguruanTinggi: 'Politeknik Elektronika Negeri Surabaya',
  //   },
  //   {
  //     nama: 'Nico Aidin',
  //     perguruanTinggi: 'Universitas Negeri Surabaya',
  //   },
  //   {
  //     nama: 'Fiqri Akbar',
  //     perguruanTinggi: 'Universitas Jember',
  //   },
  // ];

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
            subtitle="5/8 Pertemuan"
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
            <CardKeyValue keyName="Tgl Selesai" value="-" keyFlex={8} />
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
        {statusles <= 2 && (
          <Card style={{marginTop: dimens.standard}}>
            <Card.Title
              title="Anda Belum Membayar Biaya Les"
              subtitle="Biaya Les: Rp 200.000"
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
              <Button onPress={onPressUploadBuktiBayar}>
                {buktiBayar.path === '' ? 'Unggah Bukti Pembayaran' : 'Kirim'}
              </Button>
            </Card.Actions>
          </Card>
        )}
        {/* There is no applying tutor */}
        {statusles <= 1 && (
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
        {statusles <= 1 && (
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
                    left={props => (
                      <Avatar.Image
                        {...props}
                        size={45}
                        source={{uri: 'http://placekitten.com/100/100'}}
                      />
                    )}
                  />
                );
              })}
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
            {coursePresenceList.map((item, index) => {
              return (
                <NestedCard
                  key={index}
                  title={item.tanggal}
                  subtitle={item.waktu}
                  additionalText={item.status && item.status}
                  onPress={() => {
                    navigation.navigate('DetailPresensi');
                  }}
                />
              );
            })}
          </Card.Content>
        </Card>
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
