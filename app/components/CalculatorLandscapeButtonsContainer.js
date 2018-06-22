//@flow
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CalculatorButton from './CalculatorButton';

type Props = {
  handleButtonPress: (string) => void,
  reset: () => void,
  deleteLast: () => void,
  copy: () => void,
  paste: () => void,
};

export default class CalculatorLandscapeButtonsContainer extends Component<Props> {
  render() {
    const {handleButtonPress, reset, deleteLast, copy, paste} = this.props;

    return (
      <View style={styles.container}>
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
              <CalculatorButton operator={'7'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'8'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'9'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'÷'} handleButtonPress={handleButtonPress}/>
          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'sinh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'cosh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'tanh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'e'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'4'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'5'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'6'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'×'} handleButtonPress={handleButtonPress}/>

          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'log'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'log10'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'xⁿ'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'%'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'1'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'2'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'3'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'−'} handleButtonPress={handleButtonPress}/>
          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'!'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'√'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'copy'} handleButtonPress={copy}/>
              <CalculatorButton operator={'paste'} handleButtonPress={paste}/>              
              <CalculatorButton operator={'.'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'0'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'='} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'+'} handleButtonPress={handleButtonPress}/>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },

  row: {
    flex: 1,
    flexDirection: 'row'
  }
});
