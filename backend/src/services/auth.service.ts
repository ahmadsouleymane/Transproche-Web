import { User } from '../models/User';
import { Company } from '../models/Company';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';
import { IUser, UserRole } from '../types';
import { AppException } from '../middlewares/error.middleware';

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  companyId?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse extends AuthTokens {
  user: Partial<IUser>;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const { name, email, phone, password, role = 'client', companyId } = data;

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new AppException('Cet email est déjà utilisé', 400);
    }

    // Check if phone exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      throw new AppException('Ce numéro de téléphone est déjà utilisé', 400);
    }

    // If registering as company, verify company exists
    if (role === 'compagnie' && companyId) {
      const company = await Company.findById(companyId);
      if (!company) {
        throw new AppException('Compagnie non trouvée', 404);
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      company: companyId,
    });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
      },
    };
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppException('Email ou mot de passe incorrect', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppException('Email ou mot de passe incorrect', 401);
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
      },
    };
  },

  async refreshTokens(userId: string, role: UserRole): Promise<AuthTokens> {
    const accessToken = generateAccessToken(userId, role);
    const refreshToken = generateRefreshToken(userId, role);

    return { accessToken, refreshToken };
  },

  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId).populate('company');
    if (!user) {
      throw new AppException('Utilisateur non trouvé', 404);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      company: user.company,
      createdAt: user.createdAt,
    };
  },
};
