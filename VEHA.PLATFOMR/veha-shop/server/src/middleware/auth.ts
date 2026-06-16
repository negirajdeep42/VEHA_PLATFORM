import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/express';
import { User, IUser } from '../db';

export interface AuthenticatedRequest extends Request {
  auth?: any;
  user?: any;
}

export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const auth = (req as any).auth;
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: 'Access denied. Please authenticate via Clerk.' });
    }

    const userId = auth.userId;
    let user = await User.findOne({ clerkId: userId }).exec();

    if (!user) {
      // Fetch user profile info from Clerk API to seed/sync with local MongoDB database
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';

      if (!email) {
        return res.status(400).json({ error: 'Authenticated Clerk user has no email address.' });
      }

      // Check if email already exists from previous custom JWT auth
      user = await User.findOne({ email: email.toLowerCase() }).exec();

      if (user) {
        // Link Clerk ID to existing local customer record
        user.clerkId = userId;
        await user.save();
      } else {
        // Create new local customer profile
        const phone = clerkUser.phoneNumbers[0]?.phoneNumber || '';
        const address = (clerkUser.unsafeMetadata?.address as string) || '';
        const city = (clerkUser.unsafeMetadata?.city as string) || '';
        const state = (clerkUser.unsafeMetadata?.state as string) || '';
        const pincode = (clerkUser.unsafeMetadata?.pincode as string) || '';
        const role = (clerkUser.unsafeMetadata?.role as any) || (email.toLowerCase() === 'admin@veha.example' ? 'admin' : 'customer');

        user = new User({
          clerkId: userId,
          name: clerkUser.fullName || clerkUser.firstName || 'Boutique Guest',
          email: email.toLowerCase(),
          passwordHash: 'clerk-managed', // placeholder password hash
          phone,
          address,
          city,
          state,
          pincode,
          role
        });
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Clerk session verify token error:', err);
    return res.status(401).json({ error: 'Invalid or expired Clerk session token.' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges are required to access this resource.' });
  }
  next();
}
