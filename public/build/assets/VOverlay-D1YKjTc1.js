import{bN as Fe,bQ as Le,ag as Me,b as M,q as I,T as ue,ad as j,r as D,b3 as z,b5 as me,w as k,aR as H,bR as Xe,bS as we,bT as re,bU as ae,bV as xe,a4 as P,aZ as te,bW as pe,b6 as _,b1 as Ee,at as he,bX as _e,bY as Ue,b4 as ge,R as We,bi as Se,aY as Ge,aU as Y,b0 as Ze,E as Ke,ba as Ne,N as Je,by as Qe,bw as et,ae as tt,aC as nt,al as ot,aG as rt,aH as at,az as it,am as st,_ as lt,aK as ct,bx as ut,bZ as ft,ah as dt,b_ as vt,I as mt,J as ht,aW as gt,F as yt,b$ as bt}from"./main-DFJ7IKVY.js";import{m as wt,M as xt}from"./VImg-Bw5i8tDJ.js";class q{constructor(n){let{x:t,y:r,width:o,height:a}=n;this.x=t,this.y=r,this.width=o,this.height=a}get top(){return this.y}get bottom(){return this.y+this.height}get left(){return this.x}get right(){return this.x+this.width}}function Oe(e,n){return{x:{before:Math.max(0,n.left-e.left),after:Math.max(0,e.right-n.right)},y:{before:Math.max(0,n.top-e.top),after:Math.max(0,e.bottom-n.bottom)}}}function De(e){return Array.isArray(e)?new q({x:e[0],y:e[1],width:0,height:0}):e.getBoundingClientRect()}function He(e){const n=e.getBoundingClientRect(),t=getComputedStyle(e),r=t.transform;if(r){let o,a,i,s,c;if(r.startsWith("matrix3d("))o=r.slice(9,-1).split(/, /),a=+o[0],i=+o[5],s=+o[12],c=+o[13];else if(r.startsWith("matrix("))o=r.slice(7,-1).split(/, /),a=+o[0],i=+o[3],s=+o[4],c=+o[5];else return new q(n);const u=t.transformOrigin,f=n.x-s-(1-a)*parseFloat(u),d=n.y-c-(1-i)*parseFloat(u.slice(u.indexOf(" ")+1)),y=a?n.width/a:e.offsetWidth+1,g=i?n.height/i:e.offsetHeight+1;return new q({x:f,y:d,width:y,height:g})}else return new q(n)}function Z(e,n,t){if(typeof e.animate>"u")return{finished:Promise.resolve()};let r;try{r=e.animate(n,t)}catch{return{finished:Promise.resolve()}}return typeof r.finished>"u"&&(r.finished=new Promise(o=>{r.onfinish=()=>{o(r)}})),r}const K=new WeakMap;function pt(e,n){Object.keys(n).forEach(t=>{if(Fe(t)){const r=Le(t),o=K.get(e);if(n[t]==null)o==null||o.forEach(a=>{const[i,s]=a;i===r&&(e.removeEventListener(r,s),o.delete(a))});else if(!o||![...o].some(a=>a[0]===r&&a[1]===n[t])){e.addEventListener(r,n[t]);const a=o||new Set;a.add([r,n[t]]),K.has(e)||K.set(e,a)}}else n[t]==null?e.removeAttribute(t):e.setAttribute(t,n[t])})}function Et(e,n){Object.keys(n).forEach(t=>{if(Fe(t)){const r=Le(t),o=K.get(e);o==null||o.forEach(a=>{const[i,s]=a;i===r&&(e.removeEventListener(r,s),o.delete(a))})}else e.removeAttribute(t)})}function Ve(e){if(typeof e.getRootNode!="function"){for(;e.parentNode;)e=e.parentNode;return e!==document?null:document}const n=e.getRootNode();return n!==document&&n.getRootNode({composed:!0})!==document?null:n}const fe="cubic-bezier(0.4, 0, 0.2, 1)",St="cubic-bezier(0.0, 0, 0.2, 1)",Ot="cubic-bezier(0.4, 0, 1, 1)";function Pt(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;for(;e;){if(n?Ct(e):ye(e))return e;e=e.parentElement}return document.scrollingElement}function Q(e,n){const t=[];if(n&&e&&!n.contains(e))return t;for(;e&&(ye(e)&&t.push(e),e!==n);)e=e.parentElement;return t}function ye(e){if(!e||e.nodeType!==Node.ELEMENT_NODE)return!1;const n=window.getComputedStyle(e);return n.overflowY==="scroll"||n.overflowY==="auto"&&e.scrollHeight>e.clientHeight}function Ct(e){if(!e||e.nodeType!==Node.ELEMENT_NODE)return!1;const n=window.getComputedStyle(e);return["scroll","auto"].includes(n.overflowY)}function At(e){for(;e;){if(window.getComputedStyle(e).position==="fixed")return!0;e=e.offsetParent}return!1}const Rt=j({target:[Object,Array]},"v-dialog-transition"),sn=Me()({name:"VDialogTransition",props:Rt(),setup(e,n){let{slots:t}=n;const r={onBeforeEnter(o){o.style.pointerEvents="none",o.style.visibility="hidden"},async onEnter(o,a){var y;await new Promise(g=>requestAnimationFrame(g)),await new Promise(g=>requestAnimationFrame(g)),o.style.visibility="";const{x:i,y:s,sx:c,sy:u,speed:f}=Ce(e.target,o),d=Z(o,[{transform:`translate(${i}px, ${s}px) scale(${c}, ${u})`,opacity:0},{}],{duration:225*f,easing:St});(y=Pe(o))==null||y.forEach(g=>{Z(g,[{opacity:0},{opacity:0,offset:.33},{}],{duration:225*2*f,easing:fe})}),d.finished.then(()=>a())},onAfterEnter(o){o.style.removeProperty("pointer-events")},onBeforeLeave(o){o.style.pointerEvents="none"},async onLeave(o,a){var y;await new Promise(g=>requestAnimationFrame(g));const{x:i,y:s,sx:c,sy:u,speed:f}=Ce(e.target,o);Z(o,[{},{transform:`translate(${i}px, ${s}px) scale(${c}, ${u})`,opacity:0}],{duration:125*f,easing:Ot}).finished.then(()=>a()),(y=Pe(o))==null||y.forEach(g=>{Z(g,[{},{opacity:0,offset:.2},{opacity:0}],{duration:125*2*f,easing:fe})})},onAfterLeave(o){o.style.removeProperty("pointer-events")}};return()=>e.target?M(ue,I({name:"dialog-transition"},r,{css:!1}),t):M(ue,{name:"dialog-transition"},t)}});function Pe(e){var t;const n=(t=e.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list"))==null?void 0:t.children;return n&&[...n]}function Ce(e,n){const t=De(e),r=He(n),[o,a]=getComputedStyle(n).transformOrigin.split(" ").map(A=>parseFloat(A)),[i,s]=getComputedStyle(n).getPropertyValue("--v-overlay-anchor-origin").split(" ");let c=t.left+t.width/2;i==="left"||s==="left"?c-=t.width/2:(i==="right"||s==="right")&&(c+=t.width/2);let u=t.top+t.height/2;i==="top"||s==="top"?u-=t.height/2:(i==="bottom"||s==="bottom")&&(u+=t.height/2);const f=t.width/r.width,d=t.height/r.height,y=Math.max(1,f,d),g=f/y||0,m=d/y||0,v=r.width*r.height/(window.innerWidth*window.innerHeight),C=v>.12?Math.min(1.5,(v-.12)*10+1):1;return{x:c-(o+r.left),y:u-(a+r.top),sx:g,sy:m,speed:C}}const ie=Symbol("Forwarded refs");function se(e,n){let t=e;for(;t;){const r=Reflect.getOwnPropertyDescriptor(t,n);if(r)return r;t=Object.getPrototypeOf(t)}}function ln(e){for(var n=arguments.length,t=new Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];return e[ie]=t,new Proxy(e,{get(o,a){if(Reflect.has(o,a))return Reflect.get(o,a);if(!(typeof a=="symbol"||a.startsWith("$")||a.startsWith("__"))){for(const i of t)if(i.value&&Reflect.has(i.value,a)){const s=Reflect.get(i.value,a);return typeof s=="function"?s.bind(i.value):s}}},has(o,a){if(Reflect.has(o,a))return!0;if(typeof a=="symbol"||a.startsWith("$")||a.startsWith("__"))return!1;for(const i of t)if(i.value&&Reflect.has(i.value,a))return!0;return!1},set(o,a,i){if(Reflect.has(o,a))return Reflect.set(o,a,i);if(typeof a=="symbol"||a.startsWith("$")||a.startsWith("__"))return!1;for(const s of t)if(s.value&&Reflect.has(s.value,a))return Reflect.set(s.value,a,i);return!1},getOwnPropertyDescriptor(o,a){var s;const i=Reflect.getOwnPropertyDescriptor(o,a);if(i)return i;if(!(typeof a=="symbol"||a.startsWith("$")||a.startsWith("__"))){for(const c of t){if(!c.value)continue;const u=se(c.value,a)??("_"in c.value?se((s=c.value._)==null?void 0:s.setupState,a):void 0);if(u)return u}for(const c of t){const u=c.value&&c.value[ie];if(!u)continue;const f=u.slice();for(;f.length;){const d=f.shift(),y=se(d.value,a);if(y)return y;const g=d.value&&d.value[ie];g&&f.push(...g)}}}}})}function le(e,n){return{x:e.x+n.x,y:e.y+n.y}}function Tt(e,n){return{x:e.x-n.x,y:e.y-n.y}}function Ae(e,n){if(e.side==="top"||e.side==="bottom"){const{side:t,align:r}=e,o=r==="left"?0:r==="center"?n.width/2:r==="right"?n.width:r,a=t==="top"?0:t==="bottom"?n.height:t;return le({x:o,y:a},n)}else if(e.side==="left"||e.side==="right"){const{side:t,align:r}=e,o=t==="left"?0:t==="right"?n.width:t,a=r==="top"?0:r==="center"?n.height/2:r==="bottom"?n.height:r;return le({x:o,y:a},n)}return le({x:n.width/2,y:n.height/2},n)}const $e={static:Ft,connected:Mt},kt=j({locationStrategy:{type:[String,Function],default:"static",validator:e=>typeof e=="function"||e in $e},location:{type:String,default:"bottom"},origin:{type:String,default:"auto"},offset:[Number,String,Array]},"VOverlay-location-strategies");function Bt(e,n){const t=D({}),r=D();z&&me(()=>!!(n.isActive.value&&e.locationStrategy),a=>{var i,s;k(()=>e.locationStrategy,a),H(()=>{window.removeEventListener("resize",o),r.value=void 0}),window.addEventListener("resize",o,{passive:!0}),typeof e.locationStrategy=="function"?r.value=(i=e.locationStrategy(n,e,t))==null?void 0:i.updateLocation:r.value=(s=$e[e.locationStrategy](n,e,t))==null?void 0:s.updateLocation});function o(a){var i;(i=r.value)==null||i.call(r,a)}return{contentStyles:t,updateLocation:r}}function Ft(){}function Lt(e,n){n?e.style.removeProperty("left"):e.style.removeProperty("right");const t=He(e);return n?t.x+=parseFloat(e.style.right||0):t.x-=parseFloat(e.style.left||0),t.y-=parseFloat(e.style.top||0),t}function Mt(e,n,t){(Array.isArray(e.target.value)||At(e.target.value))&&Object.assign(t.value,{position:"fixed",top:0,[e.isRtl.value?"right":"left"]:0});const{preferredAnchor:o,preferredOrigin:a}=Xe(()=>{const m=we(n.location,e.isRtl.value),v=n.origin==="overlap"?m:n.origin==="auto"?re(m):we(n.origin,e.isRtl.value);return m.side===v.side&&m.align===ae(v).align?{preferredAnchor:xe(m),preferredOrigin:xe(v)}:{preferredAnchor:m,preferredOrigin:v}}),[i,s,c,u]=["minWidth","minHeight","maxWidth","maxHeight"].map(m=>P(()=>{const v=parseFloat(n[m]);return isNaN(v)?1/0:v})),f=P(()=>{if(Array.isArray(n.offset))return n.offset;if(typeof n.offset=="string"){const m=n.offset.split(" ").map(parseFloat);return m.length<2&&m.push(0),m}return typeof n.offset=="number"?[n.offset,0]:[0,0]});let d=!1;const y=new ResizeObserver(()=>{d&&g()});k([e.target,e.contentEl],(m,v)=>{let[C,A]=m,[p,w]=v;p&&!Array.isArray(p)&&y.unobserve(p),C&&!Array.isArray(C)&&y.observe(C),w&&y.unobserve(w),A&&y.observe(A)},{immediate:!0}),H(()=>{y.disconnect()});function g(){if(d=!1,requestAnimationFrame(()=>d=!0),!e.target.value||!e.contentEl.value)return;const m=De(e.target.value),v=Lt(e.contentEl.value,e.isRtl.value),C=Q(e.contentEl.value),A=12;C.length||(C.push(document.documentElement),e.contentEl.value.style.top&&e.contentEl.value.style.left||(v.x-=parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x")||0),v.y-=parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y")||0)));const p=C.reduce((S,x)=>{const h=x.getBoundingClientRect(),b=new q({x:x===document.documentElement?0:h.x,y:x===document.documentElement?0:h.y,width:x.clientWidth,height:x.clientHeight});return S?new q({x:Math.max(S.left,b.left),y:Math.max(S.top,b.top),width:Math.min(S.right,b.right)-Math.max(S.left,b.left),height:Math.min(S.bottom,b.bottom)-Math.max(S.top,b.top)}):b},void 0);p.x+=A,p.y+=A,p.width-=A*2,p.height-=A*2;let w={anchor:o.value,origin:a.value};function V(S){const x=new q(v),h=Ae(S.anchor,m),b=Ae(S.origin,x);let{x:B,y:L}=Tt(h,b);switch(S.anchor.side){case"top":L-=f.value[0];break;case"bottom":L+=f.value[0];break;case"left":B-=f.value[0];break;case"right":B+=f.value[0];break}switch(S.anchor.align){case"top":L-=f.value[1];break;case"bottom":L+=f.value[1];break;case"left":B-=f.value[1];break;case"right":B+=f.value[1];break}return x.x+=B,x.y+=L,x.width=Math.min(x.width,c.value),x.height=Math.min(x.height,u.value),{overflows:Oe(x,p),x:B,y:L}}let F=0,R=0;const l={x:0,y:0},T={x:!1,y:!1};let ne=-1;for(;!(ne++>10);){const{x:S,y:x,overflows:h}=V(w);F+=S,R+=x,v.x+=S,v.y+=x;{const b=pe(w.anchor),B=h.x.before||h.x.after,L=h.y.before||h.y.after;let X=!1;if(["x","y"].forEach(O=>{if(O==="x"&&B&&!T.x||O==="y"&&L&&!T.y){const $={anchor:{...w.anchor},origin:{...w.origin}},U=O==="x"?b==="y"?ae:re:b==="y"?re:ae;$.anchor=U($.anchor),$.origin=U($.origin);const{overflows:W}=V($);(W[O].before<=h[O].before&&W[O].after<=h[O].after||W[O].before+W[O].after<(h[O].before+h[O].after)/2)&&(w=$,X=T[O]=!0)}}),X)continue}h.x.before&&(F+=h.x.before,v.x+=h.x.before),h.x.after&&(F-=h.x.after,v.x-=h.x.after),h.y.before&&(R+=h.y.before,v.y+=h.y.before),h.y.after&&(R-=h.y.after,v.y-=h.y.after);{const b=Oe(v,p);l.x=p.width-b.x.before-b.x.after,l.y=p.height-b.y.before-b.y.after,F+=b.x.before,v.x+=b.x.before,R+=b.y.before,v.y+=b.y.before}break}const oe=pe(w.anchor);return Object.assign(t.value,{"--v-overlay-anchor-origin":`${w.anchor.side} ${w.anchor.align}`,transformOrigin:`${w.origin.side} ${w.origin.align}`,top:_(ce(R)),left:e.isRtl.value?void 0:_(ce(F)),right:e.isRtl.value?_(ce(-F)):void 0,minWidth:_(oe==="y"?Math.min(i.value,m.width):i.value),maxWidth:_(Re(Ee(l.x,i.value===1/0?0:i.value,c.value))),maxHeight:_(Re(Ee(l.y,s.value===1/0?0:s.value,u.value)))}),{available:l,contentBox:v}}return k(()=>[o.value,a.value,n.offset,n.minWidth,n.minHeight,n.maxWidth,n.maxHeight],()=>g()),te(()=>{const m=g();if(!m)return;const{available:v,contentBox:C}=m;C.height>v.y&&requestAnimationFrame(()=>{g(),requestAnimationFrame(()=>{g()})})}),{updateLocation:g}}function ce(e){return Math.round(e*devicePixelRatio)/devicePixelRatio}function Re(e){return Math.ceil(e*devicePixelRatio)/devicePixelRatio}let de=!0;const ee=[];function _t(e){!de||ee.length?(ee.push(e),ve()):(de=!1,e(),ve())}let Te=-1;function ve(){cancelAnimationFrame(Te),Te=requestAnimationFrame(()=>{const e=ee.shift();e&&e(),ee.length?ve():de=!0})}const J={none:null,close:Dt,block:Ht,reposition:Vt},Wt=j({scrollStrategy:{type:[String,Function],default:"block",validator:e=>typeof e=="function"||e in J}},"VOverlay-scroll-strategies");function Nt(e,n){if(!z)return;let t;he(async()=>{t==null||t.stop(),n.isActive.value&&e.scrollStrategy&&(t=_e(),await te(),t.active&&t.run(()=>{var r;typeof e.scrollStrategy=="function"?e.scrollStrategy(n,e,t):(r=J[e.scrollStrategy])==null||r.call(J,n,e,t)}))}),H(()=>{t==null||t.stop()})}function Dt(e){function n(t){e.isActive.value=!1}Ie(e.targetEl.value??e.contentEl.value,n)}function Ht(e,n){var i;const t=(i=e.root.value)==null?void 0:i.offsetParent,r=[...new Set([...Q(e.targetEl.value,n.contained?t:void 0),...Q(e.contentEl.value,n.contained?t:void 0)])].filter(s=>!s.classList.contains("v-overlay-scroll-blocked")),o=window.innerWidth-document.documentElement.offsetWidth,a=(s=>ye(s)&&s)(t||document.documentElement);a&&e.root.value.classList.add("v-overlay--scroll-blocked"),r.forEach((s,c)=>{s.style.setProperty("--v-body-scroll-x",_(-s.scrollLeft)),s.style.setProperty("--v-body-scroll-y",_(-s.scrollTop)),s!==document.documentElement&&s.style.setProperty("--v-scrollbar-offset",_(o)),s.classList.add("v-overlay-scroll-blocked")}),H(()=>{r.forEach((s,c)=>{const u=parseFloat(s.style.getPropertyValue("--v-body-scroll-x")),f=parseFloat(s.style.getPropertyValue("--v-body-scroll-y")),d=s.style.scrollBehavior;s.style.scrollBehavior="auto",s.style.removeProperty("--v-body-scroll-x"),s.style.removeProperty("--v-body-scroll-y"),s.style.removeProperty("--v-scrollbar-offset"),s.classList.remove("v-overlay-scroll-blocked"),s.scrollLeft=-u,s.scrollTop=-f,s.style.scrollBehavior=d}),a&&e.root.value.classList.remove("v-overlay--scroll-blocked")})}function Vt(e,n,t){let r=!1,o=-1,a=-1;function i(s){_t(()=>{var f,d;const c=performance.now();(d=(f=e.updateLocation).value)==null||d.call(f,s),r=(performance.now()-c)/(1e3/60)>2})}a=(typeof requestIdleCallback>"u"?s=>s():requestIdleCallback)(()=>{t.run(()=>{Ie(e.targetEl.value??e.contentEl.value,s=>{r?(cancelAnimationFrame(o),o=requestAnimationFrame(()=>{o=requestAnimationFrame(()=>{i(s)})})):i(s)})})}),H(()=>{typeof cancelIdleCallback<"u"&&cancelIdleCallback(a),cancelAnimationFrame(o)})}function Ie(e,n){const t=[document,...Q(e)];t.forEach(r=>{r.addEventListener("scroll",n,{passive:!0})}),H(()=>{t.forEach(r=>{r.removeEventListener("scroll",n)})})}const $t=Symbol.for("vuetify:v-menu"),It=j({closeDelay:[Number,String],openDelay:[Number,String]},"delay");function qt(e,n){let t=()=>{};function r(i){t==null||t();const s=Number(i?e.openDelay:e.closeDelay);return new Promise(c=>{t=Ue(s,()=>{n==null||n(i),c(i)})})}function o(){return r(!0)}function a(){return r(!1)}return{clearDelay:t,runOpenDelay:o,runCloseDelay:a}}const zt=j({target:[String,Object],activator:[String,Object],activatorProps:{type:Object,default:()=>({})},openOnClick:{type:Boolean,default:void 0},openOnHover:Boolean,openOnFocus:{type:Boolean,default:void 0},closeOnContentClick:Boolean,...It()},"VOverlay-activator");function jt(e,n){let{isActive:t,isTop:r}=n;const o=ge("useActivator"),a=D();let i=!1,s=!1,c=!0;const u=P(()=>e.openOnFocus||e.openOnFocus==null&&e.openOnHover),f=P(()=>e.openOnClick||e.openOnClick==null&&!e.openOnHover&&!u.value),{runOpenDelay:d,runCloseDelay:y}=qt(e,l=>{l===(e.openOnHover&&i||u.value&&s)&&!(e.openOnHover&&t.value&&!r.value)&&(t.value!==l&&(c=!0),t.value=l)}),g=D(),m={onClick:l=>{l.stopPropagation(),a.value=l.currentTarget||l.target,t.value||(g.value=[l.clientX,l.clientY]),t.value=!t.value},onMouseenter:l=>{var T;(T=l.sourceCapabilities)!=null&&T.firesTouchEvents||(i=!0,a.value=l.currentTarget||l.target,d())},onMouseleave:l=>{i=!1,y()},onFocus:l=>{Ge(l.target,":focus-visible")!==!1&&(s=!0,l.stopPropagation(),a.value=l.currentTarget||l.target,d())},onBlur:l=>{s=!1,l.stopPropagation(),y()}},v=P(()=>{const l={};return f.value&&(l.onClick=m.onClick),e.openOnHover&&(l.onMouseenter=m.onMouseenter,l.onMouseleave=m.onMouseleave),u.value&&(l.onFocus=m.onFocus,l.onBlur=m.onBlur),l}),C=P(()=>{const l={};if(e.openOnHover&&(l.onMouseenter=()=>{i=!0,d()},l.onMouseleave=()=>{i=!1,y()}),u.value&&(l.onFocusin=()=>{s=!0,d()},l.onFocusout=()=>{s=!1,y()}),e.closeOnContentClick){const T=We($t,null);l.onClick=()=>{t.value=!1,T==null||T.closeParents()}}return l}),A=P(()=>{const l={};return e.openOnHover&&(l.onMouseenter=()=>{c&&(i=!0,c=!1,d())},l.onMouseleave=()=>{i=!1,y()}),l});k(r,l=>{l&&(e.openOnHover&&!i&&(!u.value||!s)||u.value&&!s&&(!e.openOnHover||!i))&&(t.value=!1)}),k(t,l=>{l||setTimeout(()=>{g.value=void 0})},{flush:"post"});const p=D();he(()=>{p.value&&te(()=>{a.value=Se(p.value)})});const w=D(),V=P(()=>e.target==="cursor"&&g.value?g.value:w.value?Se(w.value):qe(e.target,o)||a.value),F=P(()=>Array.isArray(V.value)?void 0:V.value);let R;return k(()=>!!e.activator,l=>{l&&z?(R=_e(),R.run(()=>{Yt(e,o,{activatorEl:a,activatorEvents:v})})):R&&R.stop()},{flush:"post",immediate:!0}),H(()=>{R==null||R.stop()}),{activatorEl:a,activatorRef:p,target:V,targetEl:F,targetRef:w,activatorEvents:v,contentEvents:C,scrimEvents:A}}function Yt(e,n,t){let{activatorEl:r,activatorEvents:o}=t;k(()=>e.activator,(c,u)=>{if(u&&c!==u){const f=s(u);f&&i(f)}c&&te(()=>a())},{immediate:!0}),k(()=>e.activatorProps,()=>{a()}),H(()=>{i()});function a(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:s(),u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e.activatorProps;c&&pt(c,I(o.value,u))}function i(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:s(),u=arguments.length>1&&arguments[1]!==void 0?arguments[1]:e.activatorProps;c&&Et(c,I(o.value,u))}function s(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:e.activator;const u=qe(c,n);return r.value=(u==null?void 0:u.nodeType)===Node.ELEMENT_NODE?u:void 0,r.value}}function qe(e,n){var r,o;if(!e)return;let t;if(e==="parent"){let a=(o=(r=n==null?void 0:n.proxy)==null?void 0:r.$el)==null?void 0:o.parentNode;for(;a!=null&&a.hasAttribute("data-no-activator");)a=a.parentNode;t=a}else typeof e=="string"?t=document.querySelector(e):"$el"in e?t=e.$el:t=e;return t}function Xt(){if(!z)return Y(!1);const{ssr:e}=Ze();if(e){const n=Y(!1);return Ke(()=>{n.value=!0}),n}else return Y(!0)}const Ut=j({eager:Boolean},"lazy");function Gt(e,n){const t=Y(!1),r=P(()=>t.value||e.eager||n.value);k(n,()=>t.value=!0);function o(){e.eager||(t.value=!1)}return{isBooted:t,hasContent:r,onAfterLeave:o}}function Zt(){const n=ge("useScopeId").vnode.scopeId;return{scopeId:n?{[n]:""}:void 0}}const ke=Symbol.for("vuetify:stack"),G=Ne([]);function Kt(e,n,t){const r=ge("useStack"),o=!t,a=We(ke,void 0),i=Ne({activeChildren:new Set});Je(ke,i);const s=Y(+n.value);me(e,()=>{var d;const f=(d=G.at(-1))==null?void 0:d[1];s.value=f?f+10:+n.value,o&&G.push([r.uid,s.value]),a==null||a.activeChildren.add(r.uid),H(()=>{if(o){const y=et(G).findIndex(g=>g[0]===r.uid);G.splice(y,1)}a==null||a.activeChildren.delete(r.uid)})});const c=Y(!0);o&&he(()=>{var d;const f=((d=G.at(-1))==null?void 0:d[0])===r.uid;setTimeout(()=>c.value=f)});const u=P(()=>!i.activeChildren.size);return{globalTop:Qe(c),localTop:u,stackStyles:P(()=>({zIndex:s.value}))}}function Jt(e){return{teleportTarget:P(()=>{const t=e.value;if(t===!0||!z)return;const r=t===!1?document.body:typeof t=="string"?document.querySelector(t):t;if(r==null)return;let o=r.querySelector(":scope > .v-overlay-container");return o||(o=document.createElement("div"),o.className="v-overlay-container",r.appendChild(o)),o})}}function Qt(){return!0}function ze(e,n,t){if(!e||je(e,t)===!1)return!1;const r=Ve(n);if(typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&r.host===e.target)return!1;const o=(typeof t.value=="object"&&t.value.include||(()=>[]))();return o.push(n),!o.some(a=>a==null?void 0:a.contains(e.target))}function je(e,n){return(typeof n.value=="object"&&n.value.closeConditional||Qt)(e)}function en(e,n,t){const r=typeof t.value=="function"?t.value:t.value.handler;n._clickOutside.lastMousedownWasOutside&&ze(e,n,t)&&setTimeout(()=>{je(e,t)&&r&&r(e)},0)}function Be(e,n){const t=Ve(e);n(document),typeof ShadowRoot<"u"&&t instanceof ShadowRoot&&n(t)}const tn={mounted(e,n){const t=o=>en(o,e,n),r=o=>{e._clickOutside.lastMousedownWasOutside=ze(o,e,n)};Be(e,o=>{o.addEventListener("click",t,!0),o.addEventListener("mousedown",r,!0)}),e._clickOutside||(e._clickOutside={lastMousedownWasOutside:!1}),e._clickOutside[n.instance.$.uid]={onClick:t,onMousedown:r}},unmounted(e,n){e._clickOutside&&(Be(e,t=>{var a;if(!t||!((a=e._clickOutside)!=null&&a[n.instance.$.uid]))return;const{onClick:r,onMousedown:o}=e._clickOutside[n.instance.$.uid];t.removeEventListener("click",r,!0),t.removeEventListener("mousedown",o,!0)}),delete e._clickOutside[n.instance.$.uid])}};function nn(e){const{modelValue:n,color:t,...r}=e;return M(ue,{name:"fade-transition",appear:!0},{default:()=>[e.modelValue&&M("div",I({class:["v-overlay__scrim",e.color.backgroundColorClasses.value],style:e.color.backgroundColorStyles.value},r),null)]})}const on=j({absolute:Boolean,attach:[Boolean,String,Object],closeOnBack:{type:Boolean,default:!0},contained:Boolean,contentClass:null,contentProps:null,disabled:Boolean,noClickAnimation:Boolean,modelValue:Boolean,persistent:Boolean,scrim:{type:[Boolean,String],default:!0},zIndex:{type:[Number,String],default:2e3},...zt(),...tt(),...nt(),...Ut(),...kt(),...Wt(),...ot(),...wt()},"VOverlay"),cn=Me()({name:"VOverlay",directives:{ClickOutside:tn},inheritAttrs:!1,props:{_disableGlobalStack:Boolean,...on()},emits:{"click:outside":e=>!0,"update:modelValue":e=>!0,afterLeave:()=>!0},setup(e,n){let{slots:t,attrs:r,emit:o}=n;const a=rt(e,"modelValue"),i=P({get:()=>a.value,set:E=>{E&&e.disabled||(a.value=E)}}),{teleportTarget:s}=Jt(P(()=>e.attach||e.contained)),{themeClasses:c}=at(e),{rtlClasses:u,isRtl:f}=it(),{hasContent:d,onAfterLeave:y}=Gt(e,i),g=st(P(()=>typeof e.scrim=="string"?e.scrim:null)),{globalTop:m,localTop:v,stackStyles:C}=Kt(i,lt(e,"zIndex"),e._disableGlobalStack),{activatorEl:A,activatorRef:p,target:w,targetEl:V,targetRef:F,activatorEvents:R,contentEvents:l,scrimEvents:T}=jt(e,{isActive:i,isTop:v}),{dimensionStyles:ne}=ct(e),oe=Xt(),{scopeId:S}=Zt();k(()=>e.disabled,E=>{E&&(i.value=!1)});const x=D(),h=D(),{contentStyles:b,updateLocation:B}=Bt(e,{isRtl:f,contentEl:h,target:w,isActive:i});Nt(e,{root:x,contentEl:h,targetEl:V,isActive:i,updateLocation:B});function L(E){o("click:outside",E),e.persistent?W():i.value=!1}function X(){return i.value&&m.value}z&&k(i,E=>{E?window.addEventListener("keydown",O):window.removeEventListener("keydown",O)},{immediate:!0}),ut(()=>{z&&window.removeEventListener("keydown",O)});function O(E){var N,be;E.key==="Escape"&&m.value&&(e.persistent?W():(i.value=!1,(N=h.value)!=null&&N.contains(document.activeElement)&&((be=A.value)==null||be.focus())))}const $=ft();me(()=>e.closeOnBack,()=>{bt($,E=>{m.value&&i.value?(E(!1),e.persistent?W():i.value=!1):E()})});const U=D();k(()=>i.value&&(e.absolute||e.contained)&&s.value==null,E=>{if(E){const N=Pt(x.value);N&&N!==document.scrollingElement&&(U.value=N.scrollTop)}});function W(){e.noClickAnimation||h.value&&Z(h.value,[{transformOrigin:"center"},{transform:"scale(1.03)"},{transformOrigin:"center"}],{duration:150,easing:fe})}function Ye(){y(),o("afterLeave")}return dt(()=>{var E;return M(yt,null,[(E=t.activator)==null?void 0:E.call(t,{isActive:i.value,props:I({ref:p,targetRef:F},R.value,e.activatorProps)}),!e.disabled&&oe.value&&d.value&&M(vt,{disabled:!s.value,to:s.value},{default:()=>[M("div",I({class:["v-overlay",{"v-overlay--absolute":e.absolute||e.contained,"v-overlay--active":i.value,"v-overlay--contained":e.contained},c.value,u.value,e.class],style:[C.value,{top:_(U.value)},e.style],ref:x},S,r),[M(nn,I({color:g,modelValue:!!e.scrim&&i.value},T.value),null),M(xt,{appear:!0,persisted:!0,transition:e.transition,target:w.value,onAfterLeave:Ye},{default:()=>{var N;return[mt(M("div",I({ref:h,class:["v-overlay__content",e.contentClass],style:[ne.value,b.value]},l.value,e.contentProps),[(N=t.default)==null?void 0:N.call(t,{isActive:i})]),[[ht,i.value],[gt("click-outside"),{handler:L,closeConditional:X,include:()=>[A.value]}]])]}})])]})])}),{activatorEl:A,target:w,animateClick:W,contentEl:h,globalTop:m,localTop:v,updateLocation:B}}});export{cn as V,sn as a,Z as b,on as c,Zt as d,$t as e,ln as f,Pt as g,Ut as m,He as n,fe as s,Gt as u};