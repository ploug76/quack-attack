let round=1,ducks=[],duckNo=0,hits=[],shots=3,phase='',phT=0,cross={x:-99,y:-99,f:0},feathers=[],buck={y:0,mode:'',t:0},GY=0,pops=[],perfect=0;
const TYPES=[{c:'#3c9c3c',h:'#2a6a2a',pts:500,sp:1},{c:'#3c6cd8',h:'#24448c',pts:1000,sp:1.25},{c:'#b8542c',h:'#7a3218',pts:1500,sp:1.5}];
function onResize(){GY=H*.74}
function quota(){return Math.min(10,6+Math.floor((round-1)/2))}
function startGame(lv){score=0;round=lv;state='play';startRound();ui()}
function startRound(){hits=[];duckNo=0;phase='intro';phT=0;SND.jingle()}
function launch(){const r=R(),ty=TYPES[r<.55?0:r<.85?1:2],sp=(2.1+.22*round)*ty.sp*S;const a=-Math.PI/2+(R()-.5)*1.4;
 ducks=[{x:W*(.2+R()*.6),y:GY+10*S,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,sp,ty,st:'fly',turn:50+R()*40,fl:0}];shots=3;phase='duck';phT=0;SND.quack()}
function shoot(x,y){if(state!='play'||phase!='duck'||shots<=0)return;shots--;cross={x,y,f:12};SND.shot();
 for(const d of ducks){if(d.st=='fly'&&Math.hypot(d.x-x,d.y-y)<44*S){d.st='hit';d.ht=0;buck.c=d.ty.c;const p=Math.round(d.ty.pts*(1+.1*(round-1))/10)*10;score+=p;saveBest();pops.push({s:'+'+p,x:d.x,y:d.y-30*S,t:0});hits.push(1);
  for(let i=0;i<10;i++)feathers.push({x:d.x,y:d.y,vx:(R()-.5)*4*S,vy:(R()-.8)*3*S,l:60,c:d.ty.c});phase='fall';phT=0;SND.hit();return}}
 if(shots<=0){phase='away';phT=0;for(const d of ducks)d.st='away';say('FLEW AWAY!',60);hits.push(0);SND.away()}}
function update(){for(const f of feathers){f.x+=f.vx;f.y+=f.vy;f.vy+=.05*S;f.vx*=.98;f.l--}feathers=feathers.filter(f=>f.l>0);for(const p of pops)p.t++;pops=pops.filter(p=>p.t<50);if(cross.f>0)cross.f--;
 if(state!='play')return;phT++;
 if(phase=='intro'){if(phT>100)launch();return}
 for(const d of ducks){d.fl+=d.st=='away'?.5:.35;
  if(d.st=='fly'){d.x+=d.vx;d.y+=d.vy;if(--d.turn<=0){const a=Math.atan2(d.vy,d.vx)+(R()-.5)*2;d.vx=Math.cos(a)*d.sp;d.vy=Math.sin(a)*d.sp;d.turn=40+R()*60}
   if(d.x<30*S&&d.vx<0||d.x>W-30*S&&d.vx>0)d.vx*=-1;if(d.y<H*.1&&d.vy<0)d.vy=Math.abs(d.vy);if(d.y>GY-50*S&&d.vy>0&&phT>40)d.vy=-Math.abs(d.vy);if(t%40==0&&R()<.4)SND.quack()}
  else if(d.st=='hit'){d.ht++;if(d.ht>30){d.y+=Math.min(12*S,(d.ht-30)*.6*S)}}
  else if(d.st=='away'){d.y-=d.sp*1.6;d.x+=d.vx*.3}}
 if(phase=='duck'&&phT>Math.max(240,430-18*round)){phase='away';phT=0;for(const d of ducks)d.st='away';say('FLEW AWAY!',60);hits.push(0);SND.away()}
 if(phase=='fall'&&ducks.every(d=>d.y>GY+20*S)){phase='buck';phT=0;buck.mode='hold';SND.thud()}
 if(phase=='away'&&ducks.every(d=>d.y<-60*S)){phase='buck';phT=0;buck.mode='laugh';SND.laugh()}
 if(phase=='buck'&&phT>90){duckNo++;ducks=[];if(duckNo>=10){phase='tally';phT=0;const n=hits.filter(h=>h).length;if(n>=quota()){if(n==10){score+=2000*round;say('PERFECT! +'+2000*round,140);SND.perfect()}else{say('ROUND CLEAR!',120);SND.jingle()}saveBest()}else{SND.over()}}else launch()}
 if(phase=='tally'&&phT>150){const n=hits.filter(h=>h).length;if(n>=quota()){round++;startRound()}else{state='over';overT=t;saveBest();ui()}}}
