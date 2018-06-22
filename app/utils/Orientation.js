//@flow
import {Dimensions} from 'react-native';

export const OrientationType = Object.freeze({
    'Portrait': 1,
    'Landscape': 2,
});

export class Orientation {
    static getOrientation() {
        // BUG: height to width relationship does not hold when in split screen on Android
        const {height, width} = Dimensions.get('window');
        return (height > width) ? OrientationType.Portrait : OrientationType.Landscape;
    }
}