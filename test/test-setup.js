import React from 'react';
import Enzyme from 'enzyme';
import { spy } from 'sinon';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, render } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

global.spy = spy;
global.mount = mount;
global.React = React;
global.render = render;
global.expect = expect;
global.shallow = shallow;