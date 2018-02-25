import { Feeds } from './collections/feeds'

Meteor.publish('feeds', function () {
    return Feeds.collection.find({}, {});
});