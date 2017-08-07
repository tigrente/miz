// Publish user list for admin console


/**
 *
 *
 *
 */

Meteor.publish('userList', function (options, searchString, roles) {

    console.log('roles: ' + roles);
    console.log('searchString: ' + searchString);
    if (!Roles.userIsInRole(this.userId,
            ['superAdmin',
                'viewCompanies',
                'editCompanies',
                'removeCompanies',
                'viewEngagements',
                'editEngagements',
                'editAllEngagements'])) {
        throw new Meteor.Error(403, "Access denied")
    }

    if (searchString == null)
        searchString = '';

    if (roles == null)
        roles = '';


    // Restrict the fields to be exposed and add it to the options object.
    var fieldOption = {
        fields: {
            username: 1,
            emails: 1,
            profile: 1,
            roles: 1
        }
    };


    options["fields"] = fieldOption["fields"];


    return Meteor.users.find({
        $and: [
            {
                $or: [
                    {'username': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.company': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.group': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.huaweiId': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'emails.address': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}
                ]
            },

            {'roles': {'$regex': '.*' + roles || '' + '.*', '$options': 'i'}},

            {'username': {$not: {$eq: 'admin'}}}   //do not return Administrator account in the results
        ]


    }, options); //find
}) //publish
;


Meteor.publish('userDetail', function (targetUserId) {


    if (!Roles.userIsInRole(this.userId,
            ['superAdmin'])) {
        throw new Meteor.Error(403, "Access denied")
    }

    if (!targetUserId)
        return null;

    var options = {
        fields: {
            username: 1,
            emails: 1,
            profile: 1,
            roles: 1
        }
    };

    return Meteor.users.find({_id: targetUserId}, options);
});


/** Used to publish names when searching for biz dev owners on partners **/
Meteor.publish('userBizDevOwnerSearch', function (searchString) {

    //console.log("Searching for user:" + searchString)

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin',
                'viewCompanies',
                'editCompanies',
                'removeCompanies',
                'viewEngagements',
                'editEngagements',
                'editAllEngagements'])) {
        throw new Meteor.Error(403, "Access denied")
    }

    if (!searchString)
        searchString = '';

    let options = {
        fields: {
            emails: 1,
            profile: 1,
            roles: 1
        }
    };

    let selector = {
        $and: [
            {
                $or: [
                    {'username': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.company': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.group': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'profile.huaweiId': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'emails.address': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}
                ]
            },

            {
                $or: [
                    {roles: {$elemMatch: {$eq: 'editEngagements'}}},
                    {roles: {$elemMatch: {$eq: 'editAllEngagements'}}}
                ]
            },

            {'username': {$not: {$eq: 'admin'}}}   //do not return Administrator account in the results
        ]
    };


    return Meteor.users.find(selector, options);
});

/**
 * userSimpleList
 * Takes either a single ID as a STRING or an ARRAY of ids. Returns users associated with IDs.
 */

Meteor.publish('userSimpleList', function (searchId) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin',
                'viewCompanies',
                'editCompanies',
                'removeCompanies',
                'viewEngagements',
                'editEngagements',
                'editAllEngagements'])) {
        throw new Meteor.Error(403, "Access denied")
    }

    let options = {
        fields: {
            emails: 1,
            profile: 1,
            roles: 1
        }
    };

    if(!searchId)
    searchId = [];

    if (!Array.isArray(searchId))
        searchId = [searchId];

    var selector = {
        _id: {$in: searchId}
    };


    return Meteor.users.find(selector,options);
});


/*************** USER METHODS ****************/



