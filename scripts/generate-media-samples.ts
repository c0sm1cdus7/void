import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const directory = fileURLToPath(new URL("../assets/media-samples/", import.meta.url));
mkdirSync(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const generated = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 640; canvas.height = 360;
    const context = canvas.getContext("2d")!;
    function paint(position: number) {
      const gradient = context.createLinearGradient(0, 0, 640, 360);
      gradient.addColorStop(0, "#234b65"); gradient.addColorStop(1, "#b99269");
      context.fillStyle = gradient; context.fillRect(0, 0, 640, 360);
      context.fillStyle = "#dde4de";
      context.beginPath(); context.arc(180 + position * 280, 150, 45, 0, Math.PI * 2); context.fill();
      context.font = "24px system-ui"; context.fillText("VOID · Motion study", 30, 320);
    }
    paint(0);
    const poster = canvas.toDataURL("image/png").split(",")[1]!;
    const stream = canvas.captureStream(12);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 200_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = event => chunks.push(event.data);
    const stopped = new Promise<void>(resolve => { recorder.onstop = () => resolve(); });
    recorder.start();
    const started = performance.now();
    await new Promise<void>(resolve => {
      function frame(now: number) {
        const progress = Math.min(1, (now - started) / 6000);
        paint(progress);
        if (progress < 1) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
    recorder.stop(); await stopped; stream.getTracks().forEach(track => track.stop());
    return { poster, video: [...new Uint8Array(await new Blob(chunks).arrayBuffer())] };
  });
  writeFileSync(`${directory}/motion-study.webm`, Buffer.from(generated.video));
  writeFileSync(`${directory}/motion-study.png`, Buffer.from(generated.poster, "base64"));
  writeFileSync(`${directory}/motion-study.vtt`, "WEBVTT\n\n00:00.000 --> 00:06.000\nA circle moves slowly across a blue and sand gradient. This clip has no audio.\n");
} finally { await browser.close(); }

const rate = 24000, length = rate * 8;
const wav = Buffer.alloc(44 + length * 2);
wav.write("RIFF", 0); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write("data", 36); wav.writeUInt32LE(length * 2, 40);
for (let sample = 0; sample < length; sample++) {
  const time = sample / rate;
  const frequency = [261.63, 329.63, 392, 523.25][Math.min(3, Math.floor(time / 2))]!;
  const envelope = Math.sin(Math.PI * (time % 2) / 2) ** 2;
  wav.writeInt16LE(Math.round(Math.sin(2 * Math.PI * frequency * time) * envelope * 3500), 44 + sample * 2);
}
writeFileSync(`${directory}/quiet-tones.wav`, wav);
process.stdout.write("Generated original VOID samples: one silent video, its poster/captions, and eight seconds of quiet tones.\n");
