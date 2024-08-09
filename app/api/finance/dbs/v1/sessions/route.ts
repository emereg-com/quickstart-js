"use server";

import { chromium } from 'playwright-core';

const options = {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${process.env.EMEREG_API_TOKEN}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        project_id: 68,
        timeout: 60
    })
};

export async function POST(req: Request) {

    const response = await fetch('https://emereg.com/api/v1/sessions', options)
    const data = await response.json();

    console.log(data['browser_id'])
    const endpointURL = `wss://browser.emereg.com/devtools/browser/${data['browser_id']}`
    const browser = await chromium.connectOverCDP(endpointURL);

    const contexts = browser.contexts()
    const pages = contexts[0].pages()
    let page = pages[0]

    await page.goto('https://emereg.com')

    return new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json' }
    });

}