function duck(d){const s=S*1.5,dir=d.vx<0?-1:1;g.save();g.translate(d.x,d.y);
 if(d.st=='hit'&&d.ht>30){g.rotate(Math.PI/2*dir)}else if(d.st=='away'){}else g.scale(dir,1);
 if(d.st=='hit'&&d.ht<=30){g.scale(dir,1)}
 const w=Math.sin(d.fl)*(d.st=='hit'?0:1);
 g.fillStyle=d.ty.c;g.beginPath();g.ellipse(0,0,18*s,11*s,0,0,TAU);g.fill();g.fillStyle='#f0e0b0';g.beginPath();g.ellipse(2*s,4*s,11*s,6*s,0,0,TAU);g.fill();
 g.fillStyle=d.ty.h;g.beginPath();g.moveTo(-4*s,-2*s);g.lineTo(8*s,-2*s);g.lineTo(-2*s,-2*s-18*s*w);g.closePath();g.fill();
 g.fillStyle=d.ty.c;g.beginPath();g.arc(15*s,-9*s,8*s,0,TAU);g.fill();g.fillStyle='#fff';g.fillRect(9*s,-3*s,10*s,2*s);
 g.fillStyle='#f8b828';g.beginPath();g.moveTo(21*s,-10*s);g.lineTo(30*s,-7*s);g.lineTo(21*s,-5*s);g.fill();
 if(d.st=='hit'){g.strokeStyle='#000';g.lineWidth=1.5*s;g.beginPath();g.moveTo(15*s,-13*s);g.lineTo(19*s,-9*s);g.moveTo(19*s,-13*s);g.lineTo(15*s,-9*s);g.stroke()}else circ(17*s,-11*s,2*s,'#000');
 g.fillStyle=d.ty.h;g.beginPath();g.moveTo(-17*s,-3*s);g.lineTo(-25*s,-7*s);g.lineTo(-22*s,2*s);g.fill();g.restore()}
function beaver(x,y,mode){const s=S*1.3,sh=mode=='laugh'?Math.sin(t*.6)*3*s:0;g.save();g.translate(x+sh,y);
 g.fillStyle='#8c5a2c';g.beginPath();g.ellipse(0,20*s,22*s,26*s,0,0,TAU);g.fill();g.beginPath();g.arc(0,-8*s,18*s,0,TAU);g.fill();circ(-14*s,-22*s,6*s,'#6a3e1c');circ(14*s,-22*s,6*s,'#6a3e1c');
 g.fillStyle='#e8c89c';g.beginPath();g.ellipse(0,0,12*s,9*s,0,0,TAU);g.fill();circ(0,-6*s,4*s,'#2a1a0c');
 g.fillStyle='#fff';g.fillRect(-4*s,4*s,8*s,9*s);g.strokeStyle='#ccc';g.lineWidth=1*s;g.beginPath();g.moveTo(0,4*s);g.lineTo(0,13*s);g.stroke();
 if(mode=='laugh'){g.strokeStyle='#000';g.lineWidth=2*s;g.beginPath();g.arc(-7*s,-14*s,3*s,Math.PI,TAU);g.arc(7*s,-14*s,3*s,Math.PI,TAU);g.stroke()}else{circ(-7*s,-14*s,3*s,'#000');circ(7*s,-14*s,3*s,'#000');circ(-6*s,-15*s,1*s,'#fff');circ(8*s,-15*s,1*s,'#fff')}
 g.fillStyle='#8c5a2c';g.beginPath();g.ellipse(-20*s,mode=='hold'?-26*s:6*s,6*s,10*s,mode=='hold'?.3:0,0,TAU);g.fill();
 if(mode=='hold'){g.save();g.translate(-22*s,-40*s);g.rotate(Math.PI/2);g.fillStyle=buck.c||TYPES[0].c;g.beginPath();g.ellipse(0,0,16*s,9*s,0,0,TAU);g.fill();g.restore()}
 g.restore()}
