const { db } = require('../util/admin');

exports.getAllDistances = (request, response) => {
	db
		.collection('distance')
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let distance = [];
			data.forEach((doc) => {
				distance.push({
                    distanceId: doc.id,
                    title: doc.data().user,
					body: doc.data().distance,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(distance);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};