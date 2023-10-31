import {Amplify} from 'aws-amplify';

// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/react-native/#top-level-configuration

export const ameznCongnito = () => {
  Amplify.configure({
    aws_cognito_region: 'us-east-1', // (required) - Region where Amazon Cognito project was created
    aws_user_pools_id: 'us-east-1_6AfQ6', // (optional) -  Amazon Cognito User Pool ID
    aws_user_pools_web_client_id: '5t3le8878kgc72', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    aws_cognito_identity_pool_id:
      'us-east-1:f602c14b-0fde-409c-9a7e-0baccbfd87d0', // (optional) - Amazon Cognito Identity Pool ID
    aws_mandatory_sign_in: 'enable', // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  });
};

export const scopeConfiguration = () => {
  Amplify.configure({
    Auth: {
      // (required) only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

      // (required)- Amazon Cognito Region
      region: 'XX-XXXX-X',

      // (optional) - Amazon Cognito Federated Identity Pool Region
      // Required only if it's different from Amazon Cognito Region
      identityPoolRegion: 'XX-XXXX-X',

      // (optional) - Amazon Cognito User Pool ID
      userPoolId: 'XX-XXXX-X_abcd1234',

      // (optional) - Amazon Cognito Web Client ID (26-char alphanumeric string, App client secret needs to be disabled)
      userPoolWebClientId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3',

      // (optional) - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      // (optional) - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      cookieStorage: {
        // - Cookie domain (only required if cookieStorage is provided)
        domain: '.yourdomain.com',
        // (optional) - Cookie path
        path: '/',
        // (optional) - Cookie expiration in days
        expires: 365,
        // (optional) - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        sameSite: 'strict' | 'lax',
        // (optional) - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: true,
      },

      // (optional) - customized storage object
      storage: MyStorage,

      // (optional) - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_PASSWORD_AUTH',

      // (optional) - Manually set key value pairs that can be passed to Cognito Lambda Triggers
      clientMetadata: {myCustomKey: 'myCustomValue'},

      // (optional) - Hosted UI configuration
      oauth: {
        domain: 'your_cognito_domain',
        scope: [
          'phone',
          'email',
          'profile',
          'openid',
          'aws.cognito.signin.user.admin',
        ],
        redirectSignIn: 'http://localhost:3000/',
        redirectSignOut: 'http://localhost:3000/',
        clientId: '1g0nnr4h99a3sd0vfs9',
        responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
      },
    },
  });
};
