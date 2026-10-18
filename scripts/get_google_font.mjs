async function main() {
  const res = await fetch('https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  console.log('CSS:', text);
}

main().catch(console.error);
