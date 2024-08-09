"use server";

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

    return new Response(JSON.stringify(data), {
        headers: { 'content-type': 'application/json' }
    });

}