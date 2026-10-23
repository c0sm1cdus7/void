import { createRequire } from "node:module";
import type { Page } from "playwright";

const require = createRequire(new URL("../../../desert/package.json", import.meta.url));
const sharp = require("sharp") as typeof import("../../../desert/node_modules/sharp/lib/index.d.ts");

export async function privateImageFile() {
  const buffer = await sharp({ create: { width: 400, height: 300, channels: 3, background: "#007aff" } }).png().toBuffer();
  return { name: "private-blue.png", mimeType: "image/png", buffer };
}

export function privateAudioFile(seconds=1){
  const samples=8000*seconds,buffer=Buffer.alloc(44+samples*2);
  buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVE',8);
  buffer.write('fmt ',12);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);
  buffer.writeUInt32LE(8000,24);buffer.writeUInt32LE(16000,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);
  buffer.write('data',36);buffer.writeUInt32LE(samples*2,40);
  return {name:'private-silence.wav',mimeType:'audio/wav',buffer};
}

/** Real, locally encoded frames; the fixture does not depend on a sample gallery. */
export async function privateVideoFile(page:Page){
  const bytes=await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;
    const context=canvas.getContext('2d')!,stream=canvas.captureStream(10);
    const recorder=new MediaRecorder(stream,{mimeType:'video/mp4;codecs=avc1.42001E'}),parts:Blob[]=[];
    recorder.ondataavailable=event=>parts.push(event.data);
    const done=new Promise<void>(resolve=>recorder.onstop=()=>resolve());
    recorder.start();let frame=0;
    const interval=setInterval(()=>{context.fillStyle=++frame%2?'red':'blue';context.fillRect(0,0,64,64);},50);
    await new Promise(resolve=>setTimeout(resolve,1400));recorder.stop();await done;
    clearInterval(interval);stream.getTracks().forEach(track=>track.stop());
    return Array.from(new Uint8Array(await new Blob(parts).arrayBuffer()));
  });
  return {name:'private-motion.mp4',mimeType:'video/mp4',buffer:Buffer.from(bytes)};
}
