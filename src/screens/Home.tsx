import {dimens} from '@constants';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import React, {FC} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Divider, Text, Title} from 'react-native-paper';
import {LogoLesinAja} from '@assets';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Settings'>,
  StackScreenProps<AppStackParamList>
>;
export const Home: FC<ScreenProps> = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Title>Informasi untuk Wali Murid Bimbel LesinAja </Title>
      <ScrollView>
        <Image source={LogoLesinAja} style={styles.image} />
        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'1.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Biaya pendaftaran & biaya Les dibayar di awal sebagai Tanda Jadi
            Les.
            <Text style={[styles.boldText]}>
              Pembayaran dilakukan setelah kami infokan data pengajarnya.
            </Text>
            Jika belum ada data pengajar, maka belum ada pembayaran
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'2.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Les berlangsung minimal 2x1 seminggu atau 8x sebulan dan maksimal 12
            x sebulan dengan durasi 1 jam (untuk PAUD&TK) dan 1,5 jam untuk SD
            keatas.
          </Text>
        </View>
        <Divider />

        {/* <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'3.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika dalam sebulan pertemuan kurang dari pertemuan yang disepakati,
            maka wali murid mendapatkan
            <Text style={styles.boldText}> CASH BACK</Text> (uang kembali)
            sejumlah pertemuan yang belum terlaksana yang dibuktikan dengan
            lembar bukti daftar hadir tutor.
          </Text>
        </View>
        <Divider /> */}

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'3.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika ada hal-hal yang kurang berkenan dari tutor kami,mohon wali
            murid infokan pada kami karena kami ingin yang terbaik untuk siswa,
            wali murid dan tutor.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'4.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika terjadi ketidakcocokan, kami ada jaminan mencarikan tutor
            sampai cocok .
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'5.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika wali murid menghendaki libur, wali murid bisa membuat
            kesepakatan untuk ganti hari dengan tutor yang bersangkutan.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'6.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika wali murid/siswa menghendaki libur , wali murid
            <Text style={styles.boldText}> wajib memberitahukan </Text>pada
            tutor minimal 2 jam sebelumnya agar tutor tidak terlanjur datang.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'7.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika tutor terlanjur datang namun wali murid{' '}
            <Text style={styles.boldText}>
              meliburkan tanpa pemberitahuan sebelumnya
            </Text>{' '}
            , maka tutor dianggap datang dan tutor berhak mengisi daftar
            kehadiran dan mendapatkan pembayaran .
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'8.    '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Bimbel <Text style={styles.boldText}> tidak meliburkan </Text> jika
            ada <Text style={styles.boldText}> tanggal merah </Text>. Namun jika
            ada jadwal les pada saat tanggal merah, wali murid bisa membuat
            kesepakakatan dengan tutor untuk masuk atau tidak . Jika tidak
            masuk, bisa dibuat kesepakakatan untuk mengganti hari.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'9.  '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Jika wali murid menghendaki tambahan jam, ada tambahan fee yang
            disesuaikan dengan durasi.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'10.  '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Wali Murid <Text style={styles.boldText}>wajib</Text> untuk{' '}
            <Text style={styles.boldText}>
              memantau laporan perkembangan siswa
            </Text>{' '}
            dan memberi tanda tangan pada daftar hadir tutor.
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'11.  '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            Untuk{' '}
            <Text style={styles.boldText}> menjaga keamanan bersama </Text>
            <Text style={styles.boldText}>
              wali murid diwajibkan menyiapkan papan tulis kecil
            </Text>{' '}
            agar ada jarak antara tutor dan siswa,{' '}
            <Text style={styles.boldText}>
              menyiapkan hand sanitizer , memakaikan masker/faceshield
            </Text>{' '}
            pada{' '}
            <Text style={styles.boldText}>anak saat les berlangsung .</Text>{' '}
            Wali murid juga <Text style={styles.boldText}> diwajibkan</Text>{' '}
            untuk{' '}
            <Text style={styles.boldText}>
              memastikan bahwa tutor menjalankan protokol kesehatan sesuai
              anjuran pemerintah .
            </Text>
          </Text>
        </View>
        <Divider />

        <View style={styles.paragraphContainer}>
          <Text style={styles.text}>{'12.  '}</Text>
          <Text style={[styles.text, styles.rightParagraphContainer]}>
            <Text style={styles.boldText}>
              Wali murid diwajibkan mencocokkan wajah guru yang datang dengan
              data yang diberikan bimbel untuk memastikan bahwa yang datang
              adalah orang yang benar. Minta guru untuk membuka masker sebentar
              lalu menutup masker lagi. Jika ada perbedaan, wali murid harap
              segera melapor pada bimbel
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: dimens.standard,
  },
  paragraphContainer: {
    flexDirection: 'row',
  },
  rightParagraphContainer: {
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  text: {
    lineHeight: 25,
  },
  image: {
    alignSelf: 'center',
    width: 300,
    height: 100,
  },
});
