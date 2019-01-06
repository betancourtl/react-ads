import React from 'react';
import { Ad } from '../../src';

const Article = (props) => {
  return (
    <div>
      <div style={{ height: '100vh' }} >
        <Ad
          lazy={true}

          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMap={[
            { viewPort: [850, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] },
          ]}
        />
      </div>
      <div>
        <div style={{ height: '200vh' }} />
        <Ad
          lazy={true}
          targeting={{ test: 'infinitescroll' }}
          size={[728, 90]}
          sizeMap={[
            { viewPort: [850, 200], slots: [728, 90] },
            { viewPort: [0, 0], slots: [] },
          ]}
        />
      </div>
    </div>
  );
};

export default Article;
