import{u as L,j as W,k as Q,$ as E,V as G,_ as J,a as X,b as Y,c as _,d as Z,D as ee,e as te,f as ae,F as le,s as se,g as oe,h as re,i as ne}from"./VSnackbar-C6OjYHF-.js";import{_ as ue}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{a as B,V as F}from"./VRow-BJ2lLHBK.js";import{V as O}from"./VDivider-B1C29VjY.js";import{r,o as c,f as p,e as a,b as e,d as f,x as z,n as v,a6 as T,$ as j,P as ie,Q as de,w as ce,j as pe,y as A,t as fe,v as me,a2 as ve}from"./main-DUjuXfcn.js";import{V as _e}from"./VCardText-D3sbAslv.js";import{V as q}from"./VCard-BxBN4weJ.js";/* empty css              */import"./VTextField-ldOFEvNc.js";import"./VList-ByXi2jsW.js";import"./VImg-DEwOFI1q.js";import"./VOverlay-PG9Nuj_x.js";import"./VChip-TXVQM-6z.js";import"./VTooltip-CcShCuzP.js";import"./index-DYf1Ga7p.js";import"./VMenu-BhRTpWZh.js";const Se=""+new URL("5-qijms7B5.png",import.meta.url).href,H=m=>(ie("data-v-d1ff3871"),m=m(),de(),m),we=["src"],ge={class:"d-flex flex-wrap gap-4 justify-space-between"},Ve=H(()=>f("span",{class:"text-h5 text-white"},"Previous",-1)),he=H(()=>f("span",{class:"text-h5 text-white"},"Continue",-1)),ye={__name:"SignatureReview",props:{viewMode:{type:Boolean,required:!0},currentStep:{type:Number,required:!0}},emits:["prevStep","nextStep"],setup(m,{emit:S}){const w=m,g=S,u=L(),d=W();let l=r(!1);const x=async()=>{l.value=!0;const n=new FormData;n.append("name",d.data.name),n.append("email",d.data.email),n.append("otp",d.data.otp),await E("/signature/"+d.data.shortUrl,{method:"POST",body:n}).then(o=>{l.value=!1,u.setDocument(o.data),u.setDownloadUrl(o.signedDoc),d.setAllSigner(o.data.signers),g("nextStep",1)}).catch(o=>{l.value=!1,g("alert",{data:o,type:"error"})})};return(n,o)=>(c(),p(F,null,{default:a(()=>[e(B,{class:"mx-auto",cols:"12"},{default:a(()=>[f("div",null,[e(Q,{"no-actions":""},{default:a(()=>[f("div",{class:z(w.viewMode?"pdf-container pdf-loader":"pdf-container-iframe pdf-loader-iframe")},[f("iframe",{src:v(u).reviewSignedUrl,height:"100%",width:"100%"},null,8,we)],2)]),_:1})]),e(O,{class:"border-1px"}),e(B,{cols:"12"},{default:a(()=>[f("div",ge,[e(T,{color:"success",onClick:o[0]||(o[0]=b=>n.$emit("prevStep",1))},{default:a(()=>[e(j,{icon:"tabler-arrow-left",start:"",class:"flip-in-rtl"}),Ve]),_:1}),e(T,{loading:v(l),color:"success",onClick:x,disabled:v(l)},{default:a(()=>[he,e(j,{icon:"tabler-arrow-right",end:"",class:"flip-in-ltr"})]),_:1},8,["loading","disabled"])])]),_:1})]),_:1})]),_:1}))}},xe=ue(ye,[["__scopeId","data-v-d1ff3871"]]),Fe={__name:"[id]",setup(m){const S=pe(),w=r(S.params.id),g=r(S.query.fullview),u=r(!0);parseInt(g.value)===0&&(u.value=!1);const d=[{title:"Verify",icon:se},{title:"Review",icon:oe},{title:"Sign",icon:re},{title:"Review",icon:Se},{title:"Download",icon:ne}],l=r(0),x=r(!0);let n=r(null),o=r(null),b=r("error");const k=s=>{var M,$,N,U;const t=s.data,i=s.type,K=s==null?void 0:s.custom;if(n.value=!0,b.value=i,i==="success"||K===!0)o.value=t;else if(typeof(($=(M=t==null?void 0:t.response)==null?void 0:M._data)==null?void 0:$.message)=="object"&&((U=(N=t==null?void 0:t.response)==null?void 0:N._data)==null?void 0:U.message)!==null){let P="";for(const I in t.response._data.message)t.response._data.message.hasOwnProperty(I)&&(P+=`${t.response._data.message[I]}
`);o.value=P.trim()}else o.value=t.response._data.message},V=s=>{l.value=l.value+s},h=s=>{l.value=l.value-s},D=r(0),R=r(0),C=r(0),y=r(null);return ce(l,s=>{s===1&&(D.value++,R.value++),s===2&&y.value&&(y.value.resizeCanvas(),y.value.fetchHistory()),C.value=s}),(s,t)=>(c(),p(G,{class:"v-container"},{default:a(()=>[e(q,null,{default:a(()=>[u.value?(c(),p(F,{key:0},{default:a(()=>[e(_e,null,{default:a(()=>[e(J,{"current-step":l.value,"onUpdate:currentStep":t[0]||(t[0]=i=>l.value=i),items:d,"is-active-step-valid":x.value,align:"center"},null,8,["current-step","is-active-step-valid"])]),_:1})]),_:1})):A("",!0),e(O)]),_:1}),e(X,{modelValue:v(n),"onUpdate:modelValue":t[1]||(t[1]=i=>ve(n)?n.value=i:n=i),location:"top end",variant:"flat",color:v(b)},{default:a(()=>[fe(me(v(o)),1)]),_:1},8,["modelValue","color"]),f("div",{class:z({"step-rule":l.value===0})},[e(q,null,{default:a(()=>[e(Y,{modelValue:l.value,"onUpdate:modelValue":t[2]||(t[2]=i=>l.value=i),disabled:""},{default:a(()=>[e(_,null,{default:a(()=>[e(Z,{onNextStep:V,onAlert:k,"short-url":w.value},null,8,["short-url"])]),_:1}),e(_,null,{default:a(()=>[(c(),p(ee,{key:D.value,viewMode:u.value,currentStep:C.value,onPrevStep:h,onNextStep:V},null,8,["viewMode","currentStep"]))]),_:1}),e(_,null,{default:a(()=>[(c(),p(te,{ref_key:"signatureRef",ref:y,key:R.value,onPrevStep:h,onNextStep:V,"short-url":w.value,onAlert:k},null,8,["short-url"]))]),_:1}),e(_,null,{default:a(()=>[(c(),p(xe,{key:D.value,viewMode:u.value,currentStep:C.value,onPrevStep:h,onNextStep:V},null,8,["viewMode","currentStep"]))]),_:1}),e(_,null,{default:a(()=>[e(ae,{viewMode:u.value,onPrevStep:h,onAlert:k},null,8,["viewMode"])]),_:1})]),_:1},8,["modelValue"])]),_:1}),u.value?(c(),p(le,{key:0})):A("",!0)],2)]),_:1}))}};export{Fe as default};