
import expressLoader from './loader.express';
import mongooseLoader from './loader.mongoose';

export default async({expressApp} : any) => {
    await mongooseLoader();
    await expressLoader({ app: expressApp });
}