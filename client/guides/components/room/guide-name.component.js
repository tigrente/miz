miz.directive("guideName", function () {
  return {
      restrict: 'E',
      template: '{{ un.guide | safj56dhjh56fguideName }}',
      controllerAs: 'un',
      bindToController: {
        guideId: '<'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({
            guide: () => {
              return Guides.findOne({
                _id: this.getReactively('guideId')
              });
            } 
          });

          /* AUTORUN */
          this.autorun(() => {

          });

          /* SUBSCRIPTIONS */
          this.subscribe('guides');

          /* INITIALIZE */

      } // controller
  };  //return
});


miz.filter('safj56dhjh56fguideName', () => {
  return function (guide) {
    if (!guide) {
      return 'No name';
    }
  
    if (guide.title) {
      return guide.title;
    }
  
    return guide;
  }
});