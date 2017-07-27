/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <partner-details>
 *     This directive is the primary view for partners.  It enables information to be modified and also
 *     aggregates information.
 *
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("partnerDetails", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/partners/components/partner-details/partner-details.ng.html',
        controllerAs: 'partnerDetails',
        bindToController: true,
        transclude: true,
        controller: function ($scope, $reactive, $stateParams) {

            $reactive(this).attach($scope);

            /** INITIALIZE **/
            this.partnerId = $stateParams.partnerId;
            this.credentialTagEditingEnabled = false;
            this.subjectTagEditingEnabled = false;


            /** HELPERS **/

            this.helpers({

                //for troubleshooting
                allLoadedPartners: () => {
                    return Partners.find();
                },

                //Featured partner to be displayed and modifed
                partner: () => {
                    this.getReactively('partnerId');

                    if (this.partnerId)
                        return Partners.findOne({_id: this.partnerId});

                },

                //Collection of Parent partners of the feature partner
                parentPartners: () => {
                    if (this.getReactively("partner.parentPartners")) {

                        return Partners.find({
                            _id: {$in: this.partner.parentPartners}
                        });
                    }
                },

                // Image object retrieved based on partner.logo, or default image if no logo
                logo: () => {
                    if (this.getReactively("partner")) {
                        if (this.partner.logo !== null && this.partner.logo !== "")
                            return Images.findOne({_id: this.getReactively("partner.logo")});
                        else
                            return Images.findOne({mizSystemReference: this.getReactively("partner.partnerType")});
                    }
                },

                //A list of potential parent partners generated from the parent Search bar
                parentPartnerSearchList: () => {
                    this.getReactively('parentSearch');

                    if (this.getReactively("partner")) { //ensure partner is loaded
                        return Partners.find({
                            'name': {
                                '$regex': '.*' + this.parentSearch + '.*', '$options': 'i'
                            },
                            'partnerType': {
                                $in: [                    // adding a parent that is not an individual.
                                    'company',
                                    'university',
                                    'uniSubOrg',
                                    'incubator',
                                    'venture',
                                    'association',
                                    'other'
                                ]
                            },
                            _id: {$ne: this.partner._id} // don't include the current partner
                        }, {limit: 5});
                    }
                },

                //a list of children who are not cooperation resources
                contactList: () => {
                    if (this.getReactively('partner.childrenPartners', true)) {

                        var options = {
                            fields: { // fields to bring back - need to update subscription
                                _id: 1,
                                name: 1,
                                description: 1,
                                contactInfo: 1,
                                logo: 1
                            }
                        };


                        return Partners.find({
                            $and: [
                                {_id: {$in: this.partner.childrenPartners}}, // partner is in child list
                                {"cooperationResource": false},
                                {partnerType: {$in: ['contact', 'individual', 'professor']}}
                            ]
                        }, options);
                    }

                },


                resourceList: () => {
                    if (this.getReactively('partner.childrenPartners')) {

                        let options = {
                            fields: { // fields to bring back - need to update subscription
                                _id: 1,
                                name: 1,
                                description: 1,
                                contactInfo: 1,
                                logo: 1
                            }
                        };

                        return Partners.find({
                            $and: [
                                {_id: {$in: this.partner.childrenPartners}}, // partner is in child list
                                {"cooperationResource": true}
                            ]
                        }, options);
                    }
                },


                /** A list of all the children organizations associated for this partner.
                 *  Note that in the view, Universities will have uniSubOrgs and Invubators and VCs will have memberCompanies
                 *  */
                uniSubOrgList: () => {
                    if (this.getReactively('partner.childrenPartners')) {

                        let options = {
                            fields: { // fields to bring back - need to update subscription
                                _id: 1,
                                name: 1,
                                description: 1,
                                contactInfo: 1,
                                logo: 1
                            }
                        };

                        return Partners.find({
                            $and: [
                                {_id: {$in: this.partner.childrenPartners}}, // partner is in child list

                                {
                                    partnerType: 'uniSubOrg'                 // orgs that are not individuals
                                }
                            ]
                        }, options); // Partners.find
                    } // if partner
                },// memberOrg List

                /** A list of potential bizdev owners generated from the bizdev Search bar
                 * Note:  Admin user should not show unless user is admin.   Users own address
                 * doesn't show unless they have the 'edit-engagements' role.*/
                bizDevOwnerSearchList: () => {
                    this.getReactively('bizDevOwnerSearch');

                    let options = {
                        limit: 5
                    };

                    selector = {
                        $and: [
                            {
                                $or: [
                                    {
                                        'username': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {
                                        'profile.name': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {
                                        'profile.company': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {
                                        'profile.group': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {
                                        'profile.huaweiId': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {
                                        'emails.address': {
                                            '$regex': '.*' + this.bizDevOwnerSearch || '' + '.*',
                                            '$options': 'i'
                                        }
                                    }
                                ]
                            },

                            {
                                $or: [
                                    {roles: {$elemMatch: {$eq: 'editEngagements'}}},
                                    {roles: {$elemMatch: {$eq: 'editAllEngagements'}}}
                                ]
                            }
                        ]
                    };

                    return Meteor.users.find({}, options);

                },

                /** Collection of Business Development Owners attached to partner*/
                bizDevOwners: () => {
                    if (this.getReactively('partner.bizDevOwners'))  // if partner loaded
                        return Meteor.users.find({
                            _id: {$in: this.partner.bizDevOwners}
                        });
                },

                /*       referenceSubjectTags: () => {

                 return Tags.findOne({name: 'subjectTags'});
                 },*/

            });


            /** SUBSCRIPTIONS **/

            /*            this.subscribe('subjectTags', () => {
             return [

             ]
             });*/

            this.subscribe('partnerDetail', () => {
                return [
                    this.getReactively('partnerId'),
                    this.getReactively('partner.parentPartners'),
                    this.getReactively('partner.childrenPartners')
                ]
            });


            this.subscribe('partnerImages', () => {
                return [
                    //imageId
                    this.getReactively('partner.logo'),
                    this.getReactively('partner.partnerType')
                ]
            });
            //this.subscribe('images');

            /** Subscription to user list to search for bizDevOwners */
            this.subscribe('userBizDevOwnerSearch', () => {
                return [
                    // searchTerm
                    this.getReactively('bizDevOwnerSearch')
                ]
            });


            /** Subscription to users for list of current biz dev owners. */

            this.subscribe('userSimpleList', () => {
                return [
                    // array of user ids to look up
                    this.getReactively('partner.bizDevOwners', true)
                ]
            });

            /** Sends the id of the partner, returns engagements associated with it **/
            this.subscribe('partnerEngagements', () => {
                return [
                    this.getReactively('partner._id')
                ]
            });

            /** Sends the id of the partner, returns engagements associated with it **/
            this.subscribe('selectPartnerSearch', () => {
                return [
                    this.getReactively('parentSearch')
                ]
            });


            /** AUTORUN**/
            this.autorun(() => {

                this.getReactively("partner");

                if (this.partner)
                    document.title = "Miz: " + this.partner.name;

            }); //autorun

            /** FUNCTIONS */

            /***************************************************************************************************
             * autoSelect Tags
             *
             ****************************************************************************************************/
            this.autofillCredentialTags = function (query) {

                let referenceCredentialTags = [
                    {text: 'IEEE Fellow'},
                    {text: 'ACM Fellow'},
                    {text: 'ASME Fellow'},
                    {text: 'APS Fellow'},
                    {text: 'ACS Fellow'},
                    {text: 'AAAS Fellow'},
                    {text: 'Institute of Physics Fellow'},
                    {text: 'AAAI Fellow'},
                    {text: 'Nobel Prize'},
                    {text: 'Fields Medal'},
                    {text: 'AICE Fellow'},
                    {text: 'Presidential Medal of Freedom'}
                ];

                //let regexp = new RegExp(key, query);

                /*   return referenceCredentialTags.filter(function (e){
                 return regexp.test(e);
                 });*/

                return referenceCredentialTags;


            };


            /***************************************************************************************************
             * updatePartner
             * Updates a selected field of the partner on the server.
             *
             * @property {string} field - the field of the partner to be updated
             *
             ****************************************************************************************************/
            this.updatePartner = function (field) {

                if (this.partner) {
                    let updatedInfo = this.partner[field];
                    this.call('partnerUpdate', this.partner._id, field, updatedInfo);
                }
            };


            /***************************************************************************************************
             * addPartnerCredentialTag
             * Updates a selected field of the partner on the server.
             *
             ****************************************************************************************************/
            this.addPartnerCredentialTags = function (tag) {

                this.call('addPartnerCredentialTag', this.partner._id, tag);

            };

            /***************************************************************************************************
             * removePartnerSubjectTag
             * Updates a selected field of the partner on the server.
             *
             ****************************************************************************************************/
            this.removePartnerCredentialTags = function (tag) {

                this.call('removePartnerCredentialTag', this.partner._id, tag);

            };

            /***************************************************************************************************
             * addPartnerCredentialTag
             * Updates a selected field of the partner on the server.
             *
             ****************************************************************************************************/
            this.addPartnerSubjectTags = function (tag) {

                this.call('addPartnerSubjectTag', this.partner._id, tag);

            };

            /***************************************************************************************************
             * removePartnerSubjectTag
             * Updates a selected field of the partner on the server.
             *
             ****************************************************************************************************/
            this.removePartnerSubjectTags = function (tag) {

                this.call('removePartnerSubjectTag', this.partner._id, tag);

            };


            /***************************************************************************************************
             * removeParentPartner
             * Removes the clicked partner ID from the parentPartners array and the corresponding
             * object from $scope.parentPartners
             *
             * @property {string} parentId - the id of the parent to be removed from this partner.
             *
             ****************************************************************************************************/
            this.removeParentPartner = function (parentId) {
                this.call('partnerRemoveParentPartner', this.partner, parentId);
            };

            /***************************************************************************************************
             * addParentPartner
             * Adds the clicked partner ID to the partner.parentPartners array and makes this partner a
             * member of the childrenPartners of the new parent.
             *
             * @property {string} parentId - the id of the parent to be added to this partner.
             *
             ****************************************************************************************************/
            this.addParentPartner = function (parentId) {
                this.call('partnerAddParentPartner', this.partner, parentId);
            };

            /***************************************************************************************************
             * noBizDevOwners
             * Returns true if no bizDevOwners are defined for the new partner.   This is used to view/hide
             * the "No Biz Dev Owners" message with an 'ng-hide' in the view
             ****************************************************************************************************/
            this.noBizDevOwners = function () {
                if (this.partner.bizDevOwners.length == 0)
                    return true;
            };


            /***************************************************************************************************
             * addBizDevOwner
             * Adds the clicked user ID to the newPartner.bizDevOwners array, and a User Object to the corresponding
             * this.bizDevOwners array, so that names can be presented.
             *
             * @property {string} this.bizDevOwner    the clicked bizDevOwner that triggered this function
             *
             ****************************************************************************************************/
            this.addBizDevOwner = function (bizDevOwner) {
                //alert('Adding:' + bizDevOwner.profile.name + ' ' + bizDevOwner._id);

                //first, we need to see if it is already listed, otherwise we could add duplicates.
                if (!_.contains(this.partner.bizDevOwners, bizDevOwner._id)) {
                    this.call('partnerAddBizDevOwner', this.partner, bizDevOwner._id);
                }

            };


            /***************************************************************************************************
             * removeBizDevOwner
             * Removes the clicked user ID from the newPartner.bizDevOwners array and the corresponding
             * object from this.bizDevOwners
             ****************************************************************************************************/
            this.removeBizDevOwner = function (bizDevOwner) {

                //remove BizDevOwner from this.newPartner
                this.call('partnerRemoveBizDevOwner', this.partner, bizDevOwner._id);

            };


            /***************************************************************************************************
             * logoDropzoneOptions
             * Options for the logo/photo insertion drop zone
             ****************************************************************************************************/

            this.logoDropzoneOptions = {
                self: this,
                acceptedFiles: 'image/*',
                maxFilesize: 5,
                uploadMultiple: false,
                addRemoveLinks: true,
                maxFiles: 1,
                dictDefaultMessage: 'Drop your logo or image here, or click to choose a file',


                init: function () {
                    var self = this;
                    // First change the button to actually tell Dropzone to process the queue.

                    // Limit the number of uploaded logos to just one.
                    self.on("addedfile", function () {
                        if (self.files[1] != null) {
                            self.removeFile(self.files[0]);
                        }
                    });
                },

                // NOTE: Using Arrow functions here because they automatically bind to the scope of the caller.  This
                // brings our Angular object into these call backs. Using normal functions would cause 'this' to be
                // lexically out of scope and unrecognized.  A lot of Bothans died to bring us this information...
                accept: (file, done) => {

                    $(".dz-progress").remove();  // hiding progress bar, otherwise it stays there...
                    var logoObj = new FS.File(file);
                    logoObj.owner = Meteor.userId();
                    logoObj.createdBy = Meteor.userId();


                    Images.insert(logoObj, (err, fileObj) => {
                        if (err) {
                            alert(err);// handle error
                        } else {
                            Partners.update(this.partner._id, {$set: {logo: fileObj._id}});
                        }
                    });
                }
            };

            /***************************************************************************************************
             * removeImage()
             * Removes the current logo from the partner.   The partner will pull up the default image determined
             * by it's type.  This action also removes the image from the image database.
             ****************************************************************************************************/
            this.removeImage = function () {
                Images.remove(this.partner.logo, (err) => {
                    if (err) {
                        console.log('error: ', err);
                    }
                });

                this.partner.logo = null; //updates meteoribject
            };

            /*********************************************************************************************************
             * viewPartnerDetail
             * @partnerId: The id of the clicke
             * Changes view to selected partner
             ********************************************************************************************************/

            this.viewPartnerDetail = function (partnerId) {
                window.location.href = "/partners/" + partnerId;
            };


            /*********************************************************************************************************
             * createQuickAddContacts
             *  Creates new contacts out of quick add modal
             ********************************************************************************************************/

            this.createQuickAddContacts = function () {

                for (let i = 1; i < 5; i++) {
                    if (this.quickContacts[i].name) {
                        let newContact = {
                            name: this.quickContacts[i].name,
                            description: this.quickContacts[i].description,
                            contactInfo: this.quickContacts[i].contactInfo,
                            parentPartners: [this.partner._id],
                            partnerType: "contact",
                            cooperationResource: false

                        };

                        this.call("createPartner", newContact, (err) => {
                            if (err)
                                alert('Something went wrong creating partners...: ' + err);
                            else
                            //reset the quick contacts fields
                                this.quickContacts[i] = {
                                    name: "",
                                    description: "",
                                    contactInfo: ""
                                };
                        });
                    } else // if there was no name, but other fields had info clear them.
                        this.quickContacts[i] = {
                            name: "",
                            description: "",
                            contactInfo: ""

                        };// if
                } // for


            }; // createQuickAddContacts


            /*********************************************************************************************************
             * createQuickAddUniSubOrgs
             *  Creates new member org
             ********************************************************************************************************/

            this.createQuickAddUniSubOrgs = function () {

                for (let i = 1; i < 5; i++) {
                    if (this.quickUniSubOrgs[i].name) {
                        let newContact = {
                            name: this.quickUniSubOrgs[i].name,
                            description: this.quickUniSubOrgs[i].description,
                            website: this.quickUniSubOrgs[i].website,
                            parentPartners: [this.partner._id],
                            partnerType: "uniSubOrg",
                            cooperationResource: false
                        };

                        this.call("createPartner", newContact, (err) => {
                            if (err)
                                alert('Something went wrong creating partners...: ' + err);
                            else
                            //reset the quick member fields

                                this.quickMembers[i] = {
                                    name: "",
                                    description: "",
                                    website: ""

                                };
                        });
                    } else // if there was no name, but other fields had info clear them.
                        this.quickMembers[i] = {
                            name: "",
                            description: "",
                            website: ""

                        };// if
                } // for
            }; // createQuickmemberOrg


            /*********************************************************************************************************
             * createQuickAddCompanies
             *  Creates new member org
             ********************************************************************************************************/

            this.createQuickAddCompanies = function () {

                for (let i = 1; i < 5; i++) {
                    if (this.quickCompanies[i].name) {
                        let newCompany = {
                            name: this.quickCompanies[i].name,
                            description: this.quickCompanies[i].description,
                            website: this.quickCompanies[i].website,
                            parentPartners: [this.partner._id],
                            partnerType: "company",
                            cooperationResource: true,
                            bizDevOwners: [Meteor.userId()]
                        };

                        this.call("createPartner", newCompany, (err) => {
                            if (err)
                                alert('Something went wrong creating partners...: ' + err);
                            else
                            //reset the quick member fields

                                this.quickCompanies[i] = {
                                    name: "",
                                    description: "",
                                    website: ""

                                };
                        });
                    } else // if there was no name, but other fields had info clear them.
                        this.quickCompanies[i] = {
                            name: "",
                            description: "",
                            website: ""

                        };// if
                } // for
            }; // createQuickMemberCompany

            /*********************************************************************************************************
             * createQuickAddProfessors
             *  Creates new professor with this partner as a parent
             ********************************************************************************************************/

            this.createQuickAddProfessors = function () {

                for (let i = 1; i < 5; i++) {
                    if (this.quickProfessors[i].name) {
                        let newProfessor = {
                            name: this.quickProfessors[i].name,
                            description: this.quickProfessors[i].description,
                            contactInfo: this.quickProfessors[i].contactInfo,
                            website: this.quickProfessors[i].website,
                            parentPartners: [this.partner._id],
                            partnerType: "professor",
                            cooperationResource: true,
                            bizDevOwners: [Meteor.userId()]
                        };

                        this.call("createPartner", newProfessor, (err) => {
                            if (err)
                                alert('Something went wrong creating partners...: ' + err);
                            else
                            //reset the quick member fields

                                this.quickMemberCompanies[i] = {
                                    name: "",
                                    description: "",
                                    website: "",
                                    contactInfo

                                };
                        });
                    } else // if there was no name, but other fields had info clear them.
                        this.quickMemberCompanies[i] = {
                            name: "",
                            description: "",
                            website: "",
                            contactInfo

                        };// if
                } // for
            }; // createQuickMemberCompany

            /*********************************************************************************************************
             * userIsAdmin
             *  Check to see if user is admin to dispaly certain panels.
             ********************************************************************************************************/

            this.userIsAdmin = function () {
                return Roles.userIsInRole(Meteor.userId(), ['superAdmin']);
            };


            /*** jQUERY FUNCTIONS ***/

            /*********************************************************************************************************
             *  Partner Website Edit Glyphicon Show and Hide
             ********************************************************************************************************/

            $('#website').hover(function () {

                $(this).append('<small class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#website-modal"></small>')
            }, function () {

                $(this).children("small").remove();
            });


            /*********************************************************************************************************
             *  Parent Partner  Edit Glyphicon Show and Hide
             ********************************************************************************************************/

            $('#parent-partners').hover(function () {

                $(this).append('<small style="display:inline" class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#parent-modal"></small>')
            }, function () {

                $(this).children("small").remove();
            });

            $('#partner-name').hover(function () {

                $(this).append('<small data-toggle="modal" data-target="#parent-modal" style="margin-top: 0px;margin-bottom: 6px;color: lightblue; font-style: italic">Add parent affiliation</small>')
            }, function () {

                $(this).children("small").remove();
            });


        } // controller
    };  //return
});



