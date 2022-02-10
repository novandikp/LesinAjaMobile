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
import {Controller, useForm} from 'react-hook-form';
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
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet} from '@utils';
import {getListLest} from '@utils/getListData';
import DatePicker from 'react-native-date-picker';
import {unstable_batchedUpdates} from 'react-native';

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
  const [biaya, setBiaya] = useState('');
  const [Open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [openTime, setOpenTime] = useState(false);

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
  const onSubmit = async (data: object) => {
    listLes.find((i: any) =>
      i.paket == data.idpaket ? (data.idpaket = Number(i.idpaket)) : null,
    );
    listMurid.find((i: any) =>
      i.siswa == data.idsiswa ? (data.idsiswa = Number(i.idsiswa)) : null,
    );
    console.log(data);
    // const {success} = await apiPost({
    //   url: 'les/daftar',
    //   payload: data,
    // });
    // console.log(success);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Tambah Les Baru" />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* Siswa */}
          {/* <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <InputChoice
                label="Siswa yang Mengikuti Les"
                value={value}
                error={!!errors.siswa}
                errorMessage="Harap pilih siswa yang mengikuti les"
                onSelect={item => onChange(item.nama)}
                listData={master_siswa}
                keyMenuTitle="nama"
                keyMenuDescription="jenjangKelas"
              />
            )}
            name="siswa"
            defaultValue={''}
          /> */}
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
                  error={!!errors.pilihanles}
                  errorMessage="Harap pilih les yang akan diikuti"
                  onSelect={item => {
                    onChange(item.paket);
                    setBiaya(item.biaya);
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
          {/* <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
            )
                
          /> */}

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
            hargaLes={biaya}
            hargaDaftar="Rp 150.000"
            total="Rp 350.000"
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
