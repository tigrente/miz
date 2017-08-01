miz.directive("guideRoomCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room-create/room-create.ng.html',
      controllerAs: 'rc',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          /* SUBSCRIPTIONS */ 
          this.subscribe('cms');

          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun

          /* FUNCTIONS */
          this.createRoom = function () {
            console.log('ROOM', this.room);
            this.call('createGuideRoom', this.room, (err, data) => {
                if (err) {
                    alert('Something went wrong adding new room to database: ' + err);
                }
            });
          };


          /* INITIALIZE */
          this.room = {
            'cmsType': 'room',
            'name': '',
            'adminDesc': '',
            'guides': []
            // Other data added when inserting into DB
          };

          this.submissionDisabled = false; // TODO fix this

      } // controller
  };  //return
});
