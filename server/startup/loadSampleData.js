Meteor.startup(function () {

        //Sample data
        const NUMBER_OF_SAMPLE_PARTNERS_PER_TYPE = 100;  // The number of sample partners to create per type (x10 types)
        const NUMBER_OF_SAMPLE_USERS_PER_TYPE = 30;  // The number of sample users to create per type (2 types)
        const NUMBER_OF_SAMPLE_ENGAGEMENTS_PER_TYPE = 100;  // The number of sample engagements to create per type (x10 types)
        const NUMBER_OF_SAMPLE_LOG_ENTRIES_PER_ENGAGEMENT = 10;  // Log entries created (x engPerType x 10)


        let partnerCounter = 0; //counter for partners created
        let engagementCounter = 0; //counter for engagements created
        let logCounter = 0; // counter for log entries

        /** FIRST: CREATE A SAMPLE USER SET, INCLUDING OUR SUPER-ADMIN USER
         * We also include some console logging to check assignment of roles
         * */

        /**************************************************************************************
         *  createSampleUserWithRoles
         *  This method creates takes an account object, validates, builds a user object,
         *  and then adds the user.  It is recreated here instead of using mizAddUserWithRoles
         *  because the main method  checks for admin privileges.  This one only exists if there
         *  are no users at all.
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

        let createSampleUserWithRoles = function (newUser, roles) {

            //prepare an object to create the new account
            let newAccount = {};
            newAccount.username = newUser.username;
            newAccount.email = newUser.email;
            newAccount.password = newUser.password;
            newAccount.profile = {};
            newAccount.profile.enabled = newUser.enabled;
            newAccount.profile.name = newUser.name;
            newAccount.profile.huaweiId = newUser.huaweiId;
            newAccount.profile.company = newUser.company;
            newAccount.profile.group = newUser.group;

            //also add a lowercase_username property to faciliate inexpensive, case-insensitive username searching
            newAccount.profile.lowercase_username = newAccount.username.toLowerCase();
            newAccount.profile.lowercase_email = newAccount.email.toLowerCase();

            //Create base account
            Accounts.createUser(newAccount);

            //Get a handle for the account
            let user = Meteor.users.findOne({"username": newAccount.username});
            //console.log("User " + user.username + " created.");

            //Add roles to the account
            Roles.addUsersToRoles(user, roles);

            return user; // send the new user back (requires ReactiveMethods to use).

        };


        /** IF NO USERS, create Admin.  If development environment,  create additional sample users **/

        if (Meteor.users.find().count() === 0) {

            /**************************************************************************************
             * OBJECT: admin - administrative user
             * @type {{username: string, email: string, password: string, name: string, huaweiId: string, company: string, group: string, enabled: boolean}}
             ***************************************************************************************/

            let admin = {
                username: "admin",
                email: "mizadmin@huawei.com",
                password: "admin",        //in plain text
                name: "Administrator",
                huaweiId: "A00654321",
                company: "Futurewei",
                group: "Biz Dev Team",
                enabled: true
            };

            let adminRoles = [
                'superAdmin',
                'viewCompanies',
                'editCompanies',
                'removeCompanies',
                'viewEngagements',
                'editEngagements',
                'editAllEngagements'
            ];

            createSampleUserWithRoles(admin, adminRoles);


            if (Meteor.isDevelopment) { //only create additional users in dev environment
                for (let i = 0; i < NUMBER_OF_SAMPLE_USERS_PER_TYPE; i++) {

                    /**************************************************************************************
                     * OBJECT: cm - cooperation manager user
                     * @type {{username: string, email: string, password: string, name: string, huaweiId: string,
                 * company: string, group: string, enabled: boolean}}
                     **************************************************************************************/

                    let cm = {
                        username: "cm" + i,
                        email: "cm" + i + "@huawei.com",
                        password: "cm",        //in plain text
                        name: "Cooperation Manager " + i,
                        huaweiId: "A00999999",
                        company: "Futurewei",
                        group: "Biz Dev Team",
                        enabled: true
                    };

                    let cmRoles = [
                        'viewCompanies',
                        'editCompanies',
                        'viewEngagements',
                        'editEngagements'
                    ];


                    /**************************************************************************************
                     * OBJECT: lab - typical lab user- just browsing companies
                     * @type {{username: string, email: string, password: string, name: string, huaweiId: string,
                 * company: string, group: string, enabled: boolean}}
                     **************************************************************************************/

                    let lab = {
                        username: "lab" + i,
                        email: "lab" + i + "@huawei.com",
                        password: "lab",        //in plain text
                        name: "Lab Manager " + i,
                        huaweiId: "A00654321",
                        company: "Futurewei",
                        group: "Lab Group " + i,
                        enabled: true
                    };

                    let labRoles = [
                        'viewCompanies',
                        'editCompanies'
                    ];


                    /**************************************************************************************
                     * Create the users.
                     *************************************************************************************/
                    createSampleUserWithRoles(cm, cmRoles);
                    createSampleUserWithRoles(lab, labRoles);
                } // for-loop
            } //if development
        } // if (no users) ...


        /**************************************************************************************
         *  Load Sample Partners
         **************************************************************************************/

        /**
         * generates sample partners
         */

        let partnerTypeArray = [
            'company',
            'individual',
            'professor',
            'university',
            'uniSubOrg',
            'contact',
            'incubator',
            'venture',
            'association',
            'other'
        ];

        let registerSamplePartner = function (newPartner) {

            /*        //Attach the logo
             var logoId = null;
             var file = new FS.File();
             setTimeout(function(){file.attachData(logoPath, {type: 'image/png'}, 1000);



             file.name( 'logo.png' );
             var image;
             setTimeout(function(){image = Images.insert(file);}, 1000);

             logoId = image._id;
             });*/


            let dbNewPartner = {};
            dbNewPartner.name = newPartner.name;                                // str - partner name
            dbNewPartner.partnerType = newPartner.partnerType;                  // str - partner type (university, etc.)
            dbNewPartner.description = newPartner.description;                  // str - partner description
            dbNewPartner.cooperationResource = newPartner.cooperationResource;  // bool - track as cooperation resource
            dbNewPartner.parentPartners = newPartner.parentPartners;            // array of partner IDs
            dbNewPartner.bizDevOwners = newPartner.bizDevOwners;                // array of User IDs
            dbNewPartner.crsNumber = newPartner.crsNumber;                      // str - CRS number
            dbNewPartner.logo = null;                                // str - ID of logo in ImageDB
            dbNewPartner.website = newPartner.website;                          // str - website
            dbNewPartner.notes = newPartner.notes;                              // str - notes
            dbNewPartner.contactInfo = newPartner.contactInfo;                  // str - Contact info


            //also add a lowercase_username property to facilitate inexpensive, case-insensitive username searching
            dbNewPartner.lowercase_name = newPartner.name.toLowerCase();


            //add auto data
            dbNewPartner.createdById = "STARTUP SAMPLE DATA";
            dbNewPartner.creationDate = new Date();
            dbNewPartner.modifiedById = "STARTUP SAMPLE DATA";
            dbNewPartner.modifiedDate = new Date();


            //Create base account
            Partners.insert(dbNewPartner);

            //Get a handle for the account
            let partner = Partners.findOne({"name": dbNewPartner.name});
            //console.log(partner.name + " created.");


        };


        if ((Partners.find().count() === 0) && (Meteor.isDevelopment)) {

            console.log("LOADING SAMPLE PARTNERS...");

            let bizDevOwner = Meteor.users.findOne({username: {$eq: "cm1"}});


            /** JUSTICE LEAGUE **/

                //Let's create some representative partners
            let stanfordUniversity = {
                    // Universal fields for all partners
                    name: "Stanford University",
                    description: "Stanford University, officially Leland Stanford Junior University, is a private research university in Stanford, California, and one of the world's most prestigious institutions",
                    partnerType: "university",    // individual, company, incubator, venture, university, association
                    cooperationResource: false, // Marked true if a cooperation resource
                    logo: "",            // attach in a second
                    website: "https://www.stanford.edu",  // website
                    contactInfo: "Palo Alto, CA",     // String - textbox for phone, e-mail, etc.
                    notes: "Stanford's academic strength is broad with 40 departments in the three academic schools that have undergraduate students and another four professional schools.Notes regarding Stanford",          // notes
                    parentPartners: [], // partnerIDs for which this partner is a member
                    bizDevOwners: [bizDevOwner._id],   // userIDs for assigned BD managers
                    crsNumber: "888888888",      // CRS database number

                    enabled: true   //implemented as checkbox
                };

            let imgPath = "/Users/Alex/Dev/miz/server/startup/img/stanford_logo.png";
            registerSamplePartner(stanfordUniversity, imgPath);

            let parentPartner = Partners.findOne({name: {$eq: "Stanford University"}});
            //console.log("Parent partner: " + parentPartner.name);

            /** Superman **/

                //Let's create some representative partners
            let superman = {
                    // Universal fields for all partners
                    name: "Clark Kent",
                    description: "Superman is a fictional superhero appearing in American comic books published by DC Comics.",    // for individuals, this is Title
                    partnerType: "individual",    // individual, company, incubator, venture, university, association
                    cooperationResource: true, // Marked true if a cooperation resource
                    logo: "",            // attach in a second
                    website: "https://en.wikipedia.org/wiki/Superman",  // website
                    contactInfo: "Hall of Justice, Washington DC",     // String - textbox for phone, e-mail, etc.
                    notes: "Faster than a speeding bullet.",          // notes
                    parentPartners: [parentPartner._id], // partnerIDs for which this partner is a member
                    bizDevOwners: [bizDevOwner._id],   // userIDs for assigned BD managers
                    crsNumber: "888888888",      // CRS database number

                    enabled: true   //implemented as checkbox
                };


            registerSamplePartner(superman, imgPath);


            /** Batman **/

                //Let's create some representative partners
            let batman = {
                    // Universal fields for all partners
                    name: "Bruce Wayne",
                    description: "Batman is a fictional superhero appearing in American comic books published by DC Comics.",    // for individuals, this is Title
                    partnerType: "individual",    // individual, company, incubator, venture, university, association
                    cooperationResource: true, // Marked true if a cooperation resource
                    logo: "",            // attach in a second
                    website: "https://en.wikipedia.org/wiki/Batman",  // website
                    contactInfo: "Hall of Justice, Washington DC",     // String - textbox for phone, e-mail, etc.
                    notes: "Faster than a speeding bullet.",          // notes
                    parentPartners: [parentPartner._id], // partnerIDs for which this partner is a member
                    bizDevOwners: [bizDevOwner._id],   // userIDs for assigned BD managers
                    crsNumber: "888888888",      // CRS database number

                    enabled: true   //implemented as checkbox
                };

            registerSamplePartner(batman, imgPath);


            /** The Flash **/

                //Let's create some representative partners
            let theFlash = {
                    // Universal fields for all partners
                    name: "Barry Allan",
                    description: "The Flash is a fictional superhero appearing in American comic books published by DC Comics.",    // for individuals, this is Title
                    partnerType: "individual",    // individual, company, incubator, venture, university, association
                    cooperationResource: true, // Marked true if a cooperation resource
                    logo: "",            // attach in a second
                    website: "https://en.wikipedia.org/wiki/the_Flash",  // website
                    contactInfo: "Hall of Justice, Washington DC",     // String - textbox for phone, e-mail, etc.
                    notes: "Nicknamed the Scarlet Speedster",          // notes
                    parentPartners: [parentPartner._id], // partnerIDs for which this partner is a member
                    bizDevOwners: [bizDevOwner._id],   // userIDs for assigned BD managers
                    crsNumber: "888888888",      // CRS database number

                    enabled: true   //implemented as checkbox
                };

            registerSamplePartner(theFlash, imgPath);


            /** WonderWoman **/

                //Let's create some representative partners
            let wonderWoman = {
                    // Universal fields for all partners
                    name: "Diana Prince",
                    description: "Wonder Woman is a fictional superhero appearing in American comic books published by DC Comics.",    // for individuals, this is Title
                    partnerType: "individual",    // individual, company, incubator, venture, university, association
                    cooperationResource: true, // Marked true if a cooperation resource
                    logo: "",            // attach in a second
                    website: "https://en.wikipedia.org/wiki/wonder_Woman",  // website
                    contactInfo: "Hall of Justice, Washington DC",     // String - textbox for phone, e-mail, etc.
                    notes: "Cool bracelets.",          // notes
                    parentPartners: [parentPartner._id], // partnerIDs for which this partner is a member
                    bizDevOwners: [bizDevOwner._id],   // userIDs for assigned BD managers
                    crsNumber: "888888888",      // CRS database number

                    enabled: true   //implemented as checkbox
                };

            registerSamplePartner(wonderWoman, imgPath);

            /*****************************************
             * Mass create partners for scale testing
             ****************************************/


            for (let i = 0; i < NUMBER_OF_SAMPLE_PARTNERS_PER_TYPE; i++) {
                for (let j = 0; j < partnerTypeArray.length; j++) {

                    ++partnerCounter;

                    if (!(partnerCounter % 1000))
                        console.log("Partner: " + partnerCounter);

                    let cooperationResource = false;

                    cooperationResource = j < 2;  //Enable cooperation results only to the first 3 elements (Company, Professor, IC)

                    let newPartner = {
                        name: partnerTypeArray[j] + ' ' + i,
                        description: dimsum(1),
                        'partnerType': partnerTypeArray[j],
                        cooperationResource: cooperationResource
                    };

                    //console.log(newPartner.name);
                    //console.log(newPartner.description);
                    //console.log(newPartner.partnerType);
                    Partners.insert(newPartner);
                }
            }


            /*  /!** THIS SECTION LOADS SAMPLE LOG DATA UNDER STANFORD **!/
             var stanfordPartnerObject = Partners.findOne({'name': 'Stanford University'});
             var stanfordId = stanfordPartnerObject._id;


             for (let i = 0; i < 100; i++) {

             var newLogEntry = {
             date: new Date(),
             subjectId: stanfordId,
             subEntries: [
             {
             headline: dimsum(5),
             details: dimsum(50),
             files: []
             },
             {
             headline: dimsum(3),
             details: dimsum(20),
             files: []
             },
             {
             headline: dimsum(10),
             details: dimsum(5),
             files: []
             },
             {
             headline: dimsum(5),
             details: dimsum(50),
             files: []
             },
             {
             headline: dimsum(4),
             details: dimsum(1),
             files: []
             }
             ]

             };

             Meteor.call('logsCreateEntry', newLogEntry);
             }*/


        } //load sample partners


        /**************************************************************************************
         * Load Sample Engagements
         **************************************************************************************/

        let engagementTypeArray = [
            "Technical Cooperation",
            "Early Innovation",
            "Business Development",
            "Internal Project"
        ];


        let chooseRandomPartner = function (ensureCooperationResource) {
            let validCooperationResource = false;
            let sampleSet;
            let samplePartner;


            while (!validCooperationResource) {

                sampleSet = Partners.aggregate(
                    {$sample: {size: 1}}
                );

                samplePartner = sampleSet[0];

                if (samplePartner.cooperationResource || !ensureCooperationResource)
                    validCooperationResource = true;
            }

            return samplePartner._id;
        };

        let chooseRandomCooperationManagerId = function (admin) {
            let validCooperationManager = false;
            let sampleSet;
            let sampleCM;

            if (admin) {
                sampleCM = Meteor.users.findOne({username: "admin"});
                return sampleCM._id;
            } else {

                while (!validCooperationManager) {

                    sampleSet = Meteor.users.aggregate(
                        {$sample: {size: 1}}
                    );

                    sampleCM = sampleSet[0];

                    if (Roles.userIsInRole(sampleCM._id, 'editEngagements'))
                        validCooperationManager = true;
                }

                return sampleCM._id;
            }
        };


        let loadSampleLogEntries = function (subjectId, quantity) {

            let newLogEntry = {
                subjectId: subjectId,
                date: new Date(),
                currentStatus: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursu.",
                nextStep: "Lorem ipsum dolor sit amet",
                subEntries: [
                    {
                        headline: "Headline ",
                        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at feugiat lectus. Vivamus commodo ullamcorper sapien eu tincidunt. Phasellus ut enim mi. Suspendisse vel placerat quam, a ullamcorper est. Aenean scelerisque sem sapien, vel cursus metus maximus ac. In cursus nulla in vehicula aliquam. Etiam id pulvinar ex, sed faucibus sapien. Quisque viverra pulvinar ex, sed imperdiet neque bibendum ut. Praesent tristique convallis odio sed rutrum. Morbi tristique orci nec libero volutpat tincidunt. Duis mauris dolor, tristique mattis commodo sed, fermentum eu ante.\n Phasellus tincidunt consectetur lorem condimentum feugiat. Aenean mollis diam sapien, non eleifend dui dapibus ut. Aliquam erat volutpat. Morbi at iaculis est, non lobortis massa. Aenean at aliquam quam. Vestibulum ante diam, faucibus sit amet sapien id, sollicitudin molestie nunc. Nam varius ex leo, non volutpat urna iaculis et. Proin blandit dictum accumsan.\n\n Quisque eros mi, convallis sit amet nisi nec, aliquet aliquet tortor. Mauris imperdiet nisi nisl. Ut sed pellentesque nibh. Proin consequat cursus tincidunt. Pellentesque pharetra a mi eu tristique. In ultricies maximus sodales. Aenean vehicula, velit quis ultricies egestas, quam ipsum vehicula justo, ut bibendum sapien metus tempor eros.",
                        files: []
                    },
                    {
                        headline: "",
                        details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at feugiat lectus. Vivamus commodo ullamcorper sapien eu tincidunt. Phasellus ut enim mi. Suspendisse vel placerat quam, a ullamcorper est. Aenean scelerisque sem sapien, vel cursus metus maximus ac. In cursus nulla in vehicula aliquam. Etiam id pulvinar ex, sed faucibus sapien. Quisque viverra pulvinar ex, sed imperdiet neque bibendum ut. Praesent tristique convallis odio sed rutrum. Morbi tristique orci nec libero volutpat tincidunt. Duis mauris dolor, tristique mattis commodo sed, fermentum eu ante.\n Phasellus tincidunt consectetur lorem condimentum feugiat. Aenean mollis diam sapien, non eleifend dui dapibus ut. Aliquam erat volutpat. Morbi at iaculis est, non lobortis massa. Aenean at aliquam quam. Vestibulum ante diam, faucibus sit amet sapien id, sollicitudin molestie nunc. Nam varius ex leo, non volutpat urna iaculis et. Proin blandit dictum accumsan.\n\n Quisque eros mi, convallis sit amet nisi nec, aliquet aliquet tortor. Mauris imperdiet nisi nisl. Ut sed pellentesque nibh. Proin consequat cursus tincidunt. Pellentesque pharetra a mi eu tristique. In ultricies maximus sodales. Aenean vehicula, velit quis ultricies egestas, quam ipsum vehicula justo, ut bibendum sapien metus tempor eros.",
                        files: []
                    }
                ]
            };

            for (let i = 0; i < quantity; ++i) {

                ++logCounter;
                if (!(logCounter % 1000))
                    console.log("Log entry: " + logCounter);

                newLogEntry.subEntries[0].headline = "Headline" + " " + i;
                newLogEntry.subEntries[1].headline = "Sub-headline" + " " + i;

                let randomUser = Meteor.users.findOne();

                //add auto data
                newLogEntry.createdById = randomUser._id;
                newLogEntry.createdByName = randomUser.profile.name;
                newLogEntry.creationDate = new Date();
                newLogEntry.modifiedById = randomUser._id;
                newLogEntry.modifiedDate = new Date();
                newLogEntry.hidden = false;

                //Insert the log entry into the database
                Logs.insert(newLogEntry, (err, entryId) => {
                    if (err) {
                        throw new Meteor.Error('Something went wrong when trying to add: ' + err);
                    } else {
                        //console.log("New log entry created: " + entryId);




                        return entryId;  // send back for
                    }
                });
            }
        };


        if ((Engagements.find().count() === 0) && (Meteor.isDevelopment)) {
            console.log("LOADING SAMPLE ENGAGEMENTS...");

            for (let i = 0; i < NUMBER_OF_SAMPLE_ENGAGEMENTS_PER_TYPE; i++) {
                for (let j = 0; j < engagementTypeArray.length; j++) {

                    ++engagementCounter;

                    if (!(engagementCounter % 1000))
                        console.log("Engagement: " + engagementCounter);

                    let newEngagementID;

                    let sampleContractingPartner = chooseRandomPartner(false);
                    let sampleCooperationResource = chooseRandomPartner(true);
                    let assignToAdmin = false;

                    assignToAdmin = i % 5 == 0;  // assign every 5th to admin

                    let newEngagement = {
                        type: engagementTypeArray[j],                       //may determine appearance of fields
                        contractingPartners: [sampleContractingPartner],    //partnerId - the contracted partners
                        cooperationResources: [sampleCooperationResource],
                        contractingPartnersLabel: [], //array of strings, the denormalized partner names used for menus
                        cooperationResourcesLabel: [], //array of strings, denormalized partner names used for menus

                        tempLab: "Some Lab",       //temp string with name of lab
                        labs: [],                  //string: the lab requesting the project
                        labLabel: [],              //array of strings - lab names

                        projectManager: "PM " + " " + i,         //project manager
                        hwRelated: "",              //rich text field : just to list Huawei contacts until db integration

                        hwEntity: "Futurewei",      //Futurewei, HQ

                        title: engagementTypeArray[j] + " " + i,                  //project name, or name of this engagement
                        background: "Ipsum lorem regarding " + engagementTypeArray[i],             //short description of project
                        reference: "",              //simple reference for tagging outside of miz
                        dealValue: 0,

                        bdOwner: chooseRandomCooperationManagerId(assignToAdmin),               //make every third acount belond to admin
                        bdOwnerLabel: "",

                        bdRelated: [chooseRandomCooperationManagerId(0), chooseRandomCooperationManagerId(0)],              //userIds - other Huawei folks engaged with this
                        bdRelatedLabel: [],         //labeled strings

                        hqCooperationManger: "",    // text field (until integration)


                        relatedPartners: [],        // partners, for talent searches

                        status: "New",              // text update
                        stage: "New",
                        filingStatus: "active",     // determines how engagement is categorized: active, archive, on hold, executing

                        tasks: [],                  // task list {description, done, created, due}

                        dateStarted: new Date(),   // inception date

                        lastUpdated: new Date(),    // last date updated, log entry added, etc.*/

                    };

                    newEngagement.createdById = newEngagement.bdOwner;
                    newEngagement.creationDate = new Date();
                    newEngagement.modifiedById = newEngagement.bdOwner;
                    newEngagement.modifiedDate = new Date();


                    /** PREPARE PARTNER LABELS **/
                    let tempCooperationResourcesLabel = [];
                    let tempContractingPartnersLabel = [];


                    for (let i = 0; i < newEngagement.cooperationResources.length; i++) {
                        let partner = Partners.findOne(newEngagement.cooperationResources[i]);
                        tempCooperationResourcesLabel.push(partner.name);
                    }

                    for (let i = 0; i < newEngagement.contractingPartners.length; i++) {
                        let partner = Partners.findOne(newEngagement.contractingPartners[i]);
                        tempContractingPartnersLabel.push(partner.name);
                    }

                    newEngagement.contractingPartnersLabel = tempContractingPartnersLabel;
                    newEngagement.cooperationResourcesLabel = tempCooperationResourcesLabel;

                    /** PREPARE BD OWNER LABELS **/
                    let tempBdOwnerLabel = "";
                    let tempBdRelatedLabel = [];

                    if (newEngagement.bdOwner) {
                        let bdOwner = Meteor.users.findOne(newEngagement.bdOwner);
                        tempBdOwnerLabel = bdOwner.profile.name;
                    }

                    for (let i = 0; i < newEngagement.bdRelated.length; i++) {
                        let bdOwner = Meteor.users.findOne(newEngagement.bdRelated[i]);
                        tempBdRelatedLabel.push(bdOwner.profile.name);
                    }


                    newEngagement.bdOwnerLabel = tempBdOwnerLabel;
                    newEngagement.bdRelatedLabel = tempBdRelatedLabel;

                    newEngagementID = Engagements.insert(newEngagement);

                    //console.log("Engagement Created:" + newEngagementID + " : " + newEngagement.title);

                    loadSampleLogEntries(newEngagementID, NUMBER_OF_SAMPLE_LOG_ENTRIES_PER_ENGAGEMENT);


                } // for j
            } // for i
        }  // Load engagements

        /**
         * This section loads default images into the image database.  These are the default icons used for partners, etc when users do not put them in. images are pulled from /server/startup/img
         * It is run every time meteor starts.  If the images aren't there, they aren't loaded.
         */

        let removeDefaultImage = function (defaultName) {
            if (Images.findOne({mizSystemReference: defaultName}) != null) {
                Images.remove({mizSystemReference: defaultName});
                console.log("Removing default image: " + defaultName)
            } else console.log("No default image to remove for: " + defaultName);
        };


        let importDefaultImage = function (defaultName, index, array) {
            let meteor_root = Npm.require('fs').realpathSync(process.cwd() + '/../');
            let application_root = Npm.require('fs').realpathSync(meteor_root + '/../');

// if running on dev mode
            if (Npm.require('path').basename(Npm.require('fs').realpathSync(meteor_root + '/../../../')) == '.meteor') {
                application_root = Npm.require('fs').realpathSync(meteor_root + '/../../../../');
            }


//todo: This needs to be updated to adapt for when it is pushed to the server.  Identify local path and pull from the appropriate directory
            let basepath = process.env.PWD;
            console.log('basepath: ' + basepath);
            //todo: This path needs to be modified when compiled on pc or deployed.
            let imgdir = basepath + "/server/startup/img/";  //mac & linux version
            //let imgdir = "/DEV/miz/server/startup/img/";// PC - direct path
            //let imgdir = application_root + "\\server\\startup\\img\\";
            console.log('imgdir: ' + imgdir);
            let imgfilename = imgdir + defaultName + ".png";
            console.log('filename: ' + imgfilename);
            let img = new FS.File(imgfilename);
            img.mizSystemReference = defaultName;
            Images.insert(img);
            console.log("Added default image: " + defaultName);
        };

        partnerTypeArray.forEach(removeDefaultImage);
        partnerTypeArray.forEach(importDefaultImage);

    }
)
;
