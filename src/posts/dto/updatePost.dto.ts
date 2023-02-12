import { IsNumber, IsNotEmpty, IsString, IsOptional } from "class-validator";

class UpdatePostDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional(  )
  title: string;
}

export default UpdatePostDto;