import React from 'react';
import { Ad } from '../../src';

const Article = (props) => {
  return (
    <div>
      <div>
        <Ad
          id={`${props.id}-div-1`}
          lazy={true}
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
      <div style={{ height: '200vh' }} >
        <Ad
          id={`${props.id}-div-2`}
          lazy={true}

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
          lazy={true}
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMapping={[
            { viewPort: [850, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] },
          ]}
        />
      </div>
    </div>
  );
};

export default Article;
