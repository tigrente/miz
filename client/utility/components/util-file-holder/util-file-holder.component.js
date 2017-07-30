/*********************************************************************************************************
 * <eng-ei-project-tab>
 *     This directive is for editing Early Innovation project information.
 *********************************************************************************************************/


miz.directive("utilFileHolder", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/utility/components/util-file-holder/util-file-holder.ng.html',
        controllerAs: 'ufh',
        scope: true, // create separate copy of scope
        bindToController: {
            file: "=",
            runOnDrop: "&",
            runOnDelete: "&",
            fileDescription: "@"
        },

        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);

            /** Initialize **/

            this.deleteCheck = false;   // a flag to show and hide verification buttons for file deletion


            /***************************************************************************************************
             * logoDropzoneOptions
             * Options for the logo/photo insertion drop zone
             ****************************************************************************************************/

            let thisFile = this; //placeholder for scope in use of methods below

            this.fileHolderDropzoneOptions = {
                maxFilesize: 100,
                uploadMultiple: false,
                addRemoveLinks: true,
                maxFiles: 1,
                dictDefaultMessage: 'Drop your file here, or click to choose',

                accept: (file, done) => {

                    let fileObj = new FS.File(file);
                    fileObj.owner = Meteor.userId();
                    fileObj.createdBy = Meteor.userId();
                    fileObj.description = '';


                    // Must be done on client per guidance so that files chunk properly
                    Files.insert(fileObj, (err, fileObj) => {
                        if (err) {
                            alert(err);// handle error
                        } else {

                            thisFile.file =
                                {
                                    fileId: fileObj._id,
                                    fileName: fileObj.original.name,
                                    fileType: fileObj.original.type,
                                    fileSize: fileObj.original.size,
                                    fileDescription: "Acceptance Report",
                                    // this gives us back the link, even though the file may not be fully uploaded
                                    fileUrl: fileObj.url({brokenIsFine: true})
                                };
                            $scope.$apply();

                            thisFile.runOnDrop();

                        } //accept
                    });
                    done();

                },// accept




            };

            /** HELPERS **/
            this.helpers({});


            /** SUBSCRIPTIONS **/
            /*           this.subscribe('focusEngagement', () => {
             return [
             this.getReactively('focusEngagementId'), //ensure that a selected engagement can be seen
             ]
             });
             */

            /** AUTORUN**/
            /*            this.autorun(() => {


             });*/ //autorun


            /** FUNCTIONS **/


            /***************************************************************************************************
             * fileUrl
             * Gets the url of a file.
             ****************************************************************************************************/
            this.fileUrl = function (file) {
                targetFile = Files.findOne(file.fileId);
                return targetFile.url();
            };

            /***************************************************************************************************
             * deleteFile
             * Deletes file
             ****************************************************************************************************/
            this.deleteFile = function () {
                this.deleteCheck = false;  // make verification buttons disappear.
                this.call('filesDeleteFile', this.file.fileId, (err, result)=>{
                    this.file = null;
                    $scope.$apply();
                    this.runOnDelete(); //use external function to update result
                });


            };


            /***************************************************************************************************
             * fileDataType(file)
             * Returns the file datatype from the file.fileName.  This is used to choose icons
             * for respective files.
             ****************************************************************************************************/
            this.fileDataType = function (file) {
                /* Available file types:
                 doc, docx
                 xls, xlsx
                 ppt, pptx
                 pdf
                 zip
                 */

                if (file.fileName) {
                    return file.fileName.split('.').pop();

                } // else

                return "?";

            };

            /***************************************************************************************************
             * jQuery
             ****************************************************************************************************/
            // this ensures the modal is on top
            //$('#deleteFileModal').appendTo("body")


        } // controller
    }
        ;  //return
})
;


