import {create} from 'zustand';
type FileMetadata = {
    file_key: string;
    file_name: string;
  };
  
  type StoreState = {
    files: FileMetadata[];
    addFile: (file: FileMetadata) => void;
  };
  
  export const useStore = create<StoreState>((set) => ({
    files: [],
    addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  }));