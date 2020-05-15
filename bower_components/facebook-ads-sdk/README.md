# Facebook Ads API SDK for Javascript [![Build Status](https://travis-ci.org/lucascosta/facebook-js-ads-sdk.svg?branch=master)](https://travis-ci.org/lucascosta/facebook-js-ads-sdk) [![Marketing API Version](https://img.shields.io/badge/marketing--api-2.9-brightgreen.svg)](https://developers.facebook.com/docs/marketing-apis)

![Marketing API Banner](https://raw.githubusercontent.com/lucascosta/facebook-js-ads-sdk/master/marketingapi.png)

A Javascript SDK for [**Facebook Ads API**](https://developers.facebook.com/docs/ads-api) development in both client and server-side. ECMAScript 5 bundled minified distribuitions with sourcemaps are also available as AMD and CommonJS modules, as an IIFE (under the `fb` variable), as UMD if you want it all, and even as Browser Globals. Runs "anywhere" thanks to [Babel](https://babeljs.io/) and [Rollup](http://rollupjs.org/). It is consistent with many concepts from Python and PHP SDKs in a JS fashion, with some simplifications and tweaks. This is not an official library.

## Example

```javaScript
const adsSdk = require('facebook-ads-sdk');

const accessToken = 'VALID_ACCESS_TOKEN'
const accountId = 'AD_ACCOUNT_ID'

const FacebookAdsApi = adsSdk.FacebookAdsApi.init(accessToken)
const AdAccount = adsSdk.AdAccount
const Campaign = adsSdk.Campaign

const account = new AdAccount({ 'id': accountId })
const insightsFields = ['impressions', 'frequency', 'unique_clicks', 'actions', 'spend', 'cpc']
const insightsParams = { date_preset: Campaign.DatePreset.last_90d }
var campaigns

account.read([AdAccount.Field.name])
  .then((account) => {
    account.getInsights(insightsFields, insightsParams)
      .then((actInsights) => console.log(account, actInsights))
      .catch(console.error)
    return account.getCampaigns([Campaign.Field.name], { limit: 10 }) // fields array and params
  })
  .then((result) => {
    campaigns = result
    const campaign_ids = campaigns.map((campaign) => campaign.id)
    const campaignInsightsParams = Object.assign({
      level: 'campaign',
      filtering: [{ field: 'campaign.id', operator: 'IN', value: campaign_ids }]
    }, insightsParams)
    const campaigsInsightsFields = insightsFields.concat('campaign_id')
    return account.getInsights(campaigsInsightsFields, campaignInsightsParams)
  })
  .then((insights) => console.log(campaigns, insights))
  .catch(console.error)
```

## Installation

#### NPM

`npm install --save facebook-ads-sdk`

#### Bower

`bower install --save facebook-ads-sdk`

### Promises

This SDK returns [**Promises**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), a neat way to handle asynchronous requests. You should provide a polyfill if you intend to make this available in not supporting environments (check a [compatibility table](https://kangax.github.io/compat-table/es6/#test-Promise)). [Bluebird](http://bluebirdjs.com/docs/getting-started.html) seems a good choice and it's used here in Node through [request-promise](https://github.com/request/request-promise) and in browser unit tests.

## Usage

### Access Token

To instantiate an Api object you will need a valid [access token](https://developers.facebook.com/docs/marketing-api/authentication) for an app with the `ads_management` permission. A quick way to obtaining a short-lived token is using the [Graph API Explorer](https://developers.facebook.com/tools/explorer/). Instantiate the API using the token:

```javaScript
const FacebookAdsApi = require('facebook-ads-sdk').FacebookAdsApi;
const api = FacebookAdsApi.init(accessToken)
```

Once instantiated, the Api object be refered by the Graph objects. You can also directly assign an Api instance to an object, which enables using different tokens.

#### Debugging

A `FacebookAdsApi` object offers a debugging mode that will log all requests. To enable it just call `api.setDebug(true)` on an API instance.

### Facebook Objects

The currently supported objects are located in 'src/objects'. If the object need is not available or it doesn't posses a method you want you may add it and make a Pull Request, or ask for it in the Issues if you can't.

```javascript
// instantiating an object
const AdAccount = require('facebook-ads-sdk').AdAccount;
const account = new AdAccount({'id': 'AD_ACCOUNT_ID'}) // set data on instantiation
console.log(account.id) // fields can be accessed as properties
```

#### CRUD operations

Most of Facebook's Objects can perform Create, Read, Update, and Delete operations. Enums such as `Field` and other constants are provided by the classes to improve maintainability.

##### Create

```javascript
const Campaign = require('facebook-ads-sdk').Campaign;
const accountId = 'AD_ACCOUNT_ID'
const data = {
  [Campaign.Field.name]: 'Campaign Name',
  [Campaign.Field.status]: Campaign.Status.paused
}
new Campaign(data, accountId) // set data and parent ID on instantiation
  .create()
  .then((campaign) => { console.log(campaign.id) })
  .catch(errorFunction)
```

##### Read

```javascript
const Campaign = require('facebook-ads-sdk').Campaign;
const campaignId = 'CAMPAIGN_ID'
new Campaign({ 'id': campaignId })
  .read([Campaign.Field.name]) // fields array
  .then((campaign) => { console.log(campaign.name) })
  .catch(errorFunction)
```

An easy way to read a set of objects is to get them by their ids:

```javascript
const campaignIds = ['CAMPAIGN_A_ID', 'CAMPAIGN_B_ID']
Campaign.getByIds(campaignIds)
  .then((campaigns) => { console.log(campaigns[0], campaigns[1]) })
  .catch(errorFunction)
```

##### Update

```javascript
const Campaign = require('facebook-ads-sdk').Campaign;
const campaignId = 'CAMPAIGN_ID'
const newName = 'New Campaign Name'
new Campaign({ [Campaign.Field.id]: campaignId, [Campaign.Field.name]: newName })
  .udpate()
  .then((result) => { console.log(result.success) })
  .catch(errorFunction)
```

##### Delete

```javascript
const Campaign = require('facebook-ads-sdk').Campaign;
const campaignId = 'CAMPAIGN_ID'
new Campaign({ 'id': campaignId })
  .delete()
  .then((result) => { console.log(result.success) })
  .catch(errorFunction)
```

#### Edges and Cursor-based Pagination

When fetching nodes related to another (Edges) or a collection in the graph, the results are paginated in a `Cursor` class. Here the `Cursor` is a superpowered `Array` (with all it's native helpful operations) with `next` and `previous` methods that when resolved fills itself with the new set of objects. This should be great for reactive template systems.

Here's an example suposing we have currently 17 campaigns in an Ad Account:

```javascript
const AdAccount = require('facebook-ads-sdk').AdAccount;
const account = new AdAccount({'id': 'AD_ACCOUNT_ID'})
account.getCampaigns([Campaign.Field.name], { limit: 10 }) // fields array and params
.then((campaigns) => {
  console.log(campaigns.length) // 10
  console.log(campaigns.hasNext()) // true
  return campaigns.next()
}
.then((campaigns) => { // this is the same Cursor object instance
  console.log(campaigns.length) // 7
  console.log(campaigns.hasNext()) // false
  console.log(campaigns.hasPrevious()) // true
  return campaigns.previous()
}
.then((campaigns) => {
  console.log(campaigns.length) // 10
}
.catch(errorFunction)
```

## Development

### Dependencies

[Gulp](http://gulpjs.com/) and [Bower](http://bower.io/) should be installed globally. Install depencencies:

``` bash
npm install
bower install
```

Checkout `gulpfile.js` for all available tasks.

### Style

This package uses [StandardJS](http://standardjs.com/). Inconsistent code will break tests.

### Unit Tests

Unit tests run in Node.js, PhantomJS, and in Browsers. Travis CI will run both Node and PhantomJS tests to ensure isomorphism. 

* The default `gulp` task  will watch the files and run the Node tests repeatedly.
* `gulp test` will run the Node tests.
* `gulp test-phantom` will run tests against the PhatomJS headless browser.
* `gulp test-browser` will open your system browser with the tests.

Front-end tests rely on a bundle processed before the tests. You can use `gulp watch-bundle` to bundle as the code changes.

### Integration Tests

Integration tests run a few basic operations to ensure API connectivity. To run them, you'll need to setup a `config.json` file in `tests/integration`. Copy the `config.sample` and fill `accessToken` and `accountId`.

* `gulp integration` will run integration tests on Node.
* `gulp integration-browser` will open your system browser with the tests. Useful if you'd like to inspect the requests.
