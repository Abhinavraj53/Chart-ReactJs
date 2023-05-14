// import React, { useState } from "react";
// function App() {
//   const [chat, setChat] = useState("");
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const response = await fetch("https://www.terriblytinytales.com/test.txt");
//     const text = await response.text();
//     setChat(text);
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <button type="submit">Submit</button>
//       </form>
//       <div>{chat}</div>
//     </div>
//   );
// }
// export default App;
import React, { useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        "https://www.terriblytinytales.com/test.txt"
      );
      const words = result.data
        .trim()
        .replace(/[^\w\s]/gi, "")
        .toLowerCase()
        .split(/\s+/)
        .reduce(function (map, word) {
          map[word] = (map[word] || 0) + 1;
          return map;
        }, {});
      const sortedData = Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({ word, count }));
      setData(sortedData);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + data.map((d) => `${d.word},${d.count}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {data.length > 0 && (
        <div>
          <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
          <button onClick={exportData}>Export</button>
        </div>
      )}
    </div>
  );
}
export default App;