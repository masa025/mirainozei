const https = require('https');

const ids = ['C_qi8XVP8W0', 'SPTKwBxxS2g', 'iLoWrpgXRXk', 'oagszCmJLpU'];

ids.forEach(id => {
  https.get(`https://www.youtube.com/watch?v=${id}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/"playabilityStatus":\{"status":"([^"]+)"/);
      console.log(`${id}: ${match ? match[1] : 'UNKNOWN'}`);
    });
  });
});
