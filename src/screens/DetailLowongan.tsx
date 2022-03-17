import React, {FC, useState, useEffect} from 'react';
import {Header, Gap, CardLabelValue} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {
  Card,
  Divider,
  Paragraph,
  Button,
  Caption,
  Text,
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import dayjs from 'dayjs';
import {apiGet, apiPost} from '../utils/api';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLowongan'>;
export const DetailLowongan: FC<ScreenProps> = ({route, navigation}) => {
  const {item}: any = route.params;
  const [jadwalLes, setJadwalLes] = useState([]);
  const [statusapply, setStatusApply] = useState('');
  // const days = [
  //   {
  //     id: '0',
  //     name: 'MINGGU',
  //   },
  //   {
  //     id: '1',
  //     name: 'SENIN',
  //   },
  //   {
  //     id: '2',
  //     name: 'SELASA',
  //   },
  //   {
  //     id: '3',
  //     name: 'RABU',
  //   },
  //   {
  //     id: '4',
  //     name: 'KAMIS',
  //   },
  //   {
  //     id: '5',
  //     name: 'JUMAT',
  //   },
  //   {
  //     id: '6',
  //     name: 'SABTU',
  //   },
  // ];
  useEffect(() => {
    const getInitialData = async () => {
      const status = await apiGet({url: 'lowongan/status/' + item.idlowongan});
      setStatusApply(status.data.statusapply);
      // setStatusLowongan({statusLowongan:status.data.statusapply});
    };
    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Lowongan" />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Card>
          <Card.Title
            title={item.paket + ' ' + item.jenjang + ' ' + item.kelas}
            titleStyle={{alignSelf: 'center'}}
          />
          <Card.Content>
            <Divider />
            <Gap y={dimens.tiny} />

            <CardLabelValue label="Siswa" value={item.siswa} />
            {/* <CardLabelValue label="Wali Murid" value="Mikasa" /> */}
            <CardLabelValue
              label="Paket"
              value={item.jumlah_pertemuan + ' Pertemuan'}
            />
            <CardLabelValue
              label="Gaji Tutor"
              value={item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            />
            <CardLabelMultipleValue label="Jadwal Les" value={jadwalLes} />
            {statusapply == 'BELUM DIAMBIL' && (
              <Button
                style={{marginTop: dimens.standard}}
                onPress={async () => {
                  // const data = new FormData();
                  const newdata = {};
                  const {success} = await apiPost({
                    url: '/lowongan/ajuan/' + item.idlowongan,
                    payload: newdata,
                  });
                  if (success) {
                    navigation.navigate<any>('MainTabs');
                  }
                }}>
                Ambil Lowongan
              </Button>
            )}
            {statusapply != 'BELUM DIAMBIL' && (
              <Text
                style={{
                  textAlign: 'center',
                  color: color.green_500,
                  marginTop: dimens.standard,
                }}>
                {statusapply}
              </Text>
            )}

            <Gap y={dimens.standard} />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const CardLabelMultipleValue: FC<{
  label: string;
  value: Array<number>;
}> = ({label, value}) => {
  return (
    <View style={{marginTop: dimens.medium}}>
      <Caption style={{fontSize: dimens.standard}}>{label}</Caption>
      {value.map((item, index) => {
        return (
          <Paragraph key={index} style={{fontSize: dimens.medium_14}}>
            {dayjs.unix(item).format('dddd MMMM YYYY')}
          </Paragraph>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: dimens.standard,
  },
  subTitle: {
    fontSize: dimens.standard,
    alignSelf: 'center',
  },
  presenceStatus: {
    textAlign: 'center',
    fontSize: dimens.standard,
    marginTop: dimens.small,
    color: color.green_500,
  },
});
