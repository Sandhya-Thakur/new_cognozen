import { create } from "zustand";

interface StoreState {
  emotionData: any;
  attentionData: any;
  isCameraOn: boolean;
  latestEmotionData: any;
  latestAttentionData: any;
  setEmotionData: (data: any) => void;
  setAttentionData: (data: any) => void;
  setCameraStatus: (status: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  emotionData: null,
  attentionData: null,
  isCameraOn: false,
  latestEmotionData: null,
  latestAttentionData: null,
  setEmotionData: (data) => set((state) => ({ 
    emotionData: data, 
    latestEmotionData: data ? data : state.latestEmotionData 
  })),
  setAttentionData: (data) => set((state) => ({ 
    attentionData: data, 
    latestAttentionData: data ? data : state.latestAttentionData 
  })),
  setCameraStatus: (status) => set({ isCameraOn: status }),
}));