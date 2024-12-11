import zod from 'zod';


// add and update organization profile
export const addOrgProfileSchema = zod.object({
    profileImage: zod.unknown(),
    name: zod.string().min(2, { message: 'Name must be at least 2 characters' }),
    phone1: zod.string().min(10, { message: 'Phone number must be at least 10 characters' }),
    phone2: zod.string().nullable(),
    website: zod.string().url().nullable(),
    bio: zod.string().nullable(),
    country: zod.string().min(2, { message: 'Country must be at least 2 characters' }),
});