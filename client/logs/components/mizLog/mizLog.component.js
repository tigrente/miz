/**
 * Created by Alex on 10/6/15.
 */
/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <log>
 *     This directive is a fundamental component for displaying the history of an engagement or partner.
 *     It enables entry of text and attachments by date.   It is usually placed inside the partner or
 *     engagement component.
 *********************************************************************************************************/

/**
 * @typedef {Object} miz
 * @method this.call
 */

miz.directive("mizLog", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/logs/components/mizLog/miz-log.ng.html',
        controllerAs: 'ml',
        scope: {
            subjectId: "@",
            children: "@",
            latestLink: "@",  // link to "latest" status of parent
            updateCurrentStatusFn: "&"
        },
        bindToController: true,

        controller: function ($scope, $reactive, $element) {


            $reactive(this).attach($scope);

            /** Initialize **/

            this.updateLatestStatus = true;  //check box on log entries that updates latest status with headline of entry

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


                /*                quickInsertButtons: [  // quick upload buttons plugin not included below
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

            this.uploadLock = 0; //lock to prevent saving while uploads are still occuring

            this.newEntryTriggered = false;
            this.editEntryTriggered = false;
            this.limit = 5;
            this.sort = 'newestFirst';
            this.newLogEntry = {
                date: new Date(),
                subjectId: this.subjectId,
                subEntries: [
                    {
                        headline: "",
                        details: "",
                        files: []
                    },
                    {
                        headline: "",
                        details: "",
                        files: []
                    },
                    {
                        headline: "",
                        details: "",
                        files: []
                    },
                    {
                        headline: "",
                        details: "",
                        files: []
                    },
                    {
                        headline: "",
                        details: "",
                        files: []
                    }
                ]

            };
            this.limit = 30; //used for infinite scrolls

            //flags to control subentry display in new entry creation
            this.displayNewEntrySubEntry = [
                true,
                false,
                false,
                false,
                false
            ];
            this.displayEditEntrySubEntry = [
                true,
                false,
                false,
                false,
                false
            ];

            //Holder for editing files of existing entries
            this.fileEditEntry = null;
            this.fileEditSubEntryIndex = null;


            /** HELPERS **/

            this.helpers({

                noNewEntryFiles: () => {
                    this.getReactively('newLogEntry.subEntries[0].files', true);
                    this.getReactively('newLogEntry.subEntries[1].files', true);
                    this.getReactively('newLogEntry.subEntries[2].files', true);
                    this.getReactively('newLogEntry.subEntries[3].files', true);
                    this.getReactively('newLogEntry.subEntries[4].files', true);


                    for (let i = 0; i < 5; i++) {
                        if (this.newLogEntry.subEntries[i].files.length != 0)
                            return false;
                    }

                    return true;

                },

                //Featured partner to be displayed and modified
                logEntries: () => {
                    this.getReactively('this.sort');
                    if (this.sort === "newestFirst") {
                        sortByDate = -1;
                    } else if (this.sort === "oldestFirst") {
                        sortByDate = 1;
                    }


                    return Logs.find({}, {sort: {date: sortByDate}});

                },

                files: () => {
                    return Files.find();
                }

            });


            /** SUBSCRIPTIONS **/
            this.subscribe('logEntries', () => {
                return [
                    this.getReactively('subjectId'),
                    this.getReactively('limit'),
                    this.getReactively('sort')
                ]
            });

            this.subscribe('files');


            /** AUTORUN**/
/*            this.autorun(() => {

                this.getReactively('this.subjectId');

                if (this.newEntryTriggered) {
                    alert("Warning: Your log entry was not saved!");
                    this.resetNewEntry();
                    this.newEntryTriggered = false;
                }


            }); //autorun*/


            /** FUNCTIONS */

            /***************************************************************************************************
             * updateHeadline
             * Updates headline of entry.  Takes entryId and index of headline
             ****************************************************************************************************/

            this.updateHeadline = function (entryId, subentryIndex, newHeadline) {
                this.call('logsUpdateHeadline', entryId, subentryIndex, newHeadline, (err) => {

                    if (err)
                        alert("Something went wrong trying to update a headline in the logs database: " + err)
                });


            };


            /***************************************************************************************************
             * fileDropzoneOptions
             * Options for the file insertion dropZones - Can this support multiple drop zones?!?
             ****************************************************************************************************/


            let thisLog = this;  //place holder for changing scope of methods below

            //initialize
            this.ingestedFileIndexArray = [-1, -1, -1, -1, -1];

            let generateDropzoneOptions = (entryNumber) => {

                return {
                    //self: this,
                    //acceptedFiles: 'image/*',
                    maxFilesize: 50, //mb
                    uploadMultiple: true,
                    addRemoveLinks: true,
                    maxFiles: 50,
                    dictDefaultMessage: 'Drop your files here, or click to choose a file',
                    previewsContainer: false,
                    entryNumber: entryNumber,


                    init: function () {

                        this.on("complete", function (file) {

                            this.removeFile(file);
                            if (thisLog.uploadLock > 0)
                                --thisLog.uploadLock;


                        });

                        this.on('error', function (file, error) {
                            //alert (error);
                        });


                        this.on("uploadprogress", function (file, progress, bytesSent) {

                            var fileEntry = thisLog.newLogEntry.subEntries[file.entryNumber].files[file.index];

                            fileEntry.fileDropzoneUploadProgress = progress;
                            fileEntry.fileDropzoneUploadProgressStyle = {
                                "width": progress.toString() + '%',
                                "height": "10px"
                            };


                        });


                    },

                    accept: (file, done) => {

                        // adding in a marker so we know which DZ upload progress bar to update
                        file.entryNumber = entryNumber;
                        file.index = ++thisLog.ingestedFileIndexArray[entryNumber];

                        ++thisLog.uploadLock;

                        var fileObj = new FS.File(file);
                        fileObj.owner = Meteor.userId();
                        fileObj.createdBy = Meteor.userId();
                        fileObj.subjectId = $scope.subjectId;   // the partner or engagement
                        fileObj.description = '';


                        // Must be done on client per CollectionFS guidance so that files chunk properly
                        Files.insert(fileObj, function (err, fileObj) {
                            if (err) {
                                alert(err);// handle error
                            } else {

                                ++thisLog.uploadLock;
                                //add file link to log entry
                                thisLog.newLogEntry.subEntries[entryNumber].files.push(angular.copy(
                                    {
                                        fileId: fileObj._id,
                                        fileName: fileObj.original.name,
                                        fileType: fileObj.original.type,
                                        fileSize: fileObj.original.size,
                                        description: "",
                                        // this gives us back the link, even though the file may not be fully uploaded
                                        fileUrl: fileObj.url({brokenIsFine: true}),
                                        fileProcessing: true,  // the file is still being uploaded and ingested
                                        fileDropzoneUploadProgress: 0,
                                        fileCfsUploadProgress: 0
                                    }
                                ));

                                // observe the file upload and disable saving until it is complete...

                                thisLog.fileUploading = true;
                                var cursor = Files.find(fileObj._id);
                                var liveQuery = cursor.observe({
                                    changed: function (newFile) {
                                        var index = thisLog.newLogEntry.subEntries[entryNumber].files.findIndex(x => x.fileId == fileObj._id); // get index of log file entry
                                        var fileEntry = thisLog.newLogEntry.subEntries[entryNumber].files[index];

                                        var progressFunc = function () {
                                            return fileObj.uploadProgress();
                                        };

                                        if (newFile.isUploaded()) {
                                            liveQuery.stop();
                                            fileEntry.fileProcessing = false;
                                            if (thisLog.uploadLock > 0) //address when errors (e.g. file to big) may cause an extra decrement
                                                --thisLog.uploadLock;
                                        } else {
                                            thisLog.fileUploading = true;
                                            fileEntry.fileCfsUploadProgress = progressFunc();
                                            fileEntry.fileCfsUploadProgressStyle = {
                                                "width": progressFunc().toString() + '%',
                                                "height": "10px"
                                            };


                                        }
                                    }
                                })

                            }
                        });

                        done();
                    }


                    //$(".dz-progress").remove();  // hiding progress bar, otherwise it stays there...


                };

            };

            this.newEntryDropzoneOptions0 = generateDropzoneOptions(0);
            this.newEntryDropzoneOptions1 = generateDropzoneOptions(1);
            this.newEntryDropzoneOptions2 = generateDropzoneOptions(2);
            this.newEntryDropzoneOptions3 = generateDropzoneOptions(3);
            this.newEntryDropzoneOptions4 = generateDropzoneOptions(4);
            //this.fileEditDropzoneOptions = generateDropzoneOptions(this.fileEditSubEntryIndex);


// Dropzone for file-edit-modal
            this.fileEditDropzoneOptions = {
                maxFilesize: 100,
                uploadMultiple: true,
                addRemoveLinks: false,
                maxFiles: 50,
                dictDefaultMessage: 'Drop your files here, or click to choose a file',
                previewsContainer: false,

                init: function () {

                    this.on("complete", function (file) {

                        this.removeFile(file);
                        if (thisLog.uploadLock > 0)
                            --thisLog.uploadLock;


                    });

                    this.on('error', function (file, error) {
                        // alert (error);
                        // todo: This will return server error 0 if enabled
                    });


                    this.on("uploadprogress", function (file, progress, bytesSent) {

                        //Locator to identify which progress bar to update
                        //We put the file progress and styling inside the file entry
                        var fileEntry = thisLog.fileEditEntry.subEntries[thisLog.fileEditSubEntryIndex].files[file.index];

                        fileEntry.fileDropzoneUploadProgress = progress;
                        fileEntry.fileDropzoneUploadProgressStyle = {
                            "width": progress.toString() + '%',
                            "height": "10px"
                        };


                    });

                },


                accept: (file, done) => {

                    // adding in a marker so we know which DZ upload progress bar to update
                    file.entryNumber = thisLog.fileEditSubEntryIndex;
                    file.index = thisLog.fileEditEntry.subEntries[thisLog.fileEditSubEntryIndex].files.length;

                    ++thisLog.uploadLock;

                    var fileObj = new FS.File(file);
                    fileObj.owner = Meteor.userId();
                    fileObj.createdBy = Meteor.userId();
                    fileObj.subjectId = this.subjectId;   // the partner or engagement
                    fileObj.description = '';


                    // Must be done on client per guidance so that files chunk properly
                    Files.insert(fileObj, (err, fileObj) => {
                        if (err) {
                            alert(err);// handle error
                        } else {

                            ++thisLog.uploadLock;

                            thisLog.fileEditEntry.subEntries[thisLog.fileEditSubEntryIndex].files.push(angular.copy(
                                {
                                    fileId: fileObj._id,
                                    fileName: fileObj.original.name,
                                    fileType: fileObj.original.type,
                                    fileSize: fileObj.original.size,
                                    fileDescription: "",
                                    // this gives us back the link, even though the file may not be fully uploaded
                                    fileUrl: fileObj.url({brokenIsFine: true}),
                                    fileProcessing: true,  // the file is still being uploaded and ingested
                                    fileDropzoneUploadProgress: 0,
                                    fileCfsUploadProgress: 0
                                }
                            ));

                            thisLog.fileUploading = true;
                            let cursor = Files.find(fileObj._id);
                            let liveQuery = cursor.observe({
                                changed: function (newFile) {
                                    let index = thisLog.fileEditEntry.subEntries[thisLog.fileEditSubEntryIndex].files.findIndex(x => x.fileId == fileObj._id); // get index of log file entry
                                    let fileEntry = thisLog.fileEditEntry.subEntries[thisLog.fileEditSubEntryIndex].files[index];

                                    let progressFunc = function () {
                                        return fileObj.uploadProgress();
                                    };

                                    if (newFile.isUploaded()) {
                                        liveQuery.stop();
                                        fileEntry.fileProcessing = false;
                                        if (thisLog.uploadLock > 0) //address when errors (e.g. file to big) may cause an extra decrement
                                            --thisLog.uploadLock;
                                    } else {
                                        thisLog.fileUploading = true;
                                        fileEntry.fileCfsUploadProgress = progressFunc();
                                        fileEntry.fileCfsUploadProgressStyle = {
                                            "width": progressFunc().toString() + '%',
                                            "height": "10px"
                                        };


                                    }
                                }
                            });


                            this.call('logsUpdateFiles', angular.copy(this.fileEditEntry), this.fileEditSubEntryIndex, (err) => {
                                if (err)
                                    alert("Something went wrong trying to update the logs database: " + err)
                            });


                        } //accept
                    });
                    done();
                }
            };


            /***************************************************************************************************
             * addMoreEntries(file)
             * Increases limit passed to server - used with ngInfiniteScroll
             ****************************************************************************************************/
            this.addMoreEntries = function () {
                this.limit = this.limit + 10;
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
             * removeFileFromNewSubEntry(subEntryIndex, file)
             * Removes the current file from the log entry.  Deletes file from DB and removes file metadata from
             * newLogEntry.SubEntry.  If file is uploading, takes action to reset progress indexes
             *
             * subEntryIndex = int - which one of the subentries is the file attached to?
             * file = a miz file object with parameter fileId included.
             ****************************************************************************************************/
            this.removeFileFromNewSubEntry = function (subEntryIndex, file) {


                // Remove file from DB
                Files.remove(file.fileId, (err) => {
                    if (err) {
                        console.log('error: ', err);
                    }
                });

                // Remove file pointer from Log entry
                this.newLogEntry.subEntries[subEntryIndex].files = _.filter(this.newLogEntry.subEntries[subEntryIndex].files, function (o) {
                    return o.fileId !== file.fileId
                });

                //Adjust progress indexes
                --this.ingestedFileIndexArray[subEntryIndex];


            };


            /***************************************************************************************************
             * removeFileFromExistingSubEntry(subEntryIndex, file)
             * Removes the current file from the log entry.  Deletes file from DB and removes file metadata from
             * newLogEntry.SubEntry
             * subEntryIndex = int - which one of the subentries is the file attached to?
             * file = a miz file object with parameter fileId included.
             ****************************************************************************************************/
            this.removeFileFromExistingSubEntry = function (file) {

                Files.remove(file.fileId, (err) => {
                    if (err) {
                        console.log('error: ', err);
                    }
                });

                this.fileEditEntry.subEntries[this.fileEditSubEntryIndex].files = _.filter(this.fileEditEntry.subEntries[this.fileEditSubEntryIndex].files, function (o) {
                    return o.fileId !== file.fileId
                });

                this.call('logsUpdateFiles', angular.copy(this.fileEditEntry), this.fileEditSubEntryIndex, (err) => {
                    if (err)
                        alert("Something went wrong trying to update the logs database: " + err)
                });


            };


            /***************************************************************************************************
             * removeLogEntry
             * Deletes a log entry
             *
             * @property {string} entry - entry to be removed. Entry._id is extracted for the removal
             *
             ****************************************************************************************************/
            this.removeLogEntry = function (entry) {

                //todo: Add a modal here to ask if sure if ready to remove log entry
                this.call('logsRemoveEntry', entry._id);
            };

            /***************************************************************************************************
             * editDetail (entry, subIndex)
             * Identifies and displays the text angular element to enable editing
             ****************************************************************************************************/
            this.editDetail = function (entry, subIndex) {

                let editDetailDisplayId = entry._id + '-' + subIndex + '-' + 'display';
                let editDetailEditId = entry._id + '-' + subIndex + '-' + 'edit';

                document.getElementById(editDetailDisplayId).style.display = "none";
                document.getElementById(editDetailEditId).style.display = "inherit";

            };


            /***************************************************************************************************
             * saveEditDetail
             * Saves the edited detail and hides the editing screen.
             ****************************************************************************************************/
            this.saveEditDetail = function (entry, subIndex) {

                this.call('logsUpdateDetail', angular.copy(entry), subIndex, (err) => {
                    if (err)
                        alert("Issue updating log:" + err);
                    else {
                        let editDetailDisplayId = entry._id + '-' + subIndex + '-' + 'display';
                        let editDetailEditId = entry._id + '-' + subIndex + '-' + 'edit';

                        document.getElementById(editDetailDisplayId).style.display = "inherit";
                        document.getElementById(editDetailEditId).style.display = "none";
                    }

                });
            };


            /***************************************************************************************************
             * cancelEditDetail
             * Restores changed detail data to the client and hides the editing screen.
             ****************************************************************************************************/
            this.cancelEditDetail = function (entry, subIndex) {

                let restorationEntry = Logs.findOne(entry._id);

                let match = _.find(this.logEntries, (localEntry) => {
                    return localEntry._id === entry._id;
                });

                if (match) {
                    match.subEntries[subIndex].details = restorationEntry.subEntries[subIndex].details;
                }

                let editDetailDisplayId = entry._id + '-' + subIndex + '-' + 'display';
                let editDetailEditId = entry._id + '-' + subIndex + '-' + 'edit';

                document.getElementById(editDetailDisplayId).style.display = "inherit";
                document.getElementById(editDetailEditId).style.display = "none";


            };


            /***************************************************************************************************
             * setFileEditEntry (entry, subIndex)
             * Sets entry file field to be edited and enables the modal to permit editing
             ****************************************************************************************************/
            this.setFileEditEntry = function (entry, subIndex) {

                this.fileEditEntry = Logs.findOne(entry._id);
                this.fileEditSubEntryIndex = subIndex;


                //This is a bit of hackery.  Sometimes the flag doesn't get set as completed when uploading files
                //in the edit modal.   This assumes any file being edited is fully uploaded and resets the flag,
                //which hides progress bars and the "processing" icon for each file
                for (let file of this.fileEditEntry.subEntries[subIndex].files) {
                    file.fileProcessing = false;
                }


            };


            /***************************************************************************************************
             * setEditDate
             * Set date to be edited in modal.  Would be nice if x-editable supported this, but not working well.
             ****************************************************************************************************/

            this.setEditDate = function (entry) {
                this.dateEditEntry = Logs.findOne(entry._id);
            };

            /***************************************************************************************************
             * saveEditedDate
             * Updates the saved date.
             *
             *
             ****************************************************************************************************/
            this.saveEditedDate = function (file) {

                this.call('logsUpdateDate', angular.copy(this.dateEditEntry), (err) => {
                    if (err)
                        alert("Something went wrong trying to update the date: " + err)
                });

            };

            /***************************************************************************************************
             * addLogEntry
             * Adds a new log entry, based on the info in the new log entry fields.
             * @property {string} parentId - the id of the parent to be added to this partner.
             *
             ****************************************************************************************************/
            this.addLogEntry = function () {
                // presuming that we can update the local object and use the parent object to update it


                if (!Roles.userIsInRole(Meteor.userId(),
                        ['superAdmin', 'editEngagements'])) {
                    alert("Insufficient privilege to add new log entry.");
                    return;
                }

                if (this.newLogEntry.subEntries[0].headline === '' || this.newLogEntry.subEntries[0].headline === null) {
                    alert('Error: Headline required. Entry not created.');
                    return;
                }

                this.newLogEntry.subjectId = this.subjectId;

                if (this.newLogEntry.subjectId === '' || this.newLogEntry.subjectId === null) {
                    alert('Error: SubjectId required. Entry not created.');
                    return;
                }

                // If no date, make it now
                if (this.newLogEntry.date === '' || this.newLogEntry.date === null) {
                    this.newLogEntry.date = new Date();
                }

                //Delete any empty sub-entries.
                for (let i = 0; i < 5; i++) {

                    //if there is nothing in the subentry... remove it.
                    if ((this.newLogEntry.subEntries[i].headline === "") &&
                        (this.newLogEntry.subEntries[i].details === "" ) &&
                        (this.newLogEntry.subEntries[i].files.length === 0)) {
                        delete this.newLogEntry.subEntries[i];
                    }
                }
                this.newLogEntry.subEntries = _.compact(this.newLogEntry.subEntries);


                this.call("logsCreateEntry", angular.copy(this.newLogEntry), (err, result) => {
                    if (err) {
                        alert('Something went wrong: ' + err);
                        console.log(err);
                    } else {

                        // Update parent headline
                        if (this.latestLink && this.updateLatestStatus) {
                            this.updateCurrentStatusFn({status: this.newLogEntry.subEntries[0].headline});
                        }

                        // reset everything
                        //this.newEntryTriggered = false;  //Resets are left to the view

                        this.displaySubEntry = [true, false, false, false, false];

                        //reset indexes for tracking files
                        this.ingestedFileIndexArray = [-1, -1, -1, -1, -1];

                        this.newLogEntry = {
                            subjectId: this.subjectId,
                            date: new Date(),
                            subEntries: [
                                {
                                    headline: "",
                                    details: "",
                                    files: []
                                },
                                {
                                    headline: "",
                                    details: "",
                                    files: []
                                },
                                {
                                    headline: "",
                                    details: "",
                                    files: []
                                },
                                {
                                    headline: "",
                                    details: "",
                                    files: []
                                },
                                {
                                    headline: "",
                                    details: "",
                                    files: []
                                }
                            ]

                        };


                    }
                });


            };


            /***************************************************************************************************
             * resetNewEntry
             * Resets the new entry field.
             * @property {string} parentId - the id of the parent to be added to this partner.
             *
             ****************************************************************************************************/
            this.resetNewEntry = function () {

                this.displaySubEntry = [true, false, false, false, false];

                //todo: There is no method here if cancelling files that are currently uploading. Does removing them crash the server?


                Dropzone.forElement(".dropzone").removeAllFiles(true);
                FS.HTTP.uploadQueue.cancel();

                for (let subEntry of this.newLogEntry.subEntries) {
                    for (let file of subEntry.files) {

                        Files.remove(file.fileId, (err) => {
                            if (err) {
                                console.log('error: ', err);
                            }

                        });
                    }
                }


                //reset indexes for tracking files
                this.ingestedFileIndexArray = [-1, -1, -1, -1, -1];


                this.newLogEntry = {
                    subjectId: this.subjectId,
                    date: new Date(),
                    subEntries: [
                        {
                            headline: "",
                            details: "",
                            files: []
                        },
                        {
                            headline: "",
                            details: "",
                            files: []
                        },
                        {
                            headline: "",
                            details: "",
                            files: []
                        },
                        {
                            headline: "",
                            details: "",
                            files: []
                        },
                        {
                            headline: "",
                            details: "",
                            files: []
                        }
                    ]


                };
            };

            /***************************************************************************************************
             * entryHasFiles(entry)
             * Reuturns true if passed entry has files.  Used for showing icon in header.
             ****************************************************************************************************/
            this.entryHasFiles = function (entry) {

                for (subEntry of entry.subEntries) {
                    if (subEntry.files.length)
                        return true;
                }

                return false;

            };

            /***************************************************************************************************
             * collapseLogs()
             * Visually collapses all the logs.
             ****************************************************************************************************/
            this.collapseLogs = function () {
                $('#accordion .panel-collapse').collapse('hide');
                this.logEntries.forEach(function(element) {
                   element.panelOpen = false;
                });
            };

            /***************************************************************************************************
             * expandLogs()
             * Visually collapses all the logs.
             ****************************************************************************************************/
            this.expandLogs = function () {
                $('#accordion .panel-collapse').collapse('show');
                this.logEntries.forEach(function(element) {
                    element.panelOpen = true;
                });
            };


            /***************************************************************************************************
             * updateFileDescription
             * Adds a new log entry, based on the info in the new log entry fields.
             * @property {object} file - expects an object with:
             *      fileID: the _id of the file in the Files collection
             *      description:  string to update on oserver
             ****************************************************************************************************/
            this.updateFileDescription = function (file) {
                this.call("filesUpdateDescription", file.fileId, file.description);
            };

            /***************************************************************************************************
             * updateServerFileDescription
             * Updates a description for a file on the server in both the log entry
             * @property {object} file - expects an object with:
             *
             *      file: the file, which the _id and .description will be updated
             *
             *
             ****************************************************************************************************/
            this.updateServerFileDescription = function (file) {

                this.call("filesUpdateDescription", file.fileId, file.description, (err) => {
                    if (err)
                        alert("Something went wrong trying to update the file database: " + err)
                });

                this.call('logsUpdateFiles', angular.copy(this.fileEditEntry), this.fileEditSubEntryIndex, (err) => {
                    if (err)
                        alert("Something went wrong trying to update the logs database: " + err)
                });

            };


            /***************************************************************************************************
             * get File Url
             * Gets the url of a file.
             ****************************************************************************************************/
            this.fileUrl = function (file) {
                targetFile = Files.findOne(file.fileId);
                return targetFile.url();
            };


            /***************************************************************************************************
             * fillEditModalBlankFileDescriptions (files)
             * Takes an array of files and checks if the description is blank.  Fills with "attachment" if true
             * then updates local and server database.
             ****************************************************************************************************/
            this.fillEditModalBlankFileDescriptions = function (files) {

                for (let file of files) {


                    if ((file.description === null) || ( file.description.length === 0))
                        file.description = "Attachment";

                    this.updateServerFileDescription(file);

                }
            };

            /***************************************************************************************************
             * jquery - The below jquery adjusts the height of the table body to accommodate the screen height
             ****************************************************************************************************/

                //todo: purge the evil jQuery and make this pure angular


            let logFooterOffset = 10;


            /* let bodyheight = $('body').height();
             let wrapperPosition = $('#log-wrapper').offset();
             let headerHeight = wrapperPosition.top;
             bodyheight = bodyheight - headerHeight - footerOffset;
             $('#log-wrapper').css('min-height', bodyheight + 'px;' + ' ' + 'max-height', bodyheight + 'px;');*/

            let wrapperElement = $element.find('#log-wrapper');

            //todo: Fix this hack, which resizes the log a 1/2 second after the page load
            setTimeout(function() {
                let logBodyHeight = $('body').height();
                let logHeaderOffset = wrapperElement.offset().top;
                let logHeight = logBodyHeight - logHeaderOffset - logFooterOffset;
                $('#log-wrapper').css({'min-height': logHeight + 'px', 'max-height': logHeight + 'px;'});
            }, 0);

            $(window).resize(function () {
                let logBodyHeight = $('body').height();
                let logHeaderOffset = wrapperElement.offset().top;
                let logHeight = logBodyHeight - logHeaderOffset - logFooterOffset;
                $('#log-wrapper').css({'min-height': logHeight + 'px', 'max-height': logHeight + 'px;'});

            }).resize();

            /***************************************************************************************************
             * jquery - Ensures all bootstrap modals make it to the top
             ****************************************************************************************************/
            let checkeventcount = 1,prevTarget;
            $('.modal').on('show.bs.modal', function (e) {
                if(typeof prevTarget == 'undefined' || (checkeventcount==1 && e.target!=prevTarget))
                {
                    prevTarget = e.target;
                    checkeventcount++;
                    e.preventDefault();
                    $(e.target).appendTo('body').modal('show');
                }
                else if(e.target==prevTarget && checkeventcount==2)
                {
                    checkeventcount--;
                }
            });

            //$scope.count = 0;


        } // controller
    }
        ;  //return
})
;


