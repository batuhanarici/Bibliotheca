import { contextBridge, ipcRenderer } from 'electron';
import { Book } from '../src/types/book';

const api = {
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:selectFolder'),
  scanFolderForPdfs: (folderPath: string): Promise<void> => ipcRenderer.invoke('db:scanFolderForPdfs', folderPath),
  getAllBooks: (): Promise<Book[]> => ipcRenderer.invoke('db:getAllBooks'),
};

contextBridge.exposeInMainWorld('api', api);

export type Api = typeof api;
