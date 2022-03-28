import React, {FC, useState, useEffect, useRef} from 'react';
import {Header, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {Card, Button, Paragraph, Checkbox} from 'react-native-paper';
import {CompositeScreenProps} from '@react-navigation/native';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';
// import {apiGet} from '@utils';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/core';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Latihan'>,
  StackScreenProps<AppStackParamList>
>;

export const Soal: FC<ScreenProps> = ({navigation}) => {
  //   const [page, setPage] = useState(1);
  const soal = [
    {
      soalessay:
        'Berilah kiranya yang terbaik bagiku... Tanah berlumpur dan kerbau pilihan.... Penggalan puisi tersebut jika diparafrasakan menjadi ...',
      kodeSoal: '00001a-2021',
      pilihan: [
        {data: 'Petani ingin memiliki kerbau yang baik.'},
        {data: 'Seorang petani menyanyi sambil membajak sawah.'},
        {
          data: 'Petani memohon kepada Tuhan agar dikaruniai tanah yang subur dan kerbau yang kuat untuk membajak sawah.',
        },
        {data: 'Petani berharap mempunyai tanah berlumpur dan kerbau pilihan.'},
      ],
    },
    {
      soalessay:
        'Semut merah itu berusaha naik ke atas daun melawan gelombang yang besar. Berkat ketabahannya, ia dapat mencapai permukaan daun itu dan berpegangan kuat-kuat di sana. Cerita di atas mengungkapkan pesan …',
      kodeSoal: '00002a-2021',
      pilihan: [
        {data: 'Mengerjakan sesuatu sebaiknya disertai dengan semangat.'},
        {data: 'Disertai dengan ketabahan, keberhasilan dapat dicapai.'},
        {
          data: 'Mengusahakan sesuatu sebaiknya disertai dengan doa.',
        },
        {data: 'Dengan usaha sungguh-sungguh, keberhasilan dapat dicapai.'},
      ],
    },
  ];
  const [soalNomer, setSoalNomer] = useState(0);
  const [modalNomor, setModalNomor] = useState(false);
  // loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocus = useIsFocused();
  const componentMounted = useRef(true); // (3) component is mounted
  // paging
  //   const [buttonLoadMore, setButtonLoadMore] = useState(true);
  //   const [displayButton, setDiplayButton] = useState(false);
  //   const [loadingData, setLoadingData] = useState(false);
  //   const [isLoadMoreData, setLoadMoreData] = useState(false);
  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      if (isActive) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      componentMounted.current = false;
      isActive = false;
    };
  }, [isRefreshing, isLoading, isFocus]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />
      <Header title="Latihan Soal" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* < contentContainerStyle={styles.scrollContainer}>  */}
        {isLoading || isRefreshing ? (
          <SkeletonLoading />
        ) : (
          <Card>
            <Card.Title title={'Soal Nomer ' + (soalNomer + 1)} />
            <Card.Content>
              <Paragraph>{soal[soalNomer].soalessay}</Paragraph>
              <Checkbox.Item
                label={soal[soalNomer].pilihan[0].data}
                position="leading"
                status="checked"
                labelStyle={{
                  textAlign: 'left',
                }}
              />
              <Checkbox.Item
                label={soal[soalNomer].pilihan[1].data}
                position="leading"
                status="unchecked"
                labelStyle={{
                  textAlign: 'left',
                }}
              />
              <Checkbox.Item
                label={soal[soalNomer].pilihan[2].data}
                position="leading"
                status="unchecked"
                labelStyle={{
                  textAlign: 'left',
                }}
              />
              <Checkbox.Item
                label={soal[soalNomer].pilihan[3].data}
                position="leading"
                status="unchecked"
                labelStyle={{
                  textAlign: 'left',
                }}
              />
            </Card.Content>
            <Card.Actions style={{justifyContent: 'space-between'}}>
              <Button
                mode="outlined"
                onPress={() => {
                  if (soalNomer != 0) return setSoalNomer(soalNomer - 1);
                }}>
                Back
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setModalNomor(true);
                }}>
                Lihat Soal
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  if (soalNomer + 1 != soal.length)
                    return setSoalNomer(soalNomer + 1);
                }}>
                {soalNomer + 1 == soal.length ? 'Simpan' : 'Next'}
              </Button>
            </Card.Actions>
          </Card>
        )}
        <Modal
          isVisible={modalNomor}
          onBackdropPress={() => {
            setModalNomor(false);
          }}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}>
          {/* <View></View> */}
          <Card style={{margin: 10}}>
            <Card.Content>
              <Paragraph>Pilih Nomor Soal :</Paragraph>
            </Card.Content>

            <Card.Actions>
              <Button
                mode="outlined"
                style={{margin: 5}}
                onPress={() => {
                  setSoalNomer(0);
                }}>
                1
              </Button>
              <Button
                mode="outlined"
                style={{margin: 5}}
                onPress={() => {
                  setSoalNomer(1);
                }}>
                2
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
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
    paddingTop: dimens.small,
  },
  chipStatus: {
    marginTop: dimens.small,
    marginRight: dimens.small,
  },
});
