/* SUAEtym example page. Etyma and Nahua reflexes come from data.json, built from the
   working reconstructions in the Lastra Nahuatl dialect database (SUALEX-Data). */
(function(){
var EN=document.documentElement.lang==='en';
var T=EN?{
  n:function(a,b){return a+' of '+b+' etyma'}, refl:'Reflexes in Nahua varieties', chain:'Reconstructions', meanings:'Attested meanings',
  concept:'Lastra concept', region:'Dialect region', loc:'Locality', form:'Form', code:'Cognate', count:function(a,b){return a+' forms in '+b+' localities'},
  other:'Cognates in other languages', otherTxt:'Wixárika, Naayeri and other Southern Uto-Aztecan cognates will be added from WixaLex, NayaLex and the comparative literature.',
  map:'See on the dialect map', none:'No etymon matches.', cite:'Cite this entry', copy:'Copy', copied:'Copied', noregion:'Region not recorded',
  author:'‹Author(s)›', year:'‹Year›', srcnote:'Source of the reflexes: Lastra de Suárez (1986) and later additions, in the Lastra Nahuatl dialect database. Reconstructions: working drafts by the SUAHIST project.'
}:{
  n:function(a,b){return a+' de '+b+' étimos'}, refl:'Reflejos en las variantes nahuas', chain:'Reconstrucciones', meanings:'Significados atestiguados',
  concept:'Concepto de Lastra', region:'Región dialectal', loc:'Localidad', form:'Forma', code:'Cognado', count:function(a,b){return a+' formas en '+b+' localidades'},
  other:'Cognados en otras lenguas', otherTxt:'Los cognados en wixárika, naayeri y otras lenguas yutoaztecas del sur se añadirán desde WixaLex, NayaLex y la bibliografía comparativa.',
  map:'Ver en el mapa dialectal', none:'Ningún étimo coincide.', cite:'Citar esta entrada', copy:'Copiar', copied:'Copiado', noregion:'Región sin registro',
  author:'‹Autor(es)›', year:'‹Año›', srcnote:'Fuente de los reflejos: Lastra de Suárez (1986) y puntos añadidos, en la base de datos dialectal del náhuatl de Lastra. Reconstrucciones: borradores de trabajo del proyecto SUAHIST.'
};
var $=function(s){return document.querySelector(s)}, $$=function(s){return [].slice.call(document.querySelectorAll(s))};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var D, sel=0, lvlF='';
var ROOT=document.getElementById('su').dataset.root;
function star(f){return f.charAt(0)==='*'?f:'*'+f}
function gl(s){return EN?s.en:s.es}
function list(){
  var q=$('#su-q').value.trim().toLowerCase().replace(/^\*/,'');
  var r=D.E.map(function(e,i){return [e,i]}).filter(function(p){var e=p[0];
    if(lvlF&&!e.rec.some(function(x){return x[0]===lvlF}))return false;
    if(!q)return true;
    return e.rec.some(function(x){return x[1].replace('*','').toLowerCase().indexOf(q)>=0})||e.senses.some(function(s){return (s.en+' '+s.es).toLowerCase().indexOf(q)>=0})});
  $('#su-count').textContent=T.n(r.length,D.E.length);
  $('#su-res').innerHTML=r.length?r.map(function(p){var e=p[0];return '<li><button type="button" data-i="'+p[1]+'" aria-current="'+(p[1]===sel)+'"><span class="f">'+esc(star(e.k.split(' ')[0]))+'</span><span class="g">‘'+esc(e.senses.map(gl).join('’, ‘'))+'’ · '+esc(e.rec.map(function(x){return x[0]}).filter(function(v,i,a){return a.indexOf(v)===i}).join(', '))+'</span></button></li>'}).join(''):'<li class="empty" style="padding:10px">'+T.none+'</li>';
  $$('#su-res button').forEach(function(b){b.addEventListener('click',function(){sel=+b.dataset.i;list();entry()})});
}
function entry(){
  var e=D.E[sel];
  var head=e.rec.filter(function(x){return x[0]==='PN'})[0]||e.rec[e.rec.length-1];
  var html='<p><span class="proto">'+esc(star(head[1]))+'</span><span class="lvl">'+esc(head[0])+'</span></p><div class="pos">‘'+esc(e.senses.map(gl).join('’, ‘'))+'’</div>';
  html+='<h3>'+T.chain+'</h3><div class="tscroll"><table><tbody>'+e.rec.map(function(x){return '<tr><td class="lab" style="white-space:nowrap">'+esc(x[0])+'</td><td class="lab" style="color:var(--muted)">'+esc(D.LV[x[0]]||'')+'</td><td class="f">'+esc(star(x[1]))+'</td></tr>'}).join('')+'</tbody></table></div>';
  e.senses.forEach(function(s){
    var by={},locs={};s.refl.forEach(function(r){var g=r[2]||T.noregion;(by[g]=by[g]||[]).push(r);locs[r[0]]=1});
    html+='<h3>'+T.refl+' · ‘'+esc(gl(s))+'’ <span style="text-transform:none;letter-spacing:0;color:var(--muted);font-weight:400">('+T.concept+' '+esc(s.c)+')</span></h3>'+
      '<p class="datanote">'+T.count(s.refl.length,Object.keys(locs).length)+' · <a href="'+ROOT+(EN?'en/nawalex/map/':'nawalex/mapa/')+'#c'+esc(s.c)+'">'+T.map+' →</a></p>'+
      '<div class="tscroll"><table><thead><tr><th>'+T.loc+'</th><th>'+T.form+'</th><th>'+T.code+'</th></tr></thead><tbody>'+
      Object.keys(by).sort().map(function(g){return '<tr class="grp"><td colspan="3">'+esc(g)+' · '+by[g].length+'</td></tr>'+by[g].map(function(r){return '<tr><td>'+esc(r[0])+' <span class="lab" style="color:var(--muted)">'+esc(r[1])+'</span></td><td class="f">'+esc(r[3])+'</td><td class="lab">'+esc(r[4])+'</td></tr>'}).join('')}).join('')+'</tbody></table></div>';
  });
  html+='<h3>'+T.other+'</h3><p class="empty">'+T.otherTxt+'</p>';
  html+='<h3>'+T.cite+'</h3><div class="cite"><span>'+T.author+'. '+T.year+'. «'+esc(star(head[1]))+' ‘'+esc(e.senses.map(gl).join(', '))+'’». <i>SUAEtym</i>. https://sualex.org/suaetym/</span><button type="button" class="copy">'+T.copy+'</button></div>';
  $('#su-entry').innerHTML=html;
  var b=$('#su-entry .copy');b.addEventListener('click',function(){var t=b.previousElementSibling.textContent;try{navigator.clipboard.writeText(t).then(function(){b.textContent=T.copied},function(){})}catch(err){}});
}
function start(){
  var lv=[];D.E.forEach(function(e){e.rec.forEach(function(x){if(lv.indexOf(x[0])<0)lv.push(x[0])})});
  var ORDER=['PSUA','PCN','PPN','PN','PEN','PWN'];lv.sort(function(a,b){return ORDER.indexOf(a)-ORDER.indexOf(b)});
  $('#su-lvl').innerHTML='<option value="">'+(EN?'All levels':'Todos los niveles')+'</option>'+lv.map(function(l){return '<option value="'+l+'">'+l+' · '+esc(D.LV[l]||'')+'</option>'}).join('');
  $('#su-lvl').addEventListener('change',function(){lvlF=this.value;list()});
  $('#su-q').addEventListener('input',list);
  list();entry();
}
fetch(document.getElementById('su').dataset.src).then(function(r){return r.json()}).then(function(d){D=d;start()}).catch(function(){$('#su-err').hidden=false});
})();
