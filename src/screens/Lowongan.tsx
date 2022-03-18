import React, {FC, useState, useEffect} from 'react';
import {Header, NestedCard, OneLineInfo, SkeletonLoading} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import {Headline, Subheading, Card, Button, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import {AppStackParamList, MainTabParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {apiGet} from '@utils';
import {Picker} from '@react-native-picker/picker';
import {useIsFocused} from '@react-navigation/core';
type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<MainTabParamList, 'Lowongan'>,
  StackScreenProps<AppStackParamList>
>;
type FormDataType = {
  jenjang: string;
  prefrensi: string;
};
export const Lowongan: FC<ScreenProps> = ({navigation}) => {
  const [lowonganList, setLowonganList] = useState<any>([]);
  const [filterJenjang, setFilterJenjang] = useState();
  const [filterPrefrensi, setFilterPrenfrensi] = useState();
  const [page, setPage] = useState(1);
  const [modalFilter, setModalFilter] = useState(false);
  const [listJenjang, setListJenjang] = useState([]);
  const [jenjang, setJenjang] = useState();
  const [prefrensi, setPrefrensi] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({id: 0, nama: ''});
  const isFocus = useIsFocused();

  useEffect(() => {
    let isActive = true;
    const getInitialData = async () => {
      const tutor = await apiGet({url: '/guru/profile'});
      if (tutor.data.idkecamatan != null) {
        const lowonganKabupaten = await apiGet({
          url: '/lowongan/' + tutor.data.idkecamatan,
          params: {
            page: page,
            cari: '',
            orderBy: 'idlowongan',
            sort: 'ASC',
            jenjang: filterJenjang,
            prefrensi: filterPrefrensi,
          },
        });
        const dataJenjang = await apiGet({url: '/paket/jenjang'});

        if (isActive) {
          setListJenjang(dataJenjang.data);
          setLowonganList(lowonganKabupaten.data);
          setIsLoading(false);
          setIsRefreshing(false);
        }
      } else if (tutor.data.idkecamatan == null) {
        if (isActive) {
          setLowonganList(null);
        }
      }
    };
    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }
    return () => {
      isActive = false;
      // cancelApiRequest();
    };
  }, [lowonganList, listJenjang, filterJenjang, filterPrefrensi, page, isFocus, isLoading, isRefreshing]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        title="Lowongan"
        withFilter={true}
        onPressFilter={() => setModalFilter(true)}
      />
       {isLoading || isRefreshing ? (
            <SkeletonLoading />
          ) : (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        <Modal
          isVisible={modalFilter}
          onBackdropPress={() => setModalFilter(false)}>
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
              Filter Lowongan
            </Text>
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: 'row',
                maxHeight: 40,
              }}>
              {/* {' '} */}
              <Text
                style={{
                  fontSize: 15,
                  flex: 1,
                  paddingTop: 20,
                }}>
                Jenjang:
              </Text>
              {/* TODO: BUAT DROPDOWN UNTUK JENJANG */}
              <Picker
                style={{flex: 2}}
                mode="dropdown"
                selectedValue={jenjang}
                itemStyle={{height: 10, backgroundColor: 'white'}}
                onValueChange={itemValue => setJenjang(itemValue)}>
                {listJenjang.map((item: any, index: number) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={item.jenjang}
                      value={item.jenjang}
                    />
                  );
                })}
              </Picker>
            </View>

            {/* TODO: BUAT DROPDOWN UNTUK PREFRENSI */}
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: 'row',
                maxHeight: 40,
              }}>
              {/* {' '} */}
              <Text
                style={{
                  fontSize: 15,
                  flex: 1,
                  paddingTop: 20,
                }}>
                Prefrensi:
              </Text>
              <Picker
                style={{flex: 2}}
                mode="dropdown"
                // mode="dialog"
                selectedValue={prefrensi}
                itemStyle={{height: 10, backgroundColor: 'white'}}
                onValueChange={itemValue => setPrefrensi(itemValue)}>
                <Picker.Item label="Wanita" value="Wanita" />
                <Picker.Item label="Pria" value="Pria" />
                <Picker.Item label="Bebas" value="Bebas" />
              </Picker>
            </View>
            <Button
              style={{maxWidth: 100, alignSelf: 'flex-end', marginRight: 20}}
              onPress={() => {
                setFilterJenjang(jenjang);
                setFilterPrenfrensi(prefrensi);
                setModalFilter(false);
              }}>
              ok
            </Button>
          </Card>
        </Modal>

        {lowonganList != null ? (
          lowonganList.map((item: any, index: number) => {
            return (
              <NestedCard
                key={index}
                title={'' + item.paket + ' ' + item.jenjang}
                subtitle={`${item.jumlah_pertemuan} pertemuan `}
                additionalText={
                  'Rp.' +
                  item.gaji.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }
                onPress={() => {
                  navigation.navigate<any>('DetailLowongan', {item});
                }}
              />
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: dimens.massive,
            }}>
            <MaterialCommunityIcons
              name="database-remove"
              size={130}
              style={{color: 'grey'}}
            />

            <Headline style={{textAlign: 'center', marginTop: dimens.large}}>
              Belum ada data.
            </Headline>
            <Subheading
              style={{textAlign: 'center', paddingHorizontal: dimens.large}}>
              Harap isi data diri
            </Subheading>
          </View>
        )}
        {lowonganList.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: dimens.massive,
            }}>
            <MaterialCommunityIcons
              name="database-remove"
              size={130}
              style={{color: 'grey'}}
            />

            <Headline style={{textAlign: 'center', marginTop: dimens.large}}>
              Belum ada data.
            </Headline>
          </View>
        )}
      </ScrollView>)}
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
});
