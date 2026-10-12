import{t as r,ap as l,j as a,v as c}from"./index-D4n_8SUr.js";const p=({href:i,className:n})=>{const{getArticle:s}=r(),t=s(i),e=l(i),o=(t==null?void 0:t.publicationDate)||(e==null?void 0:e.publicationDate);return o?a.jsxs("p",{className:n,children:[(t==null?void 0:t.status)==="draft"?"Date prévue : ":"Publié le ",a.jsx("time",{dateTime:o,children:c(o)}),"."]}):null},d=i=>{const n=i.replace(/\r/g,"").split(`
`),s=n.findIndex(t=>t.startsWith("# "));return s>=0?n.slice(s+1).join(`
`).trim():i.trim()},b=(i,n)=>`# ${i.trim()}

${n.trim()}`;export{p as B,b,d as g};
