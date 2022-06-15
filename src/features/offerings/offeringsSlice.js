import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {
  ensureConfig, getConfig, camelCaseObject,
} from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL'], 'Partnership API services');

const offeringsAdapter = createEntityAdapter({
  selectId: offering => offering.id,
});

const initialState = offeringsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export async function enrollInOffering(offeringId) {
  const client = getAuthenticatedHttpClient();
  const baseUrl = getConfig().LMS_BASE_URL;
  const response = await client.post(
    `${baseUrl}/api/partnerships/v0/offerings/${offeringId}/enroll/`,
  );
  return camelCaseObject(response.data);
}

export const fetchOfferings = createAsyncThunk(
  'offerings/fetchOfferings',
  async () => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.get(`${baseUrl}/api/partnerships/v0/offerings/`);
    return camelCaseObject(response.data);
  },
);

export const addOffering = createAsyncThunk(
  'offerings/addOffering',
  async ({ catalog, offering }) => {
    const client = getAuthenticatedHttpClient();
    const baseUrl = getConfig().LMS_BASE_URL;
    const response = await client.post(
      `${baseUrl}/api/partnerships/v0/offerings/${catalog}/`,
      { offering },
    );
    return camelCaseObject(response.data);
  },
);

/* eslint-disable no-param-reassign */
const offeringsSlice = createSlice({
  name: 'offerings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOfferings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOfferings.fulfilled, (state, action) => {
        state.status = 'success';
        offeringsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchOfferings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addOffering.fulfilled, offeringsAdapter.addOne);
  },
});
/* eslint-enable */

export const {
  selectAll: selectAllOfferings,
  selectById: selectOfferingById,
  selectIds: selectOfferingIds,
} = offeringsAdapter.getSelectors(state => state.offerings);

export default offeringsSlice.reducer;
