import axios from 'axios';
import config from '../config'
export default {
  state: {
    tokens: {
      access_token: null,
      expires_in: null,
      refresh_token: null,
      token_type: null
    },
    authenticatedUser: {
      id: null,
      name: null,
      email: null,
      picture: null,
      created_at: null,
      updated_at: null,
    },
    notifications: [],
    allUsers: []
  },

  mutations: {
    UPDATE_TOKENS(state, tokens){
      state.tokens = tokens
    },
    DESTROY_TOKENS: function (state) {
      state.tokens.access_token = null,
          state.tokens.expires_in = null,
          state.tokens.refresh_token = null,
          state.tokens.token_type = null,

          state.authenticatedUser.id = null,
          state.authenticatedUser.name = null,
          state.authenticatedUser.email = null,
          state.authenticatedUser.picture = null,
          state.authenticatedUser.created_at = null,
          state.authenticatedUser.updated_at = null,

          state.notifications = []
    },
    SET_AUTH_USER(state, authUser){
      state.authenticatedUser = authUser
    },
    SET_NOTIFICATIONS(state, notifications){
      state.notifications = notifications
    },
    SAVE_NOTIFICATION(state, notification){
      state.notifications.notifications.unshift(notification);
    },
    REMOVE_NOTIFICATION(state, notification){
      let notifications = state.notifications.notifications;
      notifications.splice(notifications.indexOf(notification), 1)
    },
    SET_ALL_USERS(state, users){
      state.allUsers = users
    },
  },

  actions: {
    login(state, loginDetails){
      return new Promise((resolve, reject) => {
        let data = {
          grant_type: 'password',
          client_id: 2,
          client_secret: '0NqPpvj7QDUfANeyMXqSzq9pgqcKDgievSfAQLub',
          username: loginDetails.email,
          password: loginDetails.password,
          remember: loginDetails.remember,
          scope: ''
        };
        let header = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        axios[config.loginMethod](config.apiUrl + config.loginRequest, data, {headers: header})
            .then(response => {
              let responseData = response.data;
              let now = Date.now();

              responseData.expires_in = responseData.expires_in + now;
              state.commit('UPDATE_TOKENS', responseData);

              resolve(response)
            })
            .catch(error => {
              reject(error)
            })

      })
    },
    checkToken({state, getters}){
      let token = getters.getToken;

      if (Date.now() > parseInt(token.expiration)) {
        return null
      } else {
        return true
      }
    },
    setAuthenticatedUser({commit, getters, dispatch}) {
        return new Promise((resolve, reject) => {
          axios[config.getUserMethod](config.apiUrl + config.getUserRequest, {headers: getters.getHeader})
              .then(response => {
                let authUser = response.data;
                commit('SET_AUTH_USER', authUser);
                dispatch('setUserNotifications', authUser.id);
                resolve(response)
              })
              .catch(error => {
                reject(error)
              })
        });
    },
    setUserNotifications({commit, getters}, userID) {
      return new Promise((resolve, reject) => {
        axios[config.getUserNotificationsMethod](config.apiUrl + config.getUserNotificationsRequest + '/' + userID, {headers: getters.getHeader})
            .then(response => {
              let notifications = response.data;
              commit('SET_NOTIFICATIONS', notifications);
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
      })
    },
    deleteUserNotification({commit, getters}, notification) {
      return new Promise((resolve, reject) => {
        axios[config.deleteUserNotificationMethod](config.apiUrl + config.deleteUserNotificationRequest + '/' + notification.id, {headers: getters.getHeader})
            .then(function (response) {
              if (response.data.deleted) {
                commit('REMOVE_NOTIFICATION', notification);
                resolve(response);
              }
            })
            .catch(error => {
              reject(error)
            })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        commit('DESTROY_TOKENS');
        let redirect = '/';
        resolve(redirect);
      });
    },
    register(registerDetails){
      return new Promise((resolve, reject) => {
        axios[config.registerMethod](config.apiUrl + config.registerRequest, registerDetails)
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })

      })
    },
    saveUpdatedUserData({getters, commit}, userData){
      return new Promise((resolve, reject) => {
        axios[config.saveUserMethod](config.apiUrl + config.saveUserRequest + userData.id, userData, {headers: getters.getHeader})
            .then(function (response) {
              let saved = response.data.saved;
              let updatedUserData = response.data.updatedUserData;
              if (saved) {
                if (updatedUserData) {
                  commit('SET_AUTH_USER', updatedUserData);
                  resolve(response)
                }
              }
            })
            .catch(error => {
              reject(error);
            })
      })
    },
    setAllUsers({commit, getters}) {
      return new Promise((resolve, reject) => {
        axios[config.getAllUsersMethod](config.apiUrl + config.getAllUsersRequest, {headers: getters.getHeader})
            .then(response => {
              let users = response.data;
              commit('SET_ALL_USERS', users);
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
      })
    },
  },

  getters: {
    getToken(state) {
      let uToken = state.tokens.access_token;
      let uExpiration = state.tokens.expires_in;
      let token = {
        token: uToken,
        expiration: uExpiration
      };

      if ( !uToken || !uExpiration ) {
        return null
      } else {
        return token
      }
    },
    isAuthenticated(state, getters) {
      if (getters.getToken) {
        return true
      } else {
        return false
      }
    },
    getHeader(state, getters) {
      if (getters.getToken) {
        let header = {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + getters.getToken.token
        };
        return header
      } else {
        return null
      }
    },
    getAuthenticatedUser(state) {
      return state.authenticatedUser
    },
    getNotifications: state => {
      return state.notifications.notifications;
    },
    getAllUsers(state) {
      return state.allUsers
    },
  },
}