
/** prepare_modules.js
*** Last Update: 2o14-o8-o7
*** Woodrow Shigeru ( woodrow.shigeru@gmx.net )
***
***
*** Here is where I call all those methods that I need in order to set up this or that
*** module. More clearly: all those methods that prepare something which needs to be done
*** *once* per FLEX installation/update.
***
**/


var
  modSFCL = {};



function prep_test_sfc()
{
  modSFCL.test = 'success';
}

