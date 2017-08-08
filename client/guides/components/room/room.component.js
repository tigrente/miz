miz.directive("guideRoom", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/room/room.ng.html',
      controllerAs: 'rc',
      bindToController: {
        roomName: '@',
        articleDetailSref: '@'
      },
      controller: function ($scope, $reactive) {

        $reactive(this).attach($scope);
        
        
        /* HELPERS */
        this.helpers({
            room: () => {
                return Cms.findOne({
                    name: this.getReactively('roomName')
                });
            },

            guides: () => {
                this.getReactively('room');

                if (this.room) {
                    return Guides.find({
                    _id: {
                        $in: this.room.childrenGuideIds
                    }
                    });
                }
            },

            currentGuide: () => {
                return Guides.findOne();
            },

            articles: () => {
                this.getReactively('currentGuide');

                if (this.currentGuide) {
                  return Articles.find({
                    _id: {
                      $in: this.currentGuide.childrenArticleIds
                    }
                  });
                }
            }
        });
            
        /* SUBSCRIPTIONS */
        this.subscribe('cms');
        this.subscribe('guides');
        this.subscribe('articles');
        
        /* AUTORUN*/
        this.autorun(() => {
            
        }); //autorun
        
        /* FUNCTIONS */
        this.setGuide = function(guide) {
            this.currentGuide = guide;
        }

        this.substring = function (str, ind) {
            if (str && str.length > ind)
              return str.substring(0, ind) + '...';
        }

        /* INITIALIZE */

      } // controller
  };  //return
});
