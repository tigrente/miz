miz.directive("articleCreate", function () {
  return {
    restrict: 'E',
    templateUrl: 'client/guides/components/create/article-create/article-create.ng.html',
    controllerAs: 'ac',
    bindToController: {
      guide: '<',
      ind: '<'
    },
    controller: function ($scope, $reactive) {

      $reactive(this).attach($scope);
      
      /* HELPERS */
      this.helpers({
        
      });
      
      /* AUTORUN*/
      this.autorun(() => {

      }); //autorun
      
      this.reset = function() {
        this.article = {
          'cmsType': 'article',
          'articleType': 'blogWithFiles', // for now, hard code...
          'publish': 'preview',
          'articleImage': null, // for later...
          'files': [], // for later...
          'title': '',
          'body': "<i>This is a auto-generated body stub. Click here to edit!</i>"
          // Other data added when inserting into DB
        };
      }

      this.submit = function() {
        this.hide();

        this.call('createArticle', this.article, (err, data) => {
          if (err) {
            alert('Something went wrong adding a new article to database: ' + err);
          } else {

            this.call('updateParentGuideWithChildArticleId', data, this.guide._id, (err) => {
              if (err) {
                alert('Something went wrong trying to update the parent guide room: ' + err);
              }
            });

          }
        });
      }

      this.hide = function() {
        $('.injected-table-view').eq(this.ind).hide();
      }

      this.canSubmitFn = function() {
        // check that all guides have require properties
        return this.article.title && this.article.body;
      };
      
      /* INITIALIZE */
      this.article = {};
      this.reset();

    } // controller
  };  //return
});
    