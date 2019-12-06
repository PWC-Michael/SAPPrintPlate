<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="4">
          <img class="p-4" src="img/sap-logo.jpg" style="width: 100%;" alt="SAP Logo">
        </b-col>
      </b-row>
      <b-row class="justify-content-center" v-if="!showUsersList">
        <b-col md="10">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input v-model="username"  type="text" class="form-control" placeholder="Username" autocomplete="username email" required autofocus />
                    <b-input-group-append v-if="hasExistingUserList">
                      <b-button variant="secondary" @click="showUsersListClick"><i class="icon-options"></i></b-button>
                    </b-input-group-append>
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
                  <h2>SAP Print Plate</h2>
                  <p>
                    Desktop Software by: <strong>Sandhurst Autoprint Ltd</strong>
                  </p>
                  <hr>
                  <p>
                    Telephone: <Strong>01252 749808</Strong><br>
                    Email: <strong>sales@sandhurstautoprint.co.uk</strong>
                  </p>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <b-row class="justify-content-center" v-if="showUsersList">
        <b-col md="10">
          <b-card no-body class="p-4">
            <b-card-body>
              <b-form>
                <h3>User Accounts</h3>
                <p class="text-muted">Select your account to sign in with</p>
                <b-row>
                  <b-col cols="12">
                    <div id="plate-list">
                      <b-table
                        id="userlist-table"
                        class="datalist-table"
                        selectable
                        hover 
                        bordered
                        select-mode="single"                                            
                        :items="usernameList" 
                        :fields="tableFields"
                        @row-clicked="userSelected"
                        responsive="sm"
                        >
                      </b-table>
                    </div>
                  </b-col>
                </b-row>
              </b-form>
            </b-card-body>
          </b-card> 
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import { storeController } from '../../shared/store';
const { ipcRenderer } = require('electron');

export default {
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
      isLoggingIn: false,
      usernameList: [],
      showUsersList: false,
      hasExistingUserList: false,
      tableFields: [
        {key: 'username', label: 'Name', sortable: true},
        {key: 'email', label: 'Email', sortable: true},
      ],
    }
  },
  mounted() {
    ipcRenderer.on('populateUsernameList', (event, content) => {
      this.$nextTick(() => this.populateUserDropdown(content));
    });
  },
  created() {
    // clear any user info
    localStorage.removeItem('user');
    ipcRenderer.send("getUsernameList");
    console.log("list:" ,this.$data.usernameList);
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
            // store the email username/email address 
            ipcRenderer.send("setUsernameInList", {fullName: userObj.firstName + " " + userObj.lastName, email: this.username});
           
            this.$router.push('/');
            this.$data.isLoggingIn = false;
          })
          .catch ((err) => {
            console.error(err);
            this.$data.isLoggingIn = false;
          })
      }
    },
    userSelected(item, index) {
      // grab the user
      let user = this.$data.usernameList.filter((userItem) => {
        console.log(userItem);
        return item.email == userItem.email;
      })[0];

      this.username = user.email;
      console.log("selected user: ", this.username);

      this.$data.showUsersList = false;

    },
    populateUserDropdown(data) {
      if (data != null) {
        this.$data.usernameList = data.map((item) => {
          return {username: item.fullName, email: item.email}; 
        });
        this.$data.hasExistingUserList = true;
      }
    },
    showUsersListClick() {
      this.$data.showUsersList = true;
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
