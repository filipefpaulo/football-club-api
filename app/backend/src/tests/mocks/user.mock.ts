import UsersModel from '../../database/models/UsersModel';

export const userMock = {
  id: 666,
  username: 'Luci',
  role: 'King of hell',
  email: 'luci@king.hell',
  password: '$2a$08$hehDpHWKff6SX1TufEBFc.kDoY9NZaig/MyplqybwE1erpxUxh75C',
} as UsersModel;

export const userBody = {
  OK: {
    email: 'luci@king.hell',
    password: 'luciIsTheBest',
  },
  wrongPassword: {
    email: 'luci@king.hell',
    password: 'luciIsTheWorst',
  },
  wrongEmail: {
    email: 'luci@king.heaven',
    password: 'luciIsTheBest',
  },
  withoutPassword: {
    email: 'luci@king.hell',
    password: '',
  },
  withoutEmail: {
    email: '',
    password: 'luciIsTheBest',
  },
};
