import React, {FC} from 'react';
import {
  ButtonFormSubmit,
  Header,
  InputChoice,
  InputRadio,
  InputText,
} from '@components';
import {color, dimens, listJenjangKelas} from '@constants';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiPost} from '@utils';
// import {Snackbar} from 'react-native-paper';

type FormDataType = {
  siswa: string;
  jeniskelamin: string;
  jenjang: string;
  kelas: string;
  sekolah: string;
};
type ScreenProps = StackScreenProps<AppStackParamList, 'EditStudent'>;
export const EditStudent: FC<ScreenProps> = ({
  route,
  navigation: {navigate},
}) => {
  const siswa = route.params?.item;
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
    setValue,
  } = useForm<FormDataType>({mode: 'onChange'});

  const onSubmit: SubmitHandler<FormDataType> = async data => {
    if (siswa != null) {
      const {success} = await apiPost({
        url: 'siswa/' + siswa.idsiswa,
        payload: data,
      });
      if (success) {
        navigate('ListStudents');
      }
    } else {
      const {success} = await apiPost({
        url: 'siswa',
        payload: data,
      });
      if (success) {
        navigate('ListStudents');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title={`${siswa ? 'Ubah' : 'Tambah'} Data Siswa`} />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* Nama */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan nama lengkap Siswa"
                label="Nama"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.siswa}
                errorMessage="Nama harus diisi"
              />
            )}
            name="siswa"
            defaultValue={siswa && siswa.siswa}
          />
          {/* Jenis kelamin  */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <InputRadio
                label="Jenis Kelamin"
                value={value}
                onChange={onChange}
                radioItems={[
                  {text: 'Laki-laki', value: 'Laki-laki'},
                  {text: 'Perempuan', value: 'Perempuan'},
                ]}
                error={!!errors.jeniskelamin}
                errorMessage="Harap masukkan jenis kelamin siswa"
              />
            )}
            name="jeniskelamin"
            defaultValue={siswa && siswa.jeniskelamin}
          />
          {/* Jenjang kelas */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <InputChoice
                toNumber={false}
                label="Jenjang Kelas"
                value={value}
                error={!!errors.jenjang}
                errorMessage="Harap pilih jenjang kelas siswa"
                onSelect={item => {
                  setValue('kelas', item.kelas);
                  onChange(item.jenjang);
                }}
                listData={listJenjangKelas}
                keyMenuTitle="name"
              />
            )}
            name="jenjang"
            // siswa.jenjang dan sisswa.kelas
            defaultValue={siswa && siswa?.jenjang}
          />
          {/* Sekolah */}
          {/* <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                label="Asal Sekolah"
                placeholder="Masukkan nama sekolah siswa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.sekolah}
                errorMessage="Asal sekolah harus diisi"
              />
            )}
            name="sekolah"
            defaultValue={siswa.sekolah}
          /> */}
        </View>
      </ScrollView>

      {/* Submit button */}
      <ButtonFormSubmit
        isLoading={isSubmitting}
        text="Simpan"
        onPress={handleSubmit(onSubmit)}
      />

      {/* <Snackbar visible={true} onDismiss={() => {}}>
        Berhasil tambah data siswa
      </Snackbar> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
