import React, {FC, useEffect, useState} from 'react';
import {
  ButtonFormSubmit,
  CardKeyValue,
  Header,
  InputChoice,
  InputRadio,
} from '@components';
import {
  color,
  dimens,
  // master_pilihanles,
  // master_siswa,
  // PilihanLesType,
} from '@constants';
import {TextInput} from 'react-native-paper';
import {Controller, useForm, SubmitHandler} from 'react-hook-form';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  // ScrollView,
} from 'react-native';
import {
  //Button, Text, TextInput, RadioButton,
  Card,
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet, apiPost} from '@utils';
import {getListLest} from '@utils/getListData';
import DatePicker from 'react-native-date-picker';
import {unstable_batchedUpdates} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
// react-native-multiple-select
type FormDataType = {
  idpaket: string;
  idsiswa: string;
  tglles: string; // 2021-09-01
  jamles: string;
  hari: string; // SENIN,SELASA,RABU,JUMAT
  preferensiTutor: string;
};
type ScreenProps = StackScreenProps<AppStackParamList>;
export const AddLes: FC<ScreenProps> = ({navigation}) => {
  const [listLes, setListLes] = useState([]);
  const [listMurid, setListMurid] = useState([]);
  const [Open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [openTime, setOpenTime] = useState(false);
  const [selectedDays, setSelectedDays] = useState<any>([]);
  const Days = [
    {id: '00', name: 'MINGGU'},
    {id: '01', name: 'SENIN'},
    {id: '02', name: 'SELASA'},
    {id: '03', name: 'RABU'},
    {id: '04', name: 'KAMIS'},
    {id: '05', name: 'JUMAT'},
    {id: '06', name: 'SABTU'},
  ];
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormDataType>({mode: 'onChange'});
  useEffect(() => {
    const getInitialData = async () => {
      const les = await getListLest();
      const murid = await apiGet({
        url: 'siswa/my?page=1&siswa=&orderBy=siswa&sort=ASC',
      });
      setListMurid(murid.data);
      setListLes(les);
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);
  const onSubmit: SubmitHandler<FormDataType> = async data => {
    // console.log(data)
    let hari = selectedDays.toString();
    data.hari = hari;
    // data.hari = hari.replace(/[{}]/g, '');
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

      <SafeAreaView
        //  contentContainerStyle={{flexGrow: 1}}
        style={{flex: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* pilih siswa */}
          {listMurid && (
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <InputChoice
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
                <InputChoice
                  label="Pilihan Les"
                  value={value}
                  error={!!errors.idpaket}
                  errorMessage="Harap pilih les yang akan diikuti"
                  onSelect={item => {
                    onChange(item.paket);
                    // setBiaya(item.biaya);
                  }}
                  listData={listLes}
                  keyMenuTitle="paket"
                  keyMenuDescription="biaya"
                />
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
                    unstable_batchedUpdates(() => {
                      onChange(Date.toISOString().slice(0, 10));
                      setDate(Date);
                      setOpen(false);
                    });
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
                    unstable_batchedUpdates(() => {
                      onChange(Time.toISOString());
                      setTime(Time);
                      setOpenTime(false);
                    });
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
          />
          {/* hari */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <MultiSelect
                items={Days}
                uniqueKey="name"
                onSelectedItemsChange={(item: any) => {
                  setSelectedDays(item);
                  onChange(selectedDays);
                }}
                selectedItems={selectedDays}
                selectText="Pilih Hari Les"
                // error={!!errors.hari}
                // errorMessage="Harap pilih tanggal les"
              />
            )}
            name="hari"
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
                  {text: 'Laki-laki', value: 'laki-laki'},
                  {text: 'Perempuan', value: 'perempuan'},
                  {text: 'Bebas', value: 'bebas'},
                ]}
                error={!!errors.preferensiTutor}
                errorMessage="Harap pilih prefrensi tutor"
              />
            )}
            name="preferensiTutor"
            defaultValue={''}
          />

          {/* Total Price */}
          <TotalPrice
            hargaLes="Rp 100.000"
            hargaDaftar="Rp 150.000"
            total="Rp 350.000"
          />
        </View>
      </SafeAreaView>

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
