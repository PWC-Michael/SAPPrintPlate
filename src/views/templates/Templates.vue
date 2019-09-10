<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Templates</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Templates List</strong>
                        </div>
                        <div v-if="!templatesLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="templatesLoaded" class="form-container">
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
                                        <!--<c-table :filter="tableFilter" :table-data="contactItems" :fields="tableFields" :perPage="10" hover bordered caption="All templates"></c-table>-->
                                        <b-table
                                            id="templates-table"
                                            class="datalist-table"
                                            selectable
                                            hover 
                                            bordered
                                            select-mode="single"                                            
                                            :items="templateItems" 
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

const getTemplates = (($http, filterObj) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('templates?company_id=' + filterObj.company_id, headersObj)
            .then((response) => {
                resolve(response.data.templates);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

export default {
  name: 'templates',
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
        templatesLoaded: false,
        templates: [],
        templateItems: [],
        tableFilter: '',
        tablePerPage: 20,
        tableCurrentPage: 1,
        tableTotalRows: 0,
        tableFields: [
            {key: 'template_name', label: 'Template Name', sortable: true},
            {key: 'plate_height', label: 'Plate Height', sortable: true},
            {key: 'plate_width', label: 'Plate Width', sortable: true},
            {key: 'slogan', label: 'Slogan', sortable: true},
            {key: 'postcode', label: 'Post Code', sortable: true},
            {key: 'postcode_position', label: 'Post Code Position', sortable: true}
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
        contactTitlesLoaded: false
    }
  },
  created () {
    this.getTemplates();
  },
  methods : {
    rowSelected(item, index) {

        // grab the contact. We already have the data in the array
        /*
        let contact = this.$data.contactItems.filter((contact_obj) => {
            return contact_obj.id == item.id;
        });

        this.$data.newContact = contact.map((contact_obj) => {
            contact_obj.contact_category_id = contact_obj.contact_category.id;
            contact_obj.contact_role_id = contact_obj.contact_role.id;
            contact_obj.contact_type_id = contact_obj.contact_type.id;
            contact_obj.contact_method_id = contact_obj.contact_method.id;
            contact_obj.title_id = contact_obj.contact_title.id;
        })[0];

        this.$data.editMode = true;
        this.enterAddMode();
        this.$data.newContact = contact[0];
        */

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
    getTemplates() {
        getCurrentUser(this.$http)
            .then((userDetails) => {
                console.log(userDetails);
                const userFilter = {
                    company_id: userDetails.company_id,
                    branch_id: userDetails.branch_id,
                    site_id: userDetails.site_id
                };
                return getTemplates(this.$http, userFilter);
            })
            .then((templatetList) => {
                console.log(templatetList);
                this.$data.tableTotalRows = templatetList.length;
                this.$data.templateItems = templatetList;
                this.$data.templatesLoaded = true;
            })
            .catch ((err) => {
                console.error(err);
            });
    },
    exitAddMode() {
        this.$data.addMode = false;
        this.$data.editMode = false;
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
