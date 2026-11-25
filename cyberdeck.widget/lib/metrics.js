// HOST_CPU_LOAD_INFO order: user, system, idle, nice. Counter values are UInt32.
export function reduceSample(previous, sample) {
  if (!sample || !Array.isArray(sample.ticks) || sample.ticks.length !== 4 ||
      sample.ticks.some(v => !Number.isInteger(v) || v < 0 || v > 0xffffffff) ||
      !Number.isFinite(sample.timestamp) || !Number.isFinite(sample.memoryBytes) ||
      !Number.isFinite(sample.totalBytes) || sample.totalBytes <= 0 || sample.memoryBytes < 0 ||
      sample.memoryBytes > sample.totalBytes) throw new Error('Invalid sample');
  let cpu = null;
  if (previous && sample.timestamp > previous.timestamp && sample.timestamp - previous.timestamp <= 30) {
    const delta = sample.ticks.map((n,i) => (n - previous.ticks[i] + 2**32) % 2**32);
    const total = delta.reduce((a,b)=>a+b,0);
    if (total > 0) cpu = 100 * (total - delta[2]) / total;
  }
  return { ...sample, cpu, networkRate: networkRate(previous, sample) };
}

function networkRate(previous, sample) {
  const valid = list => Array.isArray(list) && list.every(n => n && typeof n.id === 'string' &&
    Number.isSafeInteger(n.rxBytes) && n.rxBytes >= 0 && Number.isSafeInteger(n.txBytes) && n.txBytes >= 0) &&
    new Set(list.map(n => n.id)).size === list.length;
  const unavailable = status => ({rx: null, tx: null, status});
  if (!valid(sample.network)) return unavailable('unavailable');
  if (!sample.network.length) return unavailable('no-interface');
  if (!previous || !valid(previous.network)) return unavailable('waiting');
  const wall = sample.timestamp - previous.timestamp;
  const elapsed = sample.uptime - previous.uptime;
  if (!Number.isFinite(elapsed) || elapsed <= 0 || elapsed > 15 || wall <= 0 || wall > 15 || Math.abs(wall - elapsed) > 2) return unavailable('waiting');
  if (previous.network.length !== sample.network.length) return unavailable('waiting');
  let rx = 0, tx = 0;
  for (const current of sample.network) {
    const before = previous.network.find(n => n.id === current.id);
    if (!before || current.rxBytes < before.rxBytes || current.txBytes < before.txBytes) return unavailable('waiting');
    rx += current.rxBytes - before.rxBytes; tx += current.txBytes - before.txBytes;
  }
  return {rx: rx / elapsed, tx: tx / elapsed, status: 'ok'};
}
