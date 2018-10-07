/**
 * Encode strings
 */
const sanitize = (string) => {
  const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      "/": '&#x2F;'
  }
  const reg = /[&<>"'/]/ig
  return string.replace(reg, (match) => (map[match]))
}
/**
 * Creates an ID for elements that don't have an ID or a name.
 */
const generateElementID = (element) => {
  if (element.id) {
    return element.id
  } else if (element.attributes.name) {
    return element.attributes.name.value
  } else {
    console.log(element.attributes)
    return 'input-' + uuid.uuidv4()
    //return sanitize(`input-${element.attributes.class.value}`)
  }
}

/**
 * Convert decimal value to hex
 */
const dec2hex = (dec) => ('0' + dec.toString()).substr(-2)

/**
 * An object for functions that generate RFC-compliant UUIDs
 */
const uuid = {
  uuidv4: () => 
    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
      /[018]/g,
      c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

/**
 * Basic HTTP request that uses fetch() instead of XHR
 */
const request = (url, options, method = 'GET', data = {}) => {
  let defaultOptions = {
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, same-origin, *omit. include because requesting to CouchDB
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // no-referrer, *client
  }

  let opts = {
    ...defaultOptions,
    ...options,
    method: method, // *GET, POST, PUT, DELETE, etc.
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }
  opts.headers = {
    ...defaultOptions.headers,
    ...options.headers
  }
  return fetch(url.toString(), opts)
         .then(r => r.json())
         .catch(e => console.error(e))
}

/**
 * If this were a module, this is what it would export. An object of shortcut HTTP request funcs.
 */
const $http = {
  delete: (url, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))

    return request(url, opts, 'DELETE')
           .then(r => r)
           .catch(e => console.error(e))
  },
  get: (url, headers = {}, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))
    opts.headers = headers

    return request(url, opts, 'GET')
           .then(r => r)
           .catch(e => console.error(e))
  },
  options: (url, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))

    return request(url, opts, 'OPTIONS')
           .then(r => r)
           .catch(e => console.error(e))
  },
  patch: (url, data, headers = {}, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))
    opts.headers = headers

    return request(url, opts, 'PATCH', data)
           .then(r => r)
           .catch(e => console.error(e))
  },
  post: (url, data, headers = {}, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))
    opts.headers = headers

    return request(url, opts, 'POST', data)
           .then(r => r)
           .catch(e => console.error(e))
  },
  put: (url, data, headers = {}, options = {}) => {
    let opts = JSON.parse(JSON.stringify(options))
    opts.headers = headers

    return request(url, opts, 'PUT', data)
           .then(r => r)
           .catch(e => console.error(e))
  }
}

/**
 * The main function that writes to a stream
 */
const logAction = (action, session, element, location = {}) => {
  let doc = {
    pk: uuid.uuidv4(),
    eventType: action.toLowerCase(),
    session: session,
    location: location,
    generatedAt: new Date()
  }

  if (['input', 'click'].findIndex(x => action.toLowerCase() === x) > -1) {
    if (element) {
      doc.element = generateElementID(element)
    } else {
      // error
    }

    if (action.toLowerCase() === 'input') {
      doc.value = sanitize(element.value)
    }
  }
  console.log('Adding to couch...')
  return $http.post(
    'http://localhost:5984/expertise_capture',
    doc,
    {
      'X-CouchDB-WWW-Authenticate': 'Cookie'
    },
    {
      credentials: 'include'
    }
  ).then(r => r).catch(e => console.error(e))
}

const $couch = (username, password) => {
  return $http.post(
    'http://localhost:5984/_session',
    {
      name: username,
      password: password
    }
  )
}


let typingTimer
const doneTypingInterval = 1500

// Event handlers
let events = {}
events.onGenericEvent = function (element, action, locationInfo = {}) {
  console.log('Couch logging fired.')
  $couch('expcapt', 'expcapt').then(data => {
    return logAction(action, data, element, locationInfo)
           .then(r => r)
           .catch(e => console.error(e))
  }).catch(e => console.error(e))
}
events.onClickInput = function (e) {
  events.onGenericEvent(e, 'click')
}
events.onClipboardEvent = function (e, action) {
  events.onGenericEvent(e, action)
}
events.onCopyEvent = function (e) {
  events.onClipboardEvent(e, 'copy')
}
events.onCutEvent = function (e) {
  events.onClipboardEvent(e, 'cut')
}
events.onPasteEvent = function (e) {
  events.onClipboardEvent(e, 'paste')
}
events.onDoneTyping = function (e) {
  events.onGenericEvent(e, 'input')
}
events.onTabActivated = function (locationInfo) {
  events.onGenericEvent(null, 'currentTabSwitch', locationInfo)
}
events.onTabUpdated = function (locationInfo) {
  events.onGenericEvent(null, 'tabUpdated', locationInfo)
}


// Debounce
events.debounceInput = function (e) {
  clearTimeout(typingTimer)
  if (e.value) {
    typingTimer = setTimeout(events.onDoneTyping, doneTypingInterval, e)
  }
}

// Chrome events
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === 'expertise-capture-logger')
  port.onMessage.addListener(function ({ element, onEventFunction, onEventArgs }) {
    if (onEventFunction) {
      events[onEventFunction](element)// onEventArgs)
    }
  })
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      events.onTabActivated({ tab: tabs[0] })
    })
  })
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.hasOwnProperty('status') || changeInfo.hasOwnProperty('url')) {
      events.onTabUpdated({ changeInfo, tab })
      console.log(changeInfo, tab)
    }
  })

  chrome.storage.sync.set({color: '#3aa757'}, function () {
    console.log("The color is green.")
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'}
      })
                  ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})
