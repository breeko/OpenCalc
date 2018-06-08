import React from 'react';
import {View, StyleSheet} from 'react-native';
import CalculatorButton from './CalculatorButton';

class CalculatorAdditionalButtonsContainer extends React.Component {
  render() {
    const {handleButtonPress, reset, deleteLast, store, recall} = this.props;

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
          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'sinh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'cosh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'tanh'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'e'} handleButtonPress={handleButtonPress}/>
          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'ln'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'log10'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'^'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'%'} handleButtonPress={handleButtonPress}/>
          </View>

          <View style={styles.row}>
              <CalculatorButton operator={'!'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'√'} handleButtonPress={handleButtonPress}/>
              <CalculatorButton operator={'store'} handleButtonPress={store}/>
              <CalculatorButton operator={'recall'} handleButtonPress={recall}/>
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
    flexDirection: 'row'
  }
});

export default CalculatorAdditionalButtonsContainer;
