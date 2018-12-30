describe('inViewport', () => {
  const elementInView = ({ windowInnerHeight, windowPageYOffset, elementYOffset, elementHeight, offset }) => {
    let visibleRect = {
      top: windowPageYOffset, // 50
      bottom: windowPageYOffset + windowInnerHeight, // 100
    };

    let elRect = {
      top: elementYOffset - offset, // 50
      bottom: elementYOffset + elementHeight + offset, // 60
    };

    return elRect.bottom >= visibleRect.top && elRect.top <= visibleRect.bottom;
  };

  it('should return true when in element is in view', () => {    
    const inView = elementInView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 50 - 60
      elementYOffset: 50,
      elementHeight: 10,
      offset: 0,
    });
    expect(inView).to.equal(true);
  });

  it('should return false when in element bottom is greather than the pageYOffset', () => {    
    const inView = elementInView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 40 - 49
      elementYOffset: 40,
      elementHeight: 9,
      offset: 0,
    });
    expect(inView).to.equal(false);
  });

  it('should return false when in element top is greater than the bottom of the window.', () => {    
    const inView = elementInView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 101 - 111
      elementYOffset: 101,
      elementHeight: 10,
      offset: 0,
    });
    expect(inView).to.equal(false);
  });

  it('should return true when the element is not in view when using offset', () => {    
    const inView = elementInView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 35 - 45
      elementYOffset: 35,
      elementHeight: 10,
      offset: 5,
    });
    expect(inView).to.equal(true);
  });

  it('should return true when the element is not in view when using offset', () => {    
    const inView = elementInView({
      // 50 - 100
      windowInnerHeight: 50,
      windowPageYOffset: 50,
      // 120 - 130
      elementYOffset: 120,
      elementHeight: 10,
      offset: 20,
    });
    expect(inView).to.equal(true);
  });
});
