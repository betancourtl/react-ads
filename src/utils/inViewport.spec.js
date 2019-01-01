import { inView } from './inViewport';

describe('inViewport', () => {
  it('should return true when in element is in view', () => {    
    const visible = inView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 50 - 60
      elementYOffset: 50,
      elementHeight: 10,
      offset: 0,
    });
    expect(visible).to.equal(true);
  });

  it('should return false when in element bottom is greather than the pageYOffset', () => {    
    const visible = inView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 40 - 49
      elementYOffset: 40,
      elementHeight: 9,
      offset: 0,
    });
    expect(visible).to.equal(false);
  });

  it('should return false when in element top is greater than the bottom of the window.', () => {    
    const visible = inView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 101 - 111
      elementYOffset: 101,
      elementHeight: 10,
      offset: 0,
    });
    expect(visible).to.equal(false);
  });

  it('should return true when the element is not in view when using offset', () => {    
    const visible = inView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 35 - 45
      elementYOffset: 35,
      elementHeight: 10,
      offset: 5,
    });
    expect(visible).to.equal(true);
  });

  it('should return true when the element is not in view when using offset', () => {    
    const visible = inView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 120 - 130
      elementYOffset: 120,
      elementHeight: 10,
      offset: 20,
    });
    expect(visible).to.equal(true);
  });
});
