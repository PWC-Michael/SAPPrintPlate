module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "app://./",
      // customFileProtocol: 'file://./',
      baseUrl: "app://./",
      removeElectronJunk: true,
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "com.printplatedesktop.sap",
        productName: "SAPPlatePrintDesktop",
        artifactName: "${productName}.${ext}",
        compression: "store",
        nsis: {
          oneClick: false,
          perMachine: true,
          allowToChangeInstallationDirectory: true
        },
        win: {
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"]
            }
          ],
        },
        extraFiles: [
          {
            from: 'extras/SumatraPDF.exe',
            to: './SumatraPDF.exe'
          },
          {
            from: 'extras/platePrint.html',
            to: './platePrint.html'
          },
          {
            from: 'extras/main.css',
            to: './main.css'
          },
        ],
        publish: [
          {
            provider: "github",
            owner: "PWC-Michael",
            repo: "SAPPrintPlate",
            releaseType: "draft",
            channel: "latest",
            url: "https://github.com/PWC-Michael/SAPPrintPlate"
          }
        ]
      }
    }
  }
};
