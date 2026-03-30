import { CreateGenreDto } from '@core/api/model';

export interface Genre extends CreateGenreDto {
  id: number;
  createdAt: string;
}
