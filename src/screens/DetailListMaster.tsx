  import React, {FC} from 'react';
import {Header, OneLineInfo, FABList, Gap} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Card, DataTable, IconButton, Text} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailListMaster'>;

export const DetailListMaster: FC<ScreenProps> = ({route, navigation}) => {
  const {detailType}: any = route.params;

  const data: any = {
    jenjangkelas: [
      {
        item: 'TK A',
      },
      {
        item: 'TK B',
      },
      {
        item: 'SMP Kelas 7',
      },
      {
        item: 'SMP Kelas 8',
      },
      {
        item: 'SMP Kelas 9',
      },
    ],
    mapel: [
      {
        item: 'IPS',
      },
      {
        item: 'IPA',
      },
      {
        item: 'Mengaji',
      },
      {
        item: 'Gambar Teknik',
      },
      {
        item: 'Bahasa Inggris',
      },
    ],
    paket: [
      {
        item: 'Paket 1',
        jumlahPertemuan: '4',
      },
      {
        item: 'Paket 2',
        jumlahPertemuan: '8',
      },
      {
        item: 'Paket 3',
        jumlahPertemuan: '9',
      },
    ],
    wilayah: [
      {
        item: 'Wilayah 1',
        biaya: '230000',
        wilayah: ['jawa timur', 'jawa tengah', 'jawa barat'],
      },
      {
        item: 'Wilayah 2',
        biaya: '250000',
        wilayah: ['jakarta', 'banten', 'serang'],
      },
      {
        item: 'Wilayah 3',
        biaya: '200000',
        wilayah: ['bali', 'madura', 'lombok', 'surakarta'],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title={`Detail Master ${detailType}`} />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.viewContainer}>
          {detailType == 'Wilayah' && (
            <OneLineInfo info="Geser tabel ke kanan untuk melihat data lebih lengkap" />
          )}
          <Card style={{marginTop: dimens.standard}}>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.tableCell}>
                    Item
                  </DataTable.Title>
                  {detailType == 'Paket' && (
                    <DataTable.Title style={styles.tableCell}>
                      Jumlah Pertemuan
                    </DataTable.Title>
                  )}
                  {detailType == 'Wilayah' && (
                    <>
                      <DataTable.Title style={styles.tableCell}>
                        Biaya Pendaftaran
                      </DataTable.Title>
                      <DataTable.Title style={styles.wideTableCell}>
                        Cakupan Wilayah
                      </DataTable.Title>
                    </>
                  )}
                  <DataTable.Title style={styles.wideTableCell}>
                    Aksi
                  </DataTable.Title>
                </DataTable.Header>
                {data[detailType.replace(/\s+/g, '').toLowerCase()].map(
                  (item: {item: any}, index: number) => {
                    return (
                      <ItemRow
                        key={index}
                        item={item}
                        itemType={detailType}
                        onPress={() =>
                          navigation.navigate<any>('EditListMaster', {
                            detailType: detailType,
                            data: item,
                          })
                        }
                      />
                    );
                  },
                )}
              </DataTable>
            </ScrollView>
          </Card>
        </View>
        <Gap y={72} />
      </ScrollView>

      {/* Add button */}
      <FABList
        label="Tambah Data"
        onPress={() =>
          navigation.navigate<any>('EditListMaster', {
            detailType: detailType,
          })
        }
      />
    </SafeAreaView>
  );
};

const ItemRow: FC<{item: any; itemType: string; onPress: () => void}> = ({
  item,
  itemType,
  onPress,
}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={styles.tableCell}>{item.item}</DataTable.Cell>
      {itemType == 'Paket' && (
        <DataTable.Cell style={styles.tableCell}>
          {item.jumlahPertemuan}
        </DataTable.Cell>
      )}
      {itemType == 'Wilayah' && (
        <>
          <DataTable.Cell style={styles.tableCell}>{item.biaya}</DataTable.Cell>
          <DataTable.Cell style={styles.wideTableCell}>
            {item.wilayah.map((item: {item: any}, index: number) => {
              return <Text key={index}>{`${item}, `}</Text>;
            })}
          </DataTable.Cell>
        </>
      )}
      <DataTable.Cell style={styles.wideTableCell}>
        <IconButton icon="pencil" size={30} onPress={onPress} />
        <IconButton icon="delete" size={30} onPress={() => {}} />
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  viewContainer: {
    flex: 1,
    padding: dimens.standard,
    paddingTop: dimens.small,
  },
  tableCell: {
    minWidth: 100,
    marginRight: 10,
  },
  wideTableCell: {
    minWidth: 300,
    marginRight: 10,
  },
});