Meteor.methods({
    /**************************************************************************************************
     * METHOD: permissionTo
     * Checks whether the selected user belongs to the listed permission array
     * @param checkUserID
     * @param checkRole
     * @returns {*}
     **************************************************************************************************/
    //Checks if user belongs to a certain role. Returns True if user has permission.
    //Role must be defined as text in array - e.g. ['super-admin']
    permissionTo: function (checkUserID, checkRole) {

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin'])) {
            throw new Meteor.Error(403, "Access denied")
        }
        return Roles.userIsInRole(checkUserID, checkRole);
    },


    /**************************************************************************************
     *  METHOD: mizUpdateUser
     *  This method creates takes an account object, validates, builds a user object,
     *  and then adds the user. Validation is done by Meteor system.
     ***************************************************************************************/

    mizUpdateUser: function (user) {
        //check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin'])) {
            throw new Meteor.Error("Access denied")
        }


        //update username
        Accounts.setUsername(user._id, user.username);

        //get original user, because we need the original email address to remove it.
        var originalUser = Meteor.users.findOne({_id: user._id});
        Accounts.removeEmail(user._id, originalUser.emails[0].address);
        Accounts.addEmail(user._id, user.emails[0].address);

        Meteor.users.update({_id: user._id}, {$set: {"profile.name": user.profile.name}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.company": user.profile.company}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.group": user.profile.group}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.enabled": user.profile.enabled}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.huaweiId": user.profile.huaweiId}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.o2w_serial": user.profile.o2w_serial}});

        //also add a lowercase_username property to faciliate inexpensive, case-insensitive username searching
        Meteor.users.update({_id: user._id}, {$set: {"profile.lowercase_username": user.username.toLowerCase()}});
        Meteor.users.update({_id: user._id}, {$set: {"profile.lowercase_email ": user.emails[0].address.toLowerCase()}});


        //list of role options (really should  be in a better place...)

        var roleList = [
            'superAdmin',
            'viewCompanies',
            'editCompanies',
            'removeCompanies',
            'viewEngagements',
            'editEngagements',
            'editAllEngagements'
        ];

        var roleListWithoutSuperAdmin = [
            'viewCompanies',
            'editCompanies',
            'removeCompanies',
            'viewEngagements',
            'editEngagements',
            'editAllEngagements'
        ];

        //first check to see if editing self - then remove roles.  We don't want to remove our own admin privilidges!
        if (this.userId == user._id)
            Roles.removeUsersFromRoles(user._id, roleListWithoutSuperAdmin);// if so, remove all roles EXCEPT admin roles
        else
            Roles.removeUsersFromRoles(user._id, roleList); // if not, remove all roles


        //Add roles to the account
        Roles.addUsersToRoles(user, user.roles);


        /*   // Send diagnostic results to the console.
         console.log(user.username + ' ' + 'is in' + ' ' + 'superAdmin' + ' =' + Roles.userIsInRole(user, 'super-admin'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'viewCompanies' + ' =' + Roles.userIsInRole(user, 'viewCompanies'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'editCompanies' + ' =' + Roles.userIsInRole(user, 'editCompanies'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'removeCompanies' + ' =' + Roles.userIsInRole(user, 'removeCompanies'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'viewEngagements' + ' =' + Roles.userIsInRole(user, 'viewEngagements'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'editEngagements' + ' =' + Roles.userIsInRole(user, 'editEngagements'));
         console.log(user.username + ' ' + 'is in' + ' ' + 'editAllEngagements' + ' =' + Roles.userIsInRole(user, 'editAllEngagements'));
         */
        console.log("Updated user: " + user.username);
        return user; // send the updated user back (requires ReactiveMethods) to use.

    },


    mizChangePassword: function (user, newPassword) {
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        Accounts.setPassword(user, newPassword);

        console.log("password changed for " + user.username);

    }
    ,

    /***************************************************************************************
     *  METHOD: mizDeleteUser
     *  Deletes the user account from the Meteor user database.   This currently does
     *  no cleanup - so using it will leave hanging references to users that do not exist.
     ***************************************************************************************/

    mizDeleteUser: function (doomedUser) {
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        console.log("Account destroyed: " + doomedUser.username);
        Meteor.users.remove(doomedUser._id);


    },


    /** ************************************************************************************
     *  METHOD: mizCreateUserWithRoles
     *  This method creates takes an account object, validates, builds a user object,
     *  and then adds the user.
     *
     *  The expected newUser object should look like this:
     *  newUser {
     *      username    : "foo",
     *      email       : "foo@foo.com",
     *      password    : "password",        //in plain text
     *      name        : "Alex Thatcher",
     *      huaweiId    : "A00654321",
     *      company     : "Futurewei",
     *      group       : "Biz Dev Team"
     *
     *      }
     *
     *  Roles should be added as an array of strings.  e.g. ['viewCompanies', 'superAdmin']
     *
     *  Note that usernames and e-mail are validated by Accounts.createUser to be unique.
     *  Name, HuaweiId, company, and group are all part of user.profile.*.
     *
     *  Roles are added separately for accounting in both Accounts and Roles databases.
     *
     *
     *  For more info, see Account schema at http://docs.meteor.com/#/full/accounts_api
     * ************************************************************************************/


    mizCreateUserWithRoles: function (newUser, roles) {

        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        // Validate information being used to create a user account.

        // ** needs to be implemented **

        //prepare an object to create the new account
        console.log("Account preparation...");
        var newAccount = {};
        newAccount.username = newUser.username;
        newAccount.email = newUser.email;
        newAccount.password = newUser.password;
        newAccount.profile = {};
        newAccount.profile.enabled = newUser.enabled;
        newAccount.profile.name = newUser.name;
        newAccount.profile.huaweiId = newUser.huaweiId;
        newAccount.profile.company = newUser.company;
        newAccount.profile.group = newUser.group;
        newAccount.profile.o2w_serial = newUser.o2w_serial;
        newAccount.profile.bizDevOwnedPartners = [];
        newAccount.profile.bizDevOwnedPartners = [];

        //also add a lowercase_username property to faciliate inexpensive, case-insensitive username searching
        newAccount.profile.lowercase_username = newAccount.username.toLowerCase();
        newAccount.profile.lowercase_email = newAccount.email.toLowerCase();

        //Create base account
        Accounts.createUser(newAccount);

        //Get a handle for the account
        var user = Meteor.users.findOne({"username": newAccount.username});
        console.log(user.username + " created.");

        //Add roles to the account
        Roles.addUsersToRoles(user, roles);

        console.log(user.username + " permissions added.");
        return user; // send the new user back (requires ReactiveMethods) to use.

    },


    /**
     * METHOD: mixValidateUniqueUser
     * Validates that user does not already exist.  Checks vs lowercase copy of username in profile, much less
     * expensive than doing RegEx if database becomes large.
     * @param username
     * @returns {username}
     */
    mizValidateUniqueUsername: function (username) {

        console.log('Validating unique user:' + username);
        if (Meteor.users.findOne({'profile.lowercase_username': username.toLowerCase()}))
            throw new Meteor.Error(username + " Username already exists.");
        else
            return username;

    },


    /**
     * METHOD: mixValidateUniqueEmail
     * Validates that user email not already exist.  Checks vs lowercase copy of username in profile, much less
     * expensive than doing RegEx if database becomes large.
     * @param username
     * @returns {username}
     */
    mizValidateUniqueEmail: function (email) {
        if (Meteor.users.findOne({'profile.lowercase_email': email.toLowerCase()}))
            throw new Meteor.Error(email + " already exists.");
        else
            return email;

    },

    mizGetUserInfo: function (userId) {
        if (!Roles.userIsInRole(this.userId,
                ['superAdmin'])) {
            console.log("mizGetUserInfo - access denied");
            throw new Meteor.Error(403, "Access denied")
        }

        var user = Meteor.users.findOne({'_id': userId});
        console.log("mizGetUserInfo - userid:" + userId);
        console.log("mizGetUserInfo - user:" + user.username);

        if (user == null)
            throw new Meteor.Error("User not found");
        else
            return user;
    },

    /**
     * METHOD: isEditingOWnProfile
     * Returns true if the current user profile matches the one sent to the method.  Used to disable the admin checkbox
     * @param editedUserId
     * @returns {boolean}
     */
    isEditingOwnProfile: function (editedUserId) {
        if (!Roles.userIsInRole(this.userId,
                ['superAdmin'])) {
            console.log("mizGetUserInfo - access denied");
            throw new Meteor.Error("Access denied")
        }

        return (Meteor.userId() == editedUserId);

    }


});


