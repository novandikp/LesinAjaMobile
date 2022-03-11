import React, {FC, useEffect, useState} from 'react';
import {
  ButtonFormSubmit,
  CardKeyValue,
  Header,
  InputChoice,
  InputChoiceWFilter,
  InputRadio,
} from '@components';
import {
  color,
  dimens,
  // master_pilihanles,
  // master_siswa,
  // PilihanLesType,
} from '@constants';
import {TextInput, Text, Button} from 'react-native-paper';
import {Controller, useForm, SubmitHandler} from 'react-hook-form';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {
  //Button, Text, TextInput, RadioButton,
  Card,
  Checkbox,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet, apiPost} from '@utils';
import {getListLest} from '@utils/getListData';
import DatePicker from 'react-native-date-picker';
// import MultiSelect from 'react-native-multiple-select';
type FormDataType = {
  idpaket: string;
  idsiswa: string;
  tglles: string; // 2021-09-01
  jamles: string;
  hari: string; // SENIN,SELASA,RABU,JUMAT
  prefrensi: string;
};
type ScreenProps = StackScreenProps<AppStackParamList>;
export const AddLes: FC<ScreenProps> = ({navigation}) => {
  const [listLes, setListLes] = useState([]);
  const [listMurid, setListMurid] = useState([]);
  const [Open, setOpen] = useState(false);
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const [biaya, setBiaya] = useState(0);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(new Date());
  const [openTime, setOpenTime] = useState(false);
  const [isModalVisibleDay, setModalVisibleDay] = useState(false);
  const [selectedDays, setSelectedDays] = useState<any>([]);
  const [isModalVisibleJenjang, setModalVisibleJenjang] = useState(false);
  const [valueJenjang, setValueJenjang] = useState();
  const [Days, setDays] = useState([
    {id: '00', name: 'MINGGU', status: false},
    {id: '01', name: 'SENIN', status: false},
    {id: '02', name: 'SELASA', status: false},
    {id: '03', name: 'RABU', status: false},
    {id: '04', name: 'KAMIS', status: false},
    {id: '05', name: 'JUMAT', status: false},
    {id: '06', name: 'SABTU', status: false},
  ]);
  const [Jenjang, setJenjang] = useState([
    {id: '00', jenjang: 'PAUD', status: false},
    {id: '01', jenjang: 'TK', status: false},
    {id: '02', jenjang: 'SD', status: false},
    {id: '03', jenjang: 'SMP', status: false},
    {id: '04', jenjang: 'SMA', status: false},
    {id: '05', jenjang: 'UMUM', status: false},
    {id: '06', jenjang: 'AGAMA', status: false},
  ]);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormDataType>({mode: 'onChange'});
  useEffect(() => {
    let active = true;
    const getInitialData = async () => {
      const les = await getListLest();
      const murid = await apiGet({
        url: 'siswa/my?page=1&siswa=&orderBy=siswa&sort=ASC',
      });
      if (active) {
        setListMurid(murid.data);
        setListLes(les);
      }
    };

    getInitialData();
    return () => {
      active = false;
      // cancelApiRequest();
    };
  }, [selectedDays]);
  const onSubmit: SubmitHandler<FormDataType> = async data => {
    let hari = selectedDays.toString();
    data.hari = hari;
    data.jamles = time.getHours() + ':' + time.getMinutes();
    listLes.find((i: any) =>
      i.paket == data.idpaket ? (data.idpaket = i.idpaket) : null,
    );
    listMurid.find((i: any) =>
      i.siswa == data.idsiswa ? (data.idsiswa = i.idsiswa) : null,
    );
    const {success} = await apiPost({
      url: 'les/daftar',
      payload: data,
    });
    if (success) {
      navigation.navigate<any>('MainTabs');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Tambah Les Baru" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        // style={{flex: 1}}
      >
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* pilih siswa */}
          {listMurid && (
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <InputChoice
                  toNumber={false}
                  label="Pilih Murid"
                  value={value}
                  error={!!errors.idsiswa}
                  errorMessage="Harap pilih murid yang akan diikuti"
                  onSelect={item => {
                    onChange(item.siswa);
                  }}
                  listData={listMurid}
                  keyMenuTitle="siswa"
                  keyMenuDescription={'jenjang'}
                />
              )}
              name="idsiswa"
            />
          )}
          {/* Pilihan les */}
          {listLes && (
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <View>
                  <InputChoiceWFilter
                    toNumber={true}
                    label="Pilihan Les"
                    value={value}
                    error={!!errors.idpaket}
                    errorMessage="Harap pilih les yang akan diikuti"
                    onSelect={item => {
                      setBiaya(item.biaya);
                      onChange(item.paket);
                    }}
                    onIconPress={() => {
                      setModalVisibleJenjang(true);
                    }}
                    littleKeyMenuDescription="jenjang"
                    listData={listLes}
                    keyMenuTitle="paket"
                    keyMenuDescription="biaya"
                  />
                  <Modal
                    isVisible={isModalVisibleJenjang}
                    onBackdropPress={() => setModalVisibleJenjang(false)}>
                    <Card
                      style={{
                        paddingVertical: 15,
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          paddingVertical: 10,
                          textAlign: 'center',
                        }}>
                        Filter Jenjang Les
                      </Text>
                      {/* List Jenjang */}
                      {Jenjang.map((item: any, index: number) => {
                        return (
                          <Checkbox.Item
                            key={index}
                            label={item.jenjang}
                            status={item.status ? 'checked' : 'unchecked'}
                            onPress={() => {
                              setJenjang(
                                Jenjang.map((object: any) => {
                                  if (object.id == item.id) {
                                    setValueJenjang(item.jenjang);
                                    if (item.status == true) {
                                      return {...object, status: !item.status};
                                    } else {
                                      return {...object, status: !item.status};
                                    }
                                  } else if (object.id != item.id) {
                                    if (item.status == true) {
                                      return {...object, status: !item.status};
                                    } else {
                                      return {...object, status: item.status};
                                    }
                                  }
                                }),
                              );
                            }}
                          />
                        );
                      })}
                      <Button
                        onPress={async () => {
                          const newListLes = await apiGet({
                            url:
                              '/paket?page=1&paket&orderBy=biaya&sort=ASC&jenjang=' +
                              valueJenjang,
                          });
                          setListLes(newListLes.data);
                          setModalVisibleJenjang(false);
                        }}>
                        Pilih
                      </Button>
                    </Card>
                  </Modal>
                </View>
              )}
              name="idpaket"
            />
          )}
          {/* Jadwal les */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <View>
                <DatePicker
                  modal
                  open={Open}
                  date={date}
                  mode="date"
                  textColor={color.grey_5}
                  onConfirm={Date => {
                    onChange(Date.toISOString().slice(0, 10));
                    setDate(Date);
                    setOpen(false);
                  }}
                  minimumDate={new Date()}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                <TextInput
                  style={{backgroundColor: 'white', marginBottom: 10}}
                  placeholder="Piih Tanggal Les"
                  value={date.toISOString().slice(0, 10)}
                  editable={false}
                  selectTextOnFocus={false}
                  error={!!errors.tglles}
                  // errorMessage="Harap pilih tanggal les"
                  right={
                    <TextInput.Icon
                      name="calendar"
                      onPress={() => {
                        setOpen(true);
                      }}
                    />
                  }
                />
              </View>
            )}
            name="tglles"
            defaultValue={today.toISOString().slice(0, 10)}
          />
          {/* Input Time */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <View>
                <DatePicker
                  modal
                  title={'Pilih Jam Les'}
                  open={openTime}
                  date={time}
                  mode="time"
                  textColor={color.grey_5}
                  onConfirm={Time => {
                    onChange(Time.toISOString());
                    setTime(Time);
                    setOpenTime(false);
                  }}
                  onCancel={() => {
                    setOpenTime(false);
                  }}
                />
                <TextInput
                  style={{backgroundColor: 'white', marginBottom: 10}}
                  placeholder="Piih Jam Les"
                  value={time.getHours() + ':' + time.getMinutes()}
                  editable={false}
                  selectTextOnFocus={false}
                  error={!!errors.jamles}
                  // errorMessage="Harap pilih jam les"
                  right={
                    <TextInput.Icon
                      name="clock"
                      onPress={() => {
                        setOpenTime(true);
                      }}
                    />
                  }
                />
              </View>
            )}
            name="jamles"
            defaultValue={today.getHours() + ':' + today.getMinutes()}
          />
          {/* hari */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <View>
                <Modal
                  isVisible={isModalVisibleDay}
                  onBackdropPress={() => setModalVisibleDay(!isModalVisibleDay)}
                  onModalHide={() => {
                    onChange(selectedDays);
                  }}>
                  <Card
                    style={{
                      paddingVertical: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 22,
                        paddingVertical: 10,
                        textAlign: 'center',
                      }}>
                      Pilih Hari
                    </Text>
                    {Days.map((item: any, index: number) => {
                      return (
                        <Checkbox.Item
                          key={index}
                          label={item.name}
                          status={item.status ? 'checked' : 'unchecked'}
                          onPress={() => {
                            setDays(
                              Days.map((object: any) => {
                                if (object.id == item.id) {
                                  return {...object, status: !item.status};
                                } else {
                                  return object;
                                }
                              }),
                            );
                          }}
                        />
                      );
                    })}
                    <Button
                      onPress={async () => {
                        var selectedItems: string[] = [];
                        Days.map((object: any) => {
                          if (object.status == true) {
                            selectedItems.push(object.name);
                          }
                        });
                        setSelectedDays(selectedItems.toString());
                        setModalVisibleDay(!isModalVisibleDay);
                      }}>
                      Pilih hari les
                    </Button>
                  </Card>
                </Modal>
                <TextInput
                  style={{backgroundColor: 'white', marginBottom: 10}}
                  placeholder="Pilih hari les"
                  error={!!errors.hari}
                  label="Pilih hari les"
                  value={selectedDays.toString()}
                  selectTextOnFocus={false}
                  editable={false}
                  right={
                    <TextInput.Icon
                      name="calendar"
                      onPress={async () => {
                        // const openmodal = () =>
                        setModalVisibleDay(!isModalVisibleDay);
                        // openmodal();
                      }}
                    />
                  }
                />
              </View>
            )}
            name="hari"
            defaultValue={selectedDays.toString()}
          />

          {/* Jenis kelamin tutor */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <InputRadio
                label="Preferensi Jenis Kelamin Tutor"
                value={value}
                onChange={onChange}
                radioItems={[
                  {text: 'Pria', value: 'Pria'},
                  {text: 'Wanita', value: 'Wanita'},
                  {text: 'Bebas', value: 'bebas'},
                ]}
                error={!!errors.prefrensi}
                errorMessage="Harap pilih prefrensi tutor"
              />
            )}
            name="prefrensi"
            defaultValue={''}
          />

          {/* Total Psrice */}
          <TotalPrice
            hargaLes={biaya.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
            // hargaDaftar="Rp 150,000.00"
            total={biaya.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
          />
        </View>
      </ScrollView>

      {/* Submit button */}
      <ButtonFormSubmit text="Kirim" onPress={handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};

type TotalPriceType = {
  hargaLes: string;
  hargaDaftar?: string;
  total: string;
};

const TotalPrice: FC<TotalPriceType> = ({hargaLes, hargaDaftar, total}) => {
  return (
    <Card style={{marginTop: dimens.standard}}>
      <Card.Title title={`Total: ${total}`} />

      <Card.Content style={{marginTop: dimens.small}}>
        <CardKeyValue keyName="Biaya Les" value={hargaLes} />
        {hargaDaftar && (
          <CardKeyValue keyName="Pendaftaran" value={hargaDaftar} />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
