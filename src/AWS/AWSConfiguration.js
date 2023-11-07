import {Amplify, Auth} from 'aws-amplify';
import AWS from 'aws-sdk';


const configureAws = () => {
  console.log('hello ->configuring aws');
  Amplify.configure({
    //   aws_cognito_region: 'ap-south-1', // (required) - Region where Amazon Cognito project was created
    //   aws_user_pools_id: 'ap-south-1_jJotJ6a8q', // (optional) -  Amazon Cognito User Pool ID
    //   aws_user_pools_web_client_id: '38f1s3300nblraet06642nuvrh', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    //   aws_cognito_identity_pool_id:
    //     'ap-south-1:9e7c1da8-aa71-4aeb-9ef2-fc4f33011561', // (optional) - Amazon Cognito Identity Pool ID
    //   //aws_mandatory_sign_in: 'enable' ,
    Auth: {
      identityPoolId: 'ap-south-1:9e7c1da8-aa71-4aeb-9ef2-fc4f33011561  ', // (required) - Amazon Cognito Identity Pool ID
      region: 'ap-south-1', // (required) - Amazon Cognito Region
      userPoolId: 'ap-south-1_jJotJ6a8q', // (optional) - Amazon Cognito User Pool ID
      userPoolWebClientId: '38f1s3300nblraet06642nuvrh', // (optional) - Amazon Cognito Web Client ID (App client secret needs to be disabled)
    },
  });

  console.log('hello ->configuring aws done method');
};

async function confirmSignUp() {
  try {
    // await Auth.confirmSignUp('gauravatlive@gmail.com', '084241');
    await Auth.confirmSignUp('jambhulkar.roshan@thinksys.com', '175596');
  } catch (error) {
    console.log('error confirming sign up', error);
  }
}

const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);

    console.log('Login succesfull -> signing in result:');
    return user;
  } catch (error) {
    console.log('Login error ->error signing in', error);
  }
};

const signUp = async () => {
  try {
    const {user} = await Auth.signUp({
      // username: 'gauravatlive@gmail.com',
      // username: 'roshanjambhulkar@gmail.com',
      username: 'jambhulkar.roshan@thinksys.com',
      password: 'Password@123',
    });
  } catch (error) {
    console.log('error signing up:', error);
  }
};

async function signOut() {
  try {
    await Auth.signOut({global: true});
    console.log('Successfully sign out: ');
  } catch (error) {
    console.log('error signing out: ', error);
  }
}


async function getCurrentUserInfo() {
  try {
    const profile = await Auth.currentUserInfo();
    return profile;
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
//output --------> getCurrentUserInfo
// profile {"attributes": {"custom:city": "California",
// "custom:expertise": "danger",
// "custom:firstName": "roshan",
//  "custom:lastName": "Jambhuilkar", "custom:phoneNumber": "1234567890",
//  "custom:temporaryCity": "Singapore", "custom:type": "Mentor",
//   "email": "Jambhulkar.roshan@thinksys.com", "email_verified": true,
//    "sub": "21a5e85f-b32a-4a86-a474-ef5800ef12e2"}, "id": undefined,
//    "username": "21a5e85f-b32a-4a86-a474-ef5800ef12e2"}

export {
  configureAws,
  confirmSignUp,
  signIn,
  signUp,
  signOut,
  getCurrentUserInfo,
};

