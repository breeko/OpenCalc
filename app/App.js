//@flow
import React, {Component} from 'react';
import {StyleSheet, View, Clipboard} from 'react-native';

import CalculatorResponse from './components/CalculatorResponse';

import CalculatorBrain from './core/CalculatorBrain';

import Colors from './constants/Colors';
import Constants from './constants/Constants'

import LayoutBuilder from './utils/LayoutBuilder'
import {isNumeric} from './utils/Utils'
import { Orientation, OrientationType } from './utils/Orientation';

import Toast, {DURATION} from 'react-native-easy-toast';

type Props = {
  brain: CalculatorBrain,
};

type State = {
  display: string,
  description: string,
  altButtons: boolean,
  stored: string,
  orientation: number,
};

export default class App extends Component<Props, State> {
  static defaultProps = {
    brain: new CalculatorBrain()
  };

  state = {
    display: ' ',
    description: ' ',
    altButtons: false,
    stored: '',
    orientation: OrientationType.Portrait,
  };

  componentDidMount() {
    this._updateOrientation();
  }

  _updateOrientation() {
    const orientation = Orientation.getOrientation();
    this.setState({
      orientation: orientation});
  }

  _orientationDidChange() {
    this._updateOrientation();
  }

  _reset() {
    this.props.brain.clear();
    this.updateDisplay();
  }

  _handleCopyPress() {
    const result: string = this.props.brain.getResult().replace(' ','').replace(',','');
    const display: string = this.props.brain.getDisplay().replace(' ','').replace(',','');
    const saveString = isNumeric(result) ? result : isNumeric(display) ? display : null;
    if (saveString) {
      Clipboard.setString(saveString);      
      this.refs.toast.show('Copied ' + saveString + ' to clipboard', DURATION.LENGTH_SHORT, () => {});
    } else {
      this.refs.toast.show('Unable to copy to clipboard', DURATION.LENGTH_SHORT, () => {});
    }
  }

  async _handlePastePress() {
    const value = await Clipboard.getString();

    if (isNumeric(value)) {
      this.props.brain.clear();
      this.props.brain.setItem(value);
      this.updateDisplay();
    } else {
      this.refs.toast.show('Invalid clipboard value of ' + value);
    }
  }

  _handleButtonPress(button: string) {
    this.props.brain.setItem(button);
    this.updateDisplay();
    }

  _deleteLast() {
    this.props.brain.deleteLast();
    this.updateDisplay();
  }

  _switchButtons() {
    this.setState({altButtons: !this.state.altButtons});
  }

  updateDisplay() {
    const newDisplay = this.props.brain.getDisplay();
    const newDescription = this.props.brain.getResult();
    this.setState({
      display: newDisplay,
      description: newDescription
    });
  }

  render() {
    const buttonContainer = LayoutBuilder.buildButtonContainer(
      this,
      this.state.orientation,
      this.state.altButtons,
      this._handleButtonPress,
      this._reset,
      this._deleteLast,
      this._handleCopyPress,
      this._handlePastePress,
      this._switchButtons,
    );

    return (
      <View style={styles.container} onLayout={this._updateOrientation.bind(this)}>
        <Toast ref="toast" position='top' opacity={0.8}/>
        <CalculatorResponse
          result={this.state.display}
          description={this.state.description}
          orientation={this.state.orientation}/>
        {buttonContainer}
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
