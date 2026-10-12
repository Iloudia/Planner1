import{af as B,ae as Re,aa as ye,at as Te,ad as xe,au as Ae,a8 as Ee,a9 as ke,a7 as G,av as Ne,ao as Ue,j as o,r as E,e as ve,aw as te,ax as ne}from"./index-D4n_8SUr.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se="firebasestorage.googleapis.com",re="storageBucket",Ie=2*60*1e3,Oe=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f extends xe{constructor(t,s,n=0){super(M(t),`Firebase Storage: ${s} (${M(t)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,f.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return M(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var p;(function(e){e.UNKNOWN="unknown",e.OBJECT_NOT_FOUND="object-not-found",e.BUCKET_NOT_FOUND="bucket-not-found",e.PROJECT_NOT_FOUND="project-not-found",e.QUOTA_EXCEEDED="quota-exceeded",e.UNAUTHENTICATED="unauthenticated",e.UNAUTHORIZED="unauthorized",e.UNAUTHORIZED_APP="unauthorized-app",e.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",e.INVALID_CHECKSUM="invalid-checksum",e.CANCELED="canceled",e.INVALID_EVENT_NAME="invalid-event-name",e.INVALID_URL="invalid-url",e.INVALID_DEFAULT_BUCKET="invalid-default-bucket",e.NO_DEFAULT_BUCKET="no-default-bucket",e.CANNOT_SLICE_BLOB="cannot-slice-blob",e.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",e.NO_DOWNLOAD_URL="no-download-url",e.INVALID_ARGUMENT="invalid-argument",e.INVALID_ARGUMENT_COUNT="invalid-argument-count",e.APP_DELETED="app-deleted",e.INVALID_ROOT_OPERATION="invalid-root-operation",e.INVALID_FORMAT="invalid-format",e.INTERNAL_ERROR="internal-error",e.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(p||(p={}));function M(e){return"storage/"+e}function q(){const e="An unknown error occurred, please check the error payload for server response.";return new f(p.UNKNOWN,e)}function Ce(e){return new f(p.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function je(e){return new f(p.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Pe(){const e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new f(p.UNAUTHENTICATED,e)}function De(){return new f(p.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Se(e){return new f(p.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function Le(){return new f(p.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Be(){return new f(p.CANCELED,"User canceled the upload/download.")}function $e(e){return new f(p.INVALID_URL,"Invalid URL '"+e+"'.")}function Me(e){return new f(p.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function Fe(){return new f(p.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+re+"' property when initializing the app?")}function He(){return new f(p.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function ze(){return new f(p.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function qe(e){return new f(p.UNSUPPORTED_ENVIRONMENT,`${e} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function z(e){return new f(p.INVALID_ARGUMENT,e)}function ie(){return new f(p.APP_DELETED,"The Firebase app was deleted.")}function Ve(e){return new f(p.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function D(e,t){return new f(p.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function P(e){throw new f(p.INTERNAL_ERROR,"Internal error: "+e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(t,s){this.bucket=t,this.path_=s}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,s){let n;try{n=x.makeFromUrl(t,s)}catch{return new x(t,"")}if(n.path==="")return n;throw Me(t)}static makeFromUrl(t,s){let n=null;const r="([A-Za-z0-9.\\-_]+)";function i(d){d.path.charAt(d.path.length-1)==="/"&&(d.path_=d.path_.slice(0,-1))}const a="(/(.*))?$",l=new RegExp("^gs://"+r+a,"i"),c={bucket:1,path:3};function u(d){d.path_=decodeURIComponent(d.path)}const g="v[A-Za-z0-9_]+",_=s.replace(/[.]/g,"\\."),R="(/([^?#]*).*)?$",T=new RegExp(`^https?://${_}/${g}/b/${r}/o${R}`,"i"),m={bucket:1,path:3},b=s===se?"(?:storage.googleapis.com|storage.cloud.google.com)":s,w="([^?#]*)",U=new RegExp(`^https?://${b}/${r}/${w}`,"i"),h=[{regex:l,indices:c,postModify:i},{regex:T,indices:m,postModify:u},{regex:U,indices:{bucket:1,path:2},postModify:u}];for(let d=0;d<h.length;d++){const k=h[d],j=k.regex.exec(t);if(j){const $=j[k.indices.bucket];let I=j[k.indices.path];I||(I=""),n=new x($,I),k.postModify(n);break}}if(n==null)throw $e(t);return n}}class We{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(e,t,s){let n=1,r=null,i=null,a=!1,l=0;function c(){return l===2}let u=!1;function g(...w){u||(u=!0,t.apply(null,w))}function _(w){r=setTimeout(()=>{r=null,e(T,c())},w)}function R(){i&&clearTimeout(i)}function T(w,...U){if(u){R();return}if(w){R(),g.call(null,w,...U);return}if(c()||a){R(),g.call(null,w,...U);return}n<64&&(n*=2);let h;l===1?(l=2,h=0):h=(n+Math.random())*1e3,_(h)}let m=!1;function b(w){m||(m=!0,R(),!u&&(r!==null?(w||(l=2),clearTimeout(r),_(0)):w||(l=1)))}return _(0),i=setTimeout(()=>{a=!0,b(!0)},s),b}function Ke(e){e(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(e){return e!==void 0}function Ze(e){return typeof e=="object"&&!Array.isArray(e)}function V(e){return typeof e=="string"||e instanceof String}function Z(e){return W()&&e instanceof Blob}function W(){return typeof Blob<"u"}function Y(e,t,s,n){if(n<t)throw z(`Invalid value for '${e}'. Expected ${t} or greater.`);if(n>s)throw z(`Invalid value for '${e}'. Expected ${s} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X(e,t,s){let n=t;return s==null&&(n=`https://${t}`),`${s}://${n}/v0${e}`}function oe(e){const t=encodeURIComponent;let s="?";for(const n in e)if(e.hasOwnProperty(n)){const r=t(n)+"="+t(e[n]);s=s+r+"&"}return s=s.slice(0,-1),s}var O;(function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"})(O||(O={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(e,t){const s=e>=500&&e<600,r=[408,429].indexOf(e)!==-1,i=t.indexOf(e)!==-1;return s||r||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(t,s,n,r,i,a,l,c,u,g,_,R=!0){this.url_=t,this.method_=s,this.headers_=n,this.body_=r,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=l,this.errorCallback_=c,this.timeout_=u,this.progressCallback_=g,this.connectionFactory_=_,this.retry=R,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((T,m)=>{this.resolve_=T,this.reject_=m,this.start_()})}start_(){const t=(n,r)=>{if(r){n(!1,new S(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const a=l=>{const c=l.loaded,u=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,u)};this.progressCallback_!==null&&i.addUploadProgressListener(a),i.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(a),this.pendingConnection_=null;const l=i.getErrorCode()===O.NO_ERROR,c=i.getStatus();if(!l||Ye(c,this.additionalRetryCodes_)&&this.retry){const g=i.getErrorCode()===O.ABORT;n(!1,new S(!1,null,g));return}const u=this.successCodes_.indexOf(c)!==-1;n(!0,new S(u,i))})},s=(n,r)=>{const i=this.resolve_,a=this.reject_,l=r.connection;if(r.wasSuccessCode)try{const c=this.callback_(l,l.getResponse());Ge(c)?i(c):i()}catch(c){a(c)}else if(l!==null){const c=q();c.serverResponse=l.getErrorText(),this.errorCallback_?a(this.errorCallback_(l,c)):a(c)}else if(r.canceled){const c=this.appDelete_?ie():Be();a(c)}else{const c=Le();a(c)}};this.canceled_?s(!1,new S(!1,null,!0)):this.backoffId_=Xe(t,s,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&Ke(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class S{constructor(t,s,n){this.wasSuccessCode=t,this.connection=s,this.canceled=!!n}}function Qe(e,t){t!==null&&t.length>0&&(e.Authorization="Firebase "+t)}function et(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function tt(e,t){t&&(e["X-Firebase-GMPID"]=t)}function nt(e,t){t!==null&&(e["X-Firebase-AppCheck"]=t)}function st(e,t,s,n,r,i,a=!0){const l=oe(e.urlParams),c=e.url+l,u=Object.assign({},e.headers);return tt(u,t),Qe(u,s),et(u,i),nt(u,n),new Je(c,e.method,u,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,r,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rt(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function it(...e){const t=rt();if(t!==void 0){const s=new t;for(let n=0;n<e.length;n++)s.append(e[n]);return s.getBlob()}else{if(W())return new Blob(e);throw new f(p.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function ot(e,t,s){return e.webkitSlice?e.webkitSlice(t,s):e.mozSlice?e.mozSlice(t,s):e.slice?e.slice(t,s):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function at(e){if(typeof atob>"u")throw qe("base-64");return atob(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class F{constructor(t,s){this.data=t,this.contentType=s||null}}function lt(e,t){switch(e){case N.RAW:return new F(ae(t));case N.BASE64:case N.BASE64URL:return new F(le(e,t));case N.DATA_URL:return new F(ut(t),ht(t))}throw q()}function ae(e){const t=[];for(let s=0;s<e.length;s++){let n=e.charCodeAt(s);if(n<=127)t.push(n);else if(n<=2047)t.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(s<e.length-1&&(e.charCodeAt(s+1)&64512)===56320))t.push(239,191,189);else{const i=n,a=e.charCodeAt(++s);n=65536|(i&1023)<<10|a&1023,t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?t.push(239,191,189):t.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(t)}function ct(e){let t;try{t=decodeURIComponent(e)}catch{throw D(N.DATA_URL,"Malformed data URL.")}return ae(t)}function le(e,t){switch(e){case N.BASE64:{const r=t.indexOf("-")!==-1,i=t.indexOf("_")!==-1;if(r||i)throw D(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case N.BASE64URL:{const r=t.indexOf("+")!==-1,i=t.indexOf("/")!==-1;if(r||i)throw D(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let s;try{s=at(t)}catch(r){throw r.message.includes("polyfill")?r:D(e,"Invalid character found")}const n=new Uint8Array(s.length);for(let r=0;r<s.length;r++)n[r]=s.charCodeAt(r);return n}class ce{constructor(t){this.base64=!1,this.contentType=null;const s=t.match(/^data:([^,]+)?,/);if(s===null)throw D(N.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=s[1]||null;n!=null&&(this.base64=dt(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=t.substring(t.indexOf(",")+1)}}function ut(e){const t=new ce(e);return t.base64?le(N.BASE64,t.rest):ct(t.rest)}function ht(e){return new ce(e).contentType}function dt(e,t){return e.length>=t.length?e.substring(e.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v{constructor(t,s){let n=0,r="";Z(t)?(this.data_=t,n=t.size,r=t.type):t instanceof ArrayBuffer?(s?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),n=this.data_.length):t instanceof Uint8Array&&(s?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),n=t.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(t,s){if(Z(this.data_)){const n=this.data_,r=ot(n,t,s);return r===null?null:new v(r)}else{const n=new Uint8Array(this.data_.buffer,t,s-t);return new v(n,!0)}}static getBlob(...t){if(W()){const s=t.map(n=>n instanceof v?n.data_:n);return new v(it.apply(null,s))}else{const s=t.map(a=>V(a)?lt(N.RAW,a).data:a.data_);let n=0;s.forEach(a=>{n+=a.byteLength});const r=new Uint8Array(n);let i=0;return s.forEach(a=>{for(let l=0;l<a.length;l++)r[i++]=a[l]}),new v(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(e){let t;try{t=JSON.parse(e)}catch{return null}return Ze(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(e){if(e.length===0)return null;const t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function ft(e,t){const s=t.split("/").filter(n=>n.length>0).join("/");return e.length===0?s:e+"/"+s}function he(e){const t=e.lastIndexOf("/",e.length-2);return t===-1?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gt(e,t){return t}class y{constructor(t,s,n,r){this.server=t,this.local=s||t,this.writable=!!n,this.xform=r||gt}}let L=null;function _t(e){return!V(e)||e.length<2?e:he(e)}function de(){if(L)return L;const e=[];e.push(new y("bucket")),e.push(new y("generation")),e.push(new y("metageneration")),e.push(new y("name","fullPath",!0));function t(i,a){return _t(a)}const s=new y("name");s.xform=t,e.push(s);function n(i,a){return a!==void 0?Number(a):a}const r=new y("size");return r.xform=n,e.push(r),e.push(new y("timeCreated")),e.push(new y("updated")),e.push(new y("md5Hash",null,!0)),e.push(new y("cacheControl",null,!0)),e.push(new y("contentDisposition",null,!0)),e.push(new y("contentEncoding",null,!0)),e.push(new y("contentLanguage",null,!0)),e.push(new y("contentType",null,!0)),e.push(new y("metadata","customMetadata",!0)),L=e,L}function mt(e,t){function s(){const n=e.bucket,r=e.fullPath,i=new x(n,r);return t._makeStorageReference(i)}Object.defineProperty(e,"ref",{get:s})}function bt(e,t,s){const n={};n.type="file";const r=s.length;for(let i=0;i<r;i++){const a=s[i];n[a.local]=a.xform(n,t[a.server])}return mt(n,e),n}function pe(e,t,s){const n=ue(t);return n===null?null:bt(e,n,s)}function wt(e,t,s,n){const r=ue(t);if(r===null||!V(r.downloadTokens))return null;const i=r.downloadTokens;if(i.length===0)return null;const a=encodeURIComponent;return i.split(",").map(u=>{const g=e.bucket,_=e.fullPath,R="/b/"+a(g)+"/o/"+a(_),T=X(R,s,n),m=oe({alt:"media",token:u});return T+m})[0]}function Rt(e,t){const s={},n=t.length;for(let r=0;r<n;r++){const i=t[r];i.writable&&(s[i.server]=e[i.local])}return JSON.stringify(s)}class fe{constructor(t,s,n,r){this.url=t,this.method=s,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(e){if(!e)throw q()}function yt(e,t){function s(n,r){const i=pe(e,r,t);return ge(i!==null),i}return s}function Tt(e,t){function s(n,r){const i=pe(e,r,t);return ge(i!==null),wt(i,r,e.host,e._protocol)}return s}function _e(e){function t(s,n){let r;return s.getStatus()===401?s.getErrorText().includes("Firebase App Check token is invalid")?r=De():r=Pe():s.getStatus()===402?r=je(e.bucket):s.getStatus()===403?r=Se(e.path):r=n,r.status=s.getStatus(),r.serverResponse=n.serverResponse,r}return t}function xt(e){const t=_e(e);function s(n,r){let i=t(n,r);return n.getStatus()===404&&(i=Ce(e.path)),i.serverResponse=r.serverResponse,i}return s}function At(e,t,s){const n=t.fullServerUrl(),r=X(n,e.host,e._protocol),i="GET",a=e.maxOperationRetryTime,l=new fe(r,i,Tt(e,s),a);return l.errorHandler=xt(t),l}function Et(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}function kt(e,t,s){const n=Object.assign({},s);return n.fullPath=e.path,n.size=t.size(),n.contentType||(n.contentType=Et(null,t)),n}function Nt(e,t,s,n,r){const i=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function l(){let h="";for(let d=0;d<2;d++)h=h+Math.random().toString().slice(2);return h}const c=l();a["Content-Type"]="multipart/related; boundary="+c;const u=kt(t,n,r),g=Rt(u,s),_="--"+c+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+g+`\r
--`+c+`\r
Content-Type: `+u.contentType+`\r
\r
`,R=`\r
--`+c+"--",T=v.getBlob(_,n,R);if(T===null)throw He();const m={name:u.fullPath},b=X(i,e.host,e._protocol),w="POST",U=e.maxUploadRetryTime,A=new fe(b,w,yt(e,s),U);return A.urlParams=m,A.headers=a,A.body=T.uploadData(),A.errorHandler=_e(t),A}class Ut{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=O.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=O.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=O.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,s,n,r){if(this.sent_)throw P("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(s,t,!0),r!==void 0)for(const i in r)r.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,r[i].toString());return n!==void 0?this.xhr_.send(n):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw P("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw P("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw P("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw P("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class vt extends Ut{initXhr(){this.xhr_.responseType="text"}}function me(){return new vt}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{constructor(t,s){this._service=t,s instanceof x?this._location=s:this._location=x.makeFromUrl(s,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,s){return new C(t,s)}get root(){const t=new x(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return he(this._location.path)}get storage(){return this._service}get parent(){const t=pt(this._location.path);if(t===null)return null;const s=new x(this._location.bucket,t);return new C(this._service,s)}_throwIfRoot(t){if(this._location.path==="")throw Ve(t)}}function It(e,t,s){e._throwIfRoot("uploadBytes");const n=Nt(e.storage,e._location,de(),new v(t,!0),s);return e.storage.makeRequestWithTokens(n,me).then(r=>({metadata:r,ref:e}))}function Ot(e){e._throwIfRoot("getDownloadURL");const t=At(e.storage,e._location,de());return e.storage.makeRequestWithTokens(t,me).then(s=>{if(s===null)throw ze();return s})}function Ct(e,t){const s=ft(e._location.path,t),n=new x(e._location.bucket,s);return new C(e.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jt(e){return/^[A-Za-z]+:\/\//.test(e)}function Pt(e,t){return new C(e,t)}function be(e,t){if(e instanceof K){const s=e;if(s._bucket==null)throw Fe();const n=new C(s,s._bucket);return t!=null?be(n,t):n}else return t!==void 0?Ct(e,t):e}function Dt(e,t){if(t&&jt(t)){if(e instanceof K)return Pt(e,t);throw z("To use ref(service, url), the first argument must be a Storage instance.")}else return be(e,t)}function J(e,t){const s=t==null?void 0:t[re];return s==null?null:x.makeFromBucketSpec(s,e)}function St(e,t,s,n={}){e.host=`${t}:${s}`,e._protocol="http";const{mockUserToken:r}=n;r&&(e._overrideAuthToken=typeof r=="string"?r:Ae(r,e.app.options.projectId))}class K{constructor(t,s,n,r,i){this.app=t,this._authProvider=s,this._appCheckProvider=n,this._url=r,this._firebaseVersion=i,this._bucket=null,this._host=se,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Ie,this._maxUploadRetryTime=Oe,this._requests=new Set,r!=null?this._bucket=x.makeFromBucketSpec(r,this._host):this._bucket=J(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=x.makeFromBucketSpec(this._url,t):this._bucket=J(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){Y("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){Y("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const s=await t.getToken();if(s!==null)return s.accessToken}return null}async _getAppCheckToken(){const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new C(this,t)}_makeRequest(t,s,n,r,i=!0){if(this._deleted)return new We(ie());{const a=st(t,this._appId,n,r,s,this._firebaseVersion,i);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(t,s){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,s,n,r).getPromise()}}const Q="@firebase/storage",ee="0.13.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="storage";function Lt(e,t,s){return e=B(e),It(e,t,s)}function Bt(e){return e=B(e),Ot(e)}function $t(e,t){return e=B(e),Dt(e,t)}function Mt(e=Re(),t){e=B(e);const n=ye(e,we).getImmediate({identifier:t}),r=Te("storage");return r&&Ft(n,...r),n}function Ft(e,t,s,n={}){St(e,t,s,n)}function Ht(e,{instanceIdentifier:t}){const s=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return new K(s,n,r,t,Ne)}function zt(){Ee(new ke(we,Ht,"PUBLIC").setMultipleInstances(!0)),G(Q,ee,""),G(Q,ee,"esm2017")}zt();const qt=Mt(Ue),Vt=8*1024*1024,Wt=e=>e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9._-]+/g,"-"),Xt=async(e,t)=>{if(!e.type.startsWith("image/"))throw new Error("Le fichier sélectionné doit être une image.");if(e.size>Vt)throw new Error("L’image ne doit pas dépasser 8 Mo.");const s=t.replace(/[^a-zA-Z0-9-]+/g,"-")||"article",n=`${Date.now()}-${Wt(e.name)}`,r=$t(qt,`blog-images/${s}/${n}`);return await Lt(r,e,{contentType:e.type}),Bt(r)},H=(e,t)=>e.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\)|<br\s*\/?\s*>)/gi).filter(Boolean).map((s,n)=>{if(/^<br\s*\/?\s*>$/i.test(s))return o.jsx("br",{},`${t}-${n}`);if(s.startsWith("**")&&s.endsWith("**"))return o.jsx("strong",{children:s.slice(2,-2)},`${t}-${n}`);const r=s.match(/^\[([^\]]+)\]\(([^)]+)\)$/);return r?o.jsx("a",{href:r[2],rel:"noreferrer",target:"_blank",children:r[1]},`${t}-${n}`):o.jsx(E.Fragment,{children:s},`${t}-${n}`)}),Kt=e=>/^(#{1,3})\s/.test(e)||e==="---"||/^[-*]\s/.test(e),Gt=({content:e})=>{const t=e.replace(/\r/g,"").split(`
`),s=[];let n=0;for(;n<t.length;){const r=t[n].trim();if(!r){n+=1;continue}if(r==="---"){s.push(o.jsx("hr",{},`separator-${n}`)),n+=1;continue}const i=r.match(/^(#{1,3})\s+(.+)$/);if(i){const l=H(i[2],`heading-${n}`);s.push(i[1].length===3?o.jsx("h3",{children:l},`heading-${n}`):o.jsx("h2",{children:l},`heading-${n}`)),n+=1;continue}if(/^[-*]\s/.test(r)){const l=[];for(;n<t.length&&/^[-*]\s/.test(t[n].trim());)l.push(t[n].trim().slice(2)),n+=1;s.push(o.jsx("ul",{children:l.map((c,u)=>o.jsx("li",{children:H(c,`list-${n}-${u}`)},u))},`list-${n}`));continue}const a=[r];for(n+=1;n<t.length&&t[n].trim()&&!Kt(t[n].trim());)a.push(t[n].trim()),n+=1;s.push(o.jsx("p",{children:H(a.join(" "),`paragraph-${n}`)},`paragraph-${n}`))}return o.jsx(o.Fragment,{children:s})},Yt=({article:e,open:t,onClose:s,onSaved:n,allowIdentityEdit:r=!1})=>{const[i,a]=E.useState(e),[l,c]=E.useState(null),[u,g]=E.useState(""),[_,R]=E.useState(!1),[T,m]=E.useState("");E.useEffect(()=>{a(e),c(null),g(""),m("")},[e,t]),E.useEffect(()=>()=>{u.startsWith("blob:")&&URL.revokeObjectURL(u)},[u]);const b=(h,d)=>{a(k=>({...k,[h]:d}))},w=h=>{var k;const d=((k=h.target.files)==null?void 0:k[0])??null;u.startsWith("blob:")&&URL.revokeObjectURL(u),c(d),g(d?URL.createObjectURL(d):"")},U=async h=>{if(!i.title.trim()||!i.slug.trim()||!i.content.trim()){m("Le titre, l’adresse et le contenu sont obligatoires.");return}if(h==="published"&&!l&&!i.imageUrl){m("Ajoute une image principale avant de publier l’article.");return}R(!0),m("");try{const d=l?await Xt(l,i.slug):i.imageUrl,k={"Santé & Beauté":"sante-beaute",Mode:"mode",Mental:"mental","Sport & Nutrition":"sport-nutrition",Lifestyle:"lifestyle"},j=i.slug.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),$=r?`/blog/${k[i.category]}/${j}`:i.href,I={...i,href:$,slug:j,imageUrl:d,publicationDate:h==="published"&&i.status!=="published"?ne():i.publicationDate,status:h,usesStaticImage:l?!1:i.usesStaticImage};await te(I),a(I),c(null),g(""),n?n(I):s()}catch(d){m(d instanceof Error?d.message:"Impossible d’enregistrer l’article.")}finally{R(!1)}},A=u||i.imageUrl;return t?o.jsxs("div",{className:"blog-editor",role:"dialog","aria-modal":"true","aria-labelledby":"blog-editor-title",children:[o.jsx("button",{className:"blog-editor__backdrop",type:"button","aria-label":"Fermer l’éditeur",onClick:s}),o.jsxs("section",{className:"blog-editor__panel",children:[o.jsxs("header",{className:"blog-editor__header",children:[o.jsxs("div",{children:[o.jsx("span",{children:"Édition administrateur"}),o.jsx("h2",{id:"blog-editor-title",children:"Modifier l’article"})]}),o.jsx("button",{type:"button",className:"blog-editor__close",onClick:s,"aria-label":"Fermer",children:"×"})]}),o.jsxs("div",{className:"blog-editor__workspace",children:[o.jsxs("form",{className:"blog-editor__form",onSubmit:h=>h.preventDefault(),children:[o.jsxs("label",{children:["Titre",o.jsx("input",{value:i.title,onChange:h=>b("title",h.target.value)})]}),o.jsxs("div",{className:"blog-editor__row",children:[o.jsxs("label",{children:["Catégorie",o.jsxs("select",{value:i.category,disabled:!r,onChange:h=>b("category",h.target.value),children:[o.jsx("option",{children:"Santé & Beauté"}),o.jsx("option",{children:"Mode"}),o.jsx("option",{children:"Mental"}),o.jsx("option",{children:"Sport & Nutrition"}),o.jsx("option",{children:"Lifestyle"})]})]}),o.jsxs("label",{children:["Adresse de l’article",o.jsx("input",{value:i.slug,disabled:!r,onChange:h=>b("slug",h.target.value)})]})]}),o.jsxs("label",{children:["Résumé affiché sur les cartes",o.jsx("textarea",{rows:3,value:i.description,onChange:h=>b("description",h.target.value)})]}),o.jsxs("div",{className:"blog-editor__row",children:[o.jsxs("label",{children:["Rubrique au-dessus du titre",o.jsx("input",{value:i.eyebrow,onChange:h=>b("eyebrow",h.target.value)})]}),o.jsxs("label",{children:["Temps de lecture",o.jsx("input",{value:i.readingTime,onChange:h=>b("readingTime",h.target.value)})]})]}),o.jsxs("label",{children:["Date de publication",o.jsx("input",{type:"date",value:i.publicationDate,onChange:h=>b("publicationDate",h.target.value)})]}),o.jsxs("div",{className:"blog-editor__image-field",children:[o.jsxs("label",{children:["Image principale",o.jsx("input",{type:"file",accept:"image/*",onChange:w})]}),A?o.jsx("img",{src:A,alt:"Aperçu de l’image principale"}):null]}),o.jsxs("label",{children:["Texte alternatif de l’image",o.jsx("input",{value:i.imageAlt,onChange:h=>b("imageAlt",h.target.value)})]}),o.jsxs("label",{children:["Contenu de l’article",o.jsx("span",{className:"blog-editor__hint",children:"Utilise ## pour un titre, **texte** pour du gras et * pour une liste."}),o.jsx("textarea",{className:"blog-editor__content-input",value:i.content,onChange:h=>b("content",h.target.value)})]})]}),o.jsxs("aside",{className:"blog-editor__preview","aria-label":"Aperçu de l’article",children:[o.jsx("span",{className:"blog-editor__preview-label",children:"Aperçu en direct"}),A?o.jsx("img",{className:"blog-editor__preview-image",src:A,alt:i.imageAlt}):null,o.jsx("p",{className:"blog-editor__preview-eyebrow",children:i.eyebrow||i.category}),o.jsx("h1",{children:i.title||"Titre de l’article"}),o.jsx("p",{className:"blog-editor__preview-time",children:i.readingTime}),o.jsx("div",{className:"mental-article__content",children:o.jsx(Gt,{content:i.content})})]})]}),T?o.jsx("p",{className:"blog-editor__error",role:"alert",children:T}):null,o.jsxs("footer",{className:"blog-editor__footer",children:[o.jsx("button",{type:"button",className:"blog-admin-button blog-admin-button--secondary",onClick:s,disabled:_,children:"Annuler"}),o.jsx("button",{type:"button",className:"blog-admin-button blog-admin-button--secondary",onClick:()=>void U("draft"),disabled:_,children:i.status==="published"?"Mettre en brouillon":"Enregistrer le brouillon"}),o.jsx("button",{type:"button",className:"blog-admin-button",onClick:()=>void U("published"),disabled:_,children:_?"Enregistrement…":i.status==="published"?"Enregistrer et maintenir publié":"Publier l’article"})]})]})]}):null},Jt=({article:e})=>{const{isAdmin:t}=ve(),[s,n]=E.useState(!1),[r,i]=E.useState(e.status==="published"),[a,l]=E.useState("");E.useEffect(()=>{i(e.status==="published")},[e.status]);const c=async()=>{if(!(s||r)){n(!0),l("");try{await te({...e,publicationDate:ne(),status:"published"}),i(!0)}catch(u){l(u instanceof Error?u.message:"Impossible de publier l’article.")}finally{n(!1)}}};return t?o.jsxs("div",{className:"blog-admin-toolbar","aria-label":"Gestion de l’article","aria-busy":s,children:[o.jsx("span",{className:`blog-admin-toolbar__status blog-admin-toolbar__status--${r?"published":"draft"}`,children:r?"Publié":"Brouillon"}),r?null:o.jsx("button",{type:"button",className:"blog-admin-button blog-admin-button--secondary",onClick:()=>void c(),disabled:s,children:s?"Publication…":"Publier"}),a?o.jsx("span",{className:"blog-admin-toolbar__error",role:"alert",children:a}):null]}):null};export{Yt as B,Jt as a,Gt as b};
