import React, {FC, useState, useEffect, useRef} from 'react';
import {
  CardKeyValue,
  Gap,
  Header,
  NestedCard,
  SkeletonLoading,
} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  ListRenderItemInfo,
  View,
  LogBox,
} from 'react-native';
import {
  // Avatar,
  Button,
  Card,
  Subheading,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/core';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {getSingleDocument, apiGet, apiPostFile, apiPost} from '@utils';
import {Picker} from '@react-native-picker/picker';

import {Icon} from 'react-native-elements';
type JadwalType = {
  idabsen: string;
  tglabsen: string;
  flagabsen: number;
  flagabsenwali: number;
  paket: string;
  jumlah_pertemuan: number;
  siswa: string;
  jenjang: string;
  kelas: string;
  alamat_wali: string;
  guru: string;
  alamat_guru: string;
};
type applyTutor = {
  idapplylowongan: string;
  statusapply: string;
  idlowongan: string;
  idles: string;
  idpaket: string;
  idsiswa: string;
  tglles: string;
  jamles: string;
  hari: string;
  statusles: string;
  paket: string;
  jumlah_pertemuan: string;
  biaya: string;
  siswa: string;
  jenjang: string;
  kelas: string;
  jeniskelamin: string;
  gaji: string;
  guru: string;
  idguru: string;
  jeniskelaminguru: string;
  alamatguru: string;
  pernahmengajar: string;
  lamamengajar: string;
  perguruantinggi: string;
  jurusan: string;
  file_cv: string;
};
// FIXME:VirtualizedLists should never be nested inside plain ScrollViews with the same orientation.

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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
  const [detailLes, setDetailLes] = useState<any>([]);
  const [listApplyingTutor, setListApplyingTutor] = useState<any>([]);
  const [coursePresenceList, setCoursePresenceList] = useState<any>([]);
  const [alamat, setAlamat] = useState('-');
  // Ganti tutor
  const [inputKeterangan, setInputKeterangan] = useState(false);
  const [hiddenButtonGtutor, setHiddenButtonGtutor] = useState(true);
  const [Keterangan, setKeterangan] = useState('');
  const [gTutor, setGTutor] = useState(false);

  // loading
  const [page, setPage] = useState(1);
  const [buttonLoadMore, setButtonLoadMore] = useState(true);
  const [displayButton, setDisplayButton] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  // Loading page
  const componentMounted = useRef(true); // (3) component is mounted
  const [isRefreshing, setIsRefreshing] = useState(true);
  const isFocus = useIsFocused();
  const [loading, setIsLoading] = useState(true);
  const [isLoadMoreData, setLoadMoreData] = useState(false);
  const [bank, setBank] = useState(null);
  const listRekening = [
    {
      Bank: 'BCA',
      name: 'a.n Siti Aminah',
      norek: '0181833415',
      id: '00',
    },
    {
      Bank: ' Mandiri ',
      name: 'a.n Siti Aminah',
      norek: '1410019573963',
      id: '01',
    },
    {
      Bank: ' BNI ',
      name: 'a.n Siti Aminah',
      norek: '1174432242',
      id: '02',
    },
    {
      Bank: ' BRI ',
      name: 'a.n Siti Aminah',
      norek: '010901074342507',
      id: '03',
    },
    {
      Bank: ' BSI ',
      name: 'a.n SITI AMINAH',
      norek: '7178577788',
      id: '04',
    },
  ];
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
  const loadMoreData = async () => {
    let NextPage = page + 1;
    await apiGet({
      url: '/jadwal/les/' + data.idles,
      params: {
        cari: '',
        orderBy: 'tglabsen',
        sort: 'asc',
        page: NextPage,
      },
    })
      .then(res => {
        if (res.data == null) {
          setLoadingData(false);
          return setDisplayButton(false);
        }
        setCoursePresenceList(coursePresenceList.concat(res.data));
        if (res.data.length < 10) {
          console.log('its should close buton');
          return setDisplayButton(false);
        } else if (res.data.length == 10) {
          setLoadingData(false);
          setButtonLoadMore(false);
          setPage(NextPage);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
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
      });
      if (componentMounted.current) {
        setCoursePresenceList(jadwalles.data);
        if (jadwalles.data.length != 0) {
          setAlamat(jadwalles.data[0].alamat_wali);
        }
        const Hbutton = jadwalles.data.filter((item: any) => {
          return item.flagabsen != 0 && item.flagabsenwali != 0;
        });
        // button Ganti tutor hilang ketika semua sudah diabsen
        if (Hbutton.length == jadwalles.data.length) {
          setGTutor(false);
        }
        // Button Ganti tutor muncul jika sudah pernah absen
        else if (Hbutton.length >= 1) {
          setGTutor(true);
        }
        // Button tidak muncul ketika belum pernah absen/presensi
        else if (Hbutton.length == 0) {
          setGTutor(false);
        }
        setDetailLes(data);
        setListApplyingTutor(applyingTutor.data);
        console.log('component mounted current');
      }
      if (isActive) {
        setDetailLes(data);
        setListApplyingTutor(applyingTutor.data);
        if (isLoadMoreData) {
          setCoursePresenceList(coursePresenceList);
        } else {
          if (jadwalles.data.length == 10) {
            setButtonLoadMore(false);
            setDisplayButton(true);
          }
          setCoursePresenceList(jadwalles.data);
        }
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };
    if (isRefreshing || loading || isFocus) {
      getInitialData();
    }

    return () => {
      componentMounted.current = false;
      isActive = false;
    };
  }, [
    coursePresenceList,
    data,
    id,
    isFocus,
    isLoadMoreData,
    isRefreshing,
    loading,
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Les" />

      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        {/* About Les*/}
        {loading || isRefreshing ? (
          <SkeletonLoading />
        ) : (
          <SafeAreaView>
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
                <CardKeyValue
                  keyName="Tutor"
                  value={detailLes.guru != null ? detailLes.guru : '-'}
                  keyFlex={8}
                />
                <CardKeyValue
                  keyName="Paket"
                  value={detailLes.paket != null ? detailLes.paket : '-'}
                  keyFlex={8}
                />
                <CardKeyValue keyName="Alamat" value={alamat} keyFlex={8} />
                <CardKeyValue
                  keyName="Tgl Mulai"
                  value={
                    detailLes != null
                      ? new Date(detailLes.tglles).toLocaleDateString()
                      : '-'
                  }
                  keyFlex={8}
                />
                <CardKeyValue
                  keyName="Hari"
                  value={detailLes.hari}
                  keyFlex={8}
                />

                {/* <CardKeyValue keyName="Tgl Selesai" value="-" keyFlex={8} /> */}
              </Card.Content>
            </Card>

            {/* There is no applying tutor */}
            {statusles == 0 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Menunggu Ada Tutor"
                  titleStyle={{color: '#2563EB'}}
                />
                <Card.Content>
                  <Subheading>
                    Belum ada tutor yang mengambil les ini
                  </Subheading>
                </Card.Content>
              </Card>
            )}

            {/* Choose Tutor */}
            {statusles == 0 && (
              <>
                <Card style={{marginTop: dimens.standard}}>
                  <Card.Title
                    style={{width: '100%'}}
                    title="Anda Belum Memilih Tutor"
                    subtitle="Klik item untuk melihat detail tutor "
                    titleStyle={{color: '#F59E0B'}}
                    subtitleStyle={{fontSize: dimens.medium_14}}
                  />
                  <Card.Content>
                    <FlatList
                      style={{
                        // minheight: 0,
                        maxHeight: 200,
                      }}
                      // style={listApplyingTutor==null?0:200}
                      nestedScrollEnabled={true}
                      contentContainerStyle={{
                        flexGrow: 1,
                        padding: dimens.standard,
                        paddingTop: dimens.small,
                      }}
                      data={listApplyingTutor}
                      keyExtractor={(item: applyTutor) => item.idapplylowongan}
                      renderItem={({item}: ListRenderItemInfo<applyTutor>) => (
                        <NestedCard
                          title={item.guru}
                          subtitle={item.perguruantinggi}
                          onPress={() => {
                            navigation.navigate<any>('DetailTutor', {
                              data: item,
                            });
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
                      )}
                      onEndReachedThreshold={0.1}
                      // ListEmptyComponent=
                    />
                  </Card.Content>
                </Card>
                <Button
                  color={color.red}
                  onPress={async () => {
                    const {success} = await apiPost({
                      url: '/les/batal',
                      payload: {
                        idles: data.idles,
                      },
                    });
                    if (success) {
                      navigation.navigate<any>('MainTabs');
                    }
                  }}>
                  batalkan les
                </Button>
              </>
            )}
            {/* Pembayaran */}
            {statusles == 2 && (
              <>
                <Card style={{marginTop: dimens.standard}}>
                  <Card.Title
                    title="Anda Belum Membayar Biaya Les"
                    subtitle={
                      'Biaya Les: Rp ' +
                      bayar.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
                      ' (Ukuran maks.2mb)'
                    }
                    titleStyle={{color: '#EF4444'}}
                    subtitleStyle={{fontSize: dimens.medium_14}}
                  />
                  <Picker
                    style={{flex: 2}}
                    mode="dropdown"
                    selectedValue={bank}
                    itemStyle={{height: 10, backgroundColor: 'white'}}
                    onValueChange={itemValue => setBank(itemValue)}>
                    <Picker.Item
                      key={'-'}
                      label="Pilih bank yang akan ditransfer"
                      value={null}
                    />
                    {listRekening.map((item: any, index: number) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={item.Bank}
                          value={item.Bank}
                        />
                      );
                    })}
                  </Picker>
                  {bank != null &&
                    listRekening.map((i: any, index: number) => {
                      if (i.Bank == bank) {
                        return (
                          <Card.Content key={index}>
                            <CardKeyValue
                              keyName="Nama"
                              value={i.name}
                              keyFlex={8}
                            />
                            <CardKeyValue
                              keyName="Bank"
                              value={i.Bank}
                              keyFlex={8}
                            />
                            <CardKeyValue
                              keyName="No rekening"
                              value={i.norek}
                              keyFlex={8}
                            />
                          </Card.Content>
                        );
                      }
                    })}
                  {buktiBayar.path !== '' && (
                    <Card.Cover
                      source={{uri: buktiBayar.path}}
                      style={{
                        marginTop: dimens.small,
                        marginHorizontal: dimens.standard,
                        // height: 300,
                        height: 300,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                  <Card.Actions>
                    <Button
                      disabled={isLoading}
                      loading={isLoading}
                      onPress={onPressUploadBuktiBayar}>
                      {buktiBayar.path === ''
                        ? 'Unggah Bukti Pembayaran'
                        : 'Kirim'}
                    </Button>
                  </Card.Actions>
                </Card>
              </>
            )}
            {/* Konfirmasi pembayaran Les */}
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

            {/* Presence */}
            {statusles == 4 && (
              <Card
                style={{
                  marginTop: dimens.standard,
                }}>
                <Card.Title
                  title="Presensi Les"
                  subtitle="Klik item untuk melihat detail presensi"
                  titleStyle={{color: '#2563EB'}}
                  subtitleStyle={{fontSize: dimens.medium_14}}
                />
                <Card.Content>
                  <FlatList
                    // ListHeaderComponent={<></>}
                    style={{
                      height: 400,
                      // minHeight
                    }}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      flexGrow: 1,
                      padding: dimens.standard,
                      paddingTop: dimens.small,
                    }}
                    data={coursePresenceList}
                    keyExtractor={(item: JadwalType) => item.idabsen}
                    renderItem={({item}: ListRenderItemInfo<JadwalType>) => (
                      <NestedCard
                        key={item.idabsen}
                        title={new Date(item.tglabsen).toLocaleDateString()}
                        // subtitle={}
                        subtitle="-"
                        additionalText={
                          item.flagabsenwali == 1
                            ? 'Wali sudah mengisi absen'
                            : item.flagabsenwali == 2
                            ? 'Wali tidak hadir'
                            : 'Wali belum mengisi absen'
                        }
                        onPress={() => {
                          navigation.navigate<any>('DetailPresensi', {
                            data: item,
                          });
                        }}
                      />
                    )}
                    extraData={coursePresenceList}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={
                      <View>
                        {displayButton == true && (
                          <Button
                            loading={loadingData}
                            onPress={() => {
                              setLoadMoreData(true);
                              setLoadingData(true);
                              loadMoreData();
                            }}
                            mode="contained"
                            disabled={buttonLoadMore}
                            style={{
                              marginTop: 10,
                              alignSelf: 'center',
                              marginHorizontal: 10,
                            }}>
                            Load More Data
                          </Button>
                        )}
                      </View>
                    }
                  />
                </Card.Content>

                {gTutor && (
                  <Card.Actions style={{alignSelf: 'center'}}>
                    {hiddenButtonGtutor && (
                      <Button
                        onPress={async () => {
                          setInputKeterangan(true);
                          setHiddenButtonGtutor(false);
                        }}>
                        Ganti Tutor
                      </Button>
                    )}
                    {inputKeterangan && (
                      <View>
                        <TextInput
                          value={Keterangan}
                          onChangeText={text => {
                            setKeterangan(text);
                          }}
                          label={'Alasan untuk ganti tutor ?'}
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
                              setHiddenButtonGtutor(true);
                              setInputKeterangan(false);
                            }}>
                            Cancel
                          </Button>
                          <Button
                            onPress={async () => {
                              const {success} = await apiPost({
                                url: '/les/ulang',
                                payload: {idles: id, alasan: Keterangan},
                              });
                              if (success) {
                                navigation.navigate<any>('MainTabs');
                              } else {
                                setHiddenButtonGtutor(true);
                                setInputKeterangan(false);
                              }
                            }}>
                            Kirim
                          </Button>
                        </View>
                      </View>
                    )}
                  </Card.Actions>
                )}
              </Card>
            )}
            {/* Pembayaran ditolak */}
            {statusles == 5 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Pembayaran ditolak"
                  subtitle={
                    'Biaya Les: Rp ' +
                    bayar.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') +
                    ' (Ukuran maks.2mb)'
                  }
                  titleStyle={{color: '#EF4444'}}
                  subtitleStyle={{fontSize: dimens.medium_14}}
                />
                <Picker
                  style={{flex: 2}}
                  mode="dropdown"
                  selectedValue={bank}
                  itemStyle={{height: 10, backgroundColor: 'white'}}
                  onValueChange={itemValue => setBank(itemValue)}>
                  <Picker.Item
                    key={'-'}
                    label="Pilih bank yang akan ditransfer"
                    value={null}
                  />
                  {listRekening.map((item: any, index: number) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={item.Bank}
                        value={item.Bank}
                      />
                    );
                  })}
                </Picker>
                {bank != null &&
                  listRekening.map((i: any, index: number) => {
                    if (i.Bank == bank) {
                      return (
                        <Card.Content key={index}>
                          <CardKeyValue
                            keyName="Nama"
                            value={i.name}
                            keyFlex={8}
                          />
                          <CardKeyValue
                            keyName="Bank"
                            value={i.Bank}
                            keyFlex={8}
                          />
                          <CardKeyValue
                            keyName="No rekening"
                            value={i.norek}
                            keyFlex={8}
                          />
                        </Card.Content>
                      );
                    }
                  })}
                {/* <Card.Content></Card.Content> */}
                {buktiBayar.path !== '' && (
                  <Card.Cover
                    source={{uri: buktiBayar.path}}
                    style={{
                      marginTop: dimens.small,
                      marginHorizontal: dimens.standard,
                      height: 300,
                      resizeMode: 'contain',
                    }}
                  />
                )}
                <Card.Actions>
                  <Button
                    disabled={isLoading}
                    onPress={onPressUploadBuktiBayar}>
                    {buktiBayar.path === ''
                      ? 'Unggah Bukti Pembayaran'
                      : 'Kirim'}
                  </Button>
                  {isLoading && <ActivityIndicator animating={isLoading} />}
                </Card.Actions>
              </Card>
            )}
            {/* Les Selesai dan button perpanjang */}
            {statusles == 6 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Les Telah Selesai"
                  titleStyle={{color: '#2563EB'}}
                  subtitleStyle={{fontSize: dimens.medium_14}}
                  subtitle="Klik perpanjang les untuk memperbarui les"
                />
                <Card.Actions>
                  <Button
                    onPress={async () => {
                      const newData = new FormData();
                      newData.append('idles', data.idles);
                      newData.append(
                        'tglperpanjang',
                        new Date().toISOString().slice(0, 10),
                      );
                      // console.log(newData._parts);

                      const {success} = await apiPost({
                        url: '/les/perpanjang',
                        payload: {
                          idles: data.idles,
                          tglperpanjang: new Date().toISOString().slice(0, 10),
                        },
                      });
                      if (success) {
                        navigation.navigate('Les');
                      }
                    }}>
                    Perpanjang Les
                  </Button>
                </Card.Actions>
              </Card>
            )}
            {statusles == 7 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Menunggu Ada Tutor"
                  titleStyle={{color: '#2563EB'}}
                />
                <Card.Content>
                  <Subheading>
                    Belum ada tutor yang mengambil les ini
                  </Subheading>
                </Card.Content>
              </Card>
            )}

            {/* Choose Tutor */}
            {statusles == 7 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  style={{width: '100%'}}
                  title="Anda Belum Memilih Tutor"
                  subtitle="Klik item untuk melihat detail tutor "
                  titleStyle={{color: '#F59E0B'}}
                  subtitleStyle={{fontSize: dimens.medium_14}}
                />
                <Card.Content>
                  <FlatList
                    style={{
                      // minheight: 0,
                      maxHeight: 200,
                    }}
                    // style={listApplyingTutor==null?0:200}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{
                      flexGrow: 1,
                      padding: dimens.standard,
                      paddingTop: dimens.small,
                    }}
                    data={listApplyingTutor}
                    keyExtractor={(item: applyTutor) => item.idapplylowongan}
                    renderItem={({item}: ListRenderItemInfo<applyTutor>) => (
                      <NestedCard
                        title={item.guru}
                        subtitle={item.perguruantinggi}
                        onPress={() => {
                          navigation.navigate<any>('DetailTutor', {
                            data: item,
                          });
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
                    )}
                    onEndReachedThreshold={0.1}
                    // ListEmptyComponent=
                  />
                </Card.Content>
              </Card>
            )}
            {/* lES DIBATALKAN */}
            {statusles == 8 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Les dibatalkan"
                  titleStyle={{color: '#EF4444'}}
                  subtitle="Wali membatalkan les"
                  subtitleStyle={{fontSize: dimens.medium_14}}
                />
              </Card>
            )}
            {/* Konfirmasi tutor */}
            {statusles == 9 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Menunggu Konfirmasi Tutor"
                  titleStyle={{color: '#2563EB'}}
                />
                <Card.Content>
                  <Subheading>Menunggu Konfirmasi Tutor</Subheading>
                </Card.Content>
              </Card>
            )}
            {/* tolak perpanjangan les */}
            {statusles == 10 && (
              <Card style={{marginTop: dimens.standard}}>
                <Card.Title
                  title="Permintaan ditolak"
                  titleStyle={{color: '#EF4444'}}
                  subtitleStyle={{fontSize: dimens.medium_14}}
                  subtitle="Tutor menolak permintaan perpanjangan les."
                />
              </Card>
            )}
            <Gap y={dimens.standard} />
          </SafeAreaView>
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
