import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import SetUpParameters from "../../components/ManageParamsComps/SetUpParameters";
import ConditionsParameters from "../../components/ManageParamsComps/ConditionsParameters";
import { useState } from "react";
import ParametersValues from "../../components/ManageParamsComps/ParametersValues";

const ManageParams = () => {
  const navigate = useNavigate();
  // const users = useSelector((state) => state.user);
  let tokens = useSelector((state) => state.token) || localStorage.getItem("token");
  if (!tokens) {
    navigate("/");
  }
  tokens = tokens.replace(/"/g, "");
  const [step, setStep] = useState(1);
  const [isValActive, setIsValActive] = useState(false);
  const [seletedParam, setSelectedParam] = useState(null);

  const backTopParam = () => {
    setIsValActive(false);
    setSelectedParam(null);
  };

  const handleValActive = (val) => {
    setSelectedParam(val);
    setIsValActive(true);
  };

  return (
    <>
      {isValActive ? (
        <ParametersValues seletedParam={seletedParam} backTopParam={backTopParam} />
      ) : (
        <Layout title="Manage Parameters ">
          <div className="px-8 pb-7 bg-[#292929] rounded-lg">
            <div className="py-4 flex justify-start items-center">
              <button className={step === 1 ? "btn_style" : "btn_style2"} onClick={() => setStep(1)}>
                Set Up
              </button>
              <button className={step === 2 ? "btn_style" : "btn_style2"} onClick={() => setStep(2)}>
                Conditions
              </button>
            </div>
            {step === 1 && <SetUpParameters handleValActive={handleValActive} setIsValActive={setIsValActive} />}
            {step === 2 && <ConditionsParameters handleValActive={handleValActive} setIsValActive={setIsValActive} />}
          </div>
        </Layout>
      )}
    </>
  );
};

export default ManageParams;
