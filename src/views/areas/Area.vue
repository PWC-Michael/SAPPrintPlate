<template>
    <div class="animated fadeIn">
        <div v-if="!addSiteMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <b-button v-on:click="goBack" variant="secondary">
                        <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <h1>{{groupTitle}} - {{areaTitle}}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Area Details</strong>
                        </div>
                        <div v-if="!areaInfoLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="areaInfoLoaded" class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaName">Name</label>
                                        <b-form-input v-model="area.branch_name" type="text" id="areaName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaContactFirstName">Contact First Name</label>
                                        <b-form-input v-model="area.contact_first_name" type="text" id="areaContactFirstName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaContactLastName">Contact Last Name</label>
                                        <b-form-input v-model="area.contact_last_name" type="text" id="areaContactLastName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaEmail">Contact Email</label>
                                        <b-form-input v-model="area.email" type="text" id="areaEmail"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaContactNo">Contact No</label>
                                        <b-form-input v-model="area.contact_no" type="text" id="areaContactNo"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaAddress">Address</label>
                                        <b-form-input v-model="area.address" type="text" id="areaAddress"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaTown">Town</label>
                                        <b-form-input v-model="area.post_town" type="text" id="areaTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaCounty">County</label>
                                        <b-form-select id="areaCounty"  v-model="area.county.id"
                                            :plain="true"
                                            :options="counties">
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaPostCode">Post Code</label>
                                        <b-form-input v-model="area.post_code" type="text" id="areaPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaCountry">Country</label>
                                        <b-form-select id="areaCountry"  v-model="area.country.id"
                                            :plain="true"
                                            :options="countries">
                                        </b-form-select>
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
                                            @size-exceeded="onLogoSizeExceeded"
                                            @file="onLogoFile"
                                            @load="onLogoLoad" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <hr />
                            <b-row>
                                <b-col cols="12" sm="12" md="12">
                                    <p>
                                        <b-button v-on:click="updateArea" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Update Area
                                        </b-button>
                                    </p>
                                    <b-alert v-if="areaSaveSuccess" variant="success" show><strong>Data saved successfully.</strong></b-alert>
                                    <b-alert v-if="areaSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                    <b-alert v-if="areaSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
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
                            <strong>Associated Sites</strong>
                        </div>
                        <div v-if="!sitesLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="sitesLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddSiteMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Site
                                        </b-button>
                                    </p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col v-for="site in sites" cols="12" sm="12" md="6" v-bind:key="site.id">
                                    <b-card :no-body="true" footer-class="px-3 py-2">
                                        <b-card-body class="p-3 clearfix">
                                        <img v-if="site.logo" v-bind:src="site.logo" class="mr-3 float-left" />
                                        <i v-if="!site.logo" :class="getActiveStatusClass(site)" class="fa fa-building-o p-3 font-2xl mr-3 float-left"></i>
                                        <div class="h5 text-warning mb-0 mt-2">{{site.site_name}}</div>
                                        <div class="text-muted text-uppercase font-weight-bold font-xs">{{site.email}} - {{site.contact_no}}</div>
                                        <div class="text-muted text-uppercase font-weight-bold font-xs">Status: {{site.is_active == "1" ? 'Active' : 'Inactive'}}</div>
                                        </b-card-body>
                                        <div slot="footer">
                                        <b-link class="font-weight-bold font-xs btn-block text-muted" v-bind:href="'/#/group/' + groupParamName + '/' + areaParamName + '/' + site.page_slug">View More <i class="fa fa-angle-right float-right font-lg"></i></b-link>
                                        </div>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <div v-if="addSiteMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <b-button v-on:click="exitAddSiteMode" variant="secondary">
                        <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <h1>Add New Site</h1>
                </b-col>
            </b-row>
            <b-row>
            <b-col sm="12">
                <b-card>
                    <div slot="header">
                        <strong>Site Details</strong>
                    </div>
                    <div class="form-container">
                        <b-row>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteName">Name</label>
                                    <b-form-input v-model="newSite.site_name" type="text" id="siteName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteEmail">Contact Email</label>
                                    <b-form-input v-model="newSite.email" type="text" id="siteEmail"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="4">
                                <b-form-group>
                                    <label for="siteContactNo">Contact No</label>
                                    <b-form-input v-model="newSite.contact_no" type="text" id="siteContactNo"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col cols="12" sm="12" md="12">
                                <p>
                                    <b-button v-on:click="saveSite" variant="primary" :disabled="!allowSiteSave">
                                        <i class="fa fa-check"></i>&nbsp;Save Site
                                    </b-button>
                                </p>
                                <b-alert v-if="siteSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                <b-alert v-if="siteSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
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
                    </div>
                </b-card>
            </b-col>
        </b-row>
        </div>
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

