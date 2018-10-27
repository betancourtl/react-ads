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
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [1050, 200], slots: [1024, 120] },
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [320, 50] },
            { viewPort: [100, 100], slots: [300, 50] }
          ]}
        />
      </div>
      <div>
        <div style={{height: '300vh'}}/>
        <Ad
          id={`${props.id}-div-2`}
          adUnitPath="/6355419/travel"
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [1050, 200], slots: [1024, 120] },
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [320, 50] },
            { viewPort: [100, 100], slots: [300, 50] }
          ]}
        />
      </div>
      <div>
        <div style={{height: '900vh'}}/>
        <Ad
          id={`${props.id}-div-3`}
          adUnitPath="/6355419/travel"
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [1050, 200], slots: [1024, 120] },
            { viewPort: [750, 200], slots: [728, 90] },
            { viewPort: [320, 700], slots: [320, 50] },
            { viewPort: [100, 100], slots: [300, 50] }
          ]}
        />
      </div>
    </div>
  );
};

export default Article;