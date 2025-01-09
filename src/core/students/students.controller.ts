import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
} from "@nestjs/swagger";
import { StudentService } from "./students.service";
import { CreateStudentDto } from "./dto/createStudent.dto";
import { UpdateStudentDto } from "./dto/updateStudent.dto";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../auth/roles.decorator";
import { UserWithoutPasswordType } from "../users/users.types";
import { Role } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { fileUploadOptions } from "src/config/fileUpload.config";
import { UseAuth } from "../auth/auth.decorator";

@ApiTags("Students")
@Controller("students")
@UseGuards(AuthGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post("/")
  @Roles(Role.SUPERADMIN, Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new student's profile",
    description:
      "Student can create their profile. Superadmin can create a student's profile.",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("photo", fileUploadOptions))
  async create(
    @Body() createStudentProfileDto: CreateStudentDto,
    @UseAuth() user: UserWithoutPasswordType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoUrl = await this.cloudinaryService.uploadImage(file);
      createStudentProfileDto.photo = photoUrl;
    }

    if (user.role === Role.STUDENT) {
      const existingProfile = await this.studentService.findOneWithoutThrow(
        user.id,
      );
      if (existingProfile) {
        throw new HttpException(
          "Profile already exists",
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const { userId, ...createStudentDtoWithoutUserId } =
      createStudentProfileDto;

    return this.studentService.create(
      createStudentDtoWithoutUserId,
      user.role === Role.SUPERADMIN ? userId : user.id,
    );
  }

  @Get("/me")
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: "Get logged-in student's profile",
    description: "Student can view their own profile.",
  })
  async getProfile(@UseAuth() user: UserWithoutPasswordType) {
    return this.studentService.findOne(user.id);
  }

  @Patch("/me")
  @ApiBearerAuth()
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary: "Update logged-in student's profile",
    description: "Student can update their own profile.",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("photo", fileUploadOptions))
  async updateOwnProfile(
    @Body() updateStudentProfileDto: UpdateStudentDto,
    @UseAuth() user: UserWithoutPasswordType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoUrl = await this.cloudinaryService.uploadImage(file);
      updateStudentProfileDto.photo = photoUrl;
    }

    const { userId, ...updateStudentProfileDtoWithoutUserId } =
      updateStudentProfileDto;
    return this.studentService.update(
      user.id,
      updateStudentProfileDtoWithoutUserId,
    );
  }

  @Get("/:id")
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get student's profile by ID",
    description: "Superadmin can view a specific student's profile.",
  })
  async findOne(@Param("id") id: string) {
    return this.studentService.findOne(id);
  }

  @Patch("/:id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update logged-in student's profile",
    description: "Student can update their own profile.",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("photo", fileUploadOptions))
  async update(
    @Param("id") id: string,
    @Body() updateStudentProfileDto: UpdateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const photoUrl = await this.cloudinaryService.uploadImage(file);
      updateStudentProfileDto.photo = photoUrl;
    }

    const { userId, ...updateStudentProfileDtoWithoutUserId } =
      updateStudentProfileDto;
    return this.studentService.update(
      userId,
      updateStudentProfileDtoWithoutUserId,
    );
  }

  @Delete("/:id")
  @Roles(Role.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a student's profile",
    description: "Superadmin can delete a student's profile.",
  })
  async remove(@Param("id") id: string) {
    return this.studentService.remove(id);
  }
}
