//@flow
import React, {Component} from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';

import CalculatorButtonsContainer from '../components/CalculatorButtonsContainer';
import CalculatorAdditionalButtonsContainer from '../components/CalculatorAdditionalButtonsContainer';
import CalculatorLandscapeButtonsContainer from '../components/CalculatorLandscapeButtonsContainer';

import Colors from '../constants/Colors';
import Constants from '../constants/Constants'

import { OrientationType } from '../utils/Orientation';

export default class LayoutBuilder {
       
    static buildButtonContainer(
        obj: Component<any, any>,
        orientation: number,
        altButtons: boolean,
        _handleButtonPress: (button: string) => any,
        _reset: () => any,
        _deleteLast: () => any,
        _handleCopyPress: () => any,
        _handlePastePress: () => any,
        _handleSwitchButton: () => any,
    ) {
            
        const calculatorButtonsContainer = <CalculatorButtonsContainer
                handleButtonPress={_handleButtonPress.bind(obj)}
                reset={_reset.bind(obj)}
                deleteLast={_deleteLast.bind(obj)}
                switchButton={_handleSwitchButton.bind(obj)}
                />;
            
        const calculatorAdditionalButtonsContainer = <CalculatorAdditionalButtonsContainer
            handleButtonPress={_handleButtonPress.bind(obj)}
            reset={_reset.bind(obj)}
            deleteLast={_deleteLast.bind(obj)}
            copy={_handleCopyPress.bind(obj)}
            paste={_handlePastePress.bind(obj)}
            switchButton={_handleSwitchButton.bind(obj)}
            />;

        const calculatorLandscapeButtonsContainer = <CalculatorLandscapeButtonsContainer
            handleButtonPress={_handleButtonPress.bind(obj)}
            reset={_reset.bind(obj)}
            deleteLast={_deleteLast.bind(obj)}
            copy={_handleCopyPress.bind(obj)}
            paste={_handlePastePress.bind(obj)}/>;

        if (orientation === OrientationType.Portrait) {
            return (altButtons) ? calculatorAdditionalButtonsContainer : calculatorButtonsContainer;
        } else if (orientation === OrientationType.Landscape) {
            return calculatorLandscapeButtonsContainer;
        }
    }    
}