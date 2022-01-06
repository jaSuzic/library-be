import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware, Headers, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }
    use(req: any, res: any, next: () => void) {
        try {
            const token = req.get('authorization').split(" ")[1];
            if (this.jwtService.verify(token)) {
                next();
            } else {
                throw new UnauthorizedException();
            }
        } catch {
            throw new UnauthorizedException();
        }
    }
}
