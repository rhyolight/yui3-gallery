YUI.add("gallery-formbinder",function(A){YUI().add("FormBind",function(I){var H="FormBind",B="forms",G=null;G={};function D(K,M,L){var J=L.one('input[type="radio"]#'+K+"-"+M);if(J){J.set("checked",true);return true;}return false;}function F(L,K){var J=K.all('input[type="checkbox"]');if(J.size()===0){return false;}I.each(J,function(O,M){for(var N in L){if(O.get("id")==L[N]){O.set("checked",true);}}});}G.input=function(L,J,K){L.set("value",K);};G.textarea=function(L,J,K){L.set("value",K);};G.select=function(M,J,K){var L=M.one("option[value="+K+"]");if(!L){throw new Error('Cannot bind value "'+K+'" to a combo box without that option available.');}L.set("selected",true);};G.fieldset=function(N,J,M,L,K){if(!D(J,M,K)){if(M instanceof Array){F(M,K);}}};function C(J){return{year:J.getFullYear(),month:J.getMonth()+1,day:J.getDate()};}function E(M,P,R,K){var L=null,N=null,J=null,Q=null,O="";for(J in M){if(typeof M[J]!=="function"){Q=M[J];if(Q instanceof Date){this.formBind({label:J,data:C(Q)},R);}else{if(L){O=L;}else{O=P.length>0?P+"-"+J:J;if(O=="label"){L=M[J];continue;}}}N=K.one("#"+O);if(N){G[N.get("tagName").toLowerCase()](N,O,Q,M,K);}}}}I.namespace(B);I[B][H]={formBind:function(M,O){var J="",N=null,K=0,L=I.one("#"+O);L.all('input[type="checkbox"]').set("checked",false);if(M.label){J=M.label;M=M.data;}if(M.date&&M.format){N=new Date(Date.parse(M.date,M.format));return this.formBind({label:J,data:C(N)},O);}if(M instanceof Array){for(K=0;K<M.length;K++){E.call(this,M[K],J,O,L);}}E.call(this,M,J,O,L);}};return I[B][H];},"0.1",{requires:["node"]});},"@VERSION@",{requires:["node"]});