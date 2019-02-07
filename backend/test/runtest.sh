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

#submission tests
clear
echo CIRCLE TESTS
echo ------------------------------------------------------------------------

mocha test/circle/test_add_circle.js --exit
mocha test/circle/test_upload_photo.js --exit
mocha test/circle/test_add_user.js --exit