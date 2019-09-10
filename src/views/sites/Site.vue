<template>
    <div class="animated fadeIn">
        <b-row>
            <b-col cols="12">
                <b-button v-on:click="goBack" variant="secondary">
                    <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <h1 v-if="siteInfoLoaded">{{groupTitle}} - {{areaTitle}} - {{siteTitle}}</h1>
                <h1 v-if="!siteInfoLoaded"></h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12">
                <b-card>
                    <div slot="header">
                        <strong>Site Details</strong>
                    </div>
                    <div v-if="!siteInfoLoaded" class="form-container">
                        <LoadingSpinner />
                    </div>
                    <div v-if="siteInfoLoaded" class="form-container">
                        <b-row>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteName">Name</label>
                                    <b-form-input v-model="site.site_name" type="text" id="siteName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteEmail">Contact Email</label>
                                    <b-form-input v-model="site.email" type="text" id="siteEmail"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteContactNo">Contact No</label>
                                    <b-form-input v-model="site.contact_no" type="text" id="siteContactNo"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="areaLogo">Upload Logo</label>
                                    <vue-base64-file-upload 
                                        class="v1"
                                        accept="image/png,image/jpeg"
                                        image-class="image-upload-display"
                                        input-class="form-control"
                                        :max-size="1"
                                        @size-exceeded="onSiteLogoSizeExceeded"
                                        @file="onSiteLogoFile"
                                        @load="onSiteLogoLoad" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col cols="12" sm="12" md="12">
                                <p>
                                    <b-button v-on:click="updateSite" variant="primary" :disabled="!allowSave">
                                        <i class="fa fa-check"></i>&nbsp;Update Site
                                    </b-button>
                                </p>
                                <b-alert v-if="siteSaveSuccess" variant="success" show><strong>Data saved successfully.</strong></b-alert>
                                <b-alert v-if="siteSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                <b-alert v-if="siteSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="12">
                <b-card>
                    <div slot="header">
                        <strong>Associated Users</strong>
                    </div>
                    <div v-if="!usersLoaded" class="form-container">
                        <LoadingSpinner />
                    </div>
                    <div v-if="usersLoaded" class="form-container">
                        <b-row>
                            <b-col cols="12" sm="12" md="6">
                                <p>
                                    <b-button variant="primary">
                                        <i class="fa fa-plus"></i>&nbsp;Add User
                                    </b-button>
                                </p>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col v-for="user in users" cols="12" sm="12" md="6" v-bind:key="user.id">
                                <b-card :no-body="true" footer-class="px-3 py-2">
                                    <b-card-body class="p-3 clearfix">
                                    <i :class="getActiveStatusClass(user)" class="fa fa-user p-3 font-2xl mr-3 float-left"></i>
                                    <div class="h5 text-warning mb-0 mt-2">{{user.first_name}} {{user.last_name}}</div>
                                    <div class="text-muted text-uppercase font-weight-bold font-xs">{{user.email}}</div>
                                    <div class="text-muted text-uppercase font-weight-bold font-xs">Status: {{user.approved == "1" ? 'Active' : 'Inactive'}}</div>
                                    </b-card-body>
                                    <div slot="footer">
                                    <b-link class="font-weight-bold font-xs btn-block text-muted" v-bind:href="'/#/users/' + user.is_active">View More <i class="fa fa-angle-right float-right font-lg"></i></b-link>
                                    </div>
                                </b-card>
                            </b-col>
                        </b-row>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>

<script>

import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner';
import { Promise } from 'q';
import { constants } from 'fs';
import VueBase64FileUpload from 'vue-base64-file-upload';

const getHTTPHeaders = () => {
    let userObj = JSON.parse(localStorage.getItem('user'));
    let headerConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': userObj.token,
        }
    }
    return headerConfig;
}

