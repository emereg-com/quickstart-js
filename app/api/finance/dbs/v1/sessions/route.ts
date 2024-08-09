"use server";

export async function POST(req: Request) {
    return new Response(JSON.stringify({'hello': 'world'}), {
        headers: { 'content-type': 'application/json' },
    });
}