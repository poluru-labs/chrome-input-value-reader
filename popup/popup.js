document.addEventListener('DOMContentLoaded', function () {
  const selectorInput = document.getElementById('selector');
  const findButton = document.getElementById('findInput');
  const clearButton = document.getElementById('clearResults');
  const output = document.getElementById('output');
  const kicker = document.getElementById('resultKicker');

  findButton.addEventListener('click', readValue);
  clearButton.addEventListener('click', resetUi);

  selectorInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      readValue();
    }
  });

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach(function (other) {
        other.classList.toggle('is-active', other === chip);
      });
      selectorInput.value = chip.getAttribute('data-selector') || '';
      selectorInput.focus();
    });
  });

  selectorInput.focus();

  async function readValue() {
    const selector = selectorInput.value.trim();

    if (!selector) {
      showMessage('Enter a CSS selector first.', 'error');
      return;
    }

    findButton.classList.add('is-busy');
    findButton.textContent = 'Reading…';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        showMessage('No active tab found.', 'error');
        return;
      }

      if (!isInjectableUrl(tab.url)) {
        showMessage('Chrome internal and Web Store pages cannot be inspected.', 'error');
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: findInputValue,
        args: [selector],
      });

      const result = results[0]?.result;
      if (!result) {
        showMessage('No result from the page.', 'error');
        return;
      }

      if (result.error) {
        showMessage(result.error, 'error');
      } else if (result.found && result.masked) {
        showResult({
          value: 'Hidden (password field)',
          masked: true,
          selector,
          type: result.type,
          tagName: result.tagName,
        });
      } else if (result.found) {
        showResult({
          value: result.value === '' ? '(empty)' : result.value,
          masked: false,
          selector,
          type: result.type,
          tagName: result.tagName,
        });
      } else {
        showMessage('No input, textarea, or select matched that selector.', 'error');
      }
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      findButton.classList.remove('is-busy');
      findButton.textContent = 'Read value';
    }
  }

  function resetUi() {
    selectorInput.value = '';
    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.classList.remove('is-active');
    });
    kicker.textContent = 'Result';
    output.className = 'result-body is-empty';
    output.replaceChildren();
    const title = document.createElement('p');
    title.className = 'empty-title';
    title.textContent = 'No lookup yet';
    const copy = document.createElement('p');
    copy.className = 'empty-copy';
    copy.textContent = 'Pick a chip or type a selector, then read the active tab.';
    output.append(title, copy);
    selectorInput.focus();
  }

  function showMessage(message, type) {
    kicker.textContent = type === 'error' ? 'Could not read' : 'Result';
    output.className = 'result-body';
    output.replaceChildren();
    const p = document.createElement('p');
    p.className = 'message' + (type === 'error' ? ' error' : '');
    p.textContent = message;
    output.append(p);
  }

  function showResult(detail) {
    kicker.textContent = detail.masked ? 'Password field' : 'Matched';
    output.className = 'result-body';
    output.replaceChildren();

    const value = document.createElement('p');
    value.className = 'value-block' + (detail.masked ? ' is-masked' : '');
    value.textContent = detail.value;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.append(
      pill(detail.tagName),
      pill(detail.type),
      pill(detail.selector),
    );

    output.append(value, meta);
  }

  function pill(text) {
    const span = document.createElement('span');
    span.className = 'pill';
    span.textContent = text;
    return span;
  }

  function isInjectableUrl(url) {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'chrome:' || parsed.protocol === 'chrome-extension:') return false;
      if (parsed.hostname === 'chrome.google.com' && parsed.pathname.startsWith('/webstore')) return false;
      if (parsed.hostname === 'chromewebstore.google.com') return false;
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'file:';
    } catch {
      return false;
    }
  }
});

function findInputValue(selector) {
  try {
    const element = document.querySelector(selector);

    if (!element) {
      return { found: false, error: null };
    }

    const tag = element.tagName.toUpperCase();
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      return {
        found: false,
        error: 'Matched ' + element.tagName.toLowerCase() + ', which is not an input, textarea, or select.',
      };
    }

    if (tag === 'INPUT' && element.type === 'password') {
      highlightElement(element);
      return {
        found: true,
        masked: true,
        value: '',
        type: 'password',
        tagName: 'input',
        error: null,
      };
    }

    let value = '';
    if (tag === 'SELECT') {
      value = element.selectedOptions.length > 0 ? element.selectedOptions[0].text : '';
    } else if (element.type === 'checkbox' || element.type === 'radio') {
      value = element.checked ? element.value || 'on' : '';
    } else {
      value = element.value || '';
    }

    highlightElement(element);

    return {
      found: true,
      masked: false,
      value,
      type: element.type || 'text',
      tagName: element.tagName.toLowerCase(),
      error: null,
    };
  } catch (error) {
    return {
      found: false,
      error: 'Invalid selector: ' + error.message,
    };
  }

  function highlightElement(element) {
    const originalBorder = element.style.border;
    const originalBackground = element.style.backgroundColor;
    const originalOutline = element.style.outline;
    const originalTransition = element.style.transition;

    element.style.transition = 'all 0.2s ease';
    element.style.outline = '3px solid #1a9b95';
    element.style.outlineOffset = '2px';
    element.style.backgroundColor = '#eef9f8';

    setTimeout(() => {
      element.style.border = originalBorder;
      element.style.backgroundColor = originalBackground;
      element.style.outline = originalOutline;
      element.style.transition = originalTransition;
    }, 1800);
  }
}
