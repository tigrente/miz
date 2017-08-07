miz.directive("articleInfo", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/admin/info/article-info/article-info.ng.html',
      controllerAs: 'ai',
      bindToController: {
        articleId: '<',
        guideId: '<'
      },
      controller: function ($scope, $reactive) {
        
        $reactive(this).attach($scope);
        
        /* HELPERS */
        this.helpers({
          article: () => {
            return Articles.findOne({
              _id: this.articleId
            });
          }
        });
        

        /* AUTORUN*/
        this.autorun(() => {

        }); //autorun
        

        /* SUBSCRIPTIONS */ 
        this.subscribe('articles');
        
        /* FUNCTIONS */
        this.editArticle = function() {
          console.log('Editing article..')
        }
        
        this.delete = function() {
          this.call('deleteArticle', this.articleId, (err, data) => {
            if (err) {
              alert('Something went wrong deleting an article: ' + err);
            }
          });
          
          this.call('updateParentGuideWithDeletedChildArticleId', this.articleId, this.guideId, (err) => {
            if (err) {
              alert('Something went wrong trying to update the parent guide: ' + err);
            }
          });
        }

        /* INITIALIZE */

      } // controller
  };  //return
});
