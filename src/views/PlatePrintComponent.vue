<template>
  <div class="printer">
    <div id="platePrintArea-printer">
        <div class="reg-letters" id="plateRender-printer" v-text="plateProperties.plateText"></div>
        <div class="slogan" id="sloganMessage" v-text="plateProperties.sloganMessage"></div> 
    </div>
  </div>
</template>
<script>

const { ipcRenderer } = require('electron');

export default {
  name: 'PlatePrintComponent',
  components: {
  },
  data: function () {
    return {
      PLATE_HEIGHT: 111,
      PLATE_WIDTH: 521,
      EU_LOGO_WIDTH: 45,
      plateProperties: {
        plateText: '',
        sloganMessage: ''
      },
    }
  },
  mounted() {
    ipcRenderer.on("preparePrint", function(event, content) { 
      this.$data.plateProperties.plateText = content.plateText;
      this.$data.plateProperties.sloganMessage = content.sloganMessage;

      // Needs the slight delay so the page renders ok.
      setTimeout(function() {
        ipcRenderer.send("printRenderedHandler");
      }, 1000);

    });

    ipcRenderer.on("printPlate", function(event, content) {
      ipcRenderer.send("sendPlateToPrinterHandler");
    });
  },
  created() {
  },
  methods: {
  }
}
</script>

<style>
  div.printer {
    padding: 0;
    margin: 0;
    display: contents;
    height: 111mm;
  }
  div#platePrintArea-printer {
    width: 522mm;
    /*border: solid 6mm #000;
    border-radius: 10px;*/
    display: inline-block;
    text-align: center;
  }
  div#platePrintArea-printer.mirror-text {
    text-align: right;
  }
  div#platePrintArea-printer div.reg-letters {
    font-size: 100mm;
    margin: 0;
    padding: 25px;
    text-transform: uppercase;
    margin-top: -12mm;
    padding: -3px;
    text-align: center;
    font-family: 'Charles';
  }
  @media print
  {
    @page {
      size: 522mm 111mm;
    }
    body.printer {
      padding: 0;
      margin:0;
      height: 111mm;
      /*display: table-cell;*/
    }
    html, body {
      overflow: hidden;
    }
    div#platePrintArea-printer {
      width: 522mm;
      /*border: solid 3px #222;
      border-radius: 10px;*/
      display: inline-block;
      text-align: center;
    }
    div#platePrintArea-printer div.reg-letters {
      font-size: 100mm;
      margin: 0;
      padding: 25px;
      text-transform: uppercase;
      margin-top: -12mm;
      font-family: 'Charles';
    }

    div#platePrintArea-printer div#sloganMessage {
      position: absolute;
      left: 0;
      right: 0;
      width: max-content;
      margin: auto;
      bottom: 1mm;
      padding: 2mm;
      font-size: 3mm;
    }

    .mirror-text {
      transform: scale(-1, 1);
      text-align: right;
    }
  }
</style>
