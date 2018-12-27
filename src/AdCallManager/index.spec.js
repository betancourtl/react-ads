import adCallManager, { 
  types, 
  emptyFn, 
  comparisonFn ,
  createMessage, 
} from './';
import MinHeap from '../lib/MinHeap';

describe('adCallManager', () => {  
  const msg1 = createMessage({
    type: types.INITIAL,
    level: 1,
    data: {
      cb: emptyFn,
      id: 'ad-1'
    }
  });

  const msg2 = createMessage({
    type: types.INITIAL,
    level: 2,
    data: {
      cb: emptyFn,
      id: 'ad-2'
    }
  });

  const msg3 = createMessage({
    type: types.LAZY,
    level: 1,
    data: {
      cb: emptyFn,
      id: 'ad-3'
    }
  });

  const msg4 = createMessage({
    type: types.LAZY,
    level: 2,
    data: {
      cb: emptyFn,
      id: 'ad-4'
    }
  });

  it('Should sort the heap based on type and priority.', () => {  
    const heap = new MinHeap(comparisonFn);
    heap.insert(msg1);
    heap.insert(msg2);
    heap.insert(msg3);
    heap.insert(msg4);
    expect(heap.extract()).to.deep.equal(msg1)
    expect(heap.extract()).to.deep.equal(msg2)
    expect(heap.extract()).to.deep.equal(msg3)
    expect(heap.extract()).to.deep.equal(msg4)
  });

  it('Should process definitions in chunks of 5 messages.', (done) => {
    let callArgs = [];
    const displayFn = x => callArgs.push(x);
    const adManager = adCallManager({
      displayFn,
      refreshFn: emptyFn,
      processInitialAds: true,
      processLazyAds: false,
      defineDelay: 100,          
    });

    adManager.define(msg1);
    adManager.define(msg3);
    adManager.define(msg3);
    adManager.define(msg1);
    adManager.define(msg1);    
    adManager.define(msg1);
    adManager.define(msg1);

    setTimeout(x => {
      expect(callArgs).to.deep.equal([ 'ad-1', 'ad-1', 'ad-1', 'ad-1', 'ad-1' ]);      
      callArgs = [];
    }, 100);

    setTimeout(x => {
      expect(callArgs).to.deep.equal(['ad-3', 'ad-3' ]);      
      done();
    }, 310);
  });
});