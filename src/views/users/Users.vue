<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>User Management</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Users List</strong>
                        </div>
                        <div v-if="!usersLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="usersLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Contact
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
                                        <!--<c-table :filter="tableFilter" :table-data="contactItems" :fields="tableFields" :perPage="10" hover bordered caption="All Contacts"></c-table>-->
                                        <b-table
                                            id="users-table"
                                            class="datalist-table"
                                            selectable
                                            hover 
                                            bordered
                                            select-mode="single"                                            
                                            :items="userItems" 
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
                    <h1>Add New Contact</h1>
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
                                        <label for="contactCategory">Contact Category<span class="mandatory">*</span></label>
                                        <b-form-select id="contactCategory" v-if="contactCategoriesLoaded"  v-model="newContact.contact_category_id"
                                            :plain="true"
                                            :options="contactCategories">
                                        </b-form-select>
                                        <div v-if="!contactCategoriesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>                                    
                                </b-col>                                
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactMobile">Mobile No<span class="mandatory">*</span></label>
                                        <b-form-input v-model="newContact.mobile_number" type="text" id="contactMobile"></b-form-input>
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
                                        <label for="contactMethod">Contact Method<span class="mandatory">*</span></label>
                                        <b-form-select id="contactMethod" v-if="contactMethodsLoaded"  v-model="newContact.contact_method_id"
                                            :plain="true"
                                            :options="contactMethods">
                                        </b-form-select>
                                        <div v-if="!contactMethodsLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactType">Contact Type<span class="mandatory">*</span></label>
                                        <b-form-select id="contactType" v-if="contactTypesLoaded"  v-model="newContact.contact_type_id"
                                            :plain="true"
                                            :options="contactTypes">
                                        </b-form-select>
                                        <div v-if="!contactTypesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactRole">Contact Role</label>
                                        <b-form-select id="contactRole" v-if="contactRolesLoaded"  v-model="newContact.contact_role_id"
                                            :plain="true"
                                            :options="contactRoles">
                                        </b-form-select>
                                        <div v-if="!contactRolesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactCompany">Company</label>
                                        <b-form-input v-model="newContact.company_name" type="text" id="contactCompany"></b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptMarketing">Marketing Participation</label><br/>
                                        <c-switch class="mx-1" id="contactOptMarketing"  name="contactOptMarketing" color="primary" v-model="newContact.opt_in_marketing" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptResearch">Marketing Research</label><br/>
                                        <c-switch class="mx-1" id="contactOptResearch"  name="contactOptResearch" color="primary" v-model="newContact.opt_in_research" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="contactOptAnon">Anonymous Statistics</label><br/>
                                        <c-switch class="mx-1" id="contactOptAnon"  name="contactOptAnon" color="primary" v-model="newContact.opt_in_anonymously" label value="1" uncheckedValue="0" dataOn="yes" dataOff="no" />
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <hr />
                            <b-row>
                                <b-col cols="12" sm="12" md="12">
                                    <p>
                                        <b-button v-on:click="saveContact" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Save Contact
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

const getUsers = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('users', headersObj)
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
  name: 'users',
  components: {
      LoadingSpinner: LoadingSpinner,
      cSwitch,
      cTable
  },
  data () {
    return {
        addMode: false,
        editMode: false,
        allowSave: true,
        saveError: false,
        saveInProgress: false,
        userObj: {},
        usersLoaded: false,
        contacts: [],
        userItems: [],
        tableFilter: '',
        tablePerPage: 20,
        tableCurrentPage: 1,
        tableTotalRows: 0,
        tableFields: [
            {key: 'first_name', label: 'First Name', sortable: true},
            {key: 'last_name', label: 'Last Name', sortable: true},
            {key: 'contact_category.category_name', label: 'Category Name', sortable: true},
            {key: 'contact_type.type_name', label: 'Type Name', sortable: true},
            {key: 'email', label: 'Email', sortable: true},
            {key: 'mobile_number', label: 'Mobile Number', sortable: true},
            {key: 'phone_number', label: 'Telephone Number', sortable: true}
        ],
        
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
        }
    }
  },
  created () {
    this.getUsers();
  },
  watch: {
  },
  methods : {
    rowSelected(item, index) {
        console.log(item);
        console.log(index);

        
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
    getUsers() {
        getCurrentUser(this.$http)
            .then((userDetails) => {
                console.log(userDetails);
                return getUsers(this.$http);
            })
            .then((userList) => {
                console.log(userList);
                this.$data.tableTotalRows = userList.length;
                this.$data.userItems = userList
                this.$data.usersLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    exitAddMode() {
        this.$data.addMode = false;
        this.$data.contactCategoriesLoaded = false;
        this.$data.contactTypesLoaded = false;
        this.$data.contactMethodsLoaded = false;
        this.$data.contactRolesLoaded = false;
        this.$data.contactTitlesLoaded = false;
    },
    enterAddMode() {
        this.$data.addMode = true;
        this.$data.allowSave = false;
        
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
    clearAlerts() {
        this.$data.saveError = false;
        this.$data.saveInProgress = false;
    },
    saveContact() {
        this.clearAlerts();
        this.$data.saveInProgress = true;
        let headersObj = this.getHTTPHeaders();

        /*
        // first, save the customer
        this.$http.post('createSupplier', {
            name,
            short, 
            company, 
            branch, 
            site, 
            website, 
            status, 
            dvlaLicCode, 
            dvlaConfirmed, 
            dvlaConfirmedDate, 
            dvlaConfirmedBy, 
            code
        },
        headersObj)
        
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
            is_active: this.$data.newGroup.is_active
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
        */
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
