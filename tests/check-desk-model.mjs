import assert from 'node:assert/strict';
import {energy,safeArea,constrain,normalize,expand,overlaps,initialDesk} from '../cyberdeck.widget/lib/desk-model.mjs';
const s=initialDesk().settings;
assert.equal(energy({percent:51},s),'normal');assert.equal(energy({percent:50},s),'mid');assert.equal(energy({percent:20},s),'low');assert.equal(energy({percent:10,charging:true},s),'charging');assert.equal(energy({percent:5},{...s,batteryEffects:false}),'normal');assert.equal(energy(null,s),'normal');
for(const [w,h] of [[1440,870],[1280,690],[1024,570],[1920,1050],[2560,1410]])for(const edge of ['bottom','left','right']){
 const b=safeArea(w,h,{edge,reserve:110}),r=constrain({x:-200,y:2000,w:3000,h:1500},b);
 assert(r.x>=b.x&&r.y>=b.y&&r.x+r.w<=b.x+b.w&&r.y+r.h<=b.y+b.h);
 const recovered=expand(normalize(r,b),b);for(const k of ['x','y','w','h'])assert(Math.abs(r[k]-recovered[k])<.001);
}
assert(overlaps({x:0,y:0,w:100,h:100},{x:50,y:50,w:100,h:100}));assert(!overlaps({x:0,y:0,w:100,h:100},{x:110,y:0,w:100,h:100}));
console.log('Energy boundary + 15 viewport/Dock geometry cases passed');
