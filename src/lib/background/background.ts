import beach from '../assets/beach-30.avif'
import chair from '../assets/chair-30.avif'
import cloudy from '../assets/cloudy-30.avif'
import dog from '../assets/dog-30.avif'
import flower from '../assets/flower-30.avif'
import gradient_geometric_shapes from '../assets/gradient_geometric_shapes.avif'
import lake from '../assets/lake-30.avif'
import mountain from '../assets/mountain-30.avif'
import pudding from '../assets/pudding-30.avif'
import purple from '../assets/purple-30.avif'
import purple2 from '../assets/purple2-30.avif'
import { BackgroundIndex } from '../background/background_index'

export class Background {
	private readonly _background_urls: string[] = [
		beach,
		chair,
		cloudy,
		dog,
		flower,
		gradient_geometric_shapes,
		lake,
		mountain,
		pudding,
		purple,
		purple2,
	]
	private _background_url: string

	public constructor(private readonly _background_index: BackgroundIndex) {
		this._background_url = this._background_urls[_background_index.index]
	}

	public static from_local_storage(): Background {
		const saved_index = localStorage.getItem('background_index')

		if (!saved_index) {
			const new_background = new Background(new BackgroundIndex(0))

			new_background._save_to_local_storage()

			return new_background
		}

		const background_index = BackgroundIndex.from_string(saved_index)
		const background = new Background(background_index)

		return background
	}

	private _save_to_local_storage(): void {
		localStorage.setItem('background_index', this._background_index.index.toString())
	}

	public get_next_background(): Background {
		const next_index = (this._background_index.index + 1) % this._background_urls.length
		const next_background_index = new BackgroundIndex(next_index)
		const next_background = new Background(next_background_index)

		return next_background
	}

	public transition_background(): Background {
		const next_background = this.get_next_background()

		next_background._save_to_local_storage()

		return next_background
	}

	public get background_url(): string {
		return this._background_url
	}

	public get background_index(): BackgroundIndex {
		return this._background_index
	}
}
