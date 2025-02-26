enum API {
    BASE_URL_DEV = 'https://api.fasvtech.xyz',
    BASE_URL_PROD = 'https://api.prod.fasvtech.xyz',
    IMAGE_URL = 'https://image.com'
};

enum APP {
    PORT = "3000",
    APP_VERSION = "0.1",
    LOCAL_STORAGE_TOKEN = 'access_token_posweb',
    LOCAL_STORAGE_USERDATA = 'userData_posweb',
}

export const configuration = {
    devBaseUrl: API.BASE_URL_DEV,
    prodBaseUrl: API.BASE_URL_PROD,
    imageUrl: API.IMAGE_URL,
    port: APP.PORT,
    localStorage: APP.LOCAL_STORAGE_TOKEN,
    localStorageUserData: APP.LOCAL_STORAGE_USERDATA,
}
