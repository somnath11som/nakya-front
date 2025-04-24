import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import graphImg1 from "../../assets/Images/ELNReportsImgs/graph1.png"
import graphImg2 from "../../assets/Images/ELNReportsImgs/graph2.png"
import graphImg3 from "../../assets/Images/ELNReportsImgs/graph3.png"
import graphImg4 from "../../assets/Images/ELNReportsImgs/graph4.png"
import graphImg5 from "../../assets/Images/ELNReportsImgs/graph5.png"
import graphImg6 from "../../assets/Images/ELNReportsImgs/graph6.png"


const ExperimentDetails = () => {
    const { experimentId } = useParams();
  
    return (
      <Layout title={`Experiment Details - ${experimentId}`}>
        <div className="overflow-x-auto max-h-[calc(100vh-19.8vh)] overflow-auto scrollbar-hide">
          <div className="bg-[#171717] text-white p-6 min-h-screen space-y-6 ">
            {/* Header Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><strong>Experiment ID:</strong> {experimentId}</div>
              <div><strong>Experiment Chain:</strong> VR-24-PP-003</div>
              <div><strong>Started By:</strong> Vedant Rakholia</div>
              <div><strong>Team:</strong> Process development cell culture</div>
              <div><strong>Department:</strong> Pharmaceutical Sciences</div>
              <div><strong>Experiment Title:</strong> Compare HEK Cell growth</div>
              <div><strong>Start Date:</strong> 03–June–2024</div>
              <div><strong>End Date:</strong> 14–June–2024</div>
            </div>
    
            {/* Objective and Observations */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">Experiment Objective</h2>
                <p className="text-gray-300">
                  To compare HEK cells growth in various media and test various concentrations of anti clumping agent.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold">Observations</h2>
                <p className="text-gray-300">
                  Based on the VCD data, freestyle media outgrew the other two media at shake flask level. The cell viability dropped post day 7 for freestyle although remained constant for Ex Cell. These observations put out contrary conclusions regarding the ideal choice of media.
                  <br /><br />
                  Anti clumping agent: 0.7x concentration showcased improvement in clumping compared to 0.9x. The cell growth was hindered/affected with the usage of the ACA compared to the absence although the viability in 0.7x was comparable to BalanCD.
                </p>
              </div>
            </div>
    
            {/* Raw Data */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Raw Data</h2>
              {[["15/12/2024", "17:50"], ["18/12/2024", "13:10"]].map(([date, time], idx) => (
                <table key={idx} className="w-full text-sm border border-gray-600">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-2 border">Conditions</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Time</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Freestyle</th>
                      <th className="p-2 border">EX-CELL</th>
                      <th className="p-2 border">HEK-CD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Conditions 1", "VCD", "3.26E+05", "3.70E+05", "2.68E+05"],
                      ["Conditions 2", "Viability", "95.81", "100", "91.19"],
                      ["Conditions 3", "Lactate", "0.02", "4.312", "0.059"],
                      ["Conditions 4", "Glucose", "27.052", "34.944", "26.09"],
                    ].map(([condition, name, fs, ex, hek], i) => (
                      <tr key={i} className="text-center">
                        <td className="border p-2">{condition}</td>
                        <td className="border p-2">{date}</td>
                        <td className="border p-2">{time}</td>
                        <td className="border p-2">{name}</td>
                        <td className="border p-2">{fs}</td>
                        <td className="border p-2">{ex}</td>
                        <td className="border p-2">{hek}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
    
            {/* Graphs */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Graphs and Plots</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "Viability (P4)", img: graphImg1 },
                  { title: "Lactate level", img: graphImg2 },
                  { title: "Glucose level", img: graphImg3 },
                  { title: "Viable Cell Density (VCD)(P4)", img: graphImg4 },
                  { title: "Anti Clumping Comparison", img: graphImg5 },
                  { title: "Final Summary", img: graphImg6 },
                ].map((graph, i) => (
                  <div key={i} className="bg-white rounded-md p-4 text-black text-center">
                    <p className="mb-2 font-medium">{graph.title}</p>
                    <img src={graph.img} alt={graph.title} className="w-full h-40 object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default ExperimentDetails;