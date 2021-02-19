import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello from Home</Text>
        <Button 
            title="Take Photo"
            onPress={
                () => this.props.navigation.navigate( 'Profile' )
            }
        />
        <Button 
            title="Choose Photo Library"
            onPress={
                () => this.props.navigation.navigate( 'Feed' )
            }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
