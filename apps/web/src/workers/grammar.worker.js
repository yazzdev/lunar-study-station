import { pipeline } from '@xenova/transformers';

// Singleton pipeline instance
let corrector = null;

self.onmessage = async (event) => {
  // Initialize pipeline if not already done
  if (corrector === null) {
    try {
      corrector = await pipeline('text2text-generation', 'Xenova/t5-small-grammar-correction', {
        progress_callback: (progress) => {
          self.postMessage({ status: 'progress', progress: progress.progress });
        }
      });
      self.postMessage({ status: 'initiate-done' });
    } catch (error) {
      self.postMessage({ status: 'error', data: error.message });
      return;
    }
  }

  // Process text
  if (event.data.text) {
    try {
      const output = await corrector(event.data.text, {
        max_length: 512,
        truncation: true,
      });
      self.postMessage({ status: 'complete', output });
    } catch (error) {
      self.postMessage({ status: 'error', data: error.message });
    }
  }
};