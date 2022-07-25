const { projects, clients } = require('../sampleData.js');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');

//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');



//client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
});

//Project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                //clientID is a field in Project Model
                return Client.findById(parent.clientId)
            }
        }
    })
});



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                return Project.find();
            }
        },

        //gets specific client
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.find(args.id)
            }
        },

        //gets all clients
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args){
                return Client.findById();
            }
        },

        //gets specific client
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id)
            }
        }
    })

});


module.exports = new GraphQLSchema({
    query: RootQuery,
});