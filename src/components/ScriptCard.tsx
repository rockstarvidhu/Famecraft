// src/components/ScriptCard.tsx
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Script } from '../game/types';
import { POSTER_BY_GENRE, getRandomDirector, getRandomCostar } from '../utils/assetPaths';
import { useGameStore } from '../store/gameStore';
import VintageOverlay from './VintageOverlay';

interface ScriptCardProps {
  script: Script;
  onAccept: () => void;
  onReject: () => void;
}

const C = {
  parchLight:'#F2E4C4',parchBase:'#E8D5A8',parchMid:'#D9C48E',
  parchDark:'#CCB47A',parchDeep:'#B89A60',
  ink:'#1E0E04',brown:'#6B4226',border:'#8B5A2B',borderDark:'#5C3410',
  sepia:'#5C3D1E',faded:'#7A6248',
};
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.22 0 0 0 0 0.10 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

const GENRE_DARK:Record<string,string> = {
  Action:'#3A0A0A',Romance:'#3A0A20',Drama:'#0A200A',Comedy:'#2A1A00',
  Thriller:'#0A0A1E',Horror:'#080808',Social:'#0A1420',Biopic:'#1A0E00',
};
const GENRE_EMOJI:Record<string,string> = {
  Action:'⚔️',Romance:'💕',Drama:'🎭',Comedy:'😂',
  Thriller:'🔪',Horror:'👻',Social:'✊',Biopic:'🏆',
};
const MALE_DIRS = ['Raj Kumar','Guru Lal','Mani Seth','S.S. Varma','Anurag Das','Vikram Roy','Karan Johar','Sanjay Leela'];
const FEMALE_DIRS = ['Zoya Mehra','Farah Khan','Nandita Das','Mira Nair','Deepa Mehta'];
const MALE_COSTARS = ['Ranveer S.','Hrithik R.','Ranbir K.','Varun D.','Vicky K.','Rajkumar R.'];
const FEMALE_COSTARS = ['Deepika R.','Alia B.','Priya C.','Katrina K.','Anushka S.','Vidya B.'];
function sn(a:string[],id:string){return a[id.charCodeAt(id.length-1)%a.length];}

