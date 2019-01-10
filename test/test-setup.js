import '@babel/polyfill';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, render } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

global.mount = mount;
global.React = React;
global.render = render;
global.shallow = shallow;
