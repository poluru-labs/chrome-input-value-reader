document.addEventListener('DOMContentLoaded', function () {
  const loadButton = document.getElementById('loadPage');
  const clearButton = document.getElementById('clearResults');
  const output = document.getElementById('output');
  const kicker = document.getElementById('resultKicker');
  const pageUrl = document.getElementById('pageUrl');

  loadButton.addEventListener('click', loadPage);
  clearButton.addEventListener('click', resetUi);

  showTabUrl();

  async function showTabUrl() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        pageUrl.textContent = tab.url;
        pageUrl.title = tab.url;
      }
    } catch {
      pageUrl.textContent = 'Could not read the current tab URL.';
    }
  }

  async function loadPage() {
    loadButton.classList.add('is-busy');
    loadButton.textContent = 'Loading…';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.id) {
        showMessage('No active tab found.', 'error');
        return;
      }

      if (tab.url) {
        pageUrl.textContent = tab.url;
        pageUrl.title = tab.url;
      }

      if (!isInjectableUrl(tab.url)) {
        showMessage('Chrome internal and Web Store pages cannot be inspected.', 'error');
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: collectFormFields,
      });

      const payload = results[0]?.result;
      if (!payload) {
        showMessage('No result from the page.', 'error');
        return;
      }

      if (payload.error) {
        showMessage(payload.error, 'error');
        return;
      }

      if (!payload.fields.length) {
        showMessage('No input, textarea, or select fields on this page.', 'error');
        return;
      }

      showTable(payload.fields);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      loadButton.classList.remove('is-busy');
      loadButton.textContent = 'Load Page';
    }
  }

  function resetUi() {
    kicker.textContent = 'Fields';
    output.className = 'result-body is-empty';
    output.replaceChildren();
    const title = document.createElement('p');
    title.className = 'empty-title';
    title.textContent = 'Nothing loaded';
    const copy = document.createElement('p');
    copy.className = 'empty-copy';
    copy.textContent = 'Click Load Page to read every input, textarea, and select on this tab.';
    output.append(title, copy);
    showTabUrl();
  }

  function showMessage(message, type) {
    kicker.textContent = type === 'error' ? 'Could not load' : 'Fields';
    output.className = 'result-body';
    output.replaceChildren();
    const p = document.createElement('p');
    p.className = 'message' + (type === 'error' ? ' error' : '');
    p.textContent = message;
    output.append(p);
  }

  function showTable(fields) {
    kicker.textContent = fields.length === 1 ? '1 field' : fields.length + ' fields';
    output.className = 'result-body';
    output.replaceChildren();

    const table = document.createElement('table');
    table.className = 'grid';

    const colgroup = document.createElement('colgroup');
    const colSel = document.createElement('col');
    colSel.className = 'col-selector';
    const colVal = document.createElement('col');
    colVal.className = 'col-value';
    colgroup.append(colSel, colVal);

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thSel = document.createElement('th');
    thSel.scope = 'col';
    thSel.textContent = 'Selector';
    const thVal = document.createElement('th');
    thVal.scope = 'col';
    thVal.textContent = 'Value';
    headRow.append(thSel, thVal);
    thead.append(headRow);

    const tbody = document.createElement('tbody');
    fields.forEach(function (field) {
      const tr = document.createElement('tr');
      const tdSel = document.createElement('td');
      const sel = document.createElement('span');
      sel.className = 'sel';
      sel.textContent = field.selector;
      tdSel.append(sel);

      const tdVal = document.createElement('td');
      const val = document.createElement('span');
      if (field.masked) {
        val.className = 'val is-masked';
        val.textContent = '[hidden]';
      } else if (field.value === '') {
        val.className = 'val is-empty';
        val.textContent = '—';
      } else {
        val.className = 'val';
        val.textContent = field.value;
      }
      tdVal.append(val);
      tr.append(tdSel, tdVal);
      tbody.append(tr);
    });

    table.append(colgroup, thead, tbody);
    output.append(table);
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

function collectFormFields() {
  const skipTypes = { submit: true, button: true, reset: true, image: true };
  const nodes = document.querySelectorAll('input, textarea, select');
  const used = {};
  const fields = [];

  function attrEscape(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function cssPath(el) {
    if (el.id) return '#' + CSS.escape(el.id);
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 5) {
      let part = node.tagName.toLowerCase();
      if (node.id) {
        parts.unshift('#' + CSS.escape(node.id));
        break;
      }
      const parent = node.parentElement;
      if (parent) {
        const same = Array.prototype.filter.call(parent.children, function (child) {
          return child.tagName === node.tagName;
        });
        if (same.length > 1) {
          part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
        }
      }
      parts.unshift(part);
      node = parent;
      if (!node || node === document.documentElement) break;
    }
    return parts.join(' > ');
  }

  function uniqueSelector(el) {
    const candidates = [];
    const tag = el.tagName.toLowerCase();
    if (el.id) candidates.push('#' + CSS.escape(el.id));
    if (el.getAttribute('name')) {
      const name = attrEscape(el.getAttribute('name'));
      if ((el.type === 'radio' || el.type === 'checkbox') && el.value) {
        candidates.push(tag + '[name="' + name + '"][value="' + attrEscape(el.value) + '"]');
      }
      candidates.push(tag + '[name="' + name + '"]');
    }
    if (el.getAttribute('data-field')) {
      candidates.push('[data-field="' + attrEscape(el.getAttribute('data-field')) + '"]');
    }
    if (el.classList && el.classList.length) {
      const cls = Array.prototype.map.call(el.classList, function (c) {
        return CSS.escape(c);
      }).join('.');
      candidates.push(tag + '.' + cls);
    }

    for (let i = 0; i < candidates.length; i++) {
      const sel = candidates[i];
      try {
        if (!used[sel] && document.querySelectorAll(sel).length === 1) {
          used[sel] = true;
          return sel;
        }
      } catch (err) {
        /* skip invalid candidate */
      }
    }

    let path = cssPath(el);
    if (used[path]) path = path + ':nth-child(' + (Array.prototype.indexOf.call(el.parentNode.children, el) + 1) + ')';
    used[path] = true;
    return path;
  }

  Array.prototype.forEach.call(nodes, function (el) {
    const type = (el.type || el.tagName.toLowerCase()).toLowerCase();
    if (skipTypes[type]) return;

    const masked = el.tagName === 'INPUT' && type === 'password';
    let value = '';

    if (masked) {
      value = '';
    } else if (el.tagName === 'SELECT') {
      value = el.multiple
        ? Array.prototype.map.call(el.selectedOptions, function (opt) { return opt.text; }).join(', ')
        : (el.selectedOptions.length ? el.selectedOptions[0].text : '');
    } else if (type === 'checkbox' || type === 'radio') {
      value = el.checked ? (el.value || 'on') : 'unchecked';
    } else if (type === 'file') {
      value = el.files && el.files.length
        ? Array.prototype.map.call(el.files, function (file) { return file.name; }).join(', ')
        : '';
    } else {
      value = el.value || '';
    }

    fields.push({
      selector: uniqueSelector(el),
      value: value,
      masked: masked,
      type: type,
    });
  });

  return { url: location.href, fields: fields };
}
