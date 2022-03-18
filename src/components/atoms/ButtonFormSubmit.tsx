import React, {FC} from 'react';
import {dimens} from '@constants';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {Button} from 'react-native-paper';

type Props = {
  text: string;
  isLoading?: boolean;
  isDisable?: boolean;
  onPress: () => void;
};
export const ButtonFormSubmit: FC<Props> = ({
  text,
  isLoading,
  isDisable,
  onPress,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ios: 'padding', android: 'height'})}>
      <View
        style={{
          backgroundColor: 'white',
          height: 82,
          justifyContent: 'center',
          paddingHorizontal: dimens.standard,
          paddingBottom: dimens.small,
        }}>
        <Button
          mode="contained"
          loading={isLoading}
          labelStyle={{fontSize: dimens.medium_14}}
          style={{borderRadius: dimens.medium}}
          contentStyle={{height: 48}}
          onPress={onPress}
          disabled={isDisable}>
          {text}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
