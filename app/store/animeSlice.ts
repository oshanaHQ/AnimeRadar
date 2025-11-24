// store/animeSlice.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type Anime = {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  synopsis?: string;
  title_english?: string;
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

// Updated: Now accepts page number
export const fetchAnime = createAsyncThunk(
  'anime/fetchAnime',
  async (page: number = 1) => {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    const json = await res.json();
    return { data: json.data as Anime[], page };
  }
);

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
      AsyncStorage.setItem('favourites', JSON.stringify(state.favourites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        if (page === 1) {
          state.animeList = data;           // Fresh load → replace
        } else {
          state.animeList = [...state.animeList, ...data];  // Append more
        }
        state.loading = false;
      })
      .addCase(fetchAnime.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  },
});

export const { toggleFavourite } = animeSlice.actions;
export default animeSlice.reducer;