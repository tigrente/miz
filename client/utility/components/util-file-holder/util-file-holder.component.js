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
            runOnDrop: "=",
            fileDescription: "@"
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

            /** Initialize **/

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
                dictDefaultMessage: 'Drop your file here, or click to choose a file',


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

                        } //accept
                    });
                    done();
                    thisFile.runOnDrop();
                }
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
             * updatePaymentSchedule
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.updatePaymentSchedule = function () {

                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagementId, angular.copy(this.paymentSchedule));
                $scope.$apply();

            };

            /***************************************************************************************************
             * fileUrl
             * Gets the url of a file.
             ****************************************************************************************************/
            this.fileUrl = function (file) {
                targetFile = Files.findOne(file.fileId);
                return targetFile.url();
            };

            /***************************************************************************************************
             *
             ****************************************************************************************************/
            this.deleteFile = function ( ) {
                //Files.remove(this.file._id);
                this.file = null;
                this.runOnDrop(); //use external function to update result
                $scope.$apply();
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
                    return extension = file.fileName.split('.').pop();

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


