var express = require('express');
var router = express.Router();
// fb api 

const adsSdk = require('facebook-nodejs-ads-sdk');

const Campaign = adsSdk.Campaign;
const AdAccount = adsSdk.AdAccount
const accessToken = 'your token id ';
const api = adsSdk.FacebookAdsApi.init(accessToken);
const account = new AdAccount('your acc id');
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
// curd  opretion 
router.get('/create', function (req, res) {
    account
    .createCampaign(
      [],
    {
      [Campaign.Fields.name]: 'Test Campaign - Delete',
      [Campaign.Fields.status]: Campaign.Status.paused,
      [Campaign.Fields.objective]: Campaign.Objective.page_likes
    }
    )
    .then((campaign) => {
      res.status(200).send(campaign)
    })
    .catch(errorFunction(test5));
}

)

// curd  opretion 
router.get('/read', function (req, res) {

    const campaignId = 'your campaignId'
    new Campaign({ 'id': campaignId })
      .read([Campaign.Field.name]) // fields array
      .then((campaign) => { 
        res.status(200).send(campaign)
      })
      .catch(errorFunction)
}

)

router.get('/update', function (req, res) {
    const campaignId = 'your campaign id '
    const newName = 'your  Campaign Name'
    new Campaign({ [Campaign.Field.id]: campaignId, [Campaign.Field.name]: newName })
      .udpate()
      .then((result) => {
        res.status(200).send(result )
      })
      .catch(errorFunction)
}

)

router.get('/delete', function (req, res) {
    const campaignId = 'your campaign id '
    new Campaign({ 'id': campaignId })
      .delete()
      .then((result) => {  res.status(200).send(result) })
      .catch(errorFunction)
}

)




module.exports = router;