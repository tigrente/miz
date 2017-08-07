miz.directive("articleEdit", function () {
  return {
      restrict: 'E',
      templateUrl: 'client/guides/components/article-edit/article-edit.ng.html',
      controllerAs: 'ae',
      bindToController: {
        guide: '<'
      },
      controller: function ($scope, $reactive, $stateParams) {

        $reactive(this).attach($scope);

        /* HELPERS */
        this.helpers({
          article: () => {
            return Articles.findOne({
              _id: $stateParams.articleId
            })
          }
        });


        /* SUBSCRIPTIONS */
        this.subscribe('articles');

        /* AUTORUN*/
        this.autorun(() => {

        }); //autorun

        /* FUNCTIONS */
        this.update = function () {
          this.call('updateArticle', $stateParams.articleId, this.editedArticle,
            (err, data) => {
              if (err) {
                alert('Something went wrong updating the article: ' + err);
              }
          });

          this.editing = false;
        }

        this.editArticle = function() {
          this.editing = true;
          this.editedArticle = _.clone(this.article);
        }

        this.isEditing = function() {
          if (this.editing) {
            return this.editing;
          }
          return false;
        }

        /* INITIALIZE */
        this.editing = false;
        this.editedArticle = {};

        //froala WYSIWYG options
        $.FroalaEditor.DEFAULTS.key = 'evjavgjH3fij==';

        this.froalaOptions = {
          toolbarButtons: [
            // 'fullscreen',
            'bold',
            'italic',
            'underline',
            // 'strikeThrough',
            // 'subscript',
            // 'superscript',
            // 'fontFamily',
            // 'fontSize',
            // '|',
            'color',
            // 'emoticons',
            // 'inlineStyle',
            // 'paragraphStyle',
            '|',
            'paragraphFormat',
            // 'align',
            'formatOL',
            'formatUL',
            //'outdent',
            //'indent',
            // 'quote',
            // 'insertHR',
            // '-',  // starts a new row of buttons
            'insertLink',
            // 'insertImage',
            // 'insertVideo',
            // 'insertFile',
            'insertTable',
            'undo',
            'redo',
            'clearFormatting',
            // 'selectAll',
            // 'html'
          ],

          toolbarButtonsMD: [
            'bold',
            'italic',
            'underline',
            'color',
            '|',
            'paragraphFormat',
            'formatOL',
            'formatUL',
            'insertLink',
            'insertTable',
            'undo',
            'redo',
            'clearFormatting',
          ],


          /* quickInsertButtons: [  // quick upload buttons plugin not included below
            // 'image',
            'table',
            'ul',
            'ol',
            'hr'],*/

            //todo: revisit to enable images in Froala
            pluginsEnabled: [  // plug-ins- file uploading and images currently discabled
              'align',
              'colors',
              'entities',
              'font_family',
              'font_size',
              'inline_style',
              'line_breaker',
              'link',
              'lists',
              'paragraph_format',
              'paragraph_style',
              'quote',
              'table',
              'url',
              // 'image',
              // 'draggable'
            ],

            imageUploadURL: '/upload_image',

            charCounterCount: false,  // Disable the character counter

            imageUpload: true, // disable uploading of images
            imagePaste: true   // disable uploading of files
            /*["bold", "italic", "underline", "sep", "align", "insertOrderedList", "insertUnorderedList"]*/
          };
      } // controller
  };//return
});
