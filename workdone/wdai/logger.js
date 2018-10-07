// Section to execute
let formElements = document.querySelectorAll('form.wpcf7-form input, form.wpcf7-form textarea')
let port = chrome.runtime.connect({ name: 'expertise-capture-logger' })
port.postMessage({ message: 'Hello, Expertise Capture Extension!' })
port.onMessage.addListener(
  (msg) => {
    console.log('from the extension')
    if (msg.tab) {
      // port.postMessage({ response: 'GOTTAB' })
      console.log('GOTTAB')
    } else {
      // port.postMessage({ response: 'NOTAB' })
      console.log('NOTAB')
    }
    // return true
  }
)
let sendEventData = function (event, functionName, ...args) {
  const element = event.target
  const msg = {
    element: {
      id: element.id,
      attributes: element.attributes,
      value: element.value
    },
    onEventFunction: functionName,
    onEventArgs: args
  }
  port.postMessage(msg)
}
chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === 'expertise-capture-logger')
  port.onMessage.addListener(function (msg) {
    console.log('MSG RECV');
  });
});

// const allElements = document.body.querySelectorAll('*')

if (formElements) {
  formElements.forEach((elt) => {
    elt.addEventListener('focus', (e) => { sendEventData(e, 'onClickInput') })
    if (elt.type !== 'submit') {
      elt.addEventListener('input', (e) => { sendEventData(e, 'debounceInput') })
      elt.addEventListener('keyup', (e) => { sendEventData(e, 'debounceInput') })
    }
  })
} else {
  console.log('No search.')
}

document.body.addEventListener('copy', (e) => { sendEventData(e, 'onCopyEvent') })
document.body.addEventListener('cut', (e) => { sendEventData(e, 'onCutEvent') })
document.body.addEventListener('paste', (e) => { sendEventData(e, 'onPasteEvent') })
