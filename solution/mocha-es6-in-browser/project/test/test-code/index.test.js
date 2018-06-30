import SUDA from '../../src/suda/core/suda'

const chai = window.chai

describe('sum', function () {
  it('new SUDA', function () {
    const suda = new SUDA()
    chai.expect(suda.sudaCount).to.equal(1)
  });
});