<template>
    <div class="animated fadeIn">
        <div v-if="!addMode" class="viewMode">
            <b-row>
                <b-col cols="12">
                    <h1>Batch Printing</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Jobs List</strong>
                        </div>
                        <div v-if="!jobsLoaded" class="form-container">
                            <LoadingSpinner />
                        </div>
                        <div v-if="jobsLoaded" class="form-container">
                            <b-row>
                                <b-col cols="12" sm="12" md="6">
                                    <p>
                                        <b-button v-on:click="enterAddMode" variant="primary">
                                            <i class="fa fa-plus"></i>&nbsp;Add Job
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
                                    <div id="jobs-list">
                                        <!--<c-table :table-data="jobItems" :fields="tableFields" :perPage="10" bordered caption="All Jobs"></c-table>-->
                                        <b-table
                                            id="jobs-table"
                                            class="datalist-table"
                                            selectable
                                            hover 
                                            bordered
                                            select-mode="single"                                            
                                            :items="jobItems" 
                                            :fields="tableFields"
                                            :filter="tableFilter"
                                            :per-page="tablePerPage"
                                            @row-clicked="jobsTableRowSelected"
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
                    <h1>Add New Job</h1>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12">
                    <b-card>
                        <div slot="header">
                            <strong>Job Details</strong>
                        </div>
                        <div class="form-container">
                            <b-row>
                                <b-col sm="6">
                                    <b-form-group>
                                        <label for="jobName">Name</label>
                                        <b-form-input v-model="newJob.job_name" type="text" id="jobName"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="jobSource">Source</label>
                                        <b-form-input v-model="newJob.job_source" type="text" id="jobSource"></b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="3">
                                    <b-form-group>
                                        <label for="jobStatus">Status</label>
                                        <b-form-select id="jobStatus" v-if="statusesLoaded"  v-model="newJob.job_status_id"
                                            :plain="true"
                                            :options="statuses">
                                        </b-form-select>
                                        <div v-if="!statusesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="jobTemplateCategory">Category</label>
                                        <b-form-select id="jobTemplateCategory" v-if="categoriesLoaded"  v-model="newJob.template_category_id"
                                            :plain="true"
                                            :options="categories">
                                        </b-form-select>
                                        <div v-if="!categoriesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="jobTemplateType">Type</label>
                                        <b-form-select id="jobTemplateType" v-if="typesLoaded"  v-model="newJob.template_type_id"
                                            :plain="true"
                                            :options="types">
                                        </b-form-select>
                                        <div v-if="!typesLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                                <b-col sm="4">
                                    <b-form-group>
                                        <label for="jobShipping">Shipping</label>
                                        <b-form-select id="jobShipping" v-if="shippingLoaded"  v-model="newJob.shipping_id"
                                            :plain="true"
                                            :options="shipping">
                                        </b-form-select>
                                        <div v-if="!shippingLoaded" >
                                            <i class="fa fa-spin fa-spinner"></i>
                                        </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col class="radios" sm="12">
                                    <b-form-group
                                        label="Trade / Retail "
                                        label-for="customerType"
                                        :label-cols="2"
                                        :horizontal="true">
                                        <b-form-radio-group id="customerTypeSelect" name="customerType" :style="radioStyleObj">
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="customerTypeTrade" name="customerType" class="custom-control-input" value="1" v-model="jobCustomerType">
                                                <label class="custom-control-label" for="customerTypeTrade">Trade</label>
                                            </div>
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="customerTypeRetail" name="customerType" class="custom-control-input" value="3" v-model="jobCustomerType">
                                                <label class="custom-control-label" for="customerTypeRetail">Retail</label>
                                            </div>
                                        </b-form-radio-group>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <div v-if="tradeSelected">
                                <b-row>
                                    <b-col sm="12">
                                        <h6>Select Trade Customer:</h6>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col sm="3">
                                        <b-form-group>
                                            <label for="tableTradeFilter">Filter</label>
                                            <b-form-input v-model="tableTradeFilter" type="text" id="tableTradeFilter"></b-form-input>
                                        </b-form-group>                                    
                                    </b-col>                             
                                </b-row>
                                <b-row>
                                    <b-col cols="12">
                                        <div id="trade-customers">
                                            <!--<c-table :table-data="jobItems" :fields="tableFields" :perPage="10" bordered caption="All Jobs"></c-table>-->
                                            <b-table
                                                id="trade-table"
                                                class="datalist-table"
                                                selectable
                                                hover 
                                                bordered
                                                select-mode="single"                                            
                                                :items="tradeItems" 
                                                :fields="tableTradeFields"
                                                :filter="tableTradeFilter"
                                                :per-page="tableTradePerPage"
                                                @row-clicked="tableTradeRowSelected"
                                                responsive="sm"
                                                >
                                                <template slot="selected" slot-scope="{ tableTradeRowSelected }">
                                                    <span v-if="tableTradeRowSelected">✔</span>
                                                </template>
                                            </b-table>
                                        </div>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col md="6" class="my-1">
                                        <b-pagination
                                        v-model="tableTradeCurrentPage"
                                        :total-rows="tableTradeTotalRows"
                                        :per-page="tableTradePerPage"
                                        class="my-0"
                                        ></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                            <hr />
                            <b-row>
                                <b-col cols="12" sm="12" md="12">
                                    <p>
                                        <b-button v-on:click="saveJob" variant="primary" :disabled="!allowSave">
                                            <i class="fa fa-check"></i>&nbsp;Save Job
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

