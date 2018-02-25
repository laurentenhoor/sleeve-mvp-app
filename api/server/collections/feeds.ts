import { MongoObservable } from 'meteor-rxjs';
import { Feed } from '../models';
 
export const Feeds = new MongoObservable.Collection<Feed>('feeds');