function scene(){let gr=g.createLinearGradient(0,0,0,GY);gr.addColorStop(0,'#3c9cf0');gr.addColorStop(1,'#a8e0f8');g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let i=0;i<3;i++){const x=((i*W*.45+t*.2*S)%(W+200*S))-100*S,y=H*(.12+i*.1);g.fillStyle='#fff';[[0,0,24],[22,6,18],[-22,6,16]].forEach(([dx,dy,r])=>{g.beginPath();g.arc(x+dx*S,y+dy*S,r*S,0,TAU);g.fill()})}
 g.fillStyle='#6cc06c';g.beginPath();g.moveTo(0,GY);for(let x=0;x<=W;x+=20*S)g.lineTo(x,GY-40*S-Math.sin(x/(90*S))*24*S);g.lineTo(W,GY);g.fill();
 g.fillStyle='#7a4a24';g.fillRect(W*.08,GY-210*S,22*S,210*S);g.fillStyle='#3c8c3c';[[0,-230,60],[-40,-190,44],[40,-190,46],[0,-170,50]].forEach(([dx,dy,r])=>circ(W*.08+11*S+dx*S,GY+dy*S,r*S,'#3c8c3c'))}
function grass(){g.fillStyle='#4ca83c';g.fillRect(0,GY,W,H-GY);g.fillStyle='#3c8c2c';for(let x=0;x<W;x+=10*S){g.beginPath();g.moveTo(x,GY+4*S);g.lineTo(x+5*S,GY-18*S-((x/S)%7)*2*S);g.lineTo(x+10*S,GY+4*S);g.fill()}
 g.fillStyle='#c89c5c';g.fillRect(0,H-112*S,W,112*S);g.fillStyle='#2a1a0c';g.fillRect(0,H-112*S,W,4*S)}
function hud(){const y=H-100*S;txt(`ROUND ${round}`,14*S,y+12*S,16*S,'#fff','#2a1a0c','left');txt(`SCORE ${score}`,W-14*S,y+12*S,16*S,'#fff','#2a1a0c','right');
 txt('SHOT',14*S,y+44*S,13*S,'#2a1a0c',null,'left');for(let i=0;i<3;i++){g.fillStyle=i<shots?'#d82c2c':'rgba(0,0,0,.2)';rr(60*S+i*16*S,y+36*S,10*S,18*S,3*S);g.fill()}
 txt('HIT',120*S,y+44*S,13*S,'#2a1a0c',null,'left');for(let i=0;i<10;i++){const h=hits[i];const x=152*S+i*21*S;g.fillStyle=h===1?'#d82c2c':h===0?'#555':i==duckNo&&phase=='duck'&&t%30<15?'#fff':'#f8f0d8';g.beginPath();g.ellipse(x+8*S,y+44*S,8*S,6*S,0,0,TAU);g.fill()}
 const qx=152*S+quota()*21*S-3*S;g.fillStyle='#2a6cd8';g.fillRect(qx,y+32*S,3*S,26*S);txt(`QUOTA ${quota()}`,W/2,y+76*S,13*S,'#2a1a0c');txt(`BEST ${best}`,W-14*S,y+76*S,12*S,'#2a1a0c',null,'right')}
