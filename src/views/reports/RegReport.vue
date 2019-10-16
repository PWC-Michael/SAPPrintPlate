<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12">
          <h1>Vehice Registration Report</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
              <strong>Registration</strong>
          </div>
          <div class="form-container">
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <b-form-input v-model="instantRegValue" type="text" id="regInput" @keyup.enter.native="getRegReport"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" sm="12" md="12">
                <p>
                  <b-button v-on:click="getRegReport" variant="primary" :disabled="regReportFetchInProgress">
                    <i v-if="regReportFetchInProgress" class="fa fa-spin fa-spinner"></i>
                    <i v-if="!regReportFetchInProgress" class="fa fa-search"></i>&nbsp;Get Details
                  </b-button>
                </p>
                <b-alert v-if="noRegForReport" variant="warning" show><strong>There is no registraion plate with that vakue in the system. </strong></b-alert>
                <b-alert v-if="regExistsButOtherCompany" variant="warning" show><strong>Registration has been found but you do not have access to view it. </strong></b-alert>
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
    </b-row>
    <div v-if="reportHasBeenRun">
      <b-row>
        <b-col sm="12">
          <b-card>
            <div slot="header">
                <strong>Plate Details</strong>
            </div>
            <div v-if="!plateLoaded" class="form-container">
                <LoadingSpinner />
            </div>
            <div v-if="plateLoaded" class="form-container">
              <b-row>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Registration</div>
                      <div class="h5 text-warning mb-0">{{regReport.registration_number}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Post Code</div>
                      <div class="h5 text-warning mb-0">{{regReport.postcode || 'None'}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Post Code Position</div>
                      <div class="h5 text-warning mb-0">{{regReport.postcode ? regReport.postcode_position : "N/A"}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Slogan</div>
                      <div class="h5 text-warning mb-0">{{regReport.slogan || 'None'}}</div>
                    </b-card-body>
                  </b-card>
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
                <strong>Plate Print Details</strong>
            </div>
            <div v-if="!plateLoaded" class="form-container">
                <LoadingSpinner />
            </div>
            <div v-if="plateLoaded" class="form-container">
              <b-row>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Printed?</div>
                      <div class="h5 text-warning mb-0">{{regReport.printed ? 'Yes' : 'No'}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Printed On</div>
                      <div class="h5 text-warning mb-0">{{regReport.printed_date}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Printed With</div>
                      <div class="h5 text-warning mb-0">{{regReport.printer_used}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="3" md="3" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Been Reprinted?</div>
                      <div class="h5 text-warning mb-0">{{regReport.reprinted == 1 ? 'Yes' : 'No'}}</div>
                      <div v-if="regReport.reprinted == 1" class="h5 text-warning mb-0">Reason: + {{regReport.reprint_reason}}</div>
                    </b-card-body>
                  </b-card>
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
                <strong>Printed by</strong>
            </div>
            <div v-if="!plateLoaded" class="form-container">
                <LoadingSpinner />
            </div>
            <div v-if="plateLoaded" class="form-container">
              <b-row>
                <b-col cols="12" sm="4" md="4" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Area</div>
                      <div class="h5 text-warning mb-0">{{area.branch_name}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="4" md="4" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">                      
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">Site</div>
                      <div class="h5 text-warning mb-0">{{site.site_name}}</div>
                    </b-card-body>
                  </b-card>
                </b-col>
                <b-col cols="12" sm="4" md="4" >
                  <b-card :no-body="true" footer-class="px-3 py-2">
                    <b-card-body class="p-3 clearfix">
                      <i class="fa fa-bank p-3 font-2xl mr-3 float-left"></i>
                      <div class="text-muted text-uppercase font-weight-bold font-xs">User</div>
                      <div class="h5 text-warning mb-0">{{userPrinted.first_name}} {{userPrinted.last_name}}</div>
                    </b-card-body>
                  </b-card>
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
import CardLine1ChartExample from '../dashboard/CardLine1ChartExample'
import CardLine2ChartExample from '../dashboard/CardLine2ChartExample'
import CardLine3ChartExample from '../dashboard/CardLine3ChartExample'
import CardBarChartExample from '../dashboard/CardBarChartExample'
import MainChartExample from '../dashboard/MainChartExample'
import SocialBoxChartExample from '../dashboard/SocialBoxChartExample'
import CalloutChartExample from '../dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'
import LoadingSpinner from '../../components/loadingSpinner/LoadingSpinner';

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

const getRegReport = (($http, regValue) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get("plates/vrm/search?vrm=" + regValue, headersObj)
            .then((response) => {
                resolve(response.data);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getSite = (($http, areaId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('site?branch_id=' + areaId, headersObj)
            .then((response) => {
                resolve(response.data.sites);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getArea = (($http, companyId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
         $http.get('branch?company_id=' + companyId, headersObj)
            .then((response) => {
                resolve(response.data.branches);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

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

  name: 'regreport',
  components: {
    LoadingSpinner: LoadingSpinner,
    Callout,
    CardLine1ChartExample,
    CardLine2ChartExample,
    CardLine3ChartExample,
    CardBarChartExample,
    MainChartExample,
    SocialBoxChartExample,
    CalloutChartExample
  },
  data: function () {
    return {
      instantRegValue: '',
      reportHasBeenRun: false,
      noRegForReport: false,
      regExistsButOtherCompany: false,
      regParam: '',
      regReportFetchInProgress: false,
      regReport: {},
      site: {},
      area: {},
      userPrinted: {},
      plateLoaded: false,
      siteLoaded: false,
      areaLoaded: false
    }
  },
  created() {
    console.log(this.$data.reportHasBeenRun);
  },
  methods: {
    async getRegReport() {
      // rest flags
      this.$data.regReport = {};
      this.$data.site = {};
      this.$data.area = {};
      this.$data.userPrinted = {};
      this.$data.plateLoaded = false;
      this.$data.siteLoaded = false;
      this.$data.areaLoaded = false;
      this.$data.noRegForReport = false;
      this.$data.regExistsButOtherCompany = false;
      this.$data.regReportFetchInProgress = true;
      
      let regData = await getRegReport(this.$http, this.$data.instantRegValue);

      if (regData.plates.length == 0) {
        this.$data.noRegForReport = true;
        this.$data.regReportFetchInProgress = false;
        this.$data.reportHasBeenRun = false;
      }
      else {
        let userObj = JSON.parse(localStorage.getItem('user'));
        if (userObj.company_id == regData.plates[0].group_id) {
          this.$data.reportHasBeenRun = true;
          this.$data.regReport = regData.plates[0];
          this.$data.plateLoaded = true;
          getArea(this.$http, this.$data.regReport.group_id)
            .then((areas) => {
            this.$data.area = areas.filter((element) => {
              return element.id == this.$data.regReport.branch_id;
            })[0];
            this.$data.areaLoaded = true;
            console.log(this.$data.area);
            return getSite(this.$http, this.$data.regReport.branch_id)
          })
          .then((sites) => {
            this.$data.site = sites.filter((element) => {
              return element.id == this.$data.regReport.site_id;
            })[0];
            this.$data.siteLoaded = true;
            console.log(this.$data.site);
            return getUsers(this.$http)
          })
          .then((users) => {
            this.$data.userPrinted = users.filter((element) => {
              return element.username == this.$data.regReport.printed_by_name;
            })[0];
            this.$data.regReportFetchInProgress = false;
            console.log(this.$data.userPrinted);
          })
        }
        else {
          this.$data.reportHasBeenRun = false;
          this.$data.regExistsButOtherCompany = true;
          this.$data.regReportFetchInProgress = false;
        }
      }
    }
  }
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
  #regInput {
    text-transform: uppercase;
  }
</style>
