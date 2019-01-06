import React from 'react';

class DevTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adUnits: [],
      isOpen: true,
    }
  }

  creatItem = (props = {}) => ({
    id: props.id,
    adUnitPath: props.adUnitPath,
    breakpoints: props.breakpoints,
    targeting: props.targeting,
    sizes: props.sizes,
  });

  getSlots = () => {
    const slots = window.googletag.pubads().getSlots();
    console.log(slots);
    const adUnits = slots.reduce((acc, slot) => {
      const item = this.creatItem({
        id: slot.getSlotElementId(),
        adUnitPath: slot.getAdUnitPath(),
        targeting: Object.entries(slot.getTargeting()),
        breakpoints: slot.La.j.map(({ m }) => m),
        sizes: slot.La.j.map(({ j }) => j),
      });
      acc.push(item);
      return acc;
    }, []);
    this.setState({ adUnits });
  }

  componentDidMount() {
    this.interval = setInterval(this.getSlots, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleTools = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {

    const styles = {
      devTools: {
        position: 'fixed',
        left: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        width: '200px',
        top: 0,
        bottom: 0,
        transform: this.state.isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .2s ease '
      },
      closingHandle: {
        position: 'absolute',
        width: '32px',
        height: '32px',
        position: 'absolute',
        width: '32px',
        height: '32px',
        left: '100%',
        top: 0,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        background: '#222',
        color: 'white',
      },
    }

    return (
      <div id="ad-tools" style={styles.devTools}>
        <span
          id="ad-tool-closing-handle"
          style={styles.closingHandle}
          onClick={this.toggleTools}
        >
          x
        </span>
        <div style={{
          overflowY: 'scroll',
          padding: '8px',
          width: '100%',
          height: '100%',
        }}>
          {this.state.adUnits.map(({ id, adUnitPath, targeting, breakpoints, sizes }) => {
            return (
              <React.Fragment key={id}>
                <ul
                  style={{
                    listStyleType: 'none',
                    margin: 0,
                    padding: 0,
                  }}
                  onClick={() => document.getElementById(id).scrollIntoView()}
                >
                  <li>id: {id}</li>
                  <li>adUnitPath: {adUnitPath}</li>
                  <li>targeting: {targeting}</li>
                  <li>breakpoints: {JSON.stringify(breakpoints)}</li>
                  <li>sizes: {JSON.stringify(sizes)}</li>
                </ul>
                <br />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}


export default DevTools;