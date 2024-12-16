// project settings, you can change only PROJECT_NAME, BASE_URL and WEBSITE_URL otherwise it can break the app
export const PROJECT_NAME = 'Yumz';
export const BASE_URL =
  process.env.REACT_APP_BASE_URL || 'https://api.yumz.dk';
export const WEBSITE_URL = 'https://yumz.dk';
export const api_url = BASE_URL + '/api/v1/';
export const api_url_admin = BASE_URL + '/api/v1/dashboard/admin/';
export const api_url_admin_dashboard = BASE_URL + '/api/v1/dashboard/';
export const IMG_URL = '';
export const export_url = BASE_URL + '/storage/';
export const example = BASE_URL + '/';

// map api key, ypu can get it from https://console.cloud.google.com/apis/library
export const MAP_API_KEY = 'AIzaSyDwDtMwk9DLkAR8X0mwVtxv9_MlkDeBe3g';

// firebase keys, do not forget to change to your own keys here and in file public/firebase-messaging-sw.js
export const VAPID_KEY = 'BKdXLnmM_EBoV9LPtpiKA-hry9-tONkKx11MgdphEP42iO_eTa_U-3XIUO22uzwjF0rUHO9KEJG7c67rbc_INto';
export const API_KEY = 'AIzaSyD_MHnom4lb60UAJRxyahDKGp-33IKo9ds';
export const AUTH_DOMAIN = 'yumz-810a8.firebaseapp.com';
export const PROJECT_ID = 'yumz-810a8';
export const STORAGE_BUCKET = 'yumz-810a8.firebasestorage.app';
export const MESSAGING_SENDER_ID = '915623425408';
export const APP_ID = '1:915623425408:web:09548c1789881ece14fd65';
export const MEASUREMENT_ID = 'G-KGLR5WC50X';
// recaptcha key, you can get it from https://www.google.com/recaptcha/admin/create
export const RECAPTCHASITEKEY = '6LfL0pQqAAAAAN2jkUrWhmMsfE9l0Z4YNDZmBDg7';

// demo data, no need to change
export const LAT = 47.4143302506288;
export const LNG = 8.532059477976883;
export const DEMO_SELLER = 334; // seller_id
export const DEMO_SELLER_UUID = '3566bdf6-3a09-4488-8269-70a19f871bd0'; // seller_id
export const DEMO_SHOP = 599; // seller_id
export const DEMO_DELIVERYMAN = 375; // deliveryman_id
export const DEMO_MANEGER = 114; // deliveryman_id
export const DEMO_MODERATOR = 297; // deliveryman_id
export const DEMO_ADMIN = 107; // deliveryman_id
export const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/svg',
];
