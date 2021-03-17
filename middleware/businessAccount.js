export default function({ store, redirect }) {
  // If the user is not business account
  if (!store.getters.isBusinessAccount) {
    return redirect('/account');
  }
}
