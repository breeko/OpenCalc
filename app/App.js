import React, {Component} from 'react';
import {StyleSheet, View, Clipboard} from 'react-native';

import CalculatorResponse from './components/CalculatorResponse';
import CalculatorButtonsContainer from './components/CalculatorButtonsContainer';
import CalculatorAdditionalButtonsContainer from './components/CalculatorAdditionalButtonsContainer';

import CalculatorBrain from './core/CalculatorBrain';

import Colors from './constants/Colors';
import Constants from './constants/Constants'

import LayoutBuilder from './utils/LayoutBuilder'
import {isNumeric} from './utils/Utils'
import { Orientation } from './utils/Orientation';

import SideMenu from 'react-native-side-menu';

export default class App extends Component {
  constructor() {
    super();

    this.brain = new CalculatorBrain();

    this.state = {
      display: ' ',
      description: ' ',
      altButtons: false,
      stored: 0.0
    };
  }
  
  _handleCopyPress(value) {
    const cleanValue = value.toString().replace(',','');
    Clipboard.setString(cleanValue.toString());
  }
  
  _handlePastePress(value) {
    this.brain.clear();
    this.brain.setItem(value);
    this.updateDisplay();
  }

  componentDidMount() {
    this._updateOrientation();
  }

  _updateOrientation(layout) {
    const orientation = Orientation.getOrientation();
    this.setState({orientation: orientation, width: Constants.width, height: Constants.height});
  }

  _orientationDidChange(orientation) {
    this._updateOrientation();
  }

  _reset(button) {
    this.brain.clear();
    this.updateDisplay();
  }

  _store(button) {
    const result = this.brain.getResult().replace(' ','').replace(',','');
    const display = this.brain.getDisplay().replace(' ','').replace(',','');
    if (isNumeric(result)) {
      this.setState({stored: result});
    } else if (isNumeric(display)) {
      this.setState({stored: display})
    }
  }

  _recall(button) {
    this.brain.clear();
    this.brain.setItem(this.state.stored);
    this.updateDisplay();
  }

  _handleButtonPress(button) {
    this.brain.setItem(button);
    this.updateDisplay();
    }

  _deleteLast(button) {
    this.brain.deleteLast();
    this.updateDisplay();
  }

  _switchButtons() {
    this.setState({altButtons: !this.state.altButtons});
  }

  updateDisplay() {
    const newDisplay = this.brain.getDisplay();
    const newDescription = this.brain.getResult();

    this.setState({
      display: newDisplay,
      description: newDescription
    });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  render() {
    const buttonContainer = LayoutBuilder.buildButtonContainer(this);
    const switchButtons = LayoutBuilder.buildSwitchButtons(this);

    return (
      <View style={styles.container} onLayout={this._updateOrientation.bind(this)}>
        <CalculatorResponse
            result={this.state.display}
            description={this.state.description}
            handleCopyPress={this._handleCopyPress.bind(this)}
            handlePastePress={this._handlePastePress.bind(this)}
            onOrientationChanged={this._updateOrientation.bind(this)}
            width={this.state.width}
          />
          {buttonContainer}
          {switchButtons}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLUE_DARK
  },
  sideMenu: {
    backgroundColor: Colors.BLUE_DARK
  }
});
