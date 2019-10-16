<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="4">
          <img class="p-4" src="img/sap-logo.jpg" style="width: 100%;" alt="SAP Logo">
        </b-col>
      </b-row>
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input v-model="username"  type="text" class="form-control" placeholder="Username" autocomplete="username email" required autofocus />
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input v-model="password" type="password" class="form-control" placeholder="Password" autocomplete="current-password" @keyup.enter.native="login" required />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="login" :disabled="isLoggingIn">
                        <span v-if="isLoggingIn"><i class="fa fa-spin fa-spinner"></i>&nbsp; Logging in...</span>
                        <span v-if="!isLoggingIn">Login</span>
                      </b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0">Forgot password?</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="bg-SAP py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>No account?</h2>
                  <p>Please speak to your system administrator to request an account and for access to this online application.</p>
                  <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import { storeController } from '../../shared/store';

export default {
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
      isLoggingIn: false
    }
  },
  created() {
    // clear any user info
    localStorage.removeItem('user');
  },
  methods : {
    login(e) {
      e.preventDefault();
      this.$data.isLoggingIn = true;
      if (this.password.length > 0) {
        const body = {
          username: this.username,
          password: this.password,
          pushToken: ""
        };
        this.$http.post("login", body)
          .then((response) => {
            const userObj = {
              firstName: response.data.user.first_name,
              lastName: response.data.user.last_name,
              email: response.data.user.email,
              approved: response.data.user.approved,
              company_id: response.data.user.company_id,
              branch_id: response.data.user.branch_id,
              site_id: response.data.user.site_id,
              token: response.data.token,
              auth: response.data.user.auth
            };
            console.log(response.data);
            // store the user data in local storage
            localStorage.setItem('user', JSON.stringify(userObj));
            storeController.setUserAuthToken(response.data.token);
            this.$router.push('/');
            this.$data.isLoggingIn = false;
          })
          .catch ((err) => {
            console.error(err);
            this.$data.isLoggingIn = false;
          })
      }
    }
  }
}
</script>

<style scoped>
  .card.bg-SAP {
    background-color: rgb(247, 209, 74);
    color: #333333;
    border-color: rgb(179, 144, 21);
  }
</style>
