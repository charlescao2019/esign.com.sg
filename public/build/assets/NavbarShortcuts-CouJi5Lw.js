import{P as b}from"./vue3-perfect-scrollbar.esm-BkSzP1-S.js";import{k as h,a as g,o,f as r,e,b as t,$ as n,n as d,c as V,F as v,i as x,x as y,d as i,v as f}from"./main-DUjuXfcn.js";import{V as C}from"./VMenu-BhRTpWZh.js";import{V as S,a as k}from"./VCard-BxBN4weJ.js";import{V as w,a as A}from"./VDivider-B1C29VjY.js";import{V as I,a as z}from"./VRow-BJ2lLHBK.js";import"./VOverlay-PG9Nuj_x.js";import"./VImg-DEwOFI1q.js";import"./VCardText-D3sbAslv.js";/* empty css              */const B=i("h6",{class:"text-base font-weight-medium"}," Shortcuts ",-1),D={class:"text-base font-weight-medium mt-3 mb-0"},$={class:"text-sm mb-0"},M={__name:"Shortcuts",props:{togglerIcon:{type:String,required:!1,default:"tabler-layout-grid-add"},shortcuts:{type:Array,required:!0}},setup(l){const s=l,c=h();return(u,p)=>{const m=g("IconBtn");return o(),r(m,null,{default:e(()=>[t(n,{size:"24",icon:s.togglerIcon},null,8,["icon"]),t(C,{activator:"parent",offset:"12px",location:"bottom end"},{default:e(()=>[t(S,{width:u.$vuetify.display.smAndDown?330:380,"max-height":"560",class:"d-flex flex-column"},{default:e(()=>[t(k,{class:"py-3"},{append:e(()=>[t(m,{size:"small",color:"high-emphasis"},{default:e(()=>[t(n,{size:"20",icon:"tabler-plus"})]),_:1})]),default:e(()=>[B]),_:1}),t(w),t(d(b),{options:{wheelPropagation:!1}},{default:e(()=>[t(I,{class:"ma-0 mt-n1"},{default:e(()=>[(o(!0),V(v,null,x(s.shortcuts,(a,_)=>(o(),r(z,{key:a.title,cols:"6",class:y(["text-center border-t cursor-pointer pa-6 shortcut-icon",(_+1)%2?"border-e":""]),onClick:P=>d(c).push(a.to)},{default:e(()=>[t(A,{variant:"tonal",size:"50"},{default:e(()=>[t(n,{size:"26",color:"high-emphasis",icon:a.icon},null,8,["icon"])]),_:2},1024),i("h6",D,f(a.title),1),i("p",$,f(a.subtitle),1)]),_:2},1032,["class","onClick"]))),128))]),_:1})]),_:1})]),_:1},8,["width"])]),_:1})]),_:1})}}},J={__name:"NavbarShortcuts",setup(l){const s=[{icon:"tabler-calendar",title:"Calendar",subtitle:"Appointments",to:{name:"apps-calendar"}},{icon:"tabler-file-dollar",title:"Invoice App",subtitle:"Manage Accounts",to:{name:"apps-invoice-list"}},{icon:"tabler-user",title:"Users",subtitle:"Manage Users",to:{name:"apps-user-list"}},{icon:"tabler-users",title:"Role Management",subtitle:"Permission",to:{name:"apps-roles"}},{icon:"tabler-device-desktop-analytics",title:"Dashboard",subtitle:"Dashboard Analytics",to:{name:"dashboards-analytics"}},{icon:"tabler-settings",title:"Settings",subtitle:"Account Settings",to:{name:"pages-account-settings-tab",params:{tab:"account"}}}];return(c,u)=>{const p=M;return o(),r(p,{shortcuts:s})}}};export{J as default};
