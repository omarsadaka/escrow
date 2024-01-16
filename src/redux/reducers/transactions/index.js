import {
  ADDNEWTRANSACTIONGeneralDetails,
  ADDNEWTRANSACTIONItem,
  REMOVENEWTRANSACTION,
  EditNEWTRANSACTION,
  UPDATE_PRICE,
  ADDCATEGORY,
  CONFIRMED,
} from "../../actions/transactions/index";

const initialState = {
  item: [],
  Discount: "",
  IsPercentage: "",
  SaudiEscrowFeePaidBy: "",
  ShippingFeePaidBuy: "",
  BuyerShippingCost: "",
  userPrice: "",
  Category: "",
  CategoryID: "",
  CategoryImage: "",
  Title: "",
  Details: "",
  expiry_date: "",
  inspection_period: "",
  userType: "",
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADDNEWTRANSACTIONGeneralDetails:
      // console.log('in add...',{...action.payload,'item':state.item.push(action.payload.item)});
      return {
        ...state,
        Discount: action.payload.Discount,
        IsPercentage: action.payload.IsPercentage,
        SaudiEscrowFeePaidBy: action.payload.SaudiEscrowFeePaidBy,
        ShippingFeePaidBuy: action.payload.ShippingFeePaidBuy,
        BuyerShippingCost: action.payload.BuyerShippingCost,
        expiry_date: action.payload.expiryDate,
        inspection_period: action.payload.inspectionPeriod,
      };
    case ADDNEWTRANSACTIONItem:
      const arr = [...state.item];
      arr.push(action.payload.item);

      return {
        ...state,
        item: arr,
      };

    case REMOVENEWTRANSACTION:
      console.log("in remove...");
      const newState = state.item.filter((el) => el.id != action.payload);

      return {
        ...state,
        item: newState,
      };
    case UPDATE_PRICE:
      return {
        ...state,
        userPrice: action.value.amount,
        Title: action.value.title,
        Details: action.value.details,
        userType: action.value.type,
      };

    case EditNEWTRANSACTION:
      const newUpdatedITemID = action?.payload?.item?.id;
      const newArr = state.item.filter((el) => el.id != newUpdatedITemID);
      newArr.push(action?.payload?.item);
      return { ...state, item: newArr };
    case ADDCATEGORY:
      return {
        ...state,
        Category: action.value.category,
        CategoryID: action.value.categoryId,
        CategoryImage: action.value.categoryImage,
      };
    case CONFIRMED:
      return {
        ...state,
        item: [],
        Discount: "",
        IsPercentage: "",
        SaudiEscrowFeePaidBy: "",
        ShippingFeePaidBuy: "",
        BuyerShippingCost: "",
        userPrice: "",
        Category: "",
        CategoryID: "",
        CategoryImage: "",
        Title: "",
        Details: "",
        expiry_date: "",
        inspection_period: "",
        userType: "",
      };
    default:
      return state;
  }
};
