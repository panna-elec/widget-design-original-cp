import assert from 'node:assert/strict';
import {createPointerRouter,inPanel} from '../cyberdeck.widget/lib/native-pointer.js';
const listeners=new Map(),docListeners=new Map(),posted=[],tasks=[];
const host={setTimeout:fn=>tasks.push(fn),clearTimeout(){},webkit:{messageHandlers:{uebersicht:{postMessage:m=>posted.push(m)}}},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k),document:{documentElement:{addEventListener:(k,f)=>docListeners.set(k,f),removeEventListener:k=>docListeners.delete(k)}}};
const frame={isConnected:true,style:{},cyberdeckClip:'path("panels")',getBoundingClientRect:()=>({left:0,top:20})};
const router=createPointerRouter(frame,host),flush=()=>{while(tasks.length)tasks.shift()();},last=()=>{flush();return posted.at(-1);};
assert.equal(last(),'widgetLeave');
const r={x:26,y:52,width:224,height:250};router.regions([r]);
for(const [x,y,want] of [[30,55,false],[45,70,true],[100,150,true],[248,300,false],[900,500,false]])assert.equal(inPanel({x,y},r),want);
router.hover({inside:true,x:100,y:150});assert.equal(last(),'widgetEnter');
// Key regression: child never emits mouseleave; pointer moves to desktop in parent.
listeners.get('mousemove')({clientX:900,clientY:520});assert.equal(last(),'widgetLeave');
// Native framework may write its old state during the same event. Ours runs last.
listeners.get('mousemove')({clientX:900,clientY:520});posted.push('widgetEnter');assert.equal(last(),'widgetLeave');
router.hover({inside:true,x:900,y:500});assert.equal(last(),'widgetLeave');
router.hover({inside:true});assert.equal(last(),'widgetLeave');
router.hover({inside:true,x:100,y:150});assert.equal(last(),'widgetEnter');
router.regions([]);assert.equal(last(),'widgetLeave');
router.regions([r]);router.editing(true);assert.equal(frame.style.clipPath,'path("panels")');
router.hover({inside:true,x:900,y:500});router.drag(true);assert.equal(frame.style.clipPath,'path("panels")');
router.hover({inside:true,x:100,y:150});router.drag(true);assert.equal(frame.style.clipPath,'none');
listeners.get('mousemove')({clientX:900,clientY:520});assert.equal(last(),'widgetEnter');
router.drag(false);assert.equal(frame.style.clipPath,'path("panels")');assert.equal(last(),'widgetLeave');
router.hover({inside:true,x:100,y:150});router.drag(true);listeners.get('blur')();assert.equal(frame.style.clipPath,'path("panels")');assert.equal(last(),'widgetLeave');
router.hover({inside:true,x:100,y:150});docListeners.get('mouseleave')();assert.equal(last(),'widgetLeave');
frame.isConnected=false;listeners.get('mousemove')({clientX:0,clientY:0});assert.equal(listeners.size,0);
console.log('PASS: clipped corners, child-to-desktop exit, native listener ordering, geometry changes, edit/drag/release/blur, cleanup');
