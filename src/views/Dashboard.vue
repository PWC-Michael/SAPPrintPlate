<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="12">
        <b-card>
          <div slot="header">
              <strong>Instant Registration Report</strong>
          </div>
          <div class="form-container">
            <b-row>
              <b-col sm="12">
                  <b-form-group>
                      <label for="groupName">Registration</label>
                      <b-form-input v-model="instantRegValue" type="text" id="regInput"></b-form-input>
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
    <b-row v-if="!isCompanyUser">
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-primary">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Currently Active</b-dropdown-item>
              <b-dropdown-item>Expired</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">67</h4>
            <p>Groups</p>
          </b-card-body>
          <card-line1-chart-example chartId="card-chart-01" class="chart-wrapper px-3" style="height:70px;" :height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-info">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right no-caret>
              <template slot="button-content">
                <i class="icon-location-pin"></i>
              </template>
              <b-dropdown-item>Currently Active</b-dropdown-item>
              <b-dropdown-item>Expired</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">134</h4>
            <p>Areas</p>
          </b-card-body>
          <card-line2-chart-example chartId="card-chart-02" class="chart-wrapper px-3" style="height:70px;" :height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Currently Active</b-dropdown-item>
              <b-dropdown-item>Expired</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">312</h4>
            <p>Sites</p>
          </b-card-body>
          <card-line3-chart-example chartId="card-chart-03" class="chart-wrapper" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
      <b-col sm="6" lg="3">
        <b-card no-body class="bg-danger">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Trade</b-dropdown-item>
              <b-dropdown-item>Retail</b-dropdown-item>
              <b-dropdown-item>First Prints</b-dropdown-item>
              <b-dropdown-item>Repeated Prints</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">2897</h4>
            <p>Plates Printed</p>
          </b-card-body>
          <card-bar-chart-example chartId="card-chart-04" class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="isCompanyUser">
      <b-col sm="4">
        <b-card no-body class="bg-info">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right no-caret>
              <template slot="button-content">
                <i class="icon-location-pin"></i>
              </template>
              <b-dropdown-item>Currently Active</b-dropdown-item>
              <b-dropdown-item>Expired</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">134</h4>
            <p>Areas</p>
          </b-card-body>
          <card-line2-chart-example chartId="card-chart-02" class="chart-wrapper px-3" style="height:70px;" :height="70"/>
        </b-card>
      </b-col>
      <b-col sm="4">
        <b-card no-body class="bg-warning">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Currently Active</b-dropdown-item>
              <b-dropdown-item>Expired</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">312</h4>
            <p>Sites</p>
          </b-card-body>
          <card-line3-chart-example chartId="card-chart-03" class="chart-wrapper" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
      <b-col sm="4">
        <b-card no-body class="bg-danger">
          <b-card-body class="pb-0">
            <b-dropdown class="float-right" variant="transparent p-0" right>
              <template slot="button-content">
                <i class="icon-settings"></i>
              </template>
              <b-dropdown-item>Trade</b-dropdown-item>
              <b-dropdown-item>Retail</b-dropdown-item>
              <b-dropdown-item>First Prints</b-dropdown-item>
              <b-dropdown-item>Repeated Prints</b-dropdown-item>
            </b-dropdown>
            <h4 class="mb-0">2897</h4>
            <p>Plates Printed</p>
          </b-card-body>
          <card-bar-chart-example chartId="card-chart-04" class="chart-wrapper px-3" style="height:70px;" height="70"/>
        </b-card>
      </b-col>
    </b-row>

    <b-card v-if="!isCompanyUser">
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">Jobs</h4>
          <div class="small text-muted">June 2019</div>
        </b-col>
        <b-col sm="7" class="d-none d-md-block">
          <b-button type="button" variant="primary" class="float-right"><i class="icon-cloud-download"></i></b-button>
          <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
            <b-form-radio-group class="mr-3" id="radiosBtn" buttons button-variant="outline-secondary" v-model="selected" name="radiosBtn">
              <b-form-radio class="mx-0" value="Day">Day</b-form-radio>
              <b-form-radio class="mx-0" value="Month">Month</b-form-radio>
              <b-form-radio class="mx-0" value="Year">Year</b-form-radio>
            </b-form-radio-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <main-chart-example chartId="main-chart-01" class="chart-wrapper" style="height:300px;margin-top:40px;" height="300"></main-chart-example>
      <div slot="footer">
        <b-row class="text-center">
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">Visits</div>
            <strong>29.703 Users (40%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="success" :value="40"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Unique</div>
            <strong>24.093 Users (20%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="info" :value="20"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">Pageviews</div>
            <strong>78.706 Views (60%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="warning" :value="60"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0">
            <div class="text-muted">New Users</div>
            <strong>22.123 Users (80%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" variant="danger" :value="80"></b-progress>
          </b-col>
          <b-col class="mb-sm-2 mb-0 d-md-down-none">
            <div class="text-muted">Bounce Rate</div>
            <strong>Average Rate (40.15%)</strong>
            <b-progress height={} class="progress-xs mt-2" :precision="1" :value="40"></b-progress>
          </b-col>
        </b-row>
      </div>
    </b-card>
    
    <b-row v-if="!isCompanyUser">
      <b-col md="12">
        <b-card header="Traffic &amp; Sales">
          <b-row>
            <b-col sm="12" lg="6">
              <b-row>
                <b-col sm="6">
                  <Callout variant="info">
                    <small class="text-muted">New Clients</small><br>
                    <strong class="h4">9,123</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <!--<callout-chart-example :data="[35, 23, 56, 22, 97, 23, 64]" variant="#20a8d8" width="80" height="30" />-->
                      <callout-chart-example chartId="callout-chart-01" :data="[35, 23, 56, 22, 97, 23, 64]" variant="info" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
                <b-col sm="6">
                  <Callout variant="danger">
                    <small class="text-muted">Recurring Clients</small><br>
                    <strong class="h4">22,643</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-02" :data="[65, 59, 84, 84, 51, 55, 40]" variant="danger" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
              </b-row>
              <hr class="mt-0">
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Monday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress class="progress-xs" variant="info" :value="34" height={} />
                  <b-progress class="progress-xs" variant="danger" :value="78" height={} />
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Tuesday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="56" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="94" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Wednesday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="12" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="67" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Thursday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="43" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="91" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Friday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="22" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="73" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Saturday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="53" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="82" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Sunday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="9" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="69" variant="danger"></b-progress>
                </div>
              </div>
              <div class="legend text-center">
                <small>
                  <sup><b-badge pill variant="info">&nbsp;</b-badge></sup>
                  New clients
                  &nbsp;&nbsp;
                  <sup><b-badge pill variant="danger">&nbsp;</b-badge></sup>
                  Recurring clients
                </small>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <b-row>
                <b-col sm="6">
                  <Callout variant="warning">
                    <small class="text-muted">Pageviews</small><br>
                    <strong class="h4">78,623</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-03" :data="[35, 23, 56, 22, 97, 23, 64]" variant="#f8cb00" width="80" height="30"/>
                    </div>
                  </Callout>
                </b-col>
                <b-col sm="6">
                  <Callout variant="success">
                    <small class="text-muted">Organic</small><br>
                    <strong class="h4">49,123</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-04" :data="[65, 59, 84, 84, 51, 55, 40]" variant="#4dbd74" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
              </b-row>
              <hr class="mt-0">
              <ul class="horizontal-bars type-2">
                <div class="progress-group">
                  <div class="progress-group-header">
                    <i class="icon-user progress-group-icon"></i>
                    <span class="title">Male</span>
                    <span class="ml-auto font-weight-bold">43%</span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="43" variant="warning"></b-progress>
                  </div>
                </div>
                <div class="progress-group mb-5">
                  <div class="progress-group-header">
                    <i class="icon-user-female progress-group-icon"></i>
                    <span class="title">Female</span>
                    <span class="ml-auto font-weight-bold">37%</span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="37" variant="warning"></b-progress>
                  </div>
                </div>
                <div class="progress-group">
                  <div class="progress-group-header">
                    <i class="icon-globe progress-group-icon"></i>
                    <span class="title">Organic Search</span>
                    <span class="ml-auto font-weight-bold">191,235 <span class="text-muted small">(56%)</span></span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="56" variant="success"></b-progress>
                  </div>
                </div>
                <div class="progress-group">
                  <div class="progress-group-header">
                    <i class="icon-social-facebook progress-group-icon"></i>
                    <span class="title">Facebook</span>
                    <span class="ml-auto font-weight-bold">51,223 <span class="text-muted small">(15%)</span></span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="15" variant="success"></b-progress>
                  </div>
                </div>
                <div class="progress-group">
                  <div class="progress-group-header">
                    <i class="icon-social-twitter progress-group-icon"></i>
                    <span class="title">Twitter</span>
                    <span class="ml-auto font-weight-bold">37,564 <span class="text-muted small">(11%)</span></span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="11" variant="success"></b-progress>
                  </div>
                </div>
                <div class="progress-group">
                  <div class="progress-group-header">
                    <i class="icon-social-linkedin progress-group-icon"></i>
                    <span class="title">LinkedIn</span>
                    <span class="ml-auto font-weight-bold">27,319 <span class="text-muted small">&nbsp;(8%)</span></span>
                  </div>
                  <div class="progress-group-bars">
                    <b-progress height={} class="progress-xs" :value="8" variant="success"></b-progress>
                  </div>
                </div>
                <div class="divider text-center">
                  <b-button variant="link" size="sm" class="text-muted"><i class="icon-options"></i></b-button>
                </div>
              </ul>
            </b-col>
          </b-row>
          <br/>
          <b-table class="mb-0 table-outline" responsive="sm" hover :items="tableItems" :fields="tableFields" head-variant="light">
            <div slot="user" slot-scope="item">
              <div>{{item.value.name}}</div>
              <div class="small text-muted">
                Registered: {{item.value.registered}}
              </div>
            </div>
            <div slot="usage" slot-scope="item">
              <div class="clearfix">
                <div class="float-left">
                  <strong>{{item.value.value}}</strong>
                </div>
                <div class="float-right">
                  <small class="text-muted">{{item.value.period}}</small>
                </div>
              </div>
              <b-progress height={} class="progress-xs" v-model="item.value.value" :variant="variant(item.value.value)"></b-progress>
            </div>
            <div slot="jobs" slot-scope="item">
              <strong>{{item.value}}</strong>
            </div>
            <div slot="activity" slot-scope="item">
              <div class="small text-muted">Last Print</div>
              <strong>{{item.value}}</strong>
            </div>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-if="isCompanyUser">
      <b-col md="12">
        <b-card header="Traffic &amp; Sales">
          <b-row>
            <b-col sm="12">
              <hr class="mt-0">
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Monday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress class="progress-xs" variant="info" :value="34" height={} />
                  <b-progress class="progress-xs" variant="danger" :value="78" height={} />
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Tuesday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="56" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="94" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Wednesday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="12" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="67" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Thursday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="43" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="91" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Friday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="22" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="73" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Saturday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="53" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="82" variant="danger"></b-progress>
                </div>
              </div>
              <div class="progress-group mb-4">
                <div class="progress-group-prepend">
                  <span class="progress-group-text">
                    Sunday
                  </span>
                </div>
                <div class="progress-group-bars">
                  <b-progress height={} class="progress-xs" :value="9" variant="info"></b-progress>
                  <b-progress height={} class="progress-xs" :value="69" variant="danger"></b-progress>
                </div>
              </div>
              <div class="legend text-center">
                <small>
                  <sup><b-badge pill variant="info">&nbsp;</b-badge></sup>
                  New clients
                  &nbsp;&nbsp;
                  <sup><b-badge pill variant="danger">&nbsp;</b-badge></sup>
                  Recurring clients
                </small>
              </div>
            </b-col>
            <b-col sm="12" lg="6">
              <b-row>
                <b-col sm="6">
                  <Callout variant="warning">
                    <small class="text-muted">Pageviews</small><br>
                    <strong class="h4">78,623</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-03" :data="[35, 23, 56, 22, 97, 23, 64]" variant="#f8cb00" width="80" height="30"/>
                    </div>
                  </Callout>
                </b-col>
                <b-col sm="6">
                  <Callout variant="success">
                    <small class="text-muted">Organic</small><br>
                    <strong class="h4">49,123</strong>
                    <div class="chart-wrapper" :style="{ top: '-10px'}">
                      <callout-chart-example chartId="callout-chart-04" :data="[65, 59, 84, 84, 51, 55, 40]" variant="#4dbd74" width="80" height="30" />
                    </div>
                  </Callout>
                </b-col>
              </b-row>
              <hr class="mt-0">
            </b-col>
          </b-row>
          <br/>
          <b-table class="mb-0 table-outline" responsive="sm" hover :items="tableItemsCompany" :fields="tableFields" head-variant="light">
            <div slot="user" slot-scope="item">
              <div>{{item.value.name}}</div>
              <div class="small text-muted">
                Registered: {{item.value.registered}}
              </div>
            </div>
            <div slot="usage" slot-scope="item">
              <div class="clearfix">
                <div class="float-left">
                  <strong>{{item.value.value}}</strong>
                </div>
                <div class="float-right">
                  <small class="text-muted">{{item.value.period}}</small>
                </div>
              </div>
              <b-progress height={} class="progress-xs" v-model="item.value.value" :variant="variant(item.value.value)"></b-progress>
            </div>
            <div slot="jobs" slot-scope="item">
              <strong>{{item.value}}</strong>
            </div>
            <div slot="activity" slot-scope="item">
              <div class="small text-muted">Last Print</div>
              <strong>{{item.value}}</strong>
            </div>
          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CardLine1ChartExample from './dashboard/CardLine1ChartExample'
import CardLine2ChartExample from './dashboard/CardLine2ChartExample'
import CardLine3ChartExample from './dashboard/CardLine3ChartExample'
import CardBarChartExample from './dashboard/CardBarChartExample'
import MainChartExample from './dashboard/MainChartExample'
import SocialBoxChartExample from './dashboard/SocialBoxChartExample'
import CalloutChartExample from './dashboard/CalloutChartExample'
import { Callout } from '@coreui/vue'

import { store } from '../shared/store';

import { API } from 'aws-amplify';

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

export default {

  name: 'dashboard',
  components: {
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
      noRegForReport: false,
      regExistsButOtherCompany: false,
      regReportFetchInProgress: false,
      selected: 'Month',
      userObj: {},
      isCompanyUser: false,
      tableItems: [
        {
          user: { name: 'Audi Guildford', new: true, registered: 'Jan 1, 2019' },
          usage: { value: 50, period: 'Jan 1, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '10 sec ago'
        },
        {
          user: { name: 'Andrew Page', new: false, registered: 'Feb 3, 2019' },
          usage: { value: 22, period: 'Feb 3, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '5 minutes ago'
        },
        {
          user: { name: 'Whoopee Fleet', new: true, registered: 'Jan 17, 2019' },
          usage: { value: 74, period: 'Jan 17, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '1 hour ago'
        },
        {
          user: { name: 'VW Basingstoke', new: true, registered: 'Jan 12, 2019' },
          usage: { value: 98, period: 'Jan 12, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last month'
        },
        {
          user: { name: 'Hookie Motors', new: true, registered: 'Mar 4, 2019' },
          usage: { value: 22, period: 'Mar 4, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last week'
        },
        {
          user: { name: 'Aston MArtin London', new: true, registered: 'Jan 25, 2019' },
          usage: { value: 43, period: 'Jan 25, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last week'
        }
      ],
      tableItemsCompany: [
        {
          user: { name: 'Guildford Audi', new: true, registered: 'Jan 1, 2019' },
          usage: { value: 50, period: 'Jan 1, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '10 sec ago'
        },
        {
          user: { name: 'Basingstoke Audi', new: false, registered: 'Feb 3, 2019' },
          usage: { value: 22, period: 'Feb 3, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '5 minutes ago'
        },
        {
          user: { name: 'Camberley Audi', new: true, registered: 'Jan 17, 2019' },
          usage: { value: 74, period: 'Jan 17, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: '1 hour ago'
        },
        {
          user: { name: 'Basingstoke Audi', new: true, registered: 'Jan 12, 2019' },
          usage: { value: 98, period: 'Jan 12, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last month'
        },
        {
          user: { name: 'Guildford Audi', new: true, registered: 'Mar 4, 2019' },
          usage: { value: 22, period: 'Mar 4, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last week'
        },
        {
          user: { name: 'Guildford Audi', new: true, registered: 'Jan 25, 2019' },
          usage: { value: 43, period: 'Jan 25, 2019 - Jun 28, 2019' },
          jobs: '185',
          activity: 'Last week'
        }
      ],
      tableFields: {
        user: {
          label: 'Site'
        },
        usage: {
          label: 'Plates Printed'
        },
        jobs: {
          label: 'Jobs',
          class: 'text-center'
        },
        activity: {
          label: 'Activity'
        }
      }
    }
  },
  mounted() {
    console.log(store.userAuthToken);
  },
  created() {
    this.getUser();
    this.testAPI();
  },
  methods: {
    async testAPI() {
      const users = await API.get('PlatePrintAPI','/companies');
      console.log('data: ', users);
    },
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    },
    flag (value) {
      return 'flag-icon flag-icon-' + value
    },
    getUser() {
      this.$data.userObj = JSON.parse(localStorage.getItem('user'));
      if (this.$data.userObj.auth == "CompanyUsers") {
        this.$data.isCompanyUser = true;
      }
      else {
        this.$data.isCompanyUser = false;
      }
    },
    getRegReport() {
      // rest flags
      this.$data.noRegForReport = false;
      this.$data.regExistsButOtherCompany = false;
      this.$data.regReportFetchInProgress = true;
      getRegReport(this.$http, this.$data.instantRegValue)
        .then((data) => {
          if (data.plates.length == 0) {
            this.$data.noRegForReport = true;
            this.$data.regReportFetchInProgress = false;
          }
          else {
            let userObj = JSON.parse(localStorage.getItem('user'));
            if (userObj.company_id == data.plates[0].group_id) {
              this.$router.push({ path: `/regreport/${this.$data.instantRegValue}` });
            }
            else {
              console.log(userObj.company_id);
              console.log(data.plates[0].company_id);
              this.$data.regExistsButOtherCompany = true;
              this.$data.regReportFetchInProgress = false;
            }
          }
        });
    }
  }
}
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }
</style>
