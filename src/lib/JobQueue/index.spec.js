import JobQueue from './';

describe('JobQueue', () => {
  const createMessage = priority => ({
    priority,
    data: {},
  });

  test('Should create a job', (done) => {
    let results = [];

    const processFn = (q, resolve) => {

      setTimeout(() => {
        while (!q.isEmpty) results.push(q.dequeue().priority);
        resolve();
      }, 100);
    };

    const job = new JobQueue({
      chunkSize: 5,
      delay: 10,
      processFn,
    })
      //chunk 1
      .add(createMessage(1))
      .add(createMessage(1))
      .add(createMessage(1))
      .add(createMessage(1))
      .add(createMessage(1))
      // chunk 2
      .add(createMessage(2))
      .add(createMessage(2))
      .add(createMessage(2))
      .add(createMessage(2))
      .add(createMessage(2));

      
    expect(job.isProcessing).toEqual(true);
    expect(job.delay).toEqual(10);
    expect(job.processFn).toEqual((processFn));
    setTimeout(() => {
      expect(results).toEqual([1, 1, 1, 1, 1]);
    }, 120);

    setTimeout(() => {
      expect(results).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2]);
      expect(job.isProcessing).toEqual(false);
      done();
    }, 220);
  });
});