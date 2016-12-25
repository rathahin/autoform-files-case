import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Advertisements = new Mongo.Collection('advertisements');

// Deny all client-side updates since we will be using methods to manage this collection
Advertisements.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

Advertisements.helpers({
  advertiseAssociatedImage() {
    return Images.find({_id: this.advertiseImage});
  }
});

AdvertisementSchema = new SimpleSchema({
    advertiseTitle: {
        type: String,
        label: "Title"
    },
    position: {
        type: String,
        label: "Position",
        autoform: {
            type: 'select',
            options: [
                { label: 'In Categroy', value: 'CAT' },
                { label: 'Top', value: 'T' },
                { label: 'Right', value: 'R'},
                { label: 'Bottom', value: 'B'},
                { label: 'Left', value: 'L'}
            ]
        }
    },
    advertiseImage: {
      type: String,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images'
        }
      }
    },
    description: {
        type: String,
        label: 'Description',
        autoform: {
            type: 'textarea'
        }
    },
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.userId();
            }
        },
        autoform: {
            options: function () {
                return _.map(Meteor.users.find().fetch(), function (user) {
                    return {
                        label: user.emails[0].address,
                        value: user._id
                    };
                });
            }
        }
    },
    createdAt: {
        type: Date,
        optional: true,
        autoform: {
            type: "hidden"
        },
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date()};
            } else {
                this.unset();  // Prevent user from supplying their own value
            }
        }
    },
    updatedAt: {
        type: Date,
        optional: true,
        autoform: {
            type: "hidden"
        },
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
        }
    }
});

SimpleSchema.messages({
    required: "[label] is required",
    unique: "[label] is existed"
});

Advertisements.attachSchema(AdvertisementSchema);
