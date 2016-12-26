AutoForm.addInputType('fileUpload', {
  template: 'afFileUpload',
  valueOut() {
    return this.val();
  }
}
);
