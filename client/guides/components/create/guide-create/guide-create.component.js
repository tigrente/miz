miz.directive("guideCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/create/guide-create/guide-create.ng.html',
      controllerAs: 'gc',
      bindToController: {
        guides: '=',
        canSubmitFn: '&'
      },
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */ 
          
          
          /* FUNCTIONS */
          this.addToGuides = function() {
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
          
          this.canSubmitCallback = function(canSubmit) {
            this.canSubmits = canSubmit;
            console.log('Got respose from article:', canSubmit);
          };
          
          this.submittable = function() {
            this.canSubmitFn(this.guide.title); //really weird..why does this work ?? would expect it to be !== ...
          }

          /* INITIALIZE */
          this.guide = {};
          this.reset();

          this.canSubmits = false;
          
          /* AUTORUN*/
          this.autorun(() => {
            this.addToGuides(); //Automatically open container
          }); //autorun


      } // controller
  };  //return
});
