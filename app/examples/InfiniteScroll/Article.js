import React from 'react';
import { Ad } from '../../../src';

const Article = (props) => {
  return (
    <div style={{ borderBottom: '1px solid black' }}>
      <div>
        <Ad
          id={`${props.id}-div-1`}
          adUnitPath="/6355419/travel"
          targeting={{ test: 'infinitescroll' }}
          // onSlotRenderEnded={(ad) => {
          //   console.log('onSlotRenderEnded', ad);
          //   ad.ref.firstChild.firstChild.style.border = '1px solid red';
          // }}
          // onSlotOnLoad={(ad) => {
          //   console.log('onSlotOnLoad');
          //   ad.ref.firstChild.firstChild.style.border = null;
          // }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [850, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] },
          ]}
        />
      </div>
      <div>
        <div style={{ height: '100vh' }} />
        <Ad
          id={`${props.id}-div-2`}
          adUnitPath="/6355419/travel"
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [850, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] },
          ]}
        />
      </div>
      <div>
        <div style={{ height: '200vh' }} />
        <Ad
          id={`${props.id}-div-3`}
          adUnitPath="/6355419/travel"
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [320, 50] },
            { viewPort: [1050, 200], slots: [1024, 120] },
            { viewPort: [100, 100], slots: [300, 50] }
          ]}
        />
      </div>
    </div>
  );
};

export default Article;
