<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Plate Size Management</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Plate Size List</strong>
                        </div>
                        <div v-if="!customersLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="customersLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Plate Size
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
                                    <div id="plate-list">
                                        <!--<c-table :table-data="customerItems" :fields="tableFields" :perPage="10" bordered caption="All Trade Customers"></c-table>-->
                                        <b-table
                                            id="plate-size-table"
                                            class="datalist-table"
                                            selectable
                                            hover 
                                            bordered
                                            select-mode="single"                                            
                                            :items="plateSizeItems" 
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
                    <h1>Add Plate Size</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Plate Size Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
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
                                <b-col sm="4">
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
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="supplierCode">Customer Code<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.supplier_code" type="text" id="supplierCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="website">Company Name<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.supplier_name" type="text" id="website"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="dvlaLicenceCode">DVLA Licence Code<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.dvla_lic_code" type="text" id="dvlaLicenceCode"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="dvlaConfirmed">DVLA Code Confirmed</label><br/>
                                        <c-switch class="mx-1" id="dvlaConfirmed"  name="dvlaConfirmed" color="primary" v-model="newCustomer.dvla_confirmed" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
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
                                        <label for="website">Website<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newCustomer.website" type="text" id="website"></b-form-input>
                                    </b-form-group>
                                </b-col>              
                            </b-row>
                            <b-row>
                                <b-col sm="12">
                                    <b-form-group>
                                        <label for="addressDeliveryNotes">Further Instruction</label>
                                        <b-form-input v-model="newAddress.delivery_notes" type="text" id="addressDeliveryNotes"></b-form-input>
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
                        </div>
                    </b-card>
                    <b-card>
                        <div slot="header">
                            <strong>Trade Type</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactTitle">Trade Type<span class="mandatory">*</span></label>
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
                                        <label for="contactTitle">Franchise Type<span class="mandatory">*</span></label>
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

const getPlateSizeList = (($http, filter) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("plates/sizes", headersObj)
            .then((response) => {
                resolve(response.data.plates);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});


export default {
  name: 'platesSizes',
  components: {
      LoadingSpinner: LoadingSpinner,
      cSwitch,
      cTable
  },
  data () {
    return {
        newPlateSize: {
            plate_size_name: "",
            height_in_mm: "",
            width_in_mm: "",
            height_in_inches: "",
            width_in_inches: "",
        },
        addMode: false,
        editMode: false,
        allowSave: true,
        saveError: false,
        saveInProgress: false,
        plateSizesLoaded: false,
        tableFields: [
            {key: 'plate_size', label: 'Plate Size', sortable: true},
            {key: 'height_in_mm', label: 'Height (mm)', sortable: true},
            {key: 'width_in_mm', label: 'Width (mm)', sortable: true},
            {key: 'height_in_inches', label: 'Height (in)', sortable: true},
            {key: 'width_in_inches', label: 'Width (in)', sortable: true},
        ],
        plateSizes: []
    }
  },
  created () {
    this.getPlates();
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

  },
  methods : {
    rowSelected(item, index) {

        // grab the customer. We already have the data in the array
        let plateSize = this.$data.plateSizeItems.filter((plateSizeObj) => {
            return plateSizeObj.id == item.id;
        });;
        

        this.$data.editMode = true;
        this.enterAddMode();
        this.$data.newPlate = customer[0];

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
    getPlates() {
        getPlateSizeList(this.$http)
            .then((plateSizeList) => {
                this.$data.plateSizes = plateSizeList;
                this.$data.plateSizesLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    exitAddMode() {
        this.$data.addMode = false;
        this.$data.editMode = false;

        this.$data.newPlateSize.plate_size_name = "";
        this.$data.newPlateSize.height_in_mm = "";
        this.$data.newPlateSize.width_in_mm = "";
        this.$data.newPlateSize.height_in_inches = "";
        this.$data.newPlateSize.width_in_inches = "";

    },
    enterAddMode() {
        this.$data.addMode = true;
        this.$data.allowSave = false;
    },
    clearAlerts() {
        this.$data.saveError = false;
        this.$data.saveInProgress = false;
    },
    savePlateSize() {
        this.clearAlerts();
        this.$data.saveInProgress = true;
        let headersObj = this.getHTTPHeaders();

        let dataPostObject = {
            supplier: {
                name: this.$data.newCustomer.supplier_name,
                short: this.$data.newCustomer.short_name,
                branch: this.$data.newCustomer.branch_id,
                site: this.$data.newCustomer.site_id,
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
    updatePlateSize() {
            
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
