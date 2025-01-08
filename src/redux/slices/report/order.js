import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ReportService from '../../../services/reports';
import SellerReportService from '../../../services/seller/reports';

let initialState = {
  loading: false,
  chartData: [],
  productList: [],
  invoiceData: "this is just a test", // For storing invoice report data
  error: '',
};

// Fetch order products
export const fetchOrderProduct = createAsyncThunk(
  'orderReport/fetchOrderProduct',
  (params = {}) => {
    return ReportService.getOrderProducts({
      ...params,
    }).then((res) => res);
  }
);

// Fetch invoice report (updated)
export const fetchReportForInvoice = createAsyncThunk(
  'orderReport/fetchReportForInvoice',
  (params = {}) => {
    return ReportService.getInvoiceReport({ ...params })
      .then((res) => {
        // console.log("Invoice Report Response:", res); // Add this log
        return res;
      });
  }
);

// Fetch order product chart
export const fetchOrderProductChart = createAsyncThunk(
  'orderReport/fetchOrderProductChart',
  (params = {}) => {
    return ReportService.getOrderChart({
      ...params,
    }).then((res) => res);
  }
);

// Fetch seller order products
export const fetchSellerOrderProduct = createAsyncThunk(
  'orderReport/fetchSellerOrderProduct',
  (params = {}) => {
    return SellerReportService.getOrderProducts({ ...params }).then(
      (res) => res
    );
  }
);

// Fetch seller order product chart
export const fetchSellerOrderProductChart = createAsyncThunk(
  'orderReport/fetchSellerOrderProductChart',
  (params = {}) => {
    return SellerReportService.getOrderChart({ ...params }).then((res) => res);
  }
);

const orderCountSlice = createSlice({
  name: 'orderReport',
  initialState,
  extraReducers: (builder) => {
    // Admin Order Report
    builder.addCase(fetchOrderProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderProduct.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.productList = payload.data;
      state.error = '';
    });
    builder.addCase(fetchOrderProduct.rejected, (state, action) => {
      state.loading = false;
      state.productList = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchOrderProductChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderProductChart.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.chartData = payload.data;
      state.error = '';
    });
    builder.addCase(fetchOrderProductChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });

    // Seller Order Report
    builder.addCase(fetchSellerOrderProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerOrderProduct.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.productList = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerOrderProduct.rejected, (state, action) => {
      state.loading = false;
      state.productList = [];
      state.error = action.error.message;
    });

    builder.addCase(fetchSellerOrderProductChart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSellerOrderProductChart.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.chartData = payload.data;
      state.error = '';
    });
    builder.addCase(fetchSellerOrderProductChart.rejected, (state, action) => {
      state.loading = false;
      state.chartData = [];
      state.error = action.error.message;
    });

    // Invoice Report
    builder.addCase(fetchReportForInvoice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReportForInvoice.fulfilled, (state, action) => {
      const { payload } = action;
      state.loading = false;
      // console.log("Invoice Report Data:", payload); // Add this log
      state.invoiceData = payload; // Store the invoice report data
      state.error = '';
    });
    builder.addCase(fetchReportForInvoice.rejected, (state, action) => {
      state.loading = false;
      // console.log("Error fetching invoice report:", action.error.message); // Add this log

      state.invoiceData = [];
      state.error = action.error.message;
    });
  },
  reducers: {
    filterOrderProduct(state, action) {
      const { payload } = action;
    },
  },
});

export const { filterOrderProduct } = orderCountSlice.actions;
export default orderCountSlice.reducer;
