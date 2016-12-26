/*let getCollection = function(context) {
  if (typeof context.atts !== 'undefined' && typeof context.atts.collection === 'string') {

    if (context.value != '') {
      console.log('content::->  ' + context.value);
    }
    return global[context.atts.collection] || window[context.atts.collection];
  } else {
    return undefined;
  }
};

let getDocument = function(context) {
  let collection = getCollection(context);
  return (typeof collection !== 'undefined') ? collection.findOne({_id:context.value}) : undefined;
};

Template.afFileUpload.onCreated(function() {
  let self = this;
  this.value = new ReactiveVar(this.data.value);

  this._stopInterceptValue = false;
  this._interceptValue = ctx => {
    if (!this._stopInterceptValue) {
      let t = Template.instance();
      if (t.value.get() !== false && t.value.get() !== ctx.value && __guard__(ctx.value, x => x.length) > 0) {
        t.value.set(ctx.value);
        return this._stopInterceptValue = true;
      }
    }
  };

  this.collection      = Meteor.connection._mongo_livedata_collections[this.data.atts.collection];
  this.uploadTemplate  = this.data.atts.uploadTemplate || null;
  this.previewTemplate = this.data.atts.previewTemplate || null;

  if (!this.collection) {
    throw new Meteor.Error(404, '[meteor-autoform-files] No such collection "' + this.data.atts.collection + '"');
  }

  this.collectionName = function () {
    return self.data.atts.collection;
  };

  this.currentUpload  = new ReactiveVar(false);
  this.inputName      = this.data.name;
  this.fileId         = new ReactiveVar(this.data.value || false);

  return;
});

Template.afFileUpload.onRendered(function() {
  let self = this;
  return $(self.firstNode).closest('form').on('reset', () => self.value.set(false));
});

Template.afFileUpload.helpers({
  label() {
    return this.atts.label || 'Choose file';
  },
  removeLabel() {
    return this.atts.removeLabel || 'Remove';
  },
  value() {
    let doc = getDocument(this);
    return (typeof doc !== 'undefined') && doc._id;
  },
  uploadedFile: function () {
    Template.instance()._interceptValue(this);
    return getDocument(this);
  },
  schemaKey() {
    return this.atts['data-schema-key'];
  },
  previewTemplateData() {
    return {
      file: getDocument(this),
      atts: this.atts
    };
  },
  removeFileBtnTemplate() {
    return __guard__(this.atts, x => x.removeFileBtnTemplate) || 'afFileRemoveFileBtnTemplate';
  },
  selectFileBtnTemplate() {
    return __guard__(this.atts, x => x.selectFileBtnTemplate) || 'afFileSelectFileBtnTemplate';
  },
  selectFileBtnData() {
    return {
      label: this.atts.label || 'Choose file',
      accepts: this.atts.accepts
    };
  },
  uploadProgressTemplate() {
    return __guard__(this.atts, x => x.uploadProgressTemplate) || 'afFileUploadProgress';
  }
});

Template.afFileUpload.events({
  'click [data-reset-file]': function (e, template) {
    e.preventDefault();
    template.fileId.set(false);
    return false;
  },
  'click [data-remove-file]': function (e, template) {
    e.preventDefault();
    template.fileId.set(false);
    try {
      this.remove();
    } catch (error) {}
    return false;
  },
  'change [data-files-collection-upload]': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var upload = global[template.collectionName()].insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        AutoForm.getValidationContext().resetValidation();
        template.currentUpload.set(this);
        return;
      });

      upload.on('error', function (error) {
        AutoForm.getValidationContext().resetValidation();
        AutoForm.getValidationContext().addInvalidKeys([{name: Template.instance().inputName, type: "uploadError", value: error.reason}]);
        $(e.currentTarget).val('');
        return;
      });

      upload.on('end', function (error, fileObj) {
        if (!error) {
          if (template) {
            template.fileId.set(fileObj._id);
          }
        }
        template.currentUpload.set(false);
        return;
      });

      upload.start();
    }
  }
});

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}*/

Template.afFileUpload.onCreated(function () {
  var self = this;

  if (!this.data) {
    this.data = {
      atts: {}
    };
  }

  this.collection      = Meteor.connection._mongo_livedata_collections[this.data.atts.collection];
  this.uploadTemplate  = this.data.atts.uploadTemplate || null;
  this.previewTemplate = this.data.atts.previewTemplate || null;

  if (!this.collection) {
    throw new Meteor.Error(404, '[meteor-autoform-files] No such collection "' + this.data.atts.collection + '"');
  }

  this.collectionName = function () {
    return self.data.atts.collection;
  };

  this.currentUpload  = new ReactiveVar(false);
  this.inputName      = this.data.name;
  this.fileId         = new ReactiveVar(this.data.value || false);
  return;
});

Template.afFileUpload.helpers({
  previewTemplate: function () {
    return Template.instance().previewTemplate;
  },
  uploadTemplate: function () {
    return Template.instance().uploadTemplate;
  },
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  },
  fileId: function () {
    return Template.instance().fileId.get();
  },
  uploadedFile: function () {
    return global[Template.instance().collectionName()].findOne({
      _id: this.value
    });
  }
});

Template.afFileUpload.events({
  'click [data-reset-file]': function (e, template) {
    e.preventDefault();
    template.fileId.set(false);
    return false;
  },
  'click [data-remove-file]': function (e, template) {
    e.preventDefault();
    template.fileId.set(false);
    try {
      this.remove();
    } catch (error) {}
    return false;
  },
  'change [data-files-collection-upload]': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var upload = global[template.collectionName()].insert({
        file: e.currentTarget.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);

      upload.on('start', function () {
        AutoForm.getValidationContext().resetValidation();
        template.currentUpload.set(this);
        return;
      });

      upload.on('error', function (error) {
        AutoForm.getValidationContext().resetValidation();
        AutoForm.getValidationContext().addInvalidKeys([{name: Template.instance().inputName, type: "uploadError", value: error.reason}]);
        $(e.currentTarget).val('');
        return;
      });

      upload.on('end', function (error, fileObj) {
        if (!error) {
          if (template) {
            template.fileId.set(fileObj._id);
          }
        }
        template.currentUpload.set(false);
        return;
      });

      upload.start();
    }
  }
});
