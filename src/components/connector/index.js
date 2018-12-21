import React from 'react';

export const connect = (Context, Component) => {
  return class Connector extends React.Component {
    render() {
      return (
          <Context.Consumer>
            {ctxProps => {
              return(
                <Component 
                  {...this.props}
                  provider={ctxProps}
                />
              );
            }}
        </Context.Consumer>
      );
    }
  }
}

export default connect;