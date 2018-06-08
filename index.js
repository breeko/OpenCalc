import { AppRegistry } from 'react-native';
import App from './app/App';
import { YellowBox } from 'react-native';

AppRegistry.registerComponent('OpenCalc', () => App);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);