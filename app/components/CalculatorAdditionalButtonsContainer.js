//@flow
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CalculatorButton from './CalculatorButton';

type Props = {
  handleButtonPress: (string) => any,
  reset: () => any,
  deleteLast: () => any,
  copy: () => any,
  paste: () => any,
  switchButton: () => any,
};

class CalculatorAdditionalButtonsContainer extends Component<Props> {
  render() {
    const {handleButtonPress, reset, deleteLast, copy, paste, switchButton} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.row}>

          <View style={styles.switchButtonGroup}>
            <CalculatorButton operator={'>'} handleButtonPress={switchButton}/>
          </View>

          <View style={styles.buttonGroup}>
            <View style={styles.row}>
              <CalculatorButton operator={'c'} handleButtonPress={reset}/>
              <CalculatorButton operator={'('} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={')'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'←'} handleButtonPress={deleteLast}/>
            </View>
            <View style={styles.row}>
                <CalculatorButton operator={'sin'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'cos'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'tan'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'π'} handleButtonPress={handleButtonPress}/>
            </View>

            <View style={styles.row}>
                <CalculatorButton operator={'sinh'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'cosh'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'tanh'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'e'} handleButtonPress={handleButtonPress}/>
            </View>

            <View style={styles.row}>
                <CalculatorButton operator={'log'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'log10'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'xⁿ'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'%'} handleButtonPress={handleButtonPress}/>
            </View>

            <View style={styles.row}>
                <CalculatorButton operator={'!'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'√'} handleButtonPress={handleButtonPress}/>
                <CalculatorButton operator={'copy'} handleButtonPress={copy}/>
                <CalculatorButton operator={'paste'} handleButtonPress={paste}/>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
  },

  buttonGroup: {
    flex: 10,
  },

  switchButtonGroup: {
    flex: 1,
  },
  
});

export default CalculatorAdditionalButtonsContainer;
