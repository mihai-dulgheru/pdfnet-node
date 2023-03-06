require("dotenv").config({});
const path = require("path");
const { PDFNet } = require("@pdftron/pdfnet-node");
const licenseKey = process.env.APRYSE_TRIAL_KEY;

((exports) => {
  exports.runContentReplacer = () => {
    const main = async () => {
      const inputPath = "files/";
      const outputPath = inputPath;

      try {
        const inputFilename = "template.pdf";
        const outputFilename = "output.pdf";

        const doc = await PDFNet.PDFDoc.createFromFilePath(
          inputPath + inputFilename
        );
        doc.initSecurityHandler();

        const replacer = await PDFNet.ContentReplacer.create();
        const page = await doc.getPage(1);

        await replacer.addString("template_text", "replacement_text");
        await replacer.process(page);

        await doc.save(
          outputPath + outputFilename,
          PDFNet.SDFDoc.SaveOptions.e_remove_unused
        );

        console.log(
          "Done. Result saved in " + path.join(__dirname, outputFilename)
        );
      } catch (err) {
        console.log(err);
      }
    };

    PDFNet.runWithCleanup(main, licenseKey)
      .catch(function (error) {
        console.log("Error: " + JSON.stringify(error));
      })
      .then(function () {
        return PDFNet.shutdown();
      });
  };

  exports.runContentReplacer();
})(exports);
