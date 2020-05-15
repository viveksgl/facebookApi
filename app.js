const adsSdk = require('facebook-nodejs-business-sdk');
const accessToken = 'your Token';
const api = adsSdk.FacebookAdsApi.init(accessToken);
 
const Ad = adsSdk.Ad;
 
const AdAccount = adsSdk.AdAccount;
const account = new AdAccount('your Ac ID');
const Campaign = adsSdk.Campaign;
  

 
const showDebugingInfo = false;
if (showDebugingInfo) {
  api.setDebug(true);
}

const errorFunction = (scenarioName) => {
  let returnFunction = (error) => {
    console.log('An error occurred while processing, ' + scenarioName);
    console.log('Error Message:' + error);
    console.log('Error Stack:' + error.stack);
  };
  return returnFunction;
};

const logPassedTest = (testName, data) => {
  console.log(testName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let test1 = 'Node.js read';
account
  .read([AdAccount.Fields.name, AdAccount.Fields.id])
  .then((account) => {
    logPassedTest(test1 + ':Pass', account);
  })
  .catch(errorFunction(test1));

 



   
  
  let test3 = 'Node.js getInsights Edge';
const insightsFields =
  ['impressions', 'frequency', 'unique_clicks', 'actions', 'spend', 'cpc'];
new Campaign('23844710220410186')
  .getInsights(insightsFields, {})
  .then((insight) => { logPassedTest(test3 + ':Pass', insight); })
  .catch(errorFunction(test3));
    
    
  let test7 = 'CRUD Campaign';
  let campaignIdToDelete;
  account
    .createCampaign(
      [Campaign.Fields.status],
    {
      [Campaign.Fields.name]: 'Test Campaign - Delete',
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.objective]: Campaign.Objective.page_likes
    }
    )
  .then((campaign) => {
    logPassedTest(test7 + '-Create:Pass', campaign);
    campaignIdToDelete = campaign.id;
    return new Campaign(campaign.id)
    .read([Campaign.Fields.id, Campaign.Fields.name, Campaign.Fields.objective]);
  })
  .then((campaign) => {
    logPassedTest(test7 + '-Read:Pass', campaign);
    return new Campaign(campaign.id, {
      [Campaign.Fields.id]: campaign.id,
      [Campaign.Fields.name]: 'Test Campaign - Updated' })
      .update();
  })
  .then((campaign) => {
    logPassedTest(test7 + '-Update:Pass', campaign);
    return new Campaign(campaignIdToDelete)
    .delete();
  })
  .then((result) => {
    logPassedTest(test7 + '-Delete:Pass', result);
  })
  .catch(errorFunction(test7));
  
 
  
   
  
   
