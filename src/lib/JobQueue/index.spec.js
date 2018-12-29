import JobQueue from './';

describe('JobQueue', () => {
  const createMessage = priority => ({
    priority,
    data: {},
  });

  it('Should create a job', (done) => {
    let results = [];

    const processFn = (arr, resolve) => {

      setTimeout(() => {
        arr.forEach(x => {
          results.push(x.priority);
        });
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

      
    expect(job.isProcessing).to.equal(true);
    expect(job.delay).to.equal(10);
    expect(job.processFn).to.deep.equal((processFn));
    setTimeout(() => {
      expect(results).to.deep.equal([1, 1, 1, 1, 1]);
    }, 120);

    setTimeout(() => {
      expect(results).to.deep.equal([1, 1, 1, 1, 1, 2, 2, 2, 2, 2]);
      expect(job.isProcessing).to.equal(false);
      done();
    }, 220);
  });
});