import React, {FC, ReactNode} from 'react';
import {Card, Paragraph} from 'react-native-paper';
import {dimens} from '@constants';
import {StyleSheet} from 'react-native';

type Props = {
  title: string;
  subtitle: string;
  onPress: () => void;
  left?: (props: object) => ReactNode;
  status?: string;
};

export const NestedCard: FC<Props> = ({
  title,
  subtitle,
  onPress,
  left,
  status,
}) => {
  return (
    <Card onPress={onPress} style={{marginTop: dimens.standard}}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        left={left}
        subtitleStyle={{marginBottom: 0}}
      />
      {status && <Paragraph style={styles.paragraph}>{status}</Paragraph>}
    </Card>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginLeft: dimens.standard,
    marginBottom: dimens.standard,
    marginTop: 0,
    color: '#10B981',
  },
});