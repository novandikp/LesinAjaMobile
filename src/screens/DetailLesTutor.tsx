import React, {FC, useState, useEffect} from 'react';
import {CardKeyValue, Gap, Header, NestedCard} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Avatar, Button, Card, Subheading} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {getSingleDocument, apiGet} from '@utils';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLesTutor'>;
export const DetailLesTutor: FC<ScreenProps> = ({navigation}) => {
  const coursePresenceList = [
    {
      tanggal: 'Kamis, 02 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
      status: 'selesai',
    },
    {
      tanggal: 'Jumat, 03 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
      status: 'selesai',
    },
    {
      tanggal: 'Sabtu, 04 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
    },
    {
      tanggal: 'Minggu, 06 September 2021',
      waktu: '07:00',
      tutor: 'Nico Akbar',
    },
  ];
  useEffect(() => {
    const getInitialData = async () => {
      const siswaku = await apiGet({
        url: '/siswa/my?page=1&siswa=&orderBy=siswa&sort=ASC',
      });
      console.log(siswaku);
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Les" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        {/* About Les */}
        <Card>
          <Card.Title title="IPA kelas 5 SD" subtitle="5/8 Pertemuan" />
          <Card.Content>
            <CardKeyValue keyName="Siswa" value="Andi Rayka" keyFlex={8} />
            <CardKeyValue keyName="Tutor" value="Udin Harun" keyFlex={8} />
            <CardKeyValue
              keyName="Tgl Mulai"
              value="12 Agustus 2021"
              keyFlex={8}
            />
            <CardKeyValue
              keyName="Tgl Selesai"
              value="12 September 2021"
              keyFlex={8}
            />
          </Card.Content>
        </Card>

        {/* There is no applying tutor */}
        <Card style={{marginTop: dimens.standard}}>
          <Card.Title
            title="Menunggu Konfirmasi Walimurid"
            titleStyle={{color: '#F59E0B'}}
          />
          <Card.Content>
            <Subheading>
              Menunggu wali murid konfirmasi tutor yang akan mengajar di les ini
            </Subheading>
          </Card.Content>
        </Card>

        {/* Presence */}
        <Card style={{marginTop: dimens.standard}}>
          <Card.Title
            title="Presensi Les"
            titleStyle={{color: '#2563EB'}}
            subtitle="Klik item untuk melihat detail presensi"
            subtitleStyle={{fontSize: dimens.medium_14}}
          />
          <Card.Content>
            {coursePresenceList.map((item, index) => {
              return (
                <NestedCard
                  key={index}
                  title={item.tanggal}
                  subtitle={item.waktu}
                  additionalText={item.status && item.status}
                  onPress={() => {
                    navigation.navigate('DetailPresensi');
                  }}
                />
              );
            })}
          </Card.Content>
        </Card>
        <Gap y={dimens.standard} />
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
