import{c as k,a as A,d as M,e as y,V as g,f as S}from"./VOverlay-CWWWZdTz.js";import{ad as K,a_ as O,ag as U,aG as I,aQ as R,a4 as p,r as N,R as F,aU as L,N as j,w as q,q as w,ah as G,b as V,aO as Q,aZ as Z,bl as b,bD as $,bC as P}from"./main-D3wYSAog.js";const z=K({id:String,...O(k({closeDelay:250,closeOnContentClick:!0,locationStrategy:"connected",openDelay:300,scrim:!1,scrollStrategy:"reposition",transition:{component:A}}),["absolute"])},"VMenu"),W=U()({name:"VMenu",props:z(),emits:{"update:modelValue":l=>!0},setup(l,E){let{slots:i}=E;const r=I(l,"modelValue"),{scopeId:h}=M(),x=R(),f=p(()=>l.id||`v-menu-${x}`),n=N(),a=F(y,null),c=L(0);j(y,{register(){++c.value},unregister(){--c.value},closeParents(){setTimeout(()=>{c.value||(r.value=!1,a==null||a.closeParents())},40)}});async function v(e){var s,u,d;const t=e.relatedTarget,o=e.target;await Z(),r.value&&t!==o&&((s=n.value)!=null&&s.contentEl)&&((u=n.value)!=null&&u.globalTop)&&![document,n.value.contentEl].includes(o)&&!n.value.contentEl.contains(o)&&((d=b(n.value.contentEl)[0])==null||d.focus())}q(r,e=>{e?(a==null||a.register(),document.addEventListener("focusin",v,{once:!0})):(a==null||a.unregister(),document.removeEventListener("focusin",v))});function C(){a==null||a.closeParents()}function D(e){var t,o,s;l.disabled||e.key==="Tab"&&($(b((t=n.value)==null?void 0:t.contentEl,!1),e.shiftKey?"prev":"next",d=>d.tabIndex>=0)||(r.value=!1,(s=(o=n.value)==null?void 0:o.activatorEl)==null||s.focus()))}function m(e){var o;if(l.disabled)return;const t=(o=n.value)==null?void 0:o.contentEl;t&&r.value?e.key==="ArrowDown"?(e.preventDefault(),P(t,"next")):e.key==="ArrowUp"&&(e.preventDefault(),P(t,"prev")):["ArrowDown","ArrowUp"].includes(e.key)&&(r.value=!0,e.preventDefault(),setTimeout(()=>setTimeout(()=>m(e))))}const T=p(()=>w({"aria-haspopup":"menu","aria-expanded":String(r.value),"aria-owns":f.value,onKeydown:m},l.activatorProps));return G(()=>{const e=g.filterProps(l);return V(g,w({ref:n,id:f.value,class:["v-menu",l.class],style:l.style},e,{modelValue:r.value,"onUpdate:modelValue":t=>r.value=t,absolute:!0,activatorProps:T.value,"onClick:outside":C,onKeydown:D},h),{activator:i.activator,default:function(){for(var t=arguments.length,o=new Array(t),s=0;s<t;s++)o[s]=arguments[s];return V(Q,{root:"VMenu"},{default:()=>{var u;return[(u=i.default)==null?void 0:u.call(i,...o)]}})}})}),S({id:f,ΨopenChildren:c},n)}});export{W as V};
