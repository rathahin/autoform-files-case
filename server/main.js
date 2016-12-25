import {Meteor} from 'meteor/meteor';
import grid from 'gridfs-stream';

Meteor.startup(function () {
 //
});

Grid = grid;

Gfs = null;
const mongo = MongoInternals.NpmModules.mongodb.module; // eslint-disable-line no-undef
Gfs = Grid(Meteor.users.rawDatabase(), mongo);
