<template>
  <div class="animated fadeIn">
    <div class="viewMode">
      <b-row v-if="!isFromTC">
        <b-col sm="8">
          <p class="toolbar">
            <b-button v-on:click="clearAllFields" variant="secondary">
              <i class="fa fa-file-o"></i>&nbsp;New
            </b-button>
            <b-button v-on:click="toggleLoadTemplateModal" variant="secondary">
              <i class="fa fa-folder-open-o"></i>&nbsp;Load Template
            </b-button>
            <b-button v-on:click="toggleSaveTemplateModal" variant="secondary">
              <i class="fa fa-floppy-o"></i>&nbsp;Save Template
            </b-button>
            <b-button v-on:click="toggleAuditEntryModal" variant="warning" :disabled="selectedPlateType != 'retail'">
              <i class="fa fa-clone"></i>&nbsp;Retail Customers
            </b-button>
            <b-button
              v-if="isSettingsAvailable"
              v-on:click="toggleTemplateSettingsModal"
              variant="secondary"
              :visible="isSettingsAvailable"
            >
              <i class="fa fa-cog"></i>&nbsp;Settings
            </b-button>
            <b-button
              v-if="plateProperties.isBarcodePrint == 1"
              v-on:click="printBarcode"
              variant="secondary"
              style="display: none;"
            >
              <i class="fa fa-print"></i>&nbsp;Reprint Barcode
            </b-button>
          </p>
        </b-col>
        <b-col class="toolbar-template-name" sm="4">
          <p class="toolbar">
            <b-button v-on:click="printPlate" variant="success" :disabled="!canPlateBePrinted">
              <span v-if="!printJobRunning">
                <i class="fa fa-print"></i>&nbsp;Print Plate
              </span>
              <span v-if="printJobRunning">
                <i class="fa fa-spin fa-spinner"></i>&nbsp;Printing plate...
              </span>
            </b-button>
            <label>
              Template Name:
              <span class="template-name" v-text="currentTemplateName"></span>
            </label>
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="!isFromTC" sm="5">
          <b-card>
            <div slot="header">
              <strong>Registration</strong>
              <div class="reg-header-options">
                <b-form-group
                  :horizontal="true">
                  <b-form-radio-group
                    id="tradeOrRetailOptions"
                    name="plateTypeOption">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="optionTrade" name="plateTypeOption" class="custom-control-input" value="trade" v-model="selectedPlateType">
                      <label class="custom-control-label" for="optionTrade">Trade</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="optionRetail" name="plateTypeOption" class="custom-control-input" value="retail" v-model="selectedPlateType">
                      <label class="custom-control-label" for="optionRetail">Retail</label>
                    </div>
                  </b-form-radio-group>
                </b-form-group>
              </div>
            </div>
            <div class="form-container">
              <b-row>
                <b-col sm="6">
                  <b-form-group>
                    <label for="plateTextInput">Registration Number</label>
                    <b-form-input
                      v-model="plateProperties.plateTextInput"
                      type="text"
                      class="uppercase"
                      id="plateTextInput"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="6">
                  <b-form-group>
                    <label for="plateWIPInput">WIP/Job No:</label>
                    <b-form-input
                      v-model="plateProperties.plateWIPInput"
                      type="number"
                      id="plateWIPInput"
                      value="0"
                      min="0"
                      :disabled="selectedPlateType == 'retail'"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="barcodeValue">Stock Number</label>
                    <b-input-group>
                      <b-form-input
                        v-model="plateProperties.barcodeValue"
                        type="text"
                        id="barcodeValue"
                      ></b-form-input>
                      <!-- Attach Right button -->
                      <b-input-group-append>
                        <b-button
                          v-on:click="toggleBarcodePreviewModal"
                          variant="primary"
                          :disabled="!isBarcodeAvailable"
                        >
                          <i class="fa fa-barcode"></i>&nbsp;Preview
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-col>
        <b-col sm="7">
          <b-card>
            <div slot="header">
              <strong>Post Code &amp; Slogan</strong>
            </div>
            <div class="form-container">
              <b-row>
                <b-col sm="5">
                  <b-form-group>
                    <label for="plateMessageInput">Slogan</label>
                    <b-input-group>
                      <b-form-input
                        v-model="plateProperties.plateMessageInput"
                        type="text"
                        id="plateMessageInput"
                      ></b-form-input>
                      <!-- Attach Right button -->
                      <b-input-group-append>
                        <b-button v-on:click="toggleSloganFontSettingsModal" variant="primary">
                          <i class="fa fa-font"></i>&nbsp;Font
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col sm="5">
                  <b-form-group>
                    <label for="platePostCodeInput">Post Code</label>
                    <b-input-group>
                      <b-form-input
                        v-model="plateProperties.platePostCodeInput"
                        type="text"
                        id="platePostCodeInput"
                        class="uppercase"
                      ></b-form-input>
                      <!-- Attach Right button -->
                      <b-input-group-append>
                        <b-button v-on:click="togglePostCodeFontSettingsModal" variant="primary">
                          <i class="fa fa-font"></i>&nbsp;Font
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="platePostCodePosition">Position</label>
                    <b-form-select
                      id="platePostCodePosition"
                      v-model="plateProperties.platePostCodePosition"
                      :plain="true"
                      :options="platePostCodePostions"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="6">
                  <b-form-group>
                    <label for="plateBorderColour">Plate Artwork</label>
                    <vue-base64-file-upload
                      class="v1"
                      accept="image/png, image/jpeg"
                      image-class="image-upload-hidden"
                      input-class="form-control"
                      :max-size="2"
                      @size-exceeded="onArtworkSizeExceeded"
                      @file="onArtworkFile"
                      @load="onArtworkLoad"
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="plateArtworkSize">Size (mm)</label>
                    <b-form-input
                      v-model="plateProperties.plateArtworkSize"
                      type="number"
                      id="plateArtworkSize"
                      value="0"
                      min="0"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="plateArtworkRaise">Raise</label>
                    <b-form-input
                      v-model="plateProperties.plateArtworkRaise"
                      type="number"
                      id="plateArtworkRaise"
                      value="0"
                      min="0"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="plateArtworkOffset">Offset</label>
                    <b-form-input
                      v-model="plateProperties.plateArtworkOffset"
                      type="number"
                      id="plateArtworkOffset"
                      value="0"
                      min="0"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="3">
          <b-card>
            <div slot="header">
              <strong>Plate Size</strong>
            </div>
            <div class="form-container">
              <b-row>
                <b-col sm="12">
                  <b-form-group>
                    <label for="plateSize">Sizes</label>
                    <b-form-select
                      id="plateSize"
                      v-model="plateProperties.plateSelectedSize"
                      :plain="true"
                      :options="plateSizesSelect"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-col>
        <b-col sm="9">
          <b-card>
            <div slot="header">
              <strong>Border, Logo &amp; GB Logo</strong>
            </div>
            <div class="form-container">
              <b-row>
                <b-col sm="1">
                  <b-form-group>
                    <label for="isPrintBorder">Border</label>
                    <br />
                    <c-switch
                      :disabled='false'
                      class="mx-1"
                      id="isPrintBorder"
                      name="isPrintBorder"
                      color="primary"
                      v-model="plateProperties.isPrintBorder"
                      label
                      value="1"
                      uncheckedValue="0"
                      data-on="yes"
                      data-off="no"
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <b-form-group>
                    <label for="plateBorderMargin">Margin</label>
                    <b-form-input
                      :disabled='false'
                      v-model="plateProperties.plateBorderMargin"
                      type="number"
                      id="plateBorderMargin"
                      value="7"
                      min="1"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="2">
                  <label for="plateBorderWidth">Width</label>
                  <b-form-input
                    :disabled='false'
                    v-model="plateProperties.plateBorderWidth"
                    type="number"
                    class="form-control"
                    id="plateBorderWidth"
                    value="2"
                    min="1"
                  ></b-form-input>
                </b-col>
                <b-col sm="1">
                  <b-form-group>
                    <label for="isPrintMarque">GB Logo</label>
                    <br />
                    <c-switch
                      class="mx-1"
                      id="isPrintMarque"
                      name="isPrintMarque"
                      color="primary"
                      v-model="plateProperties.isPrintMarque"
                      label
                      value="1"
                      uncheckedValue="0"
                      data-on="yes"
                      data-off="no"
                    />
                  </b-form-group>
                </b-col>
                <b-col sm="3">
                  <b-form-group>
                    <label for="plateMarqueWidth">Logo Width</label>
                    <b-form-input
                      :disabled='true'
                      v-model="plateProperties.plateMarqueWidth"
                      type="text"
                      id="plateMarqueWidth"
                      value="0"
                      min="0"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col sm="1">
                  <b-form-group>
                    <label for="isPrintBSAU">BSAU Text</label>
                    <br />
                    <c-switch
                      :disabled='true'
                      class="mx-1"
                      id="isPrintBSAU"
                      name="isPrintBSAU"
                      color="primary"
                      v-model="plateProperties.isPrintBSAU"
                      label
                      value="1"
                      uncheckedValue="0"
                      data-on="yes"
                      data-off="no"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-if="isFromTC">
        <b-col sm="2">
          <p class="button-area">
            <b-button v-on:click="toggleSaveTemplateModal" variant="primary">
              <i class="fa fa-floppy-o"></i>&nbsp;Save Template
            </b-button>
          </p>
        </b-col>
        <b-col sm="1">
          <b-form-group>
            <label for="isDefaultTemplate">Default Template</label>
            <br />
            <c-switch
              class="mx-1"
              id="isDefaultTemplate"
              name="isDefaultTemplate"
              color="primary"
              v-model="plateProperties.isDefaultTemplate"
              label
              value="1"
              uncheckedValue="0"
              data-on="yes"
              data-off="no"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <div class="reg-output">
        <b-row>
          <b-col sm="12">
            <div
              ref="platePrintAreaOuter"
              id="platePrintAreaOuter"
              v-bind:style="platePrintStyleObject"
            >
              <div ref="marque" id="marque">
                <img ref="marque-image" id="marque-image" src="../assets/eu-stars.svg" />
                <span ref="marque-slogan" id="marque-slogan">GB</span>
              </div>
              <div ref="platePrintArea" id="platePrintArea">
                <div
                  ref="plateRender"
                  id="plateRender"
                  v-bind:style="plateRenderStyle"
                  v-text="plateProperties.plateTextInput"
                ></div>
                <div id="plateFooter">
                  <div
                    v-if="plateProperties.plateMessageInput.length > 0"
                    ref="sloganMessage"
                    id="sloganMessage"
                    v-text="plateProperties.plateMessageInput"
                    v-bind:style="sloganStyle"
                  ></div>
                  <div
                    v-if="plateProperties.platePostCodeInput.length > 0"
                    ref="sloganPostcode"
                    id="sloganPostcode"
                    v-text="plateProperties.platePostCodeInput"
                    v-bind:style="postcodeStyle"
                  ></div>
                  <div
                    v-if="plateProperties.plateMessageInput.length <= 0"
                    ref="plateArtwork"
                    id="plateArtwork"
                  >
                    <img
                      v-bind:src="plateProperties.plateArtworkImage"
                      v-bind:style="plateArtworkStyle"
                    />
                  </div>
                </div>
                <div
                  ref="bsau"
                  id="bsau"
                  v-text="plateProperties.plateBSAUInput"
                  v-bind:style="plateBSAUStyle"
                ></div>
                <div
                  v-if="plateProperties.plateLogo.length > 0"
                  class="slogan"
                  ref="plateLogo"
                  id="plateLogo"
                >
                  <img v-bind:src="plateProperties.plateLogo" />
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- modals -->
    <b-modal
      title="Barcode Preview"
      class="modal-warning"
      v-model="activeBarcodePreviewModal"
      hide-footer
    >
      <div class="form-container barcode-container">
        <b-row>
          <b-col sm="12">
            <barcode
              v-bind:value="plateProperties.barcodeValue"
              format="CODE39"
              v-bind:text="plateProperties.plateTextInput"
            >No Barcode To Display</barcode>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100">
          <b-button size="sm" class="float-right" @click="activeBarcodePreviewModal=false">Cancel</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      title="Save Template"
      class="modal-warning"
      v-model="activeStateSaveTemplateModal"
      hide-footer
    >
      <div class="form-container">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="templateName">Template Name</label>
              <b-form-input v-model="plateProperties.templateName" type="text" id="templateName"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <b-button v-on:click="saveTemplate" variant="primary" :disabled="!allowTemplateSave">
                <i class="fa fa-floppy-o"></i>&nbsp;Save Template
              </b-button>
              <b-alert v-if="templateSaveInProgress" variant="info" show>
                <strong>Saving template. Please wait...</strong>
              </b-alert>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      title="Load Template"
      class="modal-warning"
      v-model="activeStateLoadTemplateModal"
      hide-footer
    >
      <div class="form-container">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <label for="selectedTemplate">Template Name</label>
              <b-form-select
                id="selectedTemplate"
                v-if="templatesLoaded"
                v-model="plateProperties.selectedTemplateId"
                :plain="true"
                :options="loadedTemplates"
              ></b-form-select>
              <div v-if="!templatesLoaded">
                <i class="fa fa-spin fa-spinner"></i>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <b-button v-on:click="loadTemplate" variant="primary" :disabled="!allowTemplateLoad">
                <i class="fa fa-folder-open-o"></i>&nbsp;Load Template
              </b-button>
            </b-form-group>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100">
          <b-button size="sm" class="float-right" @click="activeStateLoadTemplateModal=false">Cancel</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      title="Retail Customers"
      size="lg"
      class="modal-warning"
      v-model="activeStateAuditModal"
      hide-footer
    >
      <div class="form-container">
        <template slot="title">
          <i class="icon-basket-loaded"></i>
          {{auditTabs[1]}}
        </template>
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
                      <label for="contactTitle">
                        Title
                      </label>
                      <b-form-select
                        id="contactTitle"
                        v-if="contactTitlesLoaded"
                        v-model="newRetailContact.title_id"
                        :plain="true"
                        :options="contactTitles"
                      ></b-form-select>
                      <div v-if="!contactTitlesLoaded">
                        <i class="fa fa-spin fa-spinner"></i>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="contactFirstName">
                        First Name
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.first_name"
                        type="text"
                        id="contactFirstName"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="contactLastName">
                        Last Name
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.last_name"
                        type="text"
                        id="contactLastName"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="contactEmail">
                        Email
                      </label>
                      <b-form-input v-model="newRetailContact.email" type="text" id="contactEmail"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="contactPhone">Phone No</label>
                      <b-form-input
                        v-model="newRetailContact.phone_number"
                        type="text"
                        id="contactPhone"
                      ></b-form-input>
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
                      <label for="addressPropertyNumber">
                        Property No
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.address.property_number"
                        type="text"
                        id="addressPropertyNumber"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="addressAddress1">
                        Address
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.address.address1"
                        type="text"
                        id="addressAddress1"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="addressTown">
                        Town
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.address.town"
                        type="text"
                        id="addressTown"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="addressPostCode">
                        Post Code
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.address.post_code"
                        type="text"
                        id="addressPostCode"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="addressCounty">
                        County
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-select
                        id="addressCounty"
                        v-if="countiesLoaded"
                        v-model="newRetailContact.address.county_id"
                        :plain="true"
                        :options="counties"
                      ></b-form-select>
                      <div v-if="!countiesLoaded">
                        <i class="fa fa-spin fa-spinner"></i>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="addressCountry">
                        Country
                      </label>
                      <b-form-select
                        id="addressCountry"
                        v-if="countriesLoaded"
                        v-model="newRetailContact.address.country_id"
                        :plain="true"
                        :options="countries"
                      ></b-form-select>
                      <div v-if="!countriesLoaded">
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
                      <label for="proofOfId">
                        Proof of Identity
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-select
                        id="proofOfId"
                        v-if="proofOfIdsLoaded"
                        v-model="newRetailContact.proof_of_id"
                        :plain="true"
                        :options="proofOfIds"
                      ></b-form-select>
                      <div v-if="!proofOfIdsLoaded">
                        <i class="fa fa-spin fa-spinner"></i>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="proofOfIdRef">
                        Identity Reference
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.proof_of_id_ref"
                        type="text"
                        id="proofOfIdRef"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label v-if="isIdentityUploadSelected">
                        Upload Identity (Or
                        <span
                          class="upload-switch"
                          v-on:click="isIdentityUploadSelected = !isIdentityUploadSelected"
                        >Capture</span>)
                      </label>
                      <label v-if="!isIdentityUploadSelected">
                        Capture Identity (Or
                        <span
                          class="upload-switch"
                          v-on:click="isIdentityUploadSelected = !isIdentityUploadSelected"
                        >Upload</span>)
                      </label>
                      <vue-base64-file-upload
                        v-if="isIdentityUploadSelected"
                        class="v1"
                        accept="image/png, image/jpeg"
                        image-class="image-upload-display"
                        input-class="form-control"
                        :max-size="2"
                        @size-exceeded="onIdSizeExceeded"
                        @file="onIdFile"
                        @load="onIdLoad"
                      />

                      <div v-if="!isIdentityUploadSelected" class="capture-image-div">
                        <img
                          v-if="isIdentityCaptureComplete"
                          v-bind:src="capturesIdentity[0].image"
                          class="image-upload-display"
                        />
                        <div
                          class="vue-base64-file-upload-wrapper"
                          style="position: relative; width: 100%;"
                        >
                          <input
                            type="text"
                            v-on:click="toggleIdentityImageCaptureModal()"
                            placeholder="Click here to capture image"
                            readonly
                            class="form-control"
                            style="width: 100%; cursor: pointer;"
                          />
                        </div>
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="proofOfEntitlement">
                        Proof of Entitlement
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-select
                        id="proofOfEntitlement"
                        v-if="proofOfEntitlementLoaded"
                        v-model="newRetailContact.proof_of_entitlement"
                        :plain="true"
                        :options="proofOfEntitlements"
                      ></b-form-select>
                      <div v-if="!proofOfEntitlementLoaded">
                        <i class="fa fa-spin fa-spinner"></i>
                      </div>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="proofOfEntitlementRef">
                        Entitlement Reference
                        <span class="mandatory">*</span>
                      </label>
                      <b-form-input
                        v-model="newRetailContact.proof_of_entitlement_ref"
                        type="text"
                        id="proofOfEntitlementRef"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label v-if="isEntitlementUploadSelected">
                        Upload Entitlement (Or
                        <span
                          class="upload-switch"
                          v-on:click="isEntitlementUploadSelected = !isEntitlementUploadSelected"
                        >Capture</span>)
                      </label>
                      <label v-if="!isEntitlementUploadSelected">
                        Capture Entitlement (Or
                        <span
                          class="upload-switch"
                          v-on:click="isEntitlementUploadSelected = !isEntitlementUploadSelected"
                        >Upload</span>)
                      </label>
                      <vue-base64-file-upload
                        v-if="isEntitlementUploadSelected"
                        class="v1"
                        accept="image/png, image/jpeg"
                        image-class="image-upload-display"
                        input-class="form-control"
                        :max-size="2"
                        @size-exceeded="onIdSizeExceeded"
                        @file="onEntFile"
                        @load="onEntLoad"
                      />

                      <div v-if="!isEntitlementUploadSelected" class="capture-image-div">
                        <img 
                          v-if="isEntitlementCaptureComplete"
                          v-bind:src="capturesEntitlement[0].image"
                          class="image-upload-display" />
                        <div
                          class="vue-base64-file-upload-wrapper"
                          style="position: relative; width: 100%;"
                        >
                          <input
                            type="text"
                            v-on:click="toggleEntitlementImageCaptureModal()"
                            placeholder="Click here to capture image"
                            readonly
                            class="form-control"
                            style="width: 100%; cursor: pointer;"
                          />
                        </div>
                      </div>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="documentVerified">Document Verified</label>
                      <br />
                      <c-switch
                        class="mx-1"
                        id="documentVerified"
                        name="documentVerified"
                        color="primary"
                        v-model="newRetailContact.document_verified"
                        label
                        value="1"
                        uncheckedValue="0"
                        data-on="yes"
                        data-off="no"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12" sm="12" md="12">
                    <p>
                      <b-button
                        v-on:click="toggleAuditEntryModal"
                        variant="primary"
                        :disabled="!retailCanBePrinted"
                      >
                        <i class="fa fa-check"></i>&nbsp;Submit Retail Information
                      </b-button>
                    </p>
                  </b-col>
                </b-row>
                <hr />
              </div>
            </b-card>
          </b-col>
        </b-row>
        <!-- modal -->
        <b-modal
          title="Capture Image"
          class="modal-warning"
          size="lg"
          v-model="activeStateEntitlementImageCaptureModal"
          @ok="toggleEntitlementImageCaptureModal()"
          ok-variant="warning"
        >
          <div class="form-container">
            <b-row>
              <b-col sm="12">
                <div>
                  <video ref="videoEntitlement" id="videoEntitlement" width="700" height="600" autoplay></video>
                </div>
                <b-button v-on:click="captureEntitlementImage()" variant="primary">Take Photo</b-button>
                <canvas ref="canvasEntitlement" id="canvasEntitlement" width="640" height="480"></canvas>
              </b-col>
            </b-row>
          </div>
        </b-modal>
        <b-modal
          title="Capture Image"
          class="modal-warning"
          size="lg"
          v-model="activeStateIdentityImageCaptureModal"
          @ok="toggleIdentityImageCaptureModal()"
          ok-variant="warning"
        >
          <div class="form-container">
            <b-row>
              <b-col sm="12">
                <div>
                  <video ref="videoIdentity" id="videoIdentity" width="700" height="600" autoplay></video>
                </div>
                <b-button v-on:click="captureIdentityImage()" variant="primary">Take Photo</b-button>
                <canvas ref="canvasIdentity" id="canvasIdentity" width="640" height="480"></canvas>
              </b-col>
            </b-row>
          </div>
        </b-modal>
      </div>
    </b-modal>
    <b-modal
      title="New Template"
      class="modal-warning"
      v-model="activeStateNewTemplateModal"
      hide-footer
    >
      <div class="form-container">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <strong>Template</strong>
              </div>
              <div class="form-container">
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="templateName">Template Name</label>
                      <b-form-input
                        v-model="plateProperties.templateName"
                        type="text"
                        id="templateName"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group>
                      <b-button v-on:click="saveTemplate" variant="primary">
                        <i class="fa fa-check"></i>&nbsp;Save Template
                      </b-button>
                      <b-alert v-if="templateSaveInProgress" variant="info" show>
                        <strong>Saving template. Please wait...</strong>
                      </b-alert>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      title="Template Settings"
      size="lg"
      class="modal-warning"
      v-model="activeStateTemplateSettingsModal"
      hide-footer
    >
      <div class="form-container">
        <b-row>
          <b-col sm="12">
            <b-card>
              <div slot="header">
                <strong>Postcode &amp; Slogan</strong>
              </div>
              <div class="form-container">
                <b-row>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="plateMessageRaiseInput">Slogan Raise</label>
                      <b-form-input
                        v-model="plateProperties.plateMessageRaiseInput"
                        type="number"
                        id="plateMessageRaiseInput"
                        value="0"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <label for="plateMessageOffsetInput">Slogan offset</label>
                    <b-form-input
                      v-model="plateProperties.plateMessageOffsetInput"
                      type="number"
                      class="form-control"
                      id="plateMessageOffsetInput"
                      value="0"
                    ></b-form-input>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="platePostCodeRaiseInput">Postcode Raise</label>
                      <b-form-input
                        v-model="plateProperties.platePostCodeRaiseInput"
                        type="number"
                        id="platePostCodeRaiseInput"
                        value="0"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <label for="platePostCodeOffsetInput">Postcode offset</label>
                    <b-form-input
                      v-model="plateProperties.platePostCodeOffsetInput"
                      type="number"
                      class="form-control"
                      id="platePostCodeOffsetInput"
                      value="0"
                    ></b-form-input>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="plateRaiseInput">Raise</label>
                      <b-form-input
                        v-model="plateProperties.plateRaiseInput"
                        type="number"
                        id="plateRaiseInput"
                        value="0"
                        min="0"
                      ></b-form-input>
                    </b-form-group>
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
                <strong>BSAU</strong>
              </div>
              <div class="form-container">
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="plateBSAUInput">Prefix</label>
                      <b-form-input
                        v-model="plateProperties.plateBSAUInput"
                        type="text"
                        id="plateBSAUInput"
                        placeholder="Enter Message"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="plateBSAURaiseInput">Raise</label>
                      <b-form-input
                        v-model="plateProperties.plateBSAURaiseInput"
                        type="number"
                        id="plateBSAURaiseInput"
                        value="5"
                        min="0"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <label for="plateBSAUFontSizeInput">Font Size</label>
                    <b-form-input
                      v-model="plateProperties.plateBSAUFontSizeInput"
                      type="number"
                      id="plateBSAUFontSizeInput"
                      value="5"
                      min="0"
                    ></b-form-input>
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
                <strong>Other Settings</strong>
              </div>
              <div class="form-container">
                <b-row>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="isMirror">Mirror</label>
                      <br />
                      <c-switch
                        class="mx-1"
                        id="isMirror"
                        name="isMirror"
                        color="primary"
                        v-model="plateProperties.isMirror"
                        label
                        value="1"
                        uncheckedValue="0"
                        data-on="yes"
                        data-off="no"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col sm="3">
                    <b-form-group>
                      <label for="isBarcodePrint">Barcode Print</label>
                      <br />
                      <c-switch
                        class="mx-1"
                        id="isBarcodePrint"
                        name="isBarcodePrint"
                        color="primary"
                        v-model="plateProperties.isBarcodePrint"
                        label
                        value="1"
                        uncheckedValue="0"
                        data-on="yes"
                        data-off="no"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col sm="6">
                    <b-form-group>
                      <label for="plateBorderColour">Border Colour</label>
                      <b-form-select
                        id="plateBorderColour"
                        v-model="plateProperties.plateBorderColour"
                        :plain="true"
                        :options="borderColours"
                      ></b-form-select>
                    </b-form-group>
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
                <strong>Printer Settings</strong>
              </div>
              <div class="form-container">
                <b-row>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="platePrinterName">Plate Printer</label>
                      <b-form-select
                        id="platePrinterName"
                        v-model="platePrinterName"
                        :plain="true"
                        :options="printers"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="platePrinterSecondName">Second Plate Printer</label>
                      <b-form-select
                        id="platePrinterSecondName"
                        v-model="platePrinterSecondName"
                        :plain="true"
                        :options="printers"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="4">
                    <b-form-group>
                      <label for="barcodePrinterName">Barcode Printer</label>
                      <b-form-select
                        id="barcodePrinterName"
                        v-model="barcodePrinterName"
                        :plain="true"
                        :options="printers"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
            </b-card>
          </b-col>
        </b-row>
        <div slot="modal-footer" class="w-100">
          <b-button size="sm" class="float-right" @click="activeStateTemplateSettingsModal=false">Ok</b-button>
        </div>
      </div>
    </b-modal>
    <b-modal
      title="Font Settings"
      class="modal-warning"
      v-model="activeStateFontSettingsModal"
      ok-variant="warning"
    >
      <div v-if="fontModalType=='postcode'" class="form-container">
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <label for="platePostCodeFont">Font</label>
              <b-form-select
                id="platePostCodeFont"
                v-model="plateProperties.platePostCodeFont"
                :plain="true"
                :options="plateFonts"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="4">
            <label for="platePostCodeFontSizeInput">Size</label>
            <b-form-input
              v-model="plateProperties.platePostCodeFontSizeInput"
              type="number"
              class="form-control"
              id="platePostCodeFontSizeInput"
              value="7"
              min="0"
            ></b-form-input>
          </b-col>
          <b-col sm="2">
            <b-form-group>
              <label for="isPostCodeItalic">Italic</label>
              <br />
              <c-switch
                class="mx-1"
                id="isPostCodeItalic"
                name="isPostCodeItalic"
                color="primary"
                v-model="plateProperties.isPostCodeItalic"
                label
                value="1"
                uncheckedValue="0"
                data-on="yes"
                data-off="no"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <div v-if="fontModalType=='slogan'" class="form-container">
        <b-row>
          <b-col sm="6">
            <b-form-group>
              <label for="plateMessageFont">Font</label>
              <b-form-select
                id="plateMessageFont"
                v-model="plateProperties.plateMessageFont"
                :plain="true"
                :options="plateFonts"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col sm="4">
            <label for="plateMessageFontSizeInput">Size</label>
            <b-form-input
              v-model="plateProperties.plateMessageFontSizeInput"
              type="number"
              class="form-control"
              id="plateMessageFontSizeInput"
              value="7"
              min="0"
            ></b-form-input>
          </b-col>
          <b-col sm="2">
            <b-form-group>
              <label for="isPlateMessageItalic">Italic</label>
              <br />
              <c-switch
                class="mx-1"
                id="isPlateMessageItalic"
                name="isPlateMessageItalic"
                color="primary"
                v-model="plateProperties.isPlateMessageItalic"
                label
                value="1"
                uncheckedValue="0"
                data-on="yes"
                data-off="no"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      title="Print Plate"
      class="modal-warning"
      v-model="activeStatePrintPlateModal"
      hide-footer
    >
      <div class="form-container">
        <b-row>
          <b-col sm="12">
            <b-form-group>
              <div style="text-align: center;">
                <h4>This plate has been printed previously. Are you sure you wish to reprint?</h4>
              </div>
            </b-form-group>
            <div slot="modal-footer" class="w-100">
              <b-button
                size="sm"
                class="float-right"
                @click="closePrintConfirmModalAndPrint"
              >Reprint</b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>

