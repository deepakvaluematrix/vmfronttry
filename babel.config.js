// Cannot load "react-refresh/babel" in production
const plugins = [];
if (process.env.NODE_ENV === "development") {
  plugins.push("react-refresh/babel");
}else{
  console.log("Build is for production")
}

module.exports = {
  presets: [
    "@babel/preset-env",
    // Runtime automatic with React 17+ allows not importing React
    // in files only using JSX (no state or React methods)
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: plugins,
};
