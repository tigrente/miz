miz.directive("guideRoomCreate", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/create/room-create/room-create.ng.html',
      controllerAs: 'rc',
      controller: function ($scope, $reactive) {

          $reactive(this).attach($scope);

          /* HELPERS */
          this.helpers({

          });


          // TODO fix submission disabling


          /* SUBSCRIPTIONS */ 


          /* AUTORUN*/
          this.autorun(() => {

          }); //autorun


          /* FUNCTIONS */
          this.createRoom = function () {
            this.call('createGuideRoom', this.room, (roomErr, roomData) => {
                if (roomErr) {
                    alert('Something went wrong adding a new room to database: ' + roomErr);
                } else {
                  this.guides.forEach((guide) => {
                    // move articles into seperate array
                    articles = guide.articles;
                    delete guide.articles;

                    // add parentRoomId
                    guide.parentRoomId = roomData;

                    this.call('createGuide', guide, (guideErr, guideData) => {
                      if (guideErr) {
                          alert('Something went wrong adding a new guide to database: ' + guideErr);
                      } else {
                        articles.forEach((article) => {
                          // add guideId
                          article.guideId = guideData;

                          this.call('createArticle', article, (err, data) => {
                            if (err) {
                                alert('Something went wrong adding a new article to database: ' + err);
                            }
                          });
                        });
                      }
                    });
                });
                }
            });
          };


          this.canSubmitCallback = function(canSubmit) {
            this.canSubmit = canSubmit;
            console.log('Got response from guide:', canSubmit);
          };

          this.submittable = function() {
            return this.room.name && this.canSubmit;
          };

          /* INITIALIZE */
          this.room = {
            'cmsType': 'room',
            'name': '',
            'adminDesc': '',
            // Other data added when inserting into DB
          };

          this.guides = [];

          this.canSubmit = false;
      } // controller
  };  //return
});