import { Switch as cSwitch } from '@coreui/vue';
import LoadingSpinner from '../components/loadingSpinner/LoadingSpinner';
import { PassThrough } from 'stream';
import VueBarcode from 'vue-barcode';
import VueBase64FileUpload from 'vue-base64-file-upload';
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { print } from 'util';
import { setTimeout } from 'timers';
const { remote } = require('electron');
const { BrowserWindow, dialog, shell } = remote;
const { ipcRenderer } = require('electron');

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

const getDefaultTemplate = (($http, siteId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('getDefaultTemplate?site_id=' + siteId, headersObj)
            .then((response) => {
                resolve(response.data.template[0]);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getTemplates = (($http, filterObj) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        $http.get('getTemplatesForSelect?company_id=' + filterObj.company_id, headersObj)
            .then((response) => {
                resolve(response.data.templates);
            })
            .catch ((err) => {
                console.error(err);
                reject(err);
            });
    });
});

const getTemplate = (($http, templateId) => {
    return new Promise((resolve, reject) => {
        let headersObj = getHTTPHeaders();
        console.log("template id: ", templateId);
        $http.get('getTemplate?template_id=' + templateId, headersObj)
            .then((response) => {
                resolve(response.data.template[0]);
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

const getPlateSizes = (($http) => {
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

const getSuppliers = (($http) => {
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

const checkPlateExists = (($http, reg) => {
  return new Promise((resolve, reject) => {
    let headersObj = getHTTPHeaders();
    $http.get("plates/exist?vrm=" + reg, headersObj)
      .then((response) => {
        resolve(response.data.plates);
      })
      .catch ((err) => {
        console.error(err);
        reject(err);
      });
  });
});

const getPrinterList = () => {
  let printWindow = new BrowserWindow({ 'auto-hide-menu-bar': true,show:false });
  let list = printWindow.webContents.getPrinters();
  return list;
}

export default {
  name: 'mainDesigner',
  components: {
    cSwitch,
    'barcode': VueBarcode,
    VueBase64FileUpload,
    LoadingSpinner: LoadingSpinner
  },
  data: function () {
    return {
      testCount: 0,
      isFromTC: false,
      barcodePrinterName: 'Citizen CL-E321',
      platePrinterName: 'TSC TTP-247',
      platePrinterSecondName: 'None',
      supplierId: 0,
      auditTabIndex: [0, 0],
      auditTabs: [
        'Trade Customer',
        'Retail Customer'
      ],
      currentTemplateName: "<New template>",
      currentTemplateId: 0,
      PLATE_HEIGHT: 111,
      PLATE_WIDTH: 521,
      EU_LOGO_WIDTH: 45,
      currentTradeCustomer: {
        supplierName: '',
        dvlaLicCode: ''
      },
      currentTradeCustomerLoaded: false,
      plateProperties: {
        isTradeCustomerPrintConfirmed: 0,
        isRetailCustomerPrintConfirmed: 0,
        plateTextInput: '',
        plateRaiseInput: 0,
        plateMessageInput: '',
        plateMessageRaiseInput: 0,
        plateMessageOffsetInput: 0,
        plateMessageFontSizeInput: 5,
        plateMessageFont: 'Arial',
        isPlateMessageItalic: 0,
        platePostCodeInput: '',
        platePostCodeRaiseInput: 0,
        platePostCodePosition: 'Below',
        platePostCodeOffsetInput: 0,
        platePostCodeFontSizeInput: 3,
        platePostCodeFont: 'Arial',
        isPostCodeItalic: 0,
        plateBSAUInput: 'BSAU 145d',
        plateBSAURaiseInput: 0,
        plateBSAUOffsetInput: 0,
        plateBSAUFontSizeInput: 3,
        isPrintBorder: 0,
        plateBorderMargin: 7,
        plateBorderWidth: 2,
        plateBorderColour: '',
        isPrintMarque: 0,
        plateMarqueWidth: 0,
        isMirror: 0,
        templateName: '',
        selectedTemplateId: 0,
        isDefaultTemplate: 0,
        barcodeValue: '',
        plateSelectedSize: 1,
        plateLogo: '',
        isPrintBSAU: 0,
        plateTextLines: 1,
        plateTextLineGap: 0,
        plateArtworkImage: '',
        plateArtworkRaise: 0,
        plateArtworkOffset: 0,
        plateArtworkSize: 7,
        plateWIPInput: '',
        isBarcodePrint: 0,
        plateCode: 'trade'
      },
      newRetailContact: {
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
        is_active: false,
        proof_of_id: 0,
        proof_of_id_ref: '',
        proof_of_id_doc: '',
        identity_description: '',
        proof_of_entitlement: 0,
        proof_of_entitlement_ref: '',
        proof_of_entitlement_doc: '',
        entitlementDescription: '',
        address: {
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
          is_invoice_address: 0,
          is_default_delivery_address: 1,
          is_active: true
        },
      },
      mediaStream: MediaStream,
      capturesEntitlement: [],
      capturesIdentity: [],
      activeStateEntitlementImageCaptureModal: false,
      activeStateIdentityImageCaptureModal: false,
      isEntitlementUploadSelected: false,
      isIdentityUploadSelected: false,
      isEntitlementCaptureComplete: false,
      isIdentityCaptureComplete: false,
      borderColours: [
        {value:'#000000', text:'Black'},
        {value:'#0000ff', text:'Blue'},
        {value:'#00ff00', text:'Green'},
        {value:'#ff0000', text:'Red'}
      ],
      platePostCodePostions: [
        {value: 'Below', text: 'Below'},
        {value: 'Right', text: 'Right'}
      ],
      sloganStyle: {
        fontFamily: 'Arial',
        fontSize: '5mm'
      },
      postcodeStyle: {
        fontFamily: 'Arial',
        fontSize: '3mm',
      },
      plateArtworkStyle: {
        position: 'absolute',
        bottom: 0
      },
      plateRenderStyle: {
        transform: 'inherit'
      },
      plateBSAUStyle: {
        display: 'none'
      },
      plateSizes: [],
      plateSizesSelect: [],
      loadedTemplates: [],
      templatesLoaded: false,
      templateSaveInProgress: false,
      plateSaveInProgress: false,
      overwriteTemplateWhenSaving: true,
      activeStateSaveTemplateModal: false,
      activeStateLoadTemplateModal: false,
      activeStateAuditModal: false,
      activeStateNewTemplateModal: false,
      activeStateTemplateSettingsModal: false,
      activeBarcodePreviewModal: false,
      activeStateImageCaptureModal: false,
      activeStateFontSettingsModal: false,
      fontModalType: 'postcode',
      allowTemplateSave: false,
      allowTemplateLoad: false,
      allowRetailSave: false,
      allowTradeSave: false,
      saveRetailInProgress: false,
      saveRetailError: false,
      contactTitles: [],
      contactTitlesLoaded: false,
      countries: [],
      counties: [],
      countriesLoaded: false,
      countiesLoaded: false,
      proofOfIds: [],
      proofOfEntitlements: [],
      proofOfIdsLoaded: false,
      proofOfEntitlementLoaded: false,
      platePrintStyleObject: {
        width: '520mm',
        height: '111mm',
        widthActual: 520,
        heightActual: 111
      },
      plateFonts: [
        {value: 'Arial', text: 'Arial'},
        {value: 'Arial Black', text: 'Arial Black'},
        {value: 'Bookman', text: 'Bookman'},
        {value: 'Comic Sans MS', text: 'Comic Sans MS'},
        {value: 'Courier', text: 'Courier'},
        {value: 'Courier New', text: 'Courier New'},
        {value: 'Garamond', text: 'Garamond'},
        {value: 'Georgia', text: 'Georgia'},
        {value: 'Helvetica', text: 'Helvetica'},
        {value: 'Impact', text: 'Impact'},
        {value: 'Palatino', text: 'Palatino'},
        {value: 'Times New Roman', text: 'Times New Roman'},
        {value: 'Times', text: 'Times'},
        {value: 'Trebuchet MS', text: 'Trebuchet MS'},
        {value: 'Verdana', text: 'Verdana'}        
      ],
      printers: [],
      currentPlateReprint: false,
      activeStatePrintPlateModal: false,
      printJobRunning: false,
      userObj: {},
      selectedPlateType: 'trade'
    }
  },
  watch: {
    'plateProperties.plateSelectedSize': function(val, oldVal) {
      let selectedPlate = this.$data.plateSizes.filter(item => {
        return item.id === val;
      })[0];
      this.$data.platePrintStyleObject.width = parseInt(selectedPlate.width_in_mm) + 'mm';
      this.$data.platePrintStyleObject.height = parseInt(selectedPlate.height_in_mm) + 'mm';
      this.$data.platePrintStyleObject.widthActual = parseInt(selectedPlate.width_in_mm);
      this.$data.platePrintStyleObject.heightActual = parseInt(selectedPlate.height_in_mm);
      this.resizePlateOutput();
    },
    'plateProperties.plateTextInput': function(val, oldVal) {
      this.$data.plateProperties.plateTextInput = val.toUpperCase();
    },
    'plateProperties.plateRaiseInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        var plateRenderDiv = document.getElementById('plateRender');
        plateRenderDiv.style.marginTop = "-" + raiseVal.toString() + "mm";
    },
    'plateProperties.plateMessageRaiseInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        this.$data.sloganStyle.bottom = raiseVal.toString() + "mm";
        //var slognMessageDiv = document.getElementById('sloganMessage');
        //slognMessageDiv.style.bottom = raiseVal.toString() + "mm";
    },
    'plateProperties.plateMessageFontSizeInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        var slognMessageDiv = document.getElementById('sloganMessage');
        slognMessageDiv.style.fontSize = raiseVal.toString() + "mm";
    },
    'plateProperties.plateMessageOffsetInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        var slognMessageDiv = document.getElementById('sloganMessage');
        slognMessageDiv.style.right = raiseVal.toString() + "mm";
    },
    'plateProperties.platePostCodeInput': function(val, oldVal) {
      this.$data.plateProperties.platePostCodeInput = val.toUpperCase();
    },
    'plateProperties.platePostCodeRaiseInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        this.$data.postcodeStyle.bottom = raiseVal.toString() + "mm";
        //var sloganPostcodeDiv = document.getElementById('sloganPostcode');
        //.style.bottom = raiseVal.toString() + "mm";
    },
    'plateProperties.platePostCodeFontSizeInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        this.$data.postcodeStyle.fontSize = raiseVal.toString() + 'mm';
        //var sloganPostcodeDiv = document.getElementById('sloganPostcode');
        //sloganPostcodeDiv.style.fontSize = raiseVal.toString() + "mm";
    },
    'plateProperties.platePostCodeOffsetInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        this.$data.postcodeStyle.marginLeft = raiseVal.toString() + "mm";
        //var sloganPostcodeDiv = document.getElementById('sloganPostcode');
        //sloganPostcodeDiv.style.right = raiseVal.toString() + "mm";
    },
    'plateProperties.plateBSAURaiseInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        var bsauDiv = document.getElementById('bsau');
        bsauDiv.style.bottom = raiseVal.toString() + "mm";
    },
    'plateProperties.plateBSAUFontSizeInput': function(val, oldVal) {
        let raiseVal = parseInt(val);
        let borderMargin = "0mm";
        var bsauDiv = document.getElementById('bsau');
        bsauDiv.style.fontSize = raiseVal.toString() + "mm";
    },
    'plateProperties.plateBorderColour': function(val, oldVal) {
        let borderColour = val;
        var platePrintAreaDiv = document.getElementById('platePrintArea');
        platePrintAreaDiv.style.borderColor = borderColour;
    },
    'plateProperties.plateBorderMargin': function(val, oldVal) {
      this.setPlateBorderMargin(val, oldVal);
    },
    'plateProperties.plateBorderWidth': function(val, oldVal) {
      this.setPlateBorderWidth(val, oldVal);
    },
    'plateProperties.isPrintBorder': function(val, oldVal) {
      let isBorder = parseInt(val);
      let borderStyle = '';
      const borderWidth = this.$data.plateProperties.plateBorderWidth;
      const borderMarginWidth = this.$data.plateProperties.plateBorderMargin;
      console.log(borderMarginWidth);
      var platePrintAreaDiv = document.getElementById('platePrintArea');
      
      if (isBorder) {
        borderStyle = "solid";
        this.$data.plateProperties.plateRaiseInput = borderWidth;
      }
      else {
        borderStyle = "none";
        this.$data.plateProperties.plateRaiseInput = 0;
      }
      
      platePrintAreaDiv.style.borderStyle = borderStyle;

      this.setPlateBorderMargin(borderMarginWidth, borderMarginWidth);
      this.setPlateBorderWidth(borderWidth, borderWidth);
      this.$data.plateProperties.plateBorderWidth = borderWidth;
    },
    'plateProperties.isPrintMarque': function(val, oldVal) {
        let isMarque = parseInt(val);
        let displayVal = "";
        let floatVal = "";
        let blockWidth = 0;
        let blockWidthCSS = '';
        var platePrintAreaDiv = document.getElementById('platePrintArea');
        var marqueDiv = document.getElementById('marque');
        
        if (isMarque) {
          displayVal = "block";
          floatVal = "right";
          blockWidth = this.$data.platePrintStyleObject.widthActual - this.$data.EU_LOGO_WIDTH;
          if (this.$data.plateProperties.isPrintBorder) {
              let reduceBy = (parseInt(this.$data.plateProperties.plateBorderMargin) * 2) - parseInt(this.$data.plateProperties.plateBorderWidth);
              blockWidth -= reduceBy;
          }
          blockWidthCSS = blockWidth.toString() + "mm";
        }
        else {
          displayVal = "none";
          floatVal = "none";
          blockWidthCSS = "100%";
        }
        
        platePrintAreaDiv.style.float = floatVal;
        platePrintAreaDiv.style.width = blockWidthCSS;
        marqueDiv.style.display = displayVal;
    },
    'plateProperties.templateName': function(val, oldVal) {
      if (val.length > 0) {
        this.$data.allowTemplateSave = true;
      }
      else {
        this.$data.allowTemplateSave = false;
      }
    },
    'plateProperties.selectedTemplateId': function(val, oldVal) {
      console.log('Template: ', val);
      if (val > 0) {
        this.$data.allowTemplateLoad = true;
      }
      else {
        this.$data.allowTemplateLoad = false;
      }
    },
    'plateProperties.platePostCodeFont': function(val, oldVal) {
      this.postcodeStyle.fontFamily = val;
    },
    'plateProperties.plateMessageFont': function(val, oldVal) {
      this.sloganStyle.fontFamily = val;
    },
    'plateProperties.plateArtworkRaise': function(val, oldVal) {
      this.$data.plateArtworkStyle.bottom = val.toString() + 'mm';
    },
    'plateProperties.platePostCodePosition': function(val, oldVal) {
      if (val =='Right') {
        this.$data.sloganStyle.display = 'inline-flex';
        this.$data.postcodeStyle.display = 'inline-flex';
      }
      else {
        this.$data.sloganStyle.display = 'block';
        this.$data.postcodeStyle.display = 'block';
      }
    },
    'plateProperties.plateArtworkRaise': function(val, oldVal) {
      this.$data.plateArtworkStyle.bottom = val.toString() + 'mm';
    },
    'plateProperties.isMirror': function(val, oldVal) {
      if (val == 0) {
        this.$data.plateRenderStyle.transform = 'inherit';
      }
      else {
        this.$data.plateRenderStyle.transform = 'scale(-1, 1)';
      }
    },
    'plateProperties.isPrintBSAU': function(val, oldVal) {
      if (val == 0) {
        this.$data.plateBSAUStyle.display = 'none';
      }
      else {
        this.$data.plateBSAUStyle.display = 'block';
      }
    },
    'activeStateAuditModal': function(val, oldVal) {
      if (val == false) {
        this.$data.isEntitlementCaptureComplete = false;
        this.$data.isIdentityCaptureComplete = false;
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.resizePlateOutput);
    });
    //Init
    this.resizePlateOutput();

    if (this.$route.params.tcsetup === !undefined) {
      this.$data.isFromTC = this.$route.params.tcsetup;
      this.$data.supplierId = this.$route.params.supplierId;
    }

    // get the printer list
    const printerList = getPrinterList();
    this.$data.printers.push({value: 'None', text: 'None'});
    printerList.forEach((printer) => {
      this.$data.printers.push({value: printer.name, text: printer.name});
    });

    // get the user for permissions
    getCurrentUser()
      .then((data) => {
        this.$data.userObj = data;
      });

    // load the plate sizes and the default template
    getPlateSizes(this.$http)
      .then((plateSizes) => {
        this.$data.plateSizes = plateSizes;
        this.$data.plateSizesSelect = plateSizes.map((item) => {
          let plate = {
            value: item.id,
            text: item.plate_size_name + ' (' + parseInt(item.width_in_mm) + 'mm x' + parseInt(item.height_in_mm) + 'mm)'
          };
          return plate;
        });
        this.$data.plateSizesLoaded = true;

        return getCurrentUser(this.$http);
      })
      .then((userDetails) => {
        const userFilter = {
          company_id: userDetails.company_id,
          branch_id: userDetails.branch_id,
          site_id: userDetails.site_id
        };
        this.loadTemplate(userFilter.site_id);
      })
      .catch ((err) => {
        console.error(err);
      });

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizePlateOutput);
  },
  created() {
    this.resizePlateOutput();
  },
  computed: {
    isSettingsAvailable: function() {
      return this.userObj.auth != "Plate Printers" ? true : false;
    },
    isBarcodeAvailable: function () {
      return this.$data.plateProperties.plateTextInput.length > 0 && this.$data.plateProperties.barcodeValue.length > 0;
    },
    hasTemplateBeenLoaded: function() {
      return this.$data.currentTemplateId > 0;
    },
    retailCanBePrinted: function() {
      let returnVal = true;
      if (this.$data.newRetailContact.first_name.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.last_name.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.address.property_number.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.address.address1.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.address.town.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.address.post_code.length < 1) {
        returnVal = false;
      }
      if (this.$data.newRetailContact.address.county_id < 1) {
        returnVal = false;
      }

      return returnVal;
    },
    canPlateBePrinted: function() {
      let returnVal = false;
      if (this.$data.printJobRunning) {
        returnVal = false;
      }

      if (this.$data.selectedPlateType == 'trade') {
        if (this.$data.plateProperties.plateWIPInput.length > 0) {
          returnVal = true;
        }
      }
      else {
        returnVal = this.retailCanBePrinted;
      }
      return returnVal;
    }
  },
  methods: {
    getHTTPHeaders () {
      let userObj = JSON.parse(localStorage.getItem('user'));
      let headerConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': userObj.token,
        }
      }
      return headerConfig;
    },
    toggleEntitlementImageCaptureModal() {
      this.$data.activeStateEntitlementImageCaptureModal = !this.$data.activeStateEntitlementImageCaptureModal;
      if (this.$data.activeStateEntitlementImageCaptureModal) {
        this.$data.capturesEntitlement = [{'id': '0', 'image': ''}];
        this.prepEntitlementVideo();
      }
      else {
        this.$data.mediaStream.getTracks()[0].stop();
        this.$data.mediaStream.getVideoTracks()[0].stop();
        this.$data.mediaStream = null;
        this.$refs.videoEntitlement.srcObject = null;
      }
    },
    toggleIdentityImageCaptureModal() {
      this.$data.activeStateIdentityImageCaptureModal = !this.$data.activeStateIdentityImageCaptureModal;
      if (this.$data.activeStateIdentityImageCaptureModal) {
        this.$data.capturesIdentity = [{'id': '0', 'image': ''}];
        this.prepIdentityVideo();
      }
      else {
        this.$data.mediaStream.getTracks()[0].stop();
        this.$data.mediaStream.getVideoTracks()[0].stop();
        this.$data.mediaStream = null;
        this.$refs.videoIdentity.srcObject = null;
      }
    },
    async prepEntitlementVideo() {
      this.$data.capturesEntitlement = [{'id': '0', 'image': ''}];
      this.$data.mediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
      this.$refs.videoEntitlement.srcObject = this.$data.mediaStream;
    },
    async prepIdentityVideo() {
      this.$data.capturesIdentity = [{'id': '0', 'image': ''}];
      this.$data.mediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
      this.$refs.videoIdentity.srcObject = this.$data.mediaStream;
    },
    captureEntitlementImage() {
        // this.canvas = this.$refs.canvas;
        var context = this.$refs.canvasEntitlement.getContext("2d").drawImage(this.$refs.videoEntitlement, 0, 0, 760, 600);
        this.$data.capturesEntitlement = [{'id': new Date().getTime(), 'image': this.$refs.canvasEntitlement.toDataURL("image/webp")}];
        this.$data.isEntitlementCaptureComplete = true;
        this.toggleEntitlementImageCaptureModal();
    },
    captureIdentityImage() {
        // this.canvas = this.$refs.canvas;
        var context = this.$refs.canvasIdentity.getContext("2d").drawImage(this.$refs.videoIdentity, 0, 0, 760, 600);
        this.$data.capturesIdentity.push({'id': new Date().getTime(), 'image': this.$refs.canvasIdentity.toDataURL("image/webp")});
        this.$data.isIdentityCaptureComplete = true;
        this.toggleIdentityImageCaptureModal();
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
    onArtworkFile() {
        console.log('on Artwork file');
    },
    onArtworkLoad(dataUri) {
        console.log('on Artwork load');
        this.$data.plateProperties.plateArtworkImage = dataUri;
    },
    onArtworkSizeExceeded() {
        console.log('on Artwork exceed');
    },
    setPlateBorderMargin(val, oldVal) {
      let borderMarginVal = parseInt(val);
      let borderMargin = '';
      let platePrintAreaWidth = 0;
      var platePrintAreaDiv = document.getElementById('platePrintArea');
      var platePrintAreaOuterDiv = document.getElementById('platePrintAreaOuter');
      if (isPrintBorder) {
        if (borderMarginVal > 0) {
          borderMargin = borderMarginVal.toString() + "mm";
          platePrintAreaWidth = this.$data.platePrintStyleObject.widthActual - (borderMarginVal * 2);
        }
        else {
          borderMargin = "0mm";
        }
      }
      platePrintAreaDiv.style.width = platePrintAreaWidth + "mm";
      platePrintAreaOuterDiv.style.padding = borderMargin;
    },
    setPlateBorderWidth(val, oldVal) {
      let borderWidthVal = parseInt(val);
      let borderWidth = '';
      let platePrintAreaWidth = 0;
      var platePrintAreaDiv = document.getElementById('platePrintArea');
      
      if (borderWidthVal > 0) {
        borderWidth = borderWidthVal.toString() + "mm";
      }
      else {
        borderWidth = "0mm";
      }
      
      platePrintAreaDiv.style.borderWidth = borderWidth;
    },
    setPlateBorderColour(val, oldVal) {

    },
    resizePlateOutput() {
      var platePrintOuterArea = document.getElementById('platePrintAreaOuter');
      var width = document.getElementById('platePrintAreaOuter').offsetWidth + 75;
      var height = document.getElementById('platePrintAreaOuter').offsetHeight;
      var windowWidth = document.getElementById('main-container').offsetWidth;
      var windowHeight = document.getElementById('main-container').offsetHeight;
      var r = 1;
      r = Math.min(windowWidth / width, windowHeight / height);
      //if (r < 0.8) {
      platePrintOuterArea.style.transform = 'scale(' + r + ')';
      //}
    },
    printPlate() {
      // double check if we're still logged in and no timeout has happened..
      try {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user.token == null) {
          this.$router.push('/pages/login');
        }
      }
      catch (err) {
        // anything wrong, then re-authenticate
        this.$router.push('/pages/login');
      }
      // check to see if the plate exists first
      checkPlateExists(this.$http, this.$data.plateProperties.plateTextInput)
        .then((plateCount) => {
          console.log("reg: ", plateCount);
          if (plateCount > 0) {
            this.$data.currentPlateReprint = true;
            this.$data.activeStatePrintPlateModal = true;
          }
          else {
            this.actualPrintPlate();
          }
        });
    },
    closePrintConfirmModalAndPrint() {
      this.$data.activeStatePrintPlateModal = false;
      this.actualPrintPlate();
      
      /*
      const tempPlates = ['T11T PLT', 'T22T PLT', 'T33T PLT'];
      tempPlates.forEach((plate, i) => {
        console.log(plate + " after " + i.toString());
        window.setTimeout(() => {
          console.log(i.toString());
          this.actualPrintPlate();
        }, 3000 * i);
      });
      */   
    },
    actualPrintPlate() {

      let user = JSON.parse(localStorage.getItem('user'));
      const isRetail = this.$data.selectedPlateType == 'retail';
      let newRetailCustomerId = 0;
      this.$data.printJobRunning = true;

      // first of all, if we're printing a retail customer plate
      // then we need to save the customer details
      let headersObj = this.getHTTPHeaders();

      const content = {
        plateText: this.$data.plateProperties.plateTextInput,
        plateRaise: this.$data.plateProperties.plateRaiseInput,
        sloganMessage: this.$data.plateProperties.plateMessageInput,
        sloganMessageRaise: this.$data.plateProperties.plateMessageRaiseInput,
        sloganMessageOffset: this.$data.plateProperties.plateMessageOffsetInput,
        sloganMessageFontSize: this.$data.plateProperties.plateMessageFontSizeInput,
        postCode: this.$data.plateProperties.platePostCodeInput,
        postCodePosition: this.$data.plateProperties.platePostCodePosition,
        postCodeRaise: this.$data.plateProperties.platePostCodeRaiseInput,
        postCodeOffset: this.$data.plateProperties.platePostCodeOffsetInput,
        postCodeFontSize: this.$data.plateProperties.platePostCodeFontSizeInput,
        plateBSAU: this.$data.plateProperties.plateBSAUInput,
        plateBSAURaise: this.$data.plateProperties.plateBSAURaiseInput,
        plateBSAUOffest: this.$data.plateProperties.plateBSAUOffsetInput,
        plateBSAUFontSize: this.$data.plateProperties.plateBSAUFontSizeInput,
        mirror: this.$data.plateProperties.isMirror,
        printBorder: this.$data.plateProperties.isPrintBorder,
        printMarque: this.$data.plateProperties.isPrintMarque,
        printBorderMargin: this.$data.plateProperties.plateBorderMargin,
        printBorderColour: this.$data.plateProperties.plateBorderColour,
        printBorderWidth: this.$data.plateProperties.plateBorderWidth,
        plateWidth: this.$data.platePrintStyleObject.widthActual,
        plateHeight: this.$data.platePrintStyleObject.heightActual,
        plateTemplate: this.$data.currentTemplateId,
        printerUsed: this.$data.platePrinterName,
        WIPNumber: this.$data.plateProperties.plateWIPInput,
        plateCode: this.$data.selectedPlateType
      };

      let dataPostObjectPlate = {
        plate: {
          group_id: user.company_id,
          branch_id: user.branch_id,
          site_id: user.site_id,
          registration_number: content.plateText,
          raise_by_registration_number_in_mm: content.plateRaise,
          plate_height: content.plateHeight,
          plate_width: content.plateWidth,
          slogan: content.sloganMessage,
          slogan_font_size: content.sloganMessageFontSize,
          is_border: content.printBorder,
          border_colour: content.printBorderColour,
          border_width: content.printBorderWidth,
          border_margin: content.printBorderMargin,
          template_id: content.plateTemplate,
          postcode: content.postCode,
          postcode_position: content.postCodePosition,
          postcode_raise_by: content.postCodeRaise,
          postcode_font_size: content.postCodeFontSize,
          postcode_offset_by: content.postCodeOffset,
          supplier_id: isRetail ? 0 : this.$data.supplierId,
          printer_used: content.printerUsed,
          supplier_wip_number: isRetail ? 0 : content.WIPNumber,
          customer_id: 0,
          plate_code: content.plateCode
        }
      }

      // This is used twice so put it in a function
      const printPlateAndSaveHistory = () => {
        ipcRenderer.send("printPlateHandler", content);

        this.$data.printJobRunning = false;

        // save the printed plate for history and reporting
        this.$data.plateSaveInProgress = true;

        this.$http.post('plates', {
          plate: dataPostObjectPlate.plate
        },
        headersObj)
        .then((response) => {
          console.log(response.data);
          if (response.data.success == true) {
            this.$data.plateSaveInProgress = false;
              
          }
          else {
              // data error
              this.$data.plateSaveInProgress = false;
          }
        })
        .catch ((err) => {
          console.error(err);
          this.$data.plateSaveInProgress = false;
        });

        this.$data.printJobRunning = false;
      };

      if (isRetail) {

        let dataPostObjectRetail = {
          customer: {
            group: user.company_id,
            branch: user.branch_id,
            site: user.site_id,
            category: 1,
            type: 1,
            proofId: this.$data.newRetailContact.proof_of_id,
            proofIdRef: this.$data.newRetailContact.proof_of_id_ref,
            proofIdImg: this.$data.newRetailContact.proof_of_id_doc,
            proofIdTxt: this.$data.newRetailContact.identity_description,
            proofEnt: this.$data.newRetailContact.proof_of_entitlement,
            proofEntRef: this.$data.newRetailContact.proof_of_entitlement_ref,
            proofEntImg: this.$data.newRetailContact.proof_of_entitlement_doc,
            proofEntTxt: this.$data.newRetailContact.entitlementDescription
          },
          address: {
            default: this.$data.newRetailContact.address.is_default_delivery_address,
            property: this.$data.newRetailContact.address.property_number,
            address1: this.$data.newRetailContact.address.address1,
            address2: this.$data.newRetailContact.address.address2,
            address3: this.$data.newRetailContact.address.address3,
            address4: this.$data.newRetailContact.address.address4,
            street: this.$data.newRetailContact.address.street,
            town: this.$data.newRetailContact.address.town,
            postcode: this.$data.newRetailContact.address.post_code,
            county: this.$data.newRetailContact.address.county_id,
            country: this.$data.newRetailContact.address.country_id,
            company: this.$data.newRetailContact.address.company_id,
            group: this.$data.newRetailContact.address.group_id,
            branch: this.$data.newRetailContact.address.branch_id,
            site: this.$data.newRetailContact.address.site_id,
            telephone: this.$data.newRetailContact.address.telephone_number,
            invoiceAddress: this.$data.newRetailContact.address.is_invoice_address,
            addressCategory: this.$data.newRetailContact.address.address_category_id,
            addressType: this.$data.newRetailContact.address.address_type_id
          },
          contact: {
            first: this.$data.newRetailContact.first_name,
            last: this.$data.newRetailContact.last_name,
            title: this.$data.newRetailContact.title_id,
            phone: this.$data.newRetailContact.phone_number,
            mobile: this.$data.newRetailContact.mobile_number,
            email: this.$data.newRetailContact.email,
            company: this.$data.newRetailContact.company_name,
            contactType: this.$data.newRetailContact.contact_type_id,
            contactCategory: this.$data.newRetailContact.contact_category_id,
            contactMethod: this.$data.newRetailContact.contact_method_id,
            contactRole:this.$data.newRetailContact.contact_role_id,
            optInMarketing: this.$data.newRetailContact.opt_in_marketing,
            optInResearch: this.$data.newRetailContact.opt_in_research,
            optInAnonymously: this.$data.newRetailContact.opt_in_anonymously,
            group: this.$data.newRetailContact.group_id,
            branch: this.$data.newRetailContact.branch_id,
            site: this.$data.newRetailContact.site_id,
            is_active: true
          }
        }
        
        // first, save the customer
        this.$http.post('customers/bulk', {
          customer: dataPostObjectRetail.customer,
          address: dataPostObjectRetail.address,
          contact: dataPostObjectRetail.contact
        },
        headersObj)
        .then((response) => {
          console.log(response.data);
          if (response.data.success == true) {
            this.$data.saveError = false;
            dataPostObjectPlate.plate.customer_id = response.data.new_customer_id;
            printPlateAndSaveHistory();
          }
          else {
            // data error
            this.$data.saveError = true;
          }
        })
        .catch ((err) => {
          console.error(err);
          this.$data.saveInProgress = false;
          this.$data.saveError = true;
        });
      }
      else {
        //this.printBarcode();

        printPlateAndSaveHistory();
      }

    },
    clearAllFields() {
      // this is called when the 'New Template' button is clicked
      this.$data.plateProperties.isTradeCustomerPrintConfirmed = 0;
      this.$data.plateProperties.isRetailCustomerPrintConfirmed = 0;
      this.$data.plateProperties.plateTextInput = '';
      this.$data.plateProperties.plateRaiseInput = 0;
      this.$data.plateProperties.plateMessageInput = '';
      this.$data.plateProperties.plateMessageRaiseInput = 0;
      this.$data.plateProperties.plateMessageOffsetInput = 0;
      this.$data.plateProperties.plateMessageFontSizeInput = 5;
      this.$data.plateProperties.plateMessageFont = 'Arial';
      this.$data.plateProperties.isPlateMessageItalic = 0;
      this.$data.plateProperties.platePostCodeInput = '';
      this.$data.plateProperties.platePostCodeRaiseInput = 0;
      this.$data.plateProperties.platePostCodePosition = 'Below';
      this.$data.plateProperties.platePostCodeOffsetInput = 0;
      this.$data.plateProperties.platePostCodeFontSizeInput = 3;
      this.$data.plateProperties.platePostCodeFont = 'Arial';
      this.$data.plateProperties.isPostCodeItalic = 0;
      this.$data.plateProperties.plateBSAUInput = '';
      this.$data.plateProperties.plateBSAURaiseInput = 0;
      this.$data.plateProperties.plateBSAUOffsetInput = 0;
      this.$data.plateProperties.plateBSAUFontSizeInput = 3;
      this.$data.plateProperties.isPrintBorder = 0;
      this.$data.plateProperties.plateBorderMargin = 7;
      this.$data.plateProperties.plateBorderWidth = 2;
      this.$data.plateProperties.plateBorderColour = '';
      this.$data.plateProperties.isPrintMarque = 0;
      this.$data.plateProperties.plateMarqueWidth = 0;
      this.$data.plateProperties.isMirror = 0;
      this.$data.plateProperties.templateName = '';
      this.$data.plateProperties.selectedTemplateId = 0;
      this.$data.plateProperties.isDefaultTemplate = 0;
      this.$data.plateProperties.barcodeValue = '';
      this.$data.plateProperties.plateSelectedSize = 1;
      this.$data.plateProperties.plateLogo = '';
      this.$data.plateProperties.isPrintBSAU = 0;
      this.$data.plateProperties.plateTextLines = 1;
      this.$data.plateProperties.plateTextLineGap = 0;
      this.$data.plateProperties.plateArtworkImage = '';
      this.$data.plateProperties.plateArtworkRaise = 0;
      this.$data.plateProperties.plateArtworkOffset = 0;
      this.$data.plateProperties.plateArtworkSize = 7;
      this.$data.plateProperties.plateWIPInput = '';
      this.$data.plateProperties.isBarcodePrint = 0;

      // clear the retail info
      this.$data.newRetailContact.first_name = "";
      this.$data.newRetailContact.last_name = "";
      this.$data.newRetailContact.title_id = 0;
      this.$data.newRetailContact.phone_number = "";
      this.$data.newRetailContact.mobile_number = "";
      this.$data.newRetailContact.email = "";
      this.$data.newRetailContact.company_name = "";
      this.$data.newRetailContact.contact_type_id = 0;
      this.$data.newRetailContact.contact_category_id = 0;
      this.$data.newRetailContact.contact_method_id = 0;
      this.$data.newRetailContact.contact_role_id = 0;
      this.$data.newRetailContact.opt_in_marketing = false;
      this.$data.newRetailContact.opt_in_research = false;
      this.$data.newRetailContact.opt_in_anonymously = false;
      this.$data.newRetailContact.group_id = 0;
      this.$data.newRetailContact.branch_id = 0;
      this.$data.newRetailContact.site_id = 0;
      this.$data.newRetailContact.is_active = false;
      this.$data.newRetailContact.proof_of_id = 0;
      this.$data.newRetailContact.proof_of_id_ref = '';
      this.$data.newRetailContact.proof_of_id_doc = '';
      this.$data.newRetailContact.identity_description = '';
      this.$data.newRetailContact.proof_of_entitlement = 0;
      this.$data.newRetailContact.proof_of_entitlement_ref = '';
      this.$data.newRetailContact.proof_of_entitlement_doc = '';
      this.$data.newRetailContact.entitlementDescription = '';
      this.$data.newRetailContact.address.is_default = true;
      this.$data.newRetailContact.address.property_number = "";
      this.$data.newRetailContact.address.address1 = "";
      this.$data.newRetailContact.address.address2 = "";
      this.$data.newRetailContact.address.address3 = "";
      this.$data.newRetailContact.address.address4 = "";
      this.$data.newRetailContact.address.street = "";
      this.$data.newRetailContact.address.town = "";
      this.$data.newRetailContact.address.post_code = "";
      this.$data.newRetailContact.address.delivery_notes = "";
      this.$data.newRetailContact.address.county_id = 0;
      this.$data.newRetailContact.address.country_id = 0;
      this.$data.newRetailContact.address.company_id = 0;
      this.$data.newRetailContact.address.group_id = 0;
      this.$data.newRetailContact.address.branch_id = 0;
      this.$data.newRetailContact.address.site_id = 0;
      this.$data.newRetailContact.address.address_category_id = 0;
      this.$data.newRetailContact.address.address_type_id = 0;
      this.$data.newRetailContact.address.telephone_number = "";
      this.$data.newRetailContact.address.is_invoice_address = 0;
      this.$data.newRetailContact.address.is_default_delivery_address = 1;
      this.$data.newRetailContact.address.is_active = true;

      // now re-populate the template
      console.log('User: ', this.$data.userObj);
      this.loadTemplate(this.$data.userObj.site_id);
    },
    printBarcode() {
      const content = {
        barcodeValue: this.$data.plateProperties.barcodeValue,
        regNumber: this.$data.plateProperties.plateTextInput
      };
      ipcRenderer.send("printBarcodeHandler", content);
    },
    toggleSaveTemplateModal() {
      this.$data.activeStateSaveTemplateModal = !this.$data.activeStateSaveTemplateModal;
    },
    saveTemplate() {
      // gather the data and save the template
      this.$data.templateSaveInProgress = true;
      let headersObj = getHTTPHeaders();
      // get the user info first
      let user = JSON.parse(localStorage.getItem('user'));
      let dataPostObject = {
        template: {
          group_id: user.company_id,
          branch_id: user.branch_id,
          dealership_id: user.site_id,
          registration_number: this.$data.plateProperties.plateTextInput,
          raise_by_registration_number_in_mm: this.$data.plateProperties.plateRaiseInput,
          plate_height: this.$data.platePrintStyleObject.heightActual,
          plate_width: this.$data.platePrintStyleObject.widthActual,
          slogan: this.$data.plateProperties.plateMessageInput,
          slogan_font_size: this.$data.plateProperties.plateMessageFontSizeInput,
          slogan_raise_by: this.$data.plateProperties.plateMessageRaiseInput,
          is_border: this.$data.plateProperties.isPrintBorder,
          border_colour: this.$data.plateProperties.plateBorderColour,
          border_width: this.$data.plateProperties.plateBorderWidth,
          border_margin: this.$data.plateProperties.plateBorderMargin,
          template_name: this.$data.plateProperties.templateName,
          postcode: this.$data.plateProperties.platePostCodeInput,
          postcode_raise_by: this.$data.plateProperties.platePostCodeRaiseInput,
          postcode_font_size: this.$data.plateProperties.platePostCodeFontSizeInput,
          postcode_offset_by: this.$data.plateProperties.platePostCodeOffsetInput,
          supplier_id: this.$data.supplierId,
          is_bsau_mark: this.$data.plateProperties.isPrintBSAU,
          is_bsau_text: 0,
          is_default: this.$data.plateProperties.isDefaultTemplate
        }
      }
      if (this.hasTemplateBeenLoaded) {
        // prompt to overwrite
      }
      else {
        this.$http.post('createTemplate', {
          template: dataPostObject.template
        },
        headersObj)
        .then((response) => {
          console.log(response.data);
          if (response.data.success == true) {
              this.$data.templateSaveInProgress = false;
              
          }
          else {
              // data error
              this.$data.templateSaveInProgress = false;
              this.toggleSaveTemplateModal();
          }
        })
        .catch ((err) => {
          console.error(err);
          this.$data.templateSaveInProgress = false;
          
        });

        if (this.$data.isFromTC) {
          // because we've created a template as part of the trade customers, turn off TC mode and let the user continue
          this.$data.isFromTC = false;
        }
      }
    },
    toggleBarcodePreviewModal() {
      this.$data.activeBarcodePreviewModal = !this.$data.activeBarcodePreviewModal;
    },
    toggleLoadTemplateModal() {
      this.$data.activeStateLoadTemplateModal = !this.$data.activeStateLoadTemplateModal;
      if (!this.$data.activeStateLoadTemplateModal) {
        this.$data.templatesLoaded = false;
        this.$data.loadedTemplates = [];
      }
      else {
        this.loadTemplates();
      }
    },
    loadTemplates() {
      getCurrentUser(this.$http)
        .then((userDetails) => {
          const userFilter = {
            company_id: userDetails.company_id,
            branch_id: userDetails.branch_id,
            site_id: userDetails.site_id
          };
          return getTemplates(this.$http, userFilter);
        })
        .then((templateList) => {
          this.$data.loadedTemplates = templateList.map((element) => {
            let templateItem = {
              value: element.value,
              text: element.text
            }
            return templateItem;
          });
          this.$data.templatesLoaded = true;
        })
        .catch ((err) => {
          console.error(err);
        });
    },
    loadTemplate(siteId) {
      //console.log("id: ", this.$data.plateProperties.selectedTemplateId);
      //console.log("computed: ", this.hasTemplateBeenLoaded);
      getDefaultTemplate(this.$http, siteId)
      //getTemplate(this.$http, this.$data.plateProperties.selectedTemplateId)
        .then((template) => {
          // populate the state data
          console.log('Default template: ', template);
          this.$data.plateProperties.plateTextInput = template.registration_number;
          this.$data.plateProperties.plateRaiseInput = template.raise_by_registration_number_in_mm;
          this.$data.plateProperties.plateMessageInput = template.slogan;
          this.$data.plateProperties.plateMessageRaiseInput = template.slogan_raise_by;
          this.$data.plateProperties.plateMessageFontSizeInput = template.slogan_font_size;
          this.$data.plateProperties.platePostCodeInput = template.postcode;
          this.$data.plateProperties.platePostCodeRaiseInput = template.postcode_raise_by;
          this.$data.plateProperties.isPrintBSAU = template.is_bsau_mark;
          this.$data.plateProperties.plateBSAUInput = template.is_bsau_text;
          this.$data.plateProperties.plateBSAURaiseInput = 0;
          this.$data.plateProperties.plateBSAUFontSizeInput = 3;
          this.$data.plateProperties.isPrintBorder = template.is_border;
          this.$data.plateProperties.plateBorderMargin = template.border_margin;
          this.$data.plateProperties.plateBorderWidth = template.border_width;
          this.$data.plateProperties.plateBorderColour = template.border_colour;
          this.$data.plateProperties.isPrintMarque = template.is_marque;
          this.$data.plateProperties.plateMarqueWidth = 0;
          this.$data.plateProperties.isMirror = 0;
          this.$data.plateProperties.templateName = template.template_name;
          this.$data.currentTemplateName = template.template_name;
          this.$data.currentTemplateId = template.template_id;
          this.$data.plateProperties.selectedTemplateId = template.template_id;
          this.$data.plateProperties.barcodeValue = '';
          this.$data.supplierId = template.supplier_id;
          this.$data.plateProperties.isBarcodePrint = template.is_barcode_print;
          
        })
        .catch ((err) => {
          console.error(err);
        });
        
    },
    toggleTemplateSettingsModal() {
      this.$data.activeStateTemplateSettingsModal = !this.$data.activeStateTemplateSettingsModal;
    },
    toggleAuditEntryModal() {
      this.$data.activeStateAuditModal = !this.$data.activeStateAuditModal;
      // now load the lookup data needed
      //this.loadTradeCustomer();

      if(this.$data.activeStateAuditModal) {
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
      }
    },
    togglePostCodeFontSettingsModal() {
      this.$data.fontModalType = 'postcode';
      this.$data.activeStateFontSettingsModal = !this.$data.activeStateFontSettingsModal;
    },
    toggleSloganFontSettingsModal() {
      this.$data.fontModalType = 'slogan';
      this.$data.activeStateFontSettingsModal = !this.$data.activeStateFontSettingsModal;
    },
    loadTradeCustomer() {
      getSuppliers(this.$http)
        .then((response) => {
          let tradeCustomers = [];
          tradeCustomers = response.filter((element) => {
            return element.id == this.$data.supplierId;
          });
          this.$data.currentTradeCustomer.supplierName = tradeCustomers[0].supplier_name;
          this.$data.currentTradeCustomer.dvlaLicCode = tradeCustomers[0].dvla_lic_code;
          this.$data.currentTradeCustomerLoaded = true;
        })
        .catch ((err) => {
            console.error(err);
        });
    }
  }
}
</script>

