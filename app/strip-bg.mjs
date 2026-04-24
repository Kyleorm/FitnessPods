import { Jimp } from 'jimp';

const img = await Jimp.read('./public/podpoint.png');

img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
  const r = this.bitmap.data[idx];
  const g = this.bitmap.data[idx + 1];
  const b = this.bitmap.data[idx + 2];

  // Make near-white pixels transparent
  if (r > 200 && g > 200 && b > 200) {
    this.bitmap.data[idx + 3] = 0;
  }
});

await img.write('./public/podpoint.png');
console.log('Done — white background removed.');
