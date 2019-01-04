import dispatch, { status } from './';

describe('dispatch', () => {
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

  test('Should fulfill both bid requests', done => {
    dispatch([p1(200), p2(100)], 1000)
      .then(results => {
        expect(results).toEqual([
          { data: 'p1', status: status.fulfilled },
          { data: 'p2', status: status.fulfilled }
        ]);
        done();
      });
  });

  test('Should fulfill 1 bid request.', done => {
    dispatch([p1(50), p2(110)], 100)
      .then(results => {
        expect(results).toEqual([
          { data: 'p1', status: status.fulfilled },
          { err: 'Timed out in 100ms.', status: status.rejected }
        ]);
        done();
      });
  });

  test('Should reject 2 bid request.', done => {
    dispatch([p1(110), p2(110)], 100)
      .then(results => {
        expect(results).toEqual([
          { err: 'Timed out in 100ms.', status: status.rejected },
          { err: 'Timed out in 100ms.', status: status.rejected }
        ]);
        done();
      });
  });
});