mocha.setup('bdd');

describe('Object', function () {
  it('should not equal null', function () {
    var obj = {};
    Should(obj).should.not.equal(null);
  });
});

function startTests() {
  if (document.body.getAttribute('data-env') === 'dev') {
    document.getElementById('mocha').classList.add('show');
    mocha.run();
  }
}

document.addEventListener('DOMContentLoaded', startTests);
