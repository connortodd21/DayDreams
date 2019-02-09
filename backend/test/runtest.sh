clear

# user tests
echo USER TESTS
echo ------------------------------------------------------------------------

mocha test/user/test_register.js --exit
mocha test/user/test_login.js --exit
mocha test/user/test_change_email.js --exit
mocha test/user/test_all_circles.js --exit
mocha test/user/test_forgot_password.js --exit

sleep 2

#circle tests
clear
echo CIRCLE TESTS
echo ------------------------------------------------------------------------

mocha test/circle/test_add_circle.js --exit
mocha test/circle/test_upload_photo.js --exit
mocha test/circle/test_add_user.js --exit
mocha test/circle/test_edit_circle_name.js --exit
mocha test/circle/test_all_members.js --exit
mocha test/circle/test_get_circle_info.js --exit
mocha test/circle/test_get_all_daydreams.js --exit
mocha test/circle/test_remove_circle.js --exit

sleep 2

#daydream tests
clear
echo DAYDREAM TESTS
echo ------------------------------------------------------------------------

mocha test/daydream/test_add_daydream.js --exit