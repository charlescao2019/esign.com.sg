import{ad as N,ai as O,ae as W,bj as ke,af as X,bk as ce,ag as j,az as ge,b0 as Se,bf as re,aU as R,a4 as g,a$ as ee,b3 as Ce,w as xe,ah as ve,b as n,$ as _,bl as Ie,b1 as Pe,aP as ze,al as de,aF as fe,aH as me,aS as Ve,_ as M,q as pe,bm as ae,bn as Ae,aB as we,aD as Re,bg as _e,ak as Te,bo as Oe,bp as Be,aT as Ee,ao as Fe,bq as Ge,aI as Me,aJ as De,aL as Le,an as He,br as $e,aG as qe,bh as Ke,bs as Ne,I as le,aW as We,aN as Xe,aO as D,J as je,F as te}from"./main-DUjuXfcn.js";import{g as ne,h as Ue}from"./VList-ByXi2jsW.js";import{a as se}from"./VDivider-B1C29VjY.js";function ie(e){const i=Math.abs(e);return Math.sign(e)*(i/((1/.501-2)*(1-i)+1))}function ue(e){let{selectedElement:p,containerSize:i,contentSize:c,isRtl:o,currentScrollOffset:m,isHorizontal:u}=e;const r=u?p.clientWidth:p.clientHeight,l=u?p.offsetLeft:p.offsetTop,v=o&&u?c-l-r:l,d=i+m,f=r+v,x=r*.4;return v<=m?m=Math.max(v-x,0):d<=f&&(m=Math.min(m-(d-f-x),c-i)),m}function Ye(e){let{selectedElement:p,containerSize:i,contentSize:c,isRtl:o,isHorizontal:m}=e;const u=m?p.clientWidth:p.clientHeight,r=m?p.offsetLeft:p.offsetTop,l=o&&m?c-r-u/2-i/2:r+u/2-i/2;return Math.min(c-i,Math.max(0,l))}const Je=Symbol.for("vuetify:v-slide-group"),he=N({centerActive:Boolean,direction:{type:String,default:"horizontal"},symbol:{type:null,default:Je},nextIcon:{type:O,default:"$next"},prevIcon:{type:O,default:"$prev"},showArrows:{type:[Boolean,String],validator:e=>typeof e=="boolean"||["always","desktop","mobile"].includes(e)},...W(),...ke(),...X(),...ce({selectedClass:"v-slide-group-item--active"})},"VSlideGroup"),oe=j()({name:"VSlideGroup",props:he(),emits:{"update:modelValue":e=>!0},setup(e,p){let{slots:i}=p;const{isRtl:c}=ge(),{displayClasses:o,mobile:m}=Se(e),u=re(e,e.symbol),r=R(!1),l=R(0),v=R(0),d=R(0),f=g(()=>e.direction==="horizontal"),{resizeRef:x,contentRect:T}=ee(),{resizeRef:h,contentRect:P}=ee(),t=g(()=>u.selected.value.length?u.items.value.findIndex(a=>a.id===u.selected.value[0]):-1),S=g(()=>u.selected.value.length?u.items.value.findIndex(a=>a.id===u.selected.value[u.selected.value.length-1]):-1);if(Ce){let a=-1;xe(()=>[u.selected.value,T.value,P.value,f.value],()=>{cancelAnimationFrame(a),a=requestAnimationFrame(()=>{if(T.value&&P.value){const s=f.value?"width":"height";v.value=T.value[s],d.value=P.value[s],r.value=v.value+1<d.value}if(t.value>=0&&h.value){const s=h.value.children[S.value];t.value===0||!r.value?l.value=0:e.centerActive?l.value=Ye({selectedElement:s,containerSize:v.value,contentSize:d.value,isRtl:c.value,isHorizontal:f.value}):r.value&&(l.value=ue({selectedElement:s,containerSize:v.value,contentSize:d.value,isRtl:c.value,currentScrollOffset:l.value,isHorizontal:f.value}))}})})}const z=R(!1);let C=0,B=0;function E(a){const s=f.value?"clientX":"clientY";B=(c.value&&f.value?-1:1)*l.value,C=a.touches[0][s],z.value=!0}function L(a){if(!r.value)return;const s=f.value?"clientX":"clientY",k=c.value&&f.value?-1:1;l.value=k*(B+C-a.touches[0][s])}function y(a){const s=d.value-v.value;l.value<0||!r.value?l.value=0:l.value>=s&&(l.value=s),z.value=!1}function I(){x.value&&(x.value[f.value?"scrollLeft":"scrollTop"]=0)}const V=R(!1);function H(a){if(V.value=!0,!(!r.value||!h.value)){for(const s of a.composedPath())for(const k of h.value.children)if(k===s){l.value=ue({selectedElement:k,containerSize:v.value,contentSize:d.value,isRtl:c.value,currentScrollOffset:l.value,isHorizontal:f.value});return}}}function F(a){V.value=!1}function G(a){var s;!V.value&&!(a.relatedTarget&&((s=h.value)!=null&&s.contains(a.relatedTarget)))&&b()}function $(a){h.value&&(f.value?a.key==="ArrowRight"?b(c.value?"prev":"next"):a.key==="ArrowLeft"&&b(c.value?"next":"prev"):a.key==="ArrowDown"?b("next"):a.key==="ArrowUp"&&b("prev"),a.key==="Home"?b("first"):a.key==="End"&&b("last"))}function b(a){var s,k,J,Q,Z;if(h.value)if(!a)(s=Ie(h.value)[0])==null||s.focus();else if(a==="next"){const w=(k=h.value.querySelector(":focus"))==null?void 0:k.nextElementSibling;w?w.focus():b("first")}else if(a==="prev"){const w=(J=h.value.querySelector(":focus"))==null?void 0:J.previousElementSibling;w?w.focus():b("last")}else a==="first"?(Q=h.value.firstElementChild)==null||Q.focus():a==="last"&&((Z=h.value.lastElementChild)==null||Z.focus())}function A(a){const s=l.value+(a==="prev"?-1:1)*v.value;l.value=Pe(s,0,d.value-v.value)}const be=g(()=>{let a=l.value>d.value-v.value?-(d.value-v.value)+ie(d.value-v.value-l.value):-l.value;l.value<=0&&(a=ie(-l.value));const s=c.value&&f.value?-1:1;return{transform:`translate${f.value?"X":"Y"}(${s*a}px)`,transition:z.value?"none":"",willChange:z.value?"transform":""}}),q=g(()=>({next:u.next,prev:u.prev,select:u.select,isSelected:u.isSelected})),K=g(()=>{switch(e.showArrows){case"always":return!0;case"desktop":return!m.value;case!0:return r.value||Math.abs(l.value)>0;case"mobile":return m.value||r.value||Math.abs(l.value)>0;default:return!m.value&&(r.value||Math.abs(l.value)>0)}}),U=g(()=>Math.abs(l.value)>0),Y=g(()=>d.value>Math.abs(l.value)+v.value);return ve(()=>n(e.tag,{class:["v-slide-group",{"v-slide-group--vertical":!f.value,"v-slide-group--has-affixes":K.value,"v-slide-group--is-overflowing":r.value},o.value,e.class],style:e.style,tabindex:V.value||u.selected.value.length?-1:0,onFocus:G},{default:()=>{var a,s,k;return[K.value&&n("div",{key:"prev",class:["v-slide-group__prev",{"v-slide-group__prev--disabled":!U.value}],onClick:()=>U.value&&A("prev")},[((a=i.prev)==null?void 0:a.call(i,q.value))??n(ne,null,{default:()=>[n(_,{icon:c.value?e.nextIcon:e.prevIcon},null)]})]),n("div",{key:"container",ref:x,class:"v-slide-group__container",onScroll:I},[n("div",{ref:h,class:"v-slide-group__content",style:be.value,onTouchstartPassive:E,onTouchmovePassive:L,onTouchendPassive:y,onFocusin:H,onFocusout:F,onKeydown:$},[(s=i.default)==null?void 0:s.call(i,q.value)])]),K.value&&n("div",{key:"next",class:["v-slide-group__next",{"v-slide-group__next--disabled":!Y.value}],onClick:()=>Y.value&&A("next")},[((k=i.next)==null?void 0:k.call(i,q.value))??n(ne,null,{default:()=>[n(_,{icon:c.value?e.prevIcon:e.nextIcon},null)]})])]}})),{selected:u.selected,scrollTo:A,scrollOffset:l,focus:b}}}),ye=Symbol.for("vuetify:v-chip-group"),Qe=N({column:Boolean,filter:Boolean,valueComparator:{type:Function,default:ze},...he(),...W(),...ce({selectedClass:"v-chip--selected"}),...X(),...de(),...fe({variant:"tonal"})},"VChipGroup");j()({name:"VChipGroup",props:Qe(),emits:{"update:modelValue":e=>!0},setup(e,p){let{slots:i}=p;const{themeClasses:c}=me(e),{isSelected:o,select:m,next:u,prev:r,selected:l}=re(e,ye);return Ve({VChip:{color:M(e,"color"),disabled:M(e,"disabled"),filter:M(e,"filter"),variant:M(e,"variant")}}),ve(()=>{const v=oe.filterProps(e);return n(oe,pe(v,{class:["v-chip-group",{"v-chip-group--column":e.column},c.value,e.class],style:e.style}),{default:()=>{var d;return[(d=i.default)==null?void 0:d.call(i,{isSelected:o,select:m,next:u,prev:r,selected:l.value})]}})}),{}}});const Ze=N({activeClass:String,appendAvatar:String,appendIcon:O,closable:Boolean,closeIcon:{type:O,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:{type:Boolean,default:void 0},pill:Boolean,prependAvatar:String,prependIcon:O,ripple:{type:[Boolean,Object],default:!0},text:String,modelValue:{type:Boolean,default:!0},onClick:ae(),onClickOnce:ae(),...Ae(),...W(),...we(),...Re(),..._e(),...Te(),...Oe(),...Be(),...X({tag:"span"}),...de(),...fe({variant:"tonal"})},"VChip"),ta=j()({name:"VChip",directives:{Ripple:Ee},props:Ze(),emits:{"click:close":e=>!0,"update:modelValue":e=>!0,"group:selected":e=>!0,click:e=>!0},setup(e,p){let{attrs:i,emit:c,slots:o}=p;const{t:m}=Fe(),{borderClasses:u}=Ge(e),{colorClasses:r,colorStyles:l,variantClasses:v}=Me(e),{densityClasses:d}=De(e),{elevationClasses:f}=Le(e),{roundedClasses:x}=He(e),{sizeClasses:T}=$e(e),{themeClasses:h}=me(e),P=qe(e,"modelValue"),t=Ke(e,ye,!1),S=Ne(e,i),z=g(()=>e.link!==!1&&S.isLink.value),C=g(()=>!e.disabled&&e.link!==!1&&(!!t||e.link||S.isClickable.value)),B=g(()=>({"aria-label":m(e.closeLabel),onClick(y){y.stopPropagation(),P.value=!1,c("click:close",y)}}));function E(y){var I;c("click",y),C.value&&((I=S.navigate)==null||I.call(S,y),t==null||t.toggle())}function L(y){(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),E(y))}return()=>{const y=S.isLink.value?"a":e.tag,I=!!(e.appendIcon||e.appendAvatar),V=!!(I||o.append),H=!!(o.close||e.closable),F=!!(o.filter||e.filter)&&t,G=!!(e.prependIcon||e.prependAvatar),$=!!(G||o.prepend),b=!t||t.isSelected.value;return P.value&&le(n(y,{class:["v-chip",{"v-chip--disabled":e.disabled,"v-chip--label":e.label,"v-chip--link":C.value,"v-chip--filter":F,"v-chip--pill":e.pill},h.value,u.value,b?r.value:void 0,d.value,f.value,x.value,T.value,v.value,t==null?void 0:t.selectedClass.value,e.class],style:[b?l.value:void 0,e.style],disabled:e.disabled||void 0,draggable:e.draggable,href:S.href.value,tabindex:C.value?0:void 0,onClick:E,onKeydown:C.value&&!z.value&&L},{default:()=>{var A;return[Xe(C.value,"v-chip"),F&&n(Ue,{key:"filter"},{default:()=>[le(n("div",{class:"v-chip__filter"},[o.filter?n(D,{key:"filter-defaults",disabled:!e.filterIcon,defaults:{VIcon:{icon:e.filterIcon}}},o.filter):n(_,{key:"filter-icon",icon:e.filterIcon},null)]),[[je,t.isSelected.value]])]}),$&&n("div",{key:"prepend",class:"v-chip__prepend"},[o.prepend?n(D,{key:"prepend-defaults",disabled:!G,defaults:{VAvatar:{image:e.prependAvatar,start:!0},VIcon:{icon:e.prependIcon,start:!0}}},o.prepend):n(te,null,[e.prependIcon&&n(_,{key:"prepend-icon",icon:e.prependIcon,start:!0},null),e.prependAvatar&&n(se,{key:"prepend-avatar",image:e.prependAvatar,start:!0},null)])]),n("div",{class:"v-chip__content"},[((A=o.default)==null?void 0:A.call(o,{isSelected:t==null?void 0:t.isSelected.value,selectedClass:t==null?void 0:t.selectedClass.value,select:t==null?void 0:t.select,toggle:t==null?void 0:t.toggle,value:t==null?void 0:t.value.value,disabled:e.disabled}))??e.text]),V&&n("div",{key:"append",class:"v-chip__append"},[o.append?n(D,{key:"append-defaults",disabled:!I,defaults:{VAvatar:{end:!0,image:e.appendAvatar},VIcon:{end:!0,icon:e.appendIcon}}},o.append):n(te,null,[e.appendIcon&&n(_,{key:"append-icon",end:!0,icon:e.appendIcon},null),e.appendAvatar&&n(se,{key:"append-avatar",end:!0,image:e.appendAvatar},null)])]),H&&n("button",pe({key:"close",class:"v-chip__close",type:"button"},B.value),[o.close?n(D,{key:"close-defaults",defaults:{VIcon:{icon:e.closeIcon,size:"x-small"}}},o.close):n(_,{key:"close-icon",icon:e.closeIcon,size:"x-small"},null)])]}}),[[We("ripple"),C.value&&e.ripple,null]])}}});export{ta as V,oe as a,he as m};
