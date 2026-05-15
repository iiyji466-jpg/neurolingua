import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

export interface OAuthProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  provider: string;
  accessToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string | null; image: string | null; plan: string };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // ── OAuth Login ─────────────────────────────────────────
  async handleOAuthLogin(profile: OAuthProfile, req: any): Promise<AuthTokens> {
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email:      profile.email,
          name:       profile.name,
          image:      profile.picture,
          provider:   profile.provider,
          providerId: profile.id,
        },
      });
      this.logger.log(`New user created: ${user.email} via ${profile.provider}`);
    }

    // Upsert account
    await this.prisma.account.upsert({
      where: { provider_providerAccountId: { provider: profile.provider, providerAccountId: profile.id } },
      update: { accessToken: profile.accessToken },
      create: { userId: user.id, provider: profile.provider, providerAccountId: profile.id, accessToken: profile.accessToken },
    });

    return this.createSession(user, req);
  }

  // ── Magic Link ──────────────────────────────────────────
  async sendMagicLink(email: string): Promise<void> {
    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await this.prisma.magicLink.create({ data: { email, token, expiresAt } });

    const url = `${this.config.get("APP_URL")}/auth/verify?token=${token}`;
    this.logger.log(`Magic link for ${email}: ${url}`);
    // TODO: await this.mailService.sendMagicLink(email, url);
  }

  async verifyMagicLink(token: string, req: any): Promise<AuthTokens> {
    const link = await this.prisma.magicLink.findUnique({ where: { token } });

    if (!link || link.used || link.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired magic link");
    }

    await this.prisma.magicLink.update({ where: { id: link.id }, data: { used: true } });

    let user = await this.prisma.user.findUnique({ where: { email: link.email } });
    if (!user) {
      user = await this.prisma.user.create({ data: { email: link.email, provider: "email" } });
    }

    return this.createSession(user, req);
  }

  // ── Refresh Tokens ──────────────────────────────────────
  async refreshTokens(refreshToken: string, req: any): Promise<AuthTokens> {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get("JWT_REFRESH_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const sessions = await this.prisma.session.findMany({
      where: { userId: payload.sub, expiresAt: { gt: new Date() } },
    });

    let validSession: any = null;
    for (const s of sessions) {
      if (await bcrypt.compare(refreshToken, s.refreshTokenHash)) {
        validSession = s;
        break;
      }
    }

    if (!validSession) throw new ForbiddenException("Session not found");

    // Delete old session (rotation)
    await this.prisma.session.delete({ where: { id: validSession.id } });

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
    return this.createSession(user, req);
  }

  // ── Logout ──────────────────────────────────────────────
  async logout(userId: string, refreshToken: string): Promise<void> {
    const sessions = await this.prisma.session.findMany({ where: { userId } });
    for (const s of sessions) {
      if (await bcrypt.compare(refreshToken, s.refreshTokenHash)) {
        await this.prisma.session.delete({ where: { id: s.id } });
        break;
      }
    }
  }

  // ── Get me ──────────────────────────────────────────────
  async getMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true, plan: true, createdAt: true, profile: true },
    });
  }

  // ── Internal ─────────────────────────────────────────────
  private async createSession(user: any, req: any): Promise<AuthTokens> {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret:    this.config.get("JWT_SECRET"),
        expiresIn: this.config.get("JWT_EXPIRES_IN") || "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret:    this.config.get("JWT_REFRESH_SECRET"),
        expiresIn: this.config.get("JWT_REFRESH_EXPIRES_IN") || "30d",
      }),
    ]);

    await this.prisma.session.create({
      data: {
        userId:           user.id,
        refreshTokenHash: await bcrypt.hash(refreshToken, 12),
        deviceInfo:       req?.headers?.["user-agent"] ?? "unknown",
        ipAddress:        req?.ip ?? "unknown",
        expiresAt:        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, image: user.image, plan: user.plan },
    };
  }

  attachCookies(res: any, tokens: { accessToken: string; refreshToken: string }): void {
    const isProd = this.config.get("NODE_ENV") === "production";
    res.cookie("access_token",  tokens.accessToken,  { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 15 * 60 * 1000 });
    res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 * 1000, path: "/auth/refresh" });
  }

  clearCookies(res: any): void {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
  }
}
