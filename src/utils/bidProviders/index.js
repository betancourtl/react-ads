const resolved = data => ({ data, status: 'fulfilled' });
const rejected = err => ({ err, status: 'rejected' });
const reflect = p => p.then(resolved, rejected);

const getBids = (promises, ms = 1300) => Promise
  .all(promises.map((promise) => {
    let timeout = new Promise((_, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in ' + ms + 'ms.');
      }, ms);
    });

    return reflect(Promise.race([promise, timeout]));
  }));

export default getBids;
