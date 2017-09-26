const fetch = require('node-fetch');
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLBoolean
} = require('graphql')

let pilots = [];

function getData(type) {
	return fetch(`https://raw.githubusercontent.com/guidokessels/xwing-data/master/data/${type}.js`)
		.then(response => response.json())
		.then(jsonData => jsonData.reduce((pilotObject, currentPilot) => {
			pilotObject[currentPilot.xws] = currentPilot;
			return pilotObject;
		}, {}));
}

function getPilots() {
	if (pilots.length) {
		return Promise.resolve(pilots);
	} else {
		return getData('pilots')
			.then(data => {
				pilots = data;
				return pilots;
			});
	}
}

const PilotType = new GraphQLObjectType({
	name: 'Pilot',
	description: '...',

	fields: () => ({
		name: {
			type:    GraphQLString,
			resolve: data => data.name
		},
		id: {
			type:    GraphQLString,
			resolve: data => data.id
		},
		unique: {
			type:    GraphQLBoolean,
			resolve: data => data.unique
		},
		ship: {
			type:    GraphQLString,
			resolve: data => data.ship
		},
		skill: {
			type:    GraphQLInt,
			resolve: data => data.skill
		},
		points: {
			type:    GraphQLInt,
			resolve: data => data.points
		},
		text: {
			type:    GraphQLString,
			resolve: data => data.text
		},
		faction: {
			type:    GraphQLString,
			resolve: data => data.faction
		},
		xws: {
			type:    GraphQLString,
			resolve: data => data.xws
		},
	})
});

function filterPilots(args, pilots) {
	return pilots[args.xws];
}


module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		description: '...',
		fields: () => ({
			pilot: {
				type: PilotType,
				args: {
					xws: { type: GraphQLString }
				},
				resolve: (root, args) => {
					return getPilots()
						.then(response => filterPilots(args, response));
				}
			}
		})
	})
})
