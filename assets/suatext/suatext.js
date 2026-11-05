/* SUAText example page. Texts and lines come from data.json, built from the SUALEX-Data CLDF
   (Preuss's Mexicanero texts from San Pedro Jícora). */
(function(){
var EN=document.documentElement.lang==='en';
var T=EN?{
  of:function(a,b){return a+' of '+b+' texts'}, all:'All', none:'No text matches. Remove a filter.',
  lang:'Language', place:'Place', type:'Tale type / motif', narr:'Narrator', coll:'Collector', year:'Year', nb:'Notebook', src:'Source', lines:'Lines', id:'ID',
  summary:'Summary (English)', unassigned:'not assigned yet', unknown:'not recorded', verify:'(to be verified)',
  section:'Section', note:'Note', seen:function(n){return n===1?'Only here in the corpus.':'Appears '+n+' times in the corpus.'},
  open:'Show all occurrences', occ:'Occurrences', close:'Close', original:'Original', abbr:'Gloss abbreviations',
  filterHint:'The values in red filter the list.'
}:{
  of:function(a,b){return a+' de '+b+' textos'}, all:'Todos', none:'Ningún texto coincide. Quite algún filtro.',
  lang:'Lengua', place:'Lugar', type:'Tipo de cuento / motivo', narr:'Narrador', coll:'Recopilador', year:'Año', nb:'Cuaderno', src:'Fuente', lines:'Líneas', id:'ID',
  summary:'Resumen (en inglés)', unassigned:'sin asignar todavía', unknown:'sin registro', verify:'(por verificar)',
  section:'Sección', note:'Nota', seen:function(n){return n===1?'Solo aparece aquí en el corpus.':'Aparece '+n+' veces en el corpus.'},
  open:'Ver todas las apariciones', occ:'Apariciones', close:'Cerrar', original:'Original', abbr:'Abreviaturas de las glosas',
  filterHint:'Los datos en rojo filtran la lista.'
};
var SRC='Preuss, Konrad Theodor. 1968. Nahua-Texte aus San Pedro Jícora in Durango. Ed. Elsa Ziehm. Berlin: Ibero-Amerikanisches Institut';
var LANG=EN?'Mexicanero (Nahuatl of Durango)':'Mexicano (náhuatl de Durango)', PLACE='San Pedro Jícora, Durango', COLL='Konrad Theodor Preuss', YEAR=1907;
var $=function(s){return document.querySelector(s)}, $$=function(s){return [].slice.call(document.querySelectorAll(s))};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var D, sel=0, tl=EN?6:5, par=false;
var KEYS=['lang','place','type','narr','coll'];
function meta(t){return {lang:LANG,place:PLACE,type:t.atu||t.bz||T.unassigned,narr:t.narr||T.unknown,coll:COLL}}
function title(t){return t.orig||(EN?t.en:t.es)||t.de||t.id}
function glossHTML(g){var A=D.A;return esc(g).split(/([-.=\s])/).map(function(p){return /^[A-Z0-9]+$/.test(p)&&(A[p]||/^[123]$/.test(p)||/^[123](SG|PL)$/.test(p))?'<abbr class="sc" title="'+esc(A[p]||'')+'">'+p.toLowerCase()+'</abbr>':p}).join('')}
// concordance of analysed words across the corpus
var CONC={};
function buildConc(){D.T.forEach(function(t,ti){t.lines.forEach(function(l){l[3].forEach(function(w){var k=w.replace(/[^\p{L}\p{M}-]/gu,'').toLowerCase();if(!k)return;(CONC[k]=CONC[k]||[]).push([ti,l[0]])})})})}
function fill(){
  KEYS.forEach(function(k){var el=$('#tx-f-'+k);var vals=D.T.map(function(t){return meta(t)[k]}).filter(function(v,i,a){return a.indexOf(v)===i}).sort();
    el.innerHTML='<option value="">'+T.all+'</option>'+vals.map(function(v){return '<option>'+esc(v)+'</option>'}).join('')});
}
function list(){
  var q=$('#tx-q').value.trim().toLowerCase(), y0=+$('#tx-f-y0').value||0, y1=+$('#tx-f-y1').value||9999;
  var r=D.T.map(function(t,i){return [t,i]}).filter(function(p){var t=p[0],m=meta(t);
    if(!KEYS.every(function(k){var v=$('#tx-f-'+k).value;return !v||m[k]===v}))return false;
    if(YEAR<y0||YEAR>y1)return false;
    if(!q)return true;
    return (title(t)+' '+t.de+' '+t.desc).toLowerCase().indexOf(q)>=0||t.lines.some(function(l){return (l[2]+' '+l[3].join(' ')+' '+l[4].join(' ')+' '+l[tl]).toLowerCase().indexOf(q)>=0})});
  $('#tx-count').textContent=T.of(r.length,D.T.length);
  $('#tx-list').innerHTML=r.map(function(p){var t=p[0];return '<li class="'+(p[1]===sel?'on':'')+'"><button type="button" data-i="'+p[1]+'"><b>'+esc(title(t))+'</b><span>'+esc(LANG)+' · '+YEAR+' · '+t.lines.length+' '+T.lines.toLowerCase()+'</span></button></li>'}).join('')||'<li><span>'+T.none+'</span></li>';
  $$('#tx-list button').forEach(function(b){b.addEventListener('click',function(){sel=+b.dataset.i;list();head();units()})});
}
function fl(k,v){return '<a href="#" class="fl" data-k="'+k+'" data-v="'+esc(v)+'">'+esc(v)+'</a>'}
function head(){
  var t=D.T[sel],m=meta(t);
  $('#tx-head').innerHTML='<h2>'+esc(title(t))+'</h2>'+(t.de&&t.de!==title(t)?'<p style="margin:4px 0 0;color:var(--muted);font-size:16px">'+esc(t.de)+' <span class="lab">(Preuss)</span></p>':'')+
  '<dl class="meta" style="margin-top:12px"><dt>'+T.lang+'</dt><dd>'+fl('lang',m.lang)+'</dd><dt>'+T.place+'</dt><dd>'+fl('place',m.place)+'</dd><dt>'+T.type+'</dt><dd>'+fl('type',m.type)+'</dd><dt>'+T.narr+'</dt><dd>'+fl('narr',m.narr)+'</dd><dt>'+T.coll+'</dt><dd>'+fl('coll',m.coll)+'</dd><dt>'+T.year+'</dt><dd>'+YEAR+' '+T.verify+'</dd><dt>'+T.src+'</dt><dd>'+esc(SRC)+(t.pages?', pp. '+esc(t.pages):'')+'</dd><dt>'+T.lines+'</dt><dd>'+t.lines.length+'</dd><dt>'+T.id+'</dt><dd>'+esc(t.id)+'</dd></dl>'+
  (t.desc?'<details style="margin-top:10px"><summary class="lab" style="cursor:pointer;color:var(--clay)">'+T.summary+'</summary><p style="margin:6px 0 0">'+esc(t.desc)+'</p></details>':'')+
  '<p class="datanote" style="margin-top:6px">'+T.filterHint+'</p>';
  $$('#tx-head a.fl').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();$('#tx-f-'+a.dataset.k).value=a.dataset.v;list()})});
}
function units(){
  var t=D.T[sel],sec='';
  $('#tx-units').innerHTML=t.lines.map(function(l){var h='';if(l[1]&&l[1]!==sec){sec=l[1];h='<p class="lab" style="margin:16px 0 0;font-size:14px;letter-spacing:.1em;text-transform:uppercase;color:var(--clay)">'+T.section+' '+esc(sec)+'</p>'}
    return h+'<div class="unit"><span class="n">'+l[0]+'</span><div><div class="oline o">'+esc(l[2])+'</div><div class="igt">'+l[3].map(function(w,i){return '<button type="button" class="w" data-w="'+esc(w)+'" data-g="'+esc(l[4][i]||'')+'"><span class="m">'+esc(w)+'</span><span class="gl">'+glossHTML(l[4][i]||'')+'</span></button>'}).join('')+'</div><div class="ft">‘'+esc(l[tl])+'’</div>'+(l[8]?'<div class="nt lab">'+T.note+': '+esc(l[8])+'</div>':'')+'<div class="popwrap"></div></div></div>'}).join('');
  $$('#tx-units .w').forEach(function(b){b.addEventListener('click',function(){
    $$('#tx-units .popwrap').forEach(function(p){p.innerHTML=''});
    var k=b.dataset.w.replace(/[^\p{L}\p{M}-]/gu,'').toLowerCase(), occ=CONC[k]||[];
    var pw=b.closest('.unit').querySelector('.popwrap');
    pw.innerHTML='<div class="pop"><b>'+esc(b.dataset.w)+'</b> · '+glossHTML(b.dataset.g)+' · '+T.seen(occ.length)+(occ.length>1?' <button type="button" class="chip occ">'+T.open+'</button>':'')+'</div>';
    var ob=pw.querySelector('.occ'); if(ob)ob.addEventListener('click',function(){
      pw.querySelector('.pop').innerHTML+='<ul style="margin:8px 0 0;padding-left:1.2em">'+occ.slice(0,30).map(function(o){var tt=D.T[o[0]],ln=tt.lines.filter(function(x){return x[0]===o[1]})[0];return '<li>'+esc(tt.id)+' · '+o[1]+': <i>'+esc(ln[2])+'</i></li>'}).join('')+'</ul>';ob.remove()});
  })});
  $('#tx-par').innerHTML='<div class="par parh"><span></span><span>'+T.original+'</span><span>'+esc($('#tx-tl').selectedOptions[0].textContent)+'</span></div>'+t.lines.map(function(l){return '<div class="par"><span class="n">'+l[0]+'</span><span class="po">'+esc(l[2])+'</span><span class="pt">'+esc(l[tl])+'</span></div>'}).join('');
}
function mode(p){par=p;$('#tx-m1').setAttribute('aria-pressed',!p);$('#tx-m2').setAttribute('aria-pressed',p);$('#tx-units').hidden=p;$('#tx-par').hidden=!p;$('#tx-tiers').hidden=p}
function start(){
  buildConc();fill();list();head();units();
  $$('#tx-filt select, #tx-filt input').forEach(function(el){el.addEventListener('input',list)});
  $('#tx-filt').addEventListener('submit',function(e){e.preventDefault()});
  $('#tx-q').addEventListener('input',list);
  $('#tx-tl').addEventListener('change',function(){tl=+this.value;units()});
  $('#tx-m1').addEventListener('click',function(){mode(false)});$('#tx-m2').addEventListener('click',function(){mode(true)});
  $$('#tx-tiers .chip').forEach(function(b){b.addEventListener('click',function(){var on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);$('#tx-reader').classList.toggle('hide-'+b.dataset.tier,!on)})});
  $('#tx-abbr').innerHTML=Object.keys(D.A).map(function(k){return '<span><abbr class="sc">'+esc(k.toLowerCase())+'</abbr> '+esc(D.A[k])+'</span>'}).join(' · ');
}
fetch(document.getElementById('tx').dataset.src).then(function(r){return r.json()}).then(function(d){D=d;start()}).catch(function(){$('#tx-err').hidden=false});
})();
