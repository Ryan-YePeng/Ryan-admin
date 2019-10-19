function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

function removeLocalStorage(key) {
  localStorage.removeItem(key)
}

function clearLocalStorage() {
  localStorage.clear()
}

function setSessionStorage(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data))
}

function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key))
}

function removeSessionStorage(key) {
  sessionStorage.removeItem(key)
}

function clearSessionStorage() {
  sessionStorage.clear()
}

export default {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage
}
