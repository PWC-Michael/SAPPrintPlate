<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Retail Customer Management</h1>
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
                                <b-col cols="12">
                                    <div id="customer-list">
                                        <c-table :table-data="customerItems" :fields="tableFields" bordered caption="All Retail Customers"></c-table>
                                    </div>
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
                    <h1>Add New Retail Customer</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Contact Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactTitle">Title<span class="mandatory">*</span></label>
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
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="contactEmail">Email<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newContact.email" type="text" id="contactEmail"></b-form-input>
                                    </b-form-group>                                    
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="contactPhone">Phone No</label>
                                        <b-form-input v-model="newContact.phone_number" type="text" id="contactPhone"></b-form-input>
                                    </b-form-group>
                                </b-col>                                
                            </b-row>
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Address Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressPropertyNumber">Property No<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newAddress.property_number" type="text" id="addressPropertyNumber"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressAddress1">Address<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newAddress.address1" type="text" id="addressAddress1"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressTown">Town<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newAddress.town" type="text" id="addressTown"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressPostCode">Post Code</label>
                                        <b-form-input v-model="newAddress.post_code" type="text" id="addressPostCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressCounty">County<span class="mandatory">*</span></label>
                                        <b-form-select id="addressCounty" v-if="countiesLoaded"  v-model="newAddress.county_id"
                                            :plain="true"
                                            :options="counties">
                                        </b-form-select>
                                        <div v-if="!countiesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="addressCountry">Country<span class="mandatory">*</span></label>
                                        <b-form-select id="addressCountry" v-if="countriesLoaded"  v-model="newAddress.country_id"
                                            :plain="true"
                                            :options="countries">
                                        </b-form-select>
                                        <div v-if="!countriesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Proof of Identity/Entitlement</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="proofOfId">Proof of Identity<span class="mandatory">*</span></label>
                                        <b-form-select id="proofOfId" v-if="proofOfIdsLoaded"  v-model="newCustomer.proof_of_id"
                                            :plain="true"
                                            :options="proofOfIds">
                                        </b-form-select>
                                        <div v-if="!proofOfIdsLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="proofOfIdRef">Identity Reference<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.proof_of_id_ref" type="text" id="proofOfIdRef"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label>Capture Identity Image<span class="mandatory">*</span> (Or <span class="switch">Upload here</span>)</label>
                                        <vue-base64-file-upload
                                            v-if="isIdentityUploadSelected" 
                                            class="v1"
                                            accept="image/png,image/jpeg"
                                            image-class="image-upload-display"
                                            input-class="form-control"
                                            :max-size="2"
                                            @size-exceeded="onIdSizeExceeded"
                                            @file="onIdFile"
                                            @load="onIdLoad" />

                                        <div v-if="!isIdentityUploadSelected" class="capture-image-div">
                                            <img v-if="isIdentityCaptureComplete" src="" class="image-upload-display" />
                                            <div class="vue-base64-file-upload-wrapper" style="position: relative; width: 100%;">
                                                <input type="text" v-on:click="toggleImageCaptureModal()" placeholder="Click here to capture image" readonly class="form-control" style="width: 100%; cursor: pointer;">
                                            </div>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="identityDescription">Upload Identity Proof<span class="mandatory">*</span></label>
                                        <vue-base64-file-upload 
                                            class="v1"
                                            accept="image/png,image/jpeg"
                                            image-class="image-upload-display"
                                            input-class="form-control"
                                            :max-size="2"
                                            @size-exceeded="onIdSizeExceeded"
                                            @file="onIdFile"
                                            @load="onIdLoad" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="identityDescription">Capture Identity Proof Image<span class="mandatory">*</span></label>
                                        <vue-base64-file-upload 
                                            class="v1"
                                            accept="image/png,image/jpeg"
                                            image-class="image-upload-display"
                                            input-class="form-control"
                                            :max-size="2"
                                            @size-exceeded="onIdSizeExceeded"
                                            @file="onIdFile"
                                            @load="onIdLoad" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="proofOfEntitlement">Proof of Entitlement<span class="mandatory">*</span></label>
                                        <b-form-select id="proofOfEntitlement" v-if="proofOfEntitlementLoaded"  v-model="newCustomer.proof_of_entitlement"
                                            :plain="true"
                                            :options="proofOfEntitlements">
                                        </b-form-select>
                                        <div v-if="!proofOfEntitlementLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="proofOfEntitlementRef">Entitlement Reference<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.proof_of_entitlement_ref" type="text" id="proofOfEntitlementRef"></b-form-input>
                                        
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="identityDescription">Upload Identity Proof<span class="mandatory">*</span></label>
                                        <vue-base64-file-upload 
                                            class="v1"
                                            accept="image/png,image/jpeg"
                                            image-class="image-upload-display"
                                            input-class="form-control"
                                            :max-size="2"
                                            @size-exceeded="onIdSizeExceeded"
                                            @file="onIdFile"
                                            @load="onIdLoad" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="identityDescription">Upload Entitlement Proof<span class="mandatory">*</span></label>
                                        <vue-base64-file-upload 
                                            class="v1"
                                            accept="image/png,image/jpeg"
                                            image-class="image-upload-display"
                                            input-class="form-control"
                                            :max-size="2"
                                            @size-exceeded="onEntSizeExceeded"
                                            @file="onEntFile"
                                            @load="onEntLoad" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="documentVerified">Document Verified</label><br/>
                                        <c-switch class="mx-1" id="documentVerified"  name="documentVerified" color="primary" v-model="newCustomer.document_verified" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
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
                            <hr />
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Webcam Tests</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="12">
                                    <div><button id="prep" v-on:click="prepVideo()">Prep Photo</button></div>
                                    
                                    <div><video ref="video2" id="video" width="640" height="480" autoplay></video></div>
                                    <div><button id="snap2" v-on:click="capture()">Snap Photo</button></div>
                                    <canvas ref="canvas2" id="canvas2" width="640" height="480"></canvas>
                                    <ul>
                                        <li v-for="c in captures" :key="c.id">
                                            <img v-bind:src="c.image" height="50" />
                                        </li>
                                    </ul>
                                </b-col>
                            </b-row>
                            <hr />
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <!-- modal -->
        <b-modal title="Capture Image" class="modal-warning" size="lg" v-model="activeStateImageCaptureModal" @ok="toggleImageCaptureModal()" ok-variant="warning">
            <div class="form-container">
                <b-row>
                    <b-col sm="12">
                        <div><video ref="video" id="video" width="700" height="600" autoplay></video></div>
                        <b-button v-on:click="captureImage()" variant="primary">Take Photo</b-button>
                        <canvas ref="canvas" id="canvas" width="760" height="600"></canvas>
                        <ul>
                            <li v-for="c in captures" :key="c.id">
                                <img v-bind:src="c.image" height="50" />
                            </li>
                        </ul>
                    </b-col>
                </b-row>
            </div>
        </b-modal>
    </div>
