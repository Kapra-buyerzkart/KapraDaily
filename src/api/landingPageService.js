import { get } from './networkUtils';

export const getLandingPagesApi = async () => {
    return get('landingpages');
};
