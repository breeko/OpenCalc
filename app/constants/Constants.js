//@flow
import {Dimensions} from 'react-native';

const Constants = Object.freeze({
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    maxDimension: Math.max(Dimensions.get('window').height, Dimensions.get('window').width),
    minDimension: Math.min(Dimensions.get('window').height, Dimensions.get('window').width),
    baseMaxDimension: 667.0,
});

export default Constants;