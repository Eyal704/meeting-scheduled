import { registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';

const ReportFiles = registerPlugin('ReportFiles');
const base64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = () => reject(new Error('קריאת הקובץ לא הצליחה.'));
  reader.readAsDataURL(file);
});
window.massadNative = {
  async export(file, mode = 'save', options = {}) {
    return ReportFiles.exportFile({ name: file.name, mime: file.type, data: await base64(file), mode, ...options });
  }
};
App.addListener('backButton', async () => {
  if (await window.massadNativeBack?.()) return;
  await App.minimizeApp();
});
App.addListener('appStateChange', ({isActive}) => {
  if (!isActive) window.massadBeforeLock?.();
});
