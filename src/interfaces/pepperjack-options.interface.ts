export interface PepperjackOptions {
  pass: string;
  repo?: string;
  keys?: {
    type: 'rsa';
    size: 1024 | 2048 | 4096;
  }
}
