import React, {FC, useContext, useEffect, useState} from 'react';
import {ButtonFormSubmit, CardLabelValue, Gap, Header} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Card, Divider, Subheading, Title} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {AuthContext} from '@context/AuthContext';
import {apiPost} from '@utils';
import {Icon} from 'react-native-elements';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailTutor'>;
export const DetailTutor: FC<ScreenProps> = ({navigation, route}) => {
  const {
    state: {userRole},
  } = useContext(AuthContext);
  const [item, setItem] = useState<any>([]);
  const {data}: any = route.params;
  useEffect(() => {
    const getInitialData = async () => {
      setItem(data);
    };
    getInitialData();
    return () => {};
  }, [data]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Tutor" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        <Card style={styles.contentContainer}>
          {/* Profile Photo */}
          {/* <Avatar.Image
            size={160}
            source={{uri: 'http://placekitten.com/200/200'}}
            style={{alignSelf: 'center'}}
          /> */}
          <Icon
            size={160}
            name="user"
            type="font-awesome"
            style={{alignSelf: 'center'}}
          />
          <Title style={{textAlign: 'center'}}>{item.guru}</Title>
          <Subheading style={{textAlign: 'center'}}>{item.mapel}</Subheading>
          <Gap y={dimens.tiny} />
          <Divider />
          <Gap y={dimens.tiny} />

          {/* More data */}
          <CardLabelValue label="Jenis Kelamin" value={item.jeniskelaminguru} />
          <CardLabelValue
            label="Perguruan Tinggi"
            value={item.perguruantinggi}
          />
          <CardLabelValue label="Jurusan" value={item.jurusan} />
          <CardLabelValue
            label="Alamat"
            value={userRole == 'admin' ? item.alamat : item.alamatguru}
          />

          {/* This data only exist in admin page */}
          {userRole == 'admin' && (
            <>
              <CardLabelValue label="Email" value={item.email} />
              <CardLabelValue label="Nomor WA" value={item.telp} />
              <CardLabelValue label="Bank" value={item.bank} />
              <CardLabelValue label="Rekening" value={item.rekening} />
            </>
          )}

          {/* <CardLabelValue
            label="Pengalaman Mengajar"
            value="Banyak sekali pengalaman yang sangat berharga saat mengajar di kelas I Sekolah Dasar. Salah satunya adalah latar belakang siswa yang berbeda, ada yang cerdas namun pemalu atau kurang percaya diri, ada yang hiperaktif tapi dalam akademik saat diberikan tugas ia kurang menyukainya, dan ada pula yang selalu cari perhatian dan keinginannya harus selalu dituruti.\nDengan berbagai perasaan yang bercampur aduk saya ditempatkan di kelas 2. Karena pada saat itu, mereka guru-guru senior disana melihat latar belakang saya adalah seorang yang berpengalaman karena sudah pernah mengajar di TK."
          /> */}
          <CardLabelValue
            label="Riwayat Mengajar"
            value={item.pernahmengajar}
          />
          <CardLabelValue label="Lama Mengajar" value={item.lamamengajar} />
          {/* TODO: GET DOWNLOAD CV */}
          {userRole == 'admin' && (
            <CardLabelValue
              label="File CV"
              value={'http://45.76.149.250/cv/' + item.file_cv}
              isValueLink
            />
          )}
        </Card>
      </ScrollView>
      {/* Submit button */}
      {userRole == 'parent' && (
        <ButtonFormSubmit
          text="Pilih Tutor"
          onPress={async () => {
            const newdata = {
              idapplylowongan: item.idapplylowongan.toString(),
              idles: item.idles.toString(),
              tglmulai: new Date(item.tglles).toISOString().slice(0, 10),
            };
            const {success} = await apiPost({
              url: '/lowongan/terima',
              payload: newdata,
            });
            if (success) {
              navigation.navigate<any>('MainTabs');
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: dimens.standard,
  },
});
