import fs from 'fs';
const D='research/tesa-ia/data';
const inv=JSON.parse(fs.readFileSync(`${D}/inventory.json`)).paths;
const pages=JSON.parse(fs.readFileSync(`${D}/pages.json`));
const titleOf={}; for(const p of pages){ titleOf[p.path]=(p.h1||p.title||'').replace(/\s*[-|]\s*tesa.*$/i,'').trim(); }
function slugName(seg){ return seg.replace(/\.html$/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
function depth(u){return u.split('/').filter(Boolean).length;}
// split SKU leaves (/en/industry/tesa-*.html and *.html at depth 3) from structural tree
const isSku=p=>/^\/en\/industry\/[a-z0-9-]+\.html$/i.test(p);
const skus=inv.filter(isSku).sort();
const structural=inv.filter(p=>!isSku(p));
// build nested tree
const tree={};
for(const p of structural){ const segs=p.split('/').filter(Boolean); let node=tree;
  let acc=''; for(const s of segs){ acc+='/'+s; node[s]=node[s]||{__path:acc,__kids:{}}; node=node[s].__kids; } }
function tmpl(p){const s=p.split('/').filter(Boolean);
  if(p==='/en/industry')return 'industry landing';
  if(s[1]==='about-tesa'&&s.length===3)return 'corporate hub';
  if(s.length===3&&s[2]==='markets')return 'markets hub';
  if(s.length===3&&s[2]==='applications')return 'applications hub';
  if(s.length===3&&s[2]==='products')return 'products hub';
  if(s[2]==='markets')return s.length===4?'market':'market focus/segment';
  if(s[2]==='applications')return s.length===4?'application category':'application detail';
  if(s[2]==='products')return s.length===4?'product category':'product detail';
  return '';}
const lines=[];
function render(node,prefix){ const keys=Object.keys(node).sort(); keys.forEach((k,i)=>{
  const last=i===keys.length-1; const n=node[k]; const t=titleOf[n.__path]; const tp=tmpl(n.__path);
  const label=(t||slugName(k))+(tp?`  ·  _${tp}_`:'')+`  ·  \`${n.__path}\``;
  lines.push(prefix+(last?'└── ':'├── ')+label);
  render(n.__kids, prefix+(last?'    ':'│   ')); }); }
render(tree,'');
let md=`# Tesa Industry — Full Sitemap\n\n`;
md+=`> Reverse-engineered from \`https://www.tesa.com/en/industry\` (+ \`/en/about-tesa\` corporate sections). `;
md+=`**${inv.length} unique pages** inventoried: **${structural.length} structural** (below) + **${skus.length} product-detail SKU pages** (appendix). `;
md+=`Hierarchy, depth and parent are derived from URL nesting; titles from crawled pages. Each node shows: **Title · _template_ · \`/url\`**.\n\n`;
md+='## Structural tree\n\n```\n'+lines.join('\n')+'\n```\n\n';
md+=`## Depth / parent / children reference\n\nDepth = number of URL segments. Parent = URL minus last segment. Children = nested entries above.\n\n`;
md+=`| Section | Pages | Depth range |\n|---|---|---|\n`;
const sec={}; for(const p of structural){const s=p.split('/').filter(Boolean)[2]||'(root)';sec[s]=sec[s]||{n:0,min:9,max:0};sec[s].n++;sec[s].min=Math.min(sec[s].min,depth(p));sec[s].max=Math.max(sec[s].max,depth(p));}
for(const[k,v]of Object.entries(sec).sort((a,b)=>b[1].n-a[1].n)) if(v.n>1||['markets','applications','products'].includes(k)) md+=`| ${k} | ${v.n} | d${v.min}–d${v.max} |\n`;
md+=`\n## Appendix — Product-detail (SKU) pages\n\n`;
md+=`**${skus.length}** individual product pages live flat at \`/en/industry/<sku>.html\` (e.g. \`tesa-4965.html\`, \`tesa-flamextinct-45001.html\`). They are reached via product-category pages, market/application pages, search, and the mega-menu — not via deep URL nesting. Template: _product detail_ (hero → anchor-nav → spec paragraphs → media → **downloads** → related teasers).\n\n<details><summary>All ${skus.length} SKU pages</summary>\n\n`;
md+=skus.map(s=>`- \`${s}\``).join('\n')+'\n\n</details>\n';
fs.writeFileSync('research/tesa-ia/tesa-sitemap.md',md);
console.log('wrote tesa-sitemap.md  structural='+structural.length+' skus='+skus.length+' lines='+lines.length);
