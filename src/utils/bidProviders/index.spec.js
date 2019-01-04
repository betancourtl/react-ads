import getBids from './';

describe('getBids', () => {
  test('Should fulfill both bid requests', (done) => {
    const timeout = 1000;
    const p1 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p1');
      }, ms);
    });

    const p2 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p2');
      }, ms);
    });

    getBids([p1(200), p2(100)], timeout)
      .then(results => {
        expect(results).toEqual([
          { data: 'p1', status: 'fulfilled' },
          { data: 'p2', status: 'fulfilled' }
        ]);
        done();
      });
  });

  test('Should fulfill 1 bid request.', (done) => {
    const timeout = 100;
    const p1 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p1');
      }, ms);
    });

    const p2 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p2');
      }, ms);
    });

    getBids([p1(50), p2(110)], timeout)
      .then(results => {
        expect(results).toEqual([
          { data: 'p1', status: 'fulfilled' },
          { err: 'Timed out in 100ms.', status: 'rejected' }
        ]);
        done();
      });
  });

  test('Should reject 2 bid request.', (done) => {
    const timeout = 100;
    const p1 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p1');
      }, ms);
    });

    const p2 = ms => new Promise(resolve => {
      setTimeout(() => {
        resolve('p2');
      }, ms);
    });

    getBids([p1(110), p2(110)], timeout)
      .then(results => {
        expect(results).toEqual([
          { err: 'Timed out in 100ms.', status: 'rejected' },
          { err: 'Timed out in 100ms.', status: 'rejected' }
        ]);
        done();
      });
  });
});