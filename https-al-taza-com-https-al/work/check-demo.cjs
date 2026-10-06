const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root='outputs/al-taza-demo/dist/';
const html=fs.readFileSync(root+'index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="(assets\/[^"']+|style.css|app.js)"/g))assert(fs.existsSync(root+m[1]),'Missing '+m[1]);
const elements={};
function element(selector){return elements[selector]??=( {value:selector==='#region'?'Kerala':'',innerHTML:'',style:{},classList:{toggle(){},add(){},remove(){}},addEventListener(){},setAttribute(){},showModal(){},close(){}});}
const context={document:{querySelector:element,querySelectorAll:()=>[],documentElement:{scrollHeight:2000,classList:{add(){},toggle(){}}},body:{classList:{add(){},remove(){}}}},window:{matchMedia:()=>({matches:true}),innerHeight:800,scrollY:0,addEventListener(){}},encodeURIComponent};
vm.createContext(context);vm.runInContext(fs.readFileSync(root+'app.js','utf8'),context);
assert(element('#menu-cards').innerHTML.includes('₹230'),'Menu price');
vm.runInContext("renderMenu('Veg')",context);assert(element('#menu-cards').innerHTML.includes('Paneer Roll')&&!element('#menu-cards').innerHTML.includes('Full Meat'),'Category filter');
element('#outlet-search').value='Calicut';vm.runInContext('renderRegion()',context);assert(element('#outlet-detail').innerHTML.includes('Calicut'),'Outlet search');
element('#outlet-search').value='zzzz';vm.runInContext('renderRegion()',context);assert(element('#outlet-list').innerHTML.includes('No matching outlet'),'Empty search');
element('#region').value='Bengaluru';vm.runInContext('renderRegion(true)',context);assert(element('#outlet-list').innerHTML.includes('Koramangala')&&element('#outlet-search').value==='','Region change');
vm.runInContext('openProduct(3)',context);assert(element('#product-content').innerHTML.includes('Paneer Roll'),'Product preview');
console.log('Passed: local assets, prices, filters, outlet search, empty state, region change and product preview.');
