<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Trade Customer Management</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Customer List</strong>
                        </div>
                        <div v-if="!customersLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="customersLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Trade Customer
                                        </b-button>
                                    </p>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="tableFilter">Filter</label>
                                        <b-form-input v-model="tableFilter" type="text" id="tableFilter"></b-form-input>
                                    </b-form-group>                                    
                                </b-col>                             
                            </b-row>
                            <b-row>
                                <b-col cols="12">
                                    <div id="customer-list">
                                        <!--<c-table :table-data="customerItems" :fields="tableFields" :perPage="10" bordered caption="All Trade Customers"></c-table>-->
                                        <b-table
                                            id="customers-table"
                                            class="datalist-table"
                                            selectable
                                            hover 
                                            bordered
                                            select-mode="single"                                            
                                            :items="customerItems" 
                                            :fields="tableFields"
                                            :filter="tableFilter"
                                            :per-page="perPage"
                                            @row-clicked="rowSelected"
                                            responsive="sm"
                                            >
                                        </b-table>
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col md="6" class="my-1">
                                    <b-pagination
                                    v-model="tableCurrentPage"
                                    :total-rows="tableTotalRows"
                                    :per-page="tablePerPage"
                                    class="my-0"
                                    ></b-pagination>
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
                    <h1>Add New Trade Customer</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card v-if="newCustomer.site_id == 0">
                        <div slot="header">
                            <strong>For which site?</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="area">Area<span class="mandatory">*</span></label>
                                        <b-form-select id="area" v-if="areasLoaded"  v-model="newCustomer.branch_id"
                                            :plain="true"
                                            :options="areas">
                                        </b-form-select>
                                        <div v-if="!areasLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="site">Site<span class="mandatory">*</span></label>
                                        <b-form-select id="site" v-if="sitesLoaded"  v-model="newCustomer.site_id"
                                            :plain="true"
                                            :options="sites">
                                        </b-form-select>
                                        <div v-if="!sitesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Customer Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="website">Company Name<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.supplier_name" type="text" id="website"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="supplierCode">Customer Code</label>
                                        <b-form-input v-model="newCustomer.supplier_code" type="text" id="supplierCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="dvlaLicenceCode">DVLA Licence Code<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.dvla_lic_code" type="text" id="dvlaLicenceCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="dvlaConfirmed">DVLA Code Confirmed</label><br/>
                                        <c-switch class="mx-1" id="dvlaConfirmed"  name="dvlaConfirmed" color="primary" v-model="newCustomer.dvla_confirmed" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="addressPropertyNumber">Property No<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newAddress.property_number" type="text" id="addressPropertyNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="addressPostCode">Post Code<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newAddress.post_code" type="text" id="addressPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="addressAddress1">Address</label>
                                        <b-form-input v-model="newAddress.address1" type="text" id="addressAddress1"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="addressTown">Town</label>
                                        <b-form-input v-model="newAddress.town" type="text" id="addressTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="addressCounty">County</label>
                                        <b-form-select id="addressCounty" v-if="countiesLoaded"  v-model="newAddress.county_id"
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
                                        <label for="addressCountry">Country</label>
                                        <b-form-select id="addressCountry" v-if="countriesLoaded"  v-model="newAddress.country_id"
                                            :plain="true"
                                            :options="countries">
                                        </b-form-select>
                                        <div v-if="!countriesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="contactTitle">Trade Type</label>
                                        <b-form-select id="contactTitle" v-if="contactTitlesLoaded"  v-model="newContact.title_id"
                                            :plain="true"
                                            :options="contactTitles">
                                        </b-form-select>
                                        <div v-if="!contactTitlesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="contactTitle">Franchise Type</label>
                                        <b-form-select id="contactTitle" v-if="contactTitlesLoaded"  v-model="newContact.title_id"
                                            :plain="true"
                                            :options="contactTitles">
                                        </b-form-select>
                                        <div v-if="!contactTitlesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Contact Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactTitle">Title</label>
                                        <b-form-select id="contactTitle" v-if="contactTitlesLoaded"  v-model="newContact.title_id"
                                            :plain="true"
                                            :options="contactTitles">
                                        </b-form-select>
                                        <div v-if="!contactTitlesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactFirstName">First Name<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newContact.first_name" type="text" id="contactFirstName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactLastName">Last Name<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newContact.last_name" type="text" id="contactLastName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactEmail">Email<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newContact.email" type="text" id="contactEmail"></b-form-input>
                                    </b-form-group>                                    
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactPhone">Phone No</label>
                                        <b-form-input v-model="newContact.phone_number" type="text" id="contactPhone"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="website">Website</label>
                                        <b-form-input v-model="newCustomer.website" type="text" id="website"></b-form-input>
                                    </b-form-group>
                                </b-col>              
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptMarketing">Marketing Participation</label><br/>
                                        <c-switch class="mx-1" id="contactOptMarketing"  name="contactOptMarketing" color="primary" v-model="newCustomer.opt_in_marketing" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptResearch">Marketing Research</label><br/>
                                        <c-switch class="mx-1" id="contactOptResearch"  name="contactOptResearch" color="primary" v-model="newCustomer.opt_in_research" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptAnon">Anonymous Statistics</label><br/>
                                        <c-switch class="mx-1" id="contactOptAnon"  name="contactOptAnon" color="primary" v-model="newCustomer.opt_in_anonymously" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <hr />
                            <b-row>
                                <b-col cols="12" sm="12" md="12">
                                    <p>
                                        <b-button v-on:click="saveCustomer" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Save Customer
                                        </b-button>
                                    </p>
                                    <b-alert v-if="saveError" variant="danger" show><strong>Error saving data. Please try again.</strong></b-alert>
                                    <b-alert v-if="saveInProgress" variant="info" show><strong>Saving data. Please wait...</strong></b-alert>
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
import { Switch as cSwitch } from '@coreui/vue';
import cTable from '../../components/table/Table';
import { constants } from 'zlib';

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

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user != null) {
            resolve(user);
        }
        else {
            reject();
        }
        
    });
}

