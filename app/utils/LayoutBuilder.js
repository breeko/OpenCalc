import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';

import CalculatorButtonsContainer from '../components/CalculatorButtonsContainer';
import CalculatorAdditionalButtonsContainer from '../components/CalculatorAdditionalButtonsContainer';
import CalculatorLandscapeButtonsContainer from '../components/CalculatorLandscapeButtonsContainer';

import Colors from '../constants/Colors';
import Constants from '../constants/Constants'

import { OrientationType } from '../utils/Orientation';

export default class LayoutBuilder {
    
    static buildSwitchButtons(obj) {
        if (obj.state.orientation === OrientationType.Portrait) {
            const styles = {
                handle: {
                    position: 'absolute',
                    backgroundColor: Colors.BLUE_DARK,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: 10,
                    height: 100,
                    top: Constants.maxDimension / 2.0, 
                }
            }
            const handle = <TouchableOpacity style={styles.handle} onPress={obj._switchButtons.bind(obj)}><View/></TouchableOpacity>;
            return handle;
        } else {
            return <View/>;
        }
    }
    
    static buildButtonContainer(obj) {

            
        const calculatorButtonsContainer = <CalculatorButtonsContainer
                handleButtonPress={obj._handleButtonPress.bind(obj)}
                reset={obj._reset.bind(obj)}
                deleteLast={obj._deleteLast.bind(obj)}
                store={obj._store.bind(obj)}
                recall={obj._recall.bind(obj)}/>;
            
        const calculatorAdditionalButtonsContainer = <CalculatorAdditionalButtonsContainer
            handleButtonPress={obj._handleButtonPress.bind(obj)}
            reset={obj._reset.bind(obj)}
            deleteLast={obj._deleteLast.bind(obj)}
            store={obj._store.bind(obj)}
            recall={obj._recall.bind(obj)}/>;

        const calculatorLandscapeButtonsContainer = <CalculatorLandscapeButtonsContainer
            handleButtonPress={obj._handleButtonPress.bind(obj)}
            reset={obj._reset.bind(obj)}
            deleteLast={obj._deleteLast.bind(obj)}
            store={obj._store.bind(obj)}
            recall={obj._recall.bind(obj)}/>;

        if (obj.state.orientation === OrientationType.Portrait) {
            return (obj.state.altButtons) ? calculatorAdditionalButtonsContainer : calculatorButtonsContainer;
        } else if (obj.state.orientation === OrientationType.Landscape) {
            return calculatorLandscapeButtonsContainer;
        }
    }    
}