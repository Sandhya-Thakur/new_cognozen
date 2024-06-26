import { create } from "zustand";

interface StoreState {
  emotionData: any;
  attentionData: any;
  isCameraOn: boolean;
  setEmotionData: (data: any) => void;
  setAttentionData: (data: any) => void;
  setCameraStatus: (status: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  emotionData: null,
  attentionData: null,
  isCameraOn: false,
  setEmotionData: (data) => set({ emotionData: data }),
  setAttentionData: (data) => set({ attentionData: data }),
  setCameraStatus: (status) => set({ isCameraOn: status }),
}));
