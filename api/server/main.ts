import { Meteor } from 'meteor/meteor';
import { Feeds } from './collections/feeds';

import { FeedType } from './models';

Meteor.startup(() => {
  // code to run on server at startup

  if (Feeds.find({}).cursor.count() === 0) {
    let feedId;

    feedId = Feeds.collection.insert({
      type: FeedType.SMART,
      amount: 70.87378640776699,
      weights: [60, -13],
      errorCode: 0,
      timestamp: Date.now()
    });
  }
  
});
