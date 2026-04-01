import { signalStore, withState } from '@ngrx/signals';

const initialState = {

}

export const GenresViewStore = signalStore({
  providedIn: 'root'
}, withState(initialState)
  )