const getAreaInfo = (($http, companyId, pageSlug) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        let area = {};
         $http.get('getBranch?company_id=' + companyId, headersObj)
            .then((response) => {
                response.data.branches.forEach(element => {
                    if (element.page_slug == pageSlug) {
                        area = element;
                    }
                });
                resolve(area);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getCompanyInfo = (($http, companyShortName) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('company?shortName=' + companyShortName, headersObj)
            .then((response) => {
                resolve(response.data.companies);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getSiteInfo = (($http, companyId, branchId, pageSlug) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        let site = {};
        $http.get('getSite?company_id=' + companyId + '&branch_id=' + branchId, headersObj)
            .then((response) => {
                response.data.sites.forEach(element => {
                    if (element.page_slug == pageSlug) {
                        site = element;
                    }
                });
                resolve(site);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getUsers = (($http, siteId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('users?filters[site_id]=' + siteId, headersObj)
            .then((response) => {
                resolve(response.data);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

export default {
  name: 'site',
  components: {
      LoadingSpinner: LoadingSpinner,
      VueBase64FileUpload
  },
  data () {
    return {
        siteInfoLoaded: false,
        siteSaveSuccess: false,
        siteSaveError: false,
        siteSaveInProgress: false,
        allowSave: true,
        usersLoaded: false,
        company: {},
        area: {},
        site: {},
        users: [],
        groupTitle: "",
        siteTitle: "",
        areaTitle: "",
        groupParamName: "",
        siteParamName: ""
    }
  },
  watch: {
      'site.branch_name': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'site.contact_no': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'site.email': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      }
  },
  created () {
    const groupParam = this.$route.params.groupshortname;
    const areaParam = this.$route.params.areaname;
    const siteParam = this.$route.params.sitename;
    this.$data.groupParamName = groupParam;
    this.$data.siteParamName = siteParam;
    this.$data.areaParam = areaParam;
    // get the site data but we need the company data first
    getCompanyInfo(this.$http, groupParam)
        .then((companyData) => {
            console.log(companyData);
            this.$data.company = companyData[0];
            this.$data.groupTitle = companyData[0].company_name;
            return getAreaInfo(this.$http, companyData[0].id, areaParam);
        })
        .then((areaObj) => {
            this.$data.area = areaObj;
            this.$data.areaInfoLoaded = true;
            this.$data.areaTitle = areaObj.branch_name;
            return getSiteInfo(this.$http, areaObj.company_id, areaObj.id, siteParam)
        })
        .then((siteData) => {
            this.$data.site = siteData;
            this.$data.siteTitle = siteData.site_name;
            this.$data.siteInfoLoaded = true;
            return getUsers(this.$http, siteData.id)
        })
        .then((usersData) => {
            console.log(usersData);
            this.$data.usersLoaded = true;
            this.$data.users = usersData;
        })
        .catch ((err) => {
            console.error(err);
        });
  },
  methods : {
    onSiteLogoFile() {
        console.log('on logo file');
    },
    onSiteLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.site.logo = dataUri;
    },
    onSiteLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    getActiveStatusClass(user) {
        return user.approved == "1" ? 'bg-success' : 'bg-danger';
    },
    goBack() {
        this.$router.go(-1);
    },
    clearAlerts() {
        this.$data.siteSaveSuccess = false;
        this.$data.siteSaveError = false;
        this.$data.siteSaveInProgress = false;
    },
    updateSite() {
        this.clearAlerts();
        this.$data.siteSaveInProgress = true;
        let headersObj = getHTTPHeaders();
        this.$http.post('updateSite', {
            id: this.$data.site.id,
            site_name: this.$data.site.site_name,
            contact_no: this.$data.site.contact_no,
            email: this.$data.site.email,
            company_id: this.$data.company.id,
            branch_id: this.$data.area.id,
            logo: this.$data.site.logo
        }, headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.siteSaveInProgress = false;
                this.$data.siteSaveSuccess = true;
                console.log('yay');
            }
        })
        .catch ((err) => {
            console.error(err);
            this.$data.siteSaveInProgress = false;
            this.$data.siteSaveError = false;
        });
    }
  }
}
</script>