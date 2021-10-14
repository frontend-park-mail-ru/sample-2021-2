// наименование для нашего хранилища кэша
const CACHE_NAME = 'lesson-6-2021-2';
// ссылки на кэшируемые файлы
const cacheUrls = [
  '/',
  './constants.js',
  './index.html',
  './server/images/241239898_509534673414004_2670816557845118956_n.jpeg',
  './utils/images.js',
  './main.css',
  './main.js',
  './components/Profile/Profile.js',
  './components/Profile/Profile.css',
  './modules/ajax.js',
];

this.addEventListener('install', (event) => {
	// задержим обработку события
	// если произойдёт ошибка, serviceWorker не установится
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем
		// если такого не существует, то он будет создан
		caches.open(CACHE_NAME)
			.then((cache) => {
				// загружаем в наш cache необходимые файлы
				return cache.addAll(cacheUrls);
			})
			.catch((err) => {
				console.error('smth went wrong with caches.open: ', err);
			})
	);
});

this.addEventListener('fetch', (event) => {

	/** online first */
	if (navigator.onLine === true) {
		return fetch(event.request);
	}

	/** cache first */
	event.respondWith(
		// ищем запрашиваемый ресурс в хранилище кэша
		caches
			.match(event.request)
			.then((cachedResponse) => {
				// выдаём кэш, если он есть
				if (cachedResponse) {
					return cachedResponse;
				}

				return fetch(event.request);
			})
			.catch((err) => {
				console.error('smth went wrong with caches.match: ', err);
			})
	);
});
