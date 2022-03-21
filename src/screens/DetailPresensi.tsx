import React, {FC, useState, useEffect, useContext} from 'react';
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
import {AuthContext} from '@context/AuthContext';
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
  const [disabledAbsenWali, setDisabledAbsenWali] = useState(false);

  const handleRating = async (count: number) => {
    setRatingCount(count);
  };
  const {
    state: {userRole},
  } = useContext(AuthContext);
  useEffect(() => {
    const getInitialData = () => {
      // console.log(userRole);
      if (data.flagabsen == 1) {
        setDisabledAbsen(true);
      }
      if (data.flagabsenwali == 1) {
        setDisabledAbsenWali(true);
      }
    };
    getInitialData();
    return;
  }, [ratingCount, ratingColor, data.flagabsen, data.flagabsenwali]);

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
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Button
                disabled={
                  userRole == 'tutor' ? disabledAbsen : disabledAbsenWali
                }
                style={{marginTop: dimens.standard}}
                onPress={async () => {
                  // if (userRole == 'parent') {
                  const {success} = await apiPost({
                    url: '/les/present/' + data.idabsen,
                    payload: {keterangan: 'ada'},
                  });

                  if (success) {
                    navigation.navigate<any>('MainTabs');
                  }
                  // } else if (userRole == 'tutor') {
                  //   const {success} = await apiPost({
                  //     url: '/les/present/' + data.idabsen,
                  //     payload: {keterangan: 'ada'},
                  //   });
                  //   if (success) {
                  //     navigation.navigate<any>('MainTabs');
                  //   }
                  // }
                }}>
                {/* {userRole == 'parent' ? 'Selesai' : 'Hadir'}
                 */}
                hadir
              </Button>
              {/* {userRole == 'tutor' && ( */}
              <Button
                disabled={
                  userRole == 'tutor' ? disabledAbsen : disabledAbsenWali
                }
                style={{marginTop: dimens.standard}}
                onPress={async () => {
                  const {success} = await apiPost({
                    url: '/les/absen' + data.idabsen,
                    payload: {keterangan: 'absen'},
                  });
                  if (success) {
                    navigation.navigate<any>('MainTabs');
                  }
                }}>
                Absen
              </Button>
              {/* )} */}
            </View>
            <Gap y={dimens.standard} />

            {/* if not over */}
            {userRole == 'parent' && (
              <>
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
                  disabled={
                    userRole == 'tutor' ? disabledAbsen : disabledAbsenWali
                  }
                  style={{marginTop: dimens.standard}}
                  icon="pencil-outline"
                  onPress={() => {
                    setOpen(true);
                  }}>
                  Edit tanggal pertemuan
                </Button>
              </>
            )}
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
