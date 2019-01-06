import React from 'react';

/**
 * Will connect a component with at Provider component.
 * @param {React.Context} Context - Receive state from the parent component.
 * @param {Function} StateToProps - Component to pass the provider values.
 * @param {React.Component} Component
 * @returns {class}
 */
export const connect = (Context, stateToProps) => Component => {
  return class Connector extends React.Component {
    render() {
      return (
        <Context.Consumer>
          {ctxProps => {
            return (
              <Component
                {...this.props}
                {...stateToProps(ctxProps, this.props)}
              />
            );
          }}
        </Context.Consumer>
      );
    }
  };
};

export default connect;