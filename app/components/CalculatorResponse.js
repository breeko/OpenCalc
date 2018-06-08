import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableHighlight, Alert, Clipboard, Dimensions} from 'react-native';
import Colors from '../constants/Colors';
import Constants from '../constants/Constants'

import { isNumeric } from '../utils/Utils';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
  renderers
} from 'react-native-popup-menu';


class CalculatorResponse extends React.Component {
  constructor() {
    super();
    this.state = { 
      pasteDisabled: true 
    };
  }

  readFromClipboard = async () => {   
    const clipboardContent = await Clipboard.getString();
    this.setState({ 
      copiedValue: clipboardContent, 
      pasteDisabled: !isNumeric(clipboardContent) 
    }); 
  };

  render() {
    const {result, description, handleCopyPress, handlePastePress, width} = this.props;
    const copyDisabled = !isNumeric(description.replace(',',''));
    this.readFromClipboard();

    const {Popover} = renderers;

    return (
      <MenuProvider style={styles.resultsContainer} >
        <Menu renderer={Popover} style={styles.menu} rendererProps={{ preferredPlacement: 'bottom' }}>
          <MenuTrigger style={styles.trigger}>
            <View style={styles.resultContainer}>
              <Text numberOfLines={1} style={styles.result}>{result}</Text>
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption style={styles.option} onSelect={() => handlePastePress(this.state.copiedValue)} disabled={this.state.pasteDisabled} text='Paste'/>
          </MenuOptions>
        </Menu>
        <Menu renderer={Popover} style={styles.menu} rendererProps={{preferredPlacement: 'bottom'}}>
          <MenuTrigger style={styles.trigger}>
          <View style={styles.resultContainer}>
            <Text numberOfLines={1} style={styles.result}>{description}</Text>
          </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption style={styles.option} onSelect={() => handleCopyPress(description)} disabled={copyDisabled} text='Copy'/>
          </MenuOptions>
        </Menu>
      </MenuProvider>
    );
  }
}


const styles = StyleSheet.create({
    resultsContainer: {
        backgroundColor: Colors.BLUE_DARK,
        alignItems: 'flex-end',
        paddingRight: 10,
        flexDirection: 'column'
    },

    menu: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      flex: 1,
    },

    resultContainer: {
    },

    trigger: {
      width: Constants.maxDimension,
    },

    option: {
      margin: 5,
      padding: 5,
    },

    result: {
      color: Colors.WHITE,
      fontSize: 42,
      textAlign: 'right',
      textAlignVertical: 'center',
      margin: 5,
    },

});

export default CalculatorResponse;
