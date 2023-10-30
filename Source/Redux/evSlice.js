import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {endPoints, methods, urlReqType, urls} from '../utils/config';
import RestApiRedux from '../network/RestApiRedux'; 


export const refundRequest = createAsyncThunk(
  'evrms/refundRequest',
  async (rentalId) => {
    let res = await StorageProvider.getObject('accessToken');
    let endPoint = `evrms/plans/evorder/${rentalId}/refund`;
    return RestApiRedux(
      methods.PUT,
      {},
      endPoint,
      urlReqType.DMS,
      res.accesstoken,
    );
  },
);



export const getNearByOperator = createAsyncThunk(
    'evrms/getNearByOperator',
    async (currentLatLong) => {
      let res = await StorageProvider.getObject('accessToken');
      let endPoint = `endPoints.Near_By_Operator/?latitude=${currentLatLong[1]}&longitude=${currentLatLong[0]}`;
      return RestApiRedux(
        methods.PUT,
        {},
        endPoint,
        urlReqType.DMS,
        res.accesstoken,
      );
    },
  );

  export const reAssignEV = createAsyncThunk(
    'evrms/reAssignEV',
    async (rentalOrderID) => {
      let res = await StorageProvider.getObject('accessToken');
      let endPoint = `evrms/plans/evorder/${rentalOrderID}/reassign`;
      return RestApiRedux(
        methods.PUT,
        {},
        endPoint,
        urlReqType.DMS,
        res.accesstoken,
      );
    },
  );

const initialState = {
   operatorList:[],
};

export const evSlice = createSlice({
  name: 'evrms',
  initialState,
  reducers: {
   
  },
  extraReducers(builder) {
    builder
      .addCase(refundRequest.fulfilled, (state, action) => {
        console.log('refundRequest.fulfilled', action);
        if (action?.payload?.message == 'Success') {
       
        }
      })
      .addCase(refundRequest.rejected, (state, action) => {
      
      })  
      .addCase(reAssignEV.fulfilled, (state, action) => {
        console.log('reAssignEV.fulfilled', action);
        if (action?.payload?.message == 'Success') {
        }
      })
      .addCase(reAssignEV.rejected, (state, action) => {
      
      })  
      .addCase(getNearByOperator.fulfilled, (state, action) => {
        console.log('getNearByOperator.fulfilled', action);
        if (action?.payload?.message == 'Success') {
            state.operatorList=action.payload;
        }
      })
      .addCase(getNearByOperator.rejected, (state, action) => {
      
      })  
  },
});
 

export default evSlice.reducer;
