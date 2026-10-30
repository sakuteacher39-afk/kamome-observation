// Baseline: main commit 317353694dd254f199d5942cc9c2f4f38cb4c093.
// Protect the four existing articles and their citations during visual changes.
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const html=readFileSync(new URL('index.html',root),'utf8');
const expected={
  "prose": [
    "76823744034f3ee4b95f0dbb92f12b2f6f6a6945f744a2f1082d47c90a2d3856",
    "6e553eae609c6e39d01a4399d85f342a546541f1a70c08becba0e9341f5451e2",
    "b5f6726ae013643f60d1000b41ffa0c8a6dc1ecc0dc7b26c03140d8eae88a91a",
    "d0f16f88e7728792e133f70691902f5edbab860ad7290f8c660041699895f866"
  ],
  "sources": [
    "091c9e8e66172a20112954c69644ec717e60049df3a21cceea4570761d8944f8",
    "5286a6bb1f42300eaf7cd02fba8fa750799431bb71b6fe757535c41b37bd82d7",
    "36f5dfdf3460578674587a56fd1637cf1567cde4a58dfc35f28413087e0edfe3",
    "3509c3b93482266c9ca4772eb7dc78500a20fb0e5657d0c33873839a53e2d2af"
  ]
};
const digest=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex');
for(const [key,pattern] of Object.entries({prose:/<div class="prose">[\s\S]*?<\/div>/g,sources:/<aside class="sources"[\s\S]*?<\/aside>/g})){
 assert.deepEqual([...html.matchAll(pattern)].map(m=>digest(m[0])),expected[key],key+' must match the four original articles');
}
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'IDs must be unique');
for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),'Missing anchor: '+m[1]);
for(const id of ['note-01','note-02','note-03','note-04'])assert.ok(ids.includes(id),'Keep existing direct link: '+id);
for(const asset of ['styles.css','journal.js','favicon.svg','.nojekyll'])assert.ok(existsSync(new URL(asset,root)),asset+' must exist');
assert.ok(html.includes('理由は不純。'),'Keep the slogan');
assert.ok(html.includes('応援は本気。'),'Keep the slogan');
assert.ok(html.includes('非公式'),'Keep unofficial disclosure');
console.log('PASS: four article bodies, citations, direct links, unique IDs and local assets.');
