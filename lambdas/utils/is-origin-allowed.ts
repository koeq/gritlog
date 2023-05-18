const DOMAIN_WHITELIST = ["https://gritlog.app", "https://stage.gritlog.app"];
// eslint-disable-next-line security/detect-unsafe-regex
const LOCALHOST_REGEX = /^http:\/\/localhost(:\d{1,5})?$/;

export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (origin === undefined) {
    return false;
  }

  return DOMAIN_WHITELIST.includes(origin) || LOCALHOST_REGEX.test(origin);
};
