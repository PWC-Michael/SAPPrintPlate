<template>
    <div class="animated fadeIn">
        <div v-if="!addAreaMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <b-button v-on:click="goBack" variant="secondary">
                        <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <h1>{{groupTitle}} - {{groupParamName}}</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Group Details</strong>
                        </div>
                        <div v-if="!groupInfoLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="groupInfoLoaded" class="form-container">
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupName">Name</label>
                                        <b-form-input v-model="group.company_name" type="text" id="groupName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupShortName">Short Name</label>
                                        <b-form-input v-model="group.company_short_name" type="text" id="groupShortName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupSubDomain">Sub-domain</label>
                                        <b-form-input v-model="group.sub_domain" type="text" id="groupSubDomain"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupContactNumber">Main Contact Number</label>
                                        <b-form-input v-model="group.main_contact_number" type="text" id="groupContactNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupEmail">Main Email Address</label>
                                        <b-form-input v-model="group.main_email" type="text" id="groupEmail"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12">
                                    <b-form-group>
                                        <label for="groupAddress">Address</label>
                                        <b-form-input v-model="group.main_address" type="text" id="groupAddress"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupTown">Town</label>
                                        <b-form-input v-model="group.main_town" type="text" id="groupTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupPostCode">Post Code</label>
                                        <b-form-input v-model="group.main_post_code" type="text" id="groupPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupCounty">County</label>
                                        <b-form-select id="groupCounty" v-model="group.county.id"
                                            :plain="true"
                                            :options="counties">
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupCountry">Country</label>
                                        <b-form-select id="groupCountry" v-model="group.country.id"
                                            :plain="true"
                                            :options="countries">
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupLicence">Licence</label>
                                        <b-form-input v-model="group.licence_id" type="text" id="groupLicence"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupIsSAP">SAP group?</label><br/>
                                        <c-switch class="mx-1" id="groupIsSAP"  name="groupIsSAP" color="primary" v-model="group.is_sap" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupIsActive">Is Active?</label><br />
                                        <c-switch class="mx-1" id="groupIsActive"  name="groupIsActive" color="primary" v-model="group.is_active" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
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
                                            @size-exceeded="onGroupLogoSizeExceeded"
                                            @file="onGroupLogoFile"
                                            @load="onGroupLogoLoad" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <hr />
                            <b-row>
                                <b-col cols="12" sm="12" md="12">
                                    <p>
                                        <b-button v-on:click="updateGroup" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Update Group
                                        </b-button>
                                    </p>
                                    <b-alert v-if="groupSaveSuccess" variant="success" show><strong>Data saved successfully.</strong></b-alert>
                                    <b-alert v-if="groupSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                    <b-alert v-if="groupSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
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
                            <strong>Associated Areas</strong>
                        </div>
                        <div v-if="!areasLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="areasLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddAreaMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Area
                                        </b-button>
                                    </p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col v-for="area in areas" cols="12" sm="12" md="6" v-bind:key="area.id">
                                    <b-card :no-body="true" footer-class="px-3 py-2">
                                        <b-card-body class="p-3 clearfix">
                                            <img v-if="area.logo" v-bind:src="area.logo" class="mr-3 float-left" />
                                            <i v-if="!area.logo" :class="getActiveStatusClass(area)" class="fa fa-map-o p-3 font-2xl mr-3 float-left"></i>
                                            <div class="h5 text-warning mb-0 mt-2">{{area.branch_name}}</div>
                                            <div class="text-muted text-uppercase font-weight-bold font-xs">{{area.address}}, {{area.post_code}}</div>
                                            <div class="text-muted text-uppercase font-weight-bold font-xs">Status: {{area.is_active == "1" ? 'Active' : 'Inactive'}}</div>
                                        </b-card-body>
                                        <div slot="footer">
                                            <b-link class="font-weight-bold font-xs btn-block text-muted" v-bind:href="'/#/group/' + groupParamName + '/' + area.page_slug">View More <i class="fa fa-angle-right float-right font-lg"></i></b-link>
                                        </div>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <div v-if="addAreaMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <b-button v-on:click="exitAddAreaMode" variant="secondary">
                        <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <h1>Add New Area</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Area Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaName">Name</label>
                                        <b-form-input v-model="newArea.branch_name" type="text" id="areaName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaContactFirstName">Contact First Name</label>
                                        <b-form-input v-model="newArea.contact_first_name" type="text" id="areaContactFirstName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaContactLastName">Contact Last Name</label>
                                        <b-form-input v-model="newArea.contact_last_name" type="text" id="areaContactLastName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaEmail">Contact Email</label>
                                        <b-form-input v-model="newArea.email" type="text" id="areaEmail"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaContactNo">Contact No</label>
                                        <b-form-input v-model="newArea.contact_no" type="text" id="areaContactNo"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaAddress">Address</label>
                                        <b-form-input v-model="newArea.address" type="text" id="areaAddress"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="areaTown">Town</label>
                                        <b-form-input v-model="newArea.post_town" type="text" id="areaTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaCounty">County</label>
                                        <div v-if="!countiesLoaded">
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                        <b-form-select id="areaCounty" v-if="countiesLoaded" v-model="newArea.county_id"
                                            :plain="true"
                                            :options="counties">
                                        </b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaPostCode">Post Code</label>
                                        <b-form-input v-model="newArea.post_code" type="text" id="areaPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="areaCountry">Country</label>
                                        <div v-if="!countriesLoaded">
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                        <b-form-select id="areaCountry" v-if="countriesLoaded" v-model="newArea.country_id"
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
                                        <b-button v-on:click="saveArea" variant="primary" :disabled="!allowAreaSave">
                                            <i class="fa fa-check"></i>&nbsp;Save Area
                                        </b-button>
                                    </p>
                                    <b-alert v-if="areaSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                    <b-alert v-if="areaSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
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
import { Switch as cSwitch } from '@coreui/vue'
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

