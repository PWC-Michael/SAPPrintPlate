<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Groups Management</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>All Groups</strong>
                        </div>
                        <div v-if="!groupsLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="groupsLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Group
                                        </b-button>
                                    </p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col v-for="group in groups" cols="12" sm="6" md="6" v-bind:key="group.id">
                                    <b-card :no-body="true" footer-class="px-3 py-2">
                                        <b-card-body class="p-3 clearfix">
                                            <img v-if="group.logo" v-bind:src="group.logo" class="mr-3 float-left" />
                                            <i v-if="!group.logo" v-on:click="confirmActiveState(group.id)" :class="getActiveStatusClass(group)" class="fa fa-bank p-3 font-2xl mr-3 float-left clickElement"></i>
                                            <div class="h5 text-warning mb-0">{{group.company_name}}</div>
                                            <div class="text-muted text-uppercase font-weight-bold font-xs">{{group.company_short_name}}</div>
                                            <div class="text-muted text-uppercase font-weight-bold font-xs">Status: {{group.is_active == "1" ? 'Active' : 'Inactive'}}</div>
                                        </b-card-body>
                                        <div slot="footer">
                                            <b-link class="font-weight-bold font-xs btn-block text-muted" v-bind:href="'/#/group/' + group.company_short_name">View More <i class="fa fa-angle-right float-right font-lg"></i></b-link>
                                        </div>
                                    </b-card>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <div v-if="addMode" class="addMode">
            <b-row>
                <b-col cols="12">
                    <b-button v-on:click="exitAddMode" variant="secondary">
                        <i class="fa fa-arrow-circle-left"></i>&nbsp;Back
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <h1>Add New Group</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Group Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupName">Name</label>
                                        <b-form-input v-model="newGroup.company_name" type="text" id="groupName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupShortName">Short Name</label>
                                        <b-form-input v-model="newGroup.company_short_name" type="text" id="groupShortName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupSubDomain">Sub-domain</label>
                                        <b-form-input v-model="newGroup.sub_domain" type="text" id="groupSubDomain"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupContactNumber">Main Contact Number</label>
                                        <b-form-input v-model="newGroup.main_contact_number" type="text" id="groupContactNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="groupEmail">Main Email Address</label>
                                        <b-form-input v-model="newGroup.main_email" type="text" id="groupEmail"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12">
                                    <b-form-group>
                                        <label for="groupAddress">Address</label>
                                        <b-form-input v-model="newGroup.main_address" type="text" id="groupAddress"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupTown">Town</label>
                                        <b-form-input v-model="newGroup.main_town" type="text" id="groupTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupPostCode">Post Code</label>
                                        <b-form-input v-model="newGroup.main_post_code" type="text" id="groupPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupCounty">County</label>
                                        <b-form-select id="groupCounty" v-if="countiesLoaded"  v-model="newGroup.county_id"
                                            :plain="true"
                                            :options="counties">
                                        </b-form-select>
                                        <div v-if="!countiesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupCountry">Country</label>
                                        <div v-if="!countriesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                        <b-form-select id="groupCountry" v-if="countriesLoaded" v-model="newGroup.country_id"
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
                                        <b-form-input v-model="newGroup.licence_id" type="text" id="groupLicence"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupIsSAP">SAP group?</label><br/>
                                        <c-switch class="mx-1" id="groupIsSAP"  name="groupIsSAP" color="primary" v-model="newGroup.is_sap" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="groupIsActive">Is Active?</label><br />
                                        <c-switch class="mx-1" id="groupIsActive"  name="groupIsActive" color="primary" v-model="newGroup.is_active" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="groupLogo">Upload Logo</label>
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
                                        <b-button v-on:click="saveGroup" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Save Group
                                        </b-button>
                                    </p>
                                    <b-alert v-if="groupSaveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                    <b-alert v-if="groupSaveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <!-- modal -->
        <b-modal title="Confirm Active Status Change" class="modal-warning" v-model="activeStateModal" @ok="toggleActiveState" ok-variant="warning">
            <p>
                Are you sure you wish to change the active status?
            </p>
            <p>
                Continuing will also changes the status of all areas, sites and users under this group.
            </p>
        </b-modal>
    </div>
</template>

<script>

import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner';
import { Switch as cSwitch } from '@coreui/vue';
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

