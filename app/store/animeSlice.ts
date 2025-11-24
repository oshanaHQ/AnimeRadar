import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type Anime = {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  synopsis?: string;
};

type AnimeState = {
  animeList: Anime[];
  favourites: Anime[];
  loading: boolean;
};

const initialState: AnimeState = {
  animeList: [],
  favourites: [],
  loading: false,
};

// Async thunk to fetch anime
export const fetchAnime = createAsyncThunk('anime/fetchAnime', async () => {
  const res = await fetch('https://api.jikan.moe/v4/top/anime');
  const json = await res.json();
  return json.data as Anime[];
});

export const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Anime>) => {
      const exists = state.favourites.find(a => a.mal_id === action.payload.mal_id);
      if (!exists) state.favourites.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.favourites = state.favourites.filter(a => a.mal_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => { state.loading = true; })
      .addCase(fetchAnime.fulfilled, (state, action: PayloadAction<Anime[]>) => {
        state.animeList = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnime.rejected, (state) => { state.loading = false; });
  },
});

export const { addFavourite, removeFavourite } = animeSlice.actions;

export default animeSlice.reducer;