const getAreaInfo = (($http, companyId, branchName) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        let area = {};
        $http.get('getBranch?company_id=' + companyId, headersObj)
            .then((response) => {
                console.log(response);
                response.data.branches.forEach(element => {
                    if (element.page_slug == branchName) {
                        area = element;
                    }
                });
                resolve(area);
                console.log(area);
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
        $http.get('company?shortname=' + companyShortName, headersObj)
            .then((response) => {
                let comps = response.data.companies.filter((element) => {
                    return element.company_short_name == companyShortName;
                });
                resolve(comps);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getSites = (($http, companyId, branchId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('getSite?company_id=' + companyId + '&branch_id=' + branchId, headersObj)
            .then((response) => {
                resolve(response.data);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getCounties = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        console.log(headersObj);
        $http.get("getCountiesForSelect", headersObj)
            .then((response) => {
                resolve(response.data);
                console.log(response.data);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getCountries = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCountriesForSelect", headersObj)
            .then((response) => {
                resolve(response.data);
                console.log(response.data);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

export default {
  name: 'area',
  components: {
      LoadingSpinner: LoadingSpinner,
      VueBase64FileUpload
  },
  data () {
    return {
        areaInfoLoaded: false,
        areaSaveSuccess: false,
        areaSaveError: false,
        areaSaveInProgress: false,
        allowSave: true,
        sitesLoaded: false,
        company: {},
        area: {},
        sites: [],
        counties: [],
        countries: [],
        groupTitle: "",
        areaTitle: "",
        groupParamName: "",
        areaParamName: "",
        newSite: {
            site_name: '',
            contact_no: '',
            email: ''
        },
        addSiteMode: false,
        allowSiteSave: true,
        siteSaveError: false,
        siteSaveInProgress: false,
    }
  },
  watch: {
      'area.branch_name': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.contact_no': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.email': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.address': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.post_code': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.county_id': function(val, oldVal) {
        if (val < 1) {
            this.$data.allowSave = false;
        }
        else {
            this.$data.allowSave = true;
        }
      },
      'area.country_id': function(val, oldVal) {
        if (val < 1) {
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
    this.$data.groupParamName = groupParam;
    this.$data.areaParamName = areaParam;
    // get the area data but we need the company data first
    getCounties(this.$http)
        .then((response) => {
            this.$data.counties = response.counties;
            return getCountries(this.$http)
        })
        .then((response) => {
            this.$data.countries = response.countries;
            return getCompanyInfo(this.$http, groupParam);
        })
        .then((companyData) => {
            this.$data.company = companyData[0];
            this.$data.groupTitle = companyData[0].company_name;
            return getAreaInfo(this.$http, companyData[0].id, areaParam);
        })
        .then((areaObj) => {
            this.$data.area = areaObj;
            this.$data.areaInfoLoaded = true;
            this.$data.areaTitle = areaObj.branch_name;
            console.log(areaObj);
            return getSites(this.$http, areaObj.company_id, areaObj.id)
        })
        .then((sitesData) => {
            this.$data.sites = sitesData.sites;
            this.$data.sitesLoaded = true;
        })
        .catch ((err) => {
            console.error(err);
        });
  },
  methods : {
    onLogoFile() {
        console.log('on logo file');
    },
    onLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.area.logo = dataUri;
    },
    onLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    onSiteLogoFile() {
        console.log('on logo file');
    },
    onSiteLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.newSite.logo = dataUri;
    },
    onSiteLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    getActiveStatusClass(site) {
        return site.is_active == "1" ? 'bg-success' : 'bg-danger';
    },
    goBack() {
        this.$router.go(-1);
    },
    clearAlerts() {
        this.$data.areaSaveSuccess = false;
        this.$data.areaSaveError = false;
        this.$data.areaSaveInProgress = false;
    },
    exitAddSiteMode() {
        this.$data.addSiteMode = false;
    },
    enterAddSiteMode() {
        this.$data.addSiteMode = true;
        this.$data.allowSiteSave = true;
    },
    updateArea() {
        this.clearAlerts();
        this.$data.areaSaveInProgress = true;
        let headersObj = getHTTPHeaders();
        this.$http.post('updateBranch', {
            id: this.$data.area.id,
            branch_name: this.$data.area.branch_name,
            contact_first_name: this.$data.area.contact_first_name,
            contact_last_name: this.$data.area.contact_last_name,
            contact_no: this.$data.area.contact_no,
            email: this.$data.area.email,
            address: this.$data.area.address,
            post_code: this.$data.area.post_code,
            post_town: this.$data.area.post_town,
            county_id: this.$data.area.county.id,
            country_id: this.$data.area.country.id,
            logo: this.$data.area.logo
        }, headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.areaSaveInProgress = false;
                this.$data.areaSaveSuccess = true;
                console.log('yay');
            }
        })
        .catch ((err) => {
            console.error(err);
            this.$data.areaSaveInProgress = false;
            this.$data.areaSaveError = false;
        });
    },
    saveSite() {
        this.clearAlerts();
        this.$data.siteSaveInProgress = true;
        let headersObj = getHTTPHeaders();
        console.log(headersObj);
        this.$http.post('createSite', {
            site_name: this.$data.newSite.site_name,
            contact_no: this.$data.newSite.contact_no,
            email: this.$data.newSite.email,
            branch_id: this.$data.area.id,
            company_id: this.$data.company.id,
            logo: this.$data.newSite.logo
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.siteSaveInProgress = false;
                this.$data.siteSaveError = false;
            }
            else {
                // data error
                this.$data.siteSaveInProgress = false;
                this.$data.siteSaveError = true;
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