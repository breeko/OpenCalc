import {Dimensions} from 'react-native';

export const OrientationType = Object.freeze({
    'Portrait': 1,
    'Landscape': 2,
});

export class Orientation {
    static getOrientation() {
        const {height, width} = Dimensions.get('window');
        return (height > width) ? OrientationType.Portrait : OrientationType.Landscape;
    }
}