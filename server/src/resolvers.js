const resolvers = {
  Query: {
    tracksForHome: (_, __, { dataSources }) =>
      dataSources.trackAPI.getTracksForHome(),
    track: (_, { id }, { dataSources }) =>
      dataSources.trackAPI.getTrack(id),
  },
  Track: {
    author: ({ authorId }, _, { dataSources }) =>
      dataSources.trackAPI.getAuthor(authorId),
    modules: ({ id }, _, { dataSources }) =>
      dataSources.trackAPI.getTrackModules(id),
  },
};

module.exports = resolvers;