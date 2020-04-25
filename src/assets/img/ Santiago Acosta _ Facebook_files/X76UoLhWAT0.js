if (self.CavalryLogger) { CavalryLogger.start_js(["yzYSc"]); }

__d("ProfileCometProfilePictureEditMenu_profile.graphql",[],(function(a,b,c,d,e,f){"use strict";a={argumentDefinitions:[],kind:"Fragment",metadata:null,name:"ProfileCometProfilePictureEditMenu_profile",selections:[{alias:null,args:null,kind:"ScalarField",name:"profile_picture_is_silhouette",storageKey:null},{args:null,kind:"FragmentSpread",name:"ProfileCometProfilePictureViewMenuItem_profile"}],type:"Profile"};e.exports=a}),null);
__d("ProfileCometProfilePictureViewMenuItem_profile.graphql",[],(function(a,b,c,d,e,f){"use strict";a={argumentDefinitions:[{kind:"RootArgument",name:"scale",type:"Float"}],kind:"Fragment",metadata:null,name:"ProfileCometProfilePictureViewMenuItem_profile",selections:[{alias:null,args:null,concreteType:"Photo",kind:"LinkedField",name:"profile_photo",plural:!1,selections:[{alias:null,args:null,kind:"ScalarField",name:"url",storageKey:null},{args:null,kind:"FragmentSpread",name:"useCometPhotoViewerPlaceholderPassthroughProps_photo"}],storageKey:null},{alias:"profilePic160",args:[{kind:"Literal",name:"height",value:160},{kind:"Variable",name:"scale",variableName:"scale"},{kind:"Literal",name:"width",value:160}],concreteType:"Image",kind:"LinkedField",name:"profile_picture",plural:!1,selections:[{alias:null,args:null,kind:"ScalarField",name:"uri",storageKey:null}],storageKey:null}],type:"Profile"};e.exports=a}),null);
__d("ProfileCometProfilePictureViewMenuItem.react",["ix","fbt","CometMenuItem.react","CometRelay","React","fbicon","useCometPhotoViewerPlaceholderPassthroughProps","ProfileCometProfilePictureViewMenuItem_profile.graphql"],(function(a,b,c,d,e,f,g,h){"use strict";var i;b("CometRelay").graphql;var j=b("CometRelay").useFragment,k=b("React");function a(a){var c;a=a.profile;a=j(i!==void 0?i:i=b("ProfileCometProfilePictureViewMenuItem_profile.graphql"),a);c=b("useCometPhotoViewerPlaceholderPassthroughProps")({photo:a.profile_photo,placeholderImageSrc:(c=a.profilePic160)==null?void 0:c.uri});a=(a=a.profile_photo)==null?void 0:a.url;return a==null?null:k.jsx(b("CometMenuItem.react"),{href:a,icon:b("fbicon")._(g("1030605"),20),passthroughProps:babelHelpers["extends"]({},c),primaryText:h._("Ver foto del perfil"),testid:void 0})}e.exports=a}),null);
__d("ProfileCometProfilePictureEditMenu.react",["ix","CometMenu.react","CometMenuItem.react","CometRelay","ProfileCometContext","ProfileCometProfilePictureEditStrings","ProfileCometProfilePictureViewMenuItem.react","React","fbicon","logCometFunnelEvent","useProfileCometProfilePictureEditDialog","ProfileCometProfilePictureEditMenu_profile.graphql"],(function(a,b,c,d,e,f,g){"use strict";var h;b("CometRelay").graphql;var i=b("CometRelay").useFragment,j=b("React");c=b("React");var k=c.useContext,l=b("logCometFunnelEvent").useLogCometFunnelImpressionEvent;function a(a){var c=a.includeViewOption;c=c===void 0?!1:c;var d=a.onClose;a=a.profile;a=i(h!==void 0?h:h=b("ProfileCometProfilePictureEditMenu_profile.graphql"),a);var e=k(b("ProfileCometContext"));e=e.profileID;e=b("useProfileCometProfilePictureEditDialog")(e,"TIMELINE",d);d=e[0];var f=e[1],m=e[2],n=e[3];e=e[4];var o=a.profile_picture_is_silhouette===!0;l("ProfileCometTimelineWebFunnelDefinition","[impression][profile picture edit menu]",{isSilhouette:o});return j.jsxs(b("CometMenu.react"),{withArrow:!0,children:[!o&&c?j.jsx(b("ProfileCometProfilePictureViewMenuItem.react"),{profile:a}):null,j.jsx(b("CometMenuItem.react"),{icon:o?b("fbicon")._(g("550099"),20):b("fbicon")._(g("481807"),20),onClick:d,onHoverIn:m,onHoverOut:n,onPressIn:e,primaryText:o?b("ProfileCometProfilePictureEditStrings").ADD_PHOTO:b("ProfileCometProfilePictureEditStrings").DIALOG_TITLE,ref:f})]})}e.exports=a}),null);