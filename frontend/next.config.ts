import type { NextConfig } from "next";
import * as fs from 'fs';
import * as path from 'path';

// Function to manually parse UTF-16 encoded env files
function loadEnv(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      // Try reading as UTF-16LE
      const content = fs.readFileSync(filePath, 'utf16le');
      const env: Record<string, string> = {};

      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...values] = trimmed.split('=');
          if (key) {
            env[key.trim()] = values.join('=').trim();
          }
        }
      });
      return env;
    }
  } catch (error) {
    console.warn('Failed to load env file:', error);
  }
  return {};
}

// Load .env.local manually
const envVars = loadEnv(path.join(process.cwd(), '.env.local'));

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ...envVars,
  }
};

export default nextConfig;
