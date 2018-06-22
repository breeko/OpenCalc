//@flow
import React, {Component} from 'react';
import {SafeAreaView, Text, ScrollView, StyleSheet, TouchableHighlight, Alert, Clipboard, Dimensions} from 'react-native';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants'

import { isNumeric } from '../utils/Utils';
import { OrientationType } from '../utils/Orientation';

type Props = {
  result: string,
  description: string,
  orientation: number,
};


class CalculatorResponse extends Component<Props> {
  resultsScroll: ScrollView;
  descriptionScroll: ScrollView;

  constructor() {
    super();
  }

  render() {
    const {result, description, orientation} = this.props;
    const copyDisabled = !description || !isNumeric(description.toString().replace(',',''));
    const h = Constants.height;
    const w = Constants.width;
    
    return (
      <SafeAreaView style={styles.resultsContainer} >
        <ScrollView 
          style={styles.resultContainer}
          ref={(scroll) => {this.resultsScroll = scroll;}}
          onContentSizeChange={() => {this.resultsScroll.scrollToEnd(false);}}
          horizontal>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.result}>{result}</Text>
        </ScrollView>
        <ScrollView 
          style={styles.resultContainer } 
          ref={(scroll) => {this.descriptionScroll = scroll;}}
          horizontal>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.result, styles.description]}>{description}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
    resultsContainer: {
        backgroundColor: Colors.BLUE_DARK,
        alignItems: 'flex-end',
        margin: 20,
        flexDirection: 'column',
        flex: 1,
    },

    resultContainer: {
      backgroundColor: Colors.BLUE_DARK,
      flex: 1,
    },

    result: {
      color: Colors.WHITE,
      fontSize: 50,
      textAlignVertical: 'center',
      margin: 5,
    },

    description: {
      fontSize: 60,
    },
  });

export default CalculatorResponse;