function draw(){scene();for(const d of ducks)duck(d);
 if(phase=='buck'){const k=Math.min(1,phT/20)*(phT>70?Math.max(0,1-(phT-70)/20):1);beaver(W/2,GY+40*S-k*120*S,buck.mode)}
 grass();for(const f of feathers){g.fillStyle=f.c;g.fillRect(f.x,f.y,4*S,2*S)}for(const p of pops)txt(p.s,p.x,p.y-p.t*S,16*S,'#fff','#000');
 if(state=='title'){duck({x:W*.65+Math.sin(t*.03)*60*S,y:H*.42+Math.sin(t*.05)*20*S,vx:Math.cos(t*.03),ty:TYPES[1],st:'fly',fl:t*.35});panel(H*.08,250*S,'#d8541c');txt('QUACK',W/2,H*.08+50*S,48*S,'#f8d838','#000');txt('ATTACK',W/2,H*.08+100*S,48*S,'#d8541c','#000');
  ['Tap a duck to shoot it','3 shots per duck · 10 ducks a round','Hit the quota to keep going!'].forEach((s,i)=>txt(s,W/2,H*.08+(146+i*24)*S,15*S,'#fff'));txt(`BEST ${best}`,W/2,H*.08+226*S,15*S,'#f8d838');
  beaver(W*.25,GY-30*S,'hold');if(t%60<40)txt('TAP TO START',W/2,H*.62,24*S,'#fff','#000');return}
 hud();
 if(phase=='intro')txt(`ROUND ${round}`,W/2,H*.35,40*S,'#fff','#000'),txt(`HIT ${quota()} OF 10`,W/2,H*.35+44*S,20*S,'#f8d838','#000');
 if(phase=='tally'){const n=hits.filter(h=>h).length;txt(`${n} / 10 HIT`,W/2,H*.35,34*S,'#fff','#000');txt(n>=quota()?'NICE SHOOTING!':'QUOTA MISSED…',W/2,H*.35+44*S,20*S,n>=quota()?'#f8d838':'#f86c6c','#000')}
 if(msgT>0&&phase!='tally')txt(msg,W/2,H*.3,26*S,'#fff','#000');else if(msgT>0)txt(msg,W/2,H*.3-50*S,24*S,'#f8d838','#000');
 if(cross.f>0){g.strokeStyle='#fff';g.lineWidth=3*S;g.beginPath();g.arc(cross.x,cross.y,20*S,0,TAU);g.moveTo(cross.x-30*S,cross.y);g.lineTo(cross.x+30*S,cross.y);g.moveTo(cross.x,cross.y-30*S);g.lineTo(cross.x,cross.y+30*S);g.stroke();g.fillStyle=`rgba(255,255,255,${cross.f/30})`;g.fillRect(0,0,W,H)}
 if(state=='over'){panel(H*.26,190*S,'#d8541c');txt('GAME OVER',W/2,H*.26+40*S,32*S,'#f86c6c');txt(`SCORE ${score}`,W/2,H*.26+82*S,20*S,'#fff');txt(`ROUND ${round} · BEST ${best}`,W/2,H*.26+112*S,15*S,'#f8d838');if(t-overT>45&&t%50<35)txt('TAP TO PLAY AGAIN',W/2,H*.26+154*S,16*S,'#fff')}}
c.addEventListener('pointerdown',e=>{A();if(paused)return;if(state=='title'||(state=='over'&&t-overT>45)){startGame(state=='title'?startLv:1);return}const r=c.getBoundingClientRect();shoot((e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height)});
addEventListener('keydown',e=>{if((e.key==' '||e.key=='Enter')&&(state=='title'||(state=='over'&&t-overT>45))){A();startGame(state=='title'?startLv:1)}});
const SND={shot:()=>{noise(.25,.5,1500);tone(90,0,.15,'square',.1,40)},quack:()=>{tone(520,0,.09,'sawtooth',.05,380);tone(480,.11,.09,'sawtooth',.05,340)},hit:()=>{tone(800,0,.1,'square',.06,300)},
thud:()=>{tone(80,0,.2,'sine',.2,40);seq([523,659,784],.08,'square',.05)},away:()=>seq([660,520,440],.07,'triangle',.06),laugh:()=>{for(let i=0;i<4;i++)tone(300-i*20,i*.12,.09,'square',.05,250-i*20)},
jingle:()=>seq([392,523,659,523,784,0,659,784],.1,'square',.06),perfect:()=>seq([523,659,784,1046,784,1046,1318],.09,'square',.07),over:()=>seq([392,330,262,196],.2,'triangle',.12)};
MUSIC=i=>{if(phase!='duck')return;if(i%2==0)tone([196,0,247,0,294,0,247,0][i%8]||196,0,.12,'triangle',.03)};
