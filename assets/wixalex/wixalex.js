/* WixaLex example page. All entries below are invented placeholders that show the layout;
   no Wixárika dictionary data has been added yet. */
(function(){
var EN=document.documentElement.lang==='en';
var T=EN?{
  entries:function(n){return n+(n===1?' entry':' entries')}, all:'All', ex:'Invented example',
  trans:'Translations', etym:'Etymology', from:'from', see:'see in SUAEtym →', noet:'No etymology recorded yet.',
  exs:'Examples from texts', line:'line', rel:'Related words', srcdata:'Source and data', source:'Source', variety:'Variety', id:'ID',
  cite:'Cite this entry', copy:'Copy', copied:'Copied', page:'page 1 of 1 (sample)', prev:'← Previous page', next:'Next page →',
  click:'Click a word to open the full entry', none:'No entries match. Try another word or letter.',
  pos:{n:'noun',v:'verb',adv:'adverb',num:'numeral',post:'postposition'}, abbr:{n:'n.',v:'v.',adv:'adv.',num:'num.',post:'postp.'},
  community:'‹community›', author:'‹Author(s)›', year:'‹Year›'
}:{
  entries:function(n){return n+(n===1?' entrada':' entradas')}, all:'Todas', ex:'Ejemplo inventado',
  trans:'Traducciones', etym:'Etimología', from:'de', see:'ver en SUAEtym →', noet:'Sin etimología registrada todavía.',
  exs:'Ejemplos de textos', line:'línea', rel:'Palabras relacionadas', srcdata:'Fuente y datos', source:'Fuente', variety:'Variante', id:'ID',
  cite:'Citar esta entrada', copy:'Copiar', copied:'Copiado', page:'página 1 de 1 (muestra)', prev:'← Página anterior', next:'Página siguiente →',
  click:'Haga clic en una palabra para abrir la entrada completa', none:'Ninguna entrada coincide. Pruebe con otra palabra o letra.',
  pos:{n:'sustantivo',v:'verbo',adv:'adverbio',num:'numeral',post:'posposición'}, abbr:{n:'s.',v:'v.',adv:'adv.',num:'num.',post:'posp.'},
  community:'‹comunidad›', author:'‹Autor(es)›', year:'‹Año›'
};
// [headword, phonetic, pos, lexical info [[es,en,value]], senses [[es,en]], etymology [proto, gloss es, gloss en, level] or null,
//  examples [[sentence, es, en, text title, line]], source, id, related]
var G=function(n){return ['‹glosa '+n+'›','‹gloss '+n+'›']};
var X=function(t,l){return ['‹oración de ejemplo›','‘‹traducción al español›’','‘‹English translation›’','‹Título del texto '+t+'›',l]};
var WX=[
 ['hakɨri','[ˈhakɨɾi]','n',[['Clase','Class','‹inanimado / inanimate›'],['Plural','Plural','‹plural›'],['Raíz','Root','‹raíz / root›']],[G(1),G(2)],['*‹protoforma›','‹glosa›','‹gloss›','PYAS'],[X(2,14),X(5,3)],'‹Diccionario A›, p. 00','wix-0001',['hakɨ']],
 ['hakɨ','[ˈhakɨ]','v',[['Clase','Class','‹intransitivo / intransitive›']],[G(1)],null,[X(2,7)],'‹Diccionario A›','wix-0002',['hakɨri']],
 ['hamuri','','n',[],[G(1)],['*‹protoforma›','‹glosa›','‹gloss›','PYA'],[X(5,1)],'‹Diccionario B›','wix-0003',[]],
 ['hapani','','adv',[],[G(1)],null,[X(2,22)],'‹Diccionario A›','wix-0004',[]],
 ['hetsie','','post',[],[G(1)],null,[X(5,6)],'‹Diccionario B›','wix-0005',[]],
 ['hiwa','','v',[],[G(1),G(2)],['*‹protoforma›','‹glosa›','‹gloss›','PYAS'],[X(2,2)],'‹Diccionario A›','wix-0006',[]],
 ['huta','','num',[],[G(1)],['*‹protoforma›','‹glosa›','‹gloss›','PYA'],[X(5,8)],'‹Diccionario A›','wix-0007',[]],
 ['kɨye','[ˈkɨje]','n',[['Plural','Plural','‹plural›']],[G(1)],['*‹protoforma›','‹glosa›','‹gloss›','PYA'],[X(2,11)],'‹Diccionario B›','wix-0008',[]],
 ['kwie','','n',[],[G(1)],null,[X(5,4)],'‹Diccionario B›','wix-0009',[]],
 ['mɨtiwe','[mɨˈtiwe]','v',[],[G(1)],null,[X(2,19)],'‹Diccionario B›','wix-0010',[]],
 ['tsitɨa','[t͡siˈtɨa]','v',[],[G(1)],null,[X(2,5)],'‹Diccionario A›','wix-0011',[]],
 ['xetɨari','[ʃeˈtɨaɾi]','n',[],[G(1)],null,[X(5,2)],'‹Diccionario A›','wix-0012',[]],
 ['ʼuyeme','[ʔuˈjeme]','n',[],[G(1)],null,[X(2,9)],'‹Diccionario B›','wix-0013',[]]
].map(function(a){return {f:a[0],ph:a[1],pos:a[2],lex:a[3],s:a[4],et:a[5],ex:a[6],src:a[7],id:a[8],rel:a[9]}});
var ABC=['a','e','h','i','ɨ','k','kw','m','n','p','r','t','ts','u','w','x','y','ʼ'];
var $=function(s){return document.querySelector(s)}, $$=function(s){return [].slice.call(document.querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var sel=0, letter='', dir=0;
var tag='<span class="tag">'+T.ex+'</span>';
var ROOT=document.getElementById('wx').dataset.root;
function starts(f,l){if(!l)return true;if(l==='k')return f.indexOf('k')===0&&f.indexOf('kw')!==0;if(l==='t')return f.indexOf('t')===0&&f.indexOf('ts')!==0;return f.indexOf(l)===0}
function filtered(){
  var q=$('#wx-q').value.trim().toLowerCase();
  return WX.map(function(e,i){return [e,i]}).filter(function(p){var e=p[0];
    if(!starts(e.f,letter))return false; if(!q)return true;
    var inW=e.f.indexOf(q)>=0, inG=e.s.some(function(s){return (s[0]+' '+s[1]).toLowerCase().indexOf(q)>=0});
    return dir===0?(inW||inG):(inG||inW)});
}
function list(){
  var r=filtered();
  $('#wx-count').textContent=T.entries(r.length);
  $('#wx-res').innerHTML=r.length?r.map(function(p){var e=p[0];return '<li><button type="button" data-i="'+p[1]+'" aria-current="'+(p[1]===sel)+'"><span class="f">'+esc(e.f)+'</span><span class="g">'+esc(T.pos[e.pos])+' · '+esc(e.s[0][EN?1:0])+'</span></button></li>'}).join(''):'<li class="empty" style="padding:10px">'+esc(T.none)+'</li>';
  $$('#wx-res button').forEach(function(b){b.addEventListener('click',function(){sel=+b.dataset.i;list();entry()})});
}
function entry(){
  var e=WX[sel];
  $('#wx-entry').innerHTML='<p class="hw">'+esc(e.f)+(e.ph?'<span class="ph">'+esc(e.ph)+'</span>':'')+' '+tag+'</p>'+
  '<div class="lexinfo"><span><b>'+esc(T.pos[e.pos])+'</b></span>'+e.lex.map(function(l){return '<span>'+esc(l[EN?1:0])+': <b>'+esc(l[2])+'</b></span>'}).join('')+'</div>'+
  '<h3>'+T.trans+'</h3><ol class="senses">'+e.s.map(function(s){return '<li><div class="tr2"><span class="l">es</span><span>'+esc(s[0])+'</span><span class="l">en</span><span>'+esc(s[1])+'</span></div></li>'}).join('')+'</ol>'+
  '<h3>'+T.etym+'</h3>'+(e.et?'<div class="etl"><span class="lab" style="color:var(--muted)">'+T.from+'</span><a href="'+ROOT+(EN?'en/':'')+'suaetym/">'+esc(e.et[0])+'</a><span>‘'+esc(e.et[EN?2:1])+'’</span><span class="lab" style="color:var(--muted)">'+esc(e.et[3])+' · '+T.see+'</span></div>':'<p class="empty">'+T.noet+'</p>')+
  '<h3>'+T.exs+'</h3><ul class="exs">'+e.ex.map(function(x){return '<li><div class="o">'+esc(x[0])+'</div><div class="es">'+esc(x[1])+'</div><div class="en">'+esc(x[2])+'</div><div class="src"><a href="'+ROOT+(EN?'en/':'')+'suatext/">SUAText · '+esc(x[3])+', '+T.line+' '+x[4]+'</a></div></li>'}).join('')+'</ul>'+
  (e.rel.length?'<h3>'+T.rel+'</h3><div class="xlinks">'+e.rel.map(function(r){var i=WX.findIndex(function(w){return w.f===r});return '<a href="#" data-i="'+i+'">'+esc(r)+'</a>'}).join('')+'</div>':'')+
  '<h3>'+T.srcdata+'</h3><dl class="meta"><dt>'+T.source+'</dt><dd>'+esc(e.src)+'</dd><dt>'+T.variety+'</dt><dd>'+T.community+'</dd><dt>'+T.id+'</dt><dd>'+esc(e.id)+'</dd></dl>'+
  '<h3>'+T.cite+'</h3><div class="cite"><span>'+T.author+'. '+T.year+'. «'+esc(e.f)+'». <i>WixaLex</i>. https://sualex.org/wixalex/'+esc(e.id)+'</span><button type="button" class="copy">'+T.copy+'</button></div>';
  $$('#wx-entry .xlinks a').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();sel=+a.dataset.i;list();entry()})});
  var b=$('#wx-entry .copy');b.addEventListener('click',function(){var t=b.previousElementSibling.textContent;try{navigator.clipboard.writeText(t).then(function(){b.textContent=T.copied},function(){})}catch(err){}});
}
function book(){
  var l=WX.map(function(e,i){return [e,i]}).filter(function(p){return starts(p[0].f,letter)});
  var html='',cur='';
  l.forEach(function(p){var e=p[0],L=ABC.filter(function(a){return starts(e.f,a)})[0]||e.f.charAt(0);
    if(L!==cur){cur=L;html+='<p class="bletter">'+esc(L.toUpperCase())+'</p>'}
    html+='<p><button type="button" class="bh" data-i="'+p[1]+'">'+esc(e.f)+'</button> <span class="bp">'+esc(T.abbr[e.pos])+'</span> '+e.s.map(function(s,k){return (e.s.length>1?'<b>'+(k+1)+'.</b> ':'')+esc(s[EN?1:0])+'; <span class="ben">'+esc(s[EN?0:1])+'</span>'}).join(' ')+' · <i>'+esc(e.ex[0][0])+'</i> '+esc(e.ex[0][EN?2:1])+(e.et?' <span class="bet">← '+esc(e.et[0])+'</span>':'')+'</p>'});
  $('#wx-book').innerHTML='<div class="book"><div class="rh"><span>'+esc(l.length?l[0][0].f:'')+'</span><span class="pg">'+T.page+'</span><span>'+esc(l.length?l[l.length-1][0].f:'')+'</span></div><div class="bcols">'+(html||'<p class="empty">'+esc(T.none)+'</p>')+'</div></div><div class="bnav"><button type="button" disabled>'+T.prev+'</button><span class="lab" style="color:var(--muted)">'+T.click+'</span><button type="button" disabled>'+T.next+'</button></div>';
  $$('#wx-book .bh').forEach(function(b){b.addEventListener('click',function(){sel=+b.dataset.i;mode(false);list();entry()})});
}
function mode(isBook){$('#wx-t1').setAttribute('aria-pressed',!isBook);$('#wx-t2').setAttribute('aria-pressed',isBook);$('#wx-search').hidden=isBook;$('#wx-book').hidden=!isBook;$('#wx-sbar').hidden=isBook;if(isBook)book()}
$('#wx-abc').innerHTML='<button type="button" data-l="" aria-pressed="true">'+T.all+'</button>'+ABC.map(function(l){return '<button type="button" data-l="'+l+'" aria-pressed="false">'+l+'</button>'}).join('');
$$('#wx-abc button').forEach(function(b){b.addEventListener('click',function(){letter=b.dataset.l;$$('#wx-abc button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});list();book()})});
$('#wx-q').addEventListener('input',list);
['#wx-d1','#wx-d2'].forEach(function(id,i){$(id).addEventListener('click',function(){dir=i;$('#wx-d1').setAttribute('aria-pressed',i===0);$('#wx-d2').setAttribute('aria-pressed',i===1);list()})});
$('#wx-t1').addEventListener('click',function(){mode(false)});$('#wx-t2').addEventListener('click',function(){mode(true)});
list();entry();
})();