const getStatuses = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getStatusesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.statuses);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getSuppliersList = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("suppliers", headersObj)
            .then((response) => {
                resolve(response.data.suppliers);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getShippingList = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("shipping/getShippingForSelect", headersObj)
            .then((response) => {
                resolve(response.data.shipping);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getSiteList = (($http, areaId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('getSitesForSelect?branch_id=' + areaId, headersObj)
            .then((response) => {
                resolve(response.data.sites);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAreaList = (($http, companyId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
         $http.get('getBranchesForSelect?company_id=' + companyId, headersObj)
            .then((response) => {
                resolve(response.data.branches);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getContactTitles = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getContactTitlesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.contactTitles);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getContactCategories = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getContactCategoriesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.contactCategories);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getContactTypesForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getContactTypesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.contactTypes);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getContactRolesForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getContactRolesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.contactRoles);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getContactMethodsForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getContactMethodsForSelect", headersObj)
            .then((response) => {
                resolve(response.data.contactMethods);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAddressCategories = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getAddressCategoriesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.address_categories);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAddressTypes = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getAddressTypesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.address_types);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAddressCounties = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCountiesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.counties);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getAddressCountries = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCountriesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.countries);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});


export default {
  name: 'suppliers',
  components: {
      LoadingSpinner: LoadingSpinner,
      cSwitch,
      cTable
  },
  data () {
    return {
        newCustomer: {
            supplier_name: "",
            short_name: "",
            company_name: "",
            branch_id: 0,
            site_id: -1,
            website: "",
            status_id: 1,
            dvla_lic_code: "",
            dvla_confirmed: 0,
            dvla_confirmed_date: Date.now(),
            dvla_confirmed_by: 0,
            supplier_code: "",
            is_active: "1",
            contactDetails: {},
            addressDetails: {}
        },
        addMode: false,
        editMode: false,
        allowSave: true,
        saveError: false,
        saveInProgress: false,
        userObj: {},
        wizardGetContactInfo: false,
        wizardGetAddressInfo: false,
        // Customer Information
        areas: [],
        sites: [],
        statuses: [],
        suppliers: [],
        customersLoaded: false,
        areasLoaded: false,
        statusesLoaded: false,
        sitesLoaded: false,
        allowDetailsContinue: false,
        tableFields: [
            {key: 'supplier_name', label: 'Customer', sortable: true},
            {key: 'dvla_lic_code', label: 'DVLA Licence Code', sortable: true},
            {key: 'supplier_code', label: 'Customer Code', sortable: true},
            {key: 'company_name', label: 'Company', sortable: true},
            {key: 'branch.branch_name', label: 'Area', sortable: true},
            {key: 'site.site_name', label: 'Site', sortable: true},
            {key: 'status.status_name', label: 'Status', sortable: true}
        ],
        customerItems: [],
        // Contact Information
        newContact: {
            first_name: "",
            last_name: "",
            title_id: 0,
            phone_number: "",
            mobile_number: "",
            email: "",
            company_name: "",
            contact_type_id: 0,
            contact_category_id: 0,
            contact_method_id: 0,
            contact_role_id: 0,
            opt_in_marketing: 0,
            opt_in_research: 0,
            opt_in_anonymously: 0,
            group_id: 0,
            branch_id: 0,
            site_id: 0,
            is_active: 1
        },
        contactCategories: [],
        contactTypes: [],
        contactMethods: [],
        contactRoles: [],
        contactTitles: [],
        contactCategoriesLoaded: false,
        contactTypesLoaded: false,
        contactMethodsLoaded: false,
        contactRolesLoaded: false,
        contactTitlesLoaded: false,
        allowContactsContinue: false,
        // Address Information
        newAddress: {
            is_default: 1,
            property_number: "",
            address1: "",
            address2: "",
            address3: "",
            address4: "",
            street: "",
            town: "",
            post_code: "",
            delivery_notes: "",
            county_id: 0,
            country_id: 0,
            company_id: 0,
            group_id: 0,
            branch_id: 0,
            site_id: 0,
            address_category_id: 0,
            address_type_id: 0,
            telephone_number: "",
            is_invoice_address: 1,
            is_default_delivery_address: 1,
            is_active: 1
        },
        countries: [],
        counties: [],
        addressCategories: [],
        addressTypes: [],
        countriesLoaded: false,
        countiesLoaded: false,
        addressCategoriesLoaded: false,
        addressTypesLoaded: false
    }
  },
  created () {
    this.getCustomers();
  },
  watch: {
      // Customer details
      'newCustomer.branch_id': function(val, oldVal) {
        if (val < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
            
            // get the sites for the selected branch
            console.log('Go get the list');
            getSiteList(this.$http, val)
                .then((siteList) => {
                    this.$data.sites = siteList;
                })
                .catch ((err) => {
                    console.error(err);
                });
        }
      },
      'newCustomer.site_id': function(val, oldVal) {
        if (val < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.supplier_code': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.short_name': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.status_id': function(val, oldVal) {
        if (val < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.website': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.dvla_lic_code': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      'newCustomer.company_name': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowDetailsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowDetailsContinue = true;
        }
      },
      // Contact information
      'newContact.first_name': function(val, oldVal) {
        if (val.length < 1) {
            this.$data.allowSave = false;
            this.$data.allowContactsContinue = false;
        }
        else {
            this.$data.allowSave = true;
            this.$data.allowContactsContinue = true;
        }
      },

  },
  methods : {
    rowSelected(item, index) {

        // grab the customer. We already have the data in the array
        let customer = this.$data.customerItems.filter((customer_obj) => {
            return customer_obj.id == item.id;
        });

        this.$data.newCustomer = customer.map((customer_obj) => {
            customer_obj.branch_id = customer_obj.branch.id;
            customer_obj.site_id = customer_obj.site.id;
            customer_obj.status_id = customer_obj.status.id;
        })[0];
        

        this.$data.editMode = true;
        this.enterAddMode();
        this.$data.newCustomer = customer[0];
        console.log(customer[0]);

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
    getCustomers() {
        getSuppliersList(this.$http)
            .then((response) => {
                this.$data.customerItems = response.map((element) => {
                    element.company_name = element.company_name ? element.company_name : 'Unknown';
                    return element;
                });
                this.$data.customersLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    exitAddMode() {
        this.$data.addMode = false;
        this.$data.editMode = false;
        this.$data.countriesLoaded = false;
        this.$data.countiesLoaded = false;
        this.$data.addressCategoriesLoaded = false;
        this.$data.addressTypesLoaded = false;
        this.$data.statusesLoaded = false;
        this.$data.sitesLoaded = false;
        this.$data.areasLoaded = false;
        this.$data.contactCategoriesLoaded = false;
        this.$data.contactTypesLoaded = false;
        this.$data.contactMethodsLoaded = false;
        this.$data.contactRolesLoaded = false;
        this.$data.contactTitlesLoaded = false;
        
        this.$data.allowContactsContinue = false;
        this.$data.allowDetailsContinue = false;
        this.$data.wizardGetAddressInfo = false;
        this.$data.wizardGetContactInfo = false;

        // reset the newcustomer object
        
        this.$data.newCustomer.supplier_name = "";
        this.$data.newCustomer.short_name = "";
        this.$data.newCustomer.company_name = "";
        this.$data.newCustomer.branch_id = 0;
        this.$data.newCustomer.site_id = 0;
        this.$data.newCustomer.website = "";
        this.$data.newCustomer.status_id = 0;
        this.$data.newCustomer.dvla_lic_code = "";
        this.$data.newCustomer.dvla_confirmed = false;
        this.$data.newCustomer.dvla_confirmed_date = Date.now();
        this.$data.newCustomer.dvla_confirmed_by = 0;
        this.$data.newCustomer.supplier_code = "";
        this.$data.newCustomer.is_active = "1";
        this.$data.newCustomer.contactDetails = {},
        this.$data.newCustomer.addressDetails = {};


    },
    enterAddMode() {
        this.$data.addMode = true;
        this.$data.allowSave = false;
        // get user and lookup data
        getCurrentUser()
            .then((userDetails) => {
                console.log(userDetails);
                this.$data.userObj = userDetails;
                return getAreaList(this.$http, userDetails.company_id);
            })
            .then((areaList) => {
                this.$data.areas = areaList;
                this.$data.areasLoaded = true;
                if (this.$data.editMode) {
                    return getSiteList(this.$http, this.$data.newCustomer.branch_id);
                }
                else {
                    return getSiteList(this.$http, areaList.area_id);
                }
            })
            .then((siteList) => {
                this.$data.sites = siteList;
                this.$data.sitesLoaded = true;
                return getAddressCounties(this.$http);
            })
            .then((countiesList) => {
                this.$data.counties = countiesList;
                this.$data.countiesLoaded = true;
                return getAddressCountries(this.$http);
            })
            .then((countriesList) => {
                this.$data.countries = countriesList;
                this.$data.countriesLoaded = true;
                return getContactTitles(this.$http);
            })
            .then((titlesList) => {
                this.$data.contactTitles = titlesList;
                this.$data.contactTitlesLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    clearAlerts() {
        this.$data.saveError = false;
        this.$data.saveInProgress = false;
    },
    saveCustomer() {
        this.clearAlerts();
        this.$data.saveInProgress = true;
        let headersObj = this.getHTTPHeaders();

        let dataPostObject = {
            supplier: {
                name: this.$data.newCustomer.supplier_name,
                short: this.$data.newCustomer.short_name,
                branch: this.$data.userObj.branch_id,
                site: this.$data.userObj.site_id,
                website: this.$data.newCustomer.website,
                status: this.$data.newCustomer.status_id,
                dvlaLicCode: this.$data.newCustomer.dvla_lic_code,
                dvlaConfirmed: this.$data.newCustomer.dvla_confirmed,
                code: this.$data.newCustomer.supplier_code
            },
            address: {
                default: this.$data.newAddress.is_default_delivery_address,
                property: this.$data.newAddress.property_number,
                address1: this.$data.newAddress.address1,
                address2: this.$data.newAddress.address2,
                address3: this.$data.newAddress.address3,
                address4: this.$data.newAddress.address4,
                street: this.$data.newAddress.street,
                town: this.$data.newAddress.town,
                postcode: this.$data.newAddress.post_code,
                county: this.$data.newAddress.county_id,
                country: this.$data.newAddress.country_id,
                company: this.$data.newAddress.company_id,
                group: this.$data.newAddress.group_id,
                branch: this.$data.newCustomer.branch_id,
                site: this.$data.newCustomer.site_id,
                telephone: this.$data.newAddress.telephone_number,
                invoiceAddress: this.$data.newAddress.is_invoice_address,
                addressCategory: this.$data.newAddress.address_category_id,
                addressType: this.$data.newAddress.address_type_id
            },
            contact: {
                first: this.$data.newContact.first_name,
                last: this.$data.newContact.last_name,
                title: this.$data.newContact.title_id,
                phone: this.$data.newContact.phone_number,
                mobile: this.$data.newContact.mobile_number,
                email: this.$data.newContact.email,
                company: this.$data.newCustomer.company_name,
                contactType: this.$data.newContact.contact_type_id,
                contactCategory: this.$data.newContact.contact_category_id,
                contactMethod: this.$data.newContact.contact_method_id,
                contactRole:this.$data.newContact.contact_role_id,
                optInMarketing: this.$data.newContact.opt_in_marketing,
                optInResearch: this.$data.newContact.opt_in_research,
                optInAnonymously: this.$data.newContact.opt_in_anonymously,
                group: this.$data.newContact.group_id,
                branch: this.$data.newCustomer.branch_id,
                site: this.$data.newCustomer.site_id,
                is_active: true
            }
        }

        // do the conditional bits...
        if (this.$data.newCustomer.dvla_confirmed) {
            this.$data.newCustomer.dvla_confirmed_date = Date.now();
            this.$data.newCustomer.dvla_confirmed_by = this.$data.userObj.userId;
        }

        
        // first, save the customer
        this.$http.post('suppliers/bulk', {
            supplier: dataPostObject.supplier,
            address: dataPostObject.address,
            contact: dataPostObject.contact
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.saveInProgress = false;
                this.$data.saveError = false;
                if (!this.$data.editMode) {
                    this.$router.push({ name: 'MainDesigner', params: { tcsetup: true, supplierId: response.data.supplier.id } });
                }
            }
            else {
                // data error
                this.$data.saveInProgress = false;
                this.$data.saveError = true;
            }
        })
        .catch ((err) => {
            console.error(err);
            this.$data.saveInProgress = false;
            this.$data.saveError = true;
        });
        
    },
    updateCustomer() {
            
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
            is_active: newActiveStatus
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
    }
  }
}
</script>
