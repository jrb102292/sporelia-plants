import { NextResponse } from 'next/server';
import { networkInterfaces } from 'os';

export async function GET() {
  const nets = networkInterfaces();
  let localIp = '';

  // Find the first non-internal IPv4 address
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        localIp = net.address;
        break;
      }
    }
    if (localIp) break;
  }

  return NextResponse.json({ ip: localIp || 'localhost' });
} 