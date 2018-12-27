import React from 'react';

export const connect = (Context, Component, key = 'provider') => {
  return class Connector extends React.Component {
    render() {
      return (
        <Context.Consumer>
          {ctxProps => {
            return (
              <Component
                {...this.props}
                {...{[key]: ctxProps}}
              />
            );
          }}
        </Context.Consumer>
      );
    }
  };
};

export default connect;