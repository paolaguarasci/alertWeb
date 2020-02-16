const puppeteer = require("puppeteer");
const looksSame = require("looks-same");
const fs = require("fs");

const sites = [];

sites.push({
  id: "intelligenza",
  url: "https://www.mat.unical.it/informatica/IntelligenzaArtificiale"
});
sites.push({
  id: "architettura",
  url: "https://www.mat.unical.it/informatica/ArchitetturaDegliElaboratori"
});

sites.push({
  id: "my asas",
  url: "https://www.mat.unical.it/informatica/ArchitetturaDegliElaboratori"
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.viewport({ width: 1280, height: 768 });
  for (let site in sites) {
    let firstTime = false;
    fs.rename(
      `screen/${sites[site].id}.new.png`,
      `screen/${sites[site].id}.old.png`,
      function(err) {
        if (err) {
          firstTime = true;
        }
      }
    );
    await page.goto(sites[site].url);
    await page.screenshot({
      path: `screen/${sites[site].id}.new.png`,
      fullPage: true
    });
    if (!firstTime) {
      looksSame(
        `screen/${sites[site].id}.old.png`,
        `screen/${sites[site].id}.new.png`,
        function(error, { equal }) {
          if (!equal) {
            console.log(`${sites[site].id} CAMBIATO`);
          } else {
            console.log(`${sites[site].id} tutto tace...`);
          }
        }
      );
    }
  }
  await browser.close();
})();
