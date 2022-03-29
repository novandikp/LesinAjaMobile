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
import {
  Card,
  Divider,
  Paragraph,
  Button,
  IconButton,
  TextInput,
  HelperText,
} from 'react-native-paper';
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
  const [ratingColor, setRatingColor] = useState([
    {
      id: 1,
      status: false,
    },
    {
      id: 2,
      status: false,
    },
    {
      id: 3,
      status: false,
    },
    {
      id: 4,
      status: false,
    },
    {
      id: 5,
      status: false,
    },
  ]);
  const date = new Date();
  const [Open, setOpen] = useState(false);
  const [disabledAbsen, setDisabledAbsen] = useState(false);
  const [disabledAbsenWali, setDisabledAbsenWali] = useState(false);
  const [Keterangan, setKeterangan] = useState('');
  const [ratingModul, setRatingModul] = useState(false);
  const [hiddenButtonAbsen, setHiddenButtonAbsen] = useState(true);
  const [inputKeterangan, setInputKeterangan] = useState(false);
  const handleRating = async (count: number) => {
    setInputKeterangan(true);
    setHiddenButtonAbsen(false);
    setRatingCount(count);
    ratingColor.map(() => {
      setRatingColor(
        ratingColor.map((object: any) => {
          // console.log(count);
          if (object.id < count) {
            return {...object, status: true};
          } else if (object.id > count) {
            return {...object, status: false};
          } else if (object.id == count) {
            return {...object, status: true};
          }
        }),
      );
    });

    // setRatingColor([{id: count, status: true}]);
  };
  const {
    state: {userRole},
  } = useContext(AuthContext);
  useEffect(() => {
    const getInitialData = () => {
      // console.log(userRole);
      if (data.flagabsen != 0) {
        setDisabledAbsen(true);
      }
      if (data.flagabsenwali != 0) {
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
            <Paragraph style={{fontSize: dimens.standard}}>
              {data.flagabsenwali == 1
                ? 'Wali sudah mengisi data hadir'
                : data.flagabsenwali == 2
                ? 'Anda absen, tidak dapat untuk hadir'
                : 'Wali belum mengisi data hadir'}
            </Paragraph>
            {data.keteranganwali != null && (
              <View>
                <Paragraph style={{fontSize: dimens.standard}}>
                  Kritik dan saran dari wali :{' '}
                </Paragraph>
                <Paragraph style={{fontSize: dimens.standard}}>
                  {data.keteranganwali}
                </Paragraph>
              </View>
            )}

            {userRole == 'parent' && hiddenButtonAbsen && (
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Button
                  disabled={disabledAbsenWali}
                  style={{marginTop: dimens.standard}}
                  onPress={async () => {
                    setInputKeterangan(true);
                    setHiddenButtonAbsen(false);
                  }}>
                  hadir
                </Button>
                <Button
                  disabled={disabledAbsenWali}
                  style={{marginTop: dimens.standard}}
                  onPress={async () => {
                    const {success} = await apiPost({
                      url: '/les/absent/' + data.idabsen,
                      // payload: {},
                      payload: {keterangan: 'tidak hadir', rating: 0},
                    });
                    if (success) {
                      navigation.navigate<any>('MainTabs');
                    }
                  }}>
                  Absen
                </Button>
                {/* )} */}
              </View>
            )}

            <Gap y={dimens.standard} />
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
            <Paragraph style={{fontSize: dimens.standard}}>
              {data.flagabsen == 1
                ? 'Tutor sudah mengisi data hadir'
                : data.flagabsenwali == 2
                ? 'Anda absen, tidak dapat untuk hadir'
                : 'Tutor belum mengisi data hadir'}
            </Paragraph>
            {data.keterangan != null && (
              <View>
                <Paragraph style={{fontSize: dimens.standard}}>
                  Review tutor :
                </Paragraph>
                <Paragraph style={{fontSize: dimens.standard}}>
                  {data.keterangan}
                </Paragraph>
              </View>
            )}
            {userRole == 'tutor' && hiddenButtonAbsen && (
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <Button
                  disabled={disabledAbsen}
                  style={{marginTop: dimens.standard}}
                  onPress={async () => {
                    setInputKeterangan(true);
                    setHiddenButtonAbsen(false);
                  }}>
                  hadir
                </Button>
                <Button
                  disabled={disabledAbsen}
                  style={{marginTop: dimens.standard}}
                  onPress={async () => {
                    const {success} = await apiPost({
                      url: '/les/absent/' + data.idabsen,
                      payload: {keterangan: 'tidak hadir', rating: 0},
                    });
                    if (success) {
                      navigation.navigate<any>('MainTabs');
                    }
                  }}>
                  Absen
                </Button>
                {/* )} */}
              </View>
            )}
            {userRole == 'parent' && (
              <Button
                disabled={disabledAbsenWali}
                style={{marginTop: dimens.standard}}
                icon="pencil-outline"
                onPress={() => {
                  setOpen(true);
                }}>
                Edit tanggal pertemuan
              </Button>
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
            {userRole == 'parent' && (
              <>
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
                    color={ratingColor[0].status ? 'gold' : color.grey}
                    onPress={() => handleRating(1)}
                  />
                  <IconButton
                    icon="star"
                    size={30}
                    color={ratingColor[1].status ? 'gold' : color.grey}
                    onPress={() => handleRating(2)}
                  />
                  <IconButton
                    icon="star"
                    size={30}
                    color={ratingColor[2].status ? 'gold' : color.grey}
                    onPress={() => handleRating(3)}
                  />
                  <IconButton
                    icon="star"
                    size={30}
                    color={ratingColor[3].status ? 'gold' : color.grey}
                    onPress={() => handleRating(4)}
                  />
                  <IconButton
                    icon="star"
                    size={30}
                    color={ratingColor[4].status ? 'gold' : color.grey}
                    onPress={() => handleRating(5)}
                  />
                </View>
                {ratingModul && (
                  <HelperText
                    style={{paddingLeft: 0, fontSize: dimens.medium_14}}
                    type="error">
                    Harap isi rating
                  </HelperText>
                )}
              </>
            )}
            {inputKeterangan && (
              <View>
                <TextInput
                  value={Keterangan}
                  onChangeText={text => {
                    setKeterangan(text);
                  }}
                  label={
                    userRole == 'parent'
                      ? 'Kritik dan saran dalam pertemuan ini:'
                      : 'Review Les hari ini'
                  }
                  mode="outlined"
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}>
                  <Button
                    onPress={async () => {
                      setHiddenButtonAbsen(true);
                      setInputKeterangan(false);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    onPress={async () => {
                      if (userRole == 'tutor') {
                        const {success} = await apiPost({
                          url: '/les/present/' + data.idabsen,
                          payload: {keterangan: Keterangan},
                        });
                        if (success) {
                          navigation.navigate<any>('MainTabs');
                        }
                      } else if (userRole == 'parent') {
                        if (ratingCount == 0) {
                          return setRatingModul(true);
                        }
                        const {success} = await apiPost({
                          url: '/les/present/' + data.idabsen,
                          payload: {
                            keterangan: Keterangan,
                            rating: ratingCount,
                          },
                        });
                        if (success) {
                          navigation.navigate<any>('MainTabs');
                        }
                      }
                    }}>
                    Kirim
                  </Button>
                </View>
              </View>
            )}
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
