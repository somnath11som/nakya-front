import PropTypes from "prop-types";
import { checkTypeArr } from "../../utils/smallFun";
import { IoEyeOutline } from "react-icons/io5";

const SetUpParameters = ({ handleValActive }) => {
  const parameters = [
    {
      id: "PN",
      name: "Program Name",
      type: "Drop Down",
    },
    {
      id: "ET",
      name: "Experiment Type",
      type: "Drop Down",
    },
    {
      id: "GCL",
      name: "General Cell Line",
      type: "Drop Down",
    },
    {
      id: "DEVICE",
      name: "Device",
      type: "Drop Down",
    },
  ];

  return (
    <>
      <div className="border border-[#202020] rounded-lg overflow-x-auto overflow-auto scrollbar-hide">
        <table className="w-full bg-[#292929] rounded-lg">
          <thead>
            <tr className="text-left text-[#818181] border-b border-gray-700 sticky top-0 bg-black z-20">
              <th className="p-4 px-8">Parameter Name</th>
              <th className="p-4 px-8 text-center">Parameter Type</th>
              <th className="p-4 px-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkTypeArr(parameters) &&
              parameters.map((param) => (
                <tr key={param.id} className="border-b border-gray-700 hover:bg-[#1e1e1e] transition">
                  <td className="p-4 px-8 ">{param.name}</td>
                  <td className="p-4 px-8 text-center">{param.type}</td>
                  <td className="p-4 px-8 text-right flex justify-end items-center">
                    <IoEyeOutline className="icon_style" onClick={() => handleValActive(param)} />
                    <span className="clr_fade">Default</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

SetUpParameters.propTypes = {
  handleValActive: PropTypes.any,
};

export default SetUpParameters;
