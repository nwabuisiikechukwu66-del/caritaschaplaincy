async function testFetch() {
    const date = '20260315';
    const url = `https://universalis.com/${date}/jsonpmass.js`;
    console.log('Fetching', url);
    try {
        const res = await fetch(url);
        const text = await res.text();
        const jsonText = text.replace(/^[^(]*\(/, "").replace(/\)[^)]*$/, "").trim();
        const data = JSON.parse(jsonText);
        console.log('Keys:', Object.keys(data));
        if (data.Mass) {
            console.log('Mass exists (array length)', data.Mass.length);
        } else {
            console.log('Mass does NOT exist');
        }
    } catch (e) {
        console.error('Fetch failed', e);
    }
}
testFetch();
