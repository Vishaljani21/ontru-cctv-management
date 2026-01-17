import { createContext } from 'react';
import type { User, Visit, WarrantyEntry, SubscriptionTier } from '../../types';

// --- Auth Context ---
export interface AuthContextType {
    user: User | null;
    login: (identifier: string, secret: string) => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);

// --- App Context ---
export interface AppContextType {
    visits: Visit[];
    setVisits: React.Dispatch<React.SetStateAction<Visit[]>>;
    warrantyEntries: WarrantyEntry[];
    setWarrantyEntries: React.Dispatch<React.SetStateAction<WarrantyEntry[]>>;
    isEnterprise: boolean;
    // Subscription controlled flags
    subscriptionTier: SubscriptionTier;
    isHrModuleEnabled: boolean;
    setIsHrModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isBillingModuleEnabled: boolean;
    setIsBillingModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isAmcModuleEnabled: boolean;
    setIsAmcModuleEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isReportsEnabled: boolean;
    isSiteHealthEnabled: boolean;
}
export const AppContext = createContext<AppContextType | null>(null);
