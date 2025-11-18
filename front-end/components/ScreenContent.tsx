import React from 'react';
import { View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <View className={styles.container}>
      <View className="flex-1 items-center justify-center">
        <Button variant="destructive"  onPress={()=>console.log('press')}>
          <Text>
            Button
          </Text>
        </Button>
      </View>
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
