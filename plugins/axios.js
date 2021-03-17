export default function({ $axios, store, app }) {
  $axios.onRequest(config => {
    config.headers.common['Content-Type'] = 'application/json';
    config.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    if (store.state.auth.loggedIn) {
      config.headers.common['Authorization'] = app.$auth.$storage.getUniversal(
        '_token.password_grant',
        true
      );
    }
  });

  $axios.onRequestError(err => {
    console.err(err);
  });
}
