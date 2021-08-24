/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  Login: {};
  Admin: {
    // username: string,
  };
  Client: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  TabThree: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type TabThreeParamList = {
  TabThreeScreen: undefined;
};

//LOGIN
export type LoginStackParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignOutScreen: undefined;
  SignUpScreen: undefined;
  ClientSignUpScreen: undefined;
  ForgetPasswordScreen: undefined;
};

//ADMIN
export type BottomTabAdminParamList = {
  Home: undefined;
  Statistic: undefined;
  Comments: undefined;
  Profile: undefined;
};

export type TabAdminHomeParamList = {
  TabAdminHomeScreen: undefined;
  TabAdminHomeOrder: undefined;
  ListOrderNTScreen: undefined;
  DetailBuyHistoryScreen: {
    madh: string
  }
  //
  TabAdminHomeStaff: undefined;
  TabAdminHomeAddStaff: undefined;
  TabAdminHomeEditStaff: {
    itemData: object;
  };
  //
  TabAdminHomeProduct: {
    danhmuc: object;
  };
  TabAdminHomeCategoryProduct: {
    danhmuc: object;
  };
  TabAdminHomeProductList: {
    title: string;
  };
  TabAdminHomeAddProduct: {
    danhmuc: object;
  };
  TabAdminHomeProductDetail: {
    itemData: object;
  };
  TabAdminHomeEditProduct: {
    itemData: object;
  };
};

export type TabAdminStatisticParamList = {
  TabAdminStatisticScreen: undefined;
};

export type TabAdminCommentsParamList = {
  TabAdminCommentsScreen: undefined;
  DetailCommentsScreen: any;
};

export type TabAdminProfileParamList = {
  TabAdminProfileScreen: undefined;
  EditProfileScreen: undefined;
  TabAdminProfilePaymentScreen: undefined;
};

//CLIENT
export type BottomTabClientParamList = {
  Home: undefined;
  Comments: undefined;
  Profile: undefined;
};

export type TabClientHomeParamList = {
  TabClientHomeScreen: undefined;
  DetailProductScreen: undefined;
  CartScreen: undefined;
  CheckOutMethodScreen: {
    total: number;
    dataCart: [];
  }

  CheckOutScreen: {
    total: number;
    dataCart: [];
  };

  CheckOutCashScreen: {
    total: number;
    dataCart: [];
  };

  DetailCommentClientScreen: {
    item: any;
  };
};

export type TabClientCategoriesParamList = {
  ClientCommentsScreen: undefined;
  DetailCommentClientScreenN:any;
};

export type TabClientProfileParamList = {
  ClientProfileScreen: undefined;
  ClientEditProfileScreen: {
    nhathuoc: object;
  };
  BuyHistoryScreen: undefined;
  DetailBuyHistoryScreen: {
    madh: any;
  };
};
