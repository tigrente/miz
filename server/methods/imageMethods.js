
Meteor.publish("images", function() {
    return Images.find();
});


Meteor.publish("partnerImages", function(imageId, partnerType) {
    return Images.find({ $or: [
        {_id: imageId},
        {mizSystemReference: partnerType}
        ]});

});

