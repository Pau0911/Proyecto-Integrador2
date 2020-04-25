if (self.CavalryLogger) { CavalryLogger.start_js(["sUjoR"]); }

__d("FocusGroup.react",["FocusManager.react","React","ReactEventsKeyboard","react","setElementCanTab"],(function(a,b,c,d,e,f){var g,h=b("FocusManager.react").focusElement;c=b("React");var i=c.useContext,j=c.useRef,k=b("ReactEventsKeyboard").useKeyboard,l=g||(g=b("react"));function m(a,c,d,e){c=c.DO_NOT_USE_queryFirstNode(a);c!==null&&(b("setElementCanTab")(c,!0),h(c,e),d.preventDefault())}var n=5;function o(a,b){for(var c=0;c<a.length;c++){var d=a[c];if(d&&d.scopeRef.current===b)return c}return-1}function p(a,b,c){var d=a.scopeRef.current;if(d===null)return null;if(c!==null){d=o(c,b);b=a.wrap;a=s(c,d-1);return!a&&b===!0?s(c,c.length-1):a}return null}function q(a,b,c){var d=a.scopeRef.current;if(d===null)return null;if(c.length>0){d=o(c,b);b=a.wrap;a=r(c,d+1);return!a&&b===!0?r(c,0):a}return null}function r(a,b){var c=a.length;if(b>c)return null;b=b;while(b<c){var d=a[b];if(d!==null&&d.disabled!==!0)return d.scopeRef.current;b++}return null}function s(a,b){b=b;while(b>=0){var c=a[b];if(c!==null&&c.disabled!==!0)return c.scopeRef.current;b--}return null}function t(a){var b=a.altKey,c=a.ctrlKey,d=a.metaKey;a=a.shiftKey;return b===!0||c===!0||d===!0||a===!0}function a(a){var c=l.unstable_createScope(),d=l.createContext(null),e=l.createContext(null);function f(a){var b=a.children,e=a.portrait,f=a.wrap,g=a.tabScopeQuery,h=a.allowModifiers,i=a.preventScrollOnFocus;i=i===void 0?!1:i;a=a.pageJumpSize;a=a===void 0?n:a;var k=j(null);e={scopeRef:k,portrait:e,wrap:f,tabScopeQuery:g,allowModifiers:h,pageJumpSize:a,preventScrollOnFocus:i};return l.jsx(d.Provider,{value:e,children:l.jsx(c,{ref:k,children:b})})}function g(f){var g=f.children,h=f.disabled,n=f.onKeyDown,u=j(null),v=i(d);f=k({onKeyDown:function(c){var d=u.current;if(d!==null&&v!==null){var f=v.portrait,g=v.scopeRef.current,h=c.key,i=v.preventScrollOnFocus;if(h==="Tab"&&g!==null){var j=v.tabScopeQuery;if(j){var k=document.activeElement;j=g.DO_NOT_USE_queryAllNodes(j);if(j!==null)for(var l=0;l<j.length;l++){var w=j[l];w!==k?b("setElementCanTab")(w,!1):b("setElementCanTab")(w,!0)}}c.continuePropagation();return}if(t(c)){w=v.allowModifiers;if(w!==!0){c.continuePropagation();return}}if(g===null){c.continuePropagation();return}switch(h){case"Home":k=g.getChildContextValues(e);l=r(k,0);if(l){m(a,l,c,i);return}break;case"End":j=g.getChildContextValues(e);w=s(j,j.length-1);if(w){m(a,w,c,i);return}break;case"PageUp":h=g.getChildContextValues(e);k=v.pageJumpSize;l=o(h,d);j=r(h,Math.max(0,l-k));if(j){m(a,j,c,i);return}break;case"PageDown":w=g.getChildContextValues(e);h=v.pageJumpSize;l=o(w,d);k=s(w,Math.min(w.length-1,l+h));if(k){m(a,k,c,i);return}break;case"ArrowUp":if(f){j=g.getChildContextValues(e);w=c.metaKey||c.ctrlKey?r(j,0):p(v,d,j);if(w){m(a,w,c,i);return}}break;case"ArrowDown":if(f){l=g.getChildContextValues(e);h=c.metaKey||c.ctrlKey?s(l,l.length-1):q(v,d,l);if(h){m(a,h,c,i);return}}break;case"ArrowLeft":if(!f){k=g.getChildContextValues(e);j=c.metaKey||c.ctrlKey?r(k,0):p(v,d,k);if(j){m(a,j,c,i);return}}break;case"ArrowRight":if(!f){w=g.getChildContextValues(e);l=c.metaKey||c.ctrlKey?s(w,w.length-1):q(v,d,w);if(l){m(a,l,c,i);return}}break}}n&&n(c);c.continuePropagation()}});h={scopeRef:u,disabled:h};return l.jsx(e.Provider,{value:h,children:l.jsx(c,{DEPRECATED_flareListeners:f,ref:u,children:g})})}return[f,g]}e.exports={createFocusGroup:a}}),null);
__d("CometMenuFocusGroup",["fbt","CometComponentWithKeyCommands.react","CometKeys","FocusGroup.react","React","TabbableScopeQuery.react"],(function(a,b,c,d,e,f,g){"use strict";c=b("FocusGroup.react").createFocusGroup;var h=b("React");d=c(b("TabbableScopeQuery.react"));var i=d[0];f=d[1];function a(a){var c=[{command:{key:b("CometKeys").UP},description:g._("Elemento anterior"),handler:function(){}},{command:{key:b("CometKeys").DOWN},description:g._("Elemento siguiente"),handler:function(){}}];return h.jsx(b("CometComponentWithKeyCommands.react"),{commandConfigs:c,children:h.jsx(i,babelHelpers["extends"]({},a))})}e.exports={FocusGroup:a,FocusItem:f}}),null);
__d("CometMenuItemBaseRoleContext",["React"],(function(a,b,c,d,e,f){"use strict";a=b("React");c=a.createContext(null);e.exports=c}),null);
__d("CometMenuItemHighlightContext",["React"],(function(a,b,c,d,e,f){"use strict";a=b("React");e.exports=a.createContext(!1)}),null);
__d("CometMenuItemBase.react",["BaseFocusRing.react","CometMenuContext","CometMenuFocusGroup","CometMenuItemBaseRoleContext","CometMenuItemHighlightContext","CometPressable.react","CometPressableOverlay.react","React","TetraTextPairing.react","mergeRefs","stylex"],(function(a,b,c,d,e,f){"use strict";var g,h=b("React");c=b("React");var i=c.useCallback,j=c.useContext,k=c.useEffect,l=c.useMemo,m=c.useRef,n={aux:{marginStart:"ozuftl9m"},content:{alignItems:"bp9cbjyn",display:"j83agx80",flexDirection:"btwxx1t3",flexGrow:"buofh1pr",justifyContent:"i1fnvgqd",minWidth:"hpfvmrgz"},disabled:{cursor:"rj84mg9z"},listItem:{alignItems:"bp9cbjyn",appearance:"dwo3fsh8",boxSizing:"rq0escxv",cursor:"nhd2j8a9",display:"j83agx80",flexDirection:"btwxx1t3",flexShrink:"pfnyh3mw",marginTop:"kvgmc6g5",marginEnd:"oi9244e8",marginBottom:"oygrvhab",marginStart:"h676nmdw",paddingTop:"pybr56ya",paddingEnd:"dflh9lhu",paddingBottom:"f10w8fjw",paddingStart:"scb9dxdr",position:"l9j0dhe7",textAlign:"i1ao9s8h",zIndex:"du4w35lb"},listItemAlignedCenter:{alignItems:"bp9cbjyn"},listItemWithIcon:{paddingTop:"cxgpxx05",paddingEnd:"dflh9lhu",paddingBottom:"sj5x9vvc",paddingStart:"scb9dxdr"}};function a(a,c){var d=a.alignCenter;d=d===void 0?!1:d;var e=a.aux,f=a.bodyColor,o=a.bodyText,p=a.disabled,q=p===void 0?!1:p;p=a.download;var r=a.href,s=a.iconNode,t=a.id,u=a.onClick,v=a.onHoverIn,w=a.onHoverOut,x=a.onPressIn,y=a.passthroughProps,z=a.preventClosingMenuOnSelect;z=z===void 0?!1:z;var A=a.preventLocalNavigation,B=a.primaryColor,C=a.primaryText,D=a.role,E=a.routeTarget,F=a.secondaryColor,G=a.secondaryText,H=a.target,I=a.testid;I=a.visuallyFocused;var J=I===void 0?!1:I;I=babelHelpers.objectWithoutPropertiesLoose(a,["alignCenter","aux","bodyColor","bodyText","disabled","download","href","iconNode","id","onClick","onHoverIn","onHoverOut","onPressIn","passthroughProps","preventClosingMenuOnSelect","preventLocalNavigation","primaryColor","primaryText","role","routeTarget","secondaryColor","secondaryText","target","testid","visuallyFocused"]);var K=m(null);a=j(b("CometMenuContext"));var L=z!==!0&&a?a.onClose:null;z=r!=null||E!=null||H!=null?{download:p,passthroughProps:y,preventLocalNavigation:A,routeTarget:E,target:H,url:r}:void 0;a=i(function(a){L!=null&&L(),u&&u(a)},[u,L]);p=j(b("CometMenuItemBaseRoleContext"));E=(A=(y=D)!=null?y:p)!=null?A:void 0;var M=m(J);k(function(){var a=K.current;!M.current&&J&&a!=null&&a.scrollIntoView({block:"nearest"})},[J]);H=l(function(){return b("mergeRefs")(c,K)},[c]);return h.jsx(b("CometMenuFocusGroup").FocusItem,{children:h.jsx(b("CometPressable.react"),babelHelpers["extends"]({},I,{disabled:q,display:"inline",id:t,linkProps:z,onHoverIn:v,onHoverOut:w,onPress:a,onPressIn:x,overlayDisabled:!0,ref:H,role:E,testid:void 0,xstyle:[n.listItem,d&&n.listItemAlignedCenter,s!=null&&n.listItemWithIcon,q&&n.disabled,J&&b("BaseFocusRing.react").focusRingXStyle],children:function(a){var c=a.focused,d=a.focusVisible,i=a.hovered;a=a.pressed;return h.jsxs(b("CometMenuItemHighlightContext").Provider,{value:c&&d||i,children:[s,h.jsxs("div",{className:(g||(g=b("stylex")))(n.content),children:[h.jsx(b("TetraTextPairing.react"),{body:o,bodyColor:f,headline:C,headlineColor:q?"disabled":B,level:4,meta:G,metaColor:F,reduceEmphasis:!0}),e!=null&&h.jsx("div",{className:(g||(g=b("stylex")))(n.aux),children:e})]}),h.jsx(b("CometPressableOverlay.react"),{focusVisible:d||J,hovered:i,pressed:a,radius:4})]})}}))})}e.exports=h.forwardRef(a)}),null);
__d("CometMenuItemIcon.react",["CometImageIcon.react","IconSource","ImageIconSource","React","TetraIcon.react","stylex"],(function(a,b,c,d,e,f){"use strict";var g,h=b("React");function a(a){var c=a.icon,d=a.iconColor;a=a.use;a=a===void 0?"normal":a;return h.jsx("div",{className:(g||(g=b("stylex"))).dedupe(a==="contained"||a==="contained_small_icon"?{"align-items-1":"bp9cbjyn","background-color-1":"tdjehn4e","border-top-start-radius-1":"s45kfl79","border-top-end-radius-1":"emlxlaya","border-bottom-end-radius-1":"bkmhp75w","border-bottom-start-radius-1":"spb7xbtv","display-1":"j83agx80","height-1":"tv7at329","justify-content-1":"taijpn5t","min-width-1":"odlk74j0"}:{},a==="normal"?{"align-self-1":"tiyi1ipj","height-1":"jnigpg78","width-1":"odw8uiq3"}:null,{"margin-end-1":"tvfksri0"}),children:c instanceof b("IconSource")?h.jsx(b("TetraIcon.react"),{color:(d=d)!=null?d:"secondary",icon:c}):c instanceof b("ImageIconSource")?h.jsx(b("TetraIcon.react"),{icon:c}):h.jsx(b("CometImageIcon.react"),babelHelpers["extends"]({},c,{size:a==="contained"?36:20}))})}e.exports=h.memo(a)}),null);
__d("CometMenuItem.react",["CometBadge.react","CometMenuItemBase.react","CometMenuItemIcon.react","React","TetraTextPairing.react"],(function(a,b,c,d,e,f){"use strict";var g=b("React");function a(a,c){var d=a.auxItem,e=a.icon,f=a.iconStyle;f=f===void 0?"normal":f;a=babelHelpers.objectWithoutPropertiesLoose(a,["auxItem","icon","iconStyle"]);var h=null;d!=null&&(h=d.type==="text"?g.jsx(b("TetraTextPairing.react"),{level:3,meta:d.auxText}):g.jsx(b("CometBadge.react"),{color:d.color}));return g.jsx(b("CometMenuItemBase.react"),babelHelpers["extends"]({},a,{alignCenter:!0,aux:h,iconNode:e!=null?g.jsx(b("CometMenuItemIcon.react"),{icon:e,use:f}):null,ref:c}))}e.exports=g.forwardRef(a)}),null);
__d("CometSeparatorMenuItem.react",["CometMenuItemBaseRoleContext","React","stylex"],(function(a,b,c,d,e,f){"use strict";var g=b("React");c=b("React");var h=c.useContext;function a(a,c){a=h(b("CometMenuItemBaseRoleContext"));return g.jsx("div",{className:"dhix69tm tvmbv18p wkznzc2l aahdfvyu l6v480f0",ref:c,role:a==="menuitem"?"separator":"presentation"})}e.exports=g.forwardRef(a)}),null);
__d("CometMenuBase.react",["BaseScrollableArea.react","CometErrorBoundary.react","CometMenuFocusGroup","CometMenuItemBaseRoleContext","CometPopover.react","CometSeparatorMenuItem.react","React","TabbableScopeQuery.react","TetraTextPairing.react","stylex"],(function(a,b,c,d,e,f){"use strict";var g,h=b("React"),i={listItem:{borderTopStartRadius:"jk6sbkaj",borderTopEndRadius:"kdgqqoy6",borderBottomEndRadius:"ihh4hy1g",borderBottomStartRadius:"qttc61fc",display:"j83agx80",flexDirection:"btwxx1t3",marginTop:"kvgmc6g5",marginEnd:"oi9244e8",marginBottom:"oygrvhab",marginStart:"h676nmdw",paddingTop:"pybr56ya",paddingEnd:"dflh9lhu",paddingBottom:"f10w8fjw",paddingStart:"scb9dxdr"},root:{alignItems:"gs1a9yip",display:"j83agx80",flexDirection:"cbu4d94t",paddingTop:"cxgpxx05",paddingEnd:"rz4wbd8a",paddingBottom:"sj5x9vvc",paddingStart:"a8nywdso"},sizeFull:{width:"k4urcfbm"},sizeNormal:{width:"geg40m2u"},truncate:{maxHeight:"ktk59qbb"}},j="menu",k={listbox:"option",menu:"menuitem"};function a(a,c){var d=a.children,e=a.footer,f=a.header,l=a.id,m=a.role;m=m===void 0?j:m;var n=a.size;n=n===void 0?"normal":n;var o=a.truncate;o=o===void 0?!1:o;var p=a.withArrow;a=a.testid;a=a===void 0?"comet-menu":a;var q=0;a=h.Children.toArray(d).map(function(a){if(a==null)return null;var c=q++;return a.type===b("CometSeparatorMenuItem.react")?a:h.jsx(b("CometErrorBoundary.react"),{fallback:null,children:a},c)});var r=k[m];return h.Children.count(d)>0?h.jsx(b("CometMenuFocusGroup").FocusGroup,{portrait:!0,preventScrollOnFocus:!1,tabScopeQuery:b("TabbableScopeQuery.react"),wrap:!0,children:h.jsx(b("CometPopover.react"),{id:l,ref:c,role:m,testid:void 0,withArrow:p,children:h.jsx(b("BaseScrollableArea.react"),{horizontal:!1,vertical:!0,xstyle:[i.root,n==="full"&&i.sizeFull,n==="normal"&&i.sizeNormal,o&&i.truncate],children:h.jsx(b("CometMenuItemBaseRoleContext").Provider,{value:r,children:[f!=null?[h.jsx("div",{className:(g||(g=b("stylex")))(i.listItem),role:r,children:h.jsx(b("TetraTextPairing.react"),{headline:f.title,level:3,meta:f.meta,reduceEmphasis:!0})},"header"),h.jsx(b("CometSeparatorMenuItem.react"),{},"header-separator")]:null,h.jsx(h.Fragment,{children:a},"contents"),e!=null?[h.jsx(b("CometSeparatorMenuItem.react"),{},"footer-separator"),h.jsx("div",{className:(g||(g=b("stylex")))(i.listItem),role:r,children:h.jsx(b("TetraTextPairing.react"),{level:3,meta:e.text})},"footer")]:null]})})})}):null}e.exports=h.memo(h.forwardRef(a))}),null);
__d("ProfileCometEngagementLoggingContext",["React"],(function(a,b,c,d,e,f){"use strict";a=b("React");c=a.createContext({vc:void 0});e.exports=c}),null);
__d("useProfileEngagementData",["requireCond","ProfileCometContext","ProfileCometEngagementLoggingContext","cr:1214433","React","useCurrentRoute"],(function(a,b,c,d,e,f){"use strict";c=b("React");var g=c.useContext,h="2220391788200892";function a(a){var c=g(b("ProfileCometContext")),d=g(b("ProfileCometEngagementLoggingContext")),e=b("useCurrentRoute")();return babelHelpers["extends"]({appid:h,profile_id_dummy:c.profileID,profile_session_id:b("cr:1214433")&&b("cr:1214433").get(c.profileID,e)},d,a)}e.exports=a}),null);
__d("useProfileEngagementClickCallback",["requireDeferred","React","recoverableViolation","useProfileEngagementData"],(function(a,b,c,d,e,f){"use strict";var g=b("requireDeferred")("ProfileEngagementTypedLoggerLite");c=b("React");var h=c.useCallback;function a(a,c){var d=b("useProfileEngagementData")(a);d.product_bucket==null&&(b("recoverableViolation")("product_bucket is a required field for profile engagement logging","profile_comet"),d=babelHelpers["extends"]({},d,{product_bucket:"unknown"}));a=h(function(a){var b=new Date();g.onReady(function(a){a=a.log;a(babelHelpers["extends"]({engagement_type:"click",time:Math.floor(b/1e3).toString()},d))});c&&c(a)},[c,d]);return a}e.exports=a}),null);
__d("XCometSettingsControllerRouteBuilder",["cometRouteBuilder"],(function(a,b,c,d,e,f){a=b("cometRouteBuilder")("/settings/",Object.freeze({}),void 0);e.exports=a}),null);
__d("CometActivityLogConstants",[],(function(a,b,c,d,e,f){"use strict";a={DEFAULT_CATEGORY:"ALL",DEFAULT_PRIVACY:"NONE",DEFAULT_VISIBILITY:"ALL",ENTRY_POINT:"PROFILE_SHORTCUT",FILTER_MENU_TEST_VARIABLES:{category:"ALL",month:null,privacy:"NONE",visibility:"ALL",year:null},PAGINATION_FETCH_COUNT:25,PAGINATION_ROOT_MARGIN:{bottom:2e3},TEST_VARIABLES:{category:"ACTIVITY_LOG",category_key:"ALL",count:25,cursor:null,feedLocation:"ACTIVITY_LOG",month:null,privacy:"NONE",timeline_visibility:"ALL",year:null},VISIBILITY_HIDE_TEXT:"Hide from Timeline",VISIBILITY_SHOW_TEXT:"Show on Timeline"};e.exports=a}),null);
__d("NullStateFiles",["IconSource"],(function(a,b,c,d,e,f){"use strict";a={dark:new(b("IconSource"))("nullStateGlyphs","/images/comet/empty_states_icons/files/null_states_files_dark_mode.svg",112),"default":new(b("IconSource"))("nullStateGlyphs","/images/comet/empty_states_icons/files/null_states_files_gray_wash.svg",112)};e.exports=a}),null);
__d("CometNotificationsActionsMenu.react",["ix","fbt","CometMenu.react","CometMenuItem.react","React","XCometSettingsControllerRouteBuilder","fbicon"],(function(a,b,c,d,e,f,g,h){"use strict";var i=b("React");function a(a){var c=a.notificationsListRef;a=function(){c.current!=null&&c.current.markAllNotificationsAsRead!=null&&c.current.markAllNotificationsAsRead()};return i.jsxs(b("CometMenu.react"),{withArrow:!0,children:[i.jsx(b("CometMenuItem.react"),{icon:b("fbicon")._(g("477820"),20),onClick:a,primaryText:h._("Marcar como le\u00eddas"),testid:void 0}),i.jsx(b("CometMenuItem.react"),{href:b("XCometSettingsControllerRouteBuilder").buildURL({tab:"notifications"}),icon:b("fbicon")._(g("497570"),20),primaryText:h._("Configuraci\u00f3n de notificaciones")})]})}e.exports=a}),null);
__d("CometNotificationsRankingErrorFalcoEvent",["FalcoLoggerInternal"],(function(a,b,c,d,e,f){"use strict";a=b("FalcoLoggerInternal").create("comet_notifications_ranking_error");e.exports=a}),null);
__d("NotifListBottomCollisionFalcoEvent",["FalcoLoggerInternal"],(function(a,b,c,d,e,f){"use strict";a=b("FalcoLoggerInternal").create("notif_list_bottom_collision");e.exports=a}),null);