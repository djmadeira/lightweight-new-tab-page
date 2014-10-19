window.addEventListener('DOMContentLoaded', newTabPageMain);

function newTabPageMain () {
  var internalLink = /^chrome:/;
  var customLinks = document.getElementById('custom-links');
  var links = document.querySelectorAll('a');
  var overlayToggles = document.querySelectorAll('.overlay-toggle');
  var customCSS = document.getElementById('custom-css');
  var customCSSField = document.getElementById('custom-css-field')
  var editLinksButton = document.getElementById('edit-links-toggle');
  var customLinks = JSON.parse(localStorage.getItem('newtab-custom-links')) ||
      [ // Default
        ['Twitter', 'https://twitter.com']
      ];
  var customLinksUl = document.getElementById('custom-links');
  var linkTemplate = document.getElementById('custom-link-template');

  function handleLinkEvent (e) {
    e.preventDefault();
    chrome.tabs.getCurrent(function (tab) {
      chrome.tabs.update(tab.id, {
        url: e.target.href
      });
    });
  }

  function replaceTemplateTags(templateEl, tagsObject) {
    var src = templateEl.innerHTML,
        dest = document.createElement('template');

    for (var tag in tagsObject) {
      src = src.replace('{{'+tag+'}}', tagsObject[tag]);
    }

    dest.innerHTML = src;
    return dest.content.cloneNode(true);
  }

  function enableLinkEditing () {
    customLinks = document.getElementById('custom-links')
    customLinks.classList.add('is-editing');
    appendNewLinkField();
  }

  function disableLinkEditing () {
    customLinks = document.getElementById('custom-links')

    customLinks.classList.remove('is-editing');
    customLinks.removeChild(document.getElementById('new-link'));
  }

  function appendNewLinkField () {
    customLinks = document.getElementById('custom-links');
    customLinks.appendChild(document.getElementById('new-link-template').content.cloneNode(true));
    // When link is submitted
    document.getElementById('new-link-confirm').addEventListener('click', function (e) {
      var title = document.getElementById('new-link-title').value,
          href = document.getElementById('new-link-href').value;
     
      addNewLink([title, href]);

      document.getElementById('new-link-title').value = '';
      document.getElementById('new-link-href').value = '';
    });
  }

  function addNewLink(link) {
    var currentLinks = JSON.parse(localStorage.getItem('newtab-custom-links'));

    currentLinks.push(link);
    localStorage.setItem('newtab-custom-links', JSON.stringify(currentLinks));

    var newItem = replaceTemplateTags(linkTemplate, {
      'title': link[0],
      'href': link[1]
    });

    bindLinkRemoveHandler(newItem.querySelector('.edit-button.remove'));

    customLinks.insertBefore(newItem, document.getElementById('new-link'));
  }

  function bindLinkRemoveHandler (el) {
    var eventListener = function (e) {
      customLinks = JSON.parse(localStorage.getItem('newtab-custom-links'));
      var title = this.parentElement.querySelector('.custom-link').innerHTML;
      for (var i=0; i < customLinks.length; i++) {
        if (customLinks[i][0] == title) {
          console.log(i);
          customLinks.splice(i, 1);
          break;
        }
      }

      localStorage.setItem('newtab-custom-links', JSON.stringify(customLinks));

      this.parentElement.parentElement.removeChild(this.parentElement);
    }

    if (el) {
      el.addEventListener('click', eventListener);
    } else {
      var els = document.querySelectorAll('#custom-links .edit-button.remove');
      for (var i=0; i < els.length; i++) {
        els[i].addEventListener('click', eventListener);
      }
    }
  }

  for (var i=0, j=links.length; i<j; i++) {
    if (links[i].href.match(internalLink)) {
      links[i].addEventListener('click', handleLinkEvent);
    }
  }

  for (var i=0, j=overlayToggles.length; i<j; i++) {
    overlayToggles[i].addEventListener('click', function (e) {
      this.parentElement.classList.toggle('is-active');
    })
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

  // CSS customizer setup
  customCSS.innerHTML = localStorage.getItem('newtab-custom-css');
  customCSSField.value = customCSS.innerHTML;

  customCSSField.addEventListener('keyup', function (e) {
    document.getElementById('custom-css').innerHTML = this.value;
    localStorage.setItem('newtab-custom-css', this.value);
  });

  // Custom links setup
  for (var i=0, j=customLinks.length; i<j; i++) {
    var link = replaceTemplateTags(linkTemplate, {
      'title': customLinks[i][0],
      'href': customLinks[i][1]
    });

    customLinksUl.appendChild(link);
  }

  bindLinkRemoveHandler();

  // Custom links UI
  editLinksButton.addEventListener('click', function (e) {
    if (this.classList.contains('is-active')) {
      disableLinkEditing();
      this.classList.remove('is-active');
      this.innerHTML = 'Edit links';
    } else {
      enableLinkEditing();
      this.classList.add('is-active');
      this.innerHTML = 'Done editing'
    }
  })
}