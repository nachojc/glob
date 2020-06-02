export class EnvironmentSettingsModel {

  production?: boolean;

  api?: {
    AccountDetails?: {},
    CardsDetails?: {},
    CardManagement?: {},
    BranchLocator?: {},
    GlobalPosition?: {},
    FullMenu?: {},
    UserSettings?: {}
    Payments?: {}
    Investments?: {}
    ProductHiring?: {}
  };

  accountDetails?;
  cardsDetails?;
  cardManagement?;
  branchLocator?;
  globalPosition?;
  fullMenu?;
  userSettings?;
  payments?;
  investments?;
  productHiring?;

}

