const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(resolve => {
	setTimeout(resolve, 3000, "foo");
});

// Promise.all waits for every item, converts plain values into resolved promises,
// keeps the original order, and rejects when any promise in the array rejects.
Promise.all([promise1, promise2, promise3])
	.then(result => console.log(result))
	.catch(error => console.log(error));

function timesTwoAsync(x) {
	return new Promise(resolve => resolve(x * 2));
}

const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);

Promise.all(promiseArr)
	.then(result => {
		console.log(result);
	});
