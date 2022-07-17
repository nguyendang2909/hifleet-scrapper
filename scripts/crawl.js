import fs from 'fs';
import crawl from '../app/lib/crawler';

const list = JSON.parse(fs.readFileSync('./test/data/fleet-list.json', { encoding: 'utf-8' }));

(async () => {
  crawl(list);
})();
