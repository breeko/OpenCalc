//@flow
import React, {Component} from 'react';
import {SafeAreaView, Text, ScrollView, StyleSheet, TouchableHighlight, Alert, Clipboard, Dimensions} from 'react-native';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants'

import { isNumeric } from '../utils/Utils';
import { OrientationType } from '../utils/Orientation';

type Props = {
  topDisplay: string,
  bottomDisplay: string,
  orientation: number,
};


class CalculatorResponse extends Component<Props> {
  topDisplayScroll: ScrollView;
  bottomDisplayScroll: ScrollView;

  constructor() {
    super();
  }

  render() {
    const {bottomDisplay, topDisplay, orientation} = this.props;
    const h = Constants.height;
    const w = Constants.width;
    
    return (
      <SafeAreaView style={styles.resultsContainer} >
        <ScrollView 
          style={styles.resultContainer}
          ref={(scroll) => {this.topDisplayScroll = scroll;}}
          onContentSizeChange={() => {this.topDisplayScroll.scrollToEnd(false);}}
          horizontal>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.topDisplay}>{topDisplay}</Text>
        </ScrollView>
        <ScrollView 
          style={styles.resultContainer } 
          ref={(scroll) => {this.bottomDisplayScroll = scroll;}}
          horizontal>
          <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.topDisplay, styles.bottomDisplay]}>{bottomDisplay}</Text>
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

    topDisplay: {
      color: Colors.WHITE,
      fontSize: 40 * (Constants.maxDimension / Constants.baseMaxDimension),
      textAlignVertical: 'center',
      margin: 5,
    },

    bottomDisplay: {
      fontSize: 45 * (Constants.maxDimension / Constants.baseMaxDimension),
    },
  });

export default CalculatorResponse;
