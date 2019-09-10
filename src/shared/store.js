import Vue from "vue";

export const store = Vue.observable({
  userAuthToken: ''
});

export const storeController = {
    setUserAuthToken(token) {
      store.userAuthToken = token;
    }
};