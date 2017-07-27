 #!/bin/bash
 # This script creates a 64-bit ubuntu build of Miz and places it in the Alex/Desktop/Share directory

CURRENT_FOLDER=$(pwd)
echo $CURRENT_FOLDER
echo "Removing old build file from desktop/share directory..."
rm /Users/Alex/Desktop/share/miz_build.tar.gz
echo "Copying miz to prep folder..."
cp -rf . ../miz_build
cd ../miz_build
echo "Building Miz..."
meteor build --architecture os.linux.x86_64 ..
echo "Removing miz_build temp directory..."
cd ..
rm -rf miz_build
echo "Moving tarball to Desktop/share..."

mv miz_build.tar.gz /Users/Alex/Desktop/share
cd "$CURRENT_FOLDER"
echo "Build completed and placed in desktop share.  Good luck!"







