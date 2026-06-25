import {
  Controller, Get, Post, Put,
  Body, UseGuards, Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  UpdateAddressDto,
  CreateContractDto,
  CreateEvaluationDto,
  ObjectionDto,
} from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  getFullProfile(@Req() req) {
    return this.profileService.getFullProfile(req.user.id);
  }

  @Get('address')
  getAddress(@Req() req) {
    return this.profileService.getAddress(req.user.id);
  }

  @Put('address')
  updateAddress(@Req() req, @Body() dto: UpdateAddressDto) {
    return this.profileService.updateAddress(req.user.id, dto);
  }

  @Get('contracts')
  getContracts(@Req() req) {
    return this.profileService.getContracts(req.user.id);
  }

  @Post('contracts')
  createContract(@Req() req, @Body() dto: CreateContractDto) {
    return this.profileService.createContract(req.user, dto);
  }

  @Get('job-history')
  getJobHistory(@Req() req) {
    return this.profileService.getJobHistory(req.user.id);
  }

  @Get('evaluations')
  getEvaluations(@Req() req) {
    return this.profileService.getEvaluations(req.user.id);
  }

  @Post('evaluations')
  createEvaluation(@Req() req, @Body() dto: CreateEvaluationDto) {
    return this.profileService.createEvaluation(req.user, dto);
  }

  @Post('evaluations/objection')
  submitObjection(@Req() req, @Body() dto: ObjectionDto) {
    return this.profileService.submitObjection(req.user.id, dto);
  }
}