const getCounties = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCountiesForSelect", headersObj)
            .then((response) => {
                resolve(response.data);
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
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

export default {
  name: 'groups',
  components: {
      LoadingSpinner: LoadingSpinner,
      cSwitch,
      VueBase64FileUpload
  },
  data () {
    return {
      groups: [],
      counties: [],
      countries: [],
      newGroup: {
        company_name: "",
        company_short_name: "",
        country_id: 0,
        county_id: 0,
        is_active: "1",
        is_sap: "1",
        licence_id: "0",
        main_address: "",
        main_contact_number: "",
        main_email: "",
        main_post_code: "",
        main_town: "",
        sub_domain: "",
        logo: ''
      },
      groupsLoaded: false,
      countiesLoaded: false,
      countriesLoaded: false,
      addMode: false,
      allowSave: true,
      groupSaveError: false,
      groupSaveInProgress: false,
      userObj: {},
      activeStateModal: false,
      groupIdToChangeActiveStatus: 0
    }
  },
  created () {
    this.getCompanyData();
  },
  methods : {
    onLogoFile() {
        console.log('on logo file');
    },
    onLogoLoad(dataUri) {
        console.log('on logo load');
        this.$data.newGroup.logo = dataUri;
    },
    onLogoSizeExceeded() {
        console.log('on logo exceed');
    },
    getActiveStatusClass(group) {
        return group.is_active == "1" ? 'bg-success' : 'bg-danger';
    },
    getHTTPHeaders() {
        let headerConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'AuthHeader': this.$data.userObj.token,
            }
        }
        return headerConfig;
    },
    getCompanyData() {
        this.$data.userObj = JSON.parse(localStorage.getItem('user'));
        let headersObj = getHTTPHeaders();
        this.$http.get('company', headersObj)
            .then((response) => {
                this.$data.groups = response.data.companies;
                this.$data.groupsLoaded = true;
                console.log(this.$data.groups);
            })
            .catch ((err) => {
                console.error(err);
            })
    },
    exitAddMode() {
        this.$data.addMode = false;
        this.$data.countiesLoaded = false;
        this.$data.countriesLoaded = false;
    },
    enterAddMode() {
        this.$data.addMode = true;
        this.$data.allowSave = false;
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
                this.$data.allowSave = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    clearAlerts() {
        this.$data.groupSaveError = false;
        this.$data.groupSaveInProgress = false;
    },
    saveGroup() {
        this.clearAlerts();
        this.$data.groupSaveInProgress = true;
        let headersObj = this.getHTTPHeaders();
        console.log(headersObj);
        this.$http.post('createCompany', {
            company_name: this.$data.newGroup.company_name,
            company_short_name: this.$data.newGroup.company_short_name,
            main_contact_number: this.$data.newGroup.main_contact_number,
            main_email: this.$data.newGroup.main_email,
            main_address: this.$data.newGroup.main_address,
            main_post_code: this.$data.newGroup.main_post_code,
            main_town: this.$data.newGroup.main_town,
            county_id: this.$data.newGroup.county_id,
            country_id: this.$data.newGroup.country_id,
            sub_domain: this.$data.newGroup.sub_domain,
            licence_id: this.$data.newGroup.licence_id,
            is_sap: this.$data.newGroup.is_sap,
            is_active: this.$data.newGroup.is_active,
            logo: this.$data.newGroup.logo
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.groupSaveInProgress = false;
                this.$data.groupSaveError = false;
            }
            else {
                // data error
                this.$data.groupSaveInProgress = false;
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
    updateGroup() {
            
            // get the company data
            let company = {};

            this.$data.groups.forEach((element) => {
                if (element.id == this.$data.groupIdToChangeActiveStatus) {
                    company = element;
                }
            });

            let newActiveStatus = 0;
            if (company.is_active == 0) {
                newActiveStatus = 1;
            }
            
            let headersObj = getHTTPHeaders();
            this.$http.post('updateCompany', {
                id: company.id,
                company_name: company.company_name,
                company_short_name: company.company_short_name,
                main_contact_number: company.main_contact_number,
                main_email: company.main_email,
                main_address: company.main_address,
                main_post_code: company.main_post_code,
                main_town: company.main_town,
                county_id: company.county.id,
                country_id: company.country.id,
                sub_domain: company.sub_domain,
                licence_id: company.licence_id,
                is_sap: company.is_sap,
                is_active: newActiveStatus,
                logo: company.logo
            },
            headersObj)
            .then((response) => {
                console.log('Done!');
                // update to re-render view
                this.getCompanyData();
            })
            .catch ((err) => {
                console.error(err);
                this.$data.activeStateModal = false;
            });
        },
    confirmActiveState(groupId) {
        // get confirmation of active/inactive

        this.$data.groupIdToChangeActiveStatus = groupId;
        this.$data.activeStateModal = true;

    },
    toggleActiveState() {
        // marks the company active or inactive
        // plus all that is under it is marked active/inactive

        this.$data.activeStateModal = false;
        this.updateGroup();
    }
  }
}
</script>
