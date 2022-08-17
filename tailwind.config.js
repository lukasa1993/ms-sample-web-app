/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme:   {
    extend: {
      colors:     {
        "spark-blue":      "#002453",
        "spark-blue-500":  "#004DB2",
        "spark-yellow":    "#F5E500",
        "spark-green":     "#038B71",
        "spark-green-1":   "rgba(3,139,113,0.1)",
        "spark-green-500": "#C4D92E",
        "spark-orange":    "#FF671F",
        "spark-gray":      "#F4F4F4",
        "spark-red":       "#F26365",
        "spark-purple":    "#8658A3",
        "spark-cyan":      "#67A5AD"
      },
      fontFamily: {
        regular:   "Brandon Text",
        highlight: "MM Sharp Sans"
      }
    }
  },
  plugins: []
};
