import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';

class CalculatorButton extends React.Component {
  render() {
    const {operator, handleButtonPress} = this.props;

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => handleButtonPress(operator)}>
        <Text style={styles.item}>
          {operator}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLUE_LIGHT,
    borderColor: Colors.BLUE_LIGHT,

    margin: 1
  },
item: {
  color: Colors.WHITE,
  fontSize: 26
  }
});

export default CalculatorButton;
