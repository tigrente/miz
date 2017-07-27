
/**
 * Created by Alex on 10/6/15.
 */


miz.directive("accountUpdate", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/admin/components/account-update/account-update.ng.html',
            controllerAs: 'accountUpdate',
            controller: function ($scope, $reactive, $stateParams, $state) {

                $reactive(this).attach($scope);

                //a readiness variable - when data has arrived from server and been assigned to local client object,
                //which is displayed to the UI, then this is marked true

                /** INITIALIZATION **/
                this.updateUserFeedback = "";       // string provides user feedback on updating account (still used?)
                this.resetEditedUser = false;       // flag to trigger reloading of user from db to get original values
                this.passwordSubmitDisabled = true; //disable password change submission until there is a valid password
                this.newPassword = "";              // change password entry field
                this.editedUser = null;             // will hold copy of user meteor object for editing
                this.originalUser = null;           // will hold copy of user meteor object for comparisons

                this.permissionCheckboxes = null;   // object linking roles property in user object to view checkboxes
                this.originalPermissionCheckboxes = null; // copy of original checkboxes to be used for comparison*/


                //validation tracking variables. Set to false if input does not qualify.
                this.validationGroup = {
                    username: true,
                    name: true,
                    email: true,
                    huaweiId: true,
                    company: true,
                    group: true,
                    userInfoChanged: false    // did any of the properties or checkboxes change from the original
                };


                //noinspection JSUnresolvedFunction
                /** HELPERS **/
                this.helpers({

                    /** Create object of select user for editing (not fully reactive to DB!)*/

                    editedUser: () => {
                        //noinspection JSUnresolvedFunction
                        if (this.getReactively('resetEditedUser') == true)
                            this.resetEditedUser = false;

                        this.validationGroup.userInfoChanged = false; // we just fetched it, so we know it didn't change

                        return Meteor.users.findOne({_id: $stateParams.userId});
                    },

                    /** create a copy of the original user data that will not be edited, but will be used for comparisons */
                    originalUser: () => {
                        if (this.getReactively('resetEditedUser') == true)
                            this.resetEditedUser = false;

                        return Meteor.users.findOne({_id: $stateParams.userId});
                    },

                    /** fill checkboxes based on account.roles */
                    permissionCheckboxes: () => {

                        if (this.getReactively('resetPermissionBoxes') == true)
                            this.resetPermissionBoxes = false;

                        if (this.getReactively('editedUser')) {
                            return {
                                superAdmin: _.contains(this.editedUser.roles, 'superAdmin'),
                                viewCompanies: _.contains(this.editedUser.roles, 'viewCompanies'),
                                editCompanies: _.contains(this.editedUser.roles, 'editCompanies'),
                                removeCompanies: _.contains(this.editedUser.roles, 'removeCompanies'),
                                viewEngagements: _.contains(this.editedUser.roles, 'viewEngagements'),
                                editEngagements: _.contains(this.editedUser.roles, 'editEngagements'),
                                editAllEngagements: _.contains(this.editedUser.roles, 'editAllEngagements')
                            }
                        }
                    },

                    /** create a copy of the original permission checkboxes that will not be edited, but will be used for comparisons*/
                    originalPermissionCheckboxes: () => {

                        if (this.getReactively('resetPermissionBoxes') == true)
                            this.resetPermissionBoxes = false;

                        if (this.getReactively('editedUser')) {
                            return {
                                superAdmin: _.contains(this.editedUser.roles, 'superAdmin'),
                                viewCompanies: _.contains(this.editedUser.roles, 'viewCompanies'),
                                editCompanies: _.contains(this.editedUser.roles, 'editCompanies'),
                                removeCompanies: _.contains(this.editedUser.roles, 'removeCompanies'),
                                viewEngagements: _.contains(this.editedUser.roles, 'viewEngagements'),
                                editEngagements: _.contains(this.editedUser.roles, 'editEngagements'),
                                editAllEngagements: _.contains(this.editedUser.roles, 'editAllEngagements')
                            }
                        }
                    },

                    /** disable submit button if fields are not validated or no info has changed*/
                    submissionDisabled: () => {
                        // true is for deep reactivity, trigger if any property changes.
                        this.getReactively('validationGroup', true);

                        //if every validation is true, submissionDisabled is false (submit button enabled)
                        return !(_.every(this.validationGroup));

                    },


                    /** if a user is editing their own profile, disablethe admin Checkbox, so that they don't take away
                     *  their own access (since updates require submitting and are no longer live, this may not be req'd.*/
                    disableAdminCheckbox: () => {
                        if (this.getReactively('editedUser'))
                            return (Meteor.userId() == this.editedUser._id);
                    }


                });

                /** SUBSCRIPTIONS **/
                this.subscribe('userDetail', ()=>{
                    return [$stateParams.userId];
                });


                /** FUNCTIONS **.

                 /***************************************************************************************************
                 * object: inputStatusStyling
                 * Bootstrap styling classes for form fields.
                 * formGroup:  class to be applied to formGroup
                 * glyphs:     class to be applied to span following field
                 ***************************************************************************************************/

                this.inputStatusStyling = {

                    noStatus: {
                        formGroup: "form-group has-feedback",
                        glyphs: ""
                    },

                    success: {
                        formGroup: "form-group has-success has-feedback",
                        glyphs: "glyphicon glyphicon-ok form-control-feedback"
                    },

                    error: {
                        formGroup: "form-group has-error has-feedback",
                        glyphs: "glyphicon glyphicon-remove form-control-feedback"
                    },

                    warning: {
                        formGroup: "form-group has-warning has-feedback",
                        glyphs: "glyphicon glyphicon-warning-sign form-control-feedback"
                    }

                };

                /***************************************************************************************************
                 * function: restoreForm
                 * Restores form to currently saved infor for user  Specifically:
                 * - restores fields to user data
                 * - restores checkboxes
                 * - resets all validation feedback
                 ***************************************************************************************************/
                this.restoreForm = function () {
                    this.resetEditedUser = true;        //this will trigger editedUser to reactively reload
                    this.resetPermissionBoxes = true;   //this will trigger permissionCheckboxes to reactively

                    //validation tracking variables. Set to false if input does not qualify.
                    this.validationGroup = {
                        username: true,
                        name: true,
                        email: true,
                        huaweiId: true,
                        company: true,
                        group: true,
                        o2w_serial: true,
                        userInfoChanged: false    // did any of the properties or checkboxes change from the original

                    };

                    // styling applied to each field depending on validation
                    this.inputStatusGroup = {
                        username: this.inputStatusStyling.noStatus,
                        password: this.inputStatusStyling.noStatus,
                        name: this.inputStatusStyling.noStatus,
                        email: this.inputStatusStyling.noStatus,
                        huaweiId: this.inputStatusStyling.noStatus,
                        company: this.inputStatusStyling.noStatus,
                        group: this.inputStatusStyling.noStatus,
                        o2w_serial: this.inputStatusStyling.noStatus
                    };

                    // string following each field that explains why input is or is not valid
                    this.inputHelp = {
                        username: "",
                        password: "",
                        name: "",
                        email: "",
                        huaweiId: "",
                        company: "",
                        group: "",
                        o2w_serial: ""
                    };

                };

                /***************************************************************************************************
                 * hasAnyUserInfoChanged()
                 * Checks to see if editedUser in any way differs from orignalUserData, and if so, sets the
                 * flag in the validation group.  This include permission checkboxes, but after the check box is
                 * changed back if does not disable the button.
                 ***************************************************************************************************/


                this.hasAnyUserInfoChanged = function () {

                    /*         //resort the role arrays to ensure same order for comparison - for checkboxes
                     var sortedEditedUserRoles = _.sortBy(this.permissionCheckboxes, function (role) {
                     return role
                     });
                     var sortedOriginalUserRoles = _.sortBy(this.originalUser.roles, function (role) {
                     return role
                     });
                     */
                    // compare the editied and orignal user objects
                    var objectTextFieldsUnchanged = _.isEqual(this.editedUser, this.originalUser);

                    // permission changes are not reflected in the objects, compare the checkboxes
                    var permissionCheckboxesUnchanged = _.isEqual(this.permissionCheckboxes, this.originalPermissionCheckboxes);


                    this.validationGroup.userInfoChanged = !(objectTextFieldsUnchanged && permissionCheckboxesUnchanged);

                    // returns bolean, but this is really here because without, we sometimes don't come back to the
                    // routine that called this function


                };


                /***************************************************************************************************
                 * validateUsername
                 * Validates if a user's information is acceptable and sets hint strings and formatting if not.
                 * Usernames must be strings, 3 characters or more, contain only letters and numbers, and must not
                 * already exist as a user.
                 * If user is acceptable, sets inputStatusGroup.username = true, otherwise false..
                 ***************************************************************************************************/


                this.validateUsername = function () {

                    var illegalChars = /\W/; // allow letters, numbers, and underscores

                    /*     alert("edited: " + this.editedUser.username);
                     alert("original:" + this.originalUser.username);*/

                    this.hasAnyUserInfoChanged();  //check if there are any changes, change flag in validation group

                    if (this.editedUser.username == this.originalUser.username) {

                        this.inputHelp.username = '';
                        this.inputStatusGroup.username = this.inputStatusStyling.noStatus;
                        this.validationGroup.username = true; // assume original name is still good

                        $scope.$apply();
                        return true;
                    } else {  //if username has changed from original...


                        //validate not a bad type
                        if (typeof this.editedUser.username != "string") {
                            this.inputHelp.username = 'String required.';
                            this.validationGroup.username = false;
                            this.inputStatusGroup.username = this.inputStatusStyling.error;
                            $scope.$apply(); // apply any changes
                            return false;
                        } else


                        //validate no illegal characters
                        if (illegalChars.test(this.editedUser.username)) {
                            this.inputHelp.username = 'Illegal characters';
                            this.validationGroup.username = false;
                            this.inputStatusGroup.username = this.inputStatusStyling.error;
                            $scope.$apply(); // apply any changes
                            return false;
                        } else


                        //validate not blank
                        if (this.editedUser.username === '') {
                            this.inputHelp.username = 'Username required';
                            this.validationGroup.username = false;
                            this.inputStatusGroup.username = this.inputStatusStyling.error;
                            $scope.$apply(); // apply any changes
                            return false;
                        } else

                        //validate greater than 3 chars
                        if (this.editedUser.username.length < 3) {
                            this.inputHelp.username = "Must be at least 3 characters";
                            this.validationGroup.username = false;
                            this.inputStatusGroup.username = this.inputStatusStyling.error;
                            $scope.$apply(); // apply any changes
                            return false;
                        } else {

                            // validate that username does not already exist
                            this.call('mizValidateUniqueUsername', this.editedUser.username, (err, result) => {

                                console.log('inside call');

                                if (err) {
                                    // Handle error - there was a duplicate name
                                    console.log('failed', err);

                                    this.inputHelp.username = '"' + this.editedUser.username + '"' + ' ' + 'is already taken.';
                                    this.validationGroup.username = false;  // User name not unique
                                    this.inputStatusGroup.username = this.inputStatusStyling.error;
                                    $scope.$apply(); // apply any changes
                                    return false;

                                } else { //This name is unique and all validations passed
                                    this.inputHelp.username = ' "' + result + '"' + ' ' + 'available!';
                                    this.validationGroup.username = true;  // We've cleared all validations for username.
                                    this.inputStatusGroup.username = this.inputStatusStyling.success;
                                    $scope.$apply(); // apply any changes
                                    return true;
                                }

                            }); // call.mizValidateUniqueUsername

                        }
                    }

                };


                /***************************************************************************************************
                 * validateEmail
                 * Validates if a user's email follows format convention (*@*.*)
                 * If acceptable, sets inputStatusGroup.email = true, otherwise false..
                 ***************************************************************************************************/

                this.validateEmail = function () {

                    this.hasAnyUserInfoChanged();  //check if there are any changes, change flag in validation group

                    //validate only if there is a change
                    if (this.editedUser.emails[0].address == this.originalUser.emails[0].address) {
                        this.inputHelp.email = '';
                        this.inputStatusGroup.email = this.inputStatusStyling.noStatus; // remove status
                        this.validationGroup.email = true; // assume original email is still good

                        $scope.$apply();
                        return true;
                    } else {  //it's different, do other validations


                        //validate type
                        if (typeof this.editedUser.emails[0].address != "string") {
                            this.inputHelp.email = 'String required';
                            this.validationGroup.email = false;
                            this.inputStatusGroup.email = this.inputStatusStyling.error;
                            $scope.$apply();
                            return false;
                        } else {


                            //validate not blank
                            if (this.editedUser.emails[0].address === '') {
                                this.inputHelp.email = 'Valid email required';
                                this.validationGroup.email = false;
                                this.inputStatusGroup.email = this.inputStatusStyling.error;
                                $scope.$apply();
                                return false;
                            } else {

                                //validate that this is an email address
                                var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                                if (false == emailReg.test(this.editedUser.emails[0].address)) {
                                    this.inputHelp.email = 'Valid email required';
                                    this.validationGroup.email = false;
                                    this.inputStatusGroup.email = this.inputStatusStyling.error;
                                    $scope.$apply();
                                    return false;
                                } else {

                                    //validate e-mail uniqueness with mizValidateUniqueEmail
                                    this.call('mizValidateUniqueEmail', this.editedUser.emails[0].address, function (err, data) {
                                        if (err) {
                                            // Handle error- account already exists
                                            console.log('failed', err);
                                            this.inputHelp.email = this.editedUser.emails[0].address + ' ' + 'already has an account.';
                                            this.validationGroup.email = false;  // User name not unique
                                            this.inputStatusGroup.email = this.inputStatusStyling.error;
                                            $scope.$apply();
                                            return false;
                                        } else {
                                            console.log('Email confirmed for uniqueness: ' + data);
                                            this.inputHelp.email = '';
                                            this.validationGroup.email = true;  // We've cleared all validations for password.
                                            this.inputStatusGroup.email = this.inputStatusStyling.success;
                                            $scope.$apply();
                                            return true;
                                        }
                                    });
                                }
                            }
                        }
                    }
                };


                /***************************************************************************************************
                 * function: validateProperty
                 * Validates the other text fields, associated with profile.properties in user account, to ensure
                 * they are not blank. If acceptable, sets inputStatusGroup.[property] = true, otherwise false.
                 ***************************************************************************************************/
                this.validateProperty = function (property) {

                    this.hasAnyUserInfoChanged(); //disable submit button if no changes

                    //check if the property has changed from the original.  if no changes, assume valid
                    if (this.editedUser.profile[property] == this.originalUser.profile[property]) {
                        //same as original
                        this.inputHelp[property] = '';
                        this.validationGroup[property] = true;
                        this.inputStatusGroup[property] = this.inputStatusStyling.noStatus;
                        this.hasAnyUserInfoChanged(); //disable submit button if no changes
                        $scope.$apply();
                        return true;
                    } else {
                        // property has changed...

                        //validate type

                        if (typeof this.editedUser.profile[property] != "string") {
                            this.inputHelp[property] = 'String required';
                            this.validationGroup[property] = false;
                            this.inputStatusGroup[property] = this.inputStatusStyling.error;
                            $scope.$apply();
                            return false;
                        } else {

                            //validate not blank
                            if (this.editedUser.profile[property] === '') {
                                this.inputHelp[property] = "Required";
                                this.validationGroup[property] = false;
                                this.inputStatusGroup[property] = this.inputStatusStyling.error;
                                $scope.$apply();
                                return false;
                            } else {

                                // field ok
                                this.inputHelp[property] = '';
                                this.validationGroup[property] = true;
                                this.inputStatusGroup[property] = this.inputStatusStyling.success;
                                $scope.$apply();
                                return true;
                            } // field ok
                        } //validate not blank
                    } //property changed
                };

                /***************************************************************************************************
                 * permissionChanged
                 * Called when a permission checkbox is clicked - just checks to see if permisions have changed
                 *from original to enable or disable submission.
                 ****************************************************************************************************/
                this.permissionChanged = function () {
                    this.hasAnyUserInfoChanged();  //check to see if permisins are changed - to enable submission

                };


                /***************************************************************************************************
                 * updateUser
                 * Preps data in Angular editedUser object and sends it to server to update Meteor object
                 ****************************************************************************************************/


                this.updateUser = function () {
                    //build the object for roles

                    this.editedUser.roles = [];  // the final array of roles to be attached to user.

                    //My iteration over the object wasn't working - going for clarity .. :-/
                    if (this.permissionCheckboxes.viewCompanies)      this.editedUser.roles.push('viewCompanies');
                    if (this.permissionCheckboxes.editCompanies)      this.editedUser.roles.push('editCompanies');
                    if (this.permissionCheckboxes.removeCompanies)    this.editedUser.roles.push('removeCompanies');
                    if (this.permissionCheckboxes.viewEngagements)    this.editedUser.roles.push('viewEngagements');
                    if (this.permissionCheckboxes.editEngagements)    this.editedUser.roles.push('editEngagements');
                    if (this.permissionCheckboxes.editAllEngagements) this.editedUser.roles.push('editAllEngagements');
                    if (this.permissionCheckboxes.superAdmin)         this.editedUser.roles.push('superAdmin');

                    //update the user
                    this.call("mizUpdateUser", this.editedUser, function (err, data) {
                        if (err) {
                            // Handle error
                            console.log('failed', err);
                            this.updateUserFeedback = 'something went wrong...' + err;
                        } else {
                            // Handle success
                            this.updateUserFeedback = 'Account Updated: ' + data.username;

                            //reset the user entry stuff
                            this.restoreForm();
                        }
                    });

                };


                /**  >>>>>>  CHANGE PASSWORD FUNCTIONS <<<<<<  **/

                /***************************************************************************************************
                 *  validatePassword
                 *  Validates if a user's password is of acceptable strength
                 *  If user is acceptable, sets validNewPassword = true, otherwise false, which in turn triggers
                 *  the password submit disabled button.
                 ***************************************************************************************************/

                this.validatePassword = function () {

                    //validate type
                    if (typeof this.newPassword != "string") {
                        this.inputHelp.password = 'String required';
                        this.passwordSubmitDisabled = true;
                        this.inputStatusGroup.password = this.inputStatusStyling.error;
                        return false;
                    } else


                    //validate not blank
                    if (this.validNewPassword === '') {
                        this.inputHelp.password = 'Password required';
                        this.passwordSubmitDisabled = true;
                        this.inputStatusGroup.password = this.inputStatusStyling.error;
                    } else {

                        //validate complexity

                        var strongRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
                        var enoughRegex = new RegExp("(?=.{6,}).*", "g");
                        var pwd = this.newPassword;
                        if (false == enoughRegex.test(pwd)) {
                            this.inputHelp.password = "Password must be longer";
                            this.passwordSubmitDisabled = true;
                            this.inputStatusGroup.password = this.inputStatusStyling.error;
                        } else if (strongRegex.test(pwd)) {
                            this.inputHelp.password = "";
                            this.passwordSubmitDisabled = false;  // We've cleared all validations for password.
                            this.inputStatusGroup.password = this.inputStatusStyling.success;
                        } else {
                            this.inputHelp.password = "Password must be more complex";
                            this.passwordSubmitDisabled = true;  // We've cleared all validations for password.
                            this.inputStatusGroup.password = this.inputStatusStyling.error;
                        }
                    }
                    $scope.$apply();
                };


                /***************************************************************************************************
                 * function changePassword
                 * Calls to serverside method to change the password of the highlighted user.
                 ***************************************************************************************************/

                this.changePassword = function () {
                    this.call("mizChangePassword", this.editedUser._id, this.newPassword, function (err, data) {
                        if (err) {
                            // Handle error
                            console.log('failed', err);
                            this.updateUserFeedback = 'something went wrong...' + err;
                        } else {
                            // Handle success
                            console.log('Password successfully changed for ' + data.username);
                            this.updateUserFeedback = 'Password changed.';
                        }
                    })
                };


                /***************************************************************************************************
                 * function removeUser
                 * Calls to serverside method to change the password of the highlighted user.
                 ***************************************************************************************************/
                this.removeUser = function () {

                    this.call("mizDeleteUser", this.editedUser, function (err) {
                        if (err) {
                            // Handle error
                            console.log('failed', err);
                            this.updateUserFeedback = 'something went wrong...' + err;
                        } else {
                            // Handle success

                            alert('User ' + this.editedUser.username + ' destroyed. Good luck with that.');
                            $state.go('userList');
                        }
                    });
                };


                /***************************************************************************************************
                 * Start main controller
                 **************************************************************************************************/
//Initialize the form.
                this.restoreForm();


//disable the admin check box if user is editing their own record
//admins should not be able to remove their own admin privilidge on the fly and lock themselves out

            }
        }
    }
)
;