import { defineType } from "sanity";

export default defineType({
  name: "showtimes",
  type: "document",
  title: "Showtimes",
  fields: [
    {
      name: "date",
      type: "date",
    },
    {
      name: "time",
      type: "string",
    },
    {
      title: "Movie",
      name: "movie",
      type: "reference",
      to: [{ type: "movie" }],
    },
    {
      title: "Theatre",
      name: "theatre",
      type: "reference",
      to: [{ type: "theatre" }],
    },
    {
      title: "Row",
      name: "row",
      type: "array",
      of: [{ type: "row" }],
    },
  ],
  preview: {
    select: {
      title: 'movie.title', // Selecting title from the referenced movie
      time: 'time',
      date: 'date', // Selecting the date
    },
    prepare(selection) {
      const { title, time, date } = selection;
      const formattedDate = new Date(date).toLocaleDateString(); // Formatting date for readability
      return {
        title: `${title}|${formattedDate}|${time}`, // Custom title format including the date
      };
    },
  },
});
