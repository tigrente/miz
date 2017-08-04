

/**********************************************************/
/*                                                        */
/*                     ADD ROOMS HERE                     */
/*                                                        */
/**********************************************************/

cooperationManagerGuideroomName = 'Cooperation Manager Guides'; // delcare variable to be used in startup process

Meteor.startup(() => {

  if (Cms.find({
    name: cooperationManagerGuideroomName
  }).count() === 0) {
  
    const room = {
      'cmsType': 'room',
      'name': cooperationManagerGuideroomName,
      'adminDesc': 'TBD',
      // Other data added when inserting into DB
    };

    Meteor.call('createGuideRoom', room, (err, data) => {
      if (err) {
          console.log('Something went wrong adding a new room to database: ' + err); 
      } else {
        console.log('Successfully created guide room', cooperationManagerGuideroomName, `(${data})`);
      }
    });

  }

  if (Cms.find({
    name: 'Test'
  }).count() === 0) {
  
    const room = {
      'cmsType': 'room',
      'name': 'Test',
      'adminDesc': 'TBD',
      // Other data added when inserting into DB
    };

    Meteor.call('createGuideRoom', room, (err, data) => {
      if (err) {
          console.log('Something went wrong adding a new room to database: ' + err); 
      } else {
        console.log('Successfully created guide room', 'Test', `(${data})`);
      }
    });

  }

});