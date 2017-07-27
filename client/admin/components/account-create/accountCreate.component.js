/**
 * Created by Alex on 10/6/15.
 */
miz.directive("accountCreate", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/admin/components/account-create/account-create.ng.html',
            controllerAs: 'ac',
            controller: function ($scope, $rootScope, $reactive) {
                $reactive(this).attach($scope);

                /** INITIALIZATION **/

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

                this.validationGroup = {
                    username: false,  //true for test
                    password: false,   //true for test
                    name: false,       //true for test
                    email: false,      //true for test
                    huaweiId: false,   //true for test
                    company: false,   //true for test
                    group: false,
                    o2w_serial:true
                };        //true for test


                //noinspection JSUnresolvedFunction
                /** HELPERS **/
                this.helpers({
                    /** disable submit button if fields are not validated or no info has changed*/
                    submissionDisabled: () => {
                        // true is for deep reactivity, trigger if any property changes.
                        this.getReactively('validationGroup', true);

                        //if every validation is true, submissionDisabled is false (submit button enabled)
                        return !(_.every(this.validationGroup));

                    }

                });

                /** SUBSCRIPTIONS **/
                //none - using server side methods


                /***************************************************************************************************
                 * function: resetForm
                 * Resets all the form for entry of new user.  Specifically:
                 * - resets all form fields to blank
                 * - sets enabled checkbox to true
                 * - sets all balidation
                 ***************************************************************************************************/

                this.resetForm = function () {

                    this.submissionDisabled = true;

                    this.newUser = {
                        username: "",
                        email: "",
                        password: "",

                        name: "",
                        huaweiId: "",
                        company: "",
                        group: "",
                        o2w_serial: "",
                        enabled: true   //implemented as checkbox
                    };

                    //validation tracking variables. Set to false if input does not qualify.
                    this.validationGroup = {
                        username: false,  //true for test
                        password: false,   //true for test
                        name: false,       //true for test
                        email: false,      //true for test
                        huaweiId: false,   //true for test
                        company: false,   //true for test
                        group: false,
                        o2w_serial: true
                    };        //true for test

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
                        o2w_serial:""
                    };

                    // default settings for permissions (currently assuming cooperation manager)
                    this.permissionCheckboxes = {
                        viewCompanies: true,
                        editCompanies: true,
                        removeCompanies: false,
                        viewEngagements: true,
                        editEngagements: true,
                        editAllEngagements: false,
                        superAdmin: false
                    };


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

                    //validate not a bad type
                    if (typeof this.newUser.username != "string") {
                        this.inputHelp.username = 'String required.';
                        this.validationGroup.username = false;
                        this.inputStatusGroup.username = this.inputStatusStyling.error;
                    } else


                    //validate no illegal characters
                    if (illegalChars.test(this.newUser.username)) {
                        this.inputHelp.username = 'Illegal characters';
                        this.validationGroup.username = false;
                        this.inputStatusGroup.username = this.inputStatusStyling.error;
                        return false;
                    } else


                    //validate not blank
                    if (this.newUser.username === '') {
                        this.inputHelp.username = 'Username required';
                        this.validationGroup.username = false;
                        this.inputStatusGroup.username = this.inputStatusStyling.error;
                        return false;
                    } else

                    //validate greater than 3 chars
                    if (this.newUser.username.length < 3) {
                        this.inputHelp.username = "Must be at least 3 characters";
                        this.validationGroup.username = false;
                        this.inputStatusGroup.username = this.inputStatusStyling.error;
                        return false;
                    } else

                    //validate name doesn't already exist

                        this.call('mizValidateUniqueUsername', this.newUser.username, function (err, data) {
                            if (err) {
                                // Handle error
                                console.log('failed', err);
                                this.inputHelp.username = '"' + this.newUser.username + '"' + ' ' + 'is already taken.';
                                this.validationGroup.username = false;  // User name not unique
                                this.inputStatusGroup.username = this.inputStatusStyling.error;
                            } else {
                                this.inputHelp.username = ' "' + data + '"' + ' ' + 'available!';
                                this.validationGroup.username = true;  // We've cleared all validations for username.
                                this.inputStatusGroup.username = this.inputStatusStyling.success;

                                $scope.$apply();
                            }

                        });


                };

                /***************************************************************************************************
                 *  validatePassword
                 *  Validates if a user's passoword is of acceptable strength
                 *  If user is acceptable, sets inputStatusGroup.password = true, otherwise false..
                 ***************************************************************************************************/

                this.validatePassword = function () {

                    //validate type
                    if (typeof this.newUser.password != "string") {
                        this.inputHelp.password = 'String required';
                        this.validationGroup.password = false;
                        this.inputStatusGroup.password = $scthisope.inputStatusStyling.error;
                    } else


                    //validate not blank
                    if (this.newUser.password === '') {
                        this.inputHelp.password = 'Password required';
                        this.validationGroup.password = false;
                        this.inputStatusGroup.password = this.inputStatusStyling.error;
                    } else {

                        //validate complexity

                        var strongRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
                        var enoughRegex = new RegExp("(?=.{6,}).*", "g");
                        var pwd = this.newUser.password;
                        if (false == enoughRegex.test(pwd)) {
                            this.inputHelp.password = "Password must be longer";
                            this.validationGroup.password = false;
                            this.inputStatusGroup.password = this.inputStatusStyling.error;
                        } else if (strongRegex.test(pwd)) {
                            this.inputHelp.password = "";
                            this.validationGroup.password = true;  // We've cleared all validations for password.
                            this.inputStatusGroup.password = this.inputStatusStyling.success;
                        } else {
                            this.inputHelp.password = "Password must be more complex";
                            this.validationGroup.password = false;  // We've cleared all validations for password.
                            this.inputStatusGroup.password = this.inputStatusStyling.error;
                        }
                    }
                };


                /***************************************************************************************************
                 * validateEmail
                 * Validates if a user's email follows format convention (*@*.*)
                 * If acceptable, sets inputStatusGroup.email = true, otherwise false..
                 ***************************************************************************************************/

                this.validateEmail = function () {
                    //validate type
                    if (typeof this.newUser.email != "string") {
                        this.inputHelp.email = 'String required';
                        this.validationGroup.email = false;
                        this.inputStatusGroup.email = this.inputStatusStyling.error;
                    } else {


                        //validate not blank
                        if (this.newUser.email === '') {
                            this.inputHelp.email = 'Valid email required';
                            this.validationGroup.email = false;
                            this.inputStatusGroup.email = this.inputStatusStyling.error;
                        } else {

                            //validate that this is an email address
                            var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                            if (false == emailReg.test(this.newUser.email)) {
                                this.inputHelp.email = 'Valid email required';
                                this.validationGroup.email = false;
                                this.inputStatusGroup.email = this.inputStatusStyling.error;
                            } else {

                                //validate e-mail uniqueness with mizValidateUniqueEmail
                                this.call('mizValidateUniqueEmail', this.newUser.email, function (err, data) {
                                    if (err) {
                                        // Handle error
                                        console.log('failed', err);
                                        this.inputHelp.email = this.newUser.email + ' ' + 'already has an account.';
                                        this.validationGroup.email = false;  // User name not unique
                                        this.inputStatusGroup.email = this.inputStatusStyling.error;
                                    } else {
                                        console.log('Email confirmed for uniqueness: ' + data);
                                        this.inputHelp.email = '';
                                        this.validationGroup.email = true;  // We've cleared all validations for password.
                                        this.inputStatusGroup.email = this.inputStatusStyling.success;
                                        this.$apply();
                                    }
                                });
                            }
                        }
                    }
                };


                /***************************************************************************************************
                 * function: validateOtherProperties
                 * Validates the other text fields to ensure they are not blank
                 * If acceptable, sets inputStatusGroup.[property] = true, otherwise false..
                 ***************************************************************************************************/
                this.validateProperty = function (property) {

                    for (var i = 0; i < property.length; i++) {

                        //validate type

                        if (typeof this.newUser[property] != "string") {
                            this.inputHelp[property] = 'String required';
                            this.validationGroup[property] = false;
                            this.inputStatusGroup[property] = this.inputStatusStyling.error;
                        } else {



                            //validate not blank
                            if (this.newUser[property] === '') {
                                this.inputHelp[property] = "Required";
                                this.validationGroup[property] = false;
                                this.inputStatusGroup[property] = this.inputStatusStyling.error;
                            } else {

                                // field ok
                                this.inputHelp[property] = "";
                                this.validationGroup[property] = true;
                                this.inputStatusGroup[property] = this.inputStatusStyling.success;
                            }
                        }
                    }
                };

                /***************************************************************************************************
                 * registerUser
                 * Builds a user object from input form and calls server side function to create new user.
                 * Sets createUserFeedback with success message w/ username or error code.
                 ****************************************************************************************************/


                this.registerUser = function () {
                    //build the object for roles

                    this.roles = [];  // the final array of roles to be attached to user.
                    //My iteration over the object wasn't working - going for clarity .. :-/
                    if (this.permissionCheckboxes.viewCompanies)      this.roles.push('viewCompanies');
                    if (this.permissionCheckboxes.editCompanies)      this.roles.push('editCompanies');
                    if (this.permissionCheckboxes.removeCompanies)    this.roles.push('removeCompanies');
                    if (this.permissionCheckboxes.viewEngagements)    this.roles.push('viewEngagements');
                    if (this.permissionCheckboxes.editEngagements)    this.roles.push('editEngagements');
                    if (this.permissionCheckboxes.editAllEngagements) this.roles.push('editAllEngagements');
                    if (this.permissionCheckboxes.superAdmin)         this.roles.push('superAdmin');

                    //build the user
                    this.call("mizCreateUserWithRoles", this.newUser, this.roles, function (err, data) {
                        if (err) {
                            // Handle error
                            console.log('failed', err);
                            this.createUserFeedback = 'something went wrong...' + err;
                        } else {
                            // Handle success
                            console.log('New user created: ' + data);
                            this.createUserFeedback = 'Account Created: ' + data.username;

                            //reset the user entry stuff
                            this.resetForm();
                            $scope.$apply();
                        }

                    });

                };

                /***************************************************************************************************
                 * JQUERY
                 **************************************************************************************************/
// Reset Menu


                /***************************************************************************************************
                 * Start main controller
                 **************************************************************************************************/

                    //Intialize the form.
                this.resetForm();

                // clear feedback string given after user created.
                this.createUserFeedback = '';
            }
        }
    }
);