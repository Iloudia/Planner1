const a=n=>{var t,o;const r=((o=(t=globalThis.crypto)==null?void 0:t.randomUUID)==null?void 0:o.call(t))??`${Date.now()}-${Math.random().toString(36).slice(2,10)}`;return`${n}-${r}`};export{a as c};
