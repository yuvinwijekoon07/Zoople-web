(function(){
  var nav=document.getElementById('nav'), burger=document.getElementById('burger'), menu=document.getElementById('menu');
  var links=[].slice.call(document.querySelectorAll('#links a.link')), pill=document.getElementById('pill');
  var wide=function(){return window.matchMedia('(min-width:1181px)').matches};
 
  /* sliding hover pill */
  function movePill(el){
    if(!wide()||!el){pill.style.opacity=0;return}
    var li=el.parentElement;
    pill.style.opacity=1;pill.style.width=li.offsetWidth+'px';pill.style.transform='translateX('+li.offsetLeft+'px)';
  }
  links.forEach(function(a){a.addEventListener('mouseenter',function(){movePill(a)});a.addEventListener('focus',function(){movePill(a)})});
  document.getElementById('links').addEventListener('mouseleave',function(){pill.style.opacity=0});
 
  /* mobile menu */
  function setMenu(o){burger.setAttribute('aria-expanded',o);menu.classList.toggle('open',o)}
  burger.addEventListener('click',function(){setMenu(burger.getAttribute('aria-expanded')!=='true')});
  links.forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
 
  /* language dropdown + translated labels */
  var lang=document.getElementById('lang'), lb=document.getElementById('langBtn');
  var T={
    en:{home:'Home',map:'Map',quests:'Quests',rewards:'Rewards',leaderboard:'Leaderboard',animals:'Animals',signup:'Sign Up'},
    si:{home:'මුල් පිටුව',map:'සිතියම',quests:'අභියෝග',rewards:'ත්‍යාග',leaderboard:'ප්‍රමුඛ ලැයිස්තුව',animals:'සතුන්',signup:'ලියාපදිංචි වන්න'},
    ta:{home:'முகப்பு',map:'வரைபடம்',quests:'சவால்கள்',rewards:'பரிசுகள்',leaderboard:'தரவரிசை',animals:'விலங்குகள்',signup:'பதிவு செய்'}
  };
  function setLang(l,s){
    document.documentElement.lang=l;
    document.querySelectorAll('[data-k]').forEach(function(e){e.textContent=T[l][e.dataset.k]});
    document.getElementById('langLabel').textContent=s;
    lang.querySelectorAll('li button').forEach(function(b){b.setAttribute('aria-checked',b.dataset.l===l)});
    lang.classList.remove('open');lb.setAttribute('aria-expanded',false);movePill(null);
  }
  lb.addEventListener('click',function(e){e.stopPropagation();var o=!lang.classList.contains('open');lang.classList.toggle('open',o);lb.setAttribute('aria-expanded',o)});
  lang.querySelectorAll('li button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l,b.dataset.s)})});
  document.addEventListener('click',function(){lang.classList.remove('open');lb.setAttribute('aria-expanded',false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){setMenu(false);lang.classList.remove('open')}});
 
  /* shrink on scroll */
  function onScroll(){nav.classList.toggle('scrolled',window.scrollY>20)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
 
  /* scrollspy: highlights the link whose section is on screen */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(en){if(en.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})});
  },{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){io.observe(s)});
 
  /* dotted hills */
  var cv=document.getElementById('hills'),cx=cv.getContext('2d'),W,H,pts=[],t=0,root=document.documentElement;
  var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){
    var d=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;
    cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);pts=[];
    var step=Math.max(9,W/150);
    for(var l=0;l<5;l++)for(var x=0;x<W;x+=step)for(var k=0;k<3;k++)
      pts.push({x:x+Math.random()*step,l:l,off:Math.random()*40,ph:Math.random()*6.28,r:Math.random()*1.4+.5});
  }
  function crest(x,l){return H*(.28+l*.15)+Math.sin(x/(190+l*60)+l*1.7+t)*34+Math.sin(x/90+l*3+t*1.6)*9}
  function draw(){
    var dot=getComputedStyle(root).getPropertyValue('--dot').trim();
    cx.clearRect(0,0,W,H);
    pts.forEach(function(p){
      cx.fillStyle='rgba('+dot+','+(0.16+p.l*.08)+')';
      cx.beginPath();cx.arc(p.x,crest(p.x,p.l)+p.off+Math.sin(t*2+p.ph)*1.5,p.r,0,6.283);cx.fill();
    });
    if(!reduce){t+=.004;requestAnimationFrame(draw)}
  }
  size();draw();
  window.addEventListener('resize',function(){size();if(reduce)draw();movePill(null)});
})();