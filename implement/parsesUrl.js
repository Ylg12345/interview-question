function parseUrl(url) {
  const str = url.substr(url.indexOf('?') + 1);

  const strChunks = str.split('&');
  const map = {};

  strChunks.forEach((strChunk) => {
    const item = strChunk.split('=');
    map[item[0]] = item[1];
  });
  return map;
}

const res = parseUrl('https://www.google.com/search?y=1&l=2&g=3');

console.log(res)
