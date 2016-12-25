import {Advertisements} from "/imports/api/advertisements/Advertisements";

let init_val = 1;

AdminConfig = {
  name: 'eCommerce',
  adminEmails: ['admin@admin.com'],
  logoutRedirect: 'login',
  collections: {
    Advertisements: {
      collectionObject: Advertisements,
      tableColumns: [
        { label: 'No', name: function () { return init_val++ }},
        { label: 'Title', name: 'advertiseTitle' },
        { label: 'Position', name: 'position' }
      ]
    }
  }
};
