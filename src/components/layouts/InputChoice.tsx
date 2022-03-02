import React, {FC, useState} from 'react';
import {color, dimens} from '@constants';
import {StyleSheet, View} from 'react-native';
import {List, Modal, Portal, Searchbar} from 'react-native-paper';
import {InputText} from '@components/atoms';
import {TextInputProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';
import {ScrollView} from 'react-native-gesture-handler';

interface InputProps extends Partial<TextInputProps> {}
type ComponentProps = InputProps & {
  onSelect: (item: any) => void;
  errorMessage?: string;
  listData: any[];
  keyMenuTitle: string;
  keyMenuDescription?: string;
  toNumber: boolean;
};
export const InputChoice: FC<ComponentProps> = props => {
  const {
    onSelect,
    errorMessage,
    listData,
    keyMenuTitle,
    keyMenuDescription,
    toNumber,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [value, setValue] = useState('');

  const searchedData = listData.filter(item => {
    // i artinya tidak case sensitive
    const matchKeyword = RegExp(keyword, 'i');

    // return data yang sesuai dengan pencarian
    return matchKeyword.test(item[keyMenuTitle]);
  });

  const onPressItem = (item: any) => {
    onSelect(item);
    setModalVisible(false);
  };

  return (
    <View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1, backgroundColor: color.bg_grey}}>
            <Searchbar
              inputStyle={{paddingVertical: dimens.standard}}
              placeholder="Cari data..."
              onChangeText={setKeyword}
              value={keyword}
            />
            <ScrollView
              contentContainerStyle={{padding: dimens.standard, flexGrow: 1}}>
              {searchedData.map((item, index) => {
                return (
                  <List.Item
                    style={styles.listItem}
                    key={index}
                    title={item[keyMenuTitle]}
                    description={
                      // console.log(toNumber)
                      !toNumber
                        ? keyMenuDescription && item[keyMenuDescription]
                        : keyMenuDescription &&
                          item[keyMenuDescription]
                            .toFixed(2)
                            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
                    }
                    onPress={() => {
                      onPressItem(item);
                      setValue(item[keyMenuTitle]);
                    }}
                  />
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </Portal>

      <InputText
        value={value}
        {...props}
        onPressButton={() => setModalVisible(true)}
        errorMessage={errorMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: 'white',
    marginBottom: dimens.standard,
    borderRadius: dimens.tiny,
    paddingVertical: dimens.small_10,
  },
});
