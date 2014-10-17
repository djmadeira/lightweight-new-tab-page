window.addEventListener('DOMContentLoaded', newTabPageMain);

function newTabPageMain () {

  var internalLink = /^chrome:/;
  function handleLinkEvent (e) {
    e.preventDefault();
    chrome.tabs.getCurrent(function (tab) {
      chrome.tabs.update(tab.id, {
        url: e.target.href
      });
    });
  }

  var links = document.querySelectorAll('a');
  for (var i=0, j=links.length; i<j; i++) {
    if (links[i].href.match(internalLink)) {
      links[i].addEventListener('click', handleLinkEvent);
    }
  }

  document.getElementById('clear-cache').addEventListener('click', function () {
    this.classList.add('in-progress');
    chrome.browsingData.removeCache({}, function () {
      document.getElementById('clear-cache').classList.add('is-complete');
    });
  });

  document.getElementById('clear-history').addEventListener('click', function (e) {
    this.parentElement.classList.toggle('pending-confirm');
  });

  document.getElementById('history-increment').addEventListener('click', function (e) {
    var values = ['1 day', '1 week', '1 month', 'forever', '10 minutes'];
    var current = values.indexOf(this.value);
    var next = current !== values.length - 1 ? current + 1 : 0;
    this.value = values[next];
  });

  document.getElementById('clear-history-confirm').addEventListener('click', function (e) {
    console.log(Date);
    var increment = document.getElementById('history-increment').value,
        today = new Date().getTime(),
        miliInDay = 86400000;

    this.parentElement.classList.remove('pending-confirm');
    document.getElementById('clear-history').classList.add('in-progress');

    switch (increment) {
      case "1 day":
        increment = today - miliInDay;
        break;
      case "1 week":
        increment = today - miliInDay * 7;
        break;
      case "1 month":
        increment = today - miliInDay * 30;
        break;
      case "forever":
        increment = 0;
        break;
      case "10 minutes":
        increment = today - 600000;
        break;
    }

    chrome.browsingData.removeHistory({ since: increment }, function () {
      document.getElementById('clear-history').classList.add('is-complete');
    });
  });

}