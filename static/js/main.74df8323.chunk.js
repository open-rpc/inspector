(this["webpackJsonp@open-rpc/inspector"]=this["webpackJsonp@open-rpc/inspector"]||[]).push([[1],{539:function(e,t,n){e.exports=n(800)},661:function(e,t){},669:function(e,t){},671:function(e,t){},796:function(e,t,n){},797:function(e,t,n){},800:function(e,t,n){"use strict";n.r(t);var a=n(55),r=n.n(a),o=n(0),c=n.n(o),i=n(62),s=n(837),u=n(827),l=n(282),p=n(307),m=n.n(p),d=Object(l.a)({props:{MuiAppBar:{position:"sticky"},MuiCard:{elevation:0}},overrides:{MuiAppBar:{root:{background:"#fff !important"}}},palette:{background:{default:"#fff"}}}),f=Object(l.a)({props:{MuiAppBar:{position:"sticky"},MuiCard:{elevation:0}},palette:{type:"dark",background:{default:m.a[900],paper:m.a[800]}},overrides:{MuiAppBar:{root:{background:"transparent !important"}},MuiTable:{root:{background:"transparent !important"}},MuiTypography:{root:{color:m.a[400]}}}}),b=n(377),g=n(108),h=n.n(g),y=n(166),j=n(92),O=n(527),v=n(255),E=n.n(v),x=n(125),k=n(508),C=n.n(k),T=n(509),D={jsonrpc:{type:"string",enum:["2.0"],description:"JSON-RPC version string"},id:{description:"unique identifier for the JSON-RPC request",oneOf:[{type:"string"},{type:"number"}]},method:{type:"string"}},w=function(e){return{type:"object",properties:{id:Object(j.a)({},D.id),jsonrpc:Object(j.a)({},D.jsonrpc),method:{type:"string",oneOf:e&&e.methods&&e.methods.map((function(e){return{const:e.name,description:e.description||e.summary,markdownDescription:e.description||e.summary}}))}},allOf:e&&e.methods&&e.methods.map((function(e){return{if:{properties:{method:{const:e.name}}},then:{properties:{params:{oneOf:[{type:"array",minItems:e.params&&e.params.filter((function(e){return e.required})).length,maxItems:e.params&&e.params.length,defaultSnippets:e.examples?e.examples.map((function(e){return{label:e.name,description:e.description||e.summary,body:e.params&&e.params.map((function(e){return e.value}))}})):[],items:e.params&&e.params.map((function(e){return Object(j.a)({},e.schema,{markdownDescription:e.description||e.summary,description:e.description||e.summary,additionalProperties:!1})}))},{type:"object",properties:e.params&&e.params.reduce((function(e,t){return e[t.name]=Object(j.a)({},t.schema,{markdownDescription:t.description||t.summary,description:t.description||t.summary,additionalProperties:!1}),e}),{})}]}}}}}))}},S=n(625).initVimMode,M=function(e){var t=Object(o.useState)(),n=Object(i.a)(t,2),a=n[0],r=n[1];return Object(o.useEffect)((function(){if(e)return e.addAction({id:"vim-mode",label:"Vim Mode",keybindings:[x.KeyMod.chord(x.KeyMod.CtrlCmd|x.KeyCode.KEY_K,x.KeyMod.CtrlCmd|x.KeyCode.KEY_V)],contextMenuGroupId:"navigation",contextMenuOrder:1.5,run:function(){a&&a.dispose(),r(S(e))}}),function(){a&&a.dispose()}}),[e]),[e,a]},R=function(e){var t=Object(o.useState)(),n=Object(i.a)(t,2),a=n[0],r=n[1];M(a);var s=C()();Object(o.useEffect)((function(){a&&a.layout()}),[s,a]),Object(o.useEffect)((function(){if(a){var t=e.openrpcDocument&&e.openrpcDocument.info?e.openrpcDocument.info.title:"inspector",n="inmemory://".concat(t,"-").concat(Math.random(),".json"),r=x.Uri.parse(n),o=x.editor.createModel(e.value||"","json",r);a.setModel(o);var c={type:"object",properties:{jsonrpc:{type:"string",const:"2.0"},id:{oneOf:[{type:"string"},{type:"number"}]},method:{type:"string"}}};c=e.openrpcDocument?w(e.openrpcDocument):{additionalProperties:!1,properties:Object(j.a)({},c.properties,{params:{oneOf:[{type:"array"},{type:"object"}]}})},Object(T.addDiagnostics)(r.toString(),c,x)}}),[e.openrpcDocument,a]);return c.a.createElement(E.a,{height:"93vh",value:e.value,editorDidMount:function(e,t){r(t)},editorOptions:{minimap:{enabled:!1},automaticLayout:!0,fixedOverflowWidgets:!0},language:"json",onChange:function(t,n){e.onChange&&e.onChange(n)}})},P=n(381),I=n.n(P),q=n(518),N=n.n(q),A=n(519),B=n.n(A),J=n(520),W=n.n(J),K=n(522),L=n.n(K),U=n(305),z=n.n(U),H=n(521),F=n.n(H),Y=n(828),G=n(829),V=n(830),_=n(308),Q=n(841),$=n(836),X=n(810),Z=n(811),ee=n(838),te=n(842),ne=n(839),ae=n(831),re=n(835),oe=n(840),ce=n(832),ie=n(523),se=n.n(ie),ue=n(524),le=n.n(ue),pe={jsonrpc:"2.0",method:"",params:[],id:0},me=function(e){var t=Object(o.useState)(0),n=Object(i.a)(t,2),a=n[0],r=n[1],c=Object(o.useState)(e||[{name:"New Tab",content:pe,url:void 0,logs:[]}]),s=Object(i.a)(c,2),u=s[0],l=s[1];Object(o.useEffect)((function(){u.length===a&&r(a-1)}),[u,a]);var p=function(e,t){var n=u.map((function(n){return n===e?Object(j.a)({},n,{name:t}):n}));l(n)};return{setTabContent:function(e,t){var n=u.map((function(n,a){return a===e?Object(j.a)({},n,{content:t}):n}));l(n)},setTabEditing:function(e,t){var n=u.map((function(n){return n===e?Object(j.a)({},n,{editing:t}):n}));l(n)},setTabIndex:r,setTabName:p,tabs:u,setTabs:l,handleClose:function(e,t){if(1!==u.length){var n=u.filter((function(e,n){return n!==t}));l(n)}},tabIndex:a,handleLabelChange:function(e,t){p(t,e.target.value)},setTabUrl:function(e,t){var n=u.map((function(n,a){return a===e?Object(j.a)({},n,{url:t}):n}));l(n)},setTabLogs:function(e,t){var n=u.map((function(n,a){return a===e?Object(j.a)({},n,{logs:t}):n}));l(n)},setTabOpenRPCDocument:function(e,t){var n=u.map((function(n,a){return a===e?t?Object(j.a)({},n,{openrpcDocument:t}):{name:n.name,content:n.content,logs:n.logs,editing:n.editing,url:n.url}:n}));l(n)}}},de=n(844),fe=n(229),be=n(510),ge=n(511),he=n(834),ye=n(512),je=n.n(ye),Oe=function(e){var t=e.selectedTransport,n=e.transports,a=e.onChange,r=e.style,s=e.onAddTransport,u=Object(o.useState)(null),l=Object(i.a)(u,2),p=l[0],m=l[1],d=Object(o.useState)(!1),f=Object(i.a)(d,2),b=f[0],g=f[1],h=Object(o.useState)(),y=Object(i.a)(h,2),j=y[0],O=y[1],v=Object(o.useState)(),E=Object(i.a)(v,2),x=E[0],k=E[1],C=Object(o.useState)(),T=Object(i.a)(C,2),D=T[0],w=T[1],S=Object(o.useState)(null),M=Object(i.a)(S,2),R=M[0],P=M[1];return c.a.createElement("div",{style:r},c.a.createElement(Y.a,{onClose:function(){return g(!1)},"aria-labelledby":"simple-dialog-title",open:b},c.a.createElement(G.a,{maxWidth:"sm"},c.a.createElement(V.a,{container:!0,justify:"space-between",alignItems:"center",style:{padding:"30px",paddingTop:"10px",paddingBottom:"10px",marginTop:"10px"}},c.a.createElement(_.a,{variant:"h6"},"Custom Transport Plugin"),c.a.createElement(_.a,{variant:"caption",gutterBottom:!0},'Transport plugins are created by implementing the "connect", "sendData", and "close" methods over JSON-RPC.'),c.a.createElement(V.a,{container:!0,direction:"column",spacing:1},c.a.createElement(V.a,{item:!0},c.a.createElement(ae.a,{placeholder:"Plugin Name",onChange:function(e){k(e.target.value)},style:{display:"block",background:"rgba(0,0,0,0.1)",borderRadius:"4px",padding:"0px 10px",marginRight:"5px"}})),c.a.createElement(V.a,{item:!0},c.a.createElement(ae.a,{placeholder:"Plugin URI",onChange:function(e){w(e.target.value)},style:{display:"block",background:"rgba(0,0,0,0.1)",borderRadius:"4px",padding:"0px 10px",marginRight:"5px"}})),c.a.createElement(V.a,{item:!0},c.a.createElement(ce.a,{variant:"outlined",onClick:function(e){P(e.currentTarget)}},j?j.name:"Select A Transport"))),c.a.createElement(ge.a,{id:"transport-menu",anchorEl:R,keepMounted:!0,open:Boolean(R),onClose:function(){P(null)}},n.filter((function(e){return"plugin"!==e.type})).map((function(e,t){return c.a.createElement(he.a,{onClick:function(){return function(e){P(null),O(e)}(e)}},e.name)}))),c.a.createElement(ce.a,{style:{marginTop:"10px",marginBottom:"10px"},onClick:function(){(P(null),j&&x&&D)&&(s({type:"plugin",transport:j,name:x,uri:D}),g(!1))},disabled:!x||!D||!j,variant:"contained"},"Add Transport")))),c.a.createElement(ce.a,{style:{marginRight:"10px",marginLeft:"5px"},variant:"outlined",onClick:function(e){m(e.currentTarget)},endIcon:c.a.createElement(je.a,null)},t&&t.name),c.a.createElement(ge.a,{id:"transport-menu",anchorEl:p,keepMounted:!0,open:Boolean(p),onClose:function(){m(null)}},n.map((function(e,t){return c.a.createElement(he.a,{onClick:function(){return function(e){m(null),a(e)}(e)}},e.name)})),c.a.createElement(he.a,{onClick:function(){return g(!0)}},c.a.createElement(z.a,{style:{marginRight:"5px"}}),c.a.createElement(_.a,{variant:"caption"},"Add Transport"))))},ve=n(513),Ee=n(514),xe=n(526),ke=n(515),Ce=n(528),Te=n(267),De=n(199),we=function e(t,n,a){var r,o,c,i;return h.a.async((function(s){for(;;)switch(s.prev=s.next){case 0:if("websocket"!==(null===(o=n.find((function(e){return e.type===a.type})))||void 0===o?void 0:o.type)){s.next=5;break}r=new Te.WebSocketTransport(t),s.next=23;break;case 5:if("http"!==(null===o||void 0===o?void 0:o.type)){s.next=9;break}r=new Te.HTTPTransport(t),s.next=23;break;case 9:if("postmessageiframe"!==(null===o||void 0===o?void 0:o.type)){s.next=13;break}r=new Te.PostMessageIframeTransport(t),s.next=23;break;case 13:if("postmessagewindow"!==(null===o||void 0===o?void 0:o.type)){s.next=17;break}r=new Te.PostMessageWindowTransport(t),s.next=23;break;case 17:if("plugin"!==(null===o||void 0===o?void 0:o.type)){s.next=23;break}return s.next=20,h.a.awrap(e(o.uri,n,o.transport));case 20:c=s.sent,i=function(e){function n(){return Object(ve.a)(this,n),Object(xe.a)(this,Object(ke.a)(n).apply(this,arguments))}return Object(Ce.a)(n,e),Object(Ee.a)(n,[{key:"connect",value:function(){var e;return h.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,h.a.awrap(c.connect());case 2:return n.next=4,h.a.awrap(c.sendData({internalID:0,request:{jsonrpc:"2.0",method:"connect",params:[t],id:0}}));case 4:return e=n.sent,n.abrupt("return",e);case 6:case"end":return n.stop()}}))}},{key:"sendData",value:function(e){return c.sendData({internalID:0,request:{jsonrpc:"2.0",method:"sendData",params:[e.request],id:0}})}},{key:"close",value:function(){return c.sendData({internalID:0,request:{jsonrpc:"2.0",method:"close",params:[],id:0}})}}]),n}(De.Transport),r=new i;case 23:return s.abrupt("return",r);case 24:case"end":return s.stop()}}))},Se=function(e,t,n){var a=Object(o.useState)(),r=Object(i.a)(a,2),c=r[0],s=r[1],u=Object(o.useState)(!1),l=Object(i.a)(u,2),p=l[0],m=l[1],d=Object(o.useState)(n),f=Object(i.a)(d,2),b=f[0],g=f[1],y=Object(o.useState)(),j=Object(i.a)(y,2),O=j[0],v=j[1];Object(o.useEffect)((function(){if(""!==t&&void 0!==t){if(b){(function(){var n;return h.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,h.a.awrap(we(t,e,b));case 2:return n=a.sent,a.abrupt("return",n.connect().then((function(){m(!0),s(n)})));case 4:case"end":return a.stop()}}))})().catch((function(e){m(!1),s(void 0),v(e)}))}}else s(void 0)}),[b,t,e]);return[c,function(e){return h.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:m(!1),g(e);case 2:case"end":return t.stop()}}))},O,p]},Me=n(516),Re=n.n(Me),Pe=[{type:"http",name:"HTTP"},{type:"websocket",name:"WebSocket"},{type:"postmessagewindow",name:"PostMessageWindow"},{type:"postmessageiframe",name:"PostMessageIframe"}],Ie=function(e,t){if(e instanceof Error&&e){var n={jsonrpc:"2.0",id:t};return e.data instanceof Error?Object(j.a)({},n,{error:{code:e.data.code,message:e.data.message,data:e.data.data}}):Object(j.a)({},n,{error:{code:e.code,message:e.message,data:e.data}})}},qe={jsonrpc:"2.0",method:"",params:[],id:0},Ne=function(e){var t=me([{name:e.request?e.request.method:"New Tab",content:e.request||Object(j.a)({},qe),logs:[],url:e.url||"",openrpcDocument:e.openrpcDocument}]),n=t.setTabContent,a=t.setTabEditing,r=t.setTabIndex,s=t.tabs,u=t.setTabs,l=t.handleClose,p=t.tabIndex,m=t.setTabOpenRPCDocument,d=t.setTabUrl,f=t.handleLabelChange,b=t.setTabLogs,g=Object(o.useState)(e.openrpcDocument),v=Object(i.a)(g,2),x=v[0],k=v[1],C=Object(o.useState)(e.request||{jsonrpc:"2.0",method:"",params:[],id:0}),T=Object(i.a)(C,2),D=T[0],w=T[1],S=Object(o.useState)(Pe),M=Object(i.a)(S,2),P=M[0],q=M[1],A=Object(o.useState)(e.url||""),J=Object(i.a)(A,2),K=J[0],U=J[1],H=Object(de.a)(K,1e3),ie=Object(i.a)(H,1)[0],ue=Object(o.useState)(Pe[0]),pe=Object(i.a)(ue,2),ge=pe[0],he=pe[1],ye=Se(P,ie,Pe[0]),je=Object(i.a)(ye,4),ve=je[0],Ee=je[1],xe=je[3],ke=Object(o.useState)(!1),Ce=Object(i.a)(ke,2),Te=Ce[0],De=Ce[1],we=Object(o.useState)([]),Me=Object(i.a)(we,2),Ne=Me[0],Ae=Me[1],Be=Object(o.useState)(0),Je=Object(i.a)(Be,2),We=Je[0],Ke=Je[1],Le=Object(o.useState)([]),Ue=Object(i.a)(Le,2),ze=Ue[0],He=Ue[1];Object(o.useEffect)((function(){u([].concat(Object(y.a)(s),[{name:e.request&&e.request.method||"New Tab",content:e.request,url:e.url,openrpcDocument:x}])),r(s.length)}),[e.request]),Object(o.useEffect)((function(){void 0!==ge&&Ee(ge)}),[ge]),Object(o.useEffect)((function(){D&&n(p,D)}),[D]),Object(o.useEffect)((function(){if(e.transport){var t=Pe.find((function(t){return t.type===e.transport}));t&&he(t)}}),[e.transport]),Object(o.useEffect)((function(){e.url&&(U(e.url),d(p,e.url))}),[e.url]);var Fe=function(){var e,t,n,a,r,o,c,i,u,l,m,d;return h.a.async((function(f){for(;;)switch(f.prev=f.next){case 0:if(e=new Date,!ve){f.next=27;break}return f.prev=2,e=new Date,f.next=6,h.a.awrap(ve.sendData({internalID:D.id,request:D}));case 6:t=f.sent,n=new Date,a={jsonrpc:"2.0",result:t,id:D.id},r={type:"request",method:D.method,timestamp:e,payload:D},o={type:"response",method:D.method,timestamp:n,payload:a},c=[].concat(Object(y.a)(Ne),[Object(j.a)({},s[p])]),Ae(c),He((function(e){return[].concat(Object(y.a)(e),[r,o])})),b(p,[].concat(Object(y.a)(s[p].logs||[]),[r,o])),f.next=27;break;case 17:f.prev=17,f.t0=f.catch(2),i=new Date,u=Ie(f.t0,D.id),l={type:"request",method:D.method,timestamp:e,payload:D},m={type:"response",method:D.method,timestamp:i,payload:u},d=[].concat(Object(y.a)(Ne),[Object(j.a)({},s[p])]),Ae(d),He((function(e){return[].concat(Object(y.a)(e),[l,m])})),b(p,[].concat(Object(y.a)(s[p].logs||[]),[l,m]));case 27:case"end":return f.stop()}}),null,null,[[2,17]])};Object(o.useEffect)((function(){e.openrpcDocument||k(void 0),function(){var t,n;h.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,h.a.awrap(null===ve||void 0===ve?void 0:ve.sendData({internalID:999999,request:{jsonrpc:"2.0",params:[],id:999999,method:"rpc.discover"}}));case 3:return t=a.sent,a.next=6,h.a.awrap(Object(be.parseOpenRPCDocument)(t));case 6:n=a.sent,k(n),m(p,n),a.next=14;break;case 11:a.prev=11,a.t0=a.catch(0),e.openrpcDocument||(k(void 0),m(p,void 0));case 14:case"end":return a.stop()}}),null,null,[[0,11]])}()}),[ve,p]),Object(o.useEffect)((function(){s[p]&&(w(s[p].content),U(s[p].url||""),He(s[p].logs||[]))}),[p]),Object(o.useEffect)((function(){k(e.openrpcDocument),m(p,e.openrpcDocument)}),[e.openrpcDocument]),Object(o.useEffect)((function(){Te||Fe()}),[Te]);return c.a.createElement(c.a.Fragment,null,c.a.createElement(Y.a,{onClose:function(){return De(!1)},"aria-labelledby":"simple-dialog-title",open:Te},c.a.createElement(G.a,{maxWidth:"sm"},c.a.createElement(V.a,{container:!0,justify:"space-between",alignItems:"center",style:{padding:"30px",paddingTop:"10px",paddingBottom:"10px"}},c.a.createElement(_.a,{color:"textPrimary"},"History"),0===Ne.length?null:c.a.createElement(Q.a,{title:"Use"},c.a.createElement($.a,{onClick:function(){Ne[We]&&(w(Ne[We].content),U(Ne[We].url),k(Ne[We].openrpcDocument),De(!1))}},c.a.createElement(I.a,null)))),0===Ne.length?c.a.createElement(_.a,{style:{padding:"30px"}},"No History Yet."):c.a.createElement(V.a,{container:!0,style:{paddingBottom:"30px"}},c.a.createElement(X.a,{style:{padding:"10px",overflowY:"scroll",height:"250px",width:"200px"}},Ne.map((function(e,t){return c.a.createElement(Z.a,{button:!0,onClick:function(){return Ke(t)},selected:t===We},c.a.createElement(ee.a,{primary:e.content.method||"Empty Method",secondary:e.url||"Empty Url"}))}))),c.a.createElement(E.a,{width:"300px",height:"250px",value:Ne[We]?JSON.stringify(Ne[We].content,null,4):"",language:"json",editorDidMount:function(){}})))),c.a.createElement("div",{style:{position:"relative"}},c.a.createElement(te.a,{style:{background:"transparent"},value:p,variant:"scrollable",indicatorColor:"primary",onChange:function(e,t){r(t)}},s.map((function(e,t){return c.a.createElement(ne.a,{disableRipple:!0,style:{border:"none",outline:"none",userSelect:"none"},onDoubleClick:function(){return a(e,!0)},label:c.a.createElement("div",{style:{userSelect:"none"}},e.editing?c.a.createElement(ae.a,{value:e.name,onChange:function(t){return f(t,e)},onBlur:function(){return a(e,!1)},autoFocus:!0,style:{maxWidth:"80px",marginRight:"25px"}}):c.a.createElement(_.a,{style:{display:"inline",textTransform:"none",marginRight:"25px"},variant:"body1"},e.name),p===t?c.a.createElement(Q.a,{title:"Close Tab"},c.a.createElement($.a,{onClick:function(e){return l(e,t)},style:{position:"absolute",right:"10px",top:"25%"},size:"small"},c.a.createElement(N.a,null))):null)})})),c.a.createElement(ne.a,{disableRipple:!0,style:{minWidth:"50px"},label:c.a.createElement(Q.a,{title:"Create New Tab"},c.a.createElement($.a,{onClick:function(){return u([].concat(Object(y.a)(s),[{name:"New Tab",content:Object(j.a)({},qe,{id:0}),logs:[],openrpcDocument:x,url:K}]))}},c.a.createElement(z.a,{scale:.5})))}))),c.a.createElement(re.a,{elevation:0,position:"static",style:{zIndex:1}},c.a.createElement(oe.a,null,c.a.createElement("img",{height:"30",alt:"openrpc-logo",style:{marginRight:"10px"},src:"https://github.com/open-rpc/design/raw/master/icons/open-rpc-logo-noText/open-rpc-logo-noText%20(PNG)/128x128.png"}),c.a.createElement(_.a,{variant:"h6",color:"textSecondary"},"Inspector"),c.a.createElement(Oe,{transports:P,onAddTransport:function(e){q([].concat(Object(y.a)(P),[e]))},selectedTransport:ge,onChange:function(e){return he(e)},style:{marginLeft:"10px"}}),c.a.createElement(Q.a,{title:"Play"},c.a.createElement($.a,{onClick:Fe},c.a.createElement(I.a,{fontSize:"large"}))),c.a.createElement(ae.a,{startAdornment:c.a.createElement(c.a.Fragment,null,c.a.createElement(Q.a,{title:xe?"Connected":"Not Connected"},xe?c.a.createElement(B.a,{style:{color:fe.a[500]}}):c.a.createElement(W.a,{color:"error"})),x?c.a.createElement(Q.a,{title:c.a.createElement("div",{style:{textAlign:"center"}},c.a.createElement(_.a,null,"OpenRPC Document Detected"),c.a.createElement(_.a,{variant:"caption"},"A JSON-RPC endpoint may respond to the rpc.discover method or a provide a static document. This adds features like auto completion to the inspector.")),onClick:function(){return window.open("https://spec.open-rpc.org/#service-discovery-method")}},c.a.createElement(F.a,{style:{color:fe.a[500],marginRight:"5px",cursor:"pointer"},scale:.1})):null),value:K,placeholder:"Enter a JSON-RPC server URL",onChange:function(e){U(e.target.value),d(p,e.target.value)},fullWidth:!0,style:{background:"rgba(0,0,0,0.1)",borderRadius:"4px",padding:"0px 10px",marginRight:"5px"}}),c.a.createElement(Q.a,{title:"History"},c.a.createElement($.a,{onClick:function(){return De(!0)}},c.a.createElement(L.a,null))),e.hideToggleTheme?null:c.a.createElement(Q.a,{title:"Toggle Theme"},c.a.createElement($.a,{onClick:function(){e.onToggleDarkMode&&e.onToggleDarkMode()}},e.darkMode?c.a.createElement(se.a,null):c.a.createElement(le.a,null))))),c.a.createElement(O.a,{split:"vertical",minSize:100,maxSize:-100,defaultSize:"50%",style:{flexGrow:1}},c.a.createElement(R,{onChange:function(e){var t;try{t=JSON.parse(e)}catch(a){console.error(a)}t&&(w(t),n(p,t))},openrpcDocument:x,value:JSON.stringify(D,null,4)}),c.a.createElement(c.a.Fragment,null,ze.length>0&&c.a.createElement(ce.a,{style:{position:"absolute",top:"5px",right:"50px",zIndex:1},onClick:function(){He([]),b(p,[])}},"Clear"),c.a.createElement("div",{style:{height:"calc(100% - 128px)"}},c.a.createElement(Re.a,{logs:ze,sidebarAlign:"right",openRecentPayload:!0})))))},Ae=n(525),Be=function(e){var t=Object(o.useState)(Ae.parse(window.location.search,{ignoreQueryPrefix:!0,depth:e||100,decoder:function(e){return/^([+-]?[0-9]\d*|0)$/.test(e)?parseInt(e,10):"false"!==e&&("true"===e||decodeURIComponent(e))}}));return[Object(i.a)(t,1)[0]]},Je=function(){var e=Object(b.default)(),t=Be(),n=Object(i.a)(t,1)[0],a=e.value?f:d;return Object(o.useEffect)((function(){var t=e.value?"vs-dark":"vs";x.editor.setTheme(t)}),[e.value]),c.a.createElement(u.a,{theme:a},c.a.createElement(s.a,null),c.a.createElement(Ne,{onToggleDarkMode:e.toggle,darkMode:e.value,transport:n.transport,url:n.url,openrpcDocument:n.openrpcDocument,request:n.request}))};n(796),n(797);r.a.render(c.a.createElement(Je,null),document.getElementById("root"))}},[[539,2,3]]]);
//# sourceMappingURL=main.74df8323.chunk.js.map