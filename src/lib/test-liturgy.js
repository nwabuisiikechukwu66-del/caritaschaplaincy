async function testFetch() {
    const date = '20260315';
    const url = `https://universalis.com/${date}/jsonpmass.js`;
    console.log('Fetching', url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log('Response (first 500 chars):');
        console.log(text.substring(0, 500));
    } catch (e) {
        console.error('Fetch failed', e);
    }
}
testFetch();
