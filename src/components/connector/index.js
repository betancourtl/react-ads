import React from 'react';

/**
 * Will connect a component with at Provider component.
 * @param {Function} Context - Receive state from the parent component.
 * @param {Component} Component - Component to pass the provider values.
 * @returns {class}
 */
export const connect = (Context, Component, stateToProps) => {
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