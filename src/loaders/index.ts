
import expressLoader from './loader.express';
import mongooseLoader from './mongoose';

export default async({expressApp} : any) => {
    await mongooseLoader();
    await expressLoader({ app: expressApp });
}