</template>

<script>

import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner';
import { Switch as cSwitch } from '@coreui/vue';
import VueBase64FileUpload from 'vue-base64-file-upload';
import cTable from '../../components/table/Table';


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

const getCustomerTypesForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCustomerTypeForSelect", headersObj)
            .then((response) => {
                resolve(response.data.customer_types);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getCustomerCategoriesForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getCustomerCategoryForSelect", headersObj)
            .then((response) => {
                resolve(response.data.customer_categories);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getPurchaseMethodsForSelect = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getPurchaseMethodsForSelect", headersObj)
            .then((response) => {
                resolve(response.data.purchase_methods);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getLegalDocumentsForSelect = (($http, documentTypeCode) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("getLegalDocumentsForSelect?code=" + documentTypeCode, headersObj)
            .then((response) => {
                resolve(response.data.legal_documents);
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

const getCustomersList = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("customers", headersObj)
            .then((response) => {
                resolve(response.data.customers);
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
      cTable,
      VueBase64FileUpload
  },
  data () {
    return {
        mediaStream: MediaStream,
        captures: [],
        newCustomer: {
            group_id: 0,
            branch_id: 0,
            site_id: 0,
            category_id: 0,
            type_id: 0,
            proof_of_id: 0,
            proof_of_id_ref: '',
            proof_of_id_doc: '',
            identity_description: '',
            proof_of_entitlement: 0,
            proof_of_entitlement_ref: '',
            proof_of_entitlement_doc: '',
            entitlementDescription: ''
        },
        activeStateImageCaptureModal: false,
        isEntitlementUploadSelected: false,
        isIdentityUploadSelected: false,
        isEntitlementCaptureComplete: false,
        isIdentityCaptureComplete: false,
        addMode: false,
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
        retailCategories: [],
        retailTypes: [],
        purchaseMethods: [],
        proofOfIds: [],
        proofOfEntitlements: [],
        customersLoaded: false,
        retailTypesLoaded : false,
        retailCategoriesLoaded: false,
        purchaseMethodsLoaded: false,
        areasLoaded: false,
        statusesLoaded: false,
        sitesLoaded: false,
        proofOfIdsLoaded: false,
        proofOfEntitlementLoaded: false,
        allowDetailsContinue: false,
        tableFields: [
            {key: 'customer_name', label: 'Customer Name', sortable: true},
            {key: 'email', label: 'Email', sortable: true},
            {key: 'mobile_number', label: 'Mobile Number', sortable: true},
            {key: 'post_code', label: 'Post Code', sortable: true},
            {key: 'branch.branch_name', label: 'Area', sortable: true},
            {key: 'site.site_name', label: 'Site', sortable: true}
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
            opt_in_marketing: false,
            opt_in_research: false,
            opt_in_anonymously: false,
            group_id: 0,
            branch_id: 0,
            site_id: 0,
            is_active: false
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
            is_default: true,
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
            is_invoice_address: false,
            is_default_delivery_address: false,
            is_active: true
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
  mounted() {
  },
  methods : {
    toggleImageCaptureModal() {
        this.$data.activeStateImageCaptureModal = !this.$data.activeStateImageCaptureModal;
        if (this.$data.activeStateImageCaptureModal) {
            this.prepVideo();
        }
        else {
            this.$data.mediaStream.getTracks()[0].stop();
            this.$data.mediaStream.getVideoTracks()[0].stop();
            this.$data.mediaStream = null;
            this.$refs.video.srcObject = null;
            
        }
        console.log(this.$data.activeStateImageCaptureModal);
    },
    async prepVideo() {
        this.$data.mediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
        console.log(this.$data.mediaStream);
        this.$refs.video.srcObject = this.$data.mediaStream;
    },
    captureImage() {
        // this.canvas = this.$refs.canvas;
        var context = this.$refs.canvas.getContext("2d").drawImage(this.$refs.video, 0, 0, 760, 600);
        this.captures.push({'id': new Date().getTime(), 'image': this.$refs.canvas.toDataURL("image/webp")});
    },
    onIdFile() {
        console.log('on Id file');
    },
    onIdLoad(dataUri) {
        console.log('on Id load');
        this.$data.newCustomer.proof_of_id_doc = dataUri;
    },
    onIdSizeExceeded() {
        console.log('on Id exceed');
    },
    onEntFile() {
        console.log('on Id file');
    },
    onEntLoad(dataUri) {
        console.log('on Id load');
        this.$data.newCustomer.proof_of_entitlement_doc = dataUri;
    },
    onEntSizeExceeded() {
        console.log('on Id exceed');
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
        getCustomersList(this.$http)
            .then((response) => {
                console.log(response);
                this.$data.customerItems = response.map((element) => {
                    element.customer_name = element.contacts[0].first_name + ' ' + element.contacts[0].last_name;
                    element.email = element.contacts[0].email;
                    element.mobile_number = element.contacts[0].mobile_number;
                    element.post_code = element.addresses[0].post_code;
                    return element;
                });
                this.$data.customerItems = response;
                this.$data.customersLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    exitAddMode() {
        this.$data.addMode = false;
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
    },
    enterAddMode() {
        this.$data.addMode = true;
        this.$data.allowSave = false;
        // get user and lookup data
        getContactTitles(this.$http)
            .then((titlesList) => {
                this.$data.contactTitles = titlesList;
                this.$data.contactTitlesLoaded = true;
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
                return getLegalDocumentsForSelect(this.$http, "PENT");
            })
            .then((legalDocsPENT) => {
                this.$data.proofOfEntitlements = legalDocsPENT;
                this.$data.proofOfEntitlementLoaded = true;
                return getLegalDocumentsForSelect(this.$http, "PID");
            })
            .then((legalDocsPID) => {
                this.$data.proofOfIds = legalDocsPID;
                this.$data.proofOfIdsLoaded = true;
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
            customer: {
                group: this.$data.newCustomer.group_id,
                branch: this.$data.newCustomer.branch_id,
                site: this.$data.newCustomer.site_id,
                category: this.$data.newCustomer.category_id,
                type: this.$data.newCustomer.type_id,
                proofId: this.$data.newCustomer.proof_of_id,
                proofIdRef: this.$data.newCustomer.proof_of_id_ref,
                proofIdImg: this.$data.newCustomer.proof_of_id_doc,
                proofIdTxt: this.$data.newCustomer.identity_description,
                proofEnt: this.$data.newCustomer.proof_of_entitlement,
                proofEntRef: this.$data.newCustomer.proof_of_entitlement_ref,
                proofEntImg: this.$data.newCustomer.proof_of_entitlement_doc,
                proofEntTxt: this.$data.newCustomer.entitlementDescription
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

        
        // first, save the customer
        this.$http.post('customers/bulk', {
            customer: dataPostObject.customer,
            address: dataPostObject.address,
            contact: dataPostObject.contact
        },
        headersObj)
        .then((response) => {
            console.log(response.data);
            if (response.data.success == true) {
                this.$data.saveInProgress = false;
                this.$data.saveError = false;
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
    },
    checkDetailsAndContinue() {
        // getting here means all checks are validated via the watcher
        this.$data.wizardGetContactInfo = true;

        // populate the dropdown controls
        getContactTitles(this.$http)
            .then((titlesList) => {
                this.$data.contactTitles = titlesList;
                this.$data.contactTitlesLoaded = true;
                return getContactCategories(this.$http);
            })
            .then((categoriesList) => {
                this.$data.contactCategories = categoriesList;
                this.$data.contactCategoriesLoaded = true;
                return getContactTypesForSelect(this.$http);
            })
            .then((typesList) => {
                this.$data.contactTypes = typesList;
                this.$data.contactTypesLoaded = true;
                return getContactRolesForSelect(this.$http);
            })
            .then((roleList) => {
                this.$data.contactRoles = roleList;
                this.$data.contactRolesLoaded = true;
                return getContactMethodsForSelect(this.$http);
            })
            .then((methodsList) => {
                this.$data.contactMethods = methodsList;
                this.$data.contactMethodsLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    checkContactsAndContinue() {
        // getting here means all checks are validated via the watcher
        this.$data.wizardGetAddressInfo = true;

        // populate the dropdown controls
        getAddressCounties(this.$http)
            .then((countiesList) => {
                this.$data.counties = countiesList;
                this.$data.countiesLoaded = true;
                return getAddressCountries(this.$http);
            })
            .then((countriesList) => {
                this.$data.countries = countriesList;
                this.$data.countriesLoaded = true;
                return getAddressCategories(this.$http);
            })
            .then((categoriessList) => {
                this.$data.addressCategories = categoriessList;
                this.$data.addressCategoriesLoaded = true;
                return getAddressTypes(this.$http);
            })
            .then((typeList) => {
                this.$data.addressTypes = typeList;
                this.$data.addressTypesLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    }
  }
}
</script>

<style scoped>
    span.switch {
        cursor: pointer;
        font-weight: bold;
        display: inline;
    }
</style>