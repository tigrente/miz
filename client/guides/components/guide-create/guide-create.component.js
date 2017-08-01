miz.directive("guideCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/guide-create/guide-create.ng.html',
      controllerAs: 'gc',
      bindToController: {
        guides: '='
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */ 
          
          
          /* FUNCTIONS */
          this.addToGuides = function() {
            console.log('GUIDE', this.guide);
            this.guides.push(this.guide);
            this.reset();
          }
          
          this.reset = function() {
            this.guide = {
              'cmsType': 'guide',
              'guideType': 'blog', // for now, hard code...
              'publish': true, // for now hard code ...
              'hidden': false, // for now, hard code ...
              'title': '',
              'adminDesc': '',
              'articles': []
              // Other data added when inserting into DB
            };
          }

          /* INITIALIZE */
          this.guide = {};
          this.reset();
          
          /* AUTORUN*/
          this.autorun(() => {
            // this.addToGuides(); //Automatically open the container
          }); //autorun


      } // controller
  };  //return
});
