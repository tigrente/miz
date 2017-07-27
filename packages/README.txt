Packages included here are automatically updated when Meteor builds/

-- GridFS - cfsL:gridfs Package  8/30/16 --
cfs:gridfs  upgraded from 0.0.33 to 0.0.34

This package is from: https://github.com/badmark/Meteor-CollectionFS.
It fixes a dependency caused by upgrading node that would result in error messages with:
[Error: Cannot find module '../build/Release/bson'] code: 'MODULE_NOT_FOUND'
(STDERR) js-bson: Failed to load c++ bson extension, using pure JS version

This forked version has been updated to work with Meteor 1.4.

Note that CollectionFS has been depricated and those packages (and the database!) will need to be
evenually migrated out.