export const state = () => ({
  propertyForm: {},
  furnishingTypes: [
    { value: 1, text: 'Bare' },
    { value: 2, text: 'Unfurnished' },
    { value: 3, text: 'Semi furnished' },
    { value: 4, text: 'Fully  furnished' }
  ],
  propertyStatuses: [
    { value: 1, text: 'Published' },
    { value: 2, text: 'Pending' },
    { value: 3, text: 'Rejected' },
    { value: 4, text: 'Closed' }
  ],
  featureOptions: [
    { id: 1, name: 'WiFi' },
    { id: 2, name: 'Airconditioning' },
    { id: 3, name: 'Club House' },
    { id: 4, name: 'Balconies' },
    { id: 5, name: 'Lounge' },
    { id: 6, name: 'Open Space' },
    { id: 7, name: 'Swimming Pool' },
    { id: 8, name: 'Playground' },
    { id: 9, name: 'Gymnasium' },
    { id: 10, name: 'Reception Area' },
    { id: 11, name: 'Multi-purpose Hall' }
  ],
  propertyTypes: [
    { value: 1, text: 'Condominium', short: 'Condo' },
    { value: 2, text: 'Office', short: 'Office' },
    { value: 3, text: 'House And Lot', short: 'House And Lot' }
  ],
  offerTypes: [{ value: 1, text: 'For Sale' }, { value: 2, text: 'For Rent' }],
  scheduleOptions: [
    {
      value: 1,
      label: 'Regular Business Hours',
      day: 'Monday - Friday',
      hours: '9:00 AM - 6:00 PM'
    },
    {
      value: 2,
      label: 'Weekends',
      day: 'Saturday & Sunday',
      hours: '9:00 AM - 8:00 PM'
    },
    {
      value: 3,
      label: 'After Office Hours',
      day: 'Monday - Friday',
      hours: '6:00 PM - 10:00 PM'
    },
    {
      value: 4,
      label: '24/7',
      day: 'Monday - Sunday',
      hours: '24 Hour Time Frame'
    }
  ]
});

export const mutations = {
  setPropertyForm(state, form) {
    state.propertyForm = form;
  },
  resetPropertyForm(state) {
    state.propertyForm = {};
  }
};

export const getters = {
  isSuperAdmin(state) {
    return state.auth && state.auth.user
      ? state.auth.user.roles.includes(
          state.auth.user.roles.find(role => role.id === 1)
        )
      : false;
  },
  isLazatuAdmin(state) {
    return state.auth && state.auth.user
      ? state.auth.user.roles.includes(
          state.auth.user.roles.find(role => role.id === 2)
        )
      : false;
  },
  isBusinessAccount(state) {
    return state.auth && state.auth.user
      ? state.auth.user.roles.includes(
          state.auth.user.roles.find(role => role.id > 3)
        )
      : false;
  },
  isCustomerAccountOnly(state) {
    return state.auth && state.auth.user
      ? state.auth.user.roles.includes(
          state.auth.user.roles.find(role => role.id === 3)
        ) && state.auth.user.roles.length < 2
      : false;
  }
};
