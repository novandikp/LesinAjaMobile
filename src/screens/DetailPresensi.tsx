import React, {FC, useState, useEffect} from 'react';
import {Header, Gap, CardKeyValue} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {Card, Divider, Paragraph, Button, IconButton} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import DatePicker from 'react-native-date-picker';
// import dayjs from 'dayjs';
import {apiPost} from '@utils';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailPresensi'>;
export const DetailPresensi: FC<ScreenProps> = ({navigation, route}) => {
  const {data}: any = route.params;
  // const tanggalPertemuan = dayjs.unix(1630610037).format('DD MMMM YYYY');
  const tanggalPertemuan = new Date(data.tglabsen).toISOString().slice(0, 10);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingColor, setRatingColor] = useState(undefined);
  const date = new Date();
  const [Open, setOpen] = useState(false);
  const [disabledAbsen, setDisabledAbsen] = useState(false);
  const handleRating = async (count: number) => {
    setRatingCount(count);
  };

  useEffect(() => {
    const getInitialData = () => {
      if (data.flagabsen == 1) {
        setDisabledAbsen(true);
      }
    };
    getInitialData();
    return;
  }, [ratingCount, ratingColor]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Presensi" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card>
          <Card.Title
            title={'Presensi Les Siswa ' + data.siswa}
            titleStyle={{alignSelf: 'center'}}
            // subtitle="Presensi ke 1"
            subtitleStyle={styles.subTitle}
            style={{marginBottom: dimens.standard}}
          />
          <Card.Content>
            {/* if over */}
            <Paragraph style={{fontSize: dimens.standard}}>
              {tanggalPertemuan}
            </Paragraph>
            <Gap y={dimens.tiny} />
            <Divider />
            <Gap y={dimens.tiny} />

            <CardKeyValue
              keyFlex={10}
              keyName="Les"
              value={data.paket + ' ' + data.jenjang + ' ' + data.kelas}
            />
            <CardKeyValue keyFlex={10} keyName="Tutor" value={data.guru} />
            {/* <Paragraph style={styles.presenceStatus}>Selesai</Paragraph> */}
            <Button
              disabled={disabledAbsen}
              style={{marginTop: dimens.standard}}
              onPress={async () => {
                const newData = {};
                const {success} = await apiPost({
                  url: '/les/absen/' + data.idabsen,
                  payload: newData,
                });
                if (success) {
                  navigation.navigate<any>('MainTabs');
                }
              }}>
              Selesai
            </Button>
            <Gap y={dimens.standard} />

            {/* if not over */}
            <Paragraph style={{fontSize: dimens.standard}}>
              {tanggalPertemuan}
            </Paragraph>
            <Gap y={dimens.tiny} />
            <Divider />
            <Gap y={dimens.tiny} />

            <CardKeyValue
              keyFlex={10}
              keyName="Les"
              value={data.paket + ' ' + data.jenjang + ' ' + data.kelas}
            />
            <CardKeyValue keyFlex={10} keyName="Tutor" value={data.guru} />
            <Button
              disabled={disabledAbsen}
              style={{marginTop: dimens.standard}}
              icon="pencil-outline"
              onPress={() => {
                setOpen(true);
              }}>
              Edit tanggal pertemuan
            </Button>
            {Open == true && (
              <DatePicker
                modal
                open={Open}
                date={date}
                mode="date"
                textColor={color.grey_5}
                minimumDate={new Date()}
                onConfirm={async Date => {
                  const {success} = await apiPost({
                    url: '/les/edit/' + data.idabsen,
                    payload: {
                      tglabsen: Date.toISOString().slice(0, 10),
                    },
                  });
                  if (success) {
                    navigation.navigate<any>('MainTabs');
                  }
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            )}
            <Gap y={dimens.standard} />

            {/* Rating */}
            <Card.Title
              title="Rating Tutor"
              titleStyle={{alignSelf: 'center'}}
              subtitle="Rating berdasarkan kinerja tutor"
              subtitleStyle={styles.subTitle}
            />
            <View style={styles.ratingContainer}>
              <IconButton
                icon="star"
                size={30}
                onPress={() => handleRating(1)}
              />
              <IconButton
                icon="star"
                size={30}
                onPress={() => handleRating(2)}
              />
              <IconButton
                icon="star"
                size={30}
                onPress={() => handleRating(3)}
              />
              <IconButton
                icon="star"
                size={30}
                onPress={() => handleRating(4)}
              />
              <IconButton
                icon="star"
                size={30}
                onPress={() => handleRating(5)}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
