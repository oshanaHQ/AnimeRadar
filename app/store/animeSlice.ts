import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Async thunk to load favourites from AsyncStorage
export const loadFavourites = createAsyncThunk('anime/loadFavourites', async () => {
  const stored = await AsyncStorage.getItem('favourites');
  if (stored) return JSON.parse(stored) as Anime[];
  return [];
});

export const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    toggleFavourite: (state, action: PayloadAction<Anime>) => {
      const exists = state.favourites.find(a => a.mal_id === action.payload.mal_id);
      if (exists) {
        state.favourites = state.favourites.filter(a => a.mal_id !== action.payload.mal_id);
      } else {
        state.favourites.push(action.payload);
      }
      // Save updated favourites to AsyncStorage
      AsyncStorage.setItem('favourites', JSON.stringify(state.favourites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => { state.loading = true; })
      .addCase(fetchAnime.fulfilled, (state, action: PayloadAction<Anime[]>) => {
        state.animeList = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnime.rejected, (state) => { state.loading = false; })
      .addCase(loadFavourites.fulfilled, (state, action: PayloadAction<Anime[]>) => {
        state.favourites = action.payload;
      });
  },
});

export const { toggleFavourite } = animeSlice.actions;
export default animeSlice.reducer;
