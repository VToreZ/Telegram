(function (T19) {
  // const {
  //   initCountryCodeSelector, initPasswordForm, initLoginForm, initLoginCodeForm,
  //   buildChatsList, selectChat, initMain, removeAuth, saveAuth, initRegistrationPage,
  // } = T19.appHelpers;

  const exports = {};

  const appState = (function () {
    const state = {};
    function setState(key, value) {
      state[key] = value;
    }
    function getState(key) {
      return state[key];
    }
    let showPage = function (id, data) {
      const page = this.pages.list[id];
      if (!page) {
        throw new Error('No page with id ' + id);
      }
      if (this.currentPage) {
        if (this.currentPage.node) {
          this.currentPage.node.className = 'hidden';
        }
        if (this.toRemoveCallbacks) {
          this.toRemoveCallbacks.forEach(({ node, cbs }) => {
            cbs.forEach(([type, cb]) => node.removeEventListener(type, cb));
          });
        }
      }
      if (page.node) {
        page.node.className = '';
      }
      this.toRemoveCallbacks = page.action(data);
      this.currentPage = page;
    };
    return {
      state,
      authorized: false,
      user: {},
      init() {
        showPage = showPage.bind(this);
        window.showPage = showPage;
        const authStr = localStorage.getItem('userAuth');
        if (authStr) {
          try {
            const auth = JSON.parse(authStr);
            T19.api('users.getFullUser', { id: {_: 'inputUserSelf'} }).then(user => {
              setTimeout(() => { showPage('main', user); });
            }).catch((e) => {
              console.error(e);
              removeAuth();
              showPage('login');
            });
          } catch(e) {
            console.error(e);
            removeAuth();
            showPage('login');
          }
        } else {
          showPage('login');
        }
      },
      currentPage: null,
      pages: {
        list: {
          login: {
            node: document.querySelector('#login-page'),
            action({ skipLoadingClosestDC } = { skipLoadingClosestDC: false }) {
              return initLoginForm(setState, showPage, skipLoadingClosestDC);
            }
          },
          loginCode: {
            node: document.querySelector('#login-code-page'),
            action() {
              return initLoginCodeForm(getState, setState, showPage);
            }
          },
          loginPassword: {
            node: document.querySelector('#login-password-page'),
            action() {
              return initPasswordForm(getState, setState, showPage);
            }
          },
          registration: {
            node: document.querySelector('#registration-page'),
            action() {
              return initRegistrationPage(getState, setState, showPage);
            }
          },
          logout: {
            node: null,
            action() {
              return removeAuth();
            }
          },
          main: {
            node: document.querySelector('#main-page'),
            action(user) {
              return initMain(getState, setState, showPage, user);
            }
          }
        }
      }
    };
  })();

  exports.state = appState;
  window.appState = appState;

  T19.app = exports;
})(window.T19);

document.addEventListener('DOMContentLoaded', function () {
  window.T19.app.state.init();
});
