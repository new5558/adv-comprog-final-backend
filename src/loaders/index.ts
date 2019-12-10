
import expressLoader from './loader.express';
import mongooseLoader from './loader.mongoose';
import depedencyInjectionLoader from './loader.di'; 

export default async({expressApp} : any) => {
    await mongooseLoader();
    await expressLoader({ app: expressApp });
    depedencyInjectionLoader();
}