#include <stdio.h>
#include <stdlib.h>

#include "StaticFiles.h"

char *connectHTML;
char *connectJS;

char *StaticFiles::readFile(const char *filename)
{
  char *buffer;
  long length;
  FILE *f = fopen(filename, "r");
  if (f)
  {
    fseek(f, 0, SEEK_END);
    length = ftell(f);
    fseek(f, 0, SEEK_SET);
    buffer = (char *)malloc(length);
    if (buffer)
    {
      fread(buffer, 1, length, f);
    }
    fclose(f);
  }

  return buffer;
}

void StaticFiles::readConnectFiles()
{
  //::connectHTML
  connectHTML = "<!doctype html><html lang=\"en\" class=\"theme-transition\"><head><meta charset=\"UTF-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/><title>MSS</title><script defer=\"defer\" src=\"index.js\"></script></head><body><main id=\"root\"></main></body></html>}";
  //::end
  //::connectJS
  connectJS = "(()=>{\"use strict\";var e={709:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(601),o=n.n(r),a=n(609),i=n.n(a)()(o());i.push([e.id,\"@import url(https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap);\"]),i.push([e.id,':root{--theme-background-primary:#323232;--theme-background-secondary:#282828;--theme-text-primary:#fff;--theme-text-secondary:#b9b9b9;--theme-text-third:#676767;--theme-text-eggplant:#865bff;--theme-accent-first:#d34747;--theme-bg-overlay:rgba(119,119,119,.6);--theme-shadow-dark-box:rgba(33,33,33,.2509803922)}:root.light{--theme-background-primary:#fff;--theme-background-secondary:#efeeee;--theme-text-primary:#010101;--theme-text-secondary:#4c4c4c;--theme-text-third:#676767;--theme-text-eggplant:#865bff;--theme-accent-first:#d34747;--theme-bg-overlay:rgba(119,119,119,.6);--theme-shadow-dark-box:rgba(33,33,33,.2509803922)}:root.dark{--theme-background-primary:#323232;--theme-background-secondary:#282828;--theme-text-primary:#fff;--theme-text-secondary:#b9b9b9;--theme-text-third:#676767;--theme-text-eggplant:#865bff;--theme-accent-first:#d34747;--theme-bg-overlay:rgba(119,119,119,.6);--theme-shadow-dark-box:rgba(33,33,33,.2509803922)}:root.theme-transition,:root.theme-transition *{transition:background-color 500ms,color 500ms;transition-delay:0s}*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:rgba(0,0,0,0)}html,body,#root{height:100%;overflow-x:hidden;overflow-y:hidden;font-family:\"Montserrat\",sans-serif;background-color:var(--theme-background-primary);color:var(--theme-text-primary)}span,h1,h3,p,div,input,input::placeholder,button,h2{font-family:\"Montserrat\",sans-serif}h2{font-weight:700;font-size:20px}h4{font-weight:500;line-height:24px}input{outline:none}a{text-decoration:none;font-size:16px}ul,li{list-style-type:none}input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{-webkit-appearance:none}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}button{background:none;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;outline:inherit}',\"\"]);const s=i},609:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n=\"\",r=void 0!==t[5];return t[4]&&(n+=\"@supports (\".concat(t[4],\") {\")),t[2]&&(n+=\"@media \".concat(t[2],\" {\")),r&&(n+=\"@layer\".concat(t[5].length>0?\" \".concat(t[5]):\"\",\" {\")),n+=e(t),r&&(n+=\"}\"),t[2]&&(n+=\"}\"),t[4]&&(n+=\"}\"),n})).join(\"\")},t.i=function(e,n,r,o,a){\"string\"==typeof e&&(e=[[null,e,void 0]]);var i={};if(r)for(var s=0;s<this.length;s++){var c=this[s][0];null!=c&&(i[c]=!0)}for(var u=0;u<e.length;u++){var p=[].concat(e[u]);r&&i[p[0]]||(void 0!==a&&(void 0===p[5]||(p[1]=\"@layer\".concat(p[5].length>0?\" \".concat(p[5]):\"\",\" {\").concat(p[1],\"}\")),p[5]=a),n&&(p[2]?(p[1]=\"@media \".concat(p[2],\" {\").concat(p[1],\"}\"),p[2]=n):p[2]=n),o&&(p[4]?(p[1]=\"@supports (\".concat(p[4],\") {\").concat(p[1],\"}\"),p[4]=o):p[4]=\"\".concat(o)),t.push(p))}},t}},601:e=>{e.exports=function(e){return e[1]}},62:e=>{var t=[];function n(e){for(var n=-1,r=0;r<t.length;r++)if(t[r].identifier===e){n=r;break}return n}function r(e,r){for(var a={},i=[],s=0;s<e.length;s++){var c=e[s],u=r.base?c[0]+r.base:c[0],p=a[u]||0,d=\"\".concat(u,\" \").concat(p);a[u]=p+1;var l=n(d),f={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==l)t[l].references++,t[l].updater(f);else{var h=o(f,r);r.byIndex=s,t.splice(s,0,{identifier:d,updater:h,references:1})}i.push(d)}return i}function o(e,t){var n=t.domAPI(t);n.update(e);return function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,o){var a=r(e=e||[],o=o||{});return function(e){e=e||[];for(var i=0;i<a.length;i++){var s=n(a[i]);t[s].references--}for(var c=r(e,o),u=0;u<a.length;u++){var p=n(a[u]);0===t[p].references&&(t[p].updater(),t.splice(p,1))}a=c}}},793:e=>{var t={};e.exports=function(e,n){var r=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!r)throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");r.appendChild(n)}},173:e=>{e.exports=function(e){var t=document.createElement(\"style\");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},892:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute(\"nonce\",t)}},36:e=>{e.exports=function(e){if(\"undefined\"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var r=\"\";n.supports&&(r+=\"@supports (\".concat(n.supports,\") {\")),n.media&&(r+=\"@media \".concat(n.media,\" {\"));var o=void 0!==n.layer;o&&(r+=\"@layer\".concat(n.layer.length>0?\" \".concat(n.layer):\"\",\" {\")),r+=n.css,o&&(r+=\"}\"),n.media&&(r+=\"}\"),n.supports&&(r+=\"}\");var a=n.sourceMap;a&&\"undefined\"!=typeof btoa&&(r+=\"\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a)))),\" */\")),t.styleTagTransform(r,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},464:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={id:r,exports:{}};return e[r](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nc=void 0,(()=>{var e=n(62),t=n.n(e),r=n(36),o=n.n(r),a=n(793),i=n.n(a),s=n(892),c=n.n(s),u=n(173),p=n.n(u),d=n(464),l=n.n(d),f=n(709),h={};h.styleTagTransform=l(),h.setAttributes=c(),h.insert=i().bind(null,\"head\"),h.domAPI=o(),h.insertStyleElement=p();t()(f.Z,h);f.Z&&f.Z.locals&&f.Z.locals;(new(function(){function e(){}return e.prototype.init=function(){},e}())).init()})()})();";
  //::end
}

char *StaticFiles::getConnectFIle(const char *fileType)
{
  if (fileType == "html")
  {
    return connectHTML;
  }
  return connectJS;
}