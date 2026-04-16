import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ViewerState = {
  bookmarks: string[];
  recentViews: string[];
  filters: {
    repositoryType: "all" | "Case" | "AAR" | "SOP";
    keyword: string;
  };
  selectedItemId: string | null;
};

const initialState: ViewerState = {
  bookmarks: ["r1", "r3"],
  recentViews: ["EFPC-2026-001", "AAR-002", "SOP-002"],
  filters: {
    repositoryType: "all",
    keyword: "",
  },
  selectedItemId: null,
};

const viewerSlice = createSlice({
  name: "viewer",
  initialState,
  reducers: {
    toggleBookmark: (state, action: PayloadAction<string>) => {
      if (state.bookmarks.includes(action.payload)) {
        state.bookmarks = state.bookmarks.filter((id) => id !== action.payload);
      } else {
        state.bookmarks.push(action.payload);
      }
    },
    pushRecentView: (state, action: PayloadAction<string>) => {
      state.recentViews = [action.payload, ...state.recentViews.filter((id) => id !== action.payload)].slice(0, 10);
    },
    setViewerFilters: (state, action: PayloadAction<Partial<ViewerState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
  },
});

export const { toggleBookmark, pushRecentView, setViewerFilters, setSelectedItem } = viewerSlice.actions;
export default viewerSlice.reducer;