function ImgOrEmoji({src,emoji,style}:{src:string;emoji:string;style:React.CSSProperties}) {
  const [failed,setFailed] = useState(false);
  return failed
    ? <div style={{...style,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{emoji}</div>
    : <img src={src} alt="" style={{...style,objectFit:'cover',imageRendering:'pixelated'}} onError={()=>setFailed(true)} />;
}

export default function ScriptCardArcade({script,onAccept,onReject}:ScriptCardProps) {
  const {fame,careerPhase} = useGameStore();
  const dirSrc = useMemo(()=>getRandomDirector(),[script.id]);
  const coSrc  = useMemo(()=>getRandomCostar(),  [script.id]);
  
  // Determine gender from sprite filename
  const dirIsFemale = dirSrc.includes('female');
  const coIsFemale = coSrc.includes('female');
  
  const dirName = useMemo(()=>sn(dirIsFemale ? FEMALE_DIRS : MALE_DIRS, script.id+'d'),[script.id, dirIsFemale]);
  const coName  = useMemo(()=>sn(coIsFemale ? FEMALE_COSTARS : MALE_COSTARS, script.id+'c'),[script.id, coIsFemale]);
  
  const isRec = (careerPhase==='Newcomer'&&script.riskProfile==='Safe')||(careerPhase==='Rising Star'&&script.directorReputation>70);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if(e.key===' '||e.key==='Enter'){e.preventDefault();onAccept();}
      if(e.key==='Escape'){e.preventDefault();onReject();}
    };
    window.addEventListener('keydown',h);
    return ()=>window.removeEventListener('keydown',h);
  },[onAccept,onReject]);

  const riskColor={Safe:'#2A5A1A',Balanced:'#7A5A00',Risky:'#7A1A0A'}[script.riskProfile];
  const riskBg={Safe:'rgba(42,90,26,0.15)',Balanced:'rgba(122,90,0,0.15)',Risky:'rgba(122,26,10,0.15)'}[script.riskProfile];
  const dirStars=Math.round(script.directorReputation/20);
  const payment=script.payment>=100?`₹${(script.payment/100).toFixed(2)}Cr`:`₹${script.payment}L`;
  const [posterFailed,setPosterFailed]=useState(false);

  return (
    <motion.div
      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
      transition={{duration:0.32,ease:[0.22,1,0.36,1]}}
      style={{
        width:'100%',
        // Darker golden-brown background for sprite contrast
        background:'rgba(139,90,43,0.35)',
        backdropFilter:'blur(2px)',
        border:`2.5px solid ${C.border}`,borderRadius:3,
        boxShadow:`2px 2px 0 ${C.borderDark},4px 4px 10px rgba(30,14,4,0.35),inset 0 1px 0 rgba(255,255,255,0.1)`,
        overflow:'hidden',fontFamily:"'Crimson Text','Lora',Georgia,serif",userSelect:'none',
        position:'relative',
      } as React.CSSProperties}>

      {/* Very light coffee stain only */}
      <VintageOverlay stainStrength={0.2} grainStrength={0} stains={['tl']} />

      {/* Title bar - semi-transparent */}
      <div style={{
        background:`linear-gradient(180deg,rgba(217,196,142,0.6) 0%,rgba(204,180,122,0.7) 100%)`,
        backdropFilter:'blur(2px)',
        borderBottom:`2px solid ${C.border}`,padding:'4px 7px',
        display:'flex',alignItems:'center',gap:5,
        boxShadow:'inset 0 1px 0 rgba(255,255,255,0.28)',
      }}>
        {['#CC3333','#CCAA22','#33AA33'].map((bg,i)=>(
          <div key={i} style={{width:8,height:8,borderRadius:'50%',background:bg,border:'1px solid rgba(0,0,0,0.3)',flexShrink:0}}/>
        ))}
        <span style={{flex:1,textAlign:'center',fontFamily:"'Libre Baskerville',serif",
                      fontSize:8,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:C.ink}}>
          · {script.genre.toUpperCase()} · {script.certification} ·
        </span>
        <button onClick={onReject} style={{
          width:16,height:16,background:C.parchMid,border:`2px solid ${C.border}`,borderRadius:2,
          fontSize:10,fontWeight:900,color:C.sepia,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'1px 1px 0 rgba(0,0,0,0.22)',padding:0,flexShrink:0,
        }}>×</button>
      </div>

      {/* Poster area */}
      <div style={{
        height:130,background:GENRE_DARK[script.genre]??'#1A1008',
        position:'relative',overflow:'hidden',borderBottom:`2px solid ${C.border}`,
      }}>
        {posterFailed ? (
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',
                       fontSize:60,filter:'saturate(0.5) brightness(0.8)'}}>
            {GENRE_EMOJI[script.genre]??'🎬'}
          </div>
        ) : (
          <img
            src={POSTER_BY_GENRE[script.genre]}
            alt={script.title}
            style={{width:'100%',height:'100%',objectFit:'cover',
                    filter:'sepia(0.4) contrast(1.1) brightness(0.85)'}}
            onError={()=>setPosterFailed(true)}
          />
        )}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6) 100%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'3px 6px',textAlign:'center'}}>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontSize:8,fontWeight:700,
                        letterSpacing:'0.15em',textTransform:'uppercase',color:C.parchLight}}>
            · {script.genre.toUpperCase()} · {script.certification} ·
          </span>
        </div>
        {isRec&&(
          <div style={{position:'absolute',top:10,left:-16,background:'#B8860B',color:'#fff',
                       padding:'2px 22px',fontFamily:"'Libre Baskerville',serif",fontSize:7,
                       fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',
                       transform:'rotate(-45deg)',boxShadow:'0 1px 4px rgba(0,0,0,0.5)'}}>★ Pick</div>
        )}
      </div>

      {/* Body */}
      <div style={{padding:'10px 10px 8px'}}>

        {/* Title */}
        <div style={{fontFamily:"'IM Fell English',Georgia,serif",fontSize:16,fontWeight:700,
                     color:C.ink,textAlign:'center',lineHeight:1.2,marginBottom:5}}>
          {script.title}
        </div>

        {/* Risk badge */}
        <div style={{textAlign:'center',marginBottom:8}}>
          <span style={{padding:'2px 10px',border:`1.5px solid ${riskColor}`,borderRadius:2,
                        fontFamily:"'Libre Baskerville',serif",fontSize:8,fontWeight:700,
                        letterSpacing:'0.08em',color:riskColor,background:riskBg}}>
            {script.riskProfile.toUpperCase()}
          </span>
        </div>

        <div style={{height:1,background:C.border,opacity:0.28,marginBottom:10}}/>

        {/* ── PORTRAIT ROW (Director + Co-Star) — BLACK CIRCULAR BACKGROUNDS ── */}
        <div style={{display:'flex',gap:16,marginBottom:12,justifyContent:'space-around',padding:'0 4px'}}>

          {/* Director */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flex:1}}>
            {/* Black circular background behind sprite */}
            <div style={{
              width:100,height:100,
              borderRadius:'50%',
              background:'#000',
              display:'flex',alignItems:'center',justifyContent:'center',
              overflow:'hidden',
            }}>
              <ImgOrEmoji src={dirSrc} emoji="🎬"
                style={{
                  width:'100%',height:'100%',
                  objectFit:'cover' as const,
                  filter:'sepia(0.2) contrast(1.1)',
                  imageRendering:'pixelated' as const,
                }}/>
            </div>
            {/* Text directly on parchment */}
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:9,fontWeight:700,
                           textTransform:'uppercase',letterSpacing:'0.08em',color:C.faded,lineHeight:1,marginBottom:3}}>
                Director
              </div>
              <div style={{fontFamily:"'IM Fell English',Georgia,serif",fontSize:15,fontWeight:700,
                           color:C.ink,lineHeight:1.1,marginTop:2,marginBottom:4}}>
                {dirName}
              </div>
              <div style={{display:'flex',gap:1,marginTop:3,justifyContent:'center'}}>
                {[...Array(5)].map((_,i)=>(
                  <span key={i} style={{fontSize:13,color:i<dirStars?'#D4AF37':'#8A7A5A',lineHeight:1}}>
                    {i<dirStars?'★':'☆'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Co-Star */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flex:1}}>
            {/* Black circular background behind sprite */}
            <div style={{
              width:100,height:100,
              borderRadius:'50%',
              background:'#000',
              display:'flex',alignItems:'center',justifyContent:'center',
              overflow:'hidden',
            }}>
              <ImgOrEmoji src={coSrc} emoji="🌟"
                style={{
                  width:'100%',height:'100%',
                  objectFit:'cover' as const,
                  filter:'sepia(0.2) contrast(1.1)',
                  imageRendering:'pixelated' as const,
                }}/>
            </div>
            {/* Text directly on parchment */}
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:9,fontWeight:700,
                           textTransform:'uppercase',letterSpacing:'0.08em',color:C.faded,lineHeight:1,marginBottom:3}}>
                Co-Star
              </div>
              <div style={{fontFamily:"'IM Fell English',Georgia,serif",fontSize:15,fontWeight:700,
                           color:C.ink,lineHeight:1.1,marginTop:2,marginBottom:4}}>
                {coName}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:3,marginTop:3,justifyContent:'center'}}>
                <div style={{width:60,height:7,background:'rgba(0,0,0,0.25)',
                             border:`1.5px solid ${C.border}`,borderRadius:1,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${script.coStarPopularity}%`}}
                    transition={{duration:0.8,delay:0.15}}
                    style={{height:'100%',background:'linear-gradient(90deg,#C8A000,#D4AF37)'}}/>
                </div>
                <span style={{fontFamily:'Courier Prime,monospace',fontSize:10,fontWeight:700,color:C.faded}}>
                  {script.coStarPopularity}
                </span>
              </div>
            </div>
          </div>

        </div>

        <div style={{height:1,background:C.border,opacity:0.28,marginBottom:12}}/>

        {/* Stats — HIGHLY PROMINENT WITH VISUAL POP */}
        <div style={{display:'flex',gap:7,marginBottom:12,padding:'0 2px'}}>
          {[
            {label:'RISK',val:script.riskProfile,color:riskColor,mono:false,icon:'⚠️'},
            {label:'FAME',val:`+${Math.round(script.directorReputation*0.12)}`,mono:true,icon:'⭐'},
            {label:'PAYMENT',val:payment,mono:true,icon:'💰'},
          ].map(({label,val,color,mono,icon})=>(
            <div key={label} style={{
              flex:1,
              background:`linear-gradient(180deg, rgba(242,228,196,0.4) 0%, rgba(217,196,142,0.5) 100%)`,
              backdropFilter:'blur(1px)',
              border:'3px solid rgba(139,90,43,0.8)',
              borderRadius:4,
              padding:'10px 6px',
              boxShadow:'inset 0 2px 4px rgba(0,0,0,0.15), 2px 2px 0 rgba(92,52,16,0.3)',
              position:'relative' as const,
            }}>
              {/* Icon badge */}
              <div style={{
                position:'absolute' as const,top:-8,left:'50%',transform:'translateX(-50%)',
                fontSize:16,
                background:C.parchLight,
                border:`2px solid ${C.border}`,
                borderRadius:'50%',
                width:24,height:24,
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 2px 4px rgba(0,0,0,0.2)',
              }}>
                {icon}
              </div>
              <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:9,fontWeight:700,
                           textTransform:'uppercase',letterSpacing:'0.1em',color:C.faded,
                           marginBottom:6,textAlign:'center',marginTop:8}}>
                {label}
              </div>
              <div style={{fontSize:16,fontWeight:900,color:color??C.ink,lineHeight:1,textAlign:'center',
                           fontFamily:mono?'Courier Prime,monospace':"'Crimson Text',serif",
                           textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {/* Accept */}
          <motion.button onClick={onAccept}
            whileHover={{y:-1,boxShadow:'0 4px 0 #0A2A00,0 6px 10px rgba(0,0,0,0.3)'}}
            whileTap={{y:2,boxShadow:'0 0 0 #0A2A00'}}
            style={{
              width:'100%',padding:'8px 6px',
              background:'linear-gradient(180deg,#5A8A4A 0%,#3A5A2A 55%,#2A4A1A 100%)',
              border:'2px solid #1A3A0A',borderBottomWidth:4,borderRadius:3,
              fontFamily:"'Libre Baskerville',serif",fontSize:9,fontWeight:700,
              textTransform:'uppercase',letterSpacing:'0.07em',color:'#F0DEB8',cursor:'pointer',
              boxShadow:'0 3px 0 #0A2A00,0 4px 8px rgba(0,0,0,0.25)',
              textShadow:'0 1px 2px rgba(0,0,0,0.5)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            } as React.CSSProperties}>
            <span>✓</span> Accept Script
          </motion.button>
          {/* Pass */}
          <motion.button onClick={onReject}
            whileHover={{y:-1,boxShadow:'0 4px 0 #3A0000,0 6px 10px rgba(0,0,0,0.3)'}}
            whileTap={{y:2,boxShadow:'0 0 0 #3A0000'}}
            style={{
              width:'100%',padding:'7px 6px',
              background:'linear-gradient(180deg,#8A4A3A 0%,#6A2A1A 55%,#5A1A0A 100%)',
              border:'2px solid #4A0A00',borderBottomWidth:4,borderRadius:3,
              fontFamily:"'Libre Baskerville',serif",fontSize:9,fontWeight:700,
              textTransform:'uppercase',letterSpacing:'0.07em',color:'#F0DEB8',cursor:'pointer',
              boxShadow:'0 3px 0 #3A0000,0 4px 8px rgba(0,0,0,0.25)',
              textShadow:'0 1px 2px rgba(0,0,0,0.5)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            } as React.CSSProperties}>
            <span>✗</span> Pass
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}
