export interface PepperjackOptions {
  pass: string;
  repo?: string;
  dev?: boolean;
  keys?: {
    type: 'rsa';
    size: 1024 | 2048 | 4096;
  };
}
