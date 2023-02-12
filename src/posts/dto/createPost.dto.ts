import { IsNotEmpty, IsString } from "class-validator";

class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}

export default CreatePostDto;