const getCompanyInfo = (($http, shortname) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
         $http.get('company?shortName=' + shortname, headersObj)
            .then((response) => {
                let comps = response.data.companies.filter((element) => {
                    return element.company_short_name == shortname;
                });
                resolve(comps);
                console.log(comps);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getCompanyInfoById = (($http, companyId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('company?id=' + companyId, headersObj)
            .then((response) => {
                resolve(response.data.companies[0]);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAreas = (($http, companyId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
         $http.get('getBranch?company_id=' + companyId, headersObj)
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

const getParams = (($http, $route) => {
    return new Promise((resolve, reject) => {
        let groupParam = $route.params.groupshortname;
        if (groupParam === undefined) {
            let userObj = JSON.parse(localStorage.getItem('user'));
            getCompanyInfoById($http, userObj.company_id)
                .then((company) => {
                    groupParam = company.company_short_name;
                    resolve(groupParam);
                })
                .catch ((err) => {
                    console.error(err);
                    reject(err);
                });
        }
        else {
            resolve(groupParam);
        }
    });
});

export default {
    name: 'group',
  
    components: {
        LoadingSpinner: LoadingSpinner,
        cSwitch,
        VueBase64FileUpload
    },
    watch: {
        'group.is_sap': function(val, oldVal) {
            console.log(val);
        }
    },
  data () {
    return {
        groupInfoLoaded: false,
        groupSaveSuccess: false,
        groupSaveError: false,
        groupSaveInProgress: false,
        allowSave: true,
        areasLoaded: false,
        group: {},
        areas: [],
        counties: [],
        countries: [],
        groupTitle: "",
        groupParamName: "",
        newArea: {
            branch_name: '',
            contact_first_name: '',
            contact_last_name: '',
            contact_no: '',
            email: '',
            address: '',
            post_code: '',
            post_town: '',
            county_id: 0,
            country_id: 0,
            logo: null
        },
        addAreaMode: false,
        countiesLoaded: false,
        countriesLoaded: false,
        allowAreaSave: true,
        areaSaveError: false,
        areaSaveInProgress: false,
    }
  },
  created () {
    getParams(this.$http, this.$route)
        .then((params) => {
            this.$data.groupParamName = params;
            console.log(params);
            return getCounties(this.$http);
        })
        .then((response) => {
            this.$data.counties = response.counties;
            return getCountries(this.$http)
        })
        .then((response) => {
            this.$data.countries = response.countries;
            return getCompanyInfo(this.$http, this.$data.groupParamName);
        })
        .then((companyData) => {
            this.$data.group = companyData[0];
            this.$data.groupTitle = companyData[0].company_name;
            this.$data.groupInfoLoaded = true;
            return getAreas(this.$http, companyData[0].id);
        })
        .then((areaData) => {
            this.$data.areas = areaData.branches;
            this.$data.areasLoaded = true;
        })
        .catch ((err) => {
            console.error(err);
        });
  },
  methods : {
    onGroupLogoFile() {
        console.log('on logo file');
    },
    onGroupLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.group.logo = dataUri;
    },
    onGroupLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    onLogoFile() {
        console.log('on logo file');
    },
    onLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.newArea.logo = dataUri;
    },
    onLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    getActiveStatusClass(area) {
        return area.is_active == "1" ? 'bg-success' : 'bg-danger';
    },
    goBack() {
        this.$router.go(-1);
    },
    clearAlerts() {
        this.$data.groupSaveSuccess = false;
        this.$data.groupSaveError = false;
        this.$data.groupSaveInProgress = false;
    },
    exitAddAreaMode() {
        this.$data.addAreaMode = false;
        this.$data.countiesLoaded = false;
        this.$data.countriesLoaded = false;
    },
    enterAddAreaMode() {
        this.$data.addAreaMode = true;
        this.$data.allowAreaSave = false;
        // get the counties and countries data
        getCounties(this.$http)
            .then((response) => {
                this.$data.counties = response.counties;
                this.$data.countiesLoaded = true;
                return getCountries(this.$http)
            })
            .then((response) => {
                this.$data.countries = response.countries;
                this.$data.countriesLoaded = true;
                this.$data.allowAreaSave = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    updateGroup() {
        this.clearAlerts();
        this.$data.groupSaveInProgress = true;
        let headersObj = getHTTPHeaders();
        this.$http.post('updateCompany', {
            id: this.$data.group.id,
            company_name: this.$data.group.company_name,
            company_short_name: this.$data.group.company_short_name,
            main_contact_number: this.$data.group.main_contact_number,
            main_email: this.$data.group.main_email,
            main_address: this.$data.group.main_address,
            main_post_code: this.$data.group.main_post_code,
            main_town: this.$data.group.main_town,
            county_id: this.$data.group.county.id,
            country_id: this.$data.group.country.id,
            sub_domain: this.$data.group.sub_domain,
            licence_id: this.$data.group.licence_id,
            is_sap: this.$data.group.is_sap,
            is_active: this.$data.group.is_active,
            logo: this.$data.group.logo
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.groupSaveInProgress = false;
                this.$data.groupSaveSuccess = true;
                this.$data.groupSaveError = false;
            }
            else {
                // data error
                this.$data.groupSaveInProgress = false;
                this.$data.groupSaveSuccess = false;
                this.$data.groupSaveError = true;
            }
        })
        .catch ((err) => {
            console.error(err);
            this.$data.groupSaveInProgress = false;
            this.$data.groupSaveSuccess = false;
            this.$data.groupSaveError = false;
        });
    },
    saveArea() {
        this.clearAlerts();
        this.$data.areaSaveInProgress = true;
        let headersObj = getHTTPHeaders();
        console.log(headersObj);
        this.$http.post('createBranch', {
            branch_name: this.$data.newArea.branch_name,
            company_id: this.$data.group.id,
            contact_first_name: this.$data.newArea.contact_first_name,
            contact_last_name: this.$data.newArea.contact_last_name,
            contact_no: this.$data.newArea.contact_no,
            email: this.$data.newArea.email,
            address: this.$data.newArea.address,
            post_code: this.$data.newArea.post_code,
            post_town: this.$data.newArea.post_town,
            county_id: this.$data.newArea.county_id,
            country_id: this.$data.newArea.country_id,
            logo: this.$data.newArea.logo
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.areaSaveInProgress = false;
                this.$data.areaSaveError = false;
            }
            else {
                // data error
                this.$data.areaSaveInProgress = false;
                this.$data.areaSaveError = true;
            }
        })
        .catch ((err) => {
            console.error(err);
            this.$data.areaSaveInProgress = false;
            this.$data.areaSaveError = false;
        });
    }
  }
}
</script>