const getJobStatus = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("jobs/getStatusesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.statuses);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getTemplateCategories = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("templates/getTemplateCategoriesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.categories);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getTemplateTypes = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("templates/getTemplateTypesForSelect", headersObj)
            .then((response) => {
                resolve(response.data.types);
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

const getJobsList = (($http) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("jobs", headersObj)
            .then((response) => {
                resolve(response.data.jobs);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const TRADE_CUSTOMER_TYPE = 1;
const RETAIL_CUSTOMER_TYPE = 3;

export default {
    name: 'jobs',
    components: {
        LoadingSpinner: LoadingSpinner,
        cSwitch,
        cTable
    },
    data () {
        return {
            radioStyleObj: {
                paddingTop: 'calc(0.375rem + 1px)',
                paddingBottom: 'calc(0.375rem + 1px)',
                marginBottom: '0',
                lineHeight: '1.5'
            },
            statuses: [],
            categories: [],
            types: [],
            suppliers: [],
            shipping: [],
            newJob: {
                job_name: "",
                job_source: "",
                job_status_id: 0,
                template_category_id: 0,
                template_type_id: 0,
                supplier_id: 0,
                contact_type_id: 0,
                customer_id: 0,
                shipping_id: 0,
                group_id: 0,
                branch_id: 0,
                dealership_id: 0,
                is_active: "1",
            },
            jobsLoaded: true,
            categoriesLoaded: false,
            typesLoaded: false,
            statusesLoaded: false,
            shippingLoaded: false,
            tradeItemsLoaded: false,
            addMode: false,
            editMode: false,
            allowSave: true,
            saveError: false,
            saveInProgress: false,
            userObj: {},
            activeStateModal: false,
            groupIdToChangeActiveStatus: 0,
            tableFilter: '',
            tablePerPage: 20,
            tableCurrentPage: 1,
            tableTotalRows: 0,
            tableTradeFilter: '',
            tableTradePerPage: 20,
            tableTradeCurrentPage: 1,
            tableTradeTotalRows: 0,
            tableFields: [
                {key: 'job_code', label: 'Job Code', sortable: true},
                {key: 'job_name', label: 'Job Name', sortable: true},
                {key: 'job_source', label: 'Job Source', sortable: true},
                {key: 'customer', label: 'Customer', sortable: true},
                {key: 'job_category', label: 'Job Category', sortable: true},
                {key: 'template_type.type_name', label: 'Type', sortable: true},
                {key: 'status', sortable: true}
            ],
            tableTradeFields: [
                {key: 'supplier_code', label: 'Customer Code', sortable: true},
                {key: 'short_name', label: 'Short Name', sortable: true},
                {key: 'supplier_name', label: 'Customer', sortable: true},
                {key: 'branch.branch_name', label: 'Area', sortable: true},
                {key: 'site.site_name', label: 'Site', sortable: true},
                {key: 'dvla_lic_code', label: 'DVLA Licence Code', sortable: true}
            ],
            jobItems: [],
            tradeItems: [],
            jobCustomerType: null,
            tradeSelected: false,
            retailSelected: false
        }
    },
    created () {
        this.getJobs();
    },
    watch: {
        // Customer details
        'jobCustomerType': function(val, oldVal) {
            console.log(val);
            if (val == TRADE_CUSTOMER_TYPE) {
                this.$data.retailSelected = false;
                this.$data.tradeSelected = true;
                this.getTradeCustomerList();
            }
        }
    },
    methods : {
        jobsTableRowSelected(item, index) {

            // grab the contact. We already have the data in the array
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

        },
        tableTradeRowSelected(items, item, index) {
            this.selected = items;
        },
        getTradeCustomerList() {
            getSuppliersList(this.$http)
                .then((response) => {
                    console.log(response);
                    this.$data.tradeItems = response;
                    this.$data.tradeItemsLoaded = true;
                })
                .catch ((err) => {
                    console.error(err);
                });
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
        getJobs() {
            getJobsList(this.$http)
                .then((response) => {
                    console.log(response);
                    this.$data.tableTotalRows = response.length;
                    this.$data.jobItems = response;
                    this.$data.jobsLoaded = true;
                })
                .catch ((err) => {
                    console.error(err);
                });
        },
        exitAddMode() {
            this.$data.addMode = false;
            this.$data.statusesLoaded = false;
            this.$data.categoriesLoaded = false;
            this.$data.shippingLoaded = false;
        },
        enterAddMode() {
            this.$data.addMode = true;
            this.$data.allowSave = false;
            // get the counties and countries data
            getJobStatus(this.$http)
                .then((statuses) => {
                    this.$data.statuses = statuses;
                    this.$data.statusesLoaded = true;
                    return getTemplateCategories(this.$http);
                })
                .then((categories) => {
                    this.$data.categories = categories;
                    this.$data.categoriesLoaded = true;
                    return getShippingList(this.$http);
                })
                .then((shipping) => {
                    this.$data.shipping = shipping;
                    this.$data.shippingLoaded = true;
                    return getTemplateTypes(this.$http);
                })
                .then((types) => {
                    this.$data.types = types;
                    this.$data.typesLoaded = true;
                })
                .catch ((err) => {
                    console.error(err);
                });
        },
        clearAlerts() {
            this.$data.saveError = false;
            this.$data.saveInProgress = false;
        },
        saveJob() {
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
