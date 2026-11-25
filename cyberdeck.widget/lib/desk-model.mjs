export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function energy(battery,settings){
 if(!settings.batteryEffects||!battery||!Number.isFinite(battery.percent)||battery.percent<0||battery.percent>100)return 'normal';
 if(battery.charging)return 'charging';
 return battery.percent<=settings.low?'low':battery.percent<=settings.mid?'mid':'normal';
}
export function safeArea(width,height,dock={edge:'bottom',reserve:72}){
 const margin=12, reserve=clamp(Number(dock.reserve)||72,24,200);
 return {x:dock.edge==='left'?reserve:margin,y:52,w:Math.max(120,width-(dock.edge==='left'||dock.edge==='right'?reserve:margin)-margin),h:Math.max(100,height-52-(dock.edge==='bottom'?reserve:margin))};
}
export function constrain(rect,bounds){
 const w=clamp(rect.w,Math.min(224,bounds.w),Math.min(600,bounds.w));
 const h=clamp(rect.h,Math.min(120,bounds.h),bounds.h);
 return {x:clamp(rect.x,bounds.x,bounds.x+bounds.w-w),y:clamp(rect.y,bounds.y,bounds.y+bounds.h-h),w,h};
}
export function overlaps(a,b,gap=10){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
export function normalize(r,b){return {x:(r.x-b.x)/b.w,y:(r.y-b.y)/b.h,w:r.w/b.w,h:r.h/b.h};}
export function expand(r,b){return constrain({x:b.x+r.x*b.w,y:b.y+r.y*b.h,w:r.w*b.w,h:r.h*b.h},b);}
export function initialDesk(){return {version:1,revision:0,tasks:[],shortcuts:[{id:'finder',label:'Finder',path:'/System/Library/CoreServices/Finder.app',kind:'app'}],layout:{},settings:{batteryEffects:true,particles:true,koi:true,koiPalette:'rose',koiPower:false,koiSize:100,koiWeight:100,low:20,mid:50,dock:'auto',reserve:72}};}