<style>
@font-face {
  font-family: "Charles";
  src: url("../assets/fonts/SAPUK.TTF") format("truetype");
  
  /*src: url('../assets/fonts/UKNumberPlate.ttf')  format('truetype');*/
  /*src: url('../assets/fonts/UKReg.ttf')  format('truetype');*/
  /*src: url('../assets/fonts/CharlesWright-Bold.ttf')  format('truetype');*/
  /*src: url('../assets/fonts/bsau145d.ttf')  format('truetype');*/
  /*src: url('../assets/fonts/New-Charles-Wright.ttf')  format('truetype');*/
  
}
h6 {
  text-decoration: underline;

  margin-top: 0.5rem;
}
p.button-area button {
  margin-right: 0.5rem;
}
div#platePrintAreaOuter {
  border-radius: 30px;
  display: inline-block;
  background-color: rgb(247, 209, 74);
  transform-origin: top left;
  text-align: center;
  overflow: visible;
}
div#platePrintArea {
  border-radius: 30px;
  width: 100%;
  height: 100%;
}
div#marque {
  float: left;
  width: 45mm;
  text-align: center;
  padding: 4mm;
  background-color: blue;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  height: 111mm;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  display: none;
}
div#marque img {
  float: left;
  width: 100%;
  display: block;
  padding-top: 10mm;
}
div#marque span#marque-slogan {
  display: inline-block;
  position: inherit;
  text-transform: uppercase;
  font-family: "Charles";
  font-size: 25mm;
  color: rgb(247, 209, 74);
  position: relative;
  padding-top: 8mm;
}
div#platePrintArea div#plateRender {
  font-size: 100mm;
  display: inline-block;
  line-height: 0.857;
  text-transform: uppercase;
  font-family: "Charles";
  height: 100%;
  text-align: center;
}
div#platePrintArea div.slogan {
  line-height: 1;
  font-size: 7mm;
  z-index: 1000;
  background-color: rgb(247, 209, 74);
}
div#platePrintArea div#plateFooter {
  position: absolute;
  /*display: flex;*/
  left: 0;
  right: 0;
  width: max-content;
  margin: auto;
  bottom: 0mm;
  padding-left: 2mm;
  padding-right: 2mm;
}
div#platePrintArea div#sloganMessage {
  width: max-content;
  position: relative;
  /*background-color:  ;*/
  padding-left: 2mm;
  padding-right: 2mm;
}
div#platePrintArea div#sloganPostcode {
  position: relative;
  left: 0;
  right: 0;
  width: max-content;
  margin: auto;
  bottom: 0mm;
  background-color: rgb(247, 209, 74);
  padding-left: 1mm;
  padding-right: 1mm;
}
div#platePrintArea div#bsau {
  position: absolute;
  right: 11mm;
  width: max-content;
  bottom: 1mm;
  padding-left: 1mm;
  padding-right: 1mm;
  background-color: rgb(247, 209, 74);
}
p.toolbar button {
  margin-right: 5px;
}
.toolbar-template-name {
  text-align: right;
}
span.template-name {
  font-weight: bold;
}
.uppercase {
  text-transform: uppercase;
}
div.barcode-container svg {
  min-width: 100%;
}
span.upload-switch {
  cursor: pointer;
}
.image-upload-hidden {
  display: none;
}
div.reg-header-options {
  float: right;
}
div.reg-header-options fieldset {
  display: inline;
}
div.reg-header-options fieldset legend {
  display: none;
} 
div.reg-header-options fieldset.form-group {
  margin-bottom: 0;
} 
</style>
