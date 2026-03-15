const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testMagisterium() {
    const key = process.env.MAGISTERIUM_API_KEY;
    console.log('Using Key:', key ? key.slice(0, 10) + '...' : 'MISSING');

    if (!key) return;

    try {
        const res = await fetch("https://www.magisterium.com/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "magisterium-1",
                messages: [
                    { role: "system", content: "You are a helpful priest." },
                    { role: "user", content: "Tell me about the Council of Trent." }
                ],
                max_tokens: 100,
            })
        });

        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testMagisterium();
