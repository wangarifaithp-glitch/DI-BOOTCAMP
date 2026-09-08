class Video {
	constructor(title, uploader, time) {
		this.title = title;
		this.uploader = uploader;
		this.time = time;
	}

	watch() {
		console.log(`${this.uploader} watched all ${this.time} of ${this.title}!`);
	}
}

const firstVideo = new Video('JavaScript Basics', 'Elie', 120);
firstVideo.watch();

const secondVideo = new Video('Object-Oriented Programming', 'Sarah', 240);
secondVideo.watch();

const videoData = [
	{ title: 'HTML Crash Course', uploader: 'Alex', time: 180 },
	{ title: 'CSS Flexbox Guide', uploader: 'Maya', time: 300 },
	{ title: 'JavaScript Arrays', uploader: 'Noah', time: 150 },
	{ title: 'DOM Manipulation', uploader: 'Lina', time: 210 },
	{ title: 'Async JavaScript', uploader: 'Omar', time: 360 }
];

const videos = videoData.map(({ title, uploader, time }) => {
	return new Video(title, uploader, time);
});

videos.forEach(video => video.watch());
