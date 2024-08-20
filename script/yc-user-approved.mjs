import { chromium } from 'playwright-core';

async function extractCompanyLinks(page) {
  return page.$$eval(
    'a[href^="/companies/"]',
    (links) =>
      links
        .filter((link) => /company/.test(link.className)) // Matches "company" in the class name
        .map((link) => {
          const href = link.href;
          const nameElement = Array.from(link.querySelectorAll('span')).find(span => /coName/.test(span.className));
          const companyName = nameElement ? nameElement.textContent.trim() : '';
          const descriptionElement = Array.from(link.querySelectorAll('span')).find(span => /coDescription/.test(span.className));
          const description = descriptionElement ? descriptionElement.textContent.trim() : '';
          return { href, companyName, description };
        })
  );
}

async function injectModal(page, companyLinks) {
  // Define the HTML for the modal with a button
  const modalHTML = `
  <div id="myModal" style="display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgb(0,0,0,0.4)">
    <div style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:80%;">
      <span style="color:#aaaaaa; float:right; font-size:28px; font-weight:bold; cursor:pointer;" onclick="document.getElementById('myModal').style.display='none'">&times;</span>
      <h1>User action required:</h1>
      <br>
      <p>This is the first record that is retrieved, confirm to proceed with full automation.</p>
      <br>
      <p>
        <b>name</b>: ${companyLinks[0].companyName}
        <br>
        <b>description</b>: ${companyLinks[0].description}
        <br>
        <b>href</b>: ${companyLinks[0].href}
      </p>
      <br>
      <button id="modalButton" style="padding:10px; font-size:16px; background-color: green; color: white">Continue</button>
    </div>
  </div>
`;

  // Inject the modal HTML into the page
  await page.evaluate((modalHTML) => {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }, modalHTML);

  // Display the modal
  await page.evaluate(() => {
    document.getElementById('myModal').style.display = 'block';
  });

  // Add an event listener to the button that sets a global variable when clicked
  await page.evaluate(() => {
    document.getElementById('modalButton').addEventListener('click', () => {
      window.buttonClicked = true;
      document.getElementById('myModal').style.display = 'none'; // Optionally close the modal
    });
  });

  // Wait for the button to be clicked
  await page.waitForFunction(() => window.buttonClicked === true);
}

const options = {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.EMEREG_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    project_id: process.env.PROJECT_ID,
    timeout: 120
  })
};

const response = await fetch('https://emereg.com/api/v1/sessions', options)
const data = await response.json();

const endpointURL = `wss://browser.emereg.com/devtools/browser/${data['browser_id']}`
const browser = await chromium.connectOverCDP(endpointURL);

const contexts = browser.contexts()

let pages = []
for (const context of contexts) {
  const pagesInContext = context.pages();
  pages.push(...pagesInContext);
}

let page = pages[0]
for (const somePage of pages) {
  if (!somePage.url().includes("blank")) {
    page = somePage
  }
}

await page.setViewportSize({ width: 1024, height: 768 });

async function runScript(page) {

  await page.goto('https://www.ycombinator.com/companies?batch=S24');

  await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');

  let companyLinks = await extractCompanyLinks(page);
  await injectModal(page, companyLinks);
  console.log("Button was clicked, continuing with script...");

  let previousHeight;
  let currentHeight = await page.evaluate('document.body.scrollHeight');
  while (true) {
    previousHeight = currentHeight;

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for new content to load
    await page.waitForTimeout(1500); // Adjust this timeout based on how long it takes for new content to load

    currentHeight = await page.evaluate('document.body.scrollHeight');

    // If the height hasn't changed, we're done scrolling
    if (currentHeight === previousHeight) {
      break;
    }
  }

  companyLinks = await extractCompanyLinks(page);

  console.log(companyLinks);
  console.log(companyLinks.length);

};

runScript(page);