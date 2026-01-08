import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, ValidateNested, Min, Max, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  ESSAY = 'ESSAY',
  MATCHING = 'MATCHING',
  FILL_BLANK = 'FILL_BLANK',
}

export enum AssessmentType {
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  EXAM = 'EXAM',
  PRACTICE = 'PRACTICE',
}

export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class OptionDto {
  @ApiProperty({
    description: 'The option text',
    example: 'Paris',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Whether this option is correct',
    example: true,
  })
  @IsBoolean()
  isCorrect: boolean;
}

export class QuestionDto {
  @ApiProperty({
    description: 'The question text',
    example: 'What is the capital of France?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'The question type',
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({
    description: 'The question options (for choice-based questions)',
    type: [OptionDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: OptionDto[];

  @ApiProperty({
    description: 'The correct answer (for non-choice questions)',
    example: 'Paris',
    required: false,
  })
  @IsString()
  @IsOptional()
  correctAnswer?: string;

  @ApiProperty({
    description: 'Points awarded for this question',
    example: 10,
    default: 1,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  points?: number;

  @ApiProperty({
    description: 'Explanation for the answer',
    example: 'Paris is the capital city of France.',
    required: false,
  })
  @IsString()
  @IsOptional()
  explanation?: string;
}

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'The assessment title',
    example: 'Module 1 Quiz',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The assessment description',
    example: 'Test your knowledge of the first module',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The assessment type',
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
  })
  @IsEnum(AssessmentType)
  type: AssessmentType;

  @ApiProperty({
    description: 'The assessment status',
    enum: AssessmentStatus,
    example: AssessmentStatus.DRAFT,
    default: AssessmentStatus.DRAFT,
  })
  @IsEnum(AssessmentStatus)
  @IsOptional()
  status?: AssessmentStatus;

  @ApiProperty({
    description: 'The course ID this assessment belongs to',
    example: 'course123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @ApiProperty({
    description: 'The module ID this assessment belongs to',
    example: 'module123',
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiProperty({
    description: 'Time limit in minutes (0 for no limit)',
    example: 30,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  timeLimit?: number;

  @ApiProperty({
    description: 'Passing score percentage',
    example: 70,
    default: 60,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  passingScore?: number;

  @ApiProperty({
    description: 'Maximum attempts allowed (0 for unlimited)',
    example: 3,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAttempts?: number;

  @ApiProperty({
    description: 'Whether to shuffle questions',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @ApiProperty({
    description: 'Whether to show correct answers after submission',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @ApiProperty({
    description: 'The questions in this assessment',
    type: [QuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];

  @ApiProperty({
    description: 'Due date for the assessment',
    example: new Date(),
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;
}

export class UpdateAssessmentDto {
  @ApiProperty({
    description: 'The assessment title',
    example: 'Updated Module 1 Quiz',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The assessment description',
    example: 'Updated test description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The assessment type',
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
    required: false,
  })
  @IsEnum(AssessmentType)
  @IsOptional()
  type?: AssessmentType;

  @ApiProperty({
    description: 'The assessment status',
    enum: AssessmentStatus,
    example: AssessmentStatus.PUBLISHED,
    required: false,
  })
  @IsEnum(AssessmentStatus)
  @IsOptional()
  status?: AssessmentStatus;

  @ApiProperty({
    description: 'The module ID this assessment belongs to',
    example: 'module123',
    required: false,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  moduleId?: string;

  @ApiProperty({
    description: 'Time limit in minutes (0 for no limit)',
    example: 45,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  timeLimit?: number;

  @ApiProperty({
    description: 'Passing score percentage',
    example: 75,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  passingScore?: number;

  @ApiProperty({
    description: 'Maximum attempts allowed (0 for unlimited)',
    example: 2,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAttempts?: number;

  @ApiProperty({
    description: 'Whether to shuffle questions',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @ApiProperty({
    description: 'Whether to show correct answers after submission',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;

  @ApiProperty({
    description: 'The questions in this assessment',
    type: [QuestionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];

  @ApiProperty({
    description: 'Due date for the assessment',
    example: new Date(),
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;
}

export class SubmissionAnswerDto {
  @ApiProperty({
    description: 'The question ID',
    example: 'question123',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    description: 'The selected option IDs (for choice questions)',
    example: ['option1', 'option2'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectedOptionIds?: string[];

  @ApiProperty({
    description: 'The text answer (for text-based questions)',
    example: 'Paris is the capital of France',
    required: false,
  })
  @IsString()
  @IsOptional()
  textAnswer?: string;
}

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'The assessment ID',
    example: 'assessment123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  assessmentId: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The answers submitted',
    type: [SubmissionAnswerDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionAnswerDto)
  answers: SubmissionAnswerDto[];

  @ApiProperty({
    description: 'Time taken in seconds',
    example: 1200,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  timeTaken?: number;
}

export class AssessmentResponseDto {
  @ApiProperty({
    description: 'The assessment ID',
    example: 'assessment123',
  })
  id: string;

  @ApiProperty({
    description: 'The assessment title',
    example: 'Module 1 Quiz',
  })
  title: string;

  @ApiProperty({
    description: 'The assessment description',
    example: 'Test your knowledge of the first module',
  })
  description: string;

  @ApiProperty({
    description: 'The assessment type',
    enum: AssessmentType,
    example: AssessmentType.QUIZ,
  })
  type: AssessmentType;

  @ApiProperty({
    description: 'The assessment status',
    enum: AssessmentStatus,
    example: AssessmentStatus.PUBLISHED,
  })
  status: AssessmentStatus;

  @ApiProperty({
    description: 'The course ID this assessment belongs to',
    example: 'course123',
  })
  courseId: string;

  @ApiProperty({
    description: 'The module ID this assessment belongs to',
    example: 'module123',
  })
  moduleId: string;

  @ApiProperty({
    description: 'Time limit in minutes',
    example: 30,
  })
  timeLimit: number;

  @ApiProperty({
    description: 'Passing score percentage',
    example: 70,
  })
  passingScore: number;

  @ApiProperty({
    description: 'Maximum attempts allowed',
    example: 3,
  })
  maxAttempts: number;

  @ApiProperty({
    description: 'Whether questions are shuffled',
    example: true,
  })
  shuffleQuestions: boolean;

  @ApiProperty({
    description: 'Whether to show correct answers after submission',
    example: true,
  })
  showCorrectAnswers: boolean;

  @ApiProperty({
    description: 'The questions in this assessment',
    type: [QuestionDto],
  })
  questions: QuestionDto[];

  @ApiProperty({
    description: 'Due date for the assessment',
    example: new Date(),
  })
  dueDate: Date;

  @ApiProperty({
    description: 'Creation timestamp',
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: new Date(),
  })
  updatedAt: Date;
}

export class SubmissionResponseDto {
  @ApiProperty({
    description: 'The submission ID',
    example: 'submission123',
  })
  id: string;

  @ApiProperty({
    description: 'The assessment ID',
    example: 'assessment123',
  })
  assessmentId: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The score achieved',
    example: 85,
  })
  score: number;

  @ApiProperty({
    description: 'Whether the submission passed the assessment',
    example: true,
  })
  passed: boolean;

  @ApiProperty({
    description: 'Time taken in seconds',
    example: 1200,
  })
  timeTaken: number;

  @ApiProperty({
    description: 'Feedback provided',
    example: 'Good job! You demonstrated strong understanding of the concepts.',
  })
  feedback: string;

  @ApiProperty({
    description: 'The answers submitted with grading',
    type: 'object',
  })
  answers: any;

  @ApiProperty({
    description: 'Submission timestamp',
    example: new Date(),
  })
  submittedAt: Date;

  @ApiProperty({
    description: 'Grading timestamp',
    example: new Date(),
  })
  gradedAt: Date;
}