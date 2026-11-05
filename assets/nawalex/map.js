/* NawaLex dialect map. Data: data.json (built from the Lastra CLDF by build_data.py). */
(function(){
var D;
var T={
 es:{sub:'Mapa dialectal del náhuatl',
  concept:'Concepto',cog:'Cognados',reg:'Regiones',all:'Todo',cen:'Centro de México',legendC:'Clases de cognados',legendR:'Regiones dialectales',recon:'Reconstrucciones',point:'Punto seleccionado',
  noRecon:'Sin reconstrucción para este concepto.',noPoint:'Haga clic en un punto del mapa o en una fila de la tabla.',uncoded:'sin codificar',coded:'Con cognados codificados',notcoded:'Sin codificar',
  loc:'Localidad',region:'Región',state:'Estado',form:'Forma',orig:'Ortografía original',seg:'Segmentación',code:'Cognado',comment:'Nota',id:'ID',
  cap:function(n,m){return n+' formas en '+m+' localidades. Ø = sin reflejo; A+B = compuesto de dos raíces.'},
  nodata:'Sin datos',foot:'Fuente: Lastra de Suárez, Yolanda. 1986. Las áreas dialectales del náhuatl moderno. México: UNAM. Codificación: proyecto SUAHIST (ERC 101116662). Relieve: AWS Terrain Tiles; límites: Natural Earth.'},
 en:{sub:'Nahuatl dialect map',
  concept:'Concept',cog:'Cognates',reg:'Regions',all:'All',cen:'Central Mexico',legendC:'Cognate classes',legendR:'Dialect regions',recon:'Reconstructions',point:'Selected point',
  noRecon:'No reconstruction for this concept.',noPoint:'Click a point on the map or a row in the table.',uncoded:'not coded',coded:'With cognate coding',notcoded:'Not yet coded',
  loc:'Locality',region:'Region',state:'State',form:'Form',orig:'Original spelling',seg:'Segmentation',code:'Cognate',comment:'Note',id:'ID',
  cap:function(n,m){return n+' forms at '+m+' localities. Ø = no reflex; A+B = compound of two roots.'},
  nodata:'No data',foot:'Source: Lastra de Suárez, Yolanda. 1986. Las áreas dialectales del náhuatl moderno. Mexico: UNAM. Coding: SUAHIST project (ERC 101116662). Relief: AWS Terrain Tiles; borders: Natural Earth.'}
};
function start(){
var PAL=['#9a5733','#4f6d7a','#b0852b','#5c6a33','#7a4a6a','#3f7f6f','#c9a227','#2f3d22','#c07a5a','#8c9a4a','#6a4e32','#5a5f9a','#a33b3b','#7fa0a8'];
var OTHER='#b9b29c';
var VB={all:[0,0,D.W,D.H],cen:null};
(function(){ // central Mexico box: lon -101..-96, lat 17..21.9
  var k=D.W/17.4, ky=D.H/10.8, x0=(-101+106.2)*k, x1=(-96+106.2)*k, y0=(23.6-21.9)*ky, y1=(23.6-17)*ky;
  VB.cen=[x0,y0,x1-x0,y1-y0];
})();
var st={lang:document.documentElement.lang==='en'?'en':'es',ci:0,view:'cog',zoom:'all',hl:null,sel:null};
try{var s=JSON.parse(localStorage.getItem('nawalex-map')||'{}');['ci','view','zoom'].forEach(function(k){if(s[k]!=null)st[k]=s[k]})}catch(e){}
function save(){try{localStorage.setItem('nawalex-map',JSON.stringify({ci:st.ci,view:st.view,zoom:st.zoom}))}catch(e){}}
var $=function(q){return document.querySelector(q)};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var L=D.L.map(function(a){return {id:a[0],n:a[1],r:a[2],s:a[3],p:!!a[4],xy:a[5]}});
function regionGroup(r){if(!r)return '—';var p=r.split(',').map(function(x){return x.trim()}).filter(Boolean);return p.slice(0,2).join(', ')}
function isCoded(c){return c.f.some(function(f){return f[4]&&!L[f[0]].p})}
var ORDER=D.C.map(function(c,i){return i});

function fillSelect(){
  var t=T[st.lang],sel=$('#concept');
  var g1=ORDER.filter(function(i){return isCoded(D.C[i])}),g2=ORDER.filter(function(i){return !isCoded(D.C[i])});
  function opt(i){var c=D.C[i];return '<option value="'+i+'">'+c.id+'. '+esc(st.lang==='es'?c.es:c.en)+' · '+esc(st.lang==='es'?c.en:c.es)+'</option>'}
  sel.innerHTML='<optgroup label="'+esc(t.coded)+' ('+g1.length+')">'+g1.map(opt).join('')+'</optgroup><optgroup label="'+esc(t.notcoded)+' ('+g2.length+')">'+g2.map(opt).join('')+'</optgroup>';
  sel.value=String(st.ci);
}
function texts(){
  var t=T[st.lang];
  ['sub','concept','legend','recon','point','foot'].forEach(function(k){});
  $('#t-concept').textContent=t.concept;
  $('#v-cog').textContent=t.cog;$('#v-reg').textContent=t.reg;$('#z-all').textContent=t.all;$('#z-cen').textContent=t.cen;
  $('#t-recon').textContent=t.recon;$('#t-point').textContent=t.point;
}
function keyOf(f){
  if(st.view==='reg')return regionGroup(L[f[0]].r);
  return f[4]||'';
}
function render(){
  var t=T[st.lang],c=D.C[st.ci];
  var forms=c.f.filter(function(f){return !L[f[0]].p});
  var protos=c.f.filter(function(f){return L[f[0]].p});
  // classes
  var cnt={};forms.forEach(function(f){var k=keyOf(f);cnt[k]=(cnt[k]||0)+1});
  var keys=Object.keys(cnt).filter(function(k){return k!==''}).sort(function(a,b){return cnt[b]-cnt[a]||a.localeCompare(b)});
  var col={};keys.forEach(function(k,i){col[k]=i<PAL.length?PAL[i]:OTHER});col['']=OTHER;
  // legend
  $('#t-legend').textContent=st.view==='reg'?t.legendR:t.legendC;
  var lg=keys.map(function(k){
    var root='';
    if(st.view==='cog'){root=k.split('+').map(function(p){var m=p.match(/^([A-Z])/);return m&&D.R[c.id+'-'+m[1]]?D.R[c.id+'-'+m[1]].split(';')[0]:''}).filter(Boolean).join(' + ')}
    return '<li><button type="button" data-k="'+esc(k)+'" aria-pressed="'+(st.hl===k)+'"><span class="sw" style="background:'+col[k]+'"></span><span class="code">'+esc(k)+'</span><span class="root">'+esc(root)+'</span><span class="n">'+cnt[k]+'</span></button></li>'});
  if(cnt[''])lg.push('<li><button type="button" data-k="" aria-pressed="'+(st.hl==='')+'"><span class="sw" style="background:'+OTHER+'"></span><span class="code">—</span><span class="root">'+esc(t.uncoded)+'</span><span class="n">'+cnt['']+'</span></button></li>');
  $('#legend').innerHTML=lg.join('')||'<li class="empty">'+esc(t.nodata)+'</li>';
  document.querySelectorAll('#legend button').forEach(function(b){b.addEventListener('click',function(){st.hl=(st.hl===b.dataset.k)?null:b.dataset.k;render()})});
  // reconstructions
  $('#recon').innerHTML=protos.length?'<ul class="recon">'+protos.map(function(f){
    return '<li><span class="pl">'+esc(L[f[0]].id)+'</span><span><span class="f">*'+esc((f[3]||f[1]).replace(/\s+/g,'').replace(/^\*/,''))+'</span> <span class="lab" style="font-weight:600">'+esc(f[4])+'</span>'+(f[5]?'<br><span class="g">'+esc(f[5])+'</span>':'')+'</span></li>'}).join('')+'</ul>':'<p class="empty">'+esc(t.noRecon)+'</p>';
  // points: group forms by location
  var by={};forms.forEach(function(f){(by[f[0]]=by[f[0]]||[]).push(f)});
  var g='',labs='',z=st.zoom==='cen'?0.55:1,R=8*z*(window.innerWidth<700?2:1);
  Object.keys(by).forEach(function(li){
    var l=L[li];if(!l.xy)return;var fs=by[li],x=l.xy[0],y=l.xy[1];
    var ks=[];fs.forEach(function(f){var k=keyOf(f);if(ks.indexOf(k)<0)ks.push(k)});
    var dim=st.hl!==null&&ks.indexOf(st.hl)<0;
    var shape='';
    if(ks.length===1)shape='<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="'+col[ks[0]]+'"/>';
    else ks.forEach(function(k,i){var a0=2*Math.PI*i/ks.length-Math.PI/2,a1=2*Math.PI*(i+1)/ks.length-Math.PI/2;
      shape+='<path d="M'+x+' '+y+'L'+(x+R*Math.cos(a0)).toFixed(1)+' '+(y+R*Math.sin(a0)).toFixed(1)+'A'+R+' '+R+' 0 '+((a1-a0)>Math.PI?1:0)+' 1 '+(x+R*Math.cos(a1)).toFixed(1)+' '+(y+R*Math.sin(a1)).toFixed(1)+'Z" fill="'+col[k]+'"/>'});
    g+='<g class="pt'+(dim?' dim':'')+(st.sel==li?' sel':'')+'" data-l="'+li+'" tabindex="0" role="button" aria-label="'+esc(l.n)+'"><title>'+esc(l.id+' · '+l.n+': '+fs.map(function(f){return f[1]}).join(', '))+'</title>'+shape+'<circle class="ring" cx="'+x+'" cy="'+y+'" r="'+R+'"/></g>';
    if(st.zoom==='cen'||st.sel==li)labs+='<text class="vlab" style="font-size:'+(13*z)+'px;stroke-width:'+(4*z)+'px" x="'+(x+R+3*z)+'" y="'+(y+4*z)+'">'+esc(l.id)+'</text>';
  });
  $('#pts').innerHTML=g;$('#labs').innerHTML=labs;
  document.querySelectorAll('#pts .pt').forEach(function(p){
    function pick(){st.sel=+p.dataset.l;render()}
    p.addEventListener('click',pick);p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick()}});
  });
  $('#map').setAttribute('viewBox',VB[st.zoom].join(' '));
  $('#t-cap').textContent=t.cap(forms.length,Object.keys(by).length);
  // detail
  if(st.sel!=null&&by[st.sel]){var l=L[st.sel];
    $('#det').innerHTML='<p class="big">'+esc(l.n)+'</p><dl><dt>'+t.id+'</dt><dd>'+esc(l.id)+'</dd><dt>'+t.region+'</dt><dd>'+esc(l.r||'—')+'</dd><dt>'+t.state+'</dt><dd>'+esc(l.s)+'</dd></dl>'+
    by[st.sel].map(function(f){return '<dl style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px"><dt>'+t.form+'</dt><dd><i>'+esc(f[1])+'</i></dd>'+(f[2]?'<dt>'+t.orig+'</dt><dd>'+esc(f[2])+'</dd>':'')+(f[3]?'<dt>'+t.seg+'</dt><dd>'+esc(f[3])+'</dd>':'')+'<dt>'+t.code+'</dt><dd><b class="lab">'+esc(f[4]||'—')+'</b></dd>'+(f[5]?'<dt>'+t.comment+'</dt><dd>'+esc(f[5])+'</dd>':'')+'</dl>'}).join('');
  }else $('#det').innerHTML='<p class="empty">'+esc(t.noPoint)+'</p>';
  // table
  var rows=forms.slice().sort(function(a,b){return (a[4]||'~').localeCompare(b[4]||'~')||a[0]-b[0]});
  $('#tbl').innerHTML='<thead><tr><th>'+t.code+'</th><th>'+t.loc+'</th><th>'+t.form+'</th><th>'+t.seg+'</th><th>'+t.region+'</th></tr></thead><tbody>'+rows.map(function(f){var l=L[f[0]];
    return '<tr data-l="'+f[0]+'"'+(st.sel==f[0]?' class="on"':'')+'><td class="c"><span class="sw" style="display:inline-block;vertical-align:-2px;margin-right:6px;background:'+col[keyOf(f)]+'"></span>'+esc(f[4]||'—')+'</td><td>'+esc(l.id)+' <span class="lab" style="color:var(--muted)">'+esc(l.n)+'</span></td><td class="f">'+esc(f[1])+'</td><td class="s">'+esc(f[3])+'</td><td class="s">'+esc(regionGroup(l.r))+'</td></tr>'}).join('')+'</tbody>';
  document.querySelectorAll('#tbl tbody tr').forEach(function(r){r.addEventListener('click',function(){st.sel=+r.dataset.l;render();$('.mapbox').scrollIntoView({block:'nearest'})})});
  $('#v-cog').setAttribute('aria-pressed',st.view==='cog');$('#v-reg').setAttribute('aria-pressed',st.view==='reg');
  $('#z-all').setAttribute('aria-pressed',st.zoom==='all');$('#z-cen').setAttribute('aria-pressed',st.zoom==='cen');
  save();
}
function setConcept(i){st.ci=i;st.hl=null;$('#concept').value=String(i);render()}
$('#concept').addEventListener('change',function(e){setConcept(+e.target.value)});
function step(d){var opts=[].slice.call($('#concept').options).map(function(o){return +o.value});var p=opts.indexOf(st.ci);setConcept(opts[(p+d+opts.length)%opts.length])}
$('#prev').addEventListener('click',function(){step(-1)});$('#next').addEventListener('click',function(){step(1)});
$('#v-cog').addEventListener('click',function(){st.view='cog';st.hl=null;render()});$('#v-reg').addEventListener('click',function(){st.view='reg';st.hl=null;render()});
$('#z-all').addEventListener('click',function(){st.zoom='all';render()});$('#z-cen').addEventListener('click',function(){st.zoom='cen';render()});
if(!(st.ci>=0&&st.ci<D.C.length))st.ci=0;
var hm=location.hash.match(/^#c(\d+)$/);if(hm){var hi=D.C.findIndex(function(c){return c.id===hm[1]});if(hi>=0)st.ci=hi}
texts();fillSelect();render();

}
fetch(document.getElementById('map').dataset.src).then(function(r){return r.json()}).then(function(d){D=d;start()}).catch(function(){var e=document.getElementById('maperr');if(e)e.hidden=